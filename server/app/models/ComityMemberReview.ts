import { CaseFeedback } from "./CaseFeedback"

export interface ComityMemberReview {
    reviewAuthor: string
    caseFeedback: CaseFeedback[]
    decision: number
}