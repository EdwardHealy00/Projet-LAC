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
                    email: req.body.email.toLowerCase(),
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
                        status: "Il est impossible de créer ce type d'identifiants à partir de ce formulaire. Cet incident sera reporté."
                    });
                    return;
                }

                const user = await this.userService.createUser(userInfo);
                if (!user) {
                    res.status(500).json("Une erreur est survenue en créant l'utilisateur");
                    return;
                }

                this.emailService.sendWelcomeEmail(user!.email!, user!.firstName! + ' ' + user!.lastName!, user!.role!);

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
                res.status(409).json(
                    "Un compte est déjà associé à cette adresse courriel"
                );
            }
        });

        this.router.post('/login', this.middlewareValidate(loginUserSchema), async (req: Request, res: Response, next: NextFunction) => {
            try {
                // Get the user from the collection
                const user = await this.userService.findUser({ email: req.body.email.toLowerCase() });
                // Check if user exist and password is correct
                if (
                    !user ||
                    !(await user.comparePasswords(user.password, req.body.password))
                ) {
                    res.status(401).json('Les identifiants fournis sont incorrects');
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
                    'Une erreur est survenue');
            }
        });

        this.router.get('/logout', async (req: Request, res: Response, next: NextFunction) => {
            try {
                res.clearCookie('accessToken');
                res.status(200).json(
                    'Déconnexion'
                );
            } catch (err: any) {
                console.log(err);
                res.status(400).json(
                    'Déconnexion échouée');
            }
        });

        this.router.post('/forgot-password', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const user = await this.userService.findUser({ email: req.body.email });
                if (!user) {
                    res.status(400).json(
                        'Utilisateur introuvable',
                    );
                }
                const resetToken = await this.userService.createResetToken(user!);

                res.cookie('accessToken', resetToken.reset_token, {
                    expires: new Date(Date.now() + 60 * 60 * 1000)
                });

                this.emailService.sendResetPasswordEmail(user!.email, resetToken.reset_token);
                res.status(200).json(
                    'Courriel envoyé avec succès'
                );
            } catch (err: any) {
                console.log(err);
                res.status(400).json(
                    "Une erreur est survenue dans l'envoi du courriel"
                );
            }

        });

        this.router.post('/reset-password', this.middlewareValidate(updatePasswordSchema), async (req: Request, res: Response, next: NextFunction) => {
            try {
                const decoded = verifyJwt<{ sub: string }>(req.body.reset_token);

                if (!decoded) {
                    res.status(401).json('La demande de réinitalisation a expiré');
                    return;
                }

                const user = await this.userService.findUser({ _id: decoded!.sub });
                if (!user) {
                    res.status(401).json('Utilisateur introuvable');
                    return;
                }

                await this.userService.updatePassword(user!, req.body.password);
                this.emailService.sendConfirmPasswordReset(user!.email);
                res.status(200).json('Mot de passe réinitialisé avec succès',
                );
            } catch (err: any) {
                console.log(err);
                res.status(400).json(
                    'Une erreur est survenue',
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
                if (err instanceof ZodError && err.errors[0]) {
                    return res.status(401).json(err.errors[0].message); 
                } 
                return res.status(401).json("Une erreur est survenue: " + err);
            }
        };
    }
}
