import React, { FC } from "react";
import { Role } from "../../model/Role";

export const grantPermission = (requestedRoles: Role) => {
  const permittedRoles = localStorage.getItem("role");
  return permittedRoles === Role.Admin || permittedRoles === requestedRoles;
};

const UnlockAccess = (children: FC, request: Role) => {
  const permission = grantPermission(request);
  return <>{permission && children}</>;
};
