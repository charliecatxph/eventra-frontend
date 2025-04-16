import axios from "axios";
import moment from "moment";

interface OrdinaryEvent {
  status: string;
  allowWalkIn: boolean;
  atendeeLim: number;
  date: number;
  startT: number;
  endT: number;
  location: string;
  organizationId: string;
  name: string;
  sec_url: string;
  offset: number;
  type: string;
  id: string;
  atnSz: number;
}

interface BizMatchEvent {
  status: string;
  name: string;
  date: number;
  startT: number;
  endT: number;
  organizationId: string;
  lim: string;
  offset: number;
  timeslotsCount: number;
  suppliersCount: number;
  type: string;
  id: string;
}

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
          status: status,
          allowWalkIn: ordinaryEvent.allowWalkIn,
          atendeeLim: ordinaryEvent.atendeeLim,
          date: ordinaryEvent.date,
          startT: ordinaryEvent.startT,
          endT: ordinaryEvent.endT,
          location: ordinaryEvent.location,
          organizationId: ordinaryEvent.organizationId,
          name: ordinaryEvent.name,
          sec_url: ordinaryEvent.coverFile,
          offset: ordinaryEvent.offset * -1,
          type: "Ordinary Event",
          id: ordinaryEvent.id,
          atnSz: ordinaryEvent.atnSz,
        });
      });
      acs.bz.forEach((bizmatchEvent: any) => {
        const status =
          moment().unix() < bizmatchEvent.startT._seconds
            ? "Upcoming"
            : moment().unix() >= bizmatchEvent.startT._seconds &&
              moment().unix() <= bizmatchEvent.endT._seconds
            ? "Ongoing"
            : "Past";

        tmp2.push({
          status: status,
          name: bizmatchEvent.name,
          date: bizmatchEvent.date._seconds * 1000,
          startT: bizmatchEvent.startT._seconds,
          endT: bizmatchEvent.endT._seconds,
          organizationId: bizmatchEvent.organizationId,
          lim: bizmatchEvent.lim,
          offset: bizmatchEvent.offset * -1,
          timeslotsCount: bizmatchEvent.timeslotsCount,
          suppliersCount: bizmatchEvent.suppliersCount,
          type: "BizMatch Event",
          id: bizmatchEvent.id,
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
