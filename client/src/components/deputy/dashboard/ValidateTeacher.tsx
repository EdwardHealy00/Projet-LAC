import * as React from "react";
import "./ValidateTeacher.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import { TeacherValidate } from "../../../model/UserValidate";
import { Divider, Typography } from "@mui/material";
import ReviewTeacher from "./ReviewTeacher";

function createData(
  name: string,
  email: string,
  country: string,
  school: string,
  proofUrl: string
) {
  return { name, email, country, school, proofUrl } as TeacherValidate;
}

export default function ValidateTeacherList() {
  const [teachers, setTeachers] = React.useState<TeacherValidate[]>([]);

  const getTeachersToValidate = async () => {
    axios
      .get(`${process.env.REACT_APP_BASE_API_URL}/api/users/approval`, {
        withCredentials: true,
      })
      .then((res) => {
        const teachers = [];
        for (const teacher of res.data.data.users) {
          if (teacher.proof) {
            teachers.push(
              createData(
                teacher.firstName + " " + teacher.lastName,
                teacher.email,
                teacher.country,
                teacher.school,
                teacher.proofUrl
              )
            );
          }
        }
        setTeachers(teachers);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  React.useEffect(() => {
    getTeachersToValidate();
  }, []);

  return (
    <div>
      <Divider></Divider>
      <div id="approvalTeacher">
        <div id="titleApprovalTeacher">
          <Typography variant="h3">
            Professeur(e)s en attente d'approbation
          </Typography>
        </div>
        {(teachers.length > 0 && (
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell align="right">Pays</TableCell>
                  <TableCell align="right">Université</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teachers.map((teacher) => (
                  <TableRow
                    key={teacher.email}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {teacher.name}
                    </TableCell>
                    <TableCell align="right">{teacher.country}</TableCell>
                    <TableCell align="right">{teacher.school}</TableCell>
                    <TableCell align="right">
                      <ReviewTeacher
                        teacher={teacher}
                        onCloseDialog={getTeachersToValidate}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )) || (
          <div>
            <h1>Aucun professeur à valider</h1>
          </div>
        )}
      </div>
    </div>
  );
}
