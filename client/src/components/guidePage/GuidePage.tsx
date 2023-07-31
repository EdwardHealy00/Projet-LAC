import React from "react";
import PdfAccordion from "./PdfAccordion";
import "./GuidePage.scss";
import NavBar from "../common/NavBar";
import { Button, Typography } from "@mui/material";
import Cookies from "js-cookie";
import LoginPopup, { LoginPopupRef } from "./../connection/LoginPopup";

function GuidePage() {
  const loginPopupRef = React.useRef<LoginPopupRef | null>(null);

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
    if (loginPopupRef.current) {
      loginPopupRef.current.setPopupOpen();
    }
  };

  return (
    <>
      <NavBar></NavBar>
      <div className="guide-page">
        <h1>Ressources pédagogiques</h1>
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
          {!Cookies.get("logged_in") && (
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
              disabled={!Cookies.get("logged_in")}
            />
          ))}
        </div>
        <LoginPopup ref={loginPopupRef}/>
      </div>
    </>
  );
}

export default GuidePage;
