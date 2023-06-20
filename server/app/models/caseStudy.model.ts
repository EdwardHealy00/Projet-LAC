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

    @prop({ required: true })
    desc: string;

    @prop({ default: new Date().toISOString() })
    date: string;

    @prop({ required: true })
    files: any;

    @prop({ required: true })
    authors: string;

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