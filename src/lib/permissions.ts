import { createAccessControl } from "better-auth/plugins/access";
import {
  defaultStatements,
  adminAc,
} from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,

  event: [
    "create",
    "read",
    "join",
    "update",
    "delete",
  ],
} as const;

export const ac = createAccessControl(statement);

// Regular user
export const user = ac.newRole({
  event: ["read", "join"],
});

// Event organizer
export const organizer = ac.newRole({
  event: ["create", "read", "update"],
});

// Platform administrator
export const admin = ac.newRole({
  ...adminAc.statements,
  event: ["create", "read", "join", "update", "delete"],
});