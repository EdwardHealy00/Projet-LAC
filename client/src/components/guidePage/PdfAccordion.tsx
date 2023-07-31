import React, { useState } from "react";
import "./PdfAccordion.scss";
import "./../fonts.scss";
import { Document, Page, pdfjs } from "react-pdf";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import {
  ExpandMore,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Download,
} from "@mui/icons-material";

// Initialize pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfAccordionProps {
  pdfFile: string;
  index: number;
  title: string;
  disabled: boolean;
}

const PdfAccordion: React.FC<PdfAccordionProps> = ({ pdfFile, index, title, disabled }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isDocumentLoaded, setIsDocumentLoaded] = useState<boolean>(false);

  const loadDocument = () => {
    setIsDocumentLoaded(true);
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const downloadPdf = (fileName: string) => {
    const downloadLink = document.createElement("a");
    downloadLink.href = pdfFile;
    downloadLink.download = fileName + ".pdf";
    downloadLink.click();
    URL.revokeObjectURL(pdfFile);
  };

  return (
    <div className="row">
      <Accordion className="accordion" onChange={loadDocument} disabled = {disabled}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Fiche {index} - {title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {isDocumentLoaded && (
              <Document
                renderMode="canvas"
                file={pdfFile}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                <Page
                  className="pdf-page"
                  pageNumber={currentPage}
                  scale={2.5}
                />
                {numPages > 1 && (
                  <div className="pdf-navigation">
                    <Paper elevation={3} sx={{ p: 1 }}>
                      <IconButton
                        onClick={prevPage}
                        disabled={currentPage === 1}
                      >
                        <KeyboardArrowLeft />
                      </IconButton>
                      <span>
                        Page {currentPage} of {numPages}
                      </span>
                      <IconButton
                        onClick={nextPage}
                        disabled={currentPage === numPages}
                      >
                        <KeyboardArrowRight />
                      </IconButton>
                    </Paper>
                  </div>
                )}
              </Document>
            )}
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Button className="download-button" onClick={() => downloadPdf("Fiche" + index)} disabled={disabled}>
        <Download></Download>
      </Button>
    </div>
  );
};

export default PdfAccordion;
