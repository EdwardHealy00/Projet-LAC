import React from "react";
import { SingleCaseProp } from "../../../../model/CaseStudy";
import {
  Accordion,
  AccordionSummary,
  Button,
  Card,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ApprovalDecision } from "../../../../model/enum/ApprovalDecision";
import axios from "axios";
import { getApprovalDecision } from "../../../../utils/ApprovalDecision";
import ReviewCard from "../ReviewCard";

export const comityCriteria: string[] = [
  "Pertinence du cas",
  "Documentation et cadre d'analyse",
  "Cohérence entre les sections",
  "Style",
  "Apport d'un point de vue pédagogique",
];

export default function ComityDirectorFeedback(caseData: SingleCaseProp) {
  const newCase = caseData.caseData;
  const navigate = useNavigate();
  const [decision, setDecision] = React.useState<ApprovalDecision | string>("");
  const onDecisionChanged = (e: any) => {
    setDecision(e.target.value);
  };

  const onDecisionSubmit = (e: any) => {
    e.preventDefault();

    axios
      .post(
        `${process.env.REACT_APP_BASE_API_URL}/api/caseStudies/FinalReview`,
        {
          case: newCase.id_,
          decision: decision,
          comments: e.target.elements.Comments.value,
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
      <div>
        {newCase.reviewGroups.map((reviewGroup, version) => (
          <div key={version}>
            {version !== newCase.version && (
              <Accordion>
                <AccordionSummary>
                  <Typography>Version #{version + 1}</Typography>
                </AccordionSummary>
                <div className="review-grid">
                  {reviewGroup.comityMemberReviews.map((review, index) => (
                    <ReviewCard review={review} index={index}/>
                  ))}
                </div>
                <div className="director-comments">
                  <div className="director-title">
                    <Typography variant="h5">
                      Commentaires de la direction
                    </Typography>
                  </div>
                  <Typography>{reviewGroup.directorComments}</Typography>
                  <Typography>
                    <b>
                      {getApprovalDecision(
                        reviewGroup.directorApprovalDecision
                      )}
                    </b>
                  </Typography>
                </div>
              </Accordion>
            )}
          </div>
        ))}

        <div key={newCase.version} id="current-version">
          <Typography variant="h5">Version courante</Typography>
          <div className="review-grid">
            {newCase.reviewGroups[newCase.version].comityMemberReviews.map(
              (review, index) => (
                <ReviewCard review={review} index={index}/>
              )
            )}
          </div>
        </div>
      </div>

      <div className="submit-info">
        <Typography>
          <b>
            L’auteur sera avisé par courriel du statut de suivi de son dossier.
          </b>
          <br /> *Si le cas est rejeté, vous pouvez suggérer de le publier en
          libre accès, le cas échéant.
        </Typography>
      </div>

      <form
        className="radio-form-control"
        onSubmit={onDecisionSubmit}
        id="finalFeedbackForm"
      >
        <Typography>Commentaires</Typography>
        <TextField
          multiline
          rows={4}
          margin="dense"
          label="Commentaires"
          name="Comments"
          type="text"
          fullWidth
        />

        <div className="decision-actions">
          <FormControl>
            <FormLabel>Décision</FormLabel>
            <Select
              label="Label"
              name="decision"
              value={decision}
              onChange={onDecisionChanged}
              style={{ width: "300px" }}
              className="decision-element"
            >
              <MenuItem value={ApprovalDecision.APPROVED}>
                Publication dans l'état
              </MenuItem>
              <MenuItem value={ApprovalDecision.MAJOR_CHANGES}>
                Publication avec révision majeure
              </MenuItem>
              <MenuItem value={ApprovalDecision.MINOR_CHANGES}>
                Publication avec révision mineure
              </MenuItem>
              <MenuItem value={ApprovalDecision.REJECT}>Rejet</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            disabled={decision === ""}
            type="submit"
            form="finalFeedbackForm"
            className="decision-element"
          >
            Compléter
          </Button>
        </div>
      </form>
    </div>
  );
}

