export interface CaseStudy {
    id: string;
    title: string;
    authors: string;
    content: string;
    date: string;
    page: number;
    discipline: string;
    tags: string[];
    classNames: string;
    classIds: string;
    ratings: number;
    votes: number;
}

export interface NewCaseStudy {
    title: string;
    authors: string;
    classId: string;
    isPaidCase: boolean;
}

export interface PaidNewCaseStudy extends NewCaseStudy {
    file: any;
}