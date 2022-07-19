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
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";

export default function Register() {
  const [open, setOpen] = React.useState(false);
  const [uploadedImage, setUploadedImage] = React.useState("Preuve de votre statut de professeur");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedImage(e.target.files[0].name);
    }
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [status, setStatus] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value as string);
  };

  const handleChangeUniversity = (event: SelectChangeEvent) => {
    setStatus(event.target.value as string);
  };

  return (
    <div>
      <a href="#" onClick={handleClickOpen}>
        Vous n'avez pas de compte?
      </a>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>S'inscrire</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
            euismod bibendum laoreet. Proin gravida dolor sit amet lacus
            accumsan et viverra justo commodo. Proin
          </DialogContentText>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <div>
              <TextField
                fullWidth
                required
                autoFocus
                margin="dense"
                label="Prénom"
                id="firstName"
                type="text"
                variant="outlined"
              />
              <TextField
                fullWidth
                required
                autoFocus
                margin="dense"
                label="Nom"
                id="lastName"
                type="text"
                variant="outlined"
              />
            </div>
            <div>
              <FormControl className="formControl" id="registerStatus" required>
                <InputLabel>Statut</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  value={status}
                  label="status"
                  onChange={handleChange}
                >
                  <MenuItem value={"teacher"}>Enseignant/Enseignante</MenuItem>
                  <MenuItem value={"student"}>Étudiant/Étudiante</MenuItem>
                </Select>
              </FormControl>
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
                id="uploadProof"
              >
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleImageUpload}
                />
                <PhotoCamera />
                <FormLabel>{uploadedImage}</FormLabel>
              </IconButton>
            </div>
            <div>
              <TextField
                required
                autoFocus
                margin="dense"
                id="email"
                label="Courriel"
                type="email"
                variant="outlined"
              />
              <TextField
                required
                autoFocus
                margin="dense"
                id="password"
                label="Mot de passe"
                type="password"
                variant="outlined"
              />
            </div>
            <FormControl className="formControl" fullWidth required>
              <InputLabel id="demo-simple-select-label">Université</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={status}
                label="status"
                onChange={handleChange}
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
            <div>
              <FormControl
                id="registerCountry"
                className="formControl"
                required
              >
                <InputLabel id="demo-simple-select-label">Pays</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={status}
                  label="status"
                  onChange={handleChange}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
              <TextField
                required
                autoFocus
                margin="dense"
                id="city"
                label="Ville"
                type="text"
                variant="outlined"
              />
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button variant="contained" onClick={handleClose}>
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
