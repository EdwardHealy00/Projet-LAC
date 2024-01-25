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
import {
  getApprovalDecision,
  getDecisionColor,
} from "../../../../utils/ApprovalDecision";
import ReviewCard from "../ReviewCard";
import { ExpandMore } from "@mui/icons-material";
import "./Feedback.scss";
import { navToCorrectTab } from "../../../../utils/NavigationUtils";
import ConfirmChangesDialog from "../../../../utils/ConfirmChangesDialog";

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
  const [comments, setComments] = React.useState<string>("");

  const [
    confirmChangesDialogOpen,
    setConfirmChangesDialogOpen,
  ] = React.useState(false);

  const openConfirmChangesDialog = (e: any) => {
    e.preventDefault();
    const reviewComments = e.target.elements.Comments.value;
    setComments(reviewComments);
    setConfirmChangesDialogOpen(true);
  };

  const handleConfirmChangesDialogClose = () => {
    setConfirmChangesDialogOpen(false);
  };

  const onDecisionChanged = (e: any) => {
    setDecision(e.target.value);
  };

  const onDecisionSubmit = () => {
    axios
      .post(
        `${process.env.REACT_APP_BASE_API_URL}/api/caseStudies/FinalReview`,
        {
          case: newCase.id_,
          decision: decision,
          comments: comments,
        },
        {
          withCredentials: true,
        }
      )
      .then(() => {
        navToCorrectTab("/approval", navigate, newCase);
      });
  };

  return (
    <div>
      <div>
        <Typography variant="h4">Évaluations des membres du comité</Typography>
        {newCase.reviewGroups.map((reviewGroup, version) => (
          <div id="version-accordion" key={version}>
            {version !== newCase.version && (
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>Version #{version + 1}</Typography>
                </AccordionSummary>
                <div className="review-grid">
                  {reviewGroup.comityMemberReviews.map((review, index) => (
                    <ReviewCard review={review} index={index} />
                  ))}
                </div>
                {reviewGroup.comityMemberReviews
                  .length === 0 && (
                  <div className="empty-section">
                    <Typography variant="caption">
                      Aucune évaluation n'a été effectué
                    </Typography>
                  </div>
                )}
                <div className="director-comments">
                  <div className="director-title">
                    <Typography variant="h4">
                      Commentaires de la direction
                    </Typography>
                  </div>
                  <Typography sx={{ wordBreak: "break-word" }} variant="body1">
                    {reviewGroup.directorComments}
                  </Typography>
                  <Typography
                    color={getDecisionColor(
                      reviewGroup.directorApprovalDecision
                    )}
                  >
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

        <div key={newCase.version}>
          <Accordion defaultExpanded={true}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>
                <b>Version courante</b>
              </Typography>
            </AccordionSummary>
            <div className="review-grid">
              {newCase.reviewGroups[newCase.version].comityMemberReviews.map(
                (review, index) => (
                  <ReviewCard review={review} index={index} />
                )
              )}
            </div>
            {newCase.reviewGroups[newCase.version].comityMemberReviews
              .length === 0 && (
              <div className="empty-section">
                <Typography variant="caption">
                  Aucune évaluation n'a été effectué
                </Typography>
              </div>
            )}
          </Accordion>
        </div>
      </div>

      <div id="final-feedback">
        <Typography variant="h4">Faire l'évaluation finale du cas</Typography>
        <Card id="final-feedback-card">
          <form onSubmit={openConfirmChangesDialog} id="finalFeedbackForm">
            <Typography>
              <b>Commentaires</b>
            </Typography>
            <TextField
              multiline
              rows={4}
              margin="dense"
              label="Commentaires"
              name="Comments"
              type="text"
              fullWidth
            />

            <div className="director-footer">
              <div className="decision-actions">
                <FormControl>
                  <FormLabel>
                    <b>Décision</b>
                  </FormLabel>
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
                      Demande de révisions majeures
                    </MenuItem>
                    <MenuItem value={ApprovalDecision.MINOR_CHANGES}>
                      Demande de révisions mineures
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
              <div className="submit-info">
                <Typography>
                  <b>
                    L’auteur sera avisé par courriel du statut de suivi de son
                    dossier.
                  </b>
                  <br /> *Si le cas est rejeté, vous pouvez suggérer de le
                  publier en libre accès, le cas échéant.
                </Typography>
              </div>
            </div>
          </form>
        </Card>
      </div>
      <ConfirmChangesDialog
        open={confirmChangesDialogOpen}
        onClose={handleConfirmChangesDialogClose}
        onConfirm={onDecisionSubmit}
      />
    </div>
  );
}
