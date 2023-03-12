import { FilterQuery, QueryOptions } from 'mongoose';
import { CaseStudy, PaidCaseStudy, CaseStudyModel, PaidCaseStudyModel } from '@app/models/caseStudy.model';
import { Service } from 'typedi';
import { DatabaseService } from '@app/services/database/database.service';
import * as fs from 'fs';
import * as path from 'path';
import { DocumentType } from '@typegoose/typegoose';
import { CaseStep } from '@app/models/CaseStatus';
import {excludedFields} from "@app/controllers/caseStudy.controller";
import {omit} from "lodash";

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

    async getRestrictedPaidCaseStudies() {
        const paidCaseStudies: PaidCaseStudy[] = await PaidCaseStudyModel.find().lean();
        const filteredCaseStudies: Partial<PaidCaseStudy>[] = [];
        paidCaseStudies.forEach((study, index) => {
            filteredCaseStudies.push(omit(study, excludedFields));
            console.log(omit(study,excludedFields));
        });
        return filteredCaseStudies;
    }


    async findRestrictedCaseStudys(): Promise<(Partial<CaseStudy> | Partial<PaidCaseStudy>)[]> {
        const caseStudies: CaseStudy[] = await CaseStudyModel.find().lean();
        const paidCaseStudies: PaidCaseStudy[] = await PaidCaseStudyModel.find({
            status: CaseStep.Posted
        }).lean();
        const filteredCaseStudies: Partial<CaseStudy>[] = [];
        const filteredPaidCaseStudies: Partial<PaidCaseStudy>[] = [];
        paidCaseStudies.forEach((study, index) => {
            filteredPaidCaseStudies.push(omit(study, excludedFields));
        });
        caseStudies.forEach((study, index) => {
            filteredCaseStudies.push(omit(study, excludedFields));
        });

        return [...filteredCaseStudies, ...filteredPaidCaseStudies];
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
        const study = CaseStudyModel.findById(id).lean();
        return omit(study, excludedFields);
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
