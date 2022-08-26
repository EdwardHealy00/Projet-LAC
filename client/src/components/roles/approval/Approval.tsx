import axios from "axios";
import React from "react";
import { Case } from "../../../model/CaseStudy";
import { CaseStep } from "../../../model/enum/CaseStatus";
import { Role } from "../../../model/enum/Role";
import { UnlockAccess } from "../../connection/UnlockAcess";
import { ApprovalComity } from "./comity/Approval";
import { ApprovalDeputy } from "./deputy/Approval";
import { ApprovalPolyPress } from "./polyPress/Approval";
import { Document } from "../../../model/Document";

function createData(
  id_: number,
  title: string,
  author: string,
  submitted: string,
  status: CaseStep,
  isPaidCase: boolean,
  classId: string,
  file: any
): Case {
  const [ filename, extension ] = file.originalname.split(".") as string[];
  const documents: Document[] = [
    {
      id_: 1,
      documentType: "Étude de cas",
      title: filename,
      type: "Obligatoire",
      format: extension,
      addedOn: submitted,
      file: file
    },
  ];
  return {
    id_,
    title,
    author,
    submittedDate: submitted,
    status,
    isPaidCase,
    classId,
    documents,
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
    axios.get("http://localhost:3001/api/casestudies/paid").then((res) => {
      const cases: Case[] = [];
      for (const caseStudy of res.data) {
        cases.push(
          createData(
            caseStudy._id,
            caseStudy.title,
            caseStudy.authors,
            caseStudy.date,
            caseStudy.status,
            caseStudy.isPaidCase,
            caseStudy.classId,
            caseStudy.file
          )
        );

      }
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
