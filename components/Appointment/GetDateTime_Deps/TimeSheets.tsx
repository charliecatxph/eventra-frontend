import {
  ChevronLeft,
  GalleryVerticalEnd,
  Plus,
  Settings,
  TriangleAlert,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import TimeInput from "@/components/Inputs/TimeInput";
import NumberInput from "@/components/Inputs/NumberInput";
import { useModal } from "@/components/Modal/ModalContext";

// payload out
interface Timesheet {
  start: string;
  end: string;
  inc: number;
}

// data here
interface TimesheetEdit {
  start: {
    value: string;
    err: string;
  };
  end: {
    value: string;
    err: string;
  };
  inc: {
    value: number;
    err: string;
  };
}

// component ops
interface TimesheetsOps {
  active?: boolean;
  onSubmit: (dt: Timesheet) => void;
  onExit: () => void;
  defaultValues: Timesheet;
}

const timesheetEdit_defaults: TimesheetEdit = {
  start: {
    value: "",
    err: "",
  },
  end: {
    value: "",
    err: "",
  },
  inc: {
    value: 0,
    err: "",
  },
};

export default function TimeSheets({
  active,
  onSubmit,
  onExit,
  defaultValues,
}: TimesheetsOps) {
  const modal = useModal();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [timesheet, setTimesheet] = useState<TimesheetEdit>(
    timesheetEdit_defaults
  );
  const [slots, setSlots] = useState<string[]>([]);

  const validateTimesheetWithValues = (
    st: number,
    et: number,
    inc: number
  ): boolean => {
    if (st > et) {
      setTimesheet((pv) => ({
        ...pv,
        start: {
          ...pv.start,
          err: "Start time can't be more than the end time.",
        },
      }));
      return false;
    } else {
      setTimesheet((pv) => ({
        ...pv,
        start: {
          ...pv.start,
          err: "",
        },
      }));
    }

    if (st === et) {
      setTimesheet((pv) => ({
        ...pv,
        start: {
          ...pv.start,
          err: "Start time can't be equal to the end time.",
        },
      }));
      return false;
    } else {
      setTimesheet((pv) => ({
        ...pv,
        start: {
          ...pv.start,
          err: "",
        },
      }));
    }

    if ((et - st) % inc !== 0) {
      setTimesheet((pv) => ({
        ...pv,
        inc: {
          ...pv.inc,
          err: "Incrementation value doensn't yield equal time slots.",
        },
      }));
      setSlots([]);
      return false;
    } else {
      setTimesheet((pv) => ({
        ...pv,
        inc: {
          ...pv.inc,
          err: "",
        },
      }));
    }

    return true;
  };

  const handleSubmit = () => {
    let err = false;
    const { start, end, inc } = timesheet;

    if (!start.value) {
      setTimesheet((pv) => ({
        ...pv,
        start: {
          ...pv.start,
          err: "Enter a start time.",
        },
      }));
      err = true;
    }

    if (!end.value) {
      setTimesheet((pv) => ({
        ...pv,
        end: {
          ...pv.end,
          err: "Enter a end time.",
        },
      }));
      err = true;
    }

    if (inc.value < 1 || isNaN(inc.value)) {
      setTimesheet((pv) => ({
        ...pv,
        inc: {
          ...pv.inc,
          err: "Incrementation value must be more than 0.",
        },
      }));
      err = true;
    }

    if (err) return;

    const start_totalMins =
      parseInt(start.value.split(":")[0]) * 60 +
      parseInt(start.value.split(":")[1]);
    const end_totalMins =
      parseInt(end.value.split(":")[0]) * 60 +
      parseInt(end.value.split(":")[1]);

    if (!validateTimesheetWithValues(start_totalMins, end_totalMins, inc.value))
      return;

    const payload: Timesheet = {
      start: start.value,
      end: end.value,
      inc: inc.value,
    };

    onSubmit(payload);
    setTimesheet(timesheetEdit_defaults);
    setSlots([]);

    onExit();
  };

  const handleExit = () => {
    let hasChanges: boolean;

    if (isEditing) {
      hasChanges = !(
        defaultValues.start === timesheet.start.value &&
        defaultValues.end === timesheet.end.value &&
        defaultValues.inc === timesheet.inc.value
      );
    } else {
      hasChanges = Object.keys(timesheetEdit_defaults).some((key) => {
        return (
          timesheet[key as keyof TimesheetEdit].value !==
          timesheetEdit_defaults[key as keyof TimesheetEdit].value
        );
      });
    }

    if (!hasChanges) {
      if (isEditing) {
        setTimesheet(timesheetEdit_defaults);
        setSlots([]);
      }
      onExit();
      modal.hide();
      return;
    } else {
      modal.show({
        icon: <TriangleAlert />,
        title: "Confirm Exit",
        content: "Exiting will not save your current timesheet.",
        confirmText: "Exit",
        cancelText: "Go Back",
        onConfirm: () => {
          setTimesheet(timesheetEdit_defaults);
          setSlots([]);
          onExit();
          modal.hide();
        },
        onCancel: () => {
          modal.hide();
        },
        color: "red",
      });
    }
  };

  useEffect(() => {
    if (defaultValues.start && defaultValues.end && defaultValues.inc > 0) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }

    setTimesheet({
      start: {
        value: defaultValues.start || "",
        err: "",
      },
      end: {
        value: defaultValues.end || "",
        err: "",
      },
      inc: {
        value: defaultValues.inc,
        err: "",
      },
    });
  }, [defaultValues]);

  useEffect(() => {
    const { start, end, inc } = timesheet;
    if (!(start.value && end.value)) return;
    const start_totalMins =
      parseInt(start.value.split(":")[0]) * 60 +
      parseInt(start.value.split(":")[1]);
    const end_totalMins =
      parseInt(end.value.split(":")[0]) * 60 +
      parseInt(end.value.split(":")[1]);

    if (!validateTimesheetWithValues(start_totalMins, end_totalMins, inc.value))
      return;

    const tmp: string[] = [];
    let curr = start_totalMins;

    while (curr + inc.value <= end_totalMins) {
      const next = curr + inc.value;

      const st_hours = Math.floor(curr / 60) % 12 || 12;
      const st_mins = curr % 60;
      const st_period = curr < 720 ? "AM" : "PM";

      const et_hours = Math.floor((curr + inc.value) / 60) % 12 || 12;
      const et_mins = (curr + inc.value) % 60;
      const et_period = curr + inc.value < 720 ? "AM" : "PM";

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
  }, [timesheet.start.value, timesheet.end.value, timesheet.inc.value]);

  if (!active) return <></>;
  return (
    <>
      <div className="fixed geist top-0 left-0 bg-white w-full h-full z-[999] overflow-y-scroll">
        <header className="px-5 py-5 sticky top-0 bg-white">
          <ChevronLeft onClick={() => handleExit()} />
        </header>
        <section className="px-5">
          <div className="mt-5 step-icon p-5 rounded-2xl mx-auto bg-emerald-800 text-emerald-100 w-max">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1, transition: { delay: 0.05 } }}
            >
              {isEditing ? <Settings /> : <GalleryVerticalEnd />}
            </motion.div>
          </div>
          <h1 className="mt-5 text-center text-2xl font-[600]">
            {isEditing ? "Edit" : "Create"} Timesheet
          </h1>
          <p className="text-xs text-center mt-2">
            {isEditing
              ? "Edit your timesheet here."
              : "Create your timesheet here by specifying a start and end time. Indicate the incrementation between slots."}
          </p>

          <div className="flex gap-1 mt-3">
            <TimeInput
              identifier="start-time"
              title="Start Time"
              value={timesheet.start.value}
              onChange={(v) => {
                setTimesheet((pv) => ({
                  ...pv,
                  start: {
                    value: v,
                    err: "",
                  },
                }));
              }}
              error={timesheet.start.err}
              className="w-1/2"
            />
            <TimeInput
              identifier="end-time"
              title="End Time"
              value={timesheet.end.value}
              onChange={(v) => {
                setTimesheet((pv) => ({
                  ...pv,
                  end: {
                    value: v,
                    err: "",
                  },
                }));
              }}
              error={timesheet.end.err}
              className="w-1/2"
            />
          </div>
          <NumberInput
            identifier="inc"
            title="Incrementation"
            value={timesheet.inc.value}
            onInput={(v) => {
              setTimesheet((pv) => ({
                ...pv,
                inc: {
                  value: parseInt(v),
                  err: "",
                },
              }));
            }}
            error={timesheet.inc.err}
          />

          <div className="timesheets-preview pb-[100px]">
            <h1 className="text-xs font-[500] mt-3">Time Slots Preview</h1>
            {slots.length === 0 && (
              <div className="no-timeslots w-full h-[300px] border-1 border-neutral-200 rounded-md grid place-content-center text-xs text-neutral-400">
                <div className="flex items-center flex-col">
                  <p className="font-[500]">There are no timeslots yet.</p>
                  <p className="flex items-center gap-1">
                    Start entering some values so Eventra could calculate.
                  </p>
                </div>
              </div>
            )}

            {slots.length !== 0 && (
              <div className="timeslots w-full h-[300px] border-1 border-neutral-200 rounded-md text-xs overflow-y-scroll">
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
        </section>
        <div className="proceed-btn px-5 fixed bottom-0 left-0 w-full geist">
          <button
            onClick={() => handleSubmit()}
            className="bg-emerald-800 text-emerald-100 rounded-lg w-full py-2 text-sm mb-3"
          >
            {isEditing ? "Apply Changes" : "Append Timesheet"}
          </button>
        </div>
      </div>
    </>
  );
}
