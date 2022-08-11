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

export function ApprovalDeputy() {

    
  return (
    <div id="approvalPage">
      <div id="filterStatus">
        <b>
          <h3>Filtres</h3>
        </b>
      </div>
      <div className="stepApproval">
        <b>
          <h2>Étape 1 : Préapprobation par l’adjoint administratif</h2>
        </b>
        <CaseTable cases={rowsStep1} />
      </div>
      <div className="stepApproval">
        <b>
          <h2>Étape 2 : Révision du comité scientifique</h2>
        </b>
        <CaseTable cases={rowsStep1} />
      </div>
      <div className="stepApproval">
        <b>
          <h2>Étape 3 : Édition par PolyPresse</h2>
        </b>
        <CaseTable cases={rowsStep1} />
      </div>
      <div className="stepApproval">
        <b>
          <h2>Étape 4 : Ajout au catalogue</h2>
        </b>
        <CaseTable cases={rowsStep1} />
      </div>
    </div>
  );
}
