import { NextFunction, Request, Response, Router } from 'express';
import { RedisService } from '@app/services/redis.service';
import { verifyJwt } from '@app/utils/jwt';
import { UserService } from '@app/services/database/user.service';
import Container, { Service } from 'typedi';

@Service()
export class UserController {
    router: Router;

    constructor(private readonly userService: UserService, private readonly redisService: RedisService) {
        this.redisService = Container.get(RedisService);
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();
        
        this.router.use(this.middlewareDeserializeUser.bind(this), this.middlewareRequireUser);

        this.router.get('/me', async (req: Request, res: Response) => {
            try {
                const user = res.locals.user;
                res.status(200).json({
                    status: 'success',
                    data: {
                        user,
                    },
                });
            } catch (err: any) {
                console.log(err);
                res.status(500).json({
                    status: 'fail',
                    message: 'Internal server error',
                });
                //next(err);
            }
        });

        this.router.get('/', this.middlewareRestrictTo("admin") , async (req: Request, res: Response) => {
            try {
                const users = await this.userService.findAllUsers();
                res.status(200).json({
                    status: 'success',
                    result: users.length,
                    data: {
                        users,
                    },
                });
            } catch (err: any) {
                //next(err);
            }
        });
    }

    private async middlewareDeserializeUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Get the token
            let access_token;
            if (
                req.headers.authorization &&
                req.headers.authorization.startsWith('Bearer')
            ) {
                access_token = req.headers.authorization.split(' ')[1];
            } else if (req.cookies.access_token) {
                access_token = req.cookies.access_token;
            }

            if (!access_token) {
                return next('You are not logged in');
            }

            // Validate Access Token
            const decoded = verifyJwt<{ sub: string }>(access_token);

            if (!decoded) {
                return next(`Invalid token or user doesn't exist`);
            }

            // Check if user has a valid session
            const redisClient = this.redisService.getClient();
            const session = await redisClient.get(JSON.stringify(decoded.sub));

            if (!session) {
                //return;
                return next(`User session has expired`);
            }

            // Check if user still exist
            const user = await this.userService.findUserById(JSON.parse(session)._id);

            if (!user) {
                //return;
                return next(`User with that token no longer exist`);
            }

            // This is really important (Helps us know if the user is logged in from other controllers)
            // You can do: (req.user or res.locals.user)
            res.locals.user = user;

            next();
        } catch (err: any) {
            next(err);
        }
    }


    private async middlewareRequireUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = res.locals.user;
            if (!user) {
                //return;
                return next(`Invalid token or session has expired`);
            }

            next();
        } catch (err: any) {
            next(err);
        }
    }

    private middlewareRestrictTo(...allowedRoles: string[]) {
       return (req: Request, res: Response, next: NextFunction) => {
            const user = res.locals.user;
            if (!allowedRoles.includes(user.role)) {
                return next('You are not allowed to perform this action'
                    //new AppError('You are not allowed to perform this action', 403)
                );
            }

            next();
        };
    }
}
