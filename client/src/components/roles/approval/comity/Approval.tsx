import React from "react";
import { Case } from "../../../../model/Case";
import "../Approval.scss";
import CaseTable from "./CaseTable";

function createData(
  id_: number,
  title: string,
  author: string,
  submitted: string,
  status: string
): Case {
  return { id_, title, author, submittedDate: submitted, status };
}

const rowsStep1: Case[] = [
  createData(
    53,
    "Mesurer la qualité des produits dans les simulations ABC",
    "Jane Doe",
    "2022/05/23",
    "Nouveau"
  ),
];

export function ApprovalComity() {
  return (
    <div id="approvalPage">
      <div className="stepApproval">
        <b>
          <h2>Actions à prendre</h2>
        </b>
        <CaseTable cases={rowsStep1} />
      </div>
    </div>
  );
}
