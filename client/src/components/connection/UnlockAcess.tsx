import React, { FC } from "react";
import { Role, RoleProps } from "../../model/Role";

const grantPermission = (requestedRoles: Role[]) => {
  const permittedRoles = localStorage.getItem("role") as Role;
  console.log(permittedRoles, requestedRoles);
  return permittedRoles === Role.Admin || requestedRoles.includes(permittedRoles);
};

export const UnlockAccess: Function = ({role, children}: RoleProps) => {
  console.log(role);
  console.log(children);
  const permission = grantPermission(role);
  console.log(permission);
  return <>{permission && children}</>;
};
