import { FilterQuery, QueryOptions } from 'mongoose';
import { CaseStudy, PaidCaseStudy, CaseStudyModel, PaidCaseStudyModel } from '@app/models/caseStudy.model';
import { Service } from 'typedi';
import { DatabaseService } from '@app/services/database/database.service';
import * as fs from 'fs';
import * as path from 'path';

@Service()
export class CaseStudyService {

    constructor(private readonly databaseService: DatabaseService) { }

    saveCaseStudyFile(fileName: string) {
        const filePath = path.join(__dirname, '../../../paidCaseStudies/', fileName);
        fs.createReadStream(filePath).pipe(this.databaseService.bucket.openUploadStream(filePath,
            {
                metadata: { name: fileName }
            }
        )).on('finish', () => {
            fs.rmSync(filePath);
        });


    }

    async getAllPaidCaseStudies() {
        return PaidCaseStudyModel.find();
    }

    // CreateCaseStudy service
    async createPaidCaseStudy(input: Partial<PaidCaseStudy>) {
        const caseStudy = await PaidCaseStudyModel.create(input);
        return caseStudy;
    }

    // Find CaseStudy by Id
    async findCaseStudyById(id: string) {
        return CaseStudyModel.findById(id).lean();
    }

    // Find All CaseStudys
    async findAllCaseStudys() {
        return CaseStudyModel.find();
    }

    // Find one CaseStudy by any fields
    async findCaseStudy(
        query: FilterQuery<CaseStudy>,
        options: QueryOptions = {}
    ) {
        return CaseStudyModel.findOne(query, {}, options);
    }
}
