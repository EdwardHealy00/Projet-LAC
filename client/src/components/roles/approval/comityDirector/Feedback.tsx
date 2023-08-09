import React from "react";
import { SingleCaseProp } from "../../../../model/CaseStudy";
import {
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
import { handleDownloadAll } from "../../../../utils/FileDownloadUtil";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

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
      <div id="review-grid">
      {newCase.comityMemberReviews.map((review, index) => (
        <Card key={index} className="review-title">
          <Typography>
            <b>
              Évaluation #{index + 1} par {review.reviewAuthor}
            </b>
          </Typography>
          {review.caseFeedback.map((feedback, innerIndex) => (
            <div key={innerIndex} className="criteria-summary">
              {feedback.criteria !== "Autre" && (
                <Typography className="criteria-title">
                  {feedback.criteria}: {feedback.rating}/5
                </Typography>
              )}
              {feedback.criteria === "Autre" && (
                <Typography>{feedback.criteria}:</Typography>
              )}
              <Typography>{feedback.comments}</Typography>
            </div>
          ))}
          <div className="criteria-summary">
            {review.decision == 0 && (
              <Typography>
                <b>Approuvée</b>
              </Typography>
            )}
            {review.decision == 1 && (
              <Typography>
                <b>Changements majeurs requis</b>
              </Typography>
            )}
            {review.decision == 2 && (
              <Typography>
                <b>Changements mineurs requis</b>
              </Typography>
            )}
            {review.decision == 3 && (
              <Typography>
                <b>Refusée</b>
              </Typography>
            )}
          </div>
          <div id="download-option">
          <Typography> Documents annotés déposés <b>({review!!.annotatedFiles.length})</b></Typography>
          {review!!.annotatedFiles.length > 0 &&
            <Button
            variant="contained"
            color="primary"
            onClick={() => {
              console.log(newCase.comityMemberReviews)
              handleDownloadAll(review!!.annotatedFiles)}}
          >
            <FileDownloadIcon />
          </Button>
          }
          </div>
        </Card>
      ))}
      </div>
      

      <div className="submit-info">
        <Typography>
          <b>
            L’auteur sera avisé par courriel du statut de suivi de son dossier.
          </b>
          <br /> *si le cas est rejeté, vous pouvez suggérer de le publier en
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
