import {
    getModelForClass,
    modelOptions,
    prop,
} from '@typegoose/typegoose';
import { CaseStep } from './CaseStatus';

@modelOptions({
    schemaOptions: {
        // Add createdAt and updatedAt fields
        timestamps: true,
    },
})

// Export the User class to be used as TypeScript type
export class CaseStudy {

    @prop({ unique: true, required: true })
    title: string;

    @prop({ required: true })
    authors: string;

    @prop({ required: true })
    content: string;

    @prop({ })
    date: string;

    @prop({})
    page: number;

    @prop({})
    discipline: string;

    @prop({})
    tags: string[];

    @prop({})
    classNames?: string;

    @prop({})
    classIds?: string;

    @prop({ default: 0 })
    ratings: number;

    @prop({ default: 0})
    votes: number;
}

export class PaidCaseStudy {

    @prop({ default: true}) 
    isPaidCase: boolean;

    @prop({ default: new Date().toISOString() })
    date: string;

    @prop({ unique: true, required: true })
    title: string;

    @prop({ required: true })
    authors: string;

    @prop({ required: true })
    classId: string;

    @prop({ required: true })
    discipline: string;

    @prop({ required: true })
    subject: string;

    @prop({ required: true })
    file: any;

    @prop({ default: CaseStep.WaitingPreApproval })
    status: CaseStep;
}

// Create the user model from the User class
const CaseStudyModel = getModelForClass(CaseStudy);
export {CaseStudyModel};

// Create the user model from the User class
const PaidCaseStudyModel = getModelForClass(PaidCaseStudy);
export {PaidCaseStudyModel};