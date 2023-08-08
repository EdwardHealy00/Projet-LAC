import React from "react";
import { SingleCaseProp } from "../../../../model/CaseStudy";
import { Accordion, AccordionDetails, AccordionSummary, Button, FormControl, FormControlLabel, FormLabel, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import { CaseFeedback } from "../../../deputy/newCase/CaseFeedback";
import { ApprovalDecision } from "../../../../model/enum/ApprovalDecision";
import axios from "axios";

export const comityCriteria: string[] = [
    "Pertinence du cas",
    "Documentation et cadre d'analyse",
    "Cohérence entre les sections",
    "Style",
    "Apport d'un point de vue pédagogique"
  ];

export default function ComityFeedback(caseData: SingleCaseProp) {
    const newCase = caseData.caseData;
    const navigate = useNavigate();
    const [feedback] = React.useState<CaseFeedback[]>(new Array());
    const [decision, setDecision] = React.useState<ApprovalDecision | string>('');
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
          criteria: "Autre",
          comments: e.target.elements.otherComments.value
        });
    
        sendCaseStudyResponse();
    }

    const sendCaseStudyResponse = () => {
        axios
            .post(
                `${process.env.REACT_APP_BASE_API_URL}/api/caseStudies/comityMemberReview`,
                {
                    case: newCase.id_,
                    decision: decision,
                    feedback: feedback,
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
                      <MenuItem value={ApprovalDecision.APPROVED}>Publication dans l'état</MenuItem>
                      <MenuItem value={ApprovalDecision.MAJOR_CHANGES}>Publication avec révision majeure</MenuItem>
                      <MenuItem value={ApprovalDecision.MINOR_CHANGES}>Publication avec révision mineure</MenuItem>
                      <MenuItem value={ApprovalDecision.REJECT}>Rejet</MenuItem>
                    </Select>
                  </FormControl>
                  <Button variant="contained" disabled={decision === ''} type="submit" form="feedbackForm">
                    Compléter
                  </Button>
                </div>
              </Typography>
            </AccordionDetails>
          </Accordion>
    );
}