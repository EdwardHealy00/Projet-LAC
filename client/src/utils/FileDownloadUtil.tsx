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