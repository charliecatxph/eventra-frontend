import axios from "axios";

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

            let tmpx: any = {
                labels: [],
                data: [],
                movingAvg: []
            };

            Object.keys(acs).forEach((date) => {
                tmpx = {
                    ...tmpx,
                    labels: [...tmpx.labels, date],
                    data: [...tmpx.data, acs[date]]

                };

            });

            const n = tmpx.data.length;
            const windowSize = 5; // 20% of data length as window size
            const half = Math.floor(windowSize / 2);

            tmpx.movingAvg = [];

            for (let i = 0; i < n; i++) {
                const start = Math.max(0, i - half);
                const end = Math.min(n, i + half + 1);
                const window = tmpx.data.slice(start, end);
                const avg = window.reduce((sum, val) => sum + val, 0) / window.length;
                tmpx.movingAvg.push(avg);
            }


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
