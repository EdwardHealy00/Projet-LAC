import { Card, Typography, Button } from "@mui/material";
import { getApprovalDecision } from "../../../utils/ApprovalDecision";
import { getDecisionColor } from "../../../utils/ApprovalDecision";
import { handleDownloadAll } from "../../../utils/FileDownloadUtil";
import { ComityMemberReview } from "../../deputy/newCase/CaseFeedback";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import React from "react";
import "./ReviewCard.scss"

interface ReviewCardProps {
    review: ComityMemberReview;
    index: number;
  }
  
  const ReviewCard: React.FC<ReviewCardProps> = ({ review, index }) => {
    return (
      <Card id="review-card" key={index}>
        <Typography variant="h4">
          <b>
            Évaluation #{index + 1} par {review.reviewAuthor}
          </b>
        </Typography>
        <br/>
        {review.caseFeedback.map((feedback, innerIndex) => (
          <div key={innerIndex} className="criteria-summary">
            {feedback.criteria !== "Autre" && (
              <Typography className="criteria-title">
                <b>{feedback.criteria}: </b>{feedback.rating}/5
              </Typography>
            )}
            {(feedback.criteria === "Autre" && feedback.comments != "") && (
              <Typography><b>{feedback.criteria}:</b></Typography>
            )}
            <Typography sx={{ wordBreak: "break-word" }}>{feedback.comments}</Typography>
          </div>
        ))}
        <div className="download-option">
          <Typography>
           <b>Documents annotés déposés ({review.annotatedFiles.length}):</b>
          </Typography>
          {review.annotatedFiles.length > 0 && (
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                handleDownloadAll(review.annotatedFiles);
              }}
            >
              <FileDownloadIcon />
            </Button>
          )}
        </div>
        <div className="approval-decision">
          <Typography variant="h5" color={getDecisionColor(review.decision)}>
            <b>{getApprovalDecision(review.decision)}</b>
          </Typography>
        </div>
      </Card>
    );
  }

  export default ReviewCard;