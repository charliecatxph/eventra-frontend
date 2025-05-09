import {CircularProgress} from "@mui/material";
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
import {LineChart, Users} from "lucide-react";

import {Line} from "react-chartjs-2";

interface LineChartData {
    labels: string[];
    datasets: [
        {
            label: string;
            data: number[];
            borderColor: string;
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

interface BentoParametersLineChart {
    isFetching: boolean;
    data: LineChartData;
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

const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
    },
    scales: {
        x: {
            grid: {
                display: false,
            },
        },
        y: {
            ticks: {
                callback: function (value: number) {
                    if (Number.isInteger(value)) {
                        return value;
                    }
                },
                stepSize: 1, // optional: forces step size to 1
            },
        },
    },
};

export default function OrdEvRegLineAnalytics({
                                                  isFetching,
                                                  data,
                                              }: BentoParametersLineChart) {
    return (
        <>
            <h1 className="font-[500] text-sm flex gap-2 items-center text-neutral-900">
                <Users size="15px" strokeWidth={2}/>
                Registrations Per Day (Ordinary)
            </h1>
            <div className="flex-1 relative">
                {!isFetching && data.labels.length !== 0 && (
                    <Line options={options} data={data}/>
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
                {!isFetching && data.labels.length === 0 && (
                    <div className="grid place-content-center h-full w-full">
                        <div className="flex flex-col items-center gap-2 text-neutral-600">
                            <LineChart size="18px"/>
                            <p className="text-sm">Analytics unavailable.</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
