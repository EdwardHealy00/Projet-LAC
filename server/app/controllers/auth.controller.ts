import { CookieOptions, Router, Request, Response, NextFunction } from 'express';
import { UserService } from '@app/services/database/user.service';
import { EmailService } from '@app/services/email.service';
import Container, { Service } from 'typedi';
import { ACCESS_TOKEN_EXPIRES_IN } from '@app/constant/constant';
import { AnyZodObject, ZodError } from 'zod';
import { createUserSchema, loginUserSchema, updatePasswordSchema } from '@app/schemas/user.schema';
import { verifyJwt } from '@app/utils/jwt';
import {Role} from "@app/models/Role";

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
                    role: req.body.role,
                    school: req.body.school,
                    country: req.body.country,
                    city: req.body.city,
                }

                if (fileProof && userInfo.role == Role.ProfessorNotApproved) {
                    userInfo["proof"] = fileProof;
                }

                if (userInfo.role != Role.Student && userInfo.role != Role.ProfessorNotApproved) {
                    res.status(422).json({
                        status: 'It is not possible to create this type of account from the signup form. This will be reported.'
                    });
                    return;
                }

                const user = await this.userService.createUser(userInfo);
                if (!user) {
                    res.status(500).json('Error creating user');
                    return;
                }

                this.emailService.sendWelcomeEmail(user!.email!, user!.firstName! + ' ' + user!.lastName!);

                if(user.role && userInfo.role == Role.ProfessorNotApproved) {
                    const deputies = await this.userService.findUsers({ role: Role.Deputy });
                    this.emailService.sendNewUserEmail(deputies);
                }

                res.status(201).json({
                    status: 'success',
                    data: {
                        user,
                    },
                });
            } catch (err: any) {
                console.log(err);
                //if (err.code === 11000) {
                    res.status(409).json(
                        'Email already exists'
                    );
                //}
                //next(err);
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
                    res.status(401).json('Invalid email or password');
                    return;
                }
                // Create an Access Token
                const accessToken = await this.userService.signToken(user!);
                // Cookie options 
                const accessTokenCookieOptions: CookieOptions = {
                    expires: new Date(
                        Date.now() + parseInt(ACCESS_TOKEN_EXPIRES_IN) * 60 * 1000
                    ),
                    maxAge: parseInt(ACCESS_TOKEN_EXPIRES_IN) * 60 * 1000,
                    secure: true,
                    sameSite: 'none',
                };

                // Send Access Token in Cookie
                res.cookie('accessToken', accessToken.access_token, accessTokenCookieOptions);
                res.cookie('logged_in', true, {
                    ...accessTokenCookieOptions,
                });

                // Send Access Token
                res.status(200).json({
                    status: 'success',
                    name: user!.firstName + ' ' + user!.lastName,
                    role: user!.role,
                    email: user!.email,
                });
            } catch (err: any) {
                console.log(err);
                res.status(400).json(
                    'Email already exist');
            }
        });

        this.router.get('/logout', async (req: Request, res: Response, next: NextFunction) => {
            try {
                res.clearCookie('accessToken');
                res.clearCookie('logged_in');
                res.status(200).json(
                    'Logout success'
                );
            } catch (err: any) {
                console.log(err);
                res.status(400).json(
                    'Logout fail');
            }
        });

        this.router.post('/forgot-password', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const user = await this.userService.findUser({ email: req.body.email });
                if (!user) {
                    res.status(400).json(
                        'User not found',
                    );
                }
                const resetToken = await this.userService.createResetToken(user!);

                res.cookie('accessToken', resetToken.reset_token, {
                    expires: new Date(Date.now() + 60 * 60 * 1000)
                });
                res.cookie('logged_in', false);

                this.emailService.sendResetPasswordEmail(user!.email, resetToken.reset_token);
                res.status(200).json(
                    'Email sent'
                );
            } catch (err: any) {
                console.log(err);
                res.status(400).json(
                    'Email not sent'
                );
            }

        });

        this.router.post('/reset-password', this.middlewareValidate(updatePasswordSchema), async (req: Request, res: Response, next: NextFunction) => {
            try {
                const decoded = verifyJwt<{ sub: string }>(req.body.reset_token);

                if (!decoded) {
                    res.status(401).json('Invalid token');
                    return;
                }

                const user = await this.userService.findUser({ _id: decoded!.sub });
                if (!user) {
                    res.status(401).json('User not found');
                    return;
                }

                await this.userService.updatePassword(user!, req.body.password);
                this.emailService.sendConfirmPasswordReset(user!.email);
                res.status(200).json('Password reset',
                );
            } catch (err: any) {
                console.log(err);
                res.status(400).json(
                    'Password not reset',
                );
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
                    return res.status(400).json("Il y a une erreur dans le formulaire");
                }
                return next(err);
            }
        };
    }
}
