import { Info, Clock } from "lucide-react";
import NumberInput from "../Inputs/NumberInput";
import TimeInput from "../Inputs/TimeInput";
import { useEffect, useState } from "react";
import moment from "moment";

interface TimesheetData {
  inc: { value: number; err: string };
  lim: { value: number; err: string };
}

interface TimesheetProps {
  timesheet: TimesheetData;
  setTimesheet: (
    timesheet: TimesheetData | ((prev: TimesheetData) => TimesheetData)
  ) => void;
  evDates: {
    date: { value: string; err: string };
    startT: { value: string; err: string };
    endT: { value: string; err: string };
    offset: { value: number; err: string };
  };
}

export default function Timesheets({
  timesheet,
  setTimesheet,
  evDates,
}: TimesheetProps) {
  const [slots, setSlots] = useState<any[]>([]);

  const validateTime = (): boolean => {
    let isValid = true;
    const updatedState: Partial<TimesheetData> = {};

    if (timesheet.inc.value < 1) {
      updatedState.inc = {
        ...timesheet.inc,
        err: "Increment must be at least 1 minute",
      };
      isValid = false;
    }

    if (timesheet.lim.value < 1) {
      updatedState.lim = {
        ...timesheet.lim,
        err: "Limit must be at least 1",
      };
      isValid = false;
    }

    setTimesheet((prev: TimesheetData) => ({ ...prev, ...updatedState }));
    return isValid;
  };

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

  const validateIncrement = (inc: number): boolean => {
    return inc >= 1 && inc <= 60;
  };

  const validateLimit = (lim: number): boolean => {
    return lim >= 1 && lim <= 100;
  };

  const handleIncrementChange = (value: number) => {
    setTimesheet({
      ...timesheet,
      inc: {
        value,
        err: validateIncrement(value)
          ? ""
          : "Increment must be between 1 and 60 minutes",
      },
    });
  };

  const handleLimitChange = (value: number) => {
    setTimesheet({
      ...timesheet,
      lim: {
        value,
        err: validateLimit(value)
          ? ""
          : "Limit must be between 1 and 100 attendees",
      },
    });
  };

  useEffect(() => {
    if (
      !evDates.startT.value ||
      !evDates.endT.value ||
      timesheet.inc.value < 1 ||
      !evDates.date.value
    )
      return;

    const start = getUnix(evDates.date.value, evDates.startT.value);
    const end = getUnix(evDates.date.value, evDates.endT.value);
    const incT = timesheet.inc.value * 60;
    let tmp = [];

    for (let x = start; x < end; x += incT) {
      tmp.push({
        start: x,
        end: x + incT,
      });
    }
    setSlots(tmp);
  }, [
    evDates.startT.value,
    evDates.endT.value,
    timesheet.inc.value,
    evDates.date.value,
  ]);

  return (
    <>
      <section className="eventra-container-narrow pt-5">
        <div className="px-7 py-5 bg-white rounded-xl mt-5 flex gap-2 flex-col">
          <div className="tip shadow-sm shadow-neutral-50 flex rounded-xl overflow-hidden">
            <div className="bg-blue-200 px-8 grid place-items-center">
              <Info className="text-blue-800" size="19px" />
            </div>
            <div className="p-2 bg-blue-50 pl-3 text-sm">
              <h1 className="font-[600] text-blue-800">What are timesheets?</h1>
              <p className="text-xs text-blue-900">
                Timesheets are time slots that will be applied to each and every
                supplier. They serve as the "appointment" slot for the
                customers.
                <b>
                  Timesheets can't be modified after uploading, and it also
                  can't be customized per supplier.
                </b>
              </p>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="flex-col flex gap-5 w-full">
              <div className="grid grid-cols-2 gap-5">
                <div className="property">
                  <NumberInput
                    identifier="timesheet-limit"
                    title="Attendee Limit"
                    value={timesheet.lim.value}
                    onInput={(value) => handleLimitChange(Number(value))}
                    error={timesheet.lim.err}
                  />
                </div>
                <div className="property">
                  <NumberInput
                    identifier="timesheet-increment"
                    title="Increment (minutes)"
                    value={timesheet.inc.value}
                    onInput={(value) => handleIncrementChange(Number(value))}
                    error={timesheet.inc.err}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {slots.length !== 0 && (
        <section className="eventra-container-narrow pt-1">
          <div className="px-7 py-5 bg-white rounded-xl mt-5 flex gap-2 flex-col">
            <h1 className="text-center text-sm text-neutral-800 font-[600]">
              Timeslots Generated
            </h1>
            <div className="slots grid-cols-2 grid gap-2 mt-3 max-h-[200px] overflow-y-scroll">
              {slots.map((d, i) => {
                return (
                  <p
                    key={i}
                    className="bg-neutral-50 px-5 py-1 rounded-lg text-sm border-1 border-neutral-200"
                  >
                    {moment.unix(d.start).format("hh:mm A")} -{" "}
                    {moment.unix(d.end).format("hh:mm A")}
                  </p>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
