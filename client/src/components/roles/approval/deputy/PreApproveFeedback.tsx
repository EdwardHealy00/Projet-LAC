import React from "react";
import { SingleCaseProp } from "../../../../model/CaseStudy";
import { Criteria } from "../../../../model/enum/Criteria";
import {
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Feedback.scss";

export const checkList = Object.values(Criteria).filter(
  (value) => typeof value === "string"
);

export default function PreApproveFeedback(caseData: SingleCaseProp) {
  const newCase = caseData.caseData;
  const navigate = useNavigate();
  const [checkedState, setCheckedState] = React.useState<boolean[]>(
    new Array(checkList.length).fill(false)
  );
  const [isApproved, setApproved] = React.useState(false);
  const [failedCriterias] = React.useState<number[]>(new Array());

  const handleVerifyCheck = (index: number) => {
    const updatedCheckedState = checkedState.map((item: boolean, i) => {
      return index === i ? !item : item;
    });
    setCheckedState(updatedCheckedState);

    let approved = true;
    failedCriterias.splice(0);
    updatedCheckedState.forEach((item, index) => {
      approved = approved && item;
      if (!item) {
        failedCriterias.push(index);
      }
    });

    setApproved(approved);
  };

  const sendCaseStudyResponse = () => {
    axios
      .post(
        `${process.env.REACT_APP_BASE_API_URL}/api/caseStudies/approvalResult`,
        {
          case: newCase.id_,
          approved: isApproved,
          failedCriterias: failedCriterias,
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
    <div>
      <Typography variant="h4">Préapprouver le cas</Typography>
      <Card id="preapprove-card">
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
        <Typography>
          <b>
            L’auteur sera avisé par courriel du statut de suivi de son dossier.{" "}
            <br />
            Si certains critères n’ont pas été respectés, l’auteur sera avisé
            des modifications à effectuer.
          </b>
        </Typography>
        <Button variant="contained" disabled={!isApproved} onClick={() => sendCaseStudyResponse()}>
          Préapprouver l'étude de cas
        </Button>
        <Button variant="contained" color="error" disabled={isApproved} onClick={() => sendCaseStudyResponse()}>
          Rejeter l'étude de cas
        </Button>
      </Card>
    </div>
  );
}
