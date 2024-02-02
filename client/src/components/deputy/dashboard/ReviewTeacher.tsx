import * as React from "react";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { TeacherValidate } from "../../../model/UserValidate";
import axios from "axios";
import { DialogActions, DialogContent, Typography } from "@mui/material";
import ConfirmChangesDialog from "../../../utils/ConfirmChangesDialog";
import { downloadPDF, isFilePDF } from "../../../utils/FileDownloadUtil";
import PdfIcon from "@mui/icons-material/PictureAsPdf";

export interface ReviewTeacherProps {
  open: boolean;
  teacher: TeacherValidate;
  imageProof: string;
  isPDF: boolean;
  onClose: (value: TeacherValidate) => void;
}
export interface TeacherProps {
  teacher: TeacherValidate;
  onCloseDialog: () => void;
}

function ReviewDialog(props: ReviewTeacherProps) {
  const { onClose, teacher, open } = props;
  const [isApproved, setIsApproved] = React.useState(false);

  const [
    confirmChangesDialogOpen,
    setConfirmChangesDialogOpen,
  ] = React.useState(false);

  const openConfirmChangesDialogAccept = () => {
    setIsApproved(true);
    setConfirmChangesDialogOpen(true);
  };

  const openConfirmChangesDialogRefuse = () => {
    setIsApproved(false);
    setConfirmChangesDialogOpen(true);
  };

  const handleConfirmChangesDialogClose = () => {
    setConfirmChangesDialogOpen(false);
  };

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

  const handleSendResult = () => {
    sendResult(isApproved);
    onClose(teacher);
  };

  const handleClose = () => {
    onClose(teacher);
  };

  const downloadProof = () => {
    downloadPDF(props.imageProof);
  };


  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>
        <Typography variant="h5">Traiter la requête de l'enseignant {teacher.name}</Typography>
      </DialogTitle>
      <DialogContent>
        {props.imageProof && 
          <div>
            {!props.isPDF &&
            <img
              src={props.imageProof}
              alt="proof"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
            }
            {props.isPDF &&
            <Button onClick={downloadProof} variant="outlined">
              <PdfIcon />
              Télécharger la preuve PDF
            </Button>
            }
          </div>
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={openConfirmChangesDialogAccept} variant="contained">
          Approuver
        </Button>
        <Button
          color="error"
          onClick={openConfirmChangesDialogRefuse}
          variant="contained"
        >
          Refuser
        </Button>
      </DialogActions>
      <ConfirmChangesDialog
        open={confirmChangesDialogOpen}
        onClose={handleConfirmChangesDialogClose}
        onConfirm={handleSendResult}
      />
    </Dialog>
  );
}

export default function ReviewTeacher(teacherProp: TeacherProps) {
  const [open, setOpen] = React.useState(false);
  const [imageProof, setImageProof] = React.useState("");
  const [isPDF, setIsPDF] = React.useState(false);

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
        const arraybuffer = new Uint8Array(res.data);
        setIsPDF(isFilePDF(arraybuffer));
        const base64 = window.btoa(
          arraybuffer.reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        setImageProof(`data:;base64,${base64}`);
        setOpen(true);
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
        isPDF={isPDF}
        onClose={handleClose}
      />
    </div>
  );
}
