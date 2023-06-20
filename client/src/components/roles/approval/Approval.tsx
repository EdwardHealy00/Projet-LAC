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
import { Box, Button, Tab, Tabs } from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";

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
  files: any[],
  ratings: number,
  votes: number
): Case {
  const filesData: Document[] = [];
  for (let i = 0; i < files.length; i++) {
    const filename = files[i].originalname.substring(0, files[i].originalname.lastIndexOf("."));
    const extension = files[i].originalname.substring(files[i].originalname.lastIndexOf(".") + 1);
    filesData.push({
      id_: i,
      documentType: "Étude de cas",
      title: filename,
      type: "Obligatoire",
      format: extension,
      addedOn: date,
      file: files[i]
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
    files: filesData,
    ratings,
    votes,
    url: ""
  };
}

function filterByStep(caseStudies: Case[], step: CaseStep) {
  return caseStudies.filter((caseStudy) => caseStudy.status == step);
}

export default function Approval() {
  const [tabValue, setTabValue] = React.useState("0");

  const [caseStudies, setCaseStudies] = React.useState<Case[]>([]);
  const [caseStudiesStep1, setCaseStudiesStep1] = React.useState<Case[]>([]);
  const [caseStudiesStep2, setCaseStudiesStep2] = React.useState<Case[]>([]);
  const [caseStudiesStep3, setCaseStudiesStep3] = React.useState<Case[]>([]);

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
        setCaseStudies(cases);
        setCaseStudiesStep1(filterByStep(cases, CaseStep.WaitingPreApproval));
        setCaseStudiesStep2(filterByStep(cases, CaseStep.WaitingComity));
        setCaseStudiesStep3(filterByStep(cases, CaseStep.WaitingCatalogue));
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
          &gt; Retour au dashboard
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
                  step1={caseStudiesStep1}
                  step2={caseStudiesStep2}
                  step3={caseStudiesStep3}
                />
              }
            ></UnlockAccess>

            <UnlockAccess
              role={[Role.Comity]}
              children={<ApprovalComity caseStudies={caseStudiesStep2} />}
            ></UnlockAccess>

            <UnlockAccess
              role={[Role.PolyPress]}
              children={<ApprovalPolyPress caseStudies={caseStudiesStep3} />}
            ></UnlockAccess>
          </TabPanel>

          {/*FREE CASES TAB*/}
          <TabPanel value="1">
            <p>lel</p>
            <UnlockAccess
              role={[Role.Deputy]}
              children={
                <ApprovalDeputy
                  step1={caseStudiesStep1}
                  step2={caseStudiesStep2}
                  step3={caseStudiesStep3}
                />
              }
            ></UnlockAccess>

            <UnlockAccess
              role={[Role.Comity]}
              children={<ApprovalComity caseStudies={caseStudiesStep2} />}
            ></UnlockAccess>

            <UnlockAccess
              role={[Role.PolyPress]}
              children={<ApprovalPolyPress caseStudies={caseStudiesStep3} />}
            ></UnlockAccess>
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
}
