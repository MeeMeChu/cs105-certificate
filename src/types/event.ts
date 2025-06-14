export enum eventStatus {
  approved = "Approved",
  draft = "Draft",
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  image?: string;
  startDate: Date;
  endDate: Date;
  location: string;
  status: eventStatus;
  secretPass: string;
  participants?: number;
  createdAt?: string;
  updateAt?: string;
}