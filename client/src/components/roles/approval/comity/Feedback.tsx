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
    const [caseStudyFileName, setCaseStudyFileName] = React.useState(
      "Aucun document n'a été téléversé"
    );

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        let fileNames = e.target.files[0].name;
        for (let i = 1; i < e.target.files.length; i++) {
          fileNames += ", " + e.target.files[i].name;
        }
        setCaseStudyFileName(fileNames);
      }
    };

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

        const formData = new FormData();
        Array.from(e.target.elements.annotatedFiles.files).forEach(file => formData.append('files[]', (file as Blob)));
        formData.append('decision', JSON.stringify(decision));
        formData.append('feedback', JSON.stringify(feedback));

        sendCaseStudyResponse(formData);
    }

    const sendCaseStudyResponse = (formData: FormData) => {
        axios
            .post(
                `${process.env.REACT_APP_BASE_API_URL}/api/caseStudies/comityMemberReview/${newCase.id_}`,
                formData,
                {
                    withCredentials: true,
                }
            )
            .then(() => {
                navigate("/catalogue");
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
                  <Button variant="contained" component="label">
                  Téléverser des documents annotés
                  <input
                    hidden
                    accept=".docx"
                    type="file"
                    onChange={handleFileUpload}
                    name="annotatedFiles"
                    multiple
                  />
              </Button>
              {caseStudyFileName && <span>{caseStudyFileName}</span>}
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