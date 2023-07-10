import React, { useCallback } from "react";
import "./CaseStudy.scss";
import Button from "@mui/material/Button";
import "../img/normal_search.svg";
import { PieChart } from "react-minimal-pie-chart";
import Table from './Table';
import { useLocation, useNavigate } from 'react-router-dom';
import { Case } from "../../model/CaseStudy";
import axios from "axios";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const CaseStudyWconnection = () => {
  const state = useLocation().state as any;
  const displayedCase = state ? (state.caseData as Case) : state;

  const [open, setOpen] = React.useState(false);

  const navigate = useNavigate();
  const handleOnClick = useCallback(() => navigate('/catalogue'), [navigate]);

  const openDialog = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleFileDownload = (file: any) => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_API_URL}/api/caseStudies/download/` +
          file.filename,
        {
          withCredentials: true,
          responseType: "arraybuffer",
        }
      )
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", file.originalname); //or any other extension
        document.body.appendChild(link);
        link.click();
      });
  };

  const onConsultClick = () => {
    if (displayedCase.files.length < 1) return;

    if (displayedCase.files.length == 1) {
      handleFileDownload(displayedCase.files[0]);
      return;
    }

    openDialog();
  };

  return (
    <div>
      <div id="main-line"></div>
      <div>
        <Button className="return" onClick={handleOnClick}>
          &gt; Retour au catalogue
        </Button>
        <div className="section">
          <div className="section-line"></div>
          <div id="first">
            <div id="title">{displayedCase.title}</div>
            <br />
            <div id="information">
              <div>{displayedCase.desc}</div>
              <div>
                <div>
                  <b>Auteurs :</b> {displayedCase.authors}
                </div>
                <div>
                  <b>Discipline :</b> Génie {displayedCase.discipline}
                </div>
                <div>
                  <b>Sujet(s) :</b> {displayedCase.subjects.join(", ")}
                </div>
                <div>
                  <b>Nombre de pages :</b> {displayedCase.page}
                </div>
                <div>
                  <b>Date :</b> {displayedCase.date.substring(0, 10)}
                </div>
              </div>
            </div>
          </div>

          <Button
            id="use-case"
            variant="contained"
            onClick={() => console.log("You clicked (use case)")}
          >
            Utiliser ce cas
          </Button>
          <Button variant="outlined" onClick={onConsultClick}>
            Consulter
          </Button>
        </div>
        <div className="section">
          <div className="section-line"></div>
          <div id="usage-historic">
            <h3>Historique d'utilisation</h3>
            <PieChart className="pie-chart"
              data={[
                { title: "IND3202", value: 75, color: "#44546a" },
                { title: "IND8107", value: 25, color: "#C13C37" },
              ]} 
              label={({ dataEntry }) => `${Math.round(dataEntry.percentage)} %`}
            />

            <PieChart className="pie-chart"
              data={[
                { title: "Travail Dirigé (laboratoire)", value: 25, color: "#44546a" },
                { title: "Discussion en sous-groupes", value: 25, color: "#C13C37" },
                { title: "Devoir / Projet", value: 50, color: "#8396af" },
              ]} 
              label={({ dataEntry }) => `${Math.round(dataEntry.percentage)} %`}
            />
          </div>
        </div>
        <div className="section">
          <div className="section-line"></div>
          <Table></Table>
        </div>
      </div>
      <Dialog open={open} onClose={handleDialogClose} fullWidth={true}>
        <DialogTitle>Consulter les fichiers</DialogTitle>

        <DialogContent>
          {displayedCase.files.map((file: { originalname: string; }) => (
            <div className="file-row">
              <div>{file.originalname}</div>
              <Button onClick={() => handleFileDownload(file)}>
                <FileDownloadIcon />Télécharger
              </Button>
            </div>
          ))}
        </DialogContent>

        <DialogActions>
          <Button variant="contained" onClick={handleDialogClose}>Fermer</Button>
        </DialogActions>
      </Dialog>      
    </div>
  );
};

export default CaseStudyWconnection;
