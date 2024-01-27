import React from "react";
import "./InviteItem.scss";
import { Button, ListItem, ListItemText, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import DoneIcon from '@mui/icons-material/Done';
import axios from "axios";

interface Props {
  caseData: any;
  userData: any;
}

const InviteItem: React.FC<Props> = ({ caseData, userData }) => {
  const [disabled, setDisabled] = React.useState(false);

  const onSendInvite = () => {
    axios
      .post(
        `${process.env.REACT_APP_BASE_API_URL}/api/caseStudies/addReviewer/${caseData.id_}`,
        { email: userData.email },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setDisabled(true);
          caseData.reviewers.push(userData.email);
        }
      });
  };

  return (
    <ListItem className="invite-card">
      <ListItemText
        className="label-layout"
        primary={
          <div className="primary-row">
            <Typography className="reviewer-label" variant="h4">
              {userData.firstName + " " + userData.lastName}
            </Typography>
            {caseData.reviewGroups[caseData.version].comityMemberReviews.some(
              (review: { reviewAuthor: any; }) => review.reviewAuthor === userData.email
            ) &&
              <DoneIcon className="doneIcon"/>
            }
          </div>
        }
        secondary={
          <Typography className="reviewer-label" variant="caption">
            {userData.email}
          </Typography>
        }
      />


      <Button
        className="invite-btn"
        variant="contained"
        disabled={
          (caseData.reviewers && caseData.reviewers.includes(userData.email)) ||
          disabled
        }
        onClick={onSendInvite}
      >
        <SendIcon />
      </Button>
    </ListItem>
  );
};

export default InviteItem;
