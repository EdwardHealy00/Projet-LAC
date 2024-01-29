import React from "react";
import "./DashboardPaidCase.scss";
import CasesRecieved from "./CasesRecieved";
import CasesWaitingApproval from "./CasesWaitingApproval";
import Button from "@mui/material/Button";
import { UnlockAccess } from "../../connection/UnlockAccess";
import { Role } from "../../../model/enum/Role";
import { useNavigate } from "react-router-dom";
import ValidateTeacherList from "./ValidateTeacher";
import { Divider, Typography } from "@mui/material";
import { Case } from "../../../model/CaseStudy";
import axios from "axios";
import { CaseStep } from "../../../model/enum/CaseStatus";
import { createCaseFromData } from "../../../utils/ConvertUtils";
import { ApprovalDecision } from "../../../model/enum/ApprovalDecision";

function DashboardPaidCase() {
  const navigate = useNavigate();
  const onConsult = () => {
    navigate("/approval/paid");
  };

  function filterByStep(caseStudies: Case[], step: CaseStep) {
    return caseStudies.filter((caseStudy) => caseStudy.status == step);
  }

  function filterPending(caseStudies: Case[], isPending: boolean) {
    return caseStudies.filter((caseStudy) => (caseStudy.approvalDecision == ApprovalDecision.PENDING) == isPending);
  }

  const [paidCaseStudiesStep1, setPaidCaseStudiesStep1] = React.useState<
    Case[]
  >([]);
  const [paidCaseStudiesStep2, setPaidCaseStudiesStep2] = React.useState<
    Case[]
  >([]);
  const [paidCaseStudiesStep3, setPaidCaseStudiesStep3] = React.useState<
    Case[]
  >([]);
  const [paidCaseStudiesStep4, setPaidCaseStudiesStep4] = React.useState<
    Case[]
  >([]);

  const [freeCaseStudiesStep1, setFreeCaseStudiesStep1] = React.useState<
    Case[]
  >([]);
  const [freeCaseStudiesStep2, setFreeCaseStudiesStep2] = React.useState<
    Case[]
  >([]);
  const [freeCaseStudiesStep3, setFreeCaseStudiesStep3] = React.useState<
    Case[]
  >([]);
  const [freeCaseStudiesStep4, setFreeCaseStudiesStep4] = React.useState<
    Case[]
  >([]);

  const getCaseStudies = async () => {
    axios
      .get(`${process.env.REACT_APP_BASE_API_URL}/api/casestudies/`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.status === 200) {
          const paidCases: Case[] = [];
          const freeCases: Case[] = [];
          for (const caseStudy of res.data) {
            const newData = createCaseFromData(
              caseStudy._id,
              caseStudy.title,
              caseStudy.desc,
              caseStudy.authors,
              caseStudy.submitter,
              caseStudy.date,
              caseStudy.page,
              caseStudy.status,
              caseStudy.isPaidCase,
              caseStudy.classId,
              caseStudy.discipline,
              caseStudy.subjects,
              caseStudy.files,
              caseStudy.reviewGroups,
              caseStudy.reviewers,
              caseStudy.version,
              caseStudy.approvalDecision,
              caseStudy.comments,
              caseStudy.ratings,
              caseStudy.votes
            );
            caseStudy.isPaidCase
              ? paidCases.push(newData)
              : freeCases.push(newData);
          }

          setPaidCaseStudiesStep1(
            filterByStep(paidCases, CaseStep.WaitingPreApproval)
          );
          setPaidCaseStudiesStep2(
            filterByStep(paidCases, CaseStep.WaitingComity)
          );
          setPaidCaseStudiesStep3(
            filterByStep(paidCases, CaseStep.WaitingCatalogue)
          );
          setPaidCaseStudiesStep4(filterByStep(paidCases, CaseStep.Posted));

          setFreeCaseStudiesStep1(
            filterByStep(freeCases, CaseStep.WaitingPreApproval)
          );
          setFreeCaseStudiesStep2(
            filterByStep(freeCases, CaseStep.WaitingComity)
          );
          setFreeCaseStudiesStep3(
            filterByStep(freeCases, CaseStep.WaitingCatalogue)
          );
          setFreeCaseStudiesStep4(filterByStep(freeCases, CaseStep.Posted));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  React.useEffect(() => {
    getCaseStudies();
  }, []);

  function calculateCaseReceivedStats(): number[] {
    return [
      paidCaseStudiesStep4.length + freeCaseStudiesStep4.length,
      paidCaseStudiesStep1.length + freeCaseStudiesStep1.length +
      paidCaseStudiesStep2.length + freeCaseStudiesStep2.length +
      paidCaseStudiesStep3.length + freeCaseStudiesStep3.length,
    ];
  }

  function calculateCaseStatusStats(): number[] {
    return [
      filterPending(paidCaseStudiesStep1, true).length + filterPending(freeCaseStudiesStep1, true).length,
      filterPending(paidCaseStudiesStep2, true).length + filterPending(freeCaseStudiesStep2, true).length,
      paidCaseStudiesStep3.length + freeCaseStudiesStep3.length,
      filterPending(paidCaseStudiesStep1, false).length + filterPending(freeCaseStudiesStep1, false).length +
      filterPending(paidCaseStudiesStep2, false).length + filterPending(freeCaseStudiesStep2, false).length,
    ];
  }

  return (
    <div id="dashboard">
      <div id="titleDashboard">
        <Typography variant="h3">Tableau de bord</Typography>
      </div>
      <div id="casesBarChart">
        <div>
          <CasesWaitingApproval caseStatusData={calculateCaseStatusStats()}/>
        </div>
        <div>
          <CasesRecieved caseReceivedData={calculateCaseReceivedStats()} />
        </div>
      </div>
      <div>
        <UnlockAccess
          role={[Role.Deputy, Role.Comity, Role.ComityDirector]}
          children={
            <Button
              id="accessCaseStudyBtn"
              variant="contained"
              onClick={() => onConsult()}
            >
              Consulter les études de cas
            </Button>
          }
        ></UnlockAccess>
      </div>
      <UnlockAccess
          role={[Role.Deputy]}
          children={<ValidateTeacherList />}
        ></UnlockAccess>
    </div>
  );
}

export default DashboardPaidCase;
