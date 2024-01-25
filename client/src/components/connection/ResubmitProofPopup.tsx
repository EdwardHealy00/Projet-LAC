import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import ForgotPassword from "./ForgotPassword";
import Register from "./Register";
import axios from "axios";
import { UserLogin } from "../../model/User";
import React, { forwardRef, useImperativeHandle } from "react";
import { useNavigate } from "react-router-dom";
import { PhotoCamera } from "@mui/icons-material";

export interface Props {}
export interface ResubmitProofPopupRef {
  setPopupOpen(): void;
}

const ResubmitProofPopup = forwardRef<ResubmitProofPopupRef, Props>(
  (props, ref) => {
    useImperativeHandle(ref, () => ({
      setPopupOpen() {
        setOpen(true);
      },
    }));

    const acceptedFileTypes = ".jpg,.jpeg,.pdf,.png";
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const [uploadedImage, setUploadedImage] = React.useState(
      "Preuve du statut de professeur"
    );

    const initialStateErrors = {
      proof: { isError: false, message: "" },
    };

    const [stateErrors, setStateErrors] = React.useState(initialStateErrors);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      //TODO: https://kainikhil.medium.com/nodejs-file-upload-and-virus-scan-9f23691394f3
      if (e.target.files && e.target.files.length === 1) {
        const ext = e.target.files[0].name.substring(
          e.target.files[0].name.lastIndexOf(".")
        );

        if (!acceptedFileTypes.includes(ext.toLowerCase())) {
          e.target.value = "";
          alert(
            "Type de fichier invalide. Types supportés: " + acceptedFileTypes
          );
          setUploadedImage("Preuve de votre statut de professeur");
          return;
        }
        const stateErrorsCopy = { ...initialStateErrors };
        stateErrorsCopy.proof.isError = false;
        setStateErrors(stateErrorsCopy)
        setUploadedImage(e.target.files[0].name);
      }
    };

    const handleClose = () => {
      setOpen(false);
    };


    const handleSubmit = (e: any) => {
      e.preventDefault();
      console.log(e)
      if(e.target.elements.proof.value === "") {
        const stateErrorsCopy = { ...initialStateErrors };
        stateErrorsCopy.proof.isError = true;
        setStateErrors(stateErrorsCopy)
        return;
      }
      
      const proofFormData = new FormData();
      proofFormData.append("proof", e.target.elements.proof.files[0]);
      axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/users/proof`,
        proofFormData,
        { withCredentials: true }
      ).then((res) => {
        if (res.status === 200) {
          window.location.reload();
        }
      });
    };

    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <Typography variant="h4">Resoumettre une preuve</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="body1">
              Votre preuve de statut de professeur a été refusé par
              l'administration. Vous pouvez effectuer une nouvelle tentative
              ci-dessous:
            </Typography>
          </DialogContentText>

          <form id="resubmitProofForm" onSubmit={handleSubmit}>
            <Button
              id="uploadProofButton"
              color={stateErrors.proof.isError ? "error" : "primary"}
              aria-label="upload picture"
              variant="outlined"
              component="label"
            >
              <PhotoCamera />
              <Typography
                variant="caption"
                overflow={"hidden"}
                whiteSpace={"nowrap"}
              >
                {uploadedImage}
              </Typography>
              <input
                hidden
                accept={acceptedFileTypes}
                type="file"
                onChange={handleImageUpload}
                name="proof"
              />
            </Button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button variant="contained" type="submit" form="resubmitProofForm">
            Valider
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);

export default ResubmitProofPopup;
