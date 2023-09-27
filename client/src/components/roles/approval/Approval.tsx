import axios from "axios";
import React from "react";
import { Case } from "../../../model/CaseStudy";
import { CaseStep } from "../../../model/enum/CaseStatus";
import { Role } from "../../../model/enum/Role";
import { UnlockAccess } from "../../connection/UnlockAccess";
import { ApprovalDeputy } from "./deputy/Approval";
import { Box, Button, Tab, Tabs } from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import { createCaseFromData } from "../../../utils/ConvertUtils";
import { ApprovalComityDirector } from "./comityDirector/Approval";

function filterByStep(caseStudies: Case[], step: CaseStep) {
  return caseStudies.filter((caseStudy) => caseStudy.status == step);
}

export default function Approval() {
  const [tabValue, setTabValue] = React.useState("0");

  const [paidCaseStudies, setPaidCaseStudies] = React.useState<Case[]>([]);
  const [paidCaseStudiesStep1, setPaidCaseStudiesStep1] = React.useState<Case[]>([]);
  const [paidCaseStudiesStep2, setPaidCaseStudiesStep2] = React.useState<Case[]>([]);
  const [paidCaseStudiesStep3, setPaidCaseStudiesStep3] = React.useState<Case[]>([]);

  const [freeCaseStudies, setFreeCaseStudies] = React.useState<Case[]>([]);
  const [freeCaseStudiesStep1, setFreeCaseStudiesStep1] = React.useState<Case[]>([]);
  const [freeCaseStudiesStep2, setFreeCaseStudiesStep2] = React.useState<Case[]>([]);
  const [freeCaseStudiesStep3, setFreeCaseStudiesStep3] = React.useState<Case[]>([]);

  const getCaseStudies = async () => {
    axios
      .get(`${process.env.REACT_APP_BASE_API_URL}/api/casestudies/`, {withCredentials: true})
      .then((res) => {
        if(res.status === 200) {
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
              caseStudy.version,
              caseStudy.approvalDecision,
              caseStudy.comments,
              caseStudy.ratings,
              caseStudy.votes
            );
            caseStudy.isPaidCase ? paidCases.push(newData) : freeCases.push(newData);
          }
  
          setPaidCaseStudies(paidCases);
          setPaidCaseStudiesStep1(filterByStep(paidCases, CaseStep.WaitingPreApproval));
          setPaidCaseStudiesStep2(filterByStep(paidCases, CaseStep.WaitingComity));
          setPaidCaseStudiesStep3(filterByStep(paidCases, CaseStep.WaitingCatalogue));
  
          setFreeCaseStudies(freeCases);
          setFreeCaseStudiesStep1(filterByStep(freeCases, CaseStep.WaitingPreApproval));
          setFreeCaseStudiesStep2(filterByStep(freeCases, CaseStep.WaitingComity));
          setFreeCaseStudiesStep3(filterByStep(freeCases, CaseStep.WaitingCatalogue));
        }
      }).catch((err) => {
        console.log(err);
      });
  };

  React.useEffect(() => {
    getCaseStudies();
  }, []);

  const onTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  return (
    <div>
      <Button className="return" href="/dashboard">
          &gt; Retour au tableau de bord
        </Button>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={tabValue}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={onTabChange} centered>
              <Tab label="Payant" value="0"></Tab>
              <Tab label="Libre d'accès" value="1"></Tab>
            </Tabs>
          </Box>
          
          {/*PAID CASES TAB*/}
          <TabPanel value="0">
            <UnlockAccess
              role={[Role.Deputy]}
              children={
                <ApprovalDeputy
                  step1={paidCaseStudiesStep1}
                  step2={paidCaseStudiesStep2}
                  step3={paidCaseStudiesStep3}
                />
              }
            ></UnlockAccess>

            
            {/* 
            For now comity members wont have access to all pending cases
            <UnlockAccess
              role={[Role.Comity]}
              children={<ApprovalComity caseStudies={paidCaseStudiesStep2.filter((caseItem) => {
                return !caseItem.comityMemberReviews || !caseItem.comityMemberReviews.some((review) => review.reviewAuthor === localStorage.email);
              })} />}
            ></UnlockAccess> */}

            <UnlockAccess
              role={[Role.ComityDirector]}
              children={<ApprovalComityDirector caseStudies={paidCaseStudiesStep2} />}
            ></UnlockAccess>
          </TabPanel>

          {/*FREE CASES TAB*/}
          <TabPanel value="1">
            <UnlockAccess
              role={[Role.Deputy]}
              children={
                <ApprovalDeputy
                  step1={freeCaseStudiesStep1}
                  step2={freeCaseStudiesStep2}
                  step3={freeCaseStudiesStep3}
                />
              }
            ></UnlockAccess>

            {/* 
             For now comity members wont have access to all pending cases
            <UnlockAccess
              role={[Role.Comity]}
              children={<ApprovalComity caseStudies={freeCaseStudiesStep2.filter((caseItem) => {
                return !caseItem.comityMemberReviews || !caseItem.comityMemberReviews.some((review) => review.reviewAuthor === localStorage.email);
              })} />}
            ></UnlockAccess> */}

            <UnlockAccess
              role={[Role.ComityDirector]}
              children={<ApprovalComityDirector caseStudies={freeCaseStudiesStep2} />}
            ></UnlockAccess>
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
}
