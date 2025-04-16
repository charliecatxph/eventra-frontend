import axios from "axios";

interface Atendee {
  addr: string;
  attended: boolean;
  email: string;
  evId: string;
  name: string;
  orgN: string;
  orgP: string;
  phoneNumber: string;
  public_id_qr: string;
  registeredOn: number;
  salutations: string;
}

interface FetchAtendeesResponse {
  data: Atendee[] | [];
  err?: string;
}

export const fetchAtendees = (
  evId: string,
  acsTok: string
): Promise<FetchAtendeesResponse> => {
  return new Promise(async (resolve, reject) => {
    try {
      const rq2 = await axios
        .post(
          `${process.env.NEXT_PUBLIC_API}/get-atendees?mode=all`,
          { evId: evId },
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${acsTok}` },
          }
        )
        .catch((e) => {
          throw new Error("Fail to fetch atendees.");
        });

      const at = rq2.data.data;

      // // set pie data from vars
      // setPieData((pv) => ({
      //   ...pv,
      //   datasets: [
      //     {
      //       ...pv.datasets[0],
      //       data: [not_in_event, in_event],
      //     },
      //   ],
      // }));

      resolve({
        data: [...at],
      });
    } catch (e: any) {
      reject({
        data: [],
        err: e.message,
      });
    }
  });
};
