import * as React from "react";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { TeacherValidate } from "../../../model/TeacherValidate";
import axios from "axios";
import { DialogActions, DialogContent } from "@mui/material";

export interface ReviewTeacherProps {
  open: boolean;
  teacher: TeacherValidate;
  imageProof: string;
  onClose: (value: TeacherValidate) => void;
}
export interface TeacherProps {
  teacher: TeacherValidate;
  onCloseDialog: () => void;
}

function ReviewDialog(props: ReviewTeacherProps) {
  const { onClose, teacher, open } = props;

  const sendResult = async (isApproved: boolean) => {
    axios
      .post(
        `${process.env.REACT_APP_BASE_API_URL}/api/users/approvalResult`,
        {
          email: teacher.email,
          approved: isApproved,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        onClose(teacher);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handSendResult = (isApproved: boolean) => {
    sendResult(isApproved);
    onClose(teacher);
  };

  const handleClose = (isApproved: boolean) => {
    onClose(teacher);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Traiter la requête du professeur {teacher.name}</DialogTitle>
      <DialogContent>
        {props.imageProof && <img src={props.imageProof} alt="proof" />}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handSendResult(true)} variant="contained">
          Approuver
        </Button>
        <Button onClick={() => handSendResult(false)} variant="contained">
          Refuser
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function ReviewTeacher(teacherProp: TeacherProps) {
  const [open, setOpen] = React.useState(false);
  const [imageProof, setImageProof] = React.useState("");

  const getTeacherProof = (teacherEmail: string) => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_API_URL}/api/users/proof/${teacherEmail}`,
        {
          withCredentials: true,
          responseType: "arraybuffer",
        }
      )
      .then((res) => {
        setOpen(true);
        const base64 = window.btoa(
          new Uint8Array(res.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );

        setImageProof(`data:;base64,${base64}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClickOpen = () => {
    getTeacherProof(teacherProp.teacher.email);
  };

  const handleClose = (teacher: TeacherValidate) => {
    setOpen(false);
    teacherProp.onCloseDialog();
  };

  return (
    <div>
      <br />
      <Button variant="outlined" onClick={handleClickOpen}>
        Obtenir la preuve
      </Button>
      <ReviewDialog
        teacher={teacherProp.teacher}
        imageProof={imageProof}
        open={open}
        onClose={handleClose}
      />
    </div>
  );
}
