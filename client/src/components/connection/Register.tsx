import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import "./Register.scss";
import FormControl from "@mui/material/FormControl";
import {
  Box,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import axios from "axios";
import countryList from "react-select-country-list";
import { useMemo } from "react";
import { isEmailValid, isPasswordValid } from "../../utils/Validation";
import { Role } from "../../model/enum/Role";

export default function Register() {
  const acceptedFileTypes = ".jpg,.jpeg,.pdf,.png"
  const [open, setOpen] = React.useState(false);
  const [uploadedImage, setUploadedImage] = React.useState(
    "Preuve du statut de professeur"
  );
  const [showProof, setShowProof] = React.useState(true);
  const countryListOptions = useMemo(() => countryList().getData(), []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => { //TODO: https://kainikhil.medium.com/nodejs-file-upload-and-virus-scan-9f23691394f3
    if (e.target.files && e.target.files.length === 1) {
      const ext = e.target.files[0].name.substring(e.target.files[0].name.lastIndexOf('.'))

      if(!acceptedFileTypes.includes(ext.toLowerCase())){
        e.target.value = ''
        alert('Type de fichier invalide. Types supportés: ' + acceptedFileTypes)
        setUploadedImage('Preuve de votre statut de professeur');
        return
      }

      stateErrors.proof.isError = false;
      setUploadedImage(e.target.files[0].name);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [state, setState] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    city: "",
    country: "Canada",
    role: Role.ProfessorNotApproved,
    proof: "",
    school: "poly",
    otherSchool: "",
  });

  const initialStateErrors = {
    firstName: { isError: false, message: "" },
    lastName: { isError: false, message: "" },
    email: { isError: false, message: "" },
    password: { isError: false, message: "" },
    city: { isError: false, message: "" },
    country: { isError: false, message: "" },
    role: { isError: false, message: "" },
    proof: { isError: false, message: "" },
    school: { isError: false, message: "" },
    otherSchool: { isError: false, message: "" },
  };

  const [stateErrors, setStateErrors] = React.useState(initialStateErrors);

  const onValidation = (e: any) => {
    let isValid = true;

    const stateErrorsCopy = { ...initialStateErrors };
    if (e.firstName.value.trim() === "") {
      stateErrorsCopy.firstName = {
        isError: true,
        message: "Veuillez entrer votre prénom",
      };
      isValid = false;
    }
    if (e.lastName.value.trim() === "") {
      stateErrorsCopy.lastName = {
        isError: true,
        message: "Veuillez entrer votre nom",
      };
      isValid = false;
    }
    if (!isEmailValid(e.email.value)) {
      stateErrorsCopy.email = {
        isError: true,
        message: "Veuillez entrer un email valide",
      };
      isValid = false;
    }
    if (e.password.value != e.confirmPassword.value) {
      stateErrorsCopy.password = {
        isError: true,
        message: "Les deux mots de passe ne correspondent pas. Veuillez réessayer.",
      };
      isValid = false;
    }
    if (!isPasswordValid(e.password.value)) {
      stateErrorsCopy.password = {
        isError: true,
        message: "Veuillez entrer un mot de passe valide (8 à 32 caractères)",
      };
      isValid = false;
    }
    if (e.city.value.trim() === "") {
      stateErrorsCopy.city = {
        isError: true,
        message: "Veuillez entrer votre ville",
      };
      isValid = false;
    }
    if (e.role.value.trim() === "") {
      stateErrorsCopy.role = {
        isError: true,
        message: "Veuillez entrer votre statut",
      };
      isValid = false;
    }
    if (e.role.value === Role.ProfessorNotApproved && e.proof.value === "") {
      stateErrorsCopy.proof = {
        isError: true,
        message: "Veuillez entrer votre preuve de votre statut de professeur",
      };
      isValid = false;
    }
    if (e.school.value === "others" && e.otherSchool.value.trim() === "") {
      stateErrorsCopy.otherSchool = {
        isError: true,
        message: "Veuillez entrer votre école",
      };
      isValid = false;
    }

    setStateErrors(!isValid ? stateErrorsCopy : initialStateErrors);

    return isValid;
  };

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent
  ) => {
    const target = e.target;
    const value = target.value;
    const name = target.name;
    if (name == "role") {
      setShowProof(value == Role.ProfessorNotApproved);
    }
    setState({ ...state, [name]: value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const isFormValid = onValidation(e.target.elements);
    if (!isFormValid) {
      return;
    }

    const formData = new FormData();
    formData.append("firstName", e.target.elements.firstName.value);
    formData.append("lastName", e.target.elements.lastName.value);
    formData.append("email", e.target.elements.email.value);
    formData.append("password", e.target.elements.password.value);
    formData.append("city", e.target.elements.city.value);
    formData.append("country", e.target.elements.country.value);
    formData.append("role", e.target.elements.role.value);
    formData.append("school", e.target.elements.school.value);

    if (showProof) {
      formData.append("proof", e.target.elements.proof.files[0]);
    }

    if (state["school"] === "others") {
      formData.set("school", e.target.elements.otherSchool.value);
    }

    sendRegisterForm(formData);
  };

  const sendRegisterForm = (user: FormData) => {
    
    axios
      .post(`${process.env.REACT_APP_BASE_API_URL}/api/auth/register`, user)
      .then((res) => {
        if (res.status === 201) {
          handleClose();
        }
      });
  };

  return (
    <div>
      <a href="#" onClick={handleClickOpen}>
        <Typography>Vous n'avez pas de compte?</Typography>
      </a>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle><Typography variant="h4">S'inscrire</Typography></DialogTitle>
        <DialogContent>
          <DialogContentText>
            Veuillez fournir les informations indiquées peu après. Si le statut désiré n'est pas offert, contactez l'administrateur.
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
          <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
            id="registerForm"
            encType="multipart/form-data"
          >
            <div id="user-fullname">
              <TextField
                required
                autoFocus
                label="Prénom"
                id="firstName"
                type="text"
                variant="outlined"
                name="firstName"
                className="smallTextField"
                onChange={handleInputChange}
                value={state.firstName}
                error={stateErrors.firstName.isError}
              />
              <TextField
                required
                label="Nom"
                id="lastName"
                type="text"
                variant="outlined"
                name="lastName"
                className="smallTextField"
                onChange={handleInputChange}
                value={state.lastName}
                error={stateErrors.lastName.isError}
              />
            </div>
            <div id="user-status">
              <FormControl className="formControl" id="registerRole" required>
                <InputLabel>Statut</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  value={state.role}
                  label="role"
                  onChange={handleInputChange}
                  name="role"
                  error={stateErrors.role.isError}
                >
                  <MenuItem value={Role.ProfessorNotApproved}>Enseignant/Enseignante</MenuItem>
                  <MenuItem value={Role.Student}>Étudiant/Étudiante</MenuItem>
                </Select>
              </FormControl>
              {showProof && (
                    <Button id="uploadProofButton"
                      color= {stateErrors.proof.isError? "error": "primary"}
                      aria-label="upload picture"
                      variant="outlined"
                      component="label"
                    >
                    <PhotoCamera />
                    <Typography variant="caption" overflow={'hidden'} whiteSpace={'nowrap'}>
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
              )}
            </div>
            <div id="user-credentials">
              <TextField
                required
                id="email"
                label="Courriel"
                type="email"
                variant="outlined"
                name="email"
                className="largeTextField"
                onChange={handleInputChange}
                value={state.email}
                error={stateErrors.email.isError}
              />

              <div id="user-password">
                <TextField
                  required
                  id="password"
                  label="Mot de passe"
                  type="password"
                  variant="outlined"
                  name="password"
                  className="smallTextField"
                  onChange={handleInputChange}
                  value={state.password}
                  error={stateErrors.password.isError}
                />
                <TextField
                  required
                  id="confirmPassword"
                  label="Confirmer le mot de passe"
                  type="password"
                  variant="outlined"
                  name="confirmPassword"
                  className="smallTextField"
                  onChange={handleInputChange}
                  value={state.confirmPassword}
                  error={stateErrors.password.isError}
                />
              </div>
            </div>
            <div id="user-school">
              <FormControl id="user-school-form" className="formControl" required>
                <InputLabel id="demo-simple-select-label">Université</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={state.school}
                  label="Université"
                  onChange={handleInputChange}
                  name="school"
                  error={stateErrors.school.isError}
                >
                  <MenuItem value={"ets"}>
                    École de technologie supérieur
                  </MenuItem>
                  <MenuItem value={"enap"}>
                    École nationale d'administration publique
                  </MenuItem>
                  <MenuItem value={"hec"}>HEC Montréal</MenuItem>
                  <MenuItem value={"inrs"}>
                    Institut national de la recherche scientifique (INRS)
                  </MenuItem>
                  <MenuItem value={"poly"}>Polytechnique Montréal - CAS</MenuItem>
                  <MenuItem value={"bishops"}>Université Bishops</MenuItem>
                  <MenuItem value={"concordia"}>Université Concordia</MenuItem>
                  <MenuItem value={"udem"}>Université de Montréal</MenuItem>
                  <MenuItem value={"udes"}>Université de Sherbrooke</MenuItem>
                  <MenuItem value={"uqac"}>
                    Université du Québec à Chicoutimi
                  </MenuItem>
                  <MenuItem value={"uqar"}>
                    Université du Québec à Rimouski (UQAR)
                  </MenuItem>
                  <MenuItem value={"uqat"}>
                    Université du Québec à Trois-Rivières
                  </MenuItem>
                  <MenuItem value={"uqea"}>
                    Université du Québec en Abitibi-Témiscamingue
                  </MenuItem>
                  <MenuItem value={"uqeo"}>
                    Université du Québec en Outaouais
                  </MenuItem>
                  <MenuItem value={"laval"}>Université Laval</MenuItem>
                  <MenuItem value={"mcgill"}>Université McGill</MenuItem>
                  <MenuItem value={"teluq"}>Université TELUQ</MenuItem>
                  <MenuItem value={"uqam"}>
                    UQAM | Université du Québec à Montréal
                  </MenuItem>
                  <MenuItem value={"others"}>Autres</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div>
              {state.school === "others" && (
                <TextField
                  required
                  label="Université"
                  type="text"
                  variant="outlined"
                  name="otherSchool"
                  onChange={handleInputChange}
                  value={state.otherSchool}
                  error={stateErrors.otherSchool.isError}
                />
              )}
            </div>
            <div id="user-location">
              <FormControl
                id="registerCountry"
                className="formControl"
                required
              >
                <InputLabel id="demo-simple-select-label">Pays</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={state.country}
                  label="Pays"
                  onChange={handleInputChange}
                  name="country"
                  error={stateErrors.country.isError}
                >
                  {countryListOptions.map((country) => (
                    <MenuItem value={country.label}>{country.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                required
                id="city"
                label="Ville"
                type="text"
                variant="outlined"
                name="city"
                className="smallTextField"
                onChange={handleInputChange}
                value={state.city}
                error={stateErrors.city.isError}
              />
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button variant="contained" type="submit" form="registerForm">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
