export interface EvDAT {
  name: string;
  location: string;
  date: string;
  start: string;
  end: string;
  allowWalkIn: boolean;
  limitAtendee: boolean;
  atendeeLim: number;
  coverFile: File | null;
  idLayout: number;
}

export interface EvDATErr {
  name: string;
  location: string;
  date: string;
  start: string;
  end: string;
  allowWalkIn: string;
  limitAtendee: string;
  atendeeLim: string;
  coverFile: string;
  idLayout: string;
}

export interface InputBoxInterface {
  identifier: string;
  displayName: string;
  inputType: string;
  value: any;
  setData: React.Dispatch<React.SetStateAction<EvDAT>>;
  setError: React.Dispatch<React.SetStateAction<EvDATErr>>;
  error: string;
  onInputEventType: string;
  className?: string;
  extraErrFlag?: string;
}

export interface Cb {
  onExit(): void;
}
