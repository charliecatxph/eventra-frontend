export interface OrdinaryEvent {
  id: string;
  orgId: string;
  allowWalkIn: boolean;
  attendeeLim: number;
  coverFile: string;
  coverFilePubId: string;
  date: number;
  description: string;
  endT: number;
  location: string;
  name: string;
  offset: number;
  organizedBy: string;
  startT: number;
  upl_on: number;
  type: string;
  status: string;
  atnSz?: number;
}

export interface BizMatchEvent {
  id: string;
  date: number;
  endT: number;
  lim: number;
  name: string;
  offset: number;
  orgId: string;
  startT: number;
  suppliersCount: number;
  timeslotsCount: number;
  upl_on: number;
  type: string;
  status: string;
}

export interface Atendee {
  id: string;
  addr: string;
  attended: boolean;
  email: string;
  evId: string;
  name: string;
  orgN: string;
  orgP: string;
  phoneNumber: string;
  public_id_qr: string;
  qrId_secUrl: string;
  registeredOn: number;
  salutations: string;
}
