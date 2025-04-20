import axios from "axios";
import moment from "moment";
import { OrdinaryEvent, BizMatchEvent } from "@/interfaces/Interface";

interface GetEventsResponse {
  data: {
    ord: OrdinaryEvent[] | [];
    bz: BizMatchEvent[] | [];
  };
  err?: string;
}

export const getEvents = (
  apiLink: string,
  acsTok: string
): Promise<GetEventsResponse> => {
  return new Promise(async (resolve, reject) => {
    try {
      const req = await axios
        .post(
          `${apiLink}/fetch-events?mode=full`,
          {},
          {
            headers: {
              Authorization: `Bearer ${acsTok}`,
            },
            withCredentials: true,
          }
        )
        .catch((e) => {
          throw new Error("Fail to fetch event data.");
        });
      const acs = req.data;
      const tmp: OrdinaryEvent[] = [];
      const tmp2: BizMatchEvent[] = [];

      acs.data.forEach((ordinaryEvent: any) => {
        const status =
          moment().unix() < ordinaryEvent.startT
            ? "Upcoming"
            : moment().unix() >= ordinaryEvent.startT &&
              moment().unix() <= ordinaryEvent.endT
            ? "Ongoing"
            : "Past";

        tmp.push({
          ...ordinaryEvent,
          status: status,
          type: "Ordinary",
        });
      });
      acs.bz.forEach((bizmatchEvent: any) => {
        const status =
          moment().unix() < bizmatchEvent.startT
            ? "Upcoming"
            : moment().unix() >= bizmatchEvent.startT &&
              moment().unix() <= bizmatchEvent.endT
            ? "Ongoing"
            : "Past";

        tmp2.push({
          ...bizmatchEvent,
          status: status,
          type: "BizMatch",
        });
      });

      resolve({
        data: {
          ord: [...tmp],
          bz: [...tmp2],
        },
      });
    } catch (e: any) {
      reject({
        data: {},
        err: e.message,
      });
    }
  });
};
