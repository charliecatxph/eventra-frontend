import {ArrowLeftRight, Calendar, Clock, Footprints, MapPin, User, Users,} from "lucide-react";
import moment from "moment";

export default function Review({information, evDates, customization}) {
    const getUnix = (date: string, time: string): number => {
        const [year, month, day] = date.split("-");
        const [hours, minutes] = time.split(":");
        const datetime = new Date(
            Number(year),
            Number(month) - 1,
            Number(day),
            Number(hours),
            Number(minutes)
        );
        return Math.floor(datetime.getTime() / 1000);
    };

    const formatDuration = (start: number, end: number): string => {
        const diff = Math.abs(end - start); // in seconds

        if (diff < 3600) {
            const mins = Math.floor(diff / 60);
            return `${mins} minute${mins !== 1 ? "s" : ""}`;
        }

        const hrs = Math.floor(diff / 3600);
        const mins = Math.floor((diff % 3600) / 60);
        return `${hrs} hour${hrs !== 1 ? "s" : ""}${
            mins > 0 ? ` ${mins} minute${mins !== 1 ? "s" : ""}` : ""
        }`;
    };

    return (
        <>
            <section className="eventra-container-narrow pt-5">
                <div className="px-7 py-5 bg-white rounded-xl mt-5 flex gap-2 flex-col">
                    <h1 className="font-[500] text-lg">Event Summary</h1>
                    <div className="flex gap-5">
                        <div className="flex-col flex gap-5 w-1/2">
                            <h1 className="font-[500] text-neutral-700">Information</h1>
                            <div className="property">
                                <h1 className="text-sm font-[500] text-neutral-700">
                                    Event Name
                                </h1>
                                <p className="text-lg font-[600]">{information.name.value}</p>
                            </div>
                            <div className="property">
                                <h1 className="text-sm font-[500] text-neutral-700">
                                    Event Location
                                </h1>
                                <p className="text-lg font-[400] flex items-center gap-2">
                                    <MapPin size="16px" className="text-emerald-600"/>
                                    {information.location.value}
                                </p>
                            </div>
                            <div className="property">
                                <h1 className="text-sm font-[500] text-neutral-700">
                                    Event Organized By
                                </h1>
                                <p className="text-lg font-[400] flex items-center gap-2">
                                    <User size="16px" className="text-emerald-600"/>
                                    {information.organizedBy.value}
                                </p>
                            </div>
                            <div className="property">
                                <h1 className="text-sm font-[500] text-neutral-700">
                                    Event Capacity
                                </h1>
                                <p className="text-lg font-[400] flex items-center gap-2">
                                    <Users size="16px" className="text-emerald-600"/>
                                    {customization.atendeeLim.value} person
                                    {customization.atendeeLim.value > 1 ? "s" : ""}
                                </p>
                            </div>
                            <div className="property">
                                <h1 className="text-sm font-[500] text-neutral-700">
                                    Event Walk-In
                                </h1>
                                <p className="text-lg font-[400] flex items-center gap-2">
                                    <Footprints size="16px" className="text-emerald-600"/>
                                    {customization.allowWalkIn.value === "true"
                                        ? "Walk-in is allowed."
                                        : "Walk-in is not allowed."}
                                </p>
                            </div>
                        </div>
                        <div className="flex-col flex gap-5 w-1/2">
                            <h1 className="font-[500] text-neutral-700">Schedule</h1>
                            <div className="property">
                                <h1 className="text-sm font-[500] text-neutral-700">
                                    Event Date
                                </h1>
                                <p className="text-lg font-[400] flex items-center gap-2">
                                    <Calendar size="16px" className="text-emerald-600"/>
                                    {evDates.date.value}
                                </p>
                            </div>
                            <div className="property">
                                <h1 className="text-sm font-[500] text-neutral-700">
                                    Event Start Time
                                </h1>
                                <p className="text-lg font-[400] flex items-center gap-2">
                                    <Clock size="16px" className="text-emerald-600"/>
                                    {moment
                                        .unix(getUnix(evDates.date.value, evDates.startT.value))
                                        .utcOffset(evDates.offset.value * -1)
                                        .format("hh:mm A")}{" "}
                                    GMT{(evDates.offset.value * -1) / 60 > 0 ? "+" : ""}
                                    {(evDates.offset.value * -1) / 60}
                                </p>
                            </div>
                            <div className="property">
                                <h1 className="text-sm font-[500] text-neutral-700">
                                    Event End Time
                                </h1>
                                <p className="text-lg font-[400] flex items-center gap-2">
                                    <Clock size="16px" className="text-emerald-600"/>
                                    {moment
                                        .unix(getUnix(evDates.date.value, evDates.endT.value))
                                        .utcOffset(evDates.offset.value * -1)
                                        .format("hh:mm A")}{" "}
                                    GMT{(evDates.offset.value * -1) / 60 > 0 ? "+" : ""}
                                    {(evDates.offset.value * -1) / 60}
                                </p>
                            </div>
                            <div
                                className="property bg-neutral-50 px-5 py-4 rounded-lg flex items-center justify-between">
                                <h1 className="text-sm font-[500]">Event Duration</h1>
                                <p className=" font-[400] flex items-center gap-2">
                                    <ArrowLeftRight size="16px"/>
                                    {formatDuration(
                                        getUnix(evDates.date.value, evDates.startT.value),
                                        getUnix(evDates.date.value, evDates.endT.value)
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="property mt-5">
                        <h1 className="text-sm font-[500] text-neutral-700">Description</h1>
                        <p className="text-md">{information.description.value}</p>
                    </div>
                </div>
            </section>
        </>
    );
}
