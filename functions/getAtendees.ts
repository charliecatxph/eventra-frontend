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

interface FetchAtendeeResponseSizeOnly {
    data: {
        in: number;
        out: number;
    };
    err?: string;
}

export const fetchAtendees = (
    mode: string,
    evId: string,
    acsTok: string,
    count: number,
    page: number,
    sortBy: string,
    sortDir: string,
    search: string,
    filter?: any,
): Promise<FetchAtendeesResponse | FetchAtendeeResponseSizeOnly> => {
    return new Promise(async (resolve, reject) => {
        try {
            const rq2 = await axios
                .post(
                    `${
                        process.env.NEXT_PUBLIC_API
                    }/get-atendees`,
                    {
                        evId: evId,
                        mode: mode,
                        count: count,
                        page: page,
                        sortBy: sortBy,
                        sortDir: sortDir,
                        search: search || "",
                        filter: filter || []
                    },
                    {
                        withCredentials: true,
                        headers: {Authorization: `Bearer ${acsTok}`},
                    }
                )
                .catch((e) => {
                    throw new Error("Fail to fetch atendees.");
                });

            const at = rq2.data.data;
            if (mode === "count") {
                resolve({
                    data: at,
                });
            }
            resolve({
                data: [...at],
            });
        } catch (e: any) {
            if (mode === "count") {
                reject({
                    data: 0,
                    err: e.message,
                });
            }
            reject({
                data: [],
                err: e.message,
            });
        }
    });
};
