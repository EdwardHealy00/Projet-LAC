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

            const caseStudies = await this.caseStudyService.findAllCaseStudys();

            res.json(caseStudies);
            
        });

        this.router.get('/:id',  async (req: Request, res: Response) => {
            const caseStudy = await this.caseStudyService.findCaseStudyById(req.params.id);
            res.json(caseStudy);
        });

        this.router.post('/', async (req: Request, res: Response) => {
            const caseStudy = req.body;
            const newCaseStudy = await this.caseStudyService.createCaseStudy(caseStudy);
            res.json(newCaseStudy);
        });
    }
}
