import { Request, Response, Router } from 'express';
import { Service } from 'typedi';
import { CaseStudyService } from '@app/services/database/caseStudy.service';

@Service()
export class CaseStudyController {
    router: Router;

    constructor(private readonly caseStudyService: CaseStudyService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/', async (req: Request, res: Response) => {
            try {
                const caseStudies = await this.caseStudyService.findAllCaseStudys();

                res.json(caseStudies);
            } catch (err: any) {
                console.log(err);
            }

        });

        this.router.get('/paid', async (req: Request, res: Response) => {
            try {
                const caseStudies = await this.caseStudyService.getAllPaidCaseStudies();

                res.json(caseStudies);
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

        this.router.post('/', async (req: Request, res: Response) => {
            try {
                const caseStudy = req.body;
                caseStudy["isPaidCase"] = caseStudy["isPaidCase"] === 'true';
                const fileProof = req.files && req.files.length > 0 ? req.files[0] : undefined;
                if (fileProof) {
                    caseStudy["file"] = fileProof;
                    this.caseStudyService.saveCaseStudyFile(fileProof.serverFileName);
                }

                const newCaseStudy = caseStudy.isPaidCase ? await this.caseStudyService.createPaidCaseStudy(caseStudy) :
                    undefined;
                res.json(newCaseStudy);
            } catch (err: any) {
                console.log(err);
            }
        });

    }
}
