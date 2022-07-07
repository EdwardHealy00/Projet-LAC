import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(
  courseId: string,
  courseName: string,
  professor: string,
  usage: string,
  semester: string
) {
  return { courseId, courseName, professor, usage, semester };
}

const rows = [
  createData('IND3202', 'Gestion et impacts du changement', 'Virginie Francoeur', 'Travail dirigé', 'H2023'),
  createData('IND8107', 'Gestion des changements tecjnologique et organisationnels', 'Virginie Francoeur', 'Discussion', 'A2022'),
  createData('IND3202', 'Gestion et impacts du changement', 'Virginie Francoeur', 'Devoir / Projet', 'H2022'),
  createData('IND3202', 'Gestion et impacts du changement', 'Virginie Francoeur', 'Devoir / Projet', 'H2021'),
];

export default function BasicTable() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Sigle</TableCell>
            <TableCell>Nom du cours</TableCell>
            <TableCell>Professeur</TableCell>
            <TableCell>Utilisation</TableCell>
            <TableCell>Session</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.courseId + row.semester}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.courseId}
              </TableCell>
              <TableCell>{row.professor}</TableCell>
              <TableCell>{row.usage}</TableCell>
              <TableCell>{row.courseName}</TableCell>
              <TableCell>{row.semester}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
