import React from "react";
import { Role, RoleProps } from "../../../model/Role";
import { UnlockAccess } from "../../connection/UnlockAcess";
import { ApprovalComity } from "./comity/Approval";
import { ApprovalDeputy } from "./deputy/Approval";
import { ApprovalPolyPress } from "./polyPress/Approval";

export default function Approval() {
  return (
    <div>
      <UnlockAccess
        role={[Role.Admin, Role.Comity]}
        children={<ApprovalComity />}
      ></UnlockAccess>
      
      <UnlockAccess
        role={[Role.Admin, Role.Deputy]}
        children={<ApprovalDeputy />}
      ></UnlockAccess>

      <UnlockAccess
        role={[Role.Admin, Role.PolyPress]}
        children={<ApprovalPolyPress />}
      ></UnlockAccess>
    </div>
  );
}
