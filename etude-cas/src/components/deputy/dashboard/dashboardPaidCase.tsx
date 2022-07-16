import React from "react";
import "../../../styles/DashboardPaidCase.scss";
import CasesRecieved from "./CasesRecieved";
import CasesWaitingApproval from "./CasesWaitingApproval";

function DashboardPaidCase() {

    
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
    </div>
  );
}

export default DashboardPaidCase;
