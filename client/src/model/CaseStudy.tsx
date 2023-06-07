import { Document } from "./Document";
import { CaseStep } from "./enum/CaseStatus";

//hardcoded case study
export interface CaseStudy {
  id: string;
  title: string;
  authors: string;
  content: string;
  date: string;
  page: number;
  discipline: string;
  subjects: string[];
  tags: string[];
  classNames: string;
  classIds: string;
  ratings: number;
  votes: number;
}

//Will replace the CaseStudy interface eventually 
export interface Case {
  id_: number;
  title: string;
  authors: string;
  date: string;
  status: CaseStep;
  isPaidCase: boolean;
  classId: string;
  discipline: string;
  subjects: string[];
  documents?: Document[];
}

interface NewCaseStudy {
  title: string;
  authors: string;
  classId: string;
  isPaidCase: boolean;
}

export interface PaidNewCaseStudy extends NewCaseStudy {
  file: any;
}

export interface CaseStudyProps {
  caseStudies: Case[];
}

export interface DeputyCaseStudyProps {
  step1: Case[];
  step2: Case[];
  step3: Case[];
  step4: Case[];
}
