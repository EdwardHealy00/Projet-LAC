import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { FormLabel } from "@mui/material";
import { PaidNewCaseStudy } from "../../model/CaseStudy";
import axios from "axios";

export default function AddPaidCaseStudy() {
  const [open, setOpen] = React.useState(false);
  const [caseStudyFileName, setCaseStudyFileName] = React.useState(
    "Aucune étude de cas n'a été téléversée"
  );

  const [state, setState] = React.useState({
    caseStudyFile: "",
    title: "",
    author: "",
    course: "",
  });

  const initialStateErrors = {
    caseStudyFile: { isError: false, message: "" },
    title: { isError: false, message: "" },
    author: { isError: false, message: "" },
    course: { isError: false, message: "" },
  };

  const [stateErrors, setStateErrors] = React.useState(initialStateErrors);

  const onValidation = (e: any) => {
    let isValid = true;
    const stateErrorsCopy = { ...initialStateErrors };

    if (e.caseStudyFile.value.trim() === "") {
      stateErrorsCopy.caseStudyFile = {
        isError: true,
        message: "Veuillez entrer votre étude de cas",
      };
      isValid = false;
    }

    if (e.title.value.trim() === "") {
      stateErrorsCopy.title = {
        isError: true,
        message: "Veuillez entrer le titre de votre étude de cas",
      };
      isValid = false;
    }

    if (e.author.value.trim() === "") {
      stateErrorsCopy.author = {
        isError: true,
        message: "Veuillez entrer le ou les auteurs de votre étude de cas",
      };
      isValid = false;
    }

    if (e.course.value.trim() === "") {
      stateErrorsCopy.course = {
        isError: true,
        message: "Veuillez entrer le cours associé à votre étude de cas",
      };
      isValid = false;
    }

    const courseIdPattern = new RegExp("^[A-Z]{3}[0-9]{4}\\s?$");
    if (!courseIdPattern.test(e.course.value)) {
      stateErrorsCopy.course = {
        isError: true,
        message: "Veuillez entrer un sigle de cours valide",
      };
      isValid = false;
    }

    setStateErrors(!isValid ? stateErrorsCopy : initialStateErrors);
    return isValid;
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCaseStudyFileName(e.target.files[0].name);
    }
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    const isFormValid = onValidation(e.target.elements);
    if (!isFormValid) {
      return;
    }

    const caseStudy = {
      title: e.target.elements.title.value,
      authors: e.target.elements.author.value,
      classId: e.target.elements.course.value,
      file: e.target.elements.caseStudyFile.files[0],
      isPaidCase: true,
    } as PaidNewCaseStudy;

    const formData = new FormData();
    let key: keyof PaidNewCaseStudy;
    for (key in caseStudy) {
      formData.append(key, caseStudy[key]);
    }
    sendAddCaseStudy(formData);
  };

  const sendAddCaseStudy = (caseStudy: FormData) => {
    axios.post("http://localhost:3001/api/caseStudies", caseStudy, {
      withCredentials: true
    }).then((res) => {
      console.log(res);
      if (res.status === 201) {
        handleClose();
      }
    });
  };

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen}>
        Ajouter une étude de cas payante
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Ajouter une étude de cas</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Entrez les informations de l'étude de cas.
          </DialogContentText>
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
            <div>
              <Button variant="contained" component="label">
                Téléverser l'étude de cas
                <input
                  hidden
                  accept=".doc,.docx,.pdf"
                  type="file"
                  onChange={handleFileUpload}
                  name="caseStudyFile"
                />
              </Button>
              <FormLabel error={stateErrors.caseStudyFile.isError}>
                {caseStudyFileName && <span>{caseStudyFileName}</span>}
              </FormLabel>
            </div>
            <TextField
              autoFocus
              margin="dense"
              label="Titre"
              name="title"
              type="text"
              fullWidth
              error={stateErrors.title.isError}
            />
            <TextField
              autoFocus
              margin="dense"
              label="Auteur(s)"
              name="author"
              type="text"
              helperText="John Doe, Jane Doe"
              fullWidth
              error={stateErrors.author.isError}
            />
            <TextField
              autoFocus
              margin="dense"
              label="Cours"
              name="course"
              type="text"
              inputProps={{ maxLength: 8 }}
              helperText="IND1000"
              fullWidth
              error={stateErrors.course.isError}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose}>
            Annuler
          </Button>
          <Button variant="contained" type="submit" form="caseStudyForm">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
