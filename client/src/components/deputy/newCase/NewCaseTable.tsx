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
            <TableCell>Document</TableCell>
            <TableCell align="right">Titre</TableCell>
            <TableCell align="right">Type</TableCell>
            <TableCell align="right">Format</TableCell>
            <TableCell align="right">Ajouté le</TableCell>
            <TableCell align="right"></TableCell>
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
              <TableCell align="right">{row.title}</TableCell>
              <TableCell align="right">{row.type}</TableCell>
              <TableCell align="right">{row.format}</TableCell>
              <TableCell align="right">{row.addedOn}</TableCell>
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
