import { Event } from "./event";

export interface Certificate {
  id: string;
  eventId: string;
  name: string;
  templatePath: string;
  templateUrl: string;
  createdAt: Date;
  updatedAt: Date;
  event?: Event;
  positions?: Position[];
}

export interface Signature {
  id: string;
  firstName: string;
  lastName: string;
  path: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Position {
  id: number;
  certificateId: string;
  signatureId?: string;
  x: number;
  y: number;
  type: string;
  fontSize: number;
  width?: number;
  height?: number;
  createdAt: Date;
  updatedAt: Date;
  certificate?: Certificate;
  signature?: Signature;
};
