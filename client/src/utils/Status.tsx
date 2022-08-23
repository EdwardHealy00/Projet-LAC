import { CaseStep } from "../model/enum/CaseStatus";

export function getStatus(step: CaseStep) {
  switch (step) {
    case CaseStep.WaitingPreApproval:
      return "Nouveau";
    case CaseStep.WaitingComity:
      return "En révision";
    case CaseStep.WaitingPolyPress:
      return "En cours d’édition";
    case CaseStep.WaitingCatalogue:
      return "À ajouter";
    default:
      return "Modifications à faire";
  }
}
