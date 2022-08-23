import { Document } from "./Document";
import { CaseStatus } from "./enum/CaseStatus";
export interface Case {
    id_: number;
    title: string;
    author: string;
    submittedDate: string;
    status: CaseStatus;
    documents?: Document[];
}