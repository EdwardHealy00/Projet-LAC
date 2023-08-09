import {
    getModelForClass,
    modelOptions,
    mongoose,
    prop,
} from '@typegoose/typegoose';
import { CaseStep } from './CaseStatus';
import { ComityMemberReview } from './ComityMemberReview';
import { ApprovalDecision } from './ApprovalDecision';

@modelOptions({
    schemaOptions: {
        // Add createdAt and updatedAt fields
        timestamps: true,
    },
})

// Export the User class to be used as TypeScript type
export class CaseStudy {

    @prop({ _id: true, default: new mongoose.Types.ObjectId() })
    _id: mongoose.Types.ObjectId;

    @prop({ default: true}) 
    isPaidCase: boolean;

    @prop({ default: ApprovalDecision.PENDING}) 
    approvalDecision: ApprovalDecision;

    @prop({ default: ""}) 
    comments: string;

    @prop({ unique: true, required: true })
    title: string;

    @prop({ required: true })
    desc: string;

    @prop({ default: new Date().toISOString() })
    date: string;

    @prop({ required: true })
    files: any;

    @prop({default: []})
    comityMemberReviews: ComityMemberReview[];

    @prop({ required: true })
    authors: string;

    @prop({ required: true })
    submitter: string;

    @prop({})
    discipline: string;

    @prop({})
    subjects: string[];

    @prop({})
    classId?: string;

    @prop({})
    page: number;

    @prop({})
    classNames?: string;

    @prop({ default: 0 })
    ratings: number;

    @prop({ default: 0})
    votes: number;

    @prop({ default: CaseStep.WaitingPreApproval })
    status: CaseStep;

    @prop({ default: ""})
    url: string;
}

const CaseStudyModel = getModelForClass(CaseStudy);
export { CaseStudyModel };