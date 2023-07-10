import { Accordion, AccordionSummary, Typography, AccordionDetails, Button } from "@mui/material";
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

function NewCase() {
  const state = useLocation().state as any;
  const newCase = state ? (state.caseStudy as Case) : state;

  const handleDownloadAll = (files: any[]) => {
    for (let i = 0; i < files.length; i++) {
      axios
      .get(
        `${process.env.REACT_APP_BASE_API_URL}/api/caseStudies/download/` +
          files[i].file.filename,
        {
          withCredentials: true,
          responseType: "arraybuffer",
        }
      )
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", files[i].file.originalname); //or any other extension
        document.body.appendChild(link);
        link.click();
      });
    }
  };

  return (
    newCase && (
      <div id="newCase">
        <div id="generalCaseInfo">
          <div>Cas: {newCase.id_}</div>
          <div>Titre: {newCase.title}</div>
          <div id="caseLastRow">
            <div>Auteur: {newCase.author} </div>
            <div>Reçu le: {newCase.date} </div>
          </div>
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleDownloadAll(newCase.files)}
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
              <NewCaseTable documents={newCase.files} />
            </Typography>
          </AccordionDetails>
        </Accordion>
        <br />

        {/* PREAPPROVAL */}
        {((newCase as Case).status == CaseStep.WaitingPreApproval &&
          <DeputyFeedback caseData={newCase as Case}></DeputyFeedback>  
        )}

        {/* COMITY APPROVAL */}
        {((newCase as Case).status == CaseStep.WaitingComity &&
          <ComityFeedback caseData={newCase as Case}></ComityFeedback>
        )}

          {/* CATALOGUE ADD SECTION*/}
          {((newCase as Case).status == CaseStep.WaitingCatalogue && 
            <PressFeedback caseData={newCase as Case}></PressFeedback>
          )}
      </div>
    )
  );
}

export default NewCase;
