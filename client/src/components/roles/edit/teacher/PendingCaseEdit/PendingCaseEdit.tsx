import {
  Typography,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React, { useRef } from "react";
import "./PendingCaseEdit.scss";
import { Case } from "../../../../../model/CaseStudy";
import { useLocation } from "react-router-dom";
import PendingCaseEditTable, {
  PendingCaseEditTableRef,
} from "./PendingCaseEditTable";
import axios from "axios";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import { Document } from "../../../../../model/Document";
import { createCaseFromData } from "../../../../../utils/ConvertUtils";

function PendingCaseEdit() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");

  const PendingCaseEditTableRef = useRef<PendingCaseEditTableRef | null>(null);
  const [hasBeenModified, SetHasBeenModified] = React.useState<Boolean>(false);
  let [caseStudy, SetCaseStudy] = React.useState<Case>();
  const [open, setDialogOpen] = React.useState(false);

  const setModified = (isModified: boolean) => {
    SetHasBeenModified(isModified);
  };

  const openDuplicateErrorDialog = () => {
    setDialogOpen(true);
  };

  const handleDuplicateErrorDialogClose = () => {
    setDialogOpen(false);
  };

  React.useEffect(() => {
    getCaseStudy(id);
  }, [id]);

  const getCaseStudy = (id: string | null) => {
    if (!id) return;
    axios
      .get(`${process.env.REACT_APP_BASE_API_URL}/api/caseStudies/` + id, {
        withCredentials: true,
      })
      .then((res) => {
        caseStudy = createCaseFromData(
          res.data._id,
          res.data.title,
          res.data.desc,
          res.data.authors,
          res.data.submitter,
          res.data.date,
          res.data.page,
          res.data.status,
          res.data.isPaidCase,
          res.data.classId,
          res.data.discipline,
          res.data.subjects,
          res.data.files,
          res.data.ratings,
          res.data.votes
        );

        SetCaseStudy({ ...caseStudy });

        if (!caseStudy || !PendingCaseEditTableRef.current) return;
        PendingCaseEditTableRef.current.RefreshCaseFiles(caseStudy.files);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleConfirmChanges = async (e: any) => {
    e.preventDefault();
    if (!caseStudy || !PendingCaseEditTableRef.current) return;

    const filenamesToDelete =
      PendingCaseEditTableRef.current.GetFilenamesToDelete();

    // Delete files
    for (const filename of filenamesToDelete) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_BASE_API_URL}/api/caseStudies/delete/${filename}`,
          {
            data: { caseStudyId: caseStudy.id_ },
            withCredentials: true,
          }
        );
        caseStudy.files = caseStudy.files.filter((document: Document) => {
          return document.file.filename !== filename;
        });
      } catch (error) {
        console.log(error);
      }
    }

    // Prepare data for patch requests
    const remainingDocuments: Document[] = caseStudy.files;
    const files = remainingDocuments.map((document) => document.file);

    const addedFilesFormData = new FormData();
    Array.from(PendingCaseEditTableRef.current.GetFilesToUpload()).forEach(
      (file) => {
        addedFilesFormData.append("addedFiles[]", file as Blob);
      }
    );

    // Patch requests to remove deleted files and add new ones to case study
    try {
      await axios.patch(
        `${process.env.REACT_APP_BASE_API_URL}/api/caseStudies/${caseStudy.id_}/removeFiles`,
        { files },
        { withCredentials: true }
      );

      await axios.patch(
        `${process.env.REACT_APP_BASE_API_URL}/api/caseStudies/${caseStudy.id_}/addFiles`,
        addedFilesFormData,
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }

    // Completion actions
    SetHasBeenModified(false);
    PendingCaseEditTableRef.current.ClearModifications();
    getCaseStudy(caseStudy.id_.toString());
  };
  return (
    <div>
      {caseStudy && (
        <div id="pendingCase">
          <Button className="return" href="/my-pending-study-cases">
            &gt; Retour à mes études de cas
          </Button>
          <div id="generalCaseInfo">
            <div>Cas: {caseStudy.id_}</div>
            <div>Titre: {caseStudy.title}</div>
            <div>Auteur: {caseStudy.authors} </div>
            <div>Reçu le: {caseStudy.date} </div>
          </div>
          <Card>
            <Typography id="folderTitle">
              Documents soumis par l'auteur
            </Typography>
            <PendingCaseEditTable
              ref={PendingCaseEditTableRef}
              case={caseStudy}
              setModified={setModified}
              openDuplicateErrorDialog={openDuplicateErrorDialog}
              closeDuplicateErrorDialog={openDuplicateErrorDialog}
            />
          </Card>
          <br />
          <form
            onSubmit={handleConfirmChanges}
            id="uploadNewFiles"
            encType="multipart/form-data"
          >
            <Button variant="contained" color="primary" component="label">
              <FileUploadIcon /> Téléverser un fichier
              <input
                hidden
                accept=".doc,.docx,.pdf"
                type="file"
                onChange={(e) => {
                  PendingCaseEditTableRef.current
                    ? PendingCaseEditTableRef.current.AddFiles(e.target.files)
                    : null;
                  e.target.value = "";
                }}
                name="caseStudyFiles"
                multiple
              />
            </Button>
          </form>

          <div id="decision-actions">
            <Button
              variant="contained"
              color="primary"
              disabled={!hasBeenModified}
              type="submit"
              form="uploadNewFiles"
            >
              <SaveIcon /> Confirmer les changements
            </Button>
            <Button variant="contained" color="error" component="label">
              <DeleteIcon /> Supprimer l'étude de cas
              <input
                hidden
                accept=".doc,.docx,.pdf"
                type="file"
                onChange={(e) =>
                  PendingCaseEditTableRef.current
                    ? PendingCaseEditTableRef.current.AddFiles(e.target.files)
                    : null
                }
              />
            </Button>
          </div>
        </div>
      )}

      {!caseStudy && <div></div>}

      <Dialog
        open={open}
        onClose={handleDuplicateErrorDialogClose}
        fullWidth={true}
      >
        <DialogTitle>Erreur de téléversement</DialogTitle>

        <DialogContent>
          Un fichier du même nom est déjà présent pour cette étude de cas.
        </DialogContent>

        <DialogActions>
          <Button variant="contained" onClick={handleDuplicateErrorDialogClose}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PendingCaseEdit;
