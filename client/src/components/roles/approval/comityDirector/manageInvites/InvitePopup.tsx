import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  Divider,
} from "@mui/material";
import axios from "axios";
import React, { forwardRef, useImperativeHandle } from "react";
import { User } from "../../../../../model/User";
import InviteItem from "./InviteItem";
import "./InvitePopup.scss";
import { Case } from "../../../../../model/CaseStudy";

export interface Props {
  caseData: Case;
}
export interface InvitePopupRef {
  setPopupOpen(): void;
}

const InvitePopup = forwardRef<InvitePopupRef, Props>((props, ref) => {
  useImperativeHandle(ref, () => ({
    setPopupOpen() {
      setOpen(true);
    },
  }));

  const [open, setOpen] = React.useState(false);
  const [members, setMembers] = React.useState<User[]>([]);

  const getCommitteeMembers = async () => {
    axios
      .get(`${process.env.REACT_APP_BASE_API_URL}/api/users/committeeMembers`, {
        withCredentials: true,
      })
      .then((res) => {
        setMembers(res.data.data.users);
      });
  };

  React.useEffect(() => {
    getCommitteeMembers();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog id="members-dialog" open={open} onClose={handleClose}>
      <DialogTitle>
        <Typography variant="h4">
          Inviter des membres à évaluer cette étude de cas
        </Typography>
      </DialogTitle>
      <DialogContent>
        <List id="members-list">
          <Divider></Divider>
          {members &&
            members.map((member, index) => (
              <div>
                <InviteItem
                  key={index}
                  userData={member}
                  caseData={props.caseData}
                />
                <Divider></Divider>
              </div>
            ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
});

export default InvitePopup;
