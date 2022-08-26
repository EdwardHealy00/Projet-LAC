import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import React from "react";
import "./NewCase.scss";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Case } from "../../../model/CaseStudy";
import { useLocation, useNavigate } from "react-router-dom";
import NewCaseTable from "./NewCaseTable";
import axios from "axios";

const checkList: string[] = [
  "L’étude de cas est en format Word.",
  "L’étude de cas respecte le gabarit fourni.",
  "Les notes pédagogiques sont incluses dans l’étude de cas.",
  "La version étudiante est incluse dans l’étude de cas.",
  "Toutes les sections dans le gabarit sont dûment remplies.",
  "La matière semble pertinente au génie, aux sciences ou à la technologie.",
  "La qualité rédactionnelle est satisfaisante.",
  "Le formulaire d’autorisation de publication est en format PDF.",
  "Le formulaire d’autorisation est dûment rempli (signatures, dates, etc.)",
  "Tous les fichiers pertinents à l’étude de cas sont présents (données, annexes, outils, etc.)",
];

function NewCase() {
  const state = useLocation().state as any;
  const newCase = state ? (state.caseStudy as Case) : state;
  const navigate = useNavigate();

  const handleFileDownload = (documentName: string) => {
    axios
      .get("http://localhost:3001/api/caseStudies/download/" + documentName, {
        withCredentials: true,
        responseType: "arraybuffer",
      })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "file.pdf"); //or any other extension
        document.body.appendChild(link);
        link.click();
      });
  };

  const sendCaseStudyResponse = () => {
    const isCaseStudyApproved = true;
    axios
      .post(
        "http://localhost:3001/api/caseStudies/approvalResult",
        {
          case: newCase.id_,
          approved: isCaseStudyApproved,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res);
        navigate("/approval");
      });
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
          onClick={() => handleFileDownload(newCase.documents[0].file.filename)}
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
              <NewCaseTable documents={newCase.documents} />
            </Typography>
          </AccordionDetails>
        </Accordion>
        <br />
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>Préapprouver le cas</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <FormGroup>
                {checkList.map((criteria, index) => (
                  <FormControlLabel
                    control={<Checkbox />}
                    label={criteria}
                    key={index}
                  />
                ))}
              </FormGroup>
              <div>
                <b>
                  L’auteur sera avisé par courriel du statut de suivi de son
                  dossier. <br />
                  Si certains critères n’ont pas été respectés, l’auteur sera
                  avisé des modifications à effectuer.
                </b>
              </div>
              <Button variant="contained" onClick={sendCaseStudyResponse}>
                Compléter
              </Button>
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>
    )
  );
}

export default NewCase;
