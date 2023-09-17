import React, {useContext} from "react";
import PdfAccordion from "./PdfAccordion";
import "./GuidePage.scss";
import { Button, Typography } from "@mui/material";
import { AppContext } from "../App";
import { Download } from "@mui/icons-material";
import { downloadCaseStudyTemplate } from "../../utils/FileDownloadUtil";

function GuidePage() {
  const appContext = useContext(AppContext);
  const numberOfUnrestrictedPdfFiles = 1;
  const numberOfRestrictedPdfFiles = 9;
  const totalNumberOfPdfFiles = numberOfUnrestrictedPdfFiles + numberOfRestrictedPdfFiles;
  const unrestrictedPdfFiles = [];
  const restrictedPdfFiles = [];
  const unrestrictedPdfTitles = ["Définition d'un cas"];
  const restrictedPdfTitles = [
    "Processus de création d'un cas",
    "Écriture d'un cas",
    "Écriture d'une note pédagogique d'un cas",
    "Animation d'un cas",
    "Questions à poser pour favoriser la discussion lors de l'animation d'un cas",
    "Savoir écouter lors de l'animation d'un cas",
    "Répondre aux questions lors de l'animation d'un cas",
    "Créer un climat propice à la réflexion",
    "Conseils pour animer un cas",
  ];

  for (let i = 1; i <= numberOfUnrestrictedPdfFiles; i++) {
    unrestrictedPdfFiles.push(require(`../../pdfs/fiche-${i}.pdf`));
  }
  for (let i = numberOfUnrestrictedPdfFiles + 1; i <= totalNumberOfPdfFiles; i++) {
    restrictedPdfFiles.push(require(`../../pdfs/fiche-${i}.pdf`));
  }

  const openPopup = () => {
    if(appContext) {
      appContext.openLogInPopup();
    }
  };

  return (
    <>
      <div className="guide-page">
        <h1>Ressources pédagogiques</h1>
        <div id="template-download">
        <Button variant="contained" className="download-button" onClick={() => downloadCaseStudyTemplate()}> Télécharger le gabarit
        <Download></Download>
      </Button>
        </div>
        
        <h2>Comment rédiger et animer une étude de cas ?</h2>
        <div className="accordions-container">
          {unrestrictedPdfFiles.map((pdfFile, index) => (
            <PdfAccordion
              key={index}
              pdfFile={pdfFile}
              index={index + 1}
              title={unrestrictedPdfTitles[index]}
              disabled={false}
            />
          ))}
          {!localStorage.getItem("logged_in") && (
            <Button className="login-prompt" onClick={openPopup}>
              <Typography className="login-prompt-text">
                Connectez-vous pour consulter le reste des fiches!
              </Typography>
            </Button>
          )}
          {restrictedPdfFiles.map((pdfFile, index) => (
            <PdfAccordion
              key={index}
              pdfFile={pdfFile}
              index={index + 1 + numberOfUnrestrictedPdfFiles}
              title={restrictedPdfTitles[index]}
              disabled={!localStorage.getItem("logged_in")}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default GuidePage;
