import React from "react";
import { SingleCaseProp } from "../../../../model/CaseStudy";
import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, FormControlLabel, FormGroup, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

export default function DeputyFeedback(caseData: SingleCaseProp) {
    const newCase = caseData.caseData;
    const navigate = useNavigate();

    const [checkedState, setCheckedState] = React.useState<boolean[]>(new Array(checkList.length).fill(false));
    const [isApproved, setApproved] = React.useState(false);

    const handleVerifyCheck = (index: number) => {
        const updatedCheckedState = checkedState.map((item: boolean, i) => {
            return index === i ? !item : item
        });
        setCheckedState(updatedCheckedState);

        let approved = true;
        updatedCheckedState.forEach((item) => {
            approved = approved && item;
        });

        setApproved(approved);
    }

    const sendCaseStudyResponse = () => {
        axios
          .post(
            `${process.env.REACT_APP_BASE_API_URL}/api/caseStudies/approvalResult`,
            {
              case: newCase.id_,
              approved: isApproved
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
                <Button variant="contained" onClick={() => sendCaseStudyResponse()}>
                  Compléter
                </Button>
              </Typography>
            </AccordionDetails>
          </Accordion>
    );
}