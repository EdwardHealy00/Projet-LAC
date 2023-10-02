import {NextFunction, Request, Response, Router} from 'express';
import { Service } from 'typedi';
import { CaseStudyService } from '@app/services/database/caseStudy.service';
import { EmailService } from '@app/services/email.service';
import {Role} from "@app/models/Role";
import {Criteria} from "@app/models/Criteria";
import {verifyJwt} from "@app/utils/jwt";
import {UserService} from "@app/services/database/user.service";
import { CaseStep } from '@app/models/CaseStatus';
import { MAX_FILES_PER_CASE } from '@app/constant/constant';
import { ComityMemberReview } from '@app/models/ComityMemberReview';
import { ApprovalDecision } from '@app/models/ApprovalDecision';

export const excludedFields = ['_id', 'file', 'fieldName', 'encoding', 'mimetype', 'destination', 'filename', 'path', ];

@Service()
export class CaseStudyController {
    router: Router;

    constructor(private readonly userService: UserService, private readonly caseStudyService: CaseStudyService, private readonly emailService: EmailService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();
        this.router.use(this.middlewareDeserializeUser.bind(this));


        this.router.get('/', this.middlewareRestrictTo(Role.Admin, Role.Deputy, Role.ComityDirector), async (req: Request, res: Response) => {
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

        this.router.get('/paid', this.middlewareRestrictTo(Role.Admin, Role.Deputy, Role.Comity, Role.ComityDirector), async (req: Request, res: Response, next: NextFunction) => {
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

                if (!caseStudy) {
                    res.status(404).json('L\'étude de cas n\'a pas été trouvée');
                    return;
                }
                if(!res.locals.user && caseStudy.status != CaseStep.Posted) {
                    res.status(401).json("Authentication error");
                    return;
                }
                
                const role = res.locals.user.role;
                const isNotPrivileged = role === Role.Professor || role === Role.ProfessorNotApproved || role === Role.Student;
                if(isNotPrivileged && caseStudy.status != CaseStep.Posted && res.locals.user.email !== caseStudy.submitter) {
                    res.status(403).json('Il est interdit de consulter une étude de cas en cours d\'évaluation déposée par un autre utilisateur');
                    return;
                }

                res.json(caseStudy);
            } catch (err: any) {
                console.log(err);
            }
        });

        this.router.get('/user/:email', this.middlewareRestrictTo(Role.Professor, Role.Admin), async (req: Request, res: Response) => {
            try {
                const caseStudies = await this.caseStudyService.findAllMyCaseStudies(req.params.email);

                res.json(caseStudies);
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

        this.router.delete('/deleteFile/:filename', this.middlewareRestrictTo(Role.Professor, Role.Admin), async (req: Request, res: Response) => {
            try {
                var isSuccessful = await this.caseStudyService.deleteCaseStudyFile(req.params.filename);
                if (!isSuccessful) {
                    res.status(404).json('Le fichier ' + req.params.filename+  ' n\'a pas pu être supprimé');
                    return;
                }
                if(req.body.caseStudy.approvalDecision == ApprovalDecision.PENDING) {
                    res.status(405).json('Il est interdit de modifier une étude de cas en cours d\'évaluation');
                    return;
                }
                if(res.locals.user.email !== req.body.caseStudy.submitter) {
                    res.status(405).json('Il est interdit de modifier une étude de cas déposée par un autre utilisateur');
                    return;
                }
                
                res.status(200).json({
                    status: 'success',
                });
            } catch (err: any) {
                console.log(err);
            }
        });

        this.router.patch('/removeFileRefs/:id', this.middlewareRestrictTo(Role.Professor, Role.Admin), async (req: Request, res: Response) => {
            try {
                const caseStudyId = req.params.id;
                let caseStudy = await this.caseStudyService.findCaseStudyById(caseStudyId);

                if (!caseStudy) {
                    res.status(404).json('L\'étude de cas n\'a pas été trouvée');
                    return;
                }
                if (caseStudy.approvalDecision == ApprovalDecision.PENDING) {
                    res.status(405).json('Il est interdit de modifier une étude de cas en cours d\'évaluation');
                    return;
                }
                if(res.locals.user.email !== caseStudy.submitter) {
                    res.status(405).json('Il est interdit de modifier une étude de cas déposée par un autre utilisateur');
                    return;
                }

                caseStudy.files = req.body.files;

                await this.caseStudyService.updateCaseStudy(caseStudy);
                res.status(200).json({
                    status: 'success',
                });
            } catch (err: any) {
                console.log(err);
            }
        });

        this.router.patch('/addFileRefs/:id', this.middlewareRestrictTo(Role.Professor, Role.Admin), async (req: Request, res: Response) => {
            try {
                const caseStudyId = req.params.id;
                let caseStudy = await this.caseStudyService.findCaseStudyById(caseStudyId);

                if (!caseStudy) {
                    res.status(404).json('L\'étude de cas n\'a pas été trouvée');
                    return;
                }
                if (caseStudy.approvalDecision == ApprovalDecision.PENDING) {
                    res.status(405).json('Il est interdit de modifier une étude de cas en cours d\'évaluation');
                    return;
                }
                if(res.locals.user.email !== caseStudy.submitter) {
                    res.status(405).json('Il est interdit de modifier une étude de cas déposée par un autre utilisateur');
                    return;
                }

                if (req.files) {
                    if(req.files.length + caseStudy.files.length > MAX_FILES_PER_CASE) {
                        res.status(405).json(`Il est interdit d\'inclure plus de ${MAX_FILES_PER_CASE} documents dans une étude de cas`);
                        return;
                    }

                    let newFiles = [];
                    for (let i = 0; i < req.files.length; i++) {
                        const fileProof = req.files[i];
                        if (fileProof) {
                            fileProof.date = new Date().toISOString();
                            fileProof.originalname = Buffer.from(fileProof.originalname, 'latin1').toString('utf8');
                            fileProof.pages = await countNumberPages(fileProof.path);
                            newFiles.push(fileProof);
                            this.caseStudyService.saveCaseStudyFile(fileProof.serverFileName);
                        }
                    }
                    caseStudy.files = [...caseStudy.files.concat(newFiles)];
                }

                await this.caseStudyService.updateCaseStudy(caseStudy);
                
                res.status(200).json({
                    status: 'success',
                });
            } catch (err: any) {
                console.log(err);
            }
        });

        this.router.patch('/convertToFree/:id', this.middlewareRestrictTo(Role.Professor, Role.Admin), async (req: Request, res: Response) => {
            try {
                const caseStudyId = req.params.id;
                let caseStudy = await this.caseStudyService.findCaseStudyById(caseStudyId);

                if (!caseStudy) {
                    res.status(404).json('L\'étude de cas n\'a pas été trouvée');
                    return;
                }
                if (caseStudy.approvalDecision == ApprovalDecision.PENDING) {
                    res.status(405).json('Il est interdit de modifier une étude de cas en cours d\'évaluation');
                    return;
                }
                if(res.locals.user.email !== caseStudy.submitter) {
                    res.status(405).json('Il est interdit de modifier une étude de cas déposée par un autre utilisateur');
                    return;
                }

                caseStudy.isPaidCase = false;
                await this.caseStudyService.updateCaseStudy(caseStudy);
                
                res.status(200).json({
                    status: 'success',
                });
            } catch (err: any) {
                console.log(err);
            }
        });

        this.router.patch('/resubmit/:id', this.middlewareRestrictTo(Role.Professor, Role.Admin), async (req: Request, res: Response) => {
            try {
                const caseStudyId = req.params.id;
                let caseStudy = await this.caseStudyService.findCaseStudyById(caseStudyId);

                if (!caseStudy) {
                    res.status(404).json('L\'étude de cas n\'a pas été trouvée');
                    return;
                }
                if(res.locals.user.email !== caseStudy.submitter) {
                    res.status(405).json('Il est interdit de modifier une étude de cas déposée par un autre utilisateur');
                    return;
                }
                
                let totalNbPages = 0;
                for (let i = 0; i < caseStudy.files.length; i++) {
                    if(caseStudy.files[i].pages) {
                        totalNbPages += caseStudy.files[i].pages;
                    }
                }

                caseStudy.page = totalNbPages;
                caseStudy.approvalDecision = ApprovalDecision.PENDING;

                if (caseStudy.status == CaseStep.WaitingComity) {
                    caseStudy.status = CaseStep.WaitingPreApproval;
                }

                await this.caseStudyService.updateCaseStudy(caseStudy);

                const deputies = await this.userService.findUsers({ role: Role.Deputy });
                this.emailService.sendPreApprovalNeededToDeputies(deputies, caseStudy, true);

                res.status(200).json({
                    status: 'success',
                });
            } catch (err: any) {
                console.log(err);
            }
        });
        

        this.router.post('/', this.middlewareRestrictTo(Role.Professor, Role.Deputy, Role.Admin), async (req: Request, res: Response) => {
            try {
                const caseStudy = req.body;
                caseStudy["isPaidCase"] = caseStudy["isPaidCase"] === 'true';
                if (req.files) {
                    if(req.files.length > MAX_FILES_PER_CASE) {
                        res.status(415).json('L\'étude de cas doit avoir un maximum de 3 documents');
                        return;
                    }

                    const ret = await this.parseAndSaveFiles(req.files);

                    if(!ret || !validateFilesType(req.files)) {
                        res.status(415).json('L\'étude de cas doit être en format .docx');
                        return;
                    }

                    caseStudy["files"] = ret.parsedFiles;
                    caseStudy["page"] = ret.totalNbPages;
                }
                else{
                    res.status(415).json('L\'étude de cas doit avoir un minimum de 1 document');
                        return;
                }

                const newCaseStudy = await this.caseStudyService.createCaseStudy(caseStudy);

                const deputies = await this.userService.findUsers({ role: Role.Deputy });
                this.emailService.sendPreApprovalNeededToDeputies(deputies, newCaseStudy, false);

                res.status(201).json(newCaseStudy);
            } catch (err: any) {
                console.log(err);
            }
        });

        this.router.post('/approvalResult', this.middlewareRestrictTo(Role.Deputy, Role.ComityDirector, Role.Admin), async (req: Request, res: Response) => {
            try {
                const caseStudyId = req.body.case;
                const isApproved = req.body.approved;
                const failedCriterias = req.body.failedCriterias;
                const url = req.body.url;

                let caseStudy = await this.caseStudyService.findCaseStudyById(caseStudyId);

                if (!caseStudy) {
                    res.status(404).json('L\'étude de cas n\'a pas été trouvée');
                    return;
                }

                if(caseStudy.status == CaseStep.WaitingPreApproval) {
                    let writtenCriterias: string[] = [];
                    for(var criteriaIndex of failedCriterias) {
                        writtenCriterias.push(Criteria[criteriaIndex]);
                    }
                    this.emailService.sendPreApprovalResultToUser(caseStudy.submitter, caseStudy, isApproved, writtenCriterias)
                    
                    if(isApproved) {
                        const directors = await this.userService.findUsers({ role: Role.ComityDirector });
                        this.emailService.sendReviewNeededToDirector(directors, caseStudy);
                    }
                }

                if(caseStudy.status == CaseStep.WaitingCatalogue && isApproved) {
                    if (caseStudy.isPaidCase) {
                        caseStudy.url = url;
                    }
                    // Delete review files once published and main files if paid case
                    await this.caseStudyService.deleteFilesForCaseStudy(caseStudy, caseStudy.isPaidCase); 

                    this.emailService.sendNotifyCaseStudyPublishedToUser(caseStudy.submitter, caseStudy);
                }

                if (isApproved) {
                    caseStudy.status++; 
                } else {
                    caseStudy.approvalDecision = ApprovalDecision.REJECT;
                }
                await this.caseStudyService.updateCaseStudy(caseStudy);
                res.status(200).json({
                    status: 'success',
                });
            } catch (err: any) {
                console.log(err);
            }
        });

        this.router.post('/comityMemberReview/:id', this.middlewareRestrictTo(Role.Comity, Role.Admin), async (req: Request, res: Response) => {
            try {
                const caseStudyId = req.params.id;
                const review = req.body;
                const feedback = JSON.parse(review["feedback"]);
                const decision = parseInt(review["decision"]);
                const reviewerEmail = res.locals.user.email; 

                let caseStudy = await this.caseStudyService.findCaseStudyById(caseStudyId);

                if (!caseStudy) {
                    res.status(404).json('L\'étude de cas n\'a pas été trouvée');
                    return;
                }

                if(caseStudy.status != CaseStep.WaitingComity) {
                    res.status(403).json('L\'étude de cas ne peut pas être évalué dans son statut actuel');
                    return;
                }

                if(caseStudy.reviewGroups[caseStudy.version].comityMemberReviews.find(
                    (review) => review.reviewAuthor === reviewerEmail
                  ) !== undefined) {
                    res.status(409).json('L\'étude de cas a déjà été évalué par cet utilisateur');
                    return;
                }

                for(const criteria of feedback) {
                    if(criteria.criteria === "Autre") continue;
                    if(criteria.ratings === "" || criteria.comments == "") {
                        res.status(400).json('Certains critères n\'ont pas été notés ou commentés');
                        return;
                    }
                }

                const comityMemberReview: ComityMemberReview = {
                    reviewAuthor: reviewerEmail,
                    caseFeedback: feedback,
                    decision: decision,
                };

                const ret = await this.parseAndSaveFiles(req.files)
                if(ret && ret.parsedFiles) {
                    comityMemberReview.annotatedFiles = ret.parsedFiles;
                }

                caseStudy.reviewGroups[caseStudy.version].comityMemberReviews.push(comityMemberReview);
                caseStudy.markModified('reviewGroups');
                await this.caseStudyService.updateCaseStudy(caseStudy);

                const directors = await this.userService.findUsers({ role: Role.ComityDirector });
                this.emailService.sendNewReviewSubmittedToComityDirector(directors, caseStudy, comityMemberReview.reviewAuthor);

                res.status(200).json({
                    status: 'success',
                });
            } catch (err: any) {
                console.log(err);
            }
        });

        this.router.post('/finalReview', this.middlewareRestrictTo(Role.ComityDirector, Role.Admin), async (req: Request, res: Response) => {
            try {
                const caseStudyId = req.body.case;
                const comments = req.body.comments;
                const decision = req.body.decision;

                let caseStudy = await this.caseStudyService.findCaseStudyById(caseStudyId);

                if (!caseStudy) {
                    res.status(404).json('L\'étude de cas n\'a pas été trouvée');
                    return;
                }

                if(caseStudy.status != CaseStep.WaitingComity || caseStudy.approvalDecision != ApprovalDecision.PENDING) {
                    res.status(403).json('L\'étude de cas ne peut pas être évalué dans son statut actuel');
                    return;
                }

                // Add to history
                caseStudy.reviewGroups[caseStudy.version].directorComments = comments;
                caseStudy.reviewGroups[caseStudy.version].directorApprovalDecision = decision;
                
                // update this part first for mongoose to notice changed fields
                caseStudy.markModified('reviewGroups');
                await this.caseStudyService.updateCaseStudy(caseStudy);

                const isApproved = decision == ApprovalDecision.APPROVED;
                if(isApproved) {
                    const deputies = await this.userService.findUsers({ role: Role.Deputy });
                    this.emailService.sendWaitingForFinalConfirmationToDeputies(deputies, caseStudy); 
                    caseStudy.approvalDecision = ApprovalDecision.PENDING;
                    caseStudy.status++;
                }
                else {
                    caseStudy.status = 0;
                    if(decision == ApprovalDecision.REJECT) {
                        if(caseStudy.isPaidCase) {
                            caseStudy.isPaidCase = false;
                            this.emailService.sendReviewConvertedToFreeToUser(caseStudy.submitter, caseStudy, comments);
                        } else {
                            await this.caseStudyService.deleteCaseStudy(caseStudy.id);
                            this.emailService.sendReviewDeletedToUser(caseStudy.submitter, caseStudy, comments);
                            res.status(200).json({
                                status: 'success',
                            });
                            return;
                        }

                    }else {
                        caseStudy.approvalDecision = decision;

                        caseStudy.version++;

                        // Create next version in history
                        caseStudy.reviewGroups.push({version: caseStudy.version, comityMemberReviews: [], directorComments: "", directorApprovalDecision: ApprovalDecision.PENDING});
                        caseStudy.markModified('reviewGroups');
                    }
                }
                caseStudy.comments = comments;
                
                await this.caseStudyService.updateCaseStudy(caseStudy);
                this.emailService.sendReviewResultToUser(caseStudy.submitter, caseStudy, isApproved, decision, comments)

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
            }            if (access_token) {
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

    private async parseAndSaveFiles(files: any) {
        if(!files || !validateFilesType(files)) {
            return undefined;
        }
        let parsedFiles = [];
        let totalNbPages = 0;
        for (let i = 0; i < files.length; i++) {
            const fileProof = files[i];
            if (fileProof) {
                fileProof.date = new Date().toISOString();
                fileProof.originalname = Buffer.from(fileProof.originalname, 'latin1').toString('utf8');
                fileProof.pages = await countNumberPages(fileProof.path);
                parsedFiles.push(fileProof);
                totalNbPages += fileProof.pages;
                this.caseStudyService.saveCaseStudyFile(fileProof.serverFileName);
            }
        }
        if (!totalNbPages) totalNbPages = 0;
        return {parsedFiles, totalNbPages}
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

function countNumberPages(filePath: string): Promise<number> {
    var getDocumentProperties = require('office-document-properties');
    return new Promise((resolve) => {
      getDocumentProperties.fromFilePath(filePath, function(err: any, data: any) {
        if (err) {
          resolve(0); // For now, if document is protected or locked, dont count its pages
        } else {
          resolve(data.pages);
        }
      });
    });
}

function validateFilesType(files: any): boolean {
    for(const file of files) {
        if(!file || file.mimetype != 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {    
            return false;
        }
    }
    return true;
}


