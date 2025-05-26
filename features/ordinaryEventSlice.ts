import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "./store";

interface FetchingStates {
    mainEvent: boolean;
    lineAnalytics: boolean;
    pieAnalytics: boolean;
    attendees: boolean;
    notifications: boolean;
}

interface OrdinaryEvent {
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

interface LineChartData {
    labels: string[];
    datasets: [
        {
            label: string;
            data: number[];
            borderColor: string;
            borderWidth: number,
            tension: number;
            pointRadius: number;
            pointHoverRadius: number;
            pointBackgroundColor: string;
            pointHoverBackgroundColor: string;
            pointBorderColor: string;
            pointHoverBorderColor: string;
        },
        {
            label: string;
            data: number[];
            borderColor: string;
            borderWidth: number,
            tension: number;
            pointRadius: number;
            pointHoverRadius: number;
            pointBackgroundColor: string;
            pointHoverBackgroundColor: string;
            pointBorderColor: string;
            pointHoverBorderColor: string;
        }
    ];
}

interface PieChartData {
    labels: string[];
    datasets: [
        {
            label: string;
            data: number[];
            backgroundColor: string[];
            borderColor: string[];
            borderWidth: number;
        }
    ];
}

type AttendBizMatch = "ys" | "ym" | "no";

interface Attendee {
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
    attendBizMatch: AttendBizMatch;
    country: string;
}


interface OrdinaryEventState {
    initialized: boolean;
    eventData: OrdinaryEvent,
    fetchingStates: FetchingStates,
    lineChartData: LineChartData,
    pieChartData: PieChartData,
    qrScanner: boolean,
    attendeeData: {
        data: Attendee[];
        totalRegistered: number,
        totalAtnSize: number,
    },
    requests: {
        page: number;
        limit: number,
        search: string,
        sort: {
            method: string,
            order: string
        },
        filter: {
            attended: boolean[],
            extras: any
        }
    }
}

const initialState: OrdinaryEventState = {
    initialized: false,
    eventData: {
        id: "",
        name: "",
        orgId: "",
        allowWalkIn: false,
        attendeeLim: 0,
        coverFile: "",
        coverFilePubId: "",
        date: 0,
        description: "",
        endT: 0,
        location: "",
        offset: 0,
        organizedBy: "",
        startT: 0,
        upl_on: 0,
        type: "",
        status: "",
    },
    fetchingStates: {
        mainEvent: false,
        lineAnalytics: false,
        pieAnalytics: false,
        attendees: false,
        notifications: false,
    },
    lineChartData: {
        labels: [],
        datasets: [
            {
                label: "Registrations",
                data: [],
                borderColor: "oklch(50.8% 0.118 165.612)",
                borderWidth: 2.5,
                tension: 0.4,

                pointRadius: 3,
                pointHoverRadius: 13,
                pointBackgroundColor: "#fff",
                pointHoverBackgroundColor: "#4338CA",
                pointBorderColor: "oklch(50.8% 0.118 165.612)",
                pointHoverBorderColor: "#fff",
            },
            {
                label: "Moving Average (MA)",
                data: [],
                borderColor: "rgba(0,0,0,0.2)",
                borderWidth: 2.5,
                tension: 0.4,

                pointRadius: 0,
                pointHoverRadius: 6,
                pointBackgroundColor: "#fff",
                pointHoverBackgroundColor: "#4338CA",
                pointBorderColor: "oklch(50.8% 0.118 165.612)",
                pointHoverBorderColor: "#fff",
            }
        ],

    },
    pieChartData: {
        labels: ["Not in Event", "In Event"],
        datasets: [
            {
                label: "Attendee",
                data: [],
                backgroundColor: ["rgba(231, 76, 60,0.2)", "rgba(52, 152, 219,0.2)"],
                borderColor: ["rgba(231, 76, 60,1.0)", "rgba(52, 152, 219,1.0)"],
                borderWidth: 1,
            },
        ],
    },
    qrScanner: false,
    attendeeData: {
        data: [],
        totalRegistered: 0,
        totalAtnSize: 0
    },
    requests: {
        page: 1,
        limit: 10,
        search: "",
        sort: {
            method: "registeredOn",
            order: "desc"
        },
        filter: {
            attended: [true, true],
            extras: {}
        }
    }
}


const ordSlice = createSlice({
    name: "ordinaryEventView",
    initialState,
    reducers: {
        setInitialized: (state, action: PayloadAction<boolean>) => {
            state.initialized = action.payload;
        },
        setEvent: (state, action: PayloadAction<OrdinaryEventState["eventData"]>) => {
            state.eventData = action.payload;
        },
        setFetching: (state, action: PayloadAction<OrdinaryEventState["fetchingStates"]>) => {
            state.fetchingStates = action.payload;
        },
        setLineChartData: (state, action: PayloadAction<OrdinaryEventState["lineChartData"]>) => {
            state.lineChartData = action.payload;
        },
        setPieChartData: (state, action: PayloadAction<OrdinaryEventState["pieChartData"]>) => {
            state.pieChartData = action.payload;
        },
        setQrScanner: (state, action: PayloadAction<boolean>) => {
            state.qrScanner = action.payload;
        },
        setAttendees: (state, action: PayloadAction<Attendee[]>) => {
            state.attendeeData.data = action.payload;
        },
        setTotalRegistered: (state, action: PayloadAction<number>) => {
            state.attendeeData.totalRegistered = action.payload;
        },
        setTotalAttendeeSize: (state, action: PayloadAction<number>) => {
            state.attendeeData.totalAtnSize = action.payload;
        },
        setRequestLimit: (state, action: PayloadAction<number>) => {
            state.requests.limit = action.payload;
        },
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.requests.search = action.payload;
        },
        setSortMethod: (state, action: PayloadAction<string>) => {
            state.requests.sort.method = action.payload.split("-")[0];
            state.requests.sort.order = action.payload.split("-")[1];
        },
        setFilters: (state, action: PayloadAction<OrdinaryEventState["requests"]["filter"]>) => {
            state.requests.filter = action.payload;
        },
        setPageNumber: (state, action: PayloadAction<number>) => {
            state.requests.page = action.payload
        },
        resetOrdinaryEvent: () => {
            return {...initialState}
        }
    },
})


export const {
    setInitialized,
    setTotalRegistered,
    setEvent,
    setFetching,
    setLineChartData,
    setPieChartData,
    setQrScanner,
    setAttendees,
    setTotalAttendeeSize,
    setRequestLimit,
    setSearchQuery,
    setSortMethod,
    setFilters,
    setPageNumber,
    resetOrdinaryEvent
} = ordSlice.actions;
export const ordinaryEventData = (state: RootState) => state.ordSlice;
export default ordSlice.reducer;
