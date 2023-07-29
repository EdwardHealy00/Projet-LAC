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

interface CaseProp {
  cases: Case[];
}

function navigateHandleCase(navigate: NavigateFunction, caseStudy?: Case) {
  navigate(
    `/my-pending-case-studies/case-edit?id=${caseStudy ? caseStudy.id_ : 0}`,
    { state: caseStudy }
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
            <TableCell>#</TableCell>
            <TableCell align="right">Titre du cas</TableCell>
            <TableCell align="right">Auteur</TableCell>
            <TableCell align="right">Soumis le</TableCell>
            <TableCell align="right">Statut</TableCell>
            <TableCell align="right"></TableCell>
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
              <TableCell align="right">{row.title}</TableCell>
              <TableCell align="right">{row.authors}</TableCell>
              <TableCell align="right">{row.date}</TableCell>
              {row.isRejected && (
                <>
                  <TableCell align="right" style={{ color: "red" }}>
                    Rejetée
                  </TableCell>
                  <TableCell align="right">
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
              {!row.isRejected && (
                <>
                  <TableCell align="right">{getStatus(row.status)}</TableCell>
                    <TableCell align="right">
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
