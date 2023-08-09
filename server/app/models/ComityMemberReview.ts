import { ApprovalDecision } from "./ApprovalDecision"
import { CaseFeedback } from "./CaseFeedback"

export interface ComityMemberReview {
    reviewAuthor: string
    caseFeedback: CaseFeedback[]
    decision: number
    annotatedFiles?: any[]
}

export interface ReviewGroup {
    version: number
    comityMemberReviews: ComityMemberReview[]
    directorComments: string;
    directorApprovalDecision: ApprovalDecision;
}