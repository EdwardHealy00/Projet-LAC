import { Accordion, AccordionSummary, Typography, AccordionDetails, Button, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import React from "react";
import { Document } from "../../../model/Document";
import "./NewCase.scss";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import NewCaseTable from "./NewCaseTable";
import { CaseStep } from "../../../model/enum/CaseStatus";
import { Case } from "../../../model/CaseStudy";

function createData(
  id_: number,
  documentType: string,
  title: string,
  type: string,
  format: string,
  addedOn: string,
): Document {
  return { id_, documentType, title, type, format, addedOn };
}

const documents: Document[] = [
  createData(
    1,
    "Étude de cas",
    "Mesurer la qualité des produits dans les simulations ABC",
    "Obligatoire",
    "Document Word (.docx)",
    "2022/05/15"
  ),
  createData(
    2,
    "Formulaire d’autorisation de publication",
    "Autorisation de publication Entreprise ABC",
    "Obligatoire",
    "Document PDF",
    "2022/05/23"
  ),
  createData(
    3,
    "Autre",
    "Données Entreprise ABC",
    "Volontaire",
    "Document Excel (.xlsx)",
    "2022/05/15"
  ),
  createData(
    4,
    "Autre",
    "Modèle de simulation Entreprise ABC",
    "Volontaire",
    "Fichier Arena (.doe)",
    "2022/05/15"
  ),
];

const newCase: Case = {
  id_: 53,
  title: "Mesurer la qualité des produits dans les simulations ABC",
  author: "Jane Doe",
  submittedDate: "2022/05/23",
  status: CaseStep.WaitingPreApproval,
  documents: documents,
  isPaidCase: true,
  classId: "INF1900",
  file: "",
};

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
    "Tous les fichiers pertinents à l’étude de cas sont présents (données, annexes, outils, etc.)"
]

function NewCase() {
  return (
    <div id="newCase">
      <div id="generalCaseInfo">
        <div>Cas: {newCase.id_}</div>
        <div>Titre: {newCase.title}</div>
        <div id="caseLastRow">
          <div>Auteur: {newCase.author} </div>
          <div>Reçu le: {newCase.submittedDate} </div>
        </div>
      </div>
      <Button variant="contained" color="primary">
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
            <NewCaseTable documents={documents} />
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
              {checkList.map((criteria) => (
                <FormControlLabel control={<Checkbox />} label={criteria} />
              ))}
            </FormGroup>
            <div>
              <b>
                L’auteur sera avisé par courriel du statut de suivi de son
                dossier. <br />
                Si certains critères n’ont pas été respectés, l’auteur
                sera avisé des modifications à effectuer.
              </b>
            </div>
            <Button variant="contained">Compléter</Button>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default NewCase;
