import { bizmatchSlice } from "@/features/attendBizmatchSlice";
import { CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import {
  Check,
  Clock,
  DoorOpen,
  User,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import moment from "moment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

export default function SupplierTimesheetDisplay() {
  const router = useRouter();
  const bizData = useSelector(bizmatchSlice);
  const { timeslot } = router.query;

  return (
    <>
      {!timeslot && (
        <>
          <h1 className="font-[500] text-2xl">
            Hello,{" "}
            <span className="font-[700] text-emerald-700">
              {bizData.supplier.name}
            </span>
            !
          </h1>
          <p className="text-neutral-800">
            Your timesheet and appointments for this event is as displayed
            below.
          </p>

          {bizData.supplier.timeslots.length === 0 &&
            !bizData.supplier.fetching.requesting &&
            bizData.supplier.fetching.status && (
              <h1 className="mt-5 text-center">No timeslots issued.</h1>
            )}
          {bizData.supplier.fetching.requesting && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              key={122}
              className="loading-state h-[500px] w-full flex items-center justify-center gap-5"
            >
              <CircularProgress
                size={20}
                thickness={5}
                disableShrink
                sx={{
                  color: "black", // spinner stroke
                }}
              />
              Getting timeslots...
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 my-5">
            {bizData.supplier.timeslots &&
              !bizData.supplier.fetching.requesting &&
              bizData.supplier.fetching.status &&
              bizData.supplier.timeslots.map((d, i) => {
                return (
                  <>
                    <div
                      onClick={() => router.push(`?timeslot=${d.id}`)}
                      className="bg-white geist rounded-md shadow-sm shadow-neutral-100 overflow-hidden cursor-pointer"
                    >
                      <div className="p-3 bg-emerald-700 text-white">
                        <p className="font-[600] flex items-center gap-2">
                          <Clock size="17px" />{" "}
                          {moment(d.startT).format("hh:mm A")} -{" "}
                          {moment(d.endT).format("hh:mm A")}
                        </p>
                      </div>
                      <div className="px-3 py-3 ">
                        <div className="">
                          <p className="text-sm font-[500]">Attendees</p>
                          <div className="grid grid-cols-2 gap-2 items-center text-sm">
                            <div className="flex gap-2 items-center">
                              <div className="icon bg-emerald-200 text-emerald-700 size-10 rounded-lg grid place-content-center">
                                <Check size="18px" />
                              </div>
                              <p className="flex flex-col">
                                <span className="block font-bold text-lg">
                                  {
                                    d.registrations.filter(
                                      (d) => d.attended === "attended"
                                    ).length
                                  }
                                </span>
                                <span className="text-xs">Complete</span>
                              </p>
                            </div>

                            <div className="flex gap-2 items-center">
                              <div className="icon bg-blue-200 text-blue-700 size-10 rounded-lg grid place-content-center">
                                <Users size="18px" />
                              </div>
                              <p className="flex flex-col">
                                <span className="block font-bold text-lg">
                                  {
                                    d.registrations.filter(
                                      (d) => d.attended === "present"
                                    ).length
                                  }
                                </span>
                                <span className="text-xs">Present</span>
                              </p>
                            </div>

                            <div className="flex gap-2 items-center">
                              <div className="icon bg-yellow-200 text-yellow-700 size-10 rounded-lg grid place-content-center">
                                <UserCheck size="18px" />
                              </div>
                              <p className="flex flex-col">
                                <span className="block font-bold text-lg">
                                  {
                                    d.registrations.filter(
                                      (d) => d.attended === "registered"
                                    ).length
                                  }
                                </span>
                                <span className="text-xs">Present</span>
                              </p>
                            </div>
                            <div className="flex gap-2 items-center">
                              <div className="icon bg-red-200 text-red-700 size-10 rounded-lg grid place-content-center">
                                <DoorOpen size="18px" />
                              </div>
                              <p className="flex flex-col">
                                <span className="block font-bold text-lg">
                                  {
                                    d.registrations.filter(
                                      (d) => d.attended === "no_show"
                                    ).length
                                  }
                                </span>
                                <span className="text-xs">No-Show</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
          </div>
        </>
      )}
    </>
  );
}
