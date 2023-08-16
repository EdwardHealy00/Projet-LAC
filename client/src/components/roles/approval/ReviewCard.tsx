import { Card, Typography, Button } from "@mui/material";
import { getApprovalDecision } from "../../../utils/ApprovalDecision";
import { handleDownloadAll } from "../../../utils/FileDownloadUtil";
import { ComityMemberReview } from "../../deputy/newCase/CaseFeedback";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import React from "react";

interface ReviewCardProps {
    review: ComityMemberReview;
    index: number;
  }
  
  const ReviewCard: React.FC<ReviewCardProps> = ({ review, index }) => {
    return (
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
          <Typography>
            <b>{getApprovalDecision(review.decision)}</b>
          </Typography>
        </div>
        <div className="download-option">
          <Typography>
            Documents annotés déposés <b>({review.annotatedFiles.length})</b>
          </Typography>
          {review.annotatedFiles.length > 0 && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                handleDownloadAll(review.annotatedFiles);
              }}
            >
              <FileDownloadIcon />
            </Button>
          )}
        </div>
      </Card>
    );
  }

  export default ReviewCard;