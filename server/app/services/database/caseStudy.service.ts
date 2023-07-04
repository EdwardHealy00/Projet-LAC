import { FilterQuery, QueryOptions } from 'mongoose';
import { CaseStudy, CaseStudyModel } from '@app/models/caseStudy.model';
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
        return CaseStudyModel.find({ isPaidCase: true });
    }

    async getRestrictedPaidCaseStudies() {
        const paidCaseStudies: CaseStudy[] = await CaseStudyModel.find({ isPaidCase: true }).lean();
        const filteredCaseStudies: Partial<CaseStudy>[] = [];
        paidCaseStudies.forEach((study, index) => {
            filteredCaseStudies.push(omit(study, excludedFields));
            console.log(omit(study,excludedFields));
        });
        return filteredCaseStudies;
    }


    async findRestrictedCaseStudys(): Promise<(Partial<CaseStudy>)[]> {
        const caseStudies: CaseStudy[] = await CaseStudyModel.find({status: CaseStep.Posted}).lean();
        const filteredCaseStudies: Partial<CaseStudy>[] = [];
        caseStudies.forEach((study, index) => {
            filteredCaseStudies.push(omit(study, excludedFields));
        });

        return filteredCaseStudies;
    }

    async updateCaseStudy(caseStudy: DocumentType<CaseStudy>) {
        await caseStudy.save();
        return caseStudy;
    }

    // CreateCaseStudy service
    async createCaseStudy(input: Partial<CaseStudy>) {
        const caseStudy = await CaseStudyModel.create(input);
        return caseStudy;
    }

    // Find CaseStudy by Id
    async findCaseStudyById(id: string) {
        return CaseStudyModel.findById(id);
    }

    // Find All CaseStudys
    async findAllCaseStudys(): Promise<(CaseStudy)[]> {
        const caseStudies: CaseStudy[] = await CaseStudyModel.find();
        return caseStudies;
    }

    // Find one CaseStudy by any fields
    async findCaseStudy(
        query: FilterQuery<CaseStudy>,
        options: QueryOptions = {}
    ) {
        return CaseStudyModel.findOne(query, {}, options);
    }

    // Find All Authors
    async findAllCaseStudyAuthors(): Promise<(string)[]> {
        return await CaseStudyModel.find({status: CaseStep.Posted}).distinct('authors');
    }
}
