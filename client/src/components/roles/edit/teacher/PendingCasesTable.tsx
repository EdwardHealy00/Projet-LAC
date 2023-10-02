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
import { Role } from "../../../../model/enum/Role";
import { getStatus } from "../../../../utils/Status";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { UnlockAccess } from "../../../connection/UnlockAccess";
import { ApprovalDecision } from "../../../../model/enum/ApprovalDecision";
import OverflowTooltip from "../../OverflowTooltip";

interface CaseProp {
  cases: Case[];
}

function navigateHandleCase(navigate: NavigateFunction, caseStudy?: Case) {
  navigate(
    `/my-pending-case-studies/case-edit?id=${caseStudy ? caseStudy.id_ : 0}`
  );
}

export default function CaseTable(prop: CaseProp) {
  const navigate = useNavigate();
  const handleCase = (id: number) => {
    const caseStudy = prop.cases.find(
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
          {prop.cases.map((row) => (
            <TableRow
              key={row.id_}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
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
                </>
              )}
              {row.approvalDecision == ApprovalDecision.MAJOR_CHANGES && (
                <>
                  <TableCell style={{ width: '20%', color: "orange" }} align="center">
                    Nécessite des changements majeurs
                  </TableCell>
                </>
              )}
              {row.approvalDecision == ApprovalDecision.MINOR_CHANGES && (
                <>
                  <TableCell style={{ width: '20%', color: "orange" }} align="center">
                    Nécessite des changements mineurs
                  </TableCell>
                </>
              )}
              {row.approvalDecision != ApprovalDecision.PENDING && row.approvalDecision != ApprovalDecision.APPROVED && (
                <>
                  <TableCell style={{ width: '10%', paddingTop: '0%', paddingBottom: '0%' }} align="right">
                      <UnlockAccess
                        role={[Role.Admin, Role.Professor]}
                        children={
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleCase(row.id_)}
                          >
                            Modifier
                          </Button>
                        }
                      ></UnlockAccess>
                    </TableCell>
                  </>
              )}
              {(row.approvalDecision == ApprovalDecision.PENDING || row.approvalDecision == ApprovalDecision.APPROVED) && (
                <>
                  <TableCell style={{ width: '20%' }} align="center">{getStatus(row.status)}</TableCell>
                  <TableCell style={{ width: '10%', paddingTop: '0%', paddingBottom: '0%' }} align="right">
                    <UnlockAccess
                      role={[Role.Admin, Role.Professor]}
                      children={
                        <Button
                          variant="outlined"
                          sx={{ backgroundColor: "primary" }}
                          onClick={() => handleCase(row.id_)}
                        >
                          Consulter
                        </Button>
                      }
                    ></UnlockAccess>
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
