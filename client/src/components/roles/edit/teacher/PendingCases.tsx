import React from "react";
import { TeacherCaseStudyProps } from "../../../../model/CaseStudy";
import "./PendingCases.scss";
import CaseTable from "./PendingCasesTable";
import { Outlet } from "react-router-dom";

export function PendingCasesTeacher(caseStudiesProp: TeacherCaseStudyProps) {
  return (
    <div id="pendingCasesPage">
      <div className="stepApproval">
        <b>
          <h2>Étape 1 : Préapprobation par l’adjoint administratif</h2>
        </b>
        <CaseTable cases={caseStudiesProp.step1}/>
      </div>
      <div className="stepApproval">
        <b>
          <h2>Étape 2 : Révision du comité scientifique</h2>
        </b>
        <CaseTable cases={caseStudiesProp.step2}/>
      </div>
      <div className="stepApproval">
        <b>
          <h2>Étape 3 : Ajout au catalogue</h2>
        </b>
        <CaseTable cases={caseStudiesProp.step3}/>
      </div>
      <div className="stepApproval">
        <b>
          <h2>Publiés</h2>
        </b>
        <CaseTable cases={caseStudiesProp.step4}/>
      </div>
      <Outlet />
    </div>
  );
}
