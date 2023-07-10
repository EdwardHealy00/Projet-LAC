import { Document } from "./Document";
import { CaseStep } from "./enum/CaseStatus";

// //hardcoded case study
// export interface CaseStudy {
//   id: string;
//   title: string;
//   authors: string;
//   content: string;
//   date: string;
//   page: number;
//   discipline: string;
//   subjects: string[];
//   tags: string[];
//   classNames: string;
//   classIds: string;
//   ratings: number;
//   votes: number;
// }

// Will replace the CaseStudy interface eventually 
export interface Case {
  id_: number;
  title: string;
  desc: string;
  authors: string;
  date: string;
  page: number;
  status: CaseStep;
  isPaidCase: boolean;
  classId: string;
  discipline: string;
  subjects: string[];
  files: Document[];
  ratings: number;
  votes: number;
  url: string;
}

export interface NewCaseStudy {
  title: string;
  desc: string;
  authors: string;
  classId: string;
  files: any;
  discipline: string;
  isPaidCase: boolean;
}

export interface CaseStudyProps {
  caseStudies: Case[];
}

export interface DeputyCaseStudyProps {
  step1: Case[];
  step2: Case[];
  step3: Case[];
}

export interface SingleCaseProp {
  caseData: Case;
}
