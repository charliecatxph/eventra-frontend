import { bizmatchSlice } from "@/features/attendBizmatchSlice";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Clock, Check, Pencil, X, Minus, User } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

export default function TimesheetDetail() {
  const router = useRouter();
  const bizData = useSelector(bizmatchSlice);
  const { timeslot } = router.query;

  const handleChangeAttendeeState = async (atnId, ns) => {
    if (
      !atnId ||
      !["registered", "attended", "no_show", "present"].includes(ns)
    )
      return;
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/change-attendee-state`,
        {
          atnId: atnId,
          newStatus: ns,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bizData.supplier.acsTok}`,
          },
        }
      );
    } catch (err) {
      router.push("/attend-bizmatch");
    }
  };

  return (
    <>
      {timeslot && (
        <>
          <div className="flex justify-between items-center">
            <button
              onClick={() =>
                router.push("/attend-bizmatch", undefined, {
                  shallow: false,
                })
              }
              className="border-1 px-5 py-1 border-neutral-100 text-sm font-[500] flex items-center gap-2 hover:bg-neutral-50 rounded-md "
            >
              <ArrowLeft size="15px" /> Go Back
            </button>
            <div className="flex gap-2 items-center font-[600] text-xs">
              <span className="hidden md:block">Your supplier status is:</span>
              <AnimatePresence mode="wait">
                {" "}
                {bizData.supplier.open ? (
                  <motion.p
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    key={1}
                    className="bg-emerald-700 px-5 py-1 rounded-md text-white"
                  >
                    OPEN
                  </motion.p>
                ) : (
                  <motion.p
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    key={2}
                    className="bg-red-700 px-5 py-1 rounded-md text-white"
                  >
                    CLOSED
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {!bizData.supplier.timeslot.fetching.requesting &&
            bizData.supplier.timeslot.fetching.status && (
              <>
                <div className="mt-2 bg-emerald-700 text-emerald-50 px-7 py-5 rounded-md shadow-sm shadow-neutral-100 sticky top-[90px] z-[10]">
                  <div className="flex justify-between items-center">
                    <h1 className="text-lg md:text-2xl font-[700] flex items-center gap-2">
                      <Clock className="size-5" />{" "}
                      {moment(bizData.supplier.timeslot.startT).format(
                        "hh:mm A"
                      )}{" "}
                      -{" "}
                      {moment(bizData.supplier.timeslot.endT).format("hh:mm A")}
                    </h1>
                    <h1 className="text-sm text-emerald-50 font-[700] flex items-center gap-2">
                      {moment(bizData.supplier.timeslot.endT).format(
                        "MMMM d, yyyy"
                      )}
                    </h1>
                  </div>
                  <div className="flex justify-between items-start flex-col">
                    <p className="text-sm mt-1 font-[600]">
                      {bizData.supplier.name}, {bizData.supplier.location}
                    </p>
                    <div className="flex items-center gap-1 flex-wrap mt-3">
                      <p className="text-xs mt-1 font-[500] bg-white text-black px-5 py-1 rounded-full flex items-center gap-2">
                        <Check
                          size="15px"
                          strokeWidth="3"
                          className="text-emerald-700"
                        />
                        {bizData.supplier.timeslot.complete} completed
                      </p>
                      <p className="text-xs mt-1 font-[500] bg-white text-black px-5 py-1 rounded-full flex items-center gap-2">
                        <Pencil
                          size="15px"
                          strokeWidth="3"
                          className="text-yellow-700"
                        />
                        {bizData.supplier.timeslot.registered} registered
                      </p>
                      <p className="text-xs mt-1 font-[500] bg-white text-black px-5 py-1 rounded-full flex items-center gap-2">
                        <X
                          size="15px"
                          strokeWidth="3"
                          className="text-red-700"
                        />
                        {bizData.supplier.timeslot.noShow} didn't show up at all
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  <h1 className="font-[600] sticky top-0">Completed</h1>
                  <div className="h-full">
                    {bizData.supplier.timeslot.filteredRegistrants.complete
                      .length === 0 && (
                      <div className="h-[200px] atendee-table mt-5 rounded-lg overflow-hidden border-1 border-neutral-200 w-full grid place-items-center">
                        <p>No data.</p>
                      </div>
                    )}

                    {bizData.supplier.timeslot.filteredRegistrants.complete
                      .length !== 0 && (
                      <>
                        <div>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            key={1}
                            className="h-[250px] atendee-table mt-5 rounded-lg overflow-hidden border-1 border-neutral-200 overflow-y-scroll overflow-x-scroll"
                          >
                            <table className="table-fixed bg-white font-[500] geist text-xs w-full">
                              <tr className="sticky top-0">
                                <th className="w-[200px] p-3 font-[500] bg-neutral-100 whitespace-nowrap text-left">
                                  Organization / E-Mail
                                </th>
                                <th className="w-[200px] p-3 font-[500] bg-neutral-100 whitespace-nowrap text-left">
                                  Represented By / Position
                                </th>
                                <th className="w-[200px] p-3 font-[500] bg-neutral-100 whitespace-nowrap text-left">
                                  Done At
                                </th>
                                <th className=" w-[400px] p-3 font-[500] bg-neutral-100 ">
                                  Options
                                </th>
                              </tr>

                              {bizData.supplier.timeslot.filteredRegistrants.complete.map(
                                (d, i) => {
                                  return (
                                    <>
                                      <tr
                                        key={i}
                                        className="border-b-1 border-neutral-200 font-[500] geist text-xs"
                                      >
                                        <td className="w-[200px] p-3 max-w-[300px]">
                                          <div className="flex justify-center flex-col">
                                            <p className="truncate">
                                              {d.bizregistrant.orgN}
                                            </p>

                                            <p className="font-[400] text-neutral-800 truncate flex items-center gap-1">
                                              {d.bizregistrant.email}
                                            </p>
                                          </div>
                                        </td>
                                        <td className="w-[200px] p-3  ">
                                          <div className="flex justify-center flex-col">
                                            <p className="truncate">
                                              {d.bizregistrant.name}
                                            </p>

                                            <p className="font-[400] text-neutral-800 truncate flex items-center gap-1">
                                              {d.bizregistrant.orgP}
                                            </p>
                                          </div>
                                        </td>
                                        <td className="w-[200px]  p-3 max-w-[300px]">
                                          {moment(d.doneAt).format(
                                            "MMMM DD, yyyy, hh:mm A"
                                          )}
                                        </td>
                                        <td className="sticky right-0 w-[200px] p-3 sticky">
                                          <div className="w-full flex justify-end gap-2 ">
                                            <button
                                              onClick={() => {
                                                handleChangeAttendeeState(
                                                  d.id,
                                                  "present"
                                                );
                                              }}
                                              className="flex bg-yellow-700 hover:bg-yellow-800 text-yellow-50 font-[600] items-center gap-2 p-2   border-1 border-neutral-200 rounded-md"
                                            >
                                              <Minus size="15px" />{" "}
                                              <span className="hidden md:block">
                                                Revert, mark as present
                                              </span>
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    </>
                                  );
                                }
                              )}
                            </table>
                          </motion.div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="">
                  <h1 className="font-[600] mt-2">Registered</h1>
                  <div className="h-full">
                    {bizData.supplier.timeslot.filteredRegistrants.registered
                      .length === 0 && (
                      <div className="h-[200px] atendee-table mt-5 rounded-lg overflow-hidden border-1 border-neutral-200 w-full grid place-items-center">
                        <p>No data.</p>
                      </div>
                    )}

                    {bizData.supplier.timeslot.filteredRegistrants.registered
                      .length !== 0 && (
                      <>
                        <div>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            key={2}
                            className="h-[250px] atendee-table mt-5 rounded-lg overflow-hidden border-1 border-neutral-200 overflow-y-scroll overflow-x-scroll"
                          >
                            <table className="table-fixed bg-white font-[500] geist text-xs w-full">
                              <tr className="sticky top-0">
                                <th className="w-[200px] p-3 font-[500] bg-neutral-100 whitespace-nowrap text-left">
                                  Organization / E-Mail
                                </th>
                                <th className="w-[200px] p-3 font-[500] bg-neutral-100 whitespace-nowrap text-left">
                                  Represented By / Position
                                </th>
                                <th className="w-[80px] p-3 font-[500] bg-neutral-100 whitespace-nowrap text-left">
                                  Status
                                </th>
                                <th className="w-[400px] p-3 font-[500] bg-neutral-100  text-right">
                                  Options
                                </th>
                              </tr>

                              {bizData.supplier.timeslot.filteredRegistrants.registered.map(
                                (d, i) => {
                                  return (
                                    <>
                                      <tr
                                        key={i}
                                        className="border-b-1 border-neutral-200 font-[500] geist text-xs"
                                      >
                                        <td className="w-[200px] p-3 max-w-[300px]">
                                          <div className="flex justify-center flex-col">
                                            <p className="truncate">
                                              {d.bizregistrant.orgN}
                                            </p>

                                            <p className="font-[400] text-neutral-800 truncate flex items-center gap-1">
                                              {d.bizregistrant.email}
                                            </p>
                                          </div>
                                        </td>
                                        <td className="w-[200px] p-3  ">
                                          <div className="flex justify-center flex-col">
                                            <p className="truncate">
                                              {d.bizregistrant.name}
                                            </p>

                                            <p className="font-[400] text-neutral-800 truncate flex items-center gap-1">
                                              {d.bizregistrant.orgP}
                                            </p>
                                          </div>
                                        </td>
                                        <td className="w-[80px] p-3  ">
                                          <div className="flex justify-center flex-col">
                                            <p className="truncate uppercase">
                                              {d.attended}
                                            </p>
                                          </div>
                                        </td>

                                        <td className="sticky right-0 w-[200px] p-3 ">
                                          <div className="w-full flex justify-end gap-2 ">
                                            {d.attended === "present" && (
                                              <>
                                                <button
                                                  onClick={() => {
                                                    handleChangeAttendeeState(
                                                      d.id,
                                                      "registered"
                                                    );
                                                  }}
                                                  className="flex bg-yellow-700 hover:bg-yellow-800 text-yellow-50 font-[600] items-center gap-2 p-2   border-1 border-neutral-200 rounded-md"
                                                >
                                                  <Minus size="15px" />{" "}
                                                  <span className="hidden md:block">
                                                    Revert, mark as registered
                                                  </span>
                                                </button>
                                                <button
                                                  onClick={() => {
                                                    handleChangeAttendeeState(
                                                      d.id,
                                                      "attended"
                                                    );
                                                  }}
                                                  className="flex bg-emerald-700 hover:bg-emerald-800 text-emerald-50 font-[600] items-center gap-2 p-2   border-1 border-neutral-200 rounded-md"
                                                >
                                                  <Check size="15px" />{" "}
                                                  <span className="hidden md:block">
                                                    Mark as Complete
                                                  </span>
                                                </button>
                                              </>
                                            )}

                                            {d.attended !== "present" && (
                                              <>
                                                <button
                                                  onClick={() => {
                                                    handleChangeAttendeeState(
                                                      d.id,
                                                      "no_show"
                                                    );
                                                  }}
                                                  className="flex bg-red-700 hover:bg-red-800 text-red-50 font-[600] items-center gap-2 p-2   border-1 border-neutral-200 rounded-md"
                                                >
                                                  <X size="15px" />{" "}
                                                  <span className="hidden md:block">
                                                    Mark as No-Show
                                                  </span>
                                                </button>
                                                <button
                                                  onClick={() => {
                                                    handleChangeAttendeeState(
                                                      d.id,
                                                      "present"
                                                    );
                                                  }}
                                                  className="flex bg-blue-700 hover:bg-blue-800 text-blue-50 font-[600] items-center gap-2 p-2   border-1 border-neutral-200 rounded-md"
                                                >
                                                  <User size="15px" />{" "}
                                                  <span className="hidden md:block">
                                                    Mark as Present
                                                  </span>
                                                </button>
                                              </>
                                            )}
                                          </div>
                                        </td>
                                      </tr>
                                    </>
                                  );
                                }
                              )}
                            </table>
                          </motion.div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="">
                  <h1 className="font-[600] mt-2">No-Shows</h1>
                  <div className="h-full">
                    {bizData.supplier.timeslot.filteredRegistrants.noShow
                      .length === 0 && (
                      <div className="h-[200px] atendee-table mt-5 rounded-lg overflow-hidden border-1 border-neutral-200 w-full grid place-items-center">
                        <p>No data.</p>
                      </div>
                    )}

                    {bizData.supplier.timeslot.filteredRegistrants.noShow
                      .length !== 0 && (
                      <>
                        <div>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            key={3}
                            className="h-[250px] atendee-table mt-5 rounded-lg overflow-hidden border-1 border-neutral-200 overflow-y-scroll overflow-x-scroll"
                          >
                            <table className="table-fixed bg-white font-[500] geist text-xs w-full">
                              <tr className="sticky top-0">
                                <th className="w-[200px] p-3 font-[500] bg-neutral-100 whitespace-nowrap text-left">
                                  Organization / E-Mail
                                </th>
                                <th className="w-[200px] p-3 font-[500] bg-neutral-100 whitespace-nowrap text-left">
                                  Represented By / Position
                                </th>

                                <th className="w-[400px] p-3 font-[500] bg-neutral-100  text-right">
                                  Options
                                </th>
                              </tr>

                              {bizData.supplier.timeslot.filteredRegistrants.noShow.map(
                                (d, i) => {
                                  return (
                                    <>
                                      <tr
                                        key={i}
                                        className="border-b-1 border-neutral-200 font-[500] geist text-xs"
                                      >
                                        <td className="w-[200px] p-3 max-w-[300px]">
                                          <div className="flex justify-center flex-col">
                                            <p className="truncate">
                                              {d.bizregistrant.orgN}
                                            </p>

                                            <p className="font-[400] text-neutral-800 truncate flex items-center gap-1">
                                              {d.bizregistrant.email}
                                            </p>
                                          </div>
                                        </td>
                                        <td className="w-[200px] p-3  ">
                                          <div className="flex justify-center flex-col">
                                            <p className="truncate">
                                              {d.bizregistrant.name}
                                            </p>

                                            <p className="font-[400] text-neutral-800 truncate flex items-center gap-1">
                                              {d.bizregistrant.orgP}
                                            </p>
                                          </div>
                                        </td>

                                        <td className="sticky right-0 w-[200px] p-3 ">
                                          <div className="w-full flex justify-end gap-2 ">
                                            <button
                                              onClick={() => {
                                                handleChangeAttendeeState(
                                                  d.id,
                                                  "registered"
                                                );
                                              }}
                                              className="flex bg-yellow-700 hover:bg-yellow-800 text-yellow-50 font-[600] items-center gap-2 p-2   border-1 border-neutral-200 rounded-md"
                                            >
                                              <Minus size="15px" />{" "}
                                              <span className="hidden md:block">
                                                Revert, mark as registered
                                              </span>
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    </>
                                  );
                                }
                              )}
                            </table>
                          </motion.div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}

          {bizData.supplier.timeslot.fetching.requesting && (
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
              Fetching timeslot...
            </motion.div>
          )}
        </>
      )}
    </>
  );
}
