import { CookieOptions, Router, Request, Response, NextFunction } from 'express';
import { UserService } from '@app/services/database/user.service';
import Container, { Service } from 'typedi';
import { ACCESS_TOKEN_EXPIRES_IN } from '@app/constant/constant';
//import { User } from '@app/models/user.model';
import { AnyZodObject, ZodError } from 'zod';
import { createUserSchema, loginUserSchema } from '@app/schemas/user.schema';

// import AppError from '../utils/appError';

// Exclude this fields from the response
export const excludedFields = ['password'];


@Service()
export class AuthController {
    router: Router;

    constructor(private userService: UserService) { 
        this.configureRouter();
        this.userService = Container.get(UserService);
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.post('/register', this.middlewareValidate(createUserSchema) , async (req: Request, res: Response) => {
            try {
                const user = await this.userService.createUser({
                    email: req.body.email,
                    name: req.body.name,
                    password: req.body.password,
                });

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
                        message: 'Email already exist',
                    });
                }
                res.status(400).json({
                    status: 'fail',
                    message: 'Email already exist'});
                //next(err);
            }
        });

        this.router.post('/login', this.middlewareValidate(loginUserSchema), async (req: Request, res: Response) => {
            try {
                // Get the user from the collection
                const user = await this.userService.findUser({ email: req.body.email });
                // Check if user exist and password is correct
                if (
                    !user ||
                    !(await user.comparePasswords(user.password, req.body.password))
                ) {
                    //return next(new AppError('Invalid email or password', 401));
                    res.status(400).json({
                        status: 'fail',
                        message: 'Invalid email or password'
                    });
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
                    name: user!.name,
                    role: user!.role,
                });
            } catch (err: any) {
                //next(err);
                console.log(err);
                res.status(400).json({
                    status: 'fail',
                    message: 'Email already exist'
                });
            }
        });

        this.router.get('/logout', async (req: Request, res: Response) => {
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
