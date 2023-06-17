import axios from "axios";
import React from "react";
import { Case } from "../../../model/CaseStudy";
import { CaseStep } from "../../../model/enum/CaseStatus";
import { Role } from "../../../model/enum/Role";
import { UnlockAccess } from "../../connection/UnlockAccess";
import { ApprovalComity } from "./comity/Approval";
import { ApprovalDeputy } from "./deputy/Approval";
import { ApprovalPolyPress } from "./polyPress/Approval";
import { Document } from "../../../model/Document";

function createData(
  id_: number,
  title: string,
  desc: string,
  authors: string,
  date: string,
  page: number,
  status: CaseStep,
  isPaidCase: boolean,
  classId: string,
  discipline: string,
  subjects: string[],
  file: any[],
  ratings: number,
  votes: number
): Case {
  const files: Document[] = [];
  for (let i = 0; i < file.length; i++) {
    const [ filename, extension ] = file[i].originalname.split(".") as string[];
    files.push({
      id_: i,
      documentType: "Étude de cas",
      title: filename,
      type: "Obligatoire",
      format: extension,
      addedOn: date,
      file: file[i]
    });
  }

  return {
    id_,
    title,
    desc,
    authors,
    date,
    page,
    status,
    isPaidCase,
    classId,
    discipline,
    subjects,
    files,
    ratings,
    votes
  };
}

function filterByStep(caseStudies: Case[], step: CaseStep) {
  return caseStudies.filter((caseStudy) => caseStudy.status == step);
}

export default function Approval() {
  const [caseStudies, setCaseStudies] = React.useState<Case[]>([]);
  const [caseStudiesStep1, setCaseStudiesStep1] = React.useState<Case[]>([]);
  const [caseStudiesStep2, setCaseStudiesStep2] = React.useState<Case[]>([]);
  const [caseStudiesStep3, setCaseStudiesStep3] = React.useState<Case[]>([]);
  const [caseStudiesStep4, setCaseStudiesStep4] = React.useState<Case[]>([]);
  const getCaseStudies = async () => {
    axios
      .get(`${process.env.REACT_APP_BASE_API_URL}/api/casestudies/paid`, {withCredentials: true})
      .then((res) => {
        const cases: Case[] = [];
        for (const caseStudy of res.data) {
          cases.push(
            createData(
              caseStudy._id,
              caseStudy.title,
              caseStudy.desc,
              caseStudy.authors,
              caseStudy.date,
              caseStudy.page,
              caseStudy.status,
              caseStudy.isPaidCase,
              caseStudy.classId,
              caseStudy.discipline,
              caseStudy.subjects,
              caseStudy.files,
              caseStudy.ratings,
              caseStudy.votes
            )
          );
        }
        console.log(cases);
        setCaseStudies(cases);
        setCaseStudiesStep1(filterByStep(cases, CaseStep.WaitingPreApproval));
        setCaseStudiesStep2(filterByStep(cases, CaseStep.WaitingComity));
        setCaseStudiesStep3(filterByStep(cases, CaseStep.WaitingPolyPress));
        setCaseStudiesStep4(filterByStep(cases, CaseStep.WaitingCatalogue));
      });
  };

  React.useEffect(() => {
    getCaseStudies();
  }, []);

  return (
    <div>
      <UnlockAccess
        role={[Role.Comity]}
        children={<ApprovalComity caseStudies={caseStudiesStep2} />}
      ></UnlockAccess>

      <UnlockAccess
        role={[Role.Deputy]}
        children={
          <ApprovalDeputy
            step1={caseStudiesStep1}
            step2={caseStudiesStep2}
            step3={caseStudiesStep3}
            step4={caseStudiesStep4}
          />
        }
      ></UnlockAccess>

      <UnlockAccess
        role={[Role.PolyPress]}
        children={<ApprovalPolyPress caseStudies={caseStudiesStep3} />}
      ></UnlockAccess>
    </div>
  );
}
