import { NextFunction, Request, Response, Router } from 'express';
import { verifyJwt } from '@app/utils/jwt';
import { UserService } from '@app/services/database/user.service';
import { Service } from 'typedi';
import { Role } from '@app/models/Role';
import { EmailService } from '@app/services/email.service';

@Service()
export class UserController {
    router: Router;

    constructor(private readonly userService: UserService, private readonly emailService: EmailService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.use(this.middlewareDeserializeUser.bind(this));
        this.router.use(this.middlewareRequireUser.bind(this));

        // this.router.get('/me', async (req: Request, res: Response, next: NextFunction) => {
        //     try {
        //         const user = res.locals.user;
        //         res.status(200).json({
        //             status: 'success',
        //             data: {
        //                 user,
        //             },
        //         });
        //     } catch (err: any) {
        //         console.log(err);
        //         next(err);
        //     }
        // });

        this.router.get('/', this.middlewareRestrictTo(Role.Admin), async (req: Request, res: Response, next: NextFunction) => {
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
                console.log(err);
                next(err);
            }
        });

        this.router.get('/approval', this.middlewareRestrictTo(Role.Admin, Role.Deputy), async (req: Request, res: Response, next: NextFunction) => {

            try {
                const users = await this.userService.findUsers({ role: Role.ProfessorNotApproved });

                res.status(200).json({
                    status: 'success',
                    result: users.length,
                    data: {
                        users,
                    },
                });
            } catch (err: any) {
                console.log(err);
                next(err);
            }
        });

        this.router.get('/proof/:email', this.middlewareRestrictTo(Role.Admin, Role.Deputy), async (req: Request, res: Response, next: NextFunction) => {
            try {
                const user = await this.userService.findUser({ email: req.params.email });
                if (!user) {
                    res.status(404).json('Utilisateur introuvable');
                    return;
                }
                const proof = user.proof;
                if (!proof) {
                    res.status(401).json('Preuve introuvable');
                    return;
                }
                res.sendFile(proof.filename, { root: './proofUploads' });
            } catch (err: any) {
                console.log(err);
                next(err);
            }
        });

        this.router.post('/approvalResult', this.middlewareRestrictTo(Role.Admin, Role.Deputy), async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { email, approved } = req.body;
                const user = await this.userService.findUserWithoutPassword({ email: email });
                if (!user) {
                    res.status(404).json('Utilisateur introuvable');
                    return;
                }

                user.role = approved ? Role.Professor : Role.Student;
                await this.userService.updateUser(user);
                this.emailService.sendApprovalResultToTeacher(user!.email, approved);
                res.status(200).json({
                    status: 'success',
                });
            } catch (err: any) {
                console.log(err);
                next(err);
            }
        });
    }

    private async middlewareDeserializeUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Get the token
            let access_token;

            if ( //TODO: WHY
                req.headers.authorization &&
                req.headers.authorization.startsWith('Bearer')
            ) {
                access_token = req.headers.authorization.split(' ')[1];
            } else if (req.cookies.accessToken) {
                access_token = req.cookies.accessToken;
                console.log(access_token);
            }

            if (!access_token) {
                res.status(401).json(
                    "Vous n'êtes pas connecté"
                );
                return;
            }

            // Validate Access Token
            const decoded = verifyJwt<{ sub: string, role: string }>(access_token);

            if (!decoded) {
                res.status(401).json(
                    `Jeton invalide ou bien l'utilisateur est inexistant`
                );
                return;
            }

            // Check if user still exist
            const user = await this.userService.findUser({ _id: decoded!.sub });

            if (!user) {
                res.status(401).json(
                    `L'utilisateur avec ce jeton n'existe plus`
                );
                return;
            }

            if(user.role != decoded!.role) {
                //console.log('ca va pas bien');
                res.status(401).json(
                    `Le rôle et l'utilisateur ne correspondent pas`
                );
                return;
            }
           // console.log('ca va bien');
            //console.log(user.role);
            //console.log(decoded!.role);

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
                return next(`Jeton invalide ou bien la session a expiré`);
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
                res.status(403).json(
                    "Vous n'êtes pas authorisé à effectuer cette action"
                );
                return;
            }

            next();
        };
    }
}
