import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/features/store";

type Mode = "login" | "register" | "supplier";
type ValueWithErr = {
  value: string;
  err: string;
};

interface FormData {
  userType: UserType;
  form: {
    mode: Mode;
    data: {
      name: ValueWithErr;
      orgN: ValueWithErr;
      orgP: ValueWithErr;
      email: ValueWithErr;
      pw: ValueWithErr;
    };
    processing: boolean;
    serverResponseError: string;
  };
  main: {
    isFetching: boolean;
    success: boolean;
    suppliers: any;
    offset: number;
    viewSupplier: {
      active: boolean;
      data: {
        id: string;
        bizmatcheventId: string;
        logoSecUrl: string;
        name: string;
        country: string;
        website: string;
        description: string;
        timeslots: any;
      };
    };
  };
  user: {
    isLoggedIn: boolean;
    id: string;
    bizmatcheventId: string;
    name: string;
    orgN: string;
    orgP: string;
    email: string;
    acsTok: string;
  };
  supplier: {
    id: string;
    isLoggedIn: boolean;
    bizmatcheventId: string;
    country: string;
    description: string;
    location: string;
    logoSecUrl: string;
    name: string;
    website: string;
    timeslots: any;
    open: string;
    acsTok: string;
    fetching: {
      requesting: boolean;
      status: boolean;
    };
    timeslot: {
      id: string;
      fetching: {
        requesting: boolean;
        status: boolean;
      };
    };
  };
}

const initialData__LOGIN = {
  name: {
    value: "",
    err: "",
  },
  orgN: {
    value: "",
    err: "",
  },
  orgP: {
    value: "",
    err: "",
  },
  email: {
    value: "",
    err: "",
  },
  pw: {
    value: "",
    err: "",
  },
};

type UserType = "client" | "supplier" | "";
const initialState: FormData = {
  userType: "",
  form: {
    mode: "login",
    data: {
      name: {
        value: "",
        err: "",
      },
      orgN: {
        value: "",
        err: "",
      },
      orgP: {
        value: "",
        err: "",
      },
      email: {
        value: "",
        err: "",
      },
      pw: {
        value: "",
        err: "",
      },
    },
    processing: false,
    serverResponseError: "",
  },
  main: {
    isFetching: false,
    success: false,
    suppliers: [],
    offset: 0,
    viewSupplier: {
      active: false,
      data: {
        id: "",
        bizmatcheventId: "",
        logoSecUrl: "",
        name: "",
        country: "",
        website: "",
        description: "",
        timeslots: [],
      },
    },
  },
  user: {
    isLoggedIn: false,
    id: "",
    bizmatcheventId: "",
    name: "",
    orgN: "",
    orgP: "",
    email: "",
    acsTok: "",
  },
  supplier: {
    id: "",
    isLoggedIn: false,
    bizmatcheventId: "",
    country: "",
    description: "",
    location: "",
    logoSecUrl: "",
    name: "",
    website: "",
    timeslots: [],
    open: false,
    acsTok: "",
    fetching: {
      requesting: false,
      status: false,
    },
    timeslot: {
      id: "",
      fetching: {
        requesting: false,
        status: false,
      },
    },
  },
};

const userDefault = {
  isLoggedIn: false,
  id: "",
  bizmatcheventId: "",
  name: "",
  orgN: "",
  orgP: "",
  email: "",
  acsTok: "",
};

const supplierDefault = {
  active: false,
  data: {
    id: "",
    bizmatcheventId: "",
    logoSecUrl: "",
    name: "",
    country: "",
    website: "",
    description: "",
    timeslots: [],
    open: false,
    acsTok: "",
  },
};

const supplierAccountDefault = {
  id: "",
  isLoggedIn: false,
  bizmatcheventId: "",
  country: "",
  description: "",
  location: "",
  logoSecUrl: "",
  name: "",
  website: "",
  timeslots: [],
  open: false,
  fetching: {
    requesting: false,
    status: false,
  },
  timeslot: {
    id: "",
    fetching: {
      requesting: false,
      status: false,
    },
  },
};

const bizSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<Mode>) => {
      state.form.mode = action.payload;
    },
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.form.processing = action.payload;
    },
    setServerResponseError: (state, action: PayloadAction<string>) => {
      state.form.serverResponseError = action.payload;
    },
    setLoginFormData: (
      state,
      action: PayloadAction<FormData["form"]["data"]>
    ) => {
      state.form.data = action.payload;
    },
    resetLoginFormData: (state) => {
      state.form.data = initialData__LOGIN;
    },

    setIsFetching: (state, action: PayloadAction<boolean>) => {
      state.main.isFetching = action.payload;
    },
    setIsSuccess(state, action: PayloadAction<boolean>) {
      state.main.success = action.payload;
    },
    setSuppliers(state, action: PayloadAction<any>) {
      state.main.suppliers = action.payload;
    },
    setViewSupplier(
      state,
      action: PayloadAction<FormData["main"]["viewSupplier"]>
    ) {
      state.main.viewSupplier = action.payload;
    },
    setOffset(state, action: PayloadAction<number>) {
      state.main.offset = action.payload;
    },

    setUser(state, action: PayloadAction<FormData["user"]>) {
      state.user = action.payload;
    },
    setUserType(state, action: PayloadAction<UserType>) {
      state.userType = action.payload;
    },

    setSupplierAccount(state, action: PayloadAction<FormData["supplier"]>) {
      state.supplier = action.payload;
    },

    resetUser(state) {
      state.user = { ...userDefault };
    },

    setSupplierTimeslots(state, action: PayloadAction<any>) {
      state.supplier.timeslots = action.payload;
    },

    setSupplierScreenTimeslot(
      state,
      action: PayloadAction<FormData["supplier"]["timeslot"]>
    ) {
      state.supplier.timeslot = action.payload;
    },

    setSupplierFetchingStatus(
      state,
      action: PayloadAction<FormData["supplier"]["fetching"]>
    ) {
      state.supplier.fetching = action.payload;
    },

    resetSupplier(state) {
      state.main.viewSupplier = { ...supplierDefault };
    },

    resetSupplierAccount(state) {
      state.supplier = { ...supplierAccountDefault };
    },
  },
});

export const {
  setMode,
  setProcessing,
  setServerResponseError,
  setLoginFormData,
  resetLoginFormData,
  setIsFetching,
  setIsSuccess,
  setSuppliers,
  setViewSupplier,
  setOffset,
  setUser,
  setSupplierAccount,
  setSupplierTimeslots,
  setUserType,
  setSupplierScreenTimeslot,
  setSupplierFetchingStatus,
  resetUser,
  resetSupplier,
  resetSupplierAccount,
} = bizSlice.actions;
export const bizmatchSlice = (state: RootState) => state.bizSlice;
export default bizSlice.reducer;
