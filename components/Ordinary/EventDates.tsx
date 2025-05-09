import ChooseTimezone from "../Inputs/ChooseTz";
import DateInput from "../Inputs/DateInput";
import TimeInput from "../Inputs/TimeInput";

export default function EventDates({data, onDataChange}) {
    return (
        <>
            <section className="eventra-container-narrow pt-5">
                <div className="px-7 py-5 bg-white rounded-xl mt-5 flex gap-2 flex-col">
                    <ChooseTimezone
                        value={data.offset.value}
                        onChange={(offset) => {
                            onDataChange({
                                ...data,
                                offset: {
                                    value: offset,
                                    err: "",
                                },
                            });
                        }}
                    />
                    <DateInput
                        identifier="ev-date"
                        title="Date"
                        value={data.date.value}
                        onChange={(dx) => {
                            onDataChange({
                                ...data,
                                date: {
                                    value: dx,
                                    err: "",
                                },
                            });
                        }}
                        error={data.date.err}
                        className=""
                    />

                    <div className="flex gap-2 items-start">
                        <TimeInput
                            identifier="ev-st"
                            title="Start Time"
                            value={data.startT.value}
                            onChange={(dx) => {
                                onDataChange({
                                    ...data,
                                    startT: {
                                        value: dx,
                                        err: "",
                                    },
                                    endT: {
                                        ...data.endT,
                                        err: "",
                                    },
                                });
                            }}
                            error={data.startT.err}
                            className="w-1/2"
                            req
                        />
                        <TimeInput
                            identifier="ev-et"
                            title="End Time"
                            value={data.endT.value}
                            onChange={(dx) => {
                                onDataChange({
                                    ...data,
                                    endT: {
                                        value: dx,
                                        err: "",
                                    },
                                    startT: {
                                        ...data.startT,
                                        err: "",
                                    },
                                });
                            }}
                            error={data.endT.err}
                            className="w-1/2"
                            req
                        />
                    </div>
                </div>
            </section>
        </>
    );
}
