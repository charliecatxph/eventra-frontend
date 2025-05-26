import { Pencil, TrendingUp } from "lucide-react";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import { CircularProgress } from "@mui/material";

export default function BizEvFirstBentoAnalytics({ isFetching, data }) {
  return (
    <>
      {!isFetching && data && (
        <div className="flex flex-col h-full">
          <h1 className="font-[400] geist text-sm flex gap-2 items-center text-neutral-900">
            <Pencil size="15px" strokeWidth={2} />
            Booking Overview
          </h1>
          <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-2">
            <div className="col-span-2  flex flex-col justify-center gap-2">
              <div>
                <span className="text-4xl font-[600] w-full flex justify-between items-center">
                  <CountUp end={data.timeslotsBooked} duration={1} />
                </span>
                <p className="text-xs font-[500] flex justify-between items-center">
                  Timeslots Booked{" "}
                  <span className="bg-emerald-50 px-3 py-1.5 text-emerald-700 rounded-full flex items-center gap-2">
                    <TrendingUp size="15px" /> {data.timeslotsFilled || 0}%
                    booked
                  </span>
                </p>
              </div>
              <div className="progress h-[6px] w-full bg-neutral-50 overflow-hidden rounded-full">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${data.timeslotsFilled}%`,
                  }}
                  transition={{ duration: 2, ease: "circOut" }}
                  className="bar h-full bg-emerald-700"
                ></motion.div>
              </div>
            </div>
            <div className=" flex flex-col justify-center bg-neutral-50 px-5 rounded-lg">
              <div>
                <span className="text-4xl font-[600] w-full flex justify-between items-center">
                  <CountUp end={data.timeslotsIssued} duration={1} />
                </span>
                <p className="text-xs font-[500]">Timeslots Issued</p>
              </div>
            </div>
            <div className=" flex flex-col justify-center bg-neutral-50 px-5 rounded-lg">
              <div>
                <span className="text-4xl font-[600] w-full flex justify-between items-center">
                  <CountUp end={data.clientsRegistered} duration={1} />
                </span>
                <p className="text-xs font-[500]">Clients Registered</p>
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
