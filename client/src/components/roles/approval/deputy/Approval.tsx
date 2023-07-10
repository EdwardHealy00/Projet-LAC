import React from "react";
import { DeputyCaseStudyProps } from "../../../../model/CaseStudy";
import "../Approval.scss";
import CaseTable from "./CaseTable";

export function ApprovalDeputy(caseStudiesProp: DeputyCaseStudyProps) {
         return (
           <div id="approvalPage">
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
           </div>
         );
       }
