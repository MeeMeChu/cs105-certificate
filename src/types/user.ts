export enum Role {
  Admin = "Admin",
  Staff = "Staff",
  Member = "Member",
}

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

