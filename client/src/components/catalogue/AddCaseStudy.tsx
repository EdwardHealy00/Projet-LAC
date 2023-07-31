import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { FormLabel, InputLabel, Select, Checkbox, ListItemText, Accordion, AccordionSummary, Typography, AccordionDetails, FormGroup, FormControlLabel } from "@mui/material";
import { NewCaseStudy } from "../../model/CaseStudy";
import axios from "axios";
import MenuItem from "@mui/material/MenuItem";
import { Disciplines, Subjects } from "./Catalogue";
import NavBar from "../common/NavBar";
import { useNavigate } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { checkList } from "../roles/approval/deputy/Feedback";
import { MAX_FILES_PER_CASE } from "../../utils/Constants";
import PaidSwitch from "./PaidSwitch";


export default function AddCaseStudy() {
  

  const navigate = useNavigate();

  const [checkedState, setCheckedState] = React.useState<boolean[]>(new Array(checkList.length).fill(false));
  const [isVerified, setVerified] = React.useState(false);
  const [isPaid, setIsPaid] = React.useState(false);

  const [caseStudyFileName, setCaseStudyFileName] = React.useState(
    "Aucun document n'a été téléversé"
  );

  const [selectedDiscipline, setSelectedDiscipline] = React.useState("");

  const onDisciplineChanged = (e: any) => {
    setSelectedDiscipline(e.target.value);
  };

  const [selectedSubjects, setSelectedSubject] = React.useState<string[]>([]);

  const onSubjectChanged = (e: any) => {
    setSelectedSubject(e.target.value);
  };

  const [state, setState] = React.useState({
    caseStudyFile: "",
    title: "",
    desc: "",
    author: "",
    course: "",
    discipline: "",
    subject: "",
  });

  const initialStateErrors = {
    caseStudyFile: { isError: false, message: "" },
    title: { isError: false, message: "" },
    desc: { isError: false, message: ""},
    author: { isError: false, message: "" },
    course: { isError: false, message: "" },
    discipline: { isError: false, message: ""},
    subject: { isError: false, message: ""},
  };

  const [stateErrors, setStateErrors] = React.useState(initialStateErrors);

  const handlePaidSwitchChange = (checked: boolean) => {
    setIsPaid(checked);
  };

  const onUploadValidation = (files: any) => {
    let isValid = true;
    const stateErrorsCopy = { ...initialStateErrors };

    if (files.length > MAX_FILES_PER_CASE) {
      stateErrorsCopy.caseStudyFile = {
        isError: true,
        message: `Un maximum de ${MAX_FILES_PER_CASE} documents peuvent être inclus dans une étude de cas`,
      };
      isValid = false;
    }

    setStateErrors(!isValid ? stateErrorsCopy : initialStateErrors);
    return isValid;
  }

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

    if (e.caseStudyFile.files.length > MAX_FILES_PER_CASE) {
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
    if (e.target.files && e.target.files.length > 0) {
      onUploadValidation(e.target.files)
      let fileNames = e.target.files[0].name;
      for (let i = 1; i < e.target.files.length; i++) {
        fileNames += ", " + e.target.files[i].name;
      }
      setCaseStudyFileName(fileNames);
    }
  };

  const handleVerifyCheck = (index: number) => {
    const updatedCheckedState = checkedState.map((item: boolean, i) => {
      return index === i ? !item : item
    });
    setCheckedState(updatedCheckedState);

    let result = true;
    updatedCheckedState.forEach((item) => {
      result = result && item;
    })
    setVerified(result);
  }

  const onSubmit = (e: any) => {
    e.preventDefault();
    const isFormValid = onValidation(e.target.elements);
    if (!isFormValid) {
      return;
    }

    const caseStudy = {
      title: e.target.elements.title.value,
      desc: e.target.elements.desc.value,
      authors: e.target.elements.author.value,
      submitter: localStorage.getItem("email"),
      classId: e.target.elements.course.value,
      files: Array.from(e.target.elements.caseStudyFile.files),
      discipline : e.target.elements.discipline.value,
      isPaidCase: isPaid,
    } as NewCaseStudy;

    const formData = new FormData();
    let key: keyof NewCaseStudy;
    for (key in caseStudy) {
      formData.append(key, caseStudy[key]);
    }

    selectedSubjects.forEach(subject => formData.append('subjects[]', subject));
    Array.from(e.target.elements.caseStudyFile.files).forEach(file => formData.append('files[]', (file as Blob)));
    
    sendAddCaseStudy(formData);
  };

  const sendAddCaseStudy = (caseStudy: FormData) => {
    axios
      .post(
        `${process.env.REACT_APP_BASE_API_URL}/api/caseStudies`,
        caseStudy,
        {
          withCredentials: true,
        },
      )
      .then((res) => {
        if (res.status === 201) {
          navigate("/catalogue");
        }
      });
  };

  return (
    <div>
      <NavBar></NavBar>
      <div style={{margin: '0px 200px'}}>
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
            <PaidSwitch onChange={handlePaidSwitchChange}/>
            <div>
              <Button variant="contained" component="label">
                Téléverser des documents Word
                <input
                  hidden
                  accept=".docx"
                  type="file"
                  onChange={handleFileUpload}
                  name="caseStudyFile"
                  multiple
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
            {/* Seems like age is useless, TODO remove? */}
            {/*<InputLabel
                id="demo-simple-select-label"
            >Age</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Age"
                onChange={undefined}
            >
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>*/}
            <InputLabel
                id="demo-simple-select-label"
                error={stateErrors.discipline.isError}
            >Discipline</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Discipline"
                name="discipline"
                value={selectedDiscipline}
                onChange={onDisciplineChanged}
                error={stateErrors.discipline.isError}
                style={{width: '250px'}}
            >
              {Disciplines.map((discipline) => (
                <MenuItem value={discipline}>{"Génie " + discipline}</MenuItem>
              ))}
            </Select>
            <InputLabel
                id="demo-simple-select-label"
                error={stateErrors.subject.isError}
            >Sujet</InputLabel>
            <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                label="Sujet"
                name="subject"
                value={selectedSubjects}
                onChange={onSubjectChanged}
                error={stateErrors.subject.isError}
                renderValue={(selected) => selected.join(', ')}
                style={{width: '250px'}}
            >
              {Subjects.map((subject) => (
                <MenuItem value={subject}>
                  <Checkbox checked={selectedSubjects.indexOf(subject) > -1} />
                  <ListItemText primary={subject} />
                </MenuItem>
              ))}
            </Select>
          </form>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography>Vérifier le cas</Typography>
            </AccordionSummary>
            <AccordionDetails>
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
            </AccordionDetails>
          </Accordion>
        </DialogContent>
        <div style={{marginLeft: '24px'}}>
          <Button disabled={!isVerified} variant="contained" type="submit" form="caseStudyForm">
            Ajouter
          </Button>
        </div>
      </div>
    </div>
  );
}
