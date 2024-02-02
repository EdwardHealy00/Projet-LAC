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
import { logError, logInfo } from '@app/utils/logs';

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


        this.router.get('/', this.middlewareRestrictTo(Role.Admin, Role.Deputy, Role.ComityDirector, Role.Comity), async (req: Request, res: Response) => {
            try {
                const caseStudies = await this.caseStudyService.findAllCaseStudys();

                logInfo(res.locals.user, "Get all case studies")
                res.json(caseStudies);
            } catch (err: any) {
                logError(res.locals.user, err.name, "Error getting all case studies")
                console.log(err);
            }

        });

        this.router.get('/all-catalog', async (req: Request, res: Response) => {
            try {
                const caseStudies = await this.caseStudyService.findRestrictedCaseStudys();

                logInfo(res.locals.user, "Get the entire catalogue")
                res.json(caseStudies);
            } catch (err: any) {
                logError(res.locals.user, err.name, "Error getting the catalogue")
                console.log(err);
            }

        });

        this.router.get('/paid', this.middlewareRestrictTo(Role.Admin, Role.Deputy, Role.Comity, Role.ComityDirector), async (req: Request, res: Response, next: NextFunction) => {
            try {
                const caseStudies = await this.caseStudyService.getAllPaidCaseStudies();
                
                logInfo(res.locals.user, "Get all paid study cases")
                res.json(caseStudies);
            } catch (err: any) {
                logError(res.locals.user, err.name, "Error getting all paid study cases")
                next(err);
            }

        });

        this.router.get('/catalog-paid', async (req: Request, res: Response) => {
            try {
                const caseStudies = await this.caseStudyService.getRestrictedPaidCaseStudies();

                logInfo(res.locals.user, "Get all paid cases from catalogue")
                res.json(caseStudies);
            } catch (err: any) {
                logError(res.locals.user, err.name, "Error getting all paid cases from catalogue")
                console.log(err);
            }

        });

        this.router.get('/authors', async (req: Request, res: Response) => {
            try {
                const caseStudyAuthors = await this.caseStudyService.findAllCaseStudyAuthors();

                logInfo(res.locals.user, "Get all authors")
                res.json(caseStudyAuthors);
            } catch (err: any) {
                logError(res.locals.user, err.name, "Error getting all authors")
                console.log(err);
            }
        });

        this.router.get('/:id', async (req: Request, res: Response) => {
            try {
                const caseStudy = await this.caseStudyService.findCaseStudyById(req.params.id);

                if (!caseStudy) {
                    logError(res.locals.user, "404", "Couldn't find case study")
                    res.status(404).json('L\'étude de cas n\'a pas été trouvée');
                    return;
                }
                if(!res.locals.user && caseStudy.status != CaseStep.Posted) {
                    logError(res.locals.user, "401", "Authentification error")
                    res.status(401).json("Authentication error");
                    return;
                }
                
                const role = res.locals.user.role;
                const isNotPrivileged = role === Role.Professor || role === Role.ProfessorNotApproved || role === Role.Student;
                if(isNotPrivileged && caseStudy.status != CaseStep.Posted && res.locals.user.email !== caseStudy.submitter) {
                    logError(res.locals.user, "403", "Forbidden to view a case study submitted by other user")
                    res.status(403).json('Il est interdit de consulter une étude de cas en cours d\'évaluation déposée par un autre utilisateur');
                    return;
                }

                logInfo(res.locals.user, "Get case study named: " + caseStudy.title)
                res.json(caseStudy);
            } catch (err: any) {
                logError(res.locals.user, err.name, "Error getting case study with id: " + req.params.id)
                console.log(err);
            }
        });

        this.router.get('/user/:email', this.middlewareRestrictTo(Role.Professor, Role.Admin), async (req: Request, res: Response) => {
            try {
                const caseStudies = await this.caseStudyService.findAllMyCaseStudies(req.params.email);

                logInfo(res.locals.user, "Get all user case studies")
                res.json(caseStudies);
            } catch (err: any) {
                logError(res.locals.user, "403", "Error getting user case studies")
                console.log(err);
            }

        });

        this.router.get('/download/:filename', async (req: Request, res: Response) => {
            try {
                const caseStudyStream = await this.caseStudyService.getCaseStudyFile(req.params.filename);
                if (!caseStudyStream) {
                    logError(res.locals.user, "404", "Couldn't find file")
                    res.status(404).json('Le fichier n\'a pas été trouvé');
                    return;
                }
                logInfo(res.locals.user, "Downloaded file: " + req.params.filename)
                caseStudyStream.pipe(res);
            } catch (err: any) {

                logError(res.locals.user, err.name, "Error downloading file")
                console.log(err);
            }
        });

        this.router.delete('/deleteFile/:filename', this.middlewareRestrictTo(Role.Professor, Role.Admin), async (req: Request, res: Response) => {
            try {
                var isSuccessful = await this.caseStudyService.deleteCaseStudyFile(req.params.filename);
                if (!isSuccessful) {
                    logError(res.locals.user, "404", "File " + req.params.filename + "couldn't be deleted")
                    res.status(404).json('Le fichier ' + req.params.filename+  ' n\'a pas pu être supprimé');
                    return;
                }
                if(req.body.caseStudy.approvalDecision == ApprovalDecision.PENDING) {
                    logError(res.locals.user, "405", "Deleting a file from a pending case study is forbidden")
                    res.status(405).json('Il est interdit de modifier une étude de cas en cours d\'évaluation');
                    return;
                }
                if(res.locals.user.email !== req.body.caseStudy.submitter) {
                    logError(res.locals.user, "405", "Deleting a file from someone else's case study is forbidden")
                    res.status(405).json('Il est interdit de modifier une étude de cas déposée par un autre utilisateur');
                    return;
                }
                
                logInfo(res.locals.user, "File " + req.params.filename + "was deleted successfully")
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
                    logError(res.locals.user, "404", "Case study was not found")
                    res.status(404).json('L\'étude de cas n\'a pas été trouvée');
                    return;
                }
                if (caseStudy.approvalDecision == ApprovalDecision.PENDING) {
                    logError(res.locals.user, "405", "Editing a pending case study is forbidden")
                    res.status(405).json('Il est interdit de modifier une étude de cas en cours d\'évaluation');
                    return;
                }
                if(res.locals.user.email !== caseStudy.submitter) {
                    logError(res.locals.user, "405", "Editing someone else's case study is forbidden")
                    res.status(405).json('Il est interdit de modifier une étude de cas déposée par un autre utilisateur');
                    return;
                }

                caseStudy.files = req.body.files;

                await this.caseStudyService.updateCaseStudy(caseStudy);

                logInfo(res.locals.user, "References from deleted files were successfully removed from case study: " + caseStudy.title)
                res.status(200).json({
                    status: 'success',
                });
            } catch (err: any) {
                logError(res.locals.user, err.name, "Error while removing file references from " + req.params.id)
                console.log(err);
            }
        });

        this.router.patch('/addFileRefs/:id', this.middlewareRestrictTo(Role.Professor, Role.Admin), async (req: Request, res: Response) => {
            try {
                const caseStudyId = req.params.id;
                let caseStudy = await this.caseStudyService.findCaseStudyById(caseStudyId);

                if (!caseStudy) {
                    logError(res.locals.user, "404", "Case study was not found")
                    res.status(404).json('L\'étude de cas n\'a pas été trouvée');
                    return;
                }
                if (caseStudy.approvalDecision == ApprovalDecision.PENDING) {
                    logError(res.locals.user, "405", "Editing a pending case study is forbidden")
                    res.status(405).json('Il est interdit de modifier une étude de cas en cours d\'évaluation');
                    return;
                }
                if(res.locals.user.email !== caseStudy.submitter) {
                    logError(res.locals.user, "405", "Editing someone else's case study is forbidden")
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
                
                logInfo(res.locals.user, "References from added files were successfully added to case study: " + caseStudy.title)
                res.status(200).json({
                    status: 'success',
                });
            } catch (err: any) {
                logError(res.locals.user, err.name, "Error while adding file references to " + req.params.id)
                console.log(err);
            }
        });

        this.router.patch('/convertToFree/:id', this.middlewareRestrictTo(Role.Professor, Role.Admin), async (req: Request, res: Response) => {
            try {
                const caseStudyId = req.params.id;
                let caseStudy = await this.caseStudyService.findCaseStudyById(caseStudyId);

                if (!caseStudy) {
                    logError(res.locals.user, "404", "Case study was not found")
                    res.status(404).json('L\'étude de cas n\'a pas été trouvée');
                    return;
                }
                if (caseStudy.approvalDecision == ApprovalDecision.PENDING) {
                    logError(res.locals.user, "405", "Editing a pending case study is forbidden")
                    res.status(405).json('Il est interdit de modifier une étude de cas en cours d\'évaluation');
                    return;
                }
                if(res.locals.user.email !== caseStudy.submitter) {
                    logError(res.locals.user, "405", "Editing someone else's case study is forbidden")
                    res.status(405).json('Il est interdit de modifier une étude de cas déposée par un autre utilisateur');
                    return;
                }

                caseStudy.isPaidCase = false;
                await this.caseStudyService.updateCaseStudy(caseStudy);
                
                logInfo(res.locals.user, "Successfully converted case study to free: " + caseStudy.title)
                res.status(200).json({
                    status: 'success',
                });
            } catch (err: any) {
                logError(res.locals.user, err.name, "Error while converting to free for id: " + req.params.id)
                console.log(err);
            }
        });

        this.router.patch('/resubmit/:id', this.middlewareRestrictTo(Role.Professor, Role.Admin), async (req: Request, res: Response) => {
            try {
                const caseStudyId = req.params.id;
                let caseStudy = await this.caseStudyService.findCaseStudyById(caseStudyId);

                if (!caseStudy) {
                    logError(res.locals.user, "404", "Case study was not found")
                    res.status(404).json('L\'étude de cas n\'a pas été trouvée');
                    return;
                }
                if(res.locals.user.email !== caseStudy.submitter) {
                    logError(res.locals.user, "405", "Editing someone else's case study is forbidden")
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

                logInfo(res.locals.user, "Successfully resubmited case study: " + caseStudy.title)
                res.status(200).json({
                    status: 'success',
                });
            } catch (err: any) {
                logError(res.locals.user, err.name, "Error while resubmiting case study id: " + req.params.id)
                console.log(err);
            }
        });
        

        this.router.post('/', this.middlewareRestrictTo(Role.Professor, Role.Deputy, Role.Admin), async (req: Request, res: Response) => {
            try {
                const caseStudy = req.body;
                caseStudy["isPaidCase"] = caseStudy["isPaidCase"] === 'true';
                if (req.files) {

                    if(req.files.length === 0) {
                        logError(res.locals.user, "400", "Case study must have at least 1 document")
                        res.status(400).json('L\'étude de cas doit au moins 1 document');
                        return;
                    }
                    if(req.files.length > MAX_FILES_PER_CASE) {
                        logError(res.locals.user, "400", "Case study must have at maximum 3 documents")
                        res.status(400).json('L\'étude de cas doit avoir un maximum de 3 documents');
                        return;
                    }
                    
                    const foundCaseStudy = await this.caseStudyService.findCaseStudy({ title: caseStudy.title}, {});
                    if (foundCaseStudy) {
                        logError(res.locals.user, "400", "Case study with that title already exists")
                        res.status(400).json('Une étude de cas avec ce titre existe déjà');
                        return;
                    }

                    const ret = await this.parseAndSaveFiles(req.files);

                    if(!ret || !validateFilesType(req.files)) {
                        logError(res.locals.user, "415", "Case study must be in .docx format")
                        res.status(415).json('L\'étude de cas doit être en format .docx');
                        return;
                    }

                    caseStudy["files"] = ret.parsedFiles;
                    caseStudy["page"] = ret.totalNbPages;
                }
                else{
                    logError(res.locals.user, "400", "Case study must have at minimum 1 document")
                    res.status(400).json('L\'étude de cas doit avoir un minimum de 1 document');
                    return;
                }

                const newCaseStudy = await this.caseStudyService.createCaseStudy(caseStudy);

                const deputies = await this.userService.findUsers({ role: Role.Deputy });
                this.emailService.sendPreApprovalNeededToDeputies(deputies, newCaseStudy, false);

                logInfo(res.locals.user, "Successfully posted case study: " + caseStudy.title)
                res.status(201).json(newCaseStudy);
            } catch (err: any) {
                logError(res.locals.user, err.name, "Error while posting case study")
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
                    logError(res.locals.user, "404", "Case study was not found")
                    res.status(404).json('L\'étude de cas n\'a pas été trouvée');
                    return;
                }

                if(caseStudy.status == CaseStep.WaitingComity) {
                    logError(res.locals.user, "401", "Case study has already been preapproved")
                    res.status(401).json('L\'étude de cas a déjà été préapprouvée');
                    return;
                }

                const user = await this.userService.findUser({ email: caseStudy.submitter});

                if(caseStudy.status == CaseStep.WaitingPreApproval) {
                    let writtenCriterias: string[] = [];
                    for(var criteriaIndex of failedCriterias) {
                        writtenCriterias.push(Criteria[criteriaIndex]);
                    }
                    if(user) {
                        this.emailService.sendPreApprovalResultToUser(caseStudy.submitter, user!.firstName + ' ' + user!.lastName, caseStudy, isApproved, writtenCriterias)
                    }

                    if(isApproved) {
                        const directors = await this.userService.findUsers({ role: Role.ComityDirector });
                        this.emailService.sendReviewNeededToDirector(directors, caseStudy);
                        this.emailService.sendReviewNeededToReviewers(caseStudy.reviewers, caseStudy);
                    }
                }

                if(caseStudy.status == CaseStep.WaitingCatalogue && isApproved) {
                    if (caseStudy.isPaidCase) {
                        caseStudy.url = url;
                    }
                    // Delete review files once published and main files if paid case
                    await this.caseStudyService.deleteFilesForCaseStudy(caseStudy, caseStudy.isPaidCase); 

                    if(user) {
                        this.emailService.sendNotifyCaseStudyPublishedToUser(caseStudy.submitter, user!.firstName + ' ' + user!.lastName, caseStudy);
                    }
                }

                if (isApproved) {
                    caseStudy.status++; 
                } else {
                    caseStudy.approvalDecision = ApprovalDecision.REJECT;
                }
                await this.caseStudyService.updateCaseStudy(caseStudy);

                logInfo(res.locals.user, "Successfully " + (caseStudy.approvalDecision? "approved ": "rejected ") + "case study " + caseStudy.title + " to step " + caseStudy.status)
                res.status(200).json({
                    status: 'success',
                });
            } catch (err: any) {
                logError(res.locals.user, err.name, "Error while submitting case study review")
                console.log(err);
            }
        });

        this.router.post('/addReviewer/:id', this.middlewareRestrictTo(Role.ComityDirector, Role.Admin), async (req: Request, res: Response) => {
            try {
                const caseStudyId = req.params.id;
                const memberEmail = req.body.email;

                let caseStudy = await this.caseStudyService.findCaseStudyById(caseStudyId);

                if (!caseStudy) {
                    logError(res.locals.user, "404", "Case study was not found")
                    res.status(404).json('L\'étude de cas n\'a pas été trouvée');
                    return;
                }

                // Check if the memberEmail is already in the reviewers array
                if (caseStudy.reviewers && caseStudy.reviewers.includes(memberEmail)) {
                    logInfo(res.locals.user, "Reviewer " + memberEmail + " is already assigned to " + caseStudy.title);
                    res.status(200).json({
                        status: 'success',
                    });
                    return;
                }

                if(!caseStudy.reviewers) {
                    caseStudy.reviewers = [];
                }
                caseStudy.reviewers.push(memberEmail);

                caseStudy.markModified('reviewers');
                await this.caseStudyService.updateCaseStudy(caseStudy);

                const user = await this.userService.findUser({ email: memberEmail});

                if(user) {
                    this.emailService.sendAssignedCaseStudyToReview(memberEmail, user!.firstName + ' ' + user!.lastName, caseStudy);
                }

                logInfo(res.locals.user, "Successfully added reviewer " + memberEmail + " to " + caseStudy.title);
                res.status(200).json({
                    status: 'success',
                });
            } catch (err: any) {
                logError(res.locals.user, err.name, "Error while submitting committee review")
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
                    logError(res.locals.user, "404", "Case study was not found")
                    res.status(404).json('L\'étude de cas n\'a pas été trouvée');
                    return;
                }

                if(caseStudy.status != CaseStep.WaitingComity) {
                    logError(res.locals.user, "403", "Case study can't be reviewed in its current step")
                    res.status(403).json('L\'étude de cas ne peut pas être évalué dans son statut actuel');
                    return;
                }
                
                if(!caseStudy.reviewers.includes(reviewerEmail)) {
                    logError(res.locals.user, "401", "This user has not been assigned to review this case study")
                    res.status(401).json('L\'utilisateur n\'a pas été assigné comme évaluateur de cette étude de cas');
                    return;
                }

                if(caseStudy.reviewGroups[caseStudy.version].comityMemberReviews.find(
                    (review) => review.reviewAuthor === reviewerEmail
                  ) !== undefined) {
                    logError(res.locals.user, "409", "Case study was already reviewed by this user")
                    res.status(409).json('L\'étude de cas a déjà été évalué par cet utilisateur');
                    return;
                }

                for(const criteria of feedback) {
                    if(criteria.criteria === "Autre") continue;
                    if(criteria.ratings === "" || criteria.comments == "") {
                        logError(res.locals.user, "400", "Some criterias were not filled by user")
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

                // if all requested reviewers answered, send different email to director
                if(caseStudy.reviewGroups[caseStudy.version].comityMemberReviews.length === caseStudy.reviewers.length) {
                    this.emailService.sendLastReviewSubmittedToComityDirector(directors, caseStudy, comityMemberReview.reviewAuthor);
                } else {
                    this.emailService.sendNewReviewSubmittedToComityDirector(directors, caseStudy, comityMemberReview.reviewAuthor);
                }

                logInfo(res.locals.user, "Successfully reviewed case study " + caseStudy.title)
                res.status(200).json({
                    status: 'success',
                });
            } catch (err: any) {
                logError(res.locals.user, err.name, "Error while submitting committee review")
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
                    logError(res.locals.user, "404", "Case study was not found")
                    res.status(404).json('L\'étude de cas n\'a pas été trouvée');
                    return;
                }

                if(caseStudy.status != CaseStep.WaitingComity || caseStudy.approvalDecision != ApprovalDecision.PENDING) {
                    logError(res.locals.user, "403", "Case study can't be reviewed in its current step")
                    res.status(403).json('L\'étude de cas ne peut pas être évalué dans son statut actuel');
                    return;
                }

                const user = await this.userService.findUser({ email: caseStudy.submitter});

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

                            if(user) {
                                this.emailService.sendReviewConvertedToFreeToUser(caseStudy.submitter, user!.firstName + ' ' + user!.lastName, caseStudy, comments);
                            }
                        } else {
                            await this.caseStudyService.deleteCaseStudy(caseStudy.id);

                            if(user) {
                                this.emailService.sendReviewDeletedToUser(caseStudy.submitter, user!.firstName + ' ' + user!.lastName, caseStudy, comments);
                            }

                            logInfo(res.locals.user, "Successfully deleted case study and submitted rejection final review of: " + caseStudy.title)
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

                if(user) {
                    this.emailService.sendReviewResultToUser(caseStudy.submitter, user!.firstName + ' ' + user!.lastName, caseStudy, isApproved, decision, comments)
                }

                logInfo(res.locals.user, "Successfully submitted final review of: " + caseStudy.title + " with approval decision" + caseStudy.approvalDecision)
                res.status(200).json({
                    status: 'success',
                });
            } catch (err: any) {
                logError(res.locals.user, err.name, "Error while submitting final review")
                console.log(err);
            }
        });



    }
    private middlewareRestrictTo(...allowedRoles: string[]) {
        return (req: Request, res: Response, next: NextFunction) => {
            const user = res.locals.user;
            if (!user) {
                logError(res.locals.user, "401", "User isn't specified, authentification error")
                res.status(401).json(
                    'Authentication error'
                );
                return;
            }
            if (!allowedRoles.includes(user.role)) {
                logError(res.locals.user, "401", "User is not allowed to perform this action with role: " + user.role)
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
                //console.log('C');
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
                //console.log('A');
            }
            //console.log('V');

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


