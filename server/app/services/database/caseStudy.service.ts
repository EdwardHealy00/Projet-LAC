import { FilterQuery, QueryOptions } from 'mongoose';
import { CaseStudy, PaidCaseStudy, CaseStudyModel, PaidCaseStudyModel } from '@app/models/caseStudy.model';
import { Service } from 'typedi';
import { DatabaseService } from '@app/services/database/database.service';
import * as fs from 'fs';
import * as path from 'path';
import { DocumentType } from '@typegoose/typegoose';
import { CaseStep } from '@app/models/CaseStatus';
import * as ClamScan from 'clamscan';

@Service()
export class CaseStudyService {

    constructor(private readonly databaseService: DatabaseService) { }

    saveCaseStudyFile(fileName: string) {
        const filePath = path.join(__dirname, '../../../paidCaseStudies/', fileName);
        const clamScan = new ClamScan({remove_infected: false, scan_archives: true, debug_mode: false, file_list: []});
        clamScan.is_infected(filePath, (err: Error | null, file: string, result: boolean) => {
            if (err) {
                console.error(err);
                return;
            }

            if (result) {
                console.log(`The file ${file} is infected!`);
            } else {
                console.log(`The file ${file} is clean.`);
            }
        });
        fs.createReadStream(filePath).pipe(this.databaseService.bucket.openUploadStream(filePath,
            {
                metadata: { name: fileName }
            }
        )).on('finish', () => {
            fs.rmSync(filePath);
        });
    }

    async getCaseStudyFile(fileName: string) {
        const files = await this.databaseService.bucket.find({ "metadata.name": fileName }).toArray();
        if (files.length > 0) {
            return this.databaseService.bucket.openDownloadStream(files[0]._id);
        }
        return null;
    }

    async getAllPaidCaseStudies() {
        return PaidCaseStudyModel.find();
    }

    // Find PaidCaseStudy by Id
    async findPaidCaseStudyById(id: string) {
        return PaidCaseStudyModel.findById(id);
    }

    async updatePaidCaseStudy(paidCaseStudy: DocumentType<PaidCaseStudy>) {
        await paidCaseStudy.save();
        return paidCaseStudy;
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
    async findAllCaseStudys(): Promise<(PaidCaseStudy | CaseStudy)[]> {
        const caseStudies: CaseStudy[] = await CaseStudyModel.find();
        const paidCaseStudies: PaidCaseStudy[] = await PaidCaseStudyModel.find({
            status: CaseStep.Posted
        });
        return [...caseStudies, ...paidCaseStudies];
    }

    // Find one CaseStudy by any fields
    async findCaseStudy(
        query: FilterQuery<CaseStudy>,
        options: QueryOptions = {}
    ) {
        return CaseStudyModel.findOne(query, {}, options);
    }
}
