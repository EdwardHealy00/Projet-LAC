import React from "react";
import { SingleCaseProp } from "../../../../model/CaseStudy";
import { Criteria } from "../../../../model/enum/Criteria"
import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, FormControlLabel, FormGroup, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const checkList = Object.values(Criteria).filter(
  (value) => typeof value === "string"
);

export default function DeputyFeedback(caseData: SingleCaseProp) {
    const newCase = caseData.caseData;
    const navigate = useNavigate();
    const [checkedState, setCheckedState] = React.useState<boolean[]>(new Array(checkList.length).fill(false));
    const [isApproved, setApproved] = React.useState(false);
    const [failedCriterias] = React.useState<number[]>(new Array());

    const handleVerifyCheck = (index: number) => {
        const updatedCheckedState = checkedState.map((item: boolean, i) => {
            return index === i ? !item : item
        });
        setCheckedState(updatedCheckedState);

        let approved = true;
        failedCriterias.splice(0);
        updatedCheckedState.forEach((item, index) => {
            approved = approved && item;
            if(!item) {
              failedCriterias.push(index);
            }
        });

        setApproved(approved);
    }

    const sendCaseStudyResponse = () => {
        axios
          .post(
            `${process.env.REACT_APP_BASE_API_URL}/api/caseStudies/approvalResult`,
            {
              case: newCase.id_,
              approved: isApproved,
              failedCriterias: failedCriterias
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