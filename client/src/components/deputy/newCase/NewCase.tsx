import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Button,
} from "@mui/material";
import React from "react";
import "./NewCase.scss";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Case } from "../../../model/CaseStudy";
import { useLocation } from "react-router-dom";
import NewCaseTable from "./NewCaseTable";
import axios from "axios";
import { CaseStep } from "../../../model/enum/CaseStatus";
import DeputyFeedback from "../../roles/approval/deputy/Feedback";
import ComityFeedback from "../../roles/approval/comity/Feedback";
import PressFeedback from "../../roles/approval/polyPress/Feedback";
import { createCaseFromData } from "../../../utils/ConvertUtils";
import { Role } from "../../../model/enum/Role";
import ComityDirectorFeedback from "../../roles/approval/comityDirector/Feedback";
import { UnlockAccess } from "../../connection/UnlockAccess";
import { handleDownloadAll } from "../../../utils/FileDownloadUtil";

function NewCase() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  let [caseStudy, SetCaseStudy] = React.useState<Case>();

  React.useEffect(() => {
    getCaseStudy(id);
  }, [id]);

  const getCaseStudy = (id: string | null) => {
    if (!id) return;
    axios
      .get(`${process.env.REACT_APP_BASE_API_URL}/api/caseStudies/` + id, {
        withCredentials: true,
      })
      .then((res) => {
        caseStudy = createCaseFromData(
          res.data._id,
          res.data.title,
          res.data.desc,
          res.data.authors,
          res.data.submitter,
          res.data.date,
          res.data.page,
          res.data.status,
          res.data.isPaidCase,
          res.data.classId,
          res.data.discipline,
          res.data.subjects,
          res.data.files,
          res.data.comityMemberReviews,
          res.data.approvalDecision,
          res.data.comments,
          res.data.ratings,
          res.data.votes
        );

        SetCaseStudy({ ...caseStudy });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      {caseStudy && (
        <div id="newCase">
          <div id="generalCaseInfo">
            <div>Cas: {caseStudy.id_}</div>
            <div>Titre: {caseStudy.title}</div>
            <div id="caseLastRow">
              <div>Auteur: {caseStudy.authors} </div>
              <div>Reçu le: {caseStudy.date} </div>
            </div>
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              const files = caseStudy!!.files.map((document) => document.file); // TODO rename casestudy.files to documents, this is way too confusing...
              handleDownloadAll(files)}
            }
          >
            <FileDownloadIcon /> TOUT TÉLÉCHARGER
          </Button>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Documents soumis par l'auteur</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <NewCaseTable documents={caseStudy.files} />
              </Typography>
            </AccordionDetails>
          </Accordion>
          <br />

          {/* PREAPPROVAL */}
          <UnlockAccess
            role={[Role.Deputy]}
            children={
              (caseStudy as Case).status == CaseStep.WaitingPreApproval && (
                <DeputyFeedback caseData={caseStudy as Case}></DeputyFeedback>
              )
            }
          ></UnlockAccess>

          {/* COMITY APPROVAL */}
          <UnlockAccess
            role={[Role.Comity]}
            children={
              (caseStudy as Case).status == CaseStep.WaitingComity && (
                <ComityFeedback caseData={caseStudy as Case}></ComityFeedback>
              )
            }
          ></UnlockAccess>

          {/* COMITY DIRECTOR APPROVAL */}
          <UnlockAccess
            role={[Role.ComityDirector]}
            children={
              (caseStudy as Case).status == CaseStep.WaitingComity && (
                <ComityDirectorFeedback
                  caseData={caseStudy as Case}
                ></ComityDirectorFeedback>
              )
            }
          ></UnlockAccess>

          {/* CATALOGUE ADD SECTION*/}
          <UnlockAccess
            role={[Role.PolyPress]}
            children={
              (caseStudy as Case).status == CaseStep.WaitingCatalogue && (
                <PressFeedback caseData={caseStudy as Case}></PressFeedback>
              )
            }
          ></UnlockAccess>
        </div>
      )}
    </div>
  );
}

export default NewCase;
