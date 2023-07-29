import { Case } from "../model/CaseStudy";
import { CaseStep } from "../model/enum/CaseStatus";
import { Document } from "../model/Document";

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
    isRejected: boolean,
    classId: string,
    discipline: string,
    subjects: string[],
    files: any[],
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
        isRejected,
        classId,
        discipline,
        subjects,
        files: filesData,
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
