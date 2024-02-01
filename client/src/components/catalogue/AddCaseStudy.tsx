import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {
  FormLabel,
  InputLabel,
  Select,
  Checkbox,
  ListItemText,
  Typography,
  FormGroup,
  FormControlLabel,
  FormControl,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { NewCaseStudy } from "../../model/CaseStudy";
import axios from "axios";
import MenuItem from "@mui/material/MenuItem";
import { Disciplines, Subjects } from "./Catalogue";
import { useNavigate } from "react-router-dom";
import { checkList } from "../roles/approval/deputy/PreApproveFeedback";
import { MAX_FILES_PER_CASE } from "../../utils/Constants";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import PaidSwitch from "./PaidSwitch";
import "./AddCaseStudy.scss";
import { forwardRef, useImperativeHandle } from "react";
import CaseStudyFilesTable, { CaseStudyFilesTableRef } from "./CaseStudyFilesTable";

export interface Props {}
export interface AddCaseStudyDialogRef {
  setDialogOpen(): void;
}

const AddCaseStudy = forwardRef<AddCaseStudyDialogRef, Props>((props, ref) => {
  useImperativeHandle(ref, () => ({
    setDialogOpen() {
      openCaseStudyDialog();
    },
  }));

  const navigate = useNavigate();

  const [
    duplicateErrorDialogOpen,
    setDuplicateErrorDialogOpen,
  ] = React.useState(false);
  const [
    maxNumberOfFilesDialogOpen,
    SetMaxNumberOfFilesDialogOpen,
  ] = React.useState(false);

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

  const [addCaseStudyDialogOpen, setAddCaseStudyDialogOpen] = React.useState(
    false
  );
  const openCaseStudyDialog = () => {
    setAddCaseStudyDialogOpen(true);
  };
  const handleCaseStudyDialogClose = () => {
    setAddCaseStudyDialogOpen(false);
  };

  const [checkedState, setCheckedState] = React.useState<boolean[]>(
    new Array(checkList.length).fill(false)
  );
  const [isVerified, setVerified] = React.useState(false);
  const [isPaid, setIsPaid] = React.useState(false);

  const [selectedDiscipline, setSelectedDiscipline] = React.useState("");

  const onDisciplineChanged = (e: any) => {
    setSelectedDiscipline(e.target.value);
  };

  const [selectedSubjects, setSelectedSubject] = React.useState<string[]>([]);

  const [reachedMaxFiles, setReachedMaxFiles] = React.useState(false);

  const getFilesToUpload = () => {
    if(caseStudyFilesTableRef.current) {
      return caseStudyFilesTableRef.current.GetFilesToUpload();
    }
    return []
  }
  const onSubjectChanged = (e: any) => {
    setSelectedSubject(e.target.value);
  };

  const caseStudyFilesTableRef = React.useRef<CaseStudyFilesTableRef | null>(null);

  const initialStateErrors = {
    caseStudyFile: { isError: false, message: "" },
    title: { isError: false, message: "" },
    desc: { isError: false, message: "" },
    author: { isError: false, message: "" },
    course: { isError: false, message: "" },
    discipline: { isError: false, message: "" },
    subject: { isError: false, message: "" },
  };

  const [stateErrors, setStateErrors] = React.useState(initialStateErrors);

  const handlePaidSwitchChange = (checked: boolean) => {
    setIsPaid(checked);
  };

  const onUploadValidation = (files: any) => {
    let isValid = true;
    const stateErrorsCopy = { ...initialStateErrors };

    setReachedMaxFiles(files.length >= MAX_FILES_PER_CASE);
    if (files.length > MAX_FILES_PER_CASE) {
      stateErrorsCopy.caseStudyFile = {
        isError: true,
        message: `Un maximum de ${MAX_FILES_PER_CASE} documents peuvent être inclus dans une étude de cas`,
      };
      isValid = false;
    }

    setStateErrors(!isValid ? stateErrorsCopy : initialStateErrors);
    return isValid;
  };

  const onValidation = (e: any) => {
    let isValid = true;
    const stateErrorsCopy = { ...initialStateErrors };

    if (getFilesToUpload().length === 0) {
      stateErrorsCopy.caseStudyFile = {
        isError: true,
        message: "Veuillez entrer votre étude de cas",
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

    if (e.title.value.trim() === "") {
      stateErrorsCopy.title = {
        isError: true,
        message: "Veuillez entrer le titre de votre étude de cas",
      };
      isValid = false;
    }

    if (e.desc.value.trim() === "") {
      stateErrorsCopy.desc = {
        isError: true,
        message: "Veuillez entrer le synopsis de votre étude de cas",
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

    if (e.discipline.value.trim() === "") {
      stateErrorsCopy.discipline = {
        isError: true,
        message: "Veuillez entrer la discipline",
      };
      isValid = false;
    }

    if (selectedSubjects.length <= 0) {
      stateErrorsCopy.subject = {
        isError: true,
        message: "Veuillez entrer le(s) sujet(s)",
      };
      isValid = false;
    }

    const courseIdPattern = new RegExp("^[A-Z]{2,4}\\d{3,5}\\s?$");
    if (!courseIdPattern.test(e.course.value.toUpperCase())) {
      stateErrorsCopy.course = {
        isError: true,
        message: "Veuillez entrer un sigle de cours valide",
      };
      isValid = false;
    }

    setStateErrors(!isValid ? stateErrorsCopy : initialStateErrors);
    return isValid;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && caseStudyFilesTableRef.current) {
      const files = caseStudyFilesTableRef.current.AddFiles(e.target.files);
      onUploadValidation(files);
    }
    e.target.value = "";
  };

  const handleVerifyCheck = (index: number) => {
    const updatedCheckedState = checkedState.map((item: boolean, i) => {
      return index === i ? !item : item;
    });
    setCheckedState(updatedCheckedState);

    let result = true;
    updatedCheckedState.forEach((item) => {
      result = result && item;
    });
    setVerified(result);
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    const isFormValid = onValidation(e.target.elements);
    if (!isFormValid) {
      return;
    }

    let filesToUpload: File[] = getFilesToUpload()

    const caseStudy = {
      title: e.target.elements.title.value,
      desc: e.target.elements.desc.value,
      authors: e.target.elements.author.value,
      submitter: localStorage.getItem("email"),
      classId: e.target.elements.course.value,
      files: filesToUpload,
      discipline: e.target.elements.discipline.value,
      isPaidCase: isPaid,
    } as NewCaseStudy;

    const formData = new FormData();
    let key: keyof NewCaseStudy;
    for (key in caseStudy) {
      formData.append(key, caseStudy[key]);
    }

    selectedSubjects.forEach((subject) =>
      formData.append("subjects[]", subject)
    );
    Array.from(filesToUpload).forEach((file) =>
      formData.append("files[]", file as Blob)
    );

    setSelectedDiscipline("");
    setSelectedSubject([]);
    for(const index in checkList) {
      checkedState[index] = false;
    }
    setStateErrors(initialStateErrors);
    setVerified(false);

    sendAddCaseStudy(formData);
  };

  const sendAddCaseStudy = (caseStudy: FormData) => {
    axios
      .post(
        `${process.env.REACT_APP_BASE_API_URL}/api/caseStudies`,
        caseStudy,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.status === 201) {
          if(isPaid) {
            navigate("/my-pending-case-studies/paid");
          } else {
            navigate("/my-pending-case-studies/free");
          }

          setAddCaseStudyDialogOpen(false);
        }
      });
  };

  return (
    <Dialog
      open={addCaseStudyDialogOpen}
      onClose={handleCaseStudyDialogClose}
      maxWidth="md"
    >
      <div id="add-case-study-form">
        <Typography variant="h3">Ajouter une étude de cas</Typography>
        <div id="form-content">
          <Typography variant="body1">
            Entrez les informations de l'étude de cas.
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
            <PaidSwitch onChange={handlePaidSwitchChange} />
            <TextField
              autoFocus
              margin="dense"
              label="Titre"
              name="title"
              type="text"
              fullWidth
              inputProps={{ maxLength: 200 }}
              error={stateErrors.title.isError}
            />
            <TextField
              multiline
              rows={3}
              margin="dense"
              label="Synopsis"
              name="desc"
              type="text"
              fullWidth
              inputProps={{ maxLength: 1000 }}
              error={stateErrors.desc.isError}
            />
            <TextField
              margin="dense"
              label="Auteur(s)"
              name="author"
              type="text"
              helperText="John Doe, Jane Doe"
              fullWidth
              inputProps={{ maxLength: 200 }}
              error={stateErrors.author.isError}
            />
            <TextField
              margin="dense"
              label="Cours"
              name="course"
              type="text"
              inputProps={{ maxLength: 8 }}
              helperText="IND1000"
              fullWidth
              error={stateErrors.course.isError}
            />
            <div id="select-options">
              <div className="select-option">
                <FormControl fullWidth>
                  <InputLabel>Discipline</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Discipline"
                    name="discipline"
                    value={selectedDiscipline}
                    onChange={onDisciplineChanged}
                    error={stateErrors.discipline.isError}
                  >
                    {Disciplines.map((discipline, index) => (
                      <MenuItem key={index} value={discipline}>{discipline}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="select-option">
                <FormControl fullWidth>
                  <InputLabel>Sujet(s)</InputLabel>
                  <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    label="Sujet(s)"
                    name="subject"
                    value={selectedSubjects}
                    onChange={onSubjectChanged}
                    error={stateErrors.subject.isError}
                    renderValue={(selected) => selected.join(", ")}
                  >
                    {Subjects.map((subject, index) => (
                      <MenuItem key={index} value={subject}>
                        <Checkbox
                          checked={selectedSubjects.indexOf(subject) > -1}
                        />
                        <ListItemText primary={subject} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
            <div>
              <Button variant="contained" component="label" fullWidth disabled={reachedMaxFiles}>
                <FileUploadIcon />
                Téléverser des documents Word (Maximum 3)
                <input
                  hidden
                  accept=".docx"
                  type="file"
                  onChange={handleFileUpload}
                  name="caseStudyFile"
                  multiple
                />
              </Button>
              <CaseStudyFilesTable ref={caseStudyFilesTableRef}
                setReachedMaxFiles={setReachedMaxFiles}
                openDuplicateErrorDialog={openDuplicateErrorDialog}
                closeDuplicateErrorDialog={handleDuplicateErrorDialogClose}
                openMaxNumberOfFilesDialog={openMaxNumberOfFilesDialog}
                closeMaxNumberOfFilesDialog={handleMaxNumberOfFilesDialogClose}/>
            </div>
          </form>
          <Card>
            <Typography id="verify-text" variant="h4">
              Vérifiez que votre étude de cas respecte les critères suivants:
            </Typography>
            <CardContent>
              <Typography>
                <FormGroup>
                  {checkList.map((criteria, index) => (
                    <FormControlLabel
                      control={<Checkbox />}
                      label={criteria}
                      key={index}
                      checked={checkedState[index]}
                      onChange={() => handleVerifyCheck(index)}
                    />
                  ))}
                </FormGroup>
              </Typography>
            </CardContent>
          </Card>
        </div>
        <div id="add-btn">
          <Button
            style={{ width: "40%" }}
            disabled={!isVerified}
            variant="contained"
            type="submit"
            form="caseStudyForm"
          >
            Ajouter
          </Button>
        </div>
      </div>
      <Dialog
        open={duplicateErrorDialogOpen}
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
      <Dialog
        open={maxNumberOfFilesDialogOpen}
        onClose={handleMaxNumberOfFilesDialogClose}
        fullWidth={true}
      >
        <DialogTitle>Erreur de téléversement</DialogTitle>

        <DialogContent>
          Un maximum de {MAX_FILES_PER_CASE} documents peuvent être téléversés
          pour une étude de cas.
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
    </Dialog>
  );
});

export default AddCaseStudy;
