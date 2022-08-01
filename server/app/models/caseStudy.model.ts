import {
    getModelForClass,
    modelOptions,
    prop,
} from '@typegoose/typegoose';

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

// Create the user model from the User class
const caseStudyModel = getModelForClass(CaseStudy);
export default caseStudyModel;

