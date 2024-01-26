import * as React from "react";
import "./CaseStudyFilesTable.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import { Document } from "../../model/Document";
import DeleteIcon from "@mui/icons-material/Delete";
import { forwardRef, useImperativeHandle } from "react";
import { createDocumentFromFile } from "../../utils/ConvertUtils";
import { MAX_FILES_PER_CASE } from "../../utils/Constants";
import { Typography } from "@mui/material";

interface CaseProp {
  openDuplicateErrorDialog: Function;
  closeDuplicateErrorDialog: Function;
  openMaxNumberOfFilesDialog: Function;
  closeMaxNumberOfFilesDialog: Function;
  setReachedMaxFiles: Function;
}

export interface CaseStudyFilesTableRef {
  AddFiles(files: any): File[];
  GetFilesToUpload(): File[];
  ClearModifications(): void;
  RefreshCaseFiles(documents: Document[]): void;
  IsFileListEmpty(): boolean;
}

const CaseStudyFilesTable = forwardRef<CaseStudyFilesTableRef, CaseProp>(
  (props, ref) => {
    useImperativeHandle(ref, () => ({
      AddFiles(files: any) {
        return handleFilesAdd(files);
      },
      GetFilesToUpload() {
        return filesToUpload;
      },
      ClearModifications() {
        SetFilesToUpload([]);
      },
      RefreshCaseFiles(documents: Document[]) {
        SetChangedCaseFiles([...documents]);
      },
      IsFileListEmpty(): boolean {
        return changedCaseFiles.length == 0;
      },
    }));

    const [changedCaseFiles, SetChangedCaseFiles] = React.useState<Document[]>(
      []
    );
    const [filesToUpload, SetFilesToUpload] = React.useState<File[]>([]);

    const handleFilesAdd = (files: FileList): File[] => {
      // Filter out files that already exists
      let newFiles: File[] = [];
      for (var i = 0; i < files.length; i++) {
        if (!files || !files.item(i)) return [];
        else if (
          changedCaseFiles.length + newFiles.length ==
          MAX_FILES_PER_CASE
        ) {
          props.openMaxNumberOfFilesDialog();
        } else if (
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
      const totalFiles = filesToUpload.concat(newFiles);
      SetFilesToUpload(totalFiles);

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
      SetChangedCaseFiles([...changedCaseFiles.concat(filesData)]);
      return totalFiles;
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
      
      props.setReachedMaxFiles(false)
    };

    return (
      <div>
        {changedCaseFiles.length === 0 && (
          <div id="emptyFileLabel">
            <Typography variant="body1">Aucune étude de cas déposée</Typography>
          </div>
        )}
        {changedCaseFiles.length > 0 && (
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">
                    <b>Titre du document</b>
                  </TableCell>
                  <TableCell align="right">
                    <b>{changedCaseFiles.length}/3</b>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {changedCaseFiles.map((row) => (
                  <TableRow
                    key={changedCaseFiles.findIndex(
                      (e) => row.title == e.title
                    )}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="left">{row.title}</TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleFileDelete(row)}
                      >
                        <DeleteIcon /> Supprimer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    );
  }
);

export default CaseStudyFilesTable;
