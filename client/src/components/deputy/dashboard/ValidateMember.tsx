import * as React from "react";
import "./ValidateTeacher.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import { MemberValidate } from "../../../model/UserValidate";
import { Button, Divider, Typography } from "@mui/material";
import ConfirmChangesDialog from "../../../utils/ConfirmChangesDialog";
import { useNavigate } from "react-router-dom";

function createData(
  name: string,
  email: string,
  country: string,
  school: string,
) {
  return { name, email, country, school } as MemberValidate;
}

export default function ValidateMemberList() {
  const [members, setMembers] = React.useState<MemberValidate[]>([]);
  const [isApproved, setIsApproved] = React.useState(false);
  const [memberEmail, setMemberEmail] = React.useState<string>("");
  const navigate = useNavigate();
  
  const [
    confirmChangesDialogOpen,
    setConfirmChangesDialogOpen,
  ] = React.useState(false);

  const openConfirmChangesDialogAccept = (email: string) => {
    setIsApproved(true);
    setMemberEmail(email)
    setConfirmChangesDialogOpen(true);
  };

  const openConfirmChangesDialogRefuse = (email: string)  => {
    setIsApproved(false);
    setMemberEmail(email)
    setConfirmChangesDialogOpen(true);
  };

  const handleConfirmChangesDialogClose = () => {
    setConfirmChangesDialogOpen(false);
  };

  const sendResult = async (memberEmail: string, isApproved: boolean) => {
    axios
      .post(
        `${process.env.REACT_APP_BASE_API_URL}/api/users/approvalResultMember`,
        {
          email: memberEmail,
          approved: isApproved,
        },
        {
          withCredentials: true,
        })
        .then((res) => {
            handleConfirmChangesDialogClose();
            getMembersToValidate();
        })
        .catch((err) => {
            console.log(err);
      });
  };

  const handleSendResult = () => {
    sendResult(memberEmail, isApproved);
  };

  const getMembersToValidate = async () => {
    axios
      .get(`${process.env.REACT_APP_BASE_API_URL}/api/users/approvalMembers`, {
        withCredentials: true,
      })
      .then((res) => {
        const members = [];
        for (const member of res.data.data.users) {
            members.push(
              createData(
                member.firstName + " " + member.lastName,
                member.email,
                member.country,
                member.school,
              )
            );
        }
        setMembers(members);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  React.useEffect(() => {
    getMembersToValidate();
  }, []);

  return (
    <div>
      <Divider></Divider>
      <div id="approvalTeacher">
        <div id="titleApprovalTeacher">
          <Typography variant="h3">
            Membres en attente d'approbation
          </Typography>
        </div>
        {(members.length > 0 && (
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
                {members.map((member) => (
                  <TableRow
                    key={member.email}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {member.name}
                    </TableCell>
                    <TableCell align="right">{member.country}</TableCell>
                    <TableCell align="right">{member.school}</TableCell>
                    <TableCell align="right">
                        <Button variant="outlined" color="error" onClick={() => openConfirmChangesDialogRefuse(member.email)}>Refuser</Button>
                        <Button variant="outlined" onClick={() => openConfirmChangesDialogAccept(member.email)}>Accepter</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )) || (
          <div>
            <Typography align="center" variant="body1">Aucun membre à valider</Typography>
          </div>
        )}
      </div>
      <ConfirmChangesDialog
        open={confirmChangesDialogOpen}
        onClose={handleConfirmChangesDialogClose}
        onConfirm={handleSendResult}
      />
    </div>
  );
}
