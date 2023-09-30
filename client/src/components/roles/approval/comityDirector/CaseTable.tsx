import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { Case } from "../../../../model/CaseStudy";
import { getStatus } from "../../../../utils/Status";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { ApprovalDecision } from "../../../../model/enum/ApprovalDecision";
import OverflowTooltip from "../../OverflowTooltip";

interface CaseProp {
  cases: Case[];
}

function navigateHandleCase(navigate: NavigateFunction, caseStudy?: Case) {
  navigate(
    `/approval/new-case?id=${caseStudy ? caseStudy.id_ : 0}`
  );
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
            <TableCell style={{ width: '15%' }}><b>#</b></TableCell>
            <TableCell style={{ width: '30%' }} align="left"><b>Titre du cas</b></TableCell>
            <TableCell style={{ width: '15%' }} align="left"><b>Auteur</b></TableCell>
            <TableCell style={{ width: '10%' }} align="center"><b>Soumis le</b></TableCell>
            <TableCell style={{ width: '20%' }} align="center"><b>Statut</b></TableCell>
            <TableCell style={{ width: '10%' }} align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.cases.map((row) => (
            <TableRow
              key={row.id_}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell style={{ width: '15%' }} component="th" scope="row">
                {row.id_}
              </TableCell>
              <TableCell style={{ width: '30%' }} align="left"><OverflowTooltip>{row.title}</OverflowTooltip></TableCell>
              <TableCell style={{ width: '15%' }} align="left"><OverflowTooltip>{row.authors}</OverflowTooltip></TableCell>
              <TableCell style={{ width: '10%' }} align="center">{new Date(row.date).toLocaleDateString('fr-CA')}</TableCell>
              {row.approvalDecision == ApprovalDecision.REJECT && (
                <>
                  <TableCell style={{ width: '20%', color: "red" }} align="center">
                    Rejetée
                  </TableCell>
                  <TableCell style={{ width: '10%' }} align="right"></TableCell>
                </>
              )}
              {row.approvalDecision == ApprovalDecision.MAJOR_CHANGES && (
                <>
                  <TableCell style={{ width: '20%', color: "orange" }} align="center">
                    Nécessite des changements majeurs
                  </TableCell>
                  <TableCell style={{ width: '10%' }} align="right"></TableCell>
                </>
              )}
              {row.approvalDecision == ApprovalDecision.MINOR_CHANGES && (
                <>
                  <TableCell style={{ width: '20%', color: "orange" }} align="center">
                    Nécessite des changements mineurs
                  </TableCell>
                  <TableCell style={{ width: '10%' }} align="right"></TableCell>
                </>
              )}
              {row.approvalDecision == ApprovalDecision.PENDING && (
                <>
                  <TableCell style={{ width: '20%' }} align="center">{getStatus(row.status)}</TableCell>
                  <TableCell style={{ width: '10%', paddingTop: '0%', paddingBottom: '0%' }} align="right">
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "#c00000" }}
                      onClick={() => handleCase(row.id_)}
                    >
                      Traiter
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
