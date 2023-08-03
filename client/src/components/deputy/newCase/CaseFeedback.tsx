export interface CaseFeedback {
    criteria: string;
    rating?: number;
    comments: string;
}

export interface ComityMemberReview {
    reviewAuthor: string;
    caseFeedback: CaseFeedback[];
}