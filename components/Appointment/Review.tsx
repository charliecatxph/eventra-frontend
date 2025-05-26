import { Calendar, Clock, MapPin, Users, Globe } from "lucide-react";
import moment from "moment";
import { countriesKV } from "@/lib/constants/countries";

interface ReviewProps {
  information: {
    name: { value: string; err: string };
    location: { value: string; err: string };
    organizedBy: { value: string; err: string };
    description: { value: string; err: string };
  };
  evDates: {
    date: { value: string; err: string };
    startT: { value: string; err: string };
    endT: { value: string; err: string };
    offset: { value: number; err: string };
  };
  timesheet: {
    inc: { value: number; err: string };
    lim: { value: number; err: string };
  };
  suppliers: Array<{
    logo: string;
    name: string;
    country: string;
    website: string;
    description: string;
  }>;
}

export default function Review({
  information,
  evDates,
  timesheet,
  suppliers,
}: ReviewProps) {
  const formatDate = (date: string) => {
    return moment(date).format("MMMM D, YYYY");
  };

  const formatTime = (time: string) => {
    return moment(`2000-01-01T${time}`).format("h:mm A");
  };

  return (
    <section className="eventra-container-narrow pt-5">
      <div className="px-7 py-5 bg-white rounded-xl mt-5 flex gap-5 flex-col">
        <div className="flex items-center gap-2">
          <Calendar className="text-emerald-600" size={20} />
          <h1 className="text-lg font-[500]">Event Summary</h1>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-4">
            <div className="bg-neutral-50 p-4 rounded-lg">
              <h2 className="font-[500] text-sm mb-3">Event Information</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin
                    className="text-neutral-400 shrink-0 mt-1"
                    size={16}
                  />
                  <div>
                    <p className="text-xs text-neutral-500">Location</p>
                    <p className="text-sm font-[500]">
                      {information.location.value}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="text-neutral-400 shrink-0 mt-1" size={16} />
                  <div>
                    <p className="text-xs text-neutral-500">Organized By</p>
                    <p className="text-sm font-[500]">
                      {information.organizedBy.value}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="text-neutral-400 shrink-0 mt-1" size={16} />
                  <div>
                    <p className="text-xs text-neutral-500">Description</p>
                    <p className="text-sm font-[500]">
                      {information.description.value}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-neutral-50 p-4 rounded-lg">
              <h2 className="font-[500] text-sm mb-3">Event Schedule</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar
                    className="text-neutral-400 shrink-0 mt-1"
                    size={16}
                  />
                  <div>
                    <p className="text-xs text-neutral-500">Date</p>
                    <p className="text-sm font-[500]">
                      {formatDate(evDates.date.value)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="text-neutral-400 shrink-0 mt-1" size={16} />
                  <div>
                    <p className="text-xs text-neutral-500">Time</p>
                    <p className="text-sm font-[500]">
                      {formatTime(evDates.startT.value)} -{" "}
                      {formatTime(evDates.endT.value)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-neutral-50 p-4 rounded-lg">
              <h2 className="font-[500] text-sm mb-3">Timesheet Settings</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="text-neutral-400 shrink-0 mt-1" size={16} />
                  <div>
                    <p className="text-xs text-neutral-500">
                      Timeslot Duration
                    </p>
                    <p className="text-sm font-[500]">
                      {timesheet.inc.value} minutes
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="text-neutral-400 shrink-0 mt-1" size={16} />
                  <div>
                    <p className="text-xs text-neutral-500">Attendee Limit</p>
                    <p className="text-sm font-[500]">
                      {timesheet.lim.value} per slot
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-neutral-50 p-4 rounded-lg">
              <h2 className="font-[500] text-sm mb-3">
                Suppliers ({suppliers.length})
              </h2>
              <div className="space-y-3">
                {suppliers.map((supplier, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full overflow-hidden bg-white border-1 border-neutral-200">
                      <img
                        src={supplier.logo}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-[500]">{supplier.name}</p>
                      <p className="text-xs text-neutral-500">
                        {countriesKV[supplier.country] || supplier.country}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
