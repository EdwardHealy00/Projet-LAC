import React from "react";
import { Role, RoleProps } from "../../../model/Role";
import { UnlockAccess } from "../../connection/UnlockAcess";
import { ApprovalComity } from "./comity/Approval";
import { ApprovalDeputy } from "./deputy/Approval";

export default function Approval() {
  return (
    <div>
      <UnlockAccess
        role={Role.User}
        children={<ApprovalComity />}
      ></UnlockAccess>
      
      <UnlockAccess
        role={Role.Admin}
        children={<ApprovalDeputy />}
      ></UnlockAccess>
    </div>
  );
}
