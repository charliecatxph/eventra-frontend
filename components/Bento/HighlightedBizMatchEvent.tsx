import { CircularProgress } from "@mui/material";
import { Boxes, ChevronRight, Clock, FileQuestion, Users } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/router";
import { BizMatchEvent } from "@/interfaces/Interface";

interface BentoParameters {
  isFetching: boolean;
  data: BizMatchEvent;
}

export default function HighlightedBizMatchEvent({
  isFetching,
  data,
}: BentoParameters) {
  const router = useRouter();
  return (
    <>
      {!isFetching && data && (
        <div className="h-full relative">
          <div className="flex justify-between text-white flex-col  p-5 relative z-[2] h-full">
            <div>
              {data.status === "Upcoming" ? (
                <div className="bg-neutral-700 w-max text-white px-3 py-1 rounded-full flex items-center gap-3 text-xs">
                  <div className="circle h-[12px] w-[12px] rounded-full bg-yellow-600"></div>
                  {data.status}
                </div>
              ) : data.status === "Ongoing" ? (
                <div className="bg-neutral-700 w-max text-white px-3 py-1 rounded-full flex items-center gap-3 text-xs">
                  <div className="circle h-[12px] w-[12px] rounded-full bg-emerald-600"></div>
                  {data.status}
                </div>
              ) : (
                <div className="bg-neutral-700 w-max text-white px-3 py-1 rounded-full flex items-center gap-3 text-xs">
                  <div className="circle h-[12px] w-[12px] rounded-full bg-red-600"></div>
                  {data.status}
                </div>
              )}
              <h1 className="text-2xl font-[500] mt-1">{data?.name}</h1>
              <p className="text-white text-sm">
                {moment
                  .unix(data.date)
                  .utcOffset(data.offset)
                  .format("dddd, MMM DD, YYYY")}{" "}
                :{" "}
                {moment
                  .unix(data.startT)
                  .utcOffset(data.offset)
                  .format("hh:mm A")}
                {" - "}
                {moment
                  .unix(data.endT)
                  .utcOffset(data.offset)
                  .format("hh:mm A")}
              </p>
              <p className="text-sm flex items-center gap-2 mt-2">
                <Clock size="15px" /> {data.timeslotsCount} timeslot
                {data.timeslotsCount > 1 && "s"} issued, {data.lim} organization
                per slot
              </p>
              <p className="text-sm flex items-center gap-2 mt-2">
                <Boxes size="15px" /> Suppliers: {data.suppliersCount} supplier
                {data.suppliersCount > 1 && "s"}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="registrations flex gap-2 items-center text-sm bg-neutral-700 px-4 py-1 rounded-full text-white">
                <div className="circle w-[10px] h-[10px] bg-blue-500 rounded-full"></div>
                <p>
                  {2 > 1
                    ? `${2} organizations have registered`
                    : `${1} organization has registered`}
                </p>
              </div>
              <ChevronRight
                onClick={() => router.push(`/view-event/${data.id}`)}
              />
            </div>
          </div>
        </div>
      )}
      {!isFetching && !data && (
        <div className="grid place-content-center h-full w-full">
          <div className="flex flex-col items-center gap-2 text-neutral-600">
            <FileQuestion size="18px" />
            <p className="text-sm">No BizMatch event.</p>
          </div>
        </div>
      )}
      {isFetching && (
        <div className="grid place-content-center h-full w-full">
          <div className="flex items-center gap-2">
            <CircularProgress
              size={40}
              thickness={3}
              disableShrink
              sx={{
                color: "white", // spinner stroke
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
