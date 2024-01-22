import axios from "axios";

export function handleDownloadAll(files: any[])  {
    for (let i = 0; i < files.length; i++) {
      handleFileDownload(files[i]);
    }
};

export function handleFileDownload(file: any) {
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

export function downloadCaseStudyTemplate() {
  const templateDocxFile1 = require(`../docx/Gabarit_Conception d'un cas.docx`)
  const templateDocxFile2 = require(`../docx/Gabarit_NotesPédagogiques.docx`)

  const downloadLink1 = document.createElement("a");
  downloadLink1.href = templateDocxFile1;
  downloadLink1.download = "Gabarit_Conception d'un cas.docx";
  downloadLink1.click();
  URL.revokeObjectURL(templateDocxFile1);

  const downloadLink2 = document.createElement("a");
  downloadLink2.href = templateDocxFile2;
  downloadLink2.download = "Gabarit_NotesPédagogiques.docx";
  downloadLink2.click();
  URL.revokeObjectURL(templateDocxFile2);
};

export function downloadPDF(pdfFile: string) {
  const downloadLink1 = document.createElement("a");
  downloadLink1.href = pdfFile;
  downloadLink1.download = "proof.pdf";
  downloadLink1.click();
  URL.revokeObjectURL(pdfFile);
};

export function isFilePDF(uint8Array: Uint8Array) {
  const slice = uint8Array.subarray(0, 4); // Check the first 4 bytes

  // Check for common PDF magic numbers in the header
  return (
    slice[0] === 0x25 && // %
    slice[1] === 0x50 && // P
    slice[2] === 0x44 && // D
    slice[3] === 0x46    // F
  );
}