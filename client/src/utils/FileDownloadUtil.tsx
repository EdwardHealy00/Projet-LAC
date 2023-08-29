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
  const templateDocxFile = require(`../docx/template.docx`)

  const downloadLink = document.createElement("a");
  downloadLink.href = templateDocxFile;
  downloadLink.download = "gabarit.docx";
  downloadLink.click();
  URL.revokeObjectURL(templateDocxFile);
};