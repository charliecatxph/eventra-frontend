import { CircularProgress } from "@mui/material";
import { Boxes, ChevronRight, Clock, FileQuestion } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/router";
import { BizMatchEvent } from "@/interfaces/Interface";

interface BentoParameters {
  isFetching: boolean;
  data: BizMatchEvent;
  notInDashboard?: boolean;
}

export default function HighlightedBizMatchEvent({
  isFetching,
  data,
  notInDashboard,
}: BentoParameters) {
  const router = useRouter();
  return (
    <>
      {!isFetching && Object.keys(data).length !== 0 && (
        <div className="h-full relative">
          <div className="flex justify-between text-white flex-col  p-5 relative z-[2] h-full">
            <div>
              {data.status === "Upcoming" ? (
                <div className="text-white flex items-center gap-3 text-xs font-[600]">
                  <div className="circle h-[12px] w-[12px] rounded-full bg-yellow-600"></div>
                  {data.status}
                </div>
              ) : data.status === "Ongoing" ? (
                <div className="text-white flex items-center gap-3 text-xs font-[600]">
                  <div className="circle h-[12px] w-[12px] rounded-full bg-emerald-600"></div>
                  {data.status}
                </div>
              ) : (
                <div className="text-white flex items-center gap-3 text-xs font-[600]">
                  <div className="circle h-[12px] w-[12px] rounded-full bg-red-600"></div>
                  {data.status}
                </div>
              )}

              <h1 className="text-2xl font-[700] mt-1">{data?.name}</h1>
              <p className="text-white font-[500] text-sm">
                {moment
                  .unix(data.date)
                  .utcOffset(data.offset * -1)
                  .format("dddd, MMM DD, YYYY")}{" "}
                :{" "}
                {moment
                  .unix(data.startT)
                  .utcOffset(data.offset * -1)
                  .format("hh:mm A")}
                {" - "}
                {moment
                  .unix(data.endT)
                  .utcOffset(data.offset * -1)
                  .format("hh:mm A")}
                {" / "}
                {data.location}
              </p>
              <p className="text-sm flex items-center gap-2 mt-2">
                <Clock size="15px" />{" "}
                {data.timeslotsCount * data.suppliersCount} timeslot
                {data.timeslotsCount * data.suppliersCount > 1 && "s"} issued
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
                  {data.clients?.length > 1
                    ? `${data.clients?.length} organizations have registered to this B2B`
                    : `${data.clients?.length} organization has registered to this B2B`}
                </p>
              </div>
              {!notInDashboard && (
                <ChevronRight
                  onClick={() => router.push(`/view-bz-event/${data.id}`)}
                />
              )}
            </div>
          </div>
        </div>
      )}
      {!isFetching && Object.keys(data).length === 0 && (
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
