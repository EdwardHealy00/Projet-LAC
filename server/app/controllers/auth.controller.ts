import { CookieOptions, Router, Request, Response, NextFunction } from 'express';
import { UserService } from '@app/services/database/user.service';
import { EmailService } from '@app/services/email.service';
import Container, { Service } from 'typedi';
import { ACCESS_TOKEN_EXPIRES_IN } from '@app/constant/constant';
import { AnyZodObject, ZodError } from 'zod';
import { createUserSchema, loginUserSchema } from '@app/schemas/user.schema';
import { verifyJwt } from '@app/utils/jwt';
import AppError from '@app/utils/appError';

// Exclude this fields from the response
export const excludedFields = ['password'];


@Service()
export class AuthController {
    router: Router;

    constructor(private userService: UserService, private emailService: EmailService) { 
        this.configureRouter();
        this.userService = Container.get(UserService);
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.post('/register', this.middlewareValidate(createUserSchema), async (req: Request, res: Response, next: NextFunction) => {
            try {

                const fileProof = req.files && req.files.length > 0 ? req.files[0] : undefined;
                const userInfo = {
                    email: req.body.email,
                    lastName: req.body.lastName,
                    firstName: req.body.firstName,
                    password: req.body.password,
                    status: req.body.status,
                    school: req.body.school,
                    country: req.body.country,
                    city: req.body.city,
                }
                
                if (fileProof) {
                    userInfo["proof"] = fileProof;
                }
                
                const user = await this.userService.createUser(userInfo);
                if (!user) {
                    return next(new AppError('Error creating user', 500));
                }
                
                this.emailService.sendWelcomeEmail(user!.email!, user!.firstName! + ' ' + user!.lastName!);
                this.emailService.sendNewUserEmail();
                
                res.status(201).json({
                    status: 'success',
                    data: {
                        user,
                    },
                });
            } catch (err: any) {
                console.log(err);
                if (err.code === 11000) {
                    res.status(409).json({
                        status: 'fail',
                        error: 'Email already exists',
                    });
                }
                next(err);
            }
        });

        this.router.post('/login', this.middlewareValidate(loginUserSchema), async (req: Request, res: Response, next: NextFunction) => {
            try {
                // Get the user from the collection
                const user = await this.userService.findUser({ email: req.body.email });
                // Check if user exist and password is correct
                if (
                    !user ||
                    !(await user.comparePasswords(user.password, req.body.password))
                ) {
                    return next(new AppError('Invalid email or password', 401));
                }
                // Create an Access Token
                const accessToken = await this.userService.signToken(user!);
                // Cookie options 
                const accessTokenCookieOptions: CookieOptions = {
                    expires: new Date(
                        Date.now() + parseInt(ACCESS_TOKEN_EXPIRES_IN) * 60 * 1000
                    ),
                    maxAge: parseInt(ACCESS_TOKEN_EXPIRES_IN) * 60 * 1000,
                    //httpOnly: true,
                    sameSite: 'lax',
                };

                // Send Access Token in Cookie
                res.cookie('accessToken', accessToken.access_token, accessTokenCookieOptions);
                res.cookie('logged_in', true, {
                    ...accessTokenCookieOptions,
                    //httpOnly: true,
                });

                // Send Access Token
                res.status(200).json({
                    status: 'success',
                    name: user!.firstName + ' ' + user!.lastName,
                    role: user!.role,
                });
            } catch (err: any) {
                console.log(err);
                res.status(400).json({
                    status: 'fail',
                    message: 'Email already exist'
                });
            }
        });

        this.router.get('/logout', async (req: Request, res: Response, next: NextFunction) => {
            try {
                res.clearCookie('accessToken');
                res.clearCookie('logged_in');
                res.status(200).json({
                    status: 'success',
                    message: 'Logout success',
                });
            } catch (err: any) {
                console.log(err);
                res.status(400).json({
                    status: 'fail',
                    message: 'Logout fail',
                });
            }
        });

        this.router.post('/forgot-password', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const user = await this.userService.findUser({ email: req.body.email });
                if (!user) {
                    res.status(400).json({
                        status: 'fail',
                        message: 'User not found',
                    });
                }
                const resetToken = await this.userService.createResetToken(user!);

                res.cookie('accessToken', resetToken.reset_token, {
                    expires: new Date(Date.now() + 60 * 60 * 1000)
                });
                res.cookie('logged_in', false);

                this.emailService.sendResetPasswordEmail(user!.email, resetToken.reset_token);
                res.status(200).json({
                    status: 'success',
                    message: 'Email sent',
                });
            } catch (err: any) {
                console.log(err);
                res.status(400).json({
                    status: 'fail',
                    message: 'Email not sent',
                });
            }

        });

        this.router.post('/reset-password', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const decoded = verifyJwt<{ sub: string }>(req.body.reset_token);

                if (!decoded) {
                   return next(new AppError('Invalid token', 401));
                }

                const user = await this.userService.findUser({ _id: decoded!.sub });
                if (!user) {
                    return next(new AppError('User not found', 401));
                }

                await this.userService.updatePassword(user!, req.body.password);
                this.emailService.sendConfirmPasswordReset(user!.email);
                res.status(200).json({
                    status: 'success',
                    message: 'Password reset',
                });
            } catch (err: any) {
                console.log(err);
                res.status(400).json({
                    status: 'fail',
                    message: 'Password not reset',
                });
            }
        });
    }

    private middlewareValidate(schema: AnyZodObject) {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                schema.parse({
                    params: req.params,
                    query: req.query,
                    body: req.body,
                });

                return next();
            } catch (err: any) {
                console.log(err);
                if (err instanceof ZodError) {
                    return res.status(400).json({
                        status: 'fail',
                        error: err.errors,
                    });
                }
                return next(err);
            }
        };
    }
}
