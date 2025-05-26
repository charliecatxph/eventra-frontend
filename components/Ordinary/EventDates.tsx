import { Calendar, Clock } from "lucide-react";
import DateInput from "../Inputs/DateInput";
import TimeInput from "../Inputs/TimeInput";
import ChooseTimezone from "../Inputs/ChooseTz";

interface EventDatesProps {
  evDates: {
    date: { value: string; err: string };
    startT: { value: string; err: string };
    endT: { value: string; err: string };
    offset: { value: number; err: string };
  };
  setEvDates: (evDates: any) => void;
}

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

export default function EventDates({ evDates, setEvDates }: EventDatesProps) {
  const handleDateChange = (value: string) => {
    // Check if date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(value);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate.getTime() < today.getTime()) {
      setEvDates({
        ...evDates,
        date: { value, err: "Date cannot be in the past" },
      });
      return;
    }

    setEvDates({
      ...evDates,
      date: { value, err: "" },
    });
  };

  const handleTimeChange = (field: "startT" | "endT", value: string) => {
    if (!evDates.date.value) {
      setEvDates({
        ...evDates,
        [field]: { value, err: "" },
      });
      return;
    }

    const startUnix =
      field === "startT"
        ? getUnix(evDates.date.value, value)
        : getUnix(evDates.date.value, evDates.startT.value);

    const endUnix =
      field === "endT"
        ? getUnix(evDates.date.value, value)
        : getUnix(evDates.date.value, evDates.endT.value);

    if (startUnix >= endUnix) {
      setEvDates({
        ...evDates,
        [field]: { value, err: "Start time must be before end time" },
      });
      return;
    }

    setEvDates({
      ...evDates,
      [field]: { value, err: "" },
    });
  };

  const handleOffsetChange = (value: number) => {
    setEvDates({
      ...evDates,
      offset: { value, err: "" },
    });
  };

  return (
    <section className="eventra-container-narrow pt-5">
      <div className="px-7 py-5 bg-white rounded-xl mt-5 flex gap-2 flex-col">
        <h1 className="font-[500] text-lg">Event Schedule</h1>
        <div className="flex gap-5">
          <div className="flex-col flex gap-5 w-1/2">
            <div className="property">
              <DateInput
                identifier="event-date"
                title="Event Date"
                value={evDates.date.value}
                onChange={handleDateChange}
                error={evDates.date.err}
              />
            </div>
            <div className="property">
              <TimeInput
                identifier="event-start-time"
                title="Start Time"
                value={evDates.startT.value}
                onChange={(value) => handleTimeChange("startT", value)}
                error={evDates.startT.err}
                req
              />
            </div>
          </div>
          <div className="flex-col flex gap-5 w-1/2">
            <div className="property">
              <TimeInput
                identifier="event-end-time"
                title="End Time"
                value={evDates.endT.value}
                onChange={(value) => handleTimeChange("endT", value)}
                error={evDates.endT.err}
                req
              />
            </div>
            <div className="property">
              <ChooseTimezone
                value={evDates.offset.value}
                onChange={handleOffsetChange}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
