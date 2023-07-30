import React from "react";
import PdfAccordion from "./PdfAccordion";
import "./GuidePage.scss";
import NavBar from "../common/NavBar";

function GuidePage() {
  const numberOfPdfFiles = 10;
  const pdfFiles = [];
  const pdfTitles = [
    "Définition d'un cas",
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

  for (let i = 1; i <= numberOfPdfFiles; i++) {
    pdfFiles.push(require(`../../pdfs/fiche-${i}.pdf`));
  }

  return (
    <>
    <NavBar></NavBar>
    <div className="guide-page">
      <h1>Ressources pédagogiques</h1>
      <h2>Comment rédiger et animer une étude de cas ?</h2>
      <div className="accordions-container">
        {pdfFiles.map((pdfFile, index) => (
          <PdfAccordion key={index} pdfFile={pdfFile} index={index + 1} title={pdfTitles[index]} />
        ))}
      </div>
    </div>
    </>
    
  );
}

export default GuidePage;
