import { ApprovalDecision } from "../../../model/enum/ApprovalDecision";

export interface CaseFeedback {
    criteria: string;
    rating?: number;
    comments: string;
}

export interface ComityMemberReview {
    reviewAuthor: string;
    caseFeedback: CaseFeedback[];
    decision: number;
    annotatedFiles: any[];
}

export interface ReviewGroup {
    version: number
    comityMemberReviews: ComityMemberReview[]
    directorComments: string;
    directorApprovalDecision: ApprovalDecision;
}