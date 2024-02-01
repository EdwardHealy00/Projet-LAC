import { NextFunction, Request, Response, Router } from 'express';
import { verifyJwt } from '@app/utils/jwt';
import { UserService } from '@app/services/database/user.service';
import { Service } from 'typedi';
import { Role } from '@app/models/Role';
import { EmailService } from '@app/services/email.service';
import { logError, logErrorNoAccount, logInfo } from '@app/utils/logs';

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

        this.router.get('/me', async (req: Request, res: Response, next: NextFunction) => {
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
                next(err);
            }
        });

        this.router.get('/', this.middlewareRestrictTo(Role.Admin), async (req: Request, res: Response, next: NextFunction) => {
            try {
                const users = await this.userService.findAllUsers();

                logInfo(res.locals.user, "Successfully get all users")
                res.status(200).json({
                    status: 'success',
                    result: users.length,
                    data: {
                        users,
                    },
                });
            } catch (err: any) {
                logError(res.locals.user, err.name, "Error while getting all users")
                console.log(err);
                next(err);
            }
        });

        this.router.get('/', this.middlewareRestrictTo(Role.Admin), async (req: Request, res: Response, next: NextFunction) => {
            try {
                const users = await this.userService.findAllUsers();

                logInfo(res.locals.user, "Successfully get all users")
                res.status(200).json({
                    status: 'success',
                    result: users.length,
                    data: {
                        users,
                    },
                });
            } catch (err: any) {
                logError(res.locals.user, err.name, "Error while getting all users")
                console.log(err);
                next(err);
            }
        });

        this.router.get("/committeeMembers", this.middlewareRestrictTo(Role.Admin, Role.ComityDirector), async (req: Request, res: Response, next: NextFunction) => {
            try {
                // Get info of all committee members
                const users = await this.userService.findUsers({ role: 'comity' }, 'firstName lastName email');

                logInfo(res.locals.user, "Successfully get all reviewers");
                res.status(200).json({
                    status: "success",
                    result: users.length,
                    data: {
                        users,
                    },
                });
                } catch (err: any) {
                logError(
                    res.locals.user,
                    err.name,
                    "Error while getting all reviewers"
                );
                console.log(err);
                next(err);
                }
            }
        );

        this.router.get('/approval', this.middlewareRestrictTo(Role.Admin, Role.Deputy), async (req: Request, res: Response, next: NextFunction) => {

            try {
                const users = await this.userService.findUsers({ role: Role.ProfessorNotApproved });

                logInfo(res.locals.user, "Successfully got all pending professors")
                res.status(200).json({
                    status: 'success',
                    result: users.length,
                    data: {
                        users,
                    },
                });
            } catch (err: any) {
                logError(res.locals.user, err.name, "Error while getting all pending professors")
                console.log(err);
                next(err);
            }
        });

        this.router.get('/approvalMembers', this.middlewareRestrictTo(Role.Admin, Role.ComityDirector), async (req: Request, res: Response, next: NextFunction) => {

            try {
                const users = await this.userService.findUsers({ role: Role.ComityNotApproved });

                logInfo(res.locals.user, "Successfully got all pending members")
                res.status(200).json({
                    status: 'success',
                    result: users.length,
                    data: {
                        users,
                    },
                });
            } catch (err: any) {
                logError(res.locals.user, err.name, "Error while getting all pending members")
                console.log(err);
                next(err);
            }
        });

        this.router.get('/proof/:email', this.middlewareRestrictTo(Role.Admin, Role.Deputy), async (req: Request, res: Response, next: NextFunction) => {
            try {
                const user = await this.userService.findUser({ email: req.params.email });
                if (!user) {
                    logError(res.locals.user, "404", "user not found")
                    res.status(404).json('Utilisateur introuvable');
                    return;
                }
                const proof = user.proof;
                if (!proof) {
                    logError(res.locals.user, "404", "Proof not found")
                    res.status(401).json('Preuve introuvable');
                    return;
                }

                logInfo(res.locals.user, "Successfully got proof")
                res.sendFile(proof.filename, { root: './proofUploads' });
            } catch (err: any) {
                logError(res.locals.user, err.name, "Error while getting proof")
                next(err);
            }
        });

        this.router.post('/proof', this.middlewareRestrictTo(Role.ProfessorNotApproved), async (req: Request, res: Response, next: NextFunction) => {
            try {
                const user = res.locals.user;
                const fileProof = req.files && req.files.length > 0 ? req.files[0] : undefined;
                if (!user) {
                    logError(res.locals.user, "404", "user not found")
                    res.status(404).json('Utilisateur introuvable');
                    return;
                }
                if(!fileProof) {
                    logError(res.locals.user, "404", "proof not found")
                    res.status(404).json('Preuve introuvable');
                    return;
                }

                user.proof = fileProof;
                await this.userService.updateUser(user);

         
                this.emailService.sendNewUserEmail(user.email);

                logInfo(res.locals.user, "Successfully updated proof")
                res.status(200).json({
                    status: 'success',
                });
            } catch (err: any) {
                logError(res.locals.user, err.name, "Error while updating proof")
                next(err);
            }
        });

        this.router.post('/approvalResult', this.middlewareRestrictTo(Role.Admin, Role.Deputy), async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { email, approved } = req.body;
                const user = await this.userService.findUserWithoutPassword({ email: email });
                if (!user) {
                    logError(res.locals.user, "404", "user not found")
                    res.status(404).json('Utilisateur introuvable');
                    return;
                }

                if(user.role !== Role.ProfessorNotApproved) {
                    logError(res.locals.user, "422", "User is not a pending teacher")
                    res.status(404).json('L\'utilisateur n\'est pas un professeur en attente');
                    return;
                }

                if(approved) {
                    user.role = Role.Professor;
                } else {
                    user.proof = null;
                }

                await this.userService.updateUser(user);
                this.emailService.sendApprovalResultToTeacher(user!.email, user!.firstName! + ' ' + user!.lastName!, approved);

                logInfo(res.locals.user, "Successfully sent approval to teacher with answer:" + approved)
                res.status(200).json({
                    status: 'success',
                });
            } catch (err: any) {
                logError(res.locals.user, err.name, "Error while sending approval")
                next(err);
            }
        });

        this.router.post('/approvalResultMember', this.middlewareRestrictTo(Role.Admin, Role.ComityDirector), async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { email, approved } = req.body;
                const user = await this.userService.findUserWithoutPassword({ email: email });
                if (!user) {
                    logError(res.locals.user, "404", "user not found")
                    res.status(404).json('Utilisateur introuvable');
                    return;
                }

                if(user.role !== Role.ComityNotApproved) {
                    logError(res.locals.user, "422", "User is not a pending member")
                    res.status(404).json('L\'utilisateur n\'est pas un membre en attente');
                    return;
                }

                if(approved) {
                    user.role = Role.Comity;
                } else {
                    user.role = Role.Student;
                }

                await this.userService.updateUser(user);
                this.emailService.sendApprovalResultToMember(user!.email, user!.firstName! + ' ' + user!.lastName!, approved);

                logInfo(res.locals.user, "Successfully sent approval to member with answer:" + approved)
                res.status(200).json({
                    status: 'success',
                });
            } catch (err: any) {
                logError(res.locals.user, err.name, "Error while sending approval")
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
                //console.log(access_token);
            }

            if (!access_token) {
                logErrorNoAccount("401", "User is not logged in")
                res.status(401).json(
                    "Vous n'êtes pas connecté"
                );
                return;
            }

            // Validate Access Token
            const decoded = verifyJwt<{ sub: string, role: string }>(access_token);

            if (!decoded) {
                logErrorNoAccount("401", "Invalid token or user doesn't exist")
                res.status(401).json(
                    `Jeton invalide ou bien l'utilisateur est inexistant`
                );
                return;
            }

            // Check if user still exist
            const user = await this.userService.findUser({ _id: decoded!.sub });

            if (!user) {
                logErrorNoAccount("401", "User with that token no longer exist")
                res.status(401).json(
                    `L'utilisateur avec ce jeton n'existe plus`
                );
                return;
            }

            if(user.role != decoded!.role) {
                //console.log('ca va pas bien');
                logErrorNoAccount("401", "Role and user do not match")
                res.status(401).json(
                    `Le rôle et l'utilisateur ne correspondent pas`
                );
                return;
            }
            //console.log('ca va bien');
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
                logError(res.locals.user, "403", "User is not allowed to perform this action")
                res.status(403).json(
                    "Vous n'êtes pas authorisé à effectuer cette action"
                );
                return;
            }

            next();
        };
    }
}
