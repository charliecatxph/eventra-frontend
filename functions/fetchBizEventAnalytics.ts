import axios from "axios";

export const fetchBizEventAnalytics = (
    bzId: string,
    acsTok: string,
): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const req = await axios
                .post(
                    `${process.env.NEXT_PUBLIC_API}/fetch-biz-event-analytics`,
                    {
                        bzId
                    },
                    {
                        headers: {
                            "Authorization": `Bearer ${acsTok}`,
                            "Content-Type": "application/json",
                        },
                        withCredentials: true,
                    }
                )
                .catch((e) => {
                    throw new Error("Fail to fetch biz event analytics.");
                });

            resolve({
                data: req,
            });
        } catch (e: any) {
            reject({
                data: {},
                err: e.message,
            });
        }
    });
};
