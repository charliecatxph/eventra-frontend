import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { BizMatchEvent } from "@/interfaces/Interface";

interface Supplier {
  accessCode: string;
  id: string;
  bizmatcheventId: string;
  logoSecUrl: string;
  name: string;
  country: string;
  website: string;
  description: string;
  timeslots: Timeslot[];
  bookedPercentage: number;
}

interface Timeslot {
  id: string;
  supplierId: string;
  startT: string;
  endT: string;
  remainingSlots: number;
  registrations: Clients[];
}

interface Clients {
  id: string;
  bizmatcheventId: string;
  name: string;
  orgN: string;
  orgP: string;
  email: string;
  pw: string;
}

interface BizMatchEventWithStats extends BizMatchEvent {
  suppliers: Supplier[];
  clients: Clients[];
  stats: {
    suppliersCount: number; // how many suppliers
    timeslotsBooked: number; // timeslots with booking = 0
    timeslotsIssued: number; // ts * supl
    clientsRegistered: number; // how many clients registered to this event
    attendeesRegisteredToTimeslots: number; // attendees compiled, all states (attended, present, registered, no_show)
    attendedClients: number; // attendees with flag attended
    showUpRate: number; // percentage, atClt // atRTT
    noShow: number;
    timeslotsFilled: number;
  };
}

interface BizMatchEventSlice {
  initialized: boolean;
  data: BizMatchEventWithStats;
  fetching: {
    mainEvent: boolean;
    bookingOverview: boolean;
    cts: boolean;
    clients: boolean;
    suppliers: boolean;
  };
}

const initialState: BizMatchEventSlice = {
  initialized: false,
  data: {
    id: "",
    date: 0,
    endT: 0,
    lim: 0,
    name: "",
    offset: 0,
    orgId: "",
    startT: 0,
    suppliersCount: 0,
    timeslotsCount: 0,
    upl_on: 0,
    type: "",
    status: "",
    location: "",
    stats: {
      attended: 0,
      registered: 0,
      noShow: 0,
      organizationsRegistered: 0,
      showUpRate: 0,
      suppliersCount: 0,
      timeslotsFilled: 0,
      timeslotsFilledPercentage: 0,
      timeslotsIssued: 0,
    },
    suppliers: [],
    clients: [],
  },
  fetching: {
    mainEvent: false,
    bookingOverview: false,
    cts: false,
    clients: false,
    suppliers: false,
  },
};

const bzSlice = createSlice({
  name: "bzEvent",
  initialState,
  reducers: {
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.initialized = action.payload;
    },
    setEvent: (state, action: PayloadAction<BizMatchEventSlice["data"]>) => {
      state.data = action.payload;
    },
    setFetching: (
      state,
      action: PayloadAction<BizMatchEventSlice["fetching"]>
    ) => {
      state.fetching = action.payload;
    },
    setSuppliers: (
      state,
      action: PayloadAction<BizMatchEventSlice["data"]["suppliers"]>
    ) => {
      state.data.suppliers = action.payload;
    },
    resetEvent: () => {
      return { ...initialState };
    },
  },
});

export const {
  setInitialized,
  setEvent,
  setFetching,
  resetEvent,
  setSuppliers,
} = bzSlice.actions;
export const bizDataSlice = (state: RootState) => state.bizDataSlice;
export default bzSlice.reducer;
