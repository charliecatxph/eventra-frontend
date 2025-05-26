import {CircularProgress} from "@mui/material";
import {DoorOpen, LineChart} from "lucide-react";
import {
    ArcElement,
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from "chart.js";

import {Pie} from "react-chartjs-2";
import CountUp from "react-countup";

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


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement
);

export default function OrdEvRegPieAnalytics({
                                                 isFetching,
                                                 data,
                                             }) {
    return (
        <>
            <h1 className="font-[400] geist text-sm flex gap-2 items-center text-neutral-900">
                <DoorOpen size="15px" strokeWidth={2}/>
                Attendance
            </h1>
            <div className="flex-1 relative">
                {!isFetching &&
                    !(
                        data.datasets[0].data[0] === 0 && data.datasets[0].data[1] === 0
                    ) && (
                        <div className="flex h-full items-center">
                            <div className="basis-1/2">
                                <div><h1 className="text-3xl font-[600] geist"><CountUp end={data.datasets[0].data[1]}
                                                                                        duration={1}/></h1>
                                    <p className="text-sm text-neutral-800 geist">In Event</p></div>
                                <div className="mt-2"><h1 className="text-3xl font-[600] geist"><CountUp
                                    end={data.datasets[0].data[0]} duration={1}/></h1>
                                    <p className="text-sm text-neutral-800 geist">Not In Event</p></div>
                            </div>
                            <div className="basis-1/2 h-full">
                                <Pie
                                    data={data}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {legend: {display: false}},
                                    }}
                                />
                            </div>
                        </div>
                    )}
                {!isFetching &&
                    data.datasets[0].data[0] === 0 &&
                    data.datasets[0].data[1] === 0 && (
                        <div className="grid place-content-center h-full w-full">
                            <div className="flex flex-col items-center gap-2 text-neutral-600">
                                <LineChart size="18px"/>
                                <p className="text-sm">Analytics unavailable.</p>
                            </div>
                        </div>
                    )}
                {isFetching && (
                    <div className="grid place-content-center h-full w-full">
                        <div className="flex items-center gap-2">
                            <CircularProgress
                                size={40}
                                thickness={3}
                                disableShrink
                                sx={{
                                    color: "black", // spinner stroke
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
