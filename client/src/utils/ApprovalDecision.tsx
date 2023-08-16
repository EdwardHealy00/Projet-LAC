import { ApprovalDecision } from "../model/enum/ApprovalDecision";

export function getApprovalDecision(decision: ApprovalDecision) {
  switch (decision) {
    case ApprovalDecision.REJECT:
      return "Rejetée";
    case ApprovalDecision.APPROVED:
      return "Approuvée";
    case ApprovalDecision.MAJOR_CHANGES:
      return "Changements majeurs requis";
    case ApprovalDecision.MINOR_CHANGES:
      return "Changements mineurs requis";
    default:
      return "n/a";
  }
}
