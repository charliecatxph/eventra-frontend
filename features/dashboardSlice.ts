import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "./store";
import {BizMatchEvent, OrdinaryEvent} from "@/interfaces/Interface";


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

interface BizMatchEventWithStats extends BizMatchEvent {
    stats: {
        attended: number,
        registered: number,
        noShow: number,
        organizationsRegistered: number,
        showUpRate: number,
        suppliersCount: number,
        timeslotsFilled: number,
        timeslotsFilledPercentage: number,
        timeslotsIssued: number,
    }
}

interface DashboardState {
    initialized: boolean;
    ordPieChartData: PieChartData,
    ordLineChartData: LineChartData,
    highlightedOrdinaryEvent: OrdinaryEvent,
    highlightedBzEvent: BizMatchEventWithStats,
    allEvents: OrdinaryEvent[] | BizMatchEvent[]
}

const initialState: DashboardState = {
    initialized: false,
    ordPieChartData: {
        labels: ["Not in Event", "In Event"],
        datasets: [{
            label: "Attendee",
            data: [],
            backgroundColor: ["rgba(231, 76, 60,0.2)", "rgba(52, 152, 219,0.2)"],
            borderColor: ["rgba(231, 76, 60,1.0)", "rgba(52, 152, 219,1.0)"],
            borderWidth: 1,
        }]
    },
    ordLineChartData: {
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
    highlightedOrdinaryEvent: {
        id: "",
        orgId: "",
        allowWalkIn: false,
        attendeeLim: 0,
        coverFile: "",
        coverFilePubId: "",
        date: 0,
        description: "",
        endT: 0,
        location: "",
        name: "",
        offset: 0,
        organizedBy: "",
        startT: 0,
        upl_on: 0,
        type: "",
        status: "",
        atnSz: 0
    },
    highlightedBzEvent: {
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
        }
    },
    allEvents: []
}


const dashSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        setInitialized: (state, action: PayloadAction<boolean>) => {
            state.initialized = action.payload;
        },
        setOrdLineChartData: (state, action: PayloadAction<DashboardState["ordLineChartData"]>) => {
            state.ordLineChartData = action.payload;
        },
        setOrdPieChartData: (state, action: PayloadAction<DashboardState["ordPieChartData"]>) => {
            state.ordPieChartData = action.payload;
        },
        setHighlightedOrdEvent: (state, action: PayloadAction<DashboardState["highlightedOrdinaryEvent"]>) => {
            state.highlightedOrdinaryEvent = action.payload;
        },
        setHighlightedBzEvent: (state, action: PayloadAction<DashboardState["highlightedBzEvent"]>) => {
            state.highlightedBzEvent = action.payload;
        },
        allEvents: (state, action: PayloadAction<DashboardState["allEvents"]>) => {
            state.allEvents = action.payload;
        },
        resetDashboard: () => {
            return {...initialState}
        }
    },
})


export const {
    setInitialized,
    setOrdLineChartData,
    setOrdPieChartData,
    setHighlightedOrdEvent,
    setHighlightedBzEvent,
    allEvents,
    resetDashboard
} = dashSlice.actions;
export const dashboardSlice = (state: RootState) => state.dashSlice;
export default dashSlice.reducer;

