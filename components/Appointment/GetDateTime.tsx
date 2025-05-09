import {motion} from "framer-motion";
import {Clock, Pencil, Plus, Trash,} from "lucide-react";
import DateInput from "../Inputs/DateInput";
import {useEffect, useState} from "react";
import TimeSheets from "./GetDateTime_Deps/TimeSheets";
import {useModal} from "../Modal/ModalContext";
import NumberInput from "../Inputs/NumberInput";
import TextInput from "../Inputs/TextInput";

interface Timesheet {
    start: string;
    end: string;
    inc: number;
}

interface ActivateTimesheet {
    active: boolean;
    defaultValues: Timesheet;
}

interface GDTEdit {
    name: {
        value: string;
        err: string;
    };
    date: {
        value: string;
        err: string;
    };
    lim: {
        value: number;
        err: string;
    };
    start: string;
    end: string;
    inc: number;
}

interface AppointmentComponent {
    active: boolean;
    data: GDTEdit;
    onDataChange: (dt: GDTEdit) => void;
}

export default function GetDateTime({
                                        active,
                                        data,
                                        onDataChange,
                                    }: AppointmentComponent) {
    const modal = useModal();
    const [activateTimesheet, setActivateTimesheet] = useState<ActivateTimesheet>(
        {
            active: false,

            defaultValues: {
                start: "",
                end: "",
                inc: 0,
            },
        }
    );

    const [slots, setSlots] = useState<string[]>([]);

    const handleDeleteTimesheet = () => {
        modal.show({
            icon: <Trash/>,
            title: "Confirm Delete",
            content: "This action is irreversible.",
            confirmText: "Delete",
            cancelText: "Go Back",
            onConfirm: () => {
                onDataChange({
                    ...data,
                    start: "",
                    end: "",
                    inc: 0,
                });
                setSlots([]);
                modal.hide();
            },
            onCancel: () => {
                modal.hide();
            },
            color: "red",
        });
    };

    useEffect(() => {
        if (!data.start || !data.end || !data.inc) return;

        const start_totalMins =
            parseInt(data.start.split(":")[0]) * 60 +
            parseInt(data.start.split(":")[1]);
        const end_totalMins =
            parseInt(data.end.split(":")[0]) * 60 + parseInt(data.end.split(":")[1]);

        const tmp: string[] = [];
        let curr = start_totalMins;

        while (curr + data.inc <= end_totalMins) {
            const next = curr + data.inc;

            const st_hours = Math.floor(curr / 60) % 12 || 12;
            const st_mins = curr % 60;
            const st_period = curr < 720 ? "AM" : "PM";

            const et_hours = Math.floor((curr + data.inc) / 60) % 12 || 12;
            const et_mins = (curr + data.inc) % 60;
            const et_period = curr + data.inc < 720 ? "AM" : "PM";

            tmp.push(
                `${String(st_hours).padStart(2, "0")}:${String(st_mins).padStart(
                    2,
                    "0"
                )}${st_period} - ${String(et_hours).padStart(2, "0")}:${String(
                    et_mins
                ).padStart(2, "0")}${et_period}`
            );

            curr = next;
        }

        setSlots(tmp);
    }, [data.start, data.end, data.inc]);

    if (!active) return <></>;
    return (
        <>
            <section className="px-5 pb-[50px] geist">
                <div className="mt-5 step-icon p-5 rounded-2xl mx-auto bg-emerald-800 text-emerald-100 w-max">
                    <motion.div
                        initial={{opacity: 0, scale: 0}}
                        animate={{opacity: 1, scale: 1, transition: {delay: 0.05}}}
                    >
                        <Clock/>
                    </motion.div>
                </div>
                <h1 className="mt-5 text-center text-2xl font-[600]">Set a Date</h1>
                <p className="text-xs text-center mt-2">
                    You are now creating an appointment event. This event type is
                    specially designed for <b>BizMatch</b>. Set a date, assign groups, and
                    time slots.
                </p>
                <div className="inputs mt-3 flex flex-col gap-2">
                    <TextInput
                        identifier="bz-name"
                        title="BizMatch Name"
                        value={data.name.value}
                        placeholder="My First BizMatch Event"
                        onInput={(d) =>
                            onDataChange({...data, name: {err: "", value: d}})
                        }
                        error={data.name.err}
                        req
                    />
                    <DateInput
                        identifier="date-when"
                        title="When is this event?"
                        value={data.date.value}
                        onChange={(v) => {
                            onDataChange({
                                ...data,
                                date: {
                                    value: v,
                                    err: "",
                                },
                            });
                        }}
                        error={data.date.err}
                    />
                    <NumberInput
                        identifier="lim"
                        title="Slot Limit"
                        value={data.lim.value}
                        onInput={(d) => {
                            onDataChange({
                                ...data,
                                lim: {
                                    value: parseInt(d),
                                    err: "",
                                },
                            });
                        }}
                        error={data.lim.err}
                    />
                    <div className="timesheets-preview">
                        <div className="flex justify-between items-center mb-1">
                            <h1 className="text-xs font-[500]">Timeslots</h1>
                            {!data.start && !data.end && data.inc < 1 ? (
                                <button
                                    onClick={() =>
                                        setActivateTimesheet((pv) => ({
                                            ...pv,
                                            active: true,
                                            defaultValues: {
                                                start: data.start,
                                                end: data.end,
                                                inc: data.inc,
                                            },
                                        }))
                                    }
                                    className="text-xs bg-emerald-800 text-green-100 flex items-center gap-1 rounded-md px-2 py-1"
                                >
                                    <Plus size="16px"/>
                                    Create Timesheet
                                </button>
                            ) : (
                                <button
                                    onClick={() =>
                                        setActivateTimesheet((pv) => ({
                                            ...pv,
                                            active: true,

                                            defaultValues: {
                                                start: data.start,
                                                end: data.end,
                                                inc: data.inc,
                                            },
                                        }))
                                    }
                                    className="text-xs bg-emerald-800 text-green-100 flex items-center gap-1 rounded-md px-2 py-1"
                                >
                                    <Pencil size="16px"/>
                                    Edit Timesheet
                                </button>
                            )}
                        </div>
                        {slots.length === 0 && (
                            <div
                                className="no-timeslots w-full h-[300px] border-1 border-neutral-200 rounded-md grid place-content-center text-xs text-neutral-400">
                                <div className="flex items-center flex-col">
                                    <p className="font-[500]">There is no timesheet.</p>
                                    <p className="flex items-center gap-1">
                                        Create a timesheet by tapping{" "}
                                        <span
                                            className="flex text-[10px] items-center gap-1 bg-neutral-200 py-1 px-1 font-semibold rounded-md text-white">
                      <Plus size="14px"/>
                      Create Timesheet
                    </span>
                                    </p>
                                </div>
                            </div>
                        )}

                        {slots.length !== 0 && (
                            <div
                                className="timeslots w-full h-[300px] border-1 border-neutral-200 rounded-md text-xs overflow-y-scroll">
                                <div className="flex flex-col">
                                    {slots.map((d, i) => {
                                        return (
                                            <p key={i} className="p-2 border-b-1 border-neutral-200">
                                                {d}
                                            </p>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="pb-10">
                        {!(!data.start && !data.end && data.inc < 1) && (
                            <button
                                onClick={() => handleDeleteTimesheet()}
                                className="w-full text-xs font-[500] bg-red-600 text-red-100 py-1.5 rounded-md"
                            >
                                Delete Timesheet
                            </button>
                        )}
                    </div>
                </div>
            </section>
            <TimeSheets
                active={activateTimesheet.active}
                defaultValues={activateTimesheet.defaultValues}
                onSubmit={(e) => {
                    onDataChange({
                        ...data,
                        start: e.start,
                        end: e.end,
                        inc: e.inc,
                    });
                }}
                onExit={() => {
                    setActivateTimesheet((pv) => ({
                        ...pv,
                        active: false,
                    }));
                }}
            />
        </>
    );
}
