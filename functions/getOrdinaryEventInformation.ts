import {OrdinaryEvent} from "@/interfaces/Interface";
import axios from "axios";
import moment from "moment";

export function getOrdinaryEventInformation(
    evId: string,
    acsTok: string
): Promise<OrdinaryEvent> {
    return new Promise(async (resolve, reject) => {
        try {
            const rq = await axios.post(
                `${process.env.NEXT_PUBLIC_API}/get-ord-event-data`,
                {evId: evId},
                {
                    withCredentials: true,
                    headers: {Authorization: `Bearer ${acsTok}`},
                }
            );

            const ev: Partial<OrdinaryEvent> = rq.data.data;
            const status =
                moment().unix() < ev.startT!
                    ? "Upcoming"
                    : moment().unix() >= ev.startT! && moment().unix() <= ev.endT!
                        ? "Ongoing"
                        : "Past";

            resolve({
                ...ev,
                type: "Ordinary",
                status: status,
            } as OrdinaryEvent);
        } catch (e) {
            reject("");
        }
    });
}
