export enum Role {
  admin = "Admin",
  staff = "Staff",
  member = "Member",
}

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: Role;
  createdAt?: string;
  updatedAt?: string;
}

