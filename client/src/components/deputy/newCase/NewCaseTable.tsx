import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { Document } from "../../../model/Document";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import axios from "axios";
import { handleDownloadAll } from "../../../utils/FileDownloadUtil";

interface CaseProp {
    documents: Document[];
}

export default function NewCaseTable(rows: CaseProp) {

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

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell><b>Document</b></TableCell>
            <TableCell align="left"><b>Titre</b></TableCell>
            <TableCell align="center"><b>Type</b></TableCell>
            <TableCell align="center"><b>Format</b></TableCell>
            <TableCell align="center"><b>Ajouté le</b></TableCell>
            <TableCell align="right"> 
              { rows!!.documents.length > 1 &&
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    const files = rows!!.documents.map((document) => document.file); // TODO rename casestudy.files to documents, this is way too confusing...
                    handleDownloadAll(files)}
                  }
                >
                  <FileDownloadIcon /> 
                  TOUT TÉLÉCHARGER
                </Button>
              }
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.documents.map((row) => (
            <TableRow
              key={row.id_}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.documentType}
              </TableCell>
              <TableCell align="left">{row.title}</TableCell>
              <TableCell align="center">{row.type}</TableCell>
              <TableCell align="center">{row.format}</TableCell>
              <TableCell align="center">{new Date(row.addedOn).toLocaleDateString('fr-CA')}</TableCell>
              <TableCell align="right">
                <Button variant="outlined" onClick={() => handleFileDownload(row.file)}>
                  <FileDownloadIcon /> Télécharger
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
