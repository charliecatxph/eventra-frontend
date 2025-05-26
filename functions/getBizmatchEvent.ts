import axios from "axios";
import moment from "moment";

type Mode = "all" | "suppliers" | "clients";

export function getBizMatchEvent(
    mode: Mode,
    bzId: string,
    acsTok: string
) {
    return new Promise(async (resolve, reject) => {
        try {
            const rq = await axios.post(
                `${process.env.NEXT_PUBLIC_API}/fetch-biz-event`,
                {bzId: bzId, mode},
                {
                    withCredentials: true,
                    headers: {Authorization: `Bearer ${acsTok}`},
                }
            ).catch((e) => {
                throw new Error("Fail to fetch bizmatch event.");
            });


            const ev = rq.data.data;
            const status =
                moment().unix() < ev.startT!
                    ? "Upcoming"
                    : moment().unix() >= ev.startT! && moment().unix() <= ev.endT!
                        ? "Ongoing"
                        : "Past";

            resolve({
                data: {
                    ...ev,
                    status: status,
                }
            });
        } catch (e) {
            reject({
                data: {},
                err: e.message
            });
        }
    });
}
