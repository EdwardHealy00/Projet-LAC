import React, { RefObject, useRef } from "react";
import { SingleCaseProp } from "../../../../model/CaseStudy";
import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./Feedback.scss";
import axios from "axios";
import { navToCorrectTab } from "../../../../utils/NavigationUtils";
import ConfirmChangesDialog from "../../../../utils/ConfirmChangesDialog";
import CaseStudyFilesTable, {
  CaseStudyFilesTableRef,
} from "../../../catalogue/CaseStudyFilesTable";
import { MAX_FILES_PER_CASE } from "../../../../utils/Constants";
import FileUploadIcon from "@mui/icons-material/FileUpload";

export default function AddToCatalogueFeedback(caseData: SingleCaseProp) {
  const newCase = caseData.caseData;
  const navigate = useNavigate();

  const [urlValue, setURLValue] = React.useState("");
  const [confirmChangesDialogOpen, setConfirmChangesDialogOpen] =
    React.useState(false);

  const handleConfirmChangesDialogClose = () => {
    setConfirmChangesDialogOpen(false);
  };

  const sendCaseStudyResponse = async () => {
    const addedFilesFormData = new FormData();
    getFilesToUpload().forEach(
      (file) => {
        addedFilesFormData.append("addedFiles[]", file as Blob);
      }
    );

    addedFilesFormData.append('case', newCase.id_.toString());
    addedFilesFormData.append('approved', 'true');
    addedFilesFormData.append('url', urlValue);

    await axios
      .post(
        `${process.env.REACT_APP_BASE_API_URL}/api/caseStudies/approvalResult`,
        addedFilesFormData,
        {
          withCredentials: true,
        }
      ).then(() => {
        navToCorrectTab("/approval", navigate, newCase);
      });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (
      e.target.files &&
      e.target.files.length > 0 &&
      caseStudyFilesTableRef.current
    ) {
      const files = caseStudyFilesTableRef.current.AddFiles(e.target.files);
      onUploadValidation(files);
    }
    e.target.value = "";
  };

  const getFilesToUpload = () => {
    if (caseStudyFilesTableRef.current) {
      return caseStudyFilesTableRef.current.GetFilesToUpload();
    }
    return [];
  };

  const onUploadValidation = (files: any) => {
    let isValid = true;
    const stateErrorsCopy = { ...initialStateErrors };

    setReachedMaxFiles(files.length >= MAX_FILES_PER_CASE);
    if (files.length > MAX_FILES_PER_CASE) {
      stateErrorsCopy.caseStudyFile = {
        isError: true,
        message: `Un maximum de ${MAX_FILES_PER_CASE} documents devraient être inclus dans une étude de cas`,
      };
      isValid = false;
    }

    setStateErrors(!isValid ? stateErrorsCopy : initialStateErrors);
    return isValid;
  };

  const initialStateErrors = {
    url: { isError: false, message: "" },
    caseStudyFile: { isError: false, message: "" },
  };

  const onValidation = (e: any) => {
    let isValid = true;
    const stateErrorsCopy = { ...initialStateErrors };

    if (getFilesToUpload().length === 0) {
      stateErrorsCopy.caseStudyFile = {
        isError: true,
        message: "Veuillez entrer une version filigranée de l'étude de cas",
      };
      isValid = false;
    }

    if (getFilesToUpload().length > MAX_FILES_PER_CASE) {
      stateErrorsCopy.caseStudyFile = {
        isError: true,
        message: `Un maximum de ${MAX_FILES_PER_CASE} documents peuvent être inclus dans une étude de cas`,
      };
      isValid = false;
    }

    if (e.url.value.trim() === "") {
      stateErrorsCopy.url = {
        isError: true,
        message: "Veuillez entrer l'URL de la page PIP",
      };
      isValid = false;
    }

    setStateErrors(!isValid ? stateErrorsCopy : initialStateErrors);
    return isValid;
  };

  const [reachedMaxFiles, setReachedMaxFiles] = React.useState(false);
  const [stateErrors, setStateErrors] = React.useState(initialStateErrors);

  const caseStudyFilesTableRef = React.useRef<CaseStudyFilesTableRef | null>(
    null
  );

  const [duplicateErrorDialogOpen, setDuplicateErrorDialogOpen] =
    React.useState(false);
  const [maxNumberOfFilesDialogOpen, SetMaxNumberOfFilesDialogOpen] =
    React.useState(false);

  const openDuplicateErrorDialog = () => {
    setDuplicateErrorDialogOpen(true);
  };

  const handleDuplicateErrorDialogClose = () => {
    setDuplicateErrorDialogOpen(false);
  };

  const openMaxNumberOfFilesDialog = () => {
    SetMaxNumberOfFilesDialogOpen(true);
  };

  const handleMaxNumberOfFilesDialogClose = () => {
    SetMaxNumberOfFilesDialogOpen(false);
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    const isFormValid = onValidation(e.target.elements);
    if (!isFormValid) {
      return;
    }

    setConfirmChangesDialogOpen(true);
  };

  return (
    <div>
      <Typography variant="h4">Ajouter au catalogue</Typography>
      <Card id="addtocatalogue-card">
        <br />
        <Typography>
          À noter que cette étape est <b>irréversible</b> ; l'étude de cas sera
          disponible dans le catalogue après avoir été confirmé. <br /> <br />
        </Typography>
        <ul>
            {Object.entries(stateErrors).map(
              ([field, error]) =>
                error.isError && (
                  <li key={field} className="fieldError">
                    {error.message}
                  </li>
                )
            )}
          </ul>
        <form
          onSubmit={onSubmit}
          id="caseStudyForm"
          encType="multipart/form-data"
        >
          {newCase.isPaidCase && (
            <FormControl>
              <FormLabel>
                Comme l'étude de cas est payante, veuillez entrer l'URL de la
                page PIP correspondante :
              </FormLabel>
              <TextField
                margin="dense"
                label="URL"
                name="url"
                type="text"
                value={urlValue}
                onChange={(e) => setURLValue(e.target.value)}
              />
              <br />
              <FormLabel>
                Veuillez également importer des versions filigranées des
                documents constituant cette étude de cas :
              </FormLabel>
              <div>
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                  disabled={reachedMaxFiles}
                >
                  <FileUploadIcon />
                  Téléverser des documents PDF (Maximum 3)
                  <input
                    hidden
                    accept=".pdf"
                    type="file"
                    onChange={handleFileUpload}
                    name="caseStudyFile"
                    multiple
                  />
                </Button>
                <CaseStudyFilesTable
                  ref={caseStudyFilesTableRef}
                  setReachedMaxFiles={setReachedMaxFiles}
                  openDuplicateErrorDialog={openDuplicateErrorDialog}
                  closeDuplicateErrorDialog={handleDuplicateErrorDialogClose}
                  openMaxNumberOfFilesDialog={openMaxNumberOfFilesDialog}
                  closeMaxNumberOfFilesDialog={
                    handleMaxNumberOfFilesDialogClose
                  }
                />
              </div>
              <Dialog
                open={duplicateErrorDialogOpen}
                onClose={handleDuplicateErrorDialogClose}
                fullWidth={true}
              >
                <DialogTitle>Erreur de téléversement</DialogTitle>

                <DialogContent>
                  Un fichier du même nom est déjà présent pour cette étude de
                  cas.
                </DialogContent>

                <DialogActions>
                  <Button
                    variant="contained"
                    onClick={handleDuplicateErrorDialogClose}
                  >
                    Fermer
                  </Button>
                </DialogActions>
              </Dialog>
              <Dialog
                open={maxNumberOfFilesDialogOpen}
                onClose={handleMaxNumberOfFilesDialogClose}
                fullWidth={true}
              >
                <DialogTitle>Erreur de téléversement</DialogTitle>

                <DialogContent>
                  Un maximum de {MAX_FILES_PER_CASE} documents peuvent être
                  téléversés pour une étude de cas.
                </DialogContent>

                <DialogActions>
                  <Button
                    variant="contained"
                    onClick={handleMaxNumberOfFilesDialogClose}
                  >
                    Fermer
                  </Button>
                </DialogActions>
              </Dialog>
            </FormControl>
          )}
        </form>

        <br />
        <Button
          disabled={urlValue.trim() === "" && newCase.isPaidCase}
          variant="contained"
          type="submit"
          form="caseStudyForm"
        >
          Confirmer
        </Button>
      </Card>
      <ConfirmChangesDialog
        open={confirmChangesDialogOpen}
        onClose={handleConfirmChangesDialogClose}
        onConfirm={sendCaseStudyResponse}
      />
    </div>
  );
}
