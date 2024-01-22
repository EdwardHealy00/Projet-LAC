import axios from "axios";
import React from "react";
import { Case } from "../../model/CaseStudy";
import { CaseStep } from "../../model/enum/CaseStatus";
import { Role } from "../../model/enum/Role";
import { UnlockAccess } from "../connection/UnlockAccess";
import { PendingCasesTeacher } from "../roles/edit/teacher/PendingCases";
import { Box, Button, Tab, Tabs } from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import { createCaseFromData } from "../../utils/ConvertUtils";
import { Link, useLocation } from "react-router-dom";

function filterByStep(caseStudies: Case[], step: CaseStep) {
  return caseStudies.filter((caseStudy) => caseStudy.status == step);
}

export default function PendingCaseStudies() {
  const location = useLocation();
  const [tabValue, setTabValue] = React.useState(location.pathname);

  const [paidCaseStudiesStep1, setPaidCaseStudiesStep1] = React.useState<Case[]>([]);
  const [paidCaseStudiesStep2, setPaidCaseStudiesStep2] = React.useState<Case[]>([]);
  const [paidCaseStudiesStep3, setPaidCaseStudiesStep3] = React.useState<Case[]>([]);
  const [paidCaseStudiesStep4, setPaidCaseStudiesStep4] = React.useState<Case[]>([]);

  const [freeCaseStudiesStep1, setFreeCaseStudiesStep1] = React.useState<Case[]>([]);
  const [freeCaseStudiesStep2, setFreeCaseStudiesStep2] = React.useState<Case[]>([]);
  const [freeCaseStudiesStep3, setFreeCaseStudiesStep3] = React.useState<Case[]>([]);
  const [freeCaseStudiesStep4, setFreeCaseStudiesStep4] = React.useState<Case[]>([]);

  const getCaseStudies = async () => {
    axios
      .get(`${process.env.REACT_APP_BASE_API_URL}/api/casestudies/user/${localStorage.getItem("email")}`, {withCredentials: true})
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
          setPaidCaseStudiesStep1(filterByStep(paidCases, CaseStep.WaitingPreApproval));
          setPaidCaseStudiesStep2(filterByStep(paidCases, CaseStep.WaitingComity));
          setPaidCaseStudiesStep3(filterByStep(paidCases, CaseStep.WaitingCatalogue));
          setPaidCaseStudiesStep4(filterByStep(paidCases, CaseStep.Posted));

          setFreeCaseStudiesStep1(filterByStep(freeCases, CaseStep.WaitingPreApproval));
          setFreeCaseStudiesStep2(filterByStep(freeCases, CaseStep.WaitingComity));
          setFreeCaseStudiesStep3(filterByStep(freeCases, CaseStep.WaitingCatalogue));
          setFreeCaseStudiesStep4(filterByStep(freeCases, CaseStep.Posted));
        }
      }).catch((err) => {
        console.log(err);
      })
  };

  React.useEffect(() => {
    window.scrollTo(0, 0)
    getCaseStudies();
  }, []);

  const onTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  return (

    <div>      
      <Button className="return" href="/catalogue">
        &gt; Retour au catalogue
      </Button>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={tabValue}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={onTabChange} centered>
              <Tab label="Payant" value="/my-pending-case-studies/paid" component={Link} to={"/my-pending-case-studies/paid"}></Tab>
              <Tab label="Libre d'accès" value="/my-pending-case-studies/free" component={Link} to={"/my-pending-case-studies/free"}></Tab>
            </Tabs>
          </Box>
          
          {/*PAID CASES TAB*/}
          <TabPanel value="/my-pending-case-studies/paid">
            <UnlockAccess
              role={[Role.Professor]}
              children={
                <PendingCasesTeacher 
                  step1={paidCaseStudiesStep1}
                  step2={paidCaseStudiesStep2}
                  step3={paidCaseStudiesStep3}
                  step4={paidCaseStudiesStep4}
                />
              }
            ></UnlockAccess>
          </TabPanel>

          {/*FREE CASES TAB*/}
          <TabPanel value="/my-pending-case-studies/free">
            <UnlockAccess
              role={[Role.Professor]}
              children={
                <PendingCasesTeacher
                  step1={freeCaseStudiesStep1}
                  step2={freeCaseStudiesStep2}
                  step3={freeCaseStudiesStep3}
                  step4={freeCaseStudiesStep4}
                />
              }
            ></UnlockAccess>
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
}