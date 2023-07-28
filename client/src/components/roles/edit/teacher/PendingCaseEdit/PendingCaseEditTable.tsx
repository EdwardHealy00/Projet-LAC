import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { Document } from "../../../../../model/Document";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { Case } from "../../../../../model/CaseStudy";
import { forwardRef, useImperativeHandle } from "react";
import { createDocumentFromFile } from "../../../../../utils/ConvertUtils";

interface CaseProp {
  case: Case;
  setModified: (isModified: boolean) => void;
  openDuplicateErrorDialog: Function;
  closeDuplicateErrorDialog: Function;
  wantsToConvertToFree: boolean;
}

export interface PendingCaseEditTableRef {
  AddFiles(files: any): void;
  GetFilenamesToDelete(): string[];
  GetFilesToUpload(): File[];
  ClearModifications(): void;
  RefreshCaseFiles(documents: Document[]): void;
  AreFilesModified(): boolean;
  IsFileListEmpty(): boolean;
}

const PendingCaseEditTable = forwardRef<PendingCaseEditTableRef, CaseProp>(
  (props, ref) => {
    useImperativeHandle(ref, () => ({
      AddFiles(files: any) {
        handleFilesAdd(files);
      },
      GetFilenamesToDelete() {
        return filenamesToDelete;
      },
      GetFilesToUpload() {
        return filesToUpload;
      },
      ClearModifications() {
        SetFilenamesToDelete([]);
        SetFilesToUpload([]);
      },
      RefreshCaseFiles(documents: Document[]) {
        SetChangedCaseFiles([...documents]);
      },
      AreFilesModified(): boolean {
        return !((filesToUpload.length == 0 && filenamesToDelete.length == 0) ||
        changedCaseFiles.length == 0)
      },
      IsFileListEmpty(): boolean {
        return changedCaseFiles.length == 0;
      }
    }));

    const [changedCaseFiles, SetChangedCaseFiles] = React.useState<Document[]>([
      ...props.case.files,
    ]);
    const [filenamesToDelete, SetFilenamesToDelete] = React.useState<string[]>(
      []
    );
    const [filesToUpload, SetFilesToUpload] = React.useState<File[]>([]);

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

    const handleFilesAdd = (files: FileList) => {
      // Filter out files that already exists
      let newFiles: File[] = [];
      for (var i = 0; i < files.length; i++) {
        if (!files || !files.item(i)) return;
        if (
          changedCaseFiles.findIndex((value: Document) => {
            return (
              (files.item(i) as File).name === value.title + "." + value.format
            );
          }) != -1
        ) {
          props.openDuplicateErrorDialog();
        } else {
          newFiles.push(files.item(i) as File);
        }
      }
      SetFilesToUpload(filesToUpload.concat(newFiles));

      // Create documents out of new files to update UI
      let filesData: Document[] = [];
      for (let i = 0; i < newFiles.length; i++) {
        filesData.push(
          createDocumentFromFile(
            null,
            newFiles[i].name,
            changedCaseFiles.length + i
          )
        );
      }
      props.setModified(true);
      SetChangedCaseFiles([...changedCaseFiles.concat(filesData)]);
    };

    const handleFileDelete = (row: Document) => {
      // Remove it from the displayed file list
      let index = changedCaseFiles.findIndex((value: Document) => {
        return value.title === row.title;
      });

      if (index != -1) {
        changedCaseFiles.splice(index, 1);
        SetChangedCaseFiles([...changedCaseFiles]);
      }

      // Remove it from the filesToUpload list if necessary
      index = filesToUpload.findIndex((value: File) => {
        return value.name === row.title + "." + row.format;
      });

      if (index != -1) {
        filesToUpload.splice(index, 1);
        SetFilesToUpload([...filesToUpload]);
      }

      // Add file to list of files to delete on server if its not pending
      if (!row.isPending) {
        filenamesToDelete.push(row.file.filename);
        SetFilenamesToDelete([...filenamesToDelete]);
        props.setModified(true);
      }

      // Disable the confirm changes button if all the changes have been deleted
      if (
        (filesToUpload.length == 0 && filenamesToDelete.length == 0 && !props.wantsToConvertToFree) ||
        (changedCaseFiles.length == 0) 
      ) {
        props.setModified(false);
      }
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
            {changedCaseFiles.map((row) => (
              <TableRow
                key={changedCaseFiles.findIndex((e) => row.title == e.title)}
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
                  {!row.isPending && (
                    <Button
                      variant="outlined"
                      onClick={() => handleFileDownload(row.file)}
                    >
                      <FileDownloadIcon /> Télécharger
                    </Button>
                  )}
                  {props.case.isRejected && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleFileDelete(row)}
                    >
                      <DeleteIcon /> Supprimer
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
);

export default PendingCaseEditTable;
