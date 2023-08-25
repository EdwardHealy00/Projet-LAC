import React from "react";
import "./DashboardPaidCase.scss";
import CasesRecieved from "./CasesRecieved";
import CasesWaitingApproval from "./CasesWaitingApproval";
import Button from "@mui/material/Button";
import { UnlockAccess } from "../../connection/UnlockAccess";
import { Role } from "../../../model/enum/Role";
import { useNavigate } from "react-router-dom";
import ValidateTeacherList from "./ValidateTeacher";

function DashboardPaidCase() {

  const navigate = useNavigate();
  const onConsult = () => {
      navigate("/approval");
  }

  return (

    <div id="dashboard">
      <div id="titleDashboard">
        <h2>Tableau de bord - catalogue des cas payants</h2>
      </div>
      <div id="casesBarChart">
        <div>
          <CasesWaitingApproval />
        </div>
        <div>
          <CasesRecieved />
        </div>
      </div>
      <div>
        <UnlockAccess
          role={[Role.Deputy, Role.Comity, Role.ComityDirector]}
          children={
            <Button variant="contained" onClick={() => onConsult()}>
              Consulter les études de cas
            </Button>
          }
        ></UnlockAccess>
      </div>
      <div>
        <UnlockAccess
          role={[Role.Deputy]}
          children={<ValidateTeacherList />}
        ></UnlockAccess>
      </div>
    </div>
  );
}

export default DashboardPaidCase;
