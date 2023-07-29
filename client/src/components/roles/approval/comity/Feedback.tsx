import React from "react";
import { SingleCaseProp } from "../../../../model/CaseStudy";
import { Accordion, AccordionDetails, AccordionSummary, Button, FormControl, FormControlLabel, FormLabel, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import { CaseFeedback } from "../../../deputy/newCase/CaseFeedback";
import axios from "axios";

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

export default function ComityFeedback(caseData: SingleCaseProp) {
    const newCase = caseData.caseData;
    const navigate = useNavigate();
    const [feedback] = React.useState<CaseFeedback[]>(new Array());
    const [decision, setDecision] = React.useState("");
    const onDecisionChanged = (e: any) => {
        setDecision(e.target.value);
    }

    const onDecisionSubmit = (e: any) => {
        e.preventDefault();
    
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
    
        sendCaseStudyResponse();
    }

    const sendCaseStudyResponse = () => {
        axios
            .post(
                `${process.env.REACT_APP_BASE_API_URL}/api/caseStudies/approvalResult`,
                {
                    case: newCase.id_,
                    approved: decision === APPROVED_STR,
                    decision: decision,
                    feedback: feedback
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
    );
}