import { Event } from "./event";

export type Registration = {
  id: string;
  eventId: string;
  checkedIn?: boolean;
  email: string;
  prefix?: string;
  firstName: string;
  lastName: string;
  year: string;
  schoolName: string;
  registrationDate: Date;
  event?: Event;
}