import {NextFunction, Request, Response, Router} from 'express';
import { Service } from 'typedi';
import { CaseStudyService } from '@app/services/database/caseStudy.service';
import {Role} from "@app/models/Role";
import {verifyJwt} from "@app/utils/jwt";
import {UserService} from "@app/services/database/user.service";
import { CaseStep } from '@app/models/CaseStatus';
import { readFileSync } from "fs";
import countPages from "page-count";

export const excludedFields = ['_id', 'file', 'fieldName', 'encoding', 'mimetype', 'destination', 'filename', 'path', ];

@Service()
export class CaseStudyController {
    router: Router;

    constructor(private readonly userService: UserService, private readonly caseStudyService: CaseStudyService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();
        this.router.use(this.middlewareDeserializeUser.bind(this));


        this.router.get('/', this.middlewareRestrictTo(Role.Admin, Role.Deputy), async (req: Request, res: Response) => {
            try {
                const caseStudies = await this.caseStudyService.findAllCaseStudys();

                res.json(caseStudies);
            } catch (err: any) {
                console.log(err);
            }

        });

        this.router.get('/all-catalog', async (req: Request, res: Response) => {
            try {
                const caseStudies = await this.caseStudyService.findRestrictedCaseStudys();

                res.json(caseStudies);
            } catch (err: any) {
                console.log(err);
            }

        });

        this.router.get('/paid', this.middlewareRestrictTo(Role.Admin, Role.Deputy), async (req: Request, res: Response, next: NextFunction) => {
            try {
                const caseStudies = await this.caseStudyService.getAllPaidCaseStudies();

                res.json(caseStudies);
            } catch (err: any) {
                next(err);
            }

        });

        this.router.get('/catalog-paid', async (req: Request, res: Response) => {
            try {
                const caseStudies = await this.caseStudyService.getRestrictedPaidCaseStudies();

                res.json(caseStudies);
            } catch (err: any) {
                console.log(err);
            }

        });

        this.router.get('/authors', async (req: Request, res: Response) => {
            try {
                const caseStudyAuthors = await this.caseStudyService.findAllCaseStudyAuthors();
                res.json(caseStudyAuthors);
            } catch (err: any) {
                console.log(err);
            }
        });

        this.router.get('/:id', async (req: Request, res: Response) => {
            try {
                const caseStudy = await this.caseStudyService.findCaseStudyById(req.params.id);
                res.json(caseStudy);
            } catch (err: any) {
                console.log(err);
            }
        });

        this.router.get('/download/:filename', async (req: Request, res: Response) => {
            try {
                const caseStudyStream = await this.caseStudyService.getCaseStudyFile(req.params.filename);
                if (!caseStudyStream) {
                    res.status(404).json('Le fichier n\'a pas été trouvé');
                    return;
                }

                caseStudyStream.pipe(res);
            } catch (err: any) {
                console.log(err);
            }
        });

        this.router.post('/', this.middlewareRestrictTo(Role.Professor, Role.Deputy, Role.Admin), async (req: Request, res: Response) => {
            try {
                const caseStudy = req.body;
                caseStudy["isPaidCase"] = caseStudy["isPaidCase"] === 'true';
                let totalNbPages = 0;
                if (req.files) {
                    let files = [];
                    for (let i = 0; i < req.files.length; i++) {
                        const fileProof = req.files[i];
                        if (fileProof) {
                            files.push(fileProof);
                            const docxBuffer = readFileSync(fileProof.path);
                            totalNbPages += await countPages(docxBuffer, "docx");
                            this.caseStudyService.saveCaseStudyFile(fileProof.serverFileName);
                        }
                    }
                    caseStudy["files"] = files;
                }
                caseStudy["page"] = totalNbPages;
                const newCaseStudy = await this.caseStudyService.createCaseStudy(caseStudy);
                res.status(201).json(newCaseStudy);
            } catch (err: any) {
                console.log(err);
            }
        });

        this.router.post('/approvalResult', async (req: Request, res: Response) => {
            try {
                const caseStudyId = req.body.case;
                const isApproved = req.body.approved;
                const url = req.body.url;

                let caseStudy;
                if (isApproved) {
                    caseStudy = await this.caseStudyService.findCaseStudyById(caseStudyId);
                    if (!caseStudy) {
                        res.status(404).json('L\'étude de cas n\'a pas été trouvée');
                        return;
                    }
                    caseStudy.status += 1;

                    if (caseStudy.isPaidCase && caseStudy.status == CaseStep.Posted) {
                        caseStudy.url = url;
                    }
                    
                    await this.caseStudyService.updateCaseStudy(caseStudy);
                }
                res.status(200).json({
                    status: 'success',
                });
            } catch (err: any) {
                console.log(err);
            }
        });



    }
    private middlewareRestrictTo(...allowedRoles: string[]) {
        console.log('F')
        return (req: Request, res: Response, next: NextFunction) => {
            const user = res.locals.user;
            if (!user) {
                res.status(401).json(
                    'Authentication error'
                );
                return;
            }
            if (!allowedRoles.includes(user.role)) {
                res.status(403).json(
                    'You are not allowed to perform this action'
                );
                return;
            }

            next();
        };
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
                console.log('C');
                access_token = req.cookies.accessToken;
            }

            if (access_token) {
                // Validate Access Token
                const decoded = verifyJwt<{ sub: string, role: string }>(access_token);

                if (!decoded) {
                    res.status(401).json(
                        `Invalid token or user doesn't exist`
                    );
                    return;
                }

                // Check if user still exist
                const user = await this.userService.findUser({ _id: decoded!.sub });

                if (!user) {
                    res.status(401).json(
                        `User with that token no longer exist`
                    );
                    return;
                }

                if(user.role != decoded!.role) {
                    res.status(401).json(
                        `Role and user do not match`
                    );
                    return;
                }

                res.locals.user = user;
                console.log('A');
            }
            console.log('V');

            next();
        } catch (err: any) {
            next(err);
        }
    }


   /* private async middlewareRequireUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = res.locals.user;
            if (!user) {
                return next(`Invalid token or session has expired`);
            }

            next();
        } catch (err: any) {
            next(err);
        }
    }*/
}
