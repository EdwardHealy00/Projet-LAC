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

    @prop({ default: true}) 
    isPaidCase: boolean;

    @prop({ unique: true, required: true })
    title: string;

    @prop({ default: new Date().toISOString() })
    date: string;

    @prop({ required: true })
    file: any;

    @prop({ required: true })
    authors: string;

    @prop({})
    discipline: string;

    @prop({})
    subjects: string[];

    @prop({})
    classId?: string;

}

export class FreeCaseStudy extends CaseStudy {

    @prop({})
    page: number;

    @prop({})
    classNames?: string;

    @prop({ default: 0 })
    ratings: number;

    @prop({ default: 0})
    votes: number;
}

export class PaidCaseStudy extends CaseStudy {

    @prop({ default: CaseStep.WaitingPreApproval })
    status: CaseStep;
}

// Create the user model from the User class
const FreeCaseStudyModel = getModelForClass(FreeCaseStudy);
export {FreeCaseStudyModel};

// Create the user model from the User class
const PaidCaseStudyModel = getModelForClass(PaidCaseStudy);
export {PaidCaseStudyModel};