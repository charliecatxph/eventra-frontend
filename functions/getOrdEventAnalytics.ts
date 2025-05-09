import axios from "axios";

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

interface GetOrdEventAnalyticsResponse {
    data: LineChartData;
    err?: string;
}

export const getOrdEventAnalytics = (
    apiLink: string,
    acsTok: string,
    evId: string,
    offset: number,
    mode: string
): Promise<GetOrdEventAnalyticsResponse> => {
    return new Promise(async (resolve, reject) => {
        try {
            const req = await axios
                .post(
                    `${apiLink}/fetch-ord-event-analytics`,
                    {
                        evId: evId,
                        offset: offset,
                        type: mode,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${acsTok}`,
                            "Content-Type": "application/json",
                        },
                        withCredentials: true,
                    }
                )
                .catch((e) => {
                    throw new Error("Fail to fetch ordinary event analytics.");
                });

            const acs = req.data.data;

            let tmpx: LineChartData = {
                labels: [],
                datasets: [
                    {
                        label: "Registrations",
                        data: [],
                        borderColor: "oklch(55.8% 0.288 302.321)",

                        tension: 0.6,

                        pointRadius: 4, // Visible point
                        pointHoverRadius: 6, // Enlarges on hover
                        pointBackgroundColor: "#fff",
                        pointHoverBackgroundColor: "#4338CA",
                        pointBorderColor: "#000",
                        pointHoverBorderColor: "#fff",
                    },
                ],
            };

            Object.keys(acs).forEach((date) => {
                tmpx = {
                    labels: [...tmpx.labels, date],
                    datasets: [
                        {
                            ...tmpx.datasets[0],
                            data: [...tmpx.datasets[0].data, acs[date]],
                        },
                    ],
                };
            });

            resolve({
                data: tmpx,
            });
        } catch (e: any) {
            reject({
                data: {},
                err: e.message,
            });
        }
    });
};
