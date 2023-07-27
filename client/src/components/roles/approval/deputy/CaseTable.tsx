import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { CaseStep } from "../../../../model/enum/CaseStatus";
import { Case } from "../../../../model/CaseStudy";
import { getStatus } from "../../../../utils/Status";
import { NavigateFunction, useNavigate } from "react-router-dom";

interface CaseProp {
  cases: Case[];
}

function navigateHandleCase(navigate: NavigateFunction, caseStudy?: Case) {
  navigate("/new-case-approval", { state: { caseStudy } });
}

export default function CaseTable(rows: CaseProp) {
  const navigate = useNavigate();
  const handleCase = (id: number) => {
    const caseStudy = rows.cases.find(
      (caseToHandle) => caseToHandle.id_ === id
    );
    navigateHandleCase(navigate, caseStudy);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell align="right">Titre du cas</TableCell>
            <TableCell align="right">Auteur</TableCell>
            <TableCell align="right">Soumis le</TableCell>
            <TableCell align="right">Statut</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.cases.map((row) => (
            <TableRow
              key={row.id_}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.id_}
              </TableCell>
              <TableCell align="right">{row.title}</TableCell>
              <TableCell align="right">{row.authors}</TableCell>
              <TableCell align="right">{row.date}</TableCell>
              {row.isRejected && (
                <>
                  <TableCell align="right" style={{ color: "red" }}>
                    Rejetée
                  </TableCell>
                  <TableCell align="right"></TableCell>
                </>
              )}
              {!row.isRejected && (
                <>
                  <TableCell align="right">{getStatus(row.status)}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant={getButtonVariant(row.status)}
                      onClick={() => handleCase(row.id_)}
                    >
                      {getButtonMessage(row.status)}
                    </Button>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function getButtonMessage(status: CaseStep): string {
  switch (status) {
    case CaseStep.WaitingPreApproval:
      return "Traiter";
    case CaseStep.WaitingCatalogue:
      return "Ajouter";
    default:
      return "Faire un suivi";
  }
}

function getButtonVariant(
  status: CaseStep
): "text" | "outlined" | "contained" | undefined {
  switch (status) {
    case CaseStep.WaitingPreApproval:
    case CaseStep.WaitingCatalogue:
      return "contained";
    default:
      return "outlined";
  }
}
