import { Case } from "../model/CaseStudy";
import { CaseStep } from "../model/enum/CaseStatus";
import { Document } from "../model/Document";
import { ReviewGroup } from "../components/deputy/newCase/CaseFeedback";
import { ApprovalDecision } from "../model/enum/ApprovalDecision";

export function createCaseFromData(
    id_: number,
    title: string,
    desc: string,
    authors: string,
    submitter: string,
    date: string,
    page: number,
    status: CaseStep,
    isPaidCase: boolean,
    classId: string,
    discipline: string,
    subjects: string[],
    files: any[],
    reviewGroups: ReviewGroup[],
    reviewers: string[],
    version: number,
    approvalDecision: ApprovalDecision,
    comments: string,
    ratings: number,
    votes: number
  ): Case {
    const filesData: Document[] = [];
    for (let i = 0; i < files.length; i++) {
      filesData.push(createDocumentFromFile(files[i], files[i].originalname, i));
    }

    return {
        id_,
        title,
        desc,
        authors,
        submitter,
        date,
        page,
        status,
        isPaidCase,
        classId,
        discipline,
        subjects,
        files: filesData,
        reviewGroups,
        reviewers,
        version,
        approvalDecision,
        comments,
        ratings,
        votes,
        url: ""
      };

}

export function createDocumentFromFile(file: any, name: string, id: number) {
  const filename = name.substring(0, name.lastIndexOf("."));
  const extension = name.substring(name.lastIndexOf(".") + 1);
  return {
    id_: id,
    documentType: "Étude de cas",
    title: filename,
    type: "Obligatoire",
    format: extension,
    addedOn: file? file.date : "En attente de confirmation",
    isPending: !file,
    file: file,
  };
}
