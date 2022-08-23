import React, { FC } from "react";
import { Role, RoleProps } from "../../model/enum/Role";

const grantPermission = (requestedRoles: Role[]) => {
  const permittedRoles = localStorage.getItem("role") as Role;
  return permittedRoles === Role.Admin || requestedRoles.includes(permittedRoles);
};

export const UnlockAccess: Function = ({role, children}: RoleProps) => {
  const permission = grantPermission(role);
  return <>{permission && children}</>;
};
