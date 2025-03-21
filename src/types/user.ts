export enum Role {
  admin = "Admin",
  staff = "Staff",
  member = "Member",
}

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

