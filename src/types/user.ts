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
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

