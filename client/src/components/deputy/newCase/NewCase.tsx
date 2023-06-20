import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Radio,
  FormControl,
  RadioGroup,
  TextField,
  Select,
  MenuItem,
  FormLabel,
} from "@mui/material";
import React from "react";
import "./NewCase.scss";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Case } from "../../../model/CaseStudy";
import { useLocation, useNavigate } from "react-router-dom";
import NewCaseTable from "./NewCaseTable";
import axios from "axios";
import { CaseStep } from "../../../model/enum/CaseStatus";
import { CaseFeedback } from "./CaseFeedback";

export const checkList: string[] = [
  "L’étude de cas est en format Word.",
  "L’étude de cas respecte le gabarit fourni.",
  "Les notes pédagogiques sont incluses dans l’étude de cas.",
  "Toutes les sections dans le gabarit sont dûment remplies.",
  "La matière semble pertinente au génie, aux sciences ou à la technologie.",
  "La qualité rédactionnelle est satisfaisante.",
  "Le formulaire de consentement est dûment rempli (signatures, dates, etc.)",
  "Tous les fichiers pertinents à l’étude de cas sont présents (données, annexes, outils, etc.)",
];

export const comityCriteria: string[] = [
  "Pertinence du cas",
  "Documentation et cadre d'analyse",
  "Cohérence entre les sections",
  "Style",
  "Apport d'un point de vue pédagogique"
];

const APPROVED_STR: string = "approved";
const MAJOR_STR: string = "major";
const MINOR_STR: string = "minor";
const REJECT_STR: string = "rejected";

function NewCase() {
  const state = useLocation().state as any;
  const newCase = state ? (state.caseStudy as Case) : state;
  const navigate = useNavigate();

  const [checkedState, setCheckedState] = React.useState<boolean[]>(new Array(checkList.length).fill(false));
  const isApproved = false;

  const [decision, setDecision] = React.useState("");

  const [urlValue, setURLValue] = React.useState("");

  const handleVerifyCheck = (index: number) => {
    const updatedCheckedState = checkedState.map((item: boolean, i) => {
      return index === i ? !item : item
    });
    setCheckedState(updatedCheckedState);

    let isApproved = true;
    updatedCheckedState.forEach((item) => {
      isApproved = isApproved && item;
    });
  }

  const onDecisionChanged = (e: any) => {
    setDecision(e.target.value);
  }

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

  const onDecisionSubmit = (e: any) => {
    e.preventDefault();

    let feedback: CaseFeedback[] = [];

    for (let i = 0; i < comityCriteria.length; i++)
    {
      feedback.push({
        criteria: comityCriteria[i],
        rating: e.target.elements["rating" + i].value,
        comments: e.target.elements["comments" + i].value
      });
    }

    feedback.push({
      criteria: "Other",
      comments: e.target.elements.otherComments.value
    });

    // TODO : HANDLE FEEDBACK
    // console.log(feedback)

    sendCaseStudyResponse(decision === APPROVED_STR);
  }

  const sendCaseStudyResponse = (approved: boolean) => {
    axios
      .post(
        `${process.env.REACT_APP_BASE_API_URL}/api/caseStudies/approvalResult`,
        {
          case: newCase.id_,
          approved: approved,
          url: urlValue
        },
        {
          withCredentials: true,
        }
      )
      .then(() => {
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
                      checked={checkedState[index]}
                      onChange={() => handleVerifyCheck(index)}
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
                <Button variant="contained" onClick={() => sendCaseStudyResponse(isApproved)}>
                  Compléter
                </Button>
              </Typography>
            </AccordionDetails>
          </Accordion>
          )}

          {/* COMITY APPROVAL */}
          {((newCase as Case).status == CaseStep.WaitingComity &&
            <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography>Approuver le cas</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <b>
                  Le processus d'évaluation a trois objectifs : <br />
                  &emsp;1. L'évaluation des études de cas par des spécialistes pour aider la direction du LAC à prendre une décision;<br />
                  &emsp;2. Fournir aux auteurs une rétroaction constructive;<br />
                  &emsp;3. Déterminer si le cas est suffisamment pertinent pour être publié aux Presses internationales Polytechniques. 
                  Si vous jugez que ce n’est pas le cas, les auteurs pourraient être redirigés vers le libre accès. <br /><br />
                  Nous vous prions de lire l’étude de cas dans un esprit d'aide aux auteurs.<br />
                </b>
                <form className="radio-form-control" onSubmit={onDecisionSubmit} id="feedbackForm">
                  {comityCriteria.map((criteria, index) => (
                    <div>
                      <div className="criteria-box">
                        <p style={{width: "40%"}}>{criteria}</p>
                        <RadioGroup row name={"rating" + index}>
                          <FormControlLabel control={<Radio />} value="1" label="1" labelPlacement="bottom"/>
                          <FormControlLabel control={<Radio />} value="2" label="2" labelPlacement="bottom"/>
                          <FormControlLabel control={<Radio />} value="3" label="3" labelPlacement="bottom"/>
                          <FormControlLabel control={<Radio />} value="4" label="4" labelPlacement="bottom"/>
                          <FormControlLabel control={<Radio />} value="5" label="5" labelPlacement="bottom"/>
                        </RadioGroup>
                      </div>
                      <TextField 
                        multiline
                        rows={4}
                        margin="dense"
                        label="Commentaires"
                        name={"comments" + index}
                        type="text"
                        fullWidth
                      />
                      <br /><br /><br />
                    </div>
                  ))}

                  <p>Autres commentaires</p>
                  <TextField 
                    multiline
                    rows={4}
                    margin="dense"
                    label="Autres commentaires"
                    name="otherComments"
                    type="text"
                    fullWidth
                  />
                </form>
                <br />
                <br />
                <div>
                  <b>
                    L’auteur sera avisé par courriel du statut de suivi de son
                    dossier. <br />
                  </b>
                  <p>*si le cas est rejeté, vous pouvez suggérer de le publier en libre accès, le cas échéant.</p><br />
                </div>
                <div className="decision-actions">
                  <FormControl>
                    <FormLabel>Décision</FormLabel>
                    <Select
                      label="Label"
                      name="decision"
                      value={decision}
                      onChange={onDecisionChanged}
                      style={{width: '300px'}}
                    >
                      <MenuItem value={APPROVED_STR}>Publication dans l'état</MenuItem>
                      <MenuItem value={MAJOR_STR}>Publication avec révision majeure</MenuItem>
                      <MenuItem value={MINOR_STR}>Publication avec révision mineure</MenuItem>
                      <MenuItem value={REJECT_STR}>Rejet</MenuItem>
                    </Select>
                  </FormControl>
                  <Button variant="contained" disabled={decision.length == 0} type="submit" form="feedbackForm">
                    Compléter
                  </Button>
                </div>
              </Typography>
            </AccordionDetails>
          </Accordion>
          )}

          {/* CATALOGUE ADD SECTION*/}
          {((newCase as Case).status == CaseStep.WaitingCatalogue && 
            <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography>Ajouter au catalogue</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <div>
                  <b>
                    À noter que cette étape est irréversible; l'étude de cas sera disponible dans le catalogue
                    après avoir confirmé. <br /> <br />
                  </b>
                </div>
                {((newCase as Case).isPaidCase &&
                <FormControl>
                  <FormLabel>Comme l'étude de cas est payante, veuillez entrer l'URL de la page PIP correspondante :</FormLabel>
                  <TextField
                    margin="dense"
                    label="URL"
                    name="url"
                    type="text"
                    value={urlValue}
                    onChange={(e) => setURLValue(e.target.value)}
                  />
                  <br />
                </FormControl>
                )}
                <div />
                <Button variant="contained" onClick={() => sendCaseStudyResponse(true)}>
                  Confirmer
                </Button>
              </Typography>
            </AccordionDetails>
          </Accordion>
          )}
      </div>
    )
  );
}

export default NewCase;
