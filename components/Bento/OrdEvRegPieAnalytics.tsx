import {CircularProgress} from "@mui/material";
import {LineChart, Users} from "lucide-react";
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

interface BentoParametersPieChart {
    isFetching: boolean;
    data: PieChartData;
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
                                             }: BentoParametersPieChart) {
    return (
        <>
            <h1 className="font-[500] text-sm flex gap-2 items-center text-neutral-900">
                <Users size="15px" strokeWidth={2}/>
                In Event / Not In Event (Ordinary)
            </h1>
            <div className="flex-1 relative">
                {!isFetching &&
                    !(
                        data.datasets[0].data[0] === 0 && data.datasets[0].data[1] === 0
                    ) && (
                        <Pie
                            data={data}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {legend: {display: false}},
                            }}
                        />
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
