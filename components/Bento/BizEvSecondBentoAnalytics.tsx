import { LineChart, TrendingUp } from "lucide-react";
import CountUp from "react-countup";
import { CircularProgress } from "@mui/material";

export default function BizEvSecondBentoAnalytics({ isFetching, data }) {
  return (
    <>
      {!isFetching && data && (
        <div className="flex flex-col h-full">
          <h1 className="font-[400] geist text-sm flex gap-2 items-center text-neutral-900">
            <LineChart size="15px" strokeWidth={2} />
            Client to Supplier Show-Up Rate
          </h1>
          <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-2">
            <div className="col-span-2  flex flex-col justify-center gap-2">
              <div>
                <span className="text-4xl font-[600] w-full flex gap-2 items-center">
                  <CountUp end={data.attendedClients} duration={1} /> /{" "}
                  {data.attendeesRegisteredToTimeslots}
                </span>
                <p className="text-xs font-[500] flex justify-between items-center">
                  Attended
                </p>
              </div>
            </div>
            <div className=" flex flex-col justify-center bg-neutral-50 px-5 rounded-lg">
              <div>
                <span className="text-4xl font-[600] w-full">
                  <CountUp end={data.showUpRate} duration={1} />%
                </span>
                <p className="text-xs font-[500]">Show-Up Rate</p>
              </div>
            </div>
            <div className=" flex flex-col justify-center bg-neutral-50 px-5 rounded-lg">
              <div>
                <span className="text-4xl font-[600] w-full">
                  <CountUp end={data.noShow} duration={1} />
                </span>
                <p className="text-xs font-[500]">Didn't Show Up At All</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {!isFetching && !data && (
        <div className="grid place-content-center h-full w-full">
          <div className="flex flex-col items-center gap-2 text-neutral-600">
            <TrendingUp size="18px" />
            <p className="text-sm">Analytics unavailable. No BizMatch event.</p>
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
