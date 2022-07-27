import { FilterQuery, QueryOptions } from 'mongoose';
import CaseStudyModel, { CaseStudy } from '@app/models/caseStudy.model';
import { Service } from 'typedi';

@Service()
export class CaseStudyService {

    constructor() { }

    // CreateCaseStudy service
    async createCaseStudy(input: Partial<CaseStudy>) {
        return await CaseStudyModel.create(input);
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
