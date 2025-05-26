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
import {LineChart, PencilIcon} from "lucide-react";

import {Line} from "react-chartjs-2";
import CountUp from "react-countup";
import {useEffect, useState} from "react";

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
            display: false,
        },
        y: {
            display: false,
            ticks: {
                callback: function (value: number) {
                    if (Number.isInteger(value)) {
                        return value;
                    }
                },
                stepSize: 1,
            },
        },

    },


};

export default function OrdEvRegLineAnalytics(
    {
        isFetching,
        data
    }
) {
    const [totalRegistered, setTotalRegistered] = useState<number>(0);

    useEffect(() => {
        let x = 0;
        data.datasets[0].data.forEach(num => {
            x += num;
        })
        setTotalRegistered(x);
    }, [data]);
    return (
        <>

            <h1 className="font-[400] geist text-sm flex gap-2 items-center text-neutral-900">
                <PencilIcon size="15px" strokeWidth={2}/>
                Registrations
            </h1>
            {!isFetching && data.labels.length !== 0 && (
                <div className="h-full flex flex-col">
                    <h1 className="text-3xl font-[600] geist">
                        <CountUp end={totalRegistered} duration={1}/>
                    </h1>
                    <p className="text-sm text-neutral-800 geist">people have registered</p>
                    <div className="flex-1 relative">
                        <Line options={options} data={data} className="absolute"/>
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
            {!isFetching && data.labels.length === 0 && (
                <div className="grid place-content-center h-full w-full">
                    <div className="flex flex-col items-center gap-2 text-neutral-600">
                        <LineChart size="18px"/>
                        <p className="text-sm">Analytics unavailable.</p>
                    </div>
                </div>
            )}

        </>
    );
}
