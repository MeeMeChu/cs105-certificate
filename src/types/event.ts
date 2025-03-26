export enum eventStatus {
  approved = "Approved",
  draft = "Draft",
}

export type Event = {
  id: string;
  title: string;
  description: string;
  image?: string;
  startDate: Date;
  endDate: Date;
  location: string;
  status: eventStatus;
  secretPass: string;
  createdAt?: string;
  updateAt?: string;
}