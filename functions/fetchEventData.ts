import {OrdinaryEvent} from "@/interfaces/Interface";
import {getOrdinaryEventInformation} from "@/functions/getOrdinaryEventInformation";
import {getOrdEventAnalytics} from "@/functions/getOrdEventAnalytics";
import {fetchAtendees} from "@/functions/getAtendees";

export default function fetchEventData({evId, accessToken, requestLimit, page, sortMethod, sortOrder, filter, search}) {
    let payload = {
        eventData: {},
        lineChartData: {},
        pieChartData: {},
        attendees: [],
        querySizeResult: 0,
        totalRegistered: 0,
        filters: {}
    }
    const parseFilters = (filter: any) => {
        let tmp: any = {
            attended: filter.attended
        }
        Object.keys(filter.extras).forEach(parentKey => {
            let shallow: string[] = []
            for (const [subKey, value] of Object.entries(filter.extras[parentKey])) {
                value ? shallow.push(subKey) : null
            }
            tmp[parentKey] = [...shallow]

        })
        return tmp;
    }

    return new Promise(async (resolve, reject) => {
        try {
            const ordinaryEventInformation: OrdinaryEvent =
                await getOrdinaryEventInformation(
                    evId,
                    accessToken
                ).catch((e) => {
                    throw new Error(e?.err);
                });

            payload.eventData = ordinaryEventInformation;

            const getOrdEventAnalyticsReq = await getOrdEventAnalytics(
                process.env.NEXT_PUBLIC_API || "",
                accessToken,
                ordinaryEventInformation.id,
                ordinaryEventInformation.offset,
                "rpd"
            ).catch((e) => {
                throw new Error(e?.err);
            });

            payload.lineChartData = getOrdEventAnalyticsReq.data

            const getOrdRegistrationCount: any = await fetchAtendees(
                "all",
                ordinaryEventInformation.id,
                accessToken,
                requestLimit,
                page,
                sortMethod,
                sortOrder,
                search,
                parseFilters(filter)
            ).catch((e) => {
                throw new Error(e?.err);
            });


            payload.pieChartData = [getOrdRegistrationCount.data[0].stats.in, getOrdRegistrationCount.data[0].stats.out]
            payload.attendees = getOrdRegistrationCount.data[0].attendees

            const newCheck: any = {};
            Object.entries(getOrdRegistrationCount.data[0].filterable).forEach(([key, values]) => {
                const map = {};
                values.forEach((value) => {
                    map[value] = true;
                });

                newCheck[key] = map;
            });

            payload.filters = newCheck;
            payload.querySizeResult = getOrdRegistrationCount.data[0].stats.queryTotal
            payload.totalRegistered = getOrdRegistrationCount.data[0].stats.total
            resolve({
                success: true,
                data: payload
            })
        } catch (e) {
            reject({
                success: false,
                data: e
            })
        }
    })
}