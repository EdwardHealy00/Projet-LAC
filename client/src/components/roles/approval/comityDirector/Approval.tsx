import React from "react";
import { CaseStudyProps } from "../../../../model/CaseStudy";
import "../Approval.scss";
import CaseTable from "./CaseTable";

export function ApprovalComityDirector(caseStudiesProp: CaseStudyProps) {
  return (
    <div id="approvalPage">
      <div className="stepApproval">
        <b>
          <h2>Actions à prendre</h2>
        </b>
        <CaseTable cases={caseStudiesProp.caseStudies} />
      </div>
    </div>
  );
}
