import { CircularProgress } from "@mui/material";
import { ChevronRight, FileQuestion, Users } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/router";
import { OrdinaryEvent } from "@/interfaces/Interface";

interface BentoParameters {
  isFetching: boolean;
  data: OrdinaryEvent;
}

export default function HighlightedOrdinaryEvent({
  isFetching,
  data,
}: BentoParameters) {
  const router = useRouter();
  return (
    <>
      {!isFetching && data && (
        <div className="h-full relative">
          <div className="flex justify-between flex-col  p-5 relative z-[2] text-white h-full">
            <div>
              {data.status === "Upcoming" ? (
                <div className="text-white flex items-center gap-3 text-xs">
                  <div className="circle h-[12px] w-[12px] rounded-full bg-yellow-600"></div>
                  {data.status}
                </div>
              ) : data.status === "Ongoing" ? (
                <div className="text-white flex items-center gap-3 text-xs">
                  <div className="circle h-[12px] w-[12px] rounded-full bg-emerald-600"></div>
                  {data.status}
                </div>
              ) : (
                <div className="text-white flex items-center gap-3 text-xs">
                  <div className="circle h-[12px] w-[12px] rounded-full bg-red-600"></div>
                  {data.status}
                </div>
              )}
              <h1 className="text-2xl font-[500] mt-1">{data?.name}</h1>
              <p className="text-neutral-100 text-sm">
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
                {data?.location}
              </p>
              <p className="text-neutral-100 text-sm flex items-center gap-2 mt-2">
                <Users size="15px" /> Capacity: {data.attendeeLim} atendees
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="registrations flex gap-2 items-center text-sm bg-white px-4 py-1 rounded-full text-black">
                <div className="circle w-[10px] h-[10px] bg-blue-500 rounded-full"></div>
                <p>
                  {data.atnSz! > 1
                    ? `${data.atnSz} people have registered`
                    : `${data.atnSz} person has registered`}
                </p>
              </div>
              <ChevronRight
                onClick={() => router.push(`/view-event/${data.id}`)}
              />
            </div>
          </div>
          <div className="absolute top-0 right-0 w-full h-full z-[1]">
            <img
              src={data.coverFile}
              alt=""
              className="h-full w-full object-cover brightness-30"
            />
          </div>
        </div>
      )}
      {!isFetching && !data && (
        <div className="grid place-content-center h-full w-full">
          <div className="flex flex-col items-center gap-2 text-neutral-600">
            <FileQuestion size="18px" />
            <p className="text-sm">No Ordinary event.</p>
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
                color: "black", // spinner stroke
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
