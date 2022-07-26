import { Document } from "./Document";
export interface Case {
    id_: number;
    title: string;
    author: string;
    submittedDate: string;
    status: string;
    documents?: Document[];
}