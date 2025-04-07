import { Info } from "lucide-react";
import NumberInput from "../Inputs/NumberInput";
import TimeInput from "../Inputs/TimeInput";
import { useEffect, useState } from "react";
import moment from "moment";

export default function Timesheets({
  data,
  onDataChange,
  dateReference,
  offset,
}) {
  const [slots, setSlots] = useState<any[]>([]);

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

  useEffect(() => {
    if (
      !data.startT.value ||
      !data.endT.value ||
      data.inc.value < 1 ||
      !dateReference
    )
      return;

    const start = getUnix(dateReference, data.startT.value);
    const end = getUnix(dateReference, data.endT.value);
    const incT = data.inc.value * 60;
    let tmp = [];

    if ((end - start) % incT !== 0 || data.inc.value === 0) {
      setSlots([]);
      return onDataChange({
        ...data,
        inc: {
          ...data.inc,
          err: "Incrementation value doesn't yield equal time slots.",
        },
      });
    }

    for (let x = start; x < end; x += incT) {
      tmp.push({
        start: x,
        end: x + incT,
      });
    }
    setSlots(tmp);
  }, [data.startT.value, data.endT.value, data.inc.value, dateReference]);
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
          <div className="flex gap-2 items-start">
            <TimeInput
              identifier="biz-st"
              title="Start Time"
              value={data.startT.value}
              onChange={(dx) => {
                onDataChange({
                  ...data,
                  startT: {
                    value: dx,
                    err: "",
                  },
                });
              }}
              error={data.startT.err}
              className="w-1/2"
              req
            />
            <TimeInput
              identifier="biz-et"
              title="End Time"
              value={data.endT.value}
              onChange={(dx) => {
                onDataChange({
                  ...data,
                  endT: {
                    value: dx,
                    err: "",
                  },
                });
              }}
              error={data.endT.err}
              className="w-1/2"
              req
            />
          </div>
          <NumberInput
            identifier="num-inp"
            title="Incrementation Value (min)"
            value={data.inc.value}
            onInput={(dx) => {
              onDataChange({
                ...data,
                inc: {
                  value: parseInt(dx),
                  err: "",
                },
              });
            }}
            error={data.inc.err}
          />

          <NumberInput
            identifier="atn-lim"
            title="Atendee Limit (per slot)"
            value={data.lim.value}
            onInput={(dx) => {
              onDataChange({
                ...data,
                lim: {
                  value: parseInt(dx),
                  err: "",
                },
              });
            }}
            error={data.lim.err}
          />
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
                  <p className="bg-neutral-50 px-5 py-1 rounded-lg text-sm border-1 border-neutral-200">
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
