import { bizmatchSlice } from "@/features/attendBizmatchSlice";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Check,
  Pencil,
  X,
  Minus,
  User,
  Coffee,
} from "lucide-react";
import moment from "moment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useModal } from "@/components/Modal/ModalContext";

type SupplierStatus = "open" | "break";

const statusIcons = {
  open: <User className="text-emerald-600" size="16px" strokeWidth={"2"} />,
  break: <Coffee className="text-amber-600" size="16px" strokeWidth={"2"} />,
};

const statusColors = {
  open: "bg-emerald-100 text-emerald-700",
  break: "bg-amber-100 text-amber-700",
};

export default function TimesheetDetail() {
  const router = useRouter();
  const bizData = useSelector(bizmatchSlice);
  const { timeslot } = router.query;
  const modal = useModal();
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedAttendee, setSelectedAttendee] = useState<{
    id: string;
    newStatus: string;
    name: string;
  } | null>(null);
  const [supplierStatus, setSupplierStatus] = useState<SupplierStatus>("open");

  const handleChangeAttendeeState = async (
    atnId: string,
    ns: string,
    name: string,
    showModal: boolean = false
  ) => {
    if (!atnId || !["present", "attended", "no_show"].includes(ns)) return;

    if (showModal) {
      setSelectedAttendee({
        id: atnId,
        newStatus: ns,
        name: name,
      });
      setShowStatusModal(true);
    } else {
      // executes and sets the supplier status to in_meeting, only on present state
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API}/change-attendee-state`,
          {
            atnId: atnId,
            newAttendeeStatus: ns,
            newSupplierStatus: "in_meeting",
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
    }
  };

  const handleConfirmStatusChange = async () => {
    if (!selectedAttendee) return;

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API}/change-attendee-state`,
        {
          atnId: selectedAttendee.id,
          newAttendeeStatus: selectedAttendee.newStatus,
          newSupplierStatus: supplierStatus,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bizData.supplier.acsTok}`,
          },
        }
      );
      setShowStatusModal(false);
      setSelectedAttendee(null);
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
                {bizData.supplier.open === "open" && (
                  <motion.p
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    key={1}
                    className="bg-emerald-700 px-5 py-1 rounded-md text-white"
                  >
                    OPEN
                  </motion.p>
                )}
                {bizData.supplier.open === "closed" && (
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
                {bizData.supplier.open === "in_meeting" && (
                  <motion.p
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    key={3}
                    className="bg-purple-700 px-5 py-1 rounded-md text-white"
                  >
                    IN MEETING
                  </motion.p>
                )}
                {bizData.supplier.open === "break" && (
                  <motion.p
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    key={4}
                    className="bg-yellow-700 px-5 py-1 rounded-md text-white"
                  >
                    BREAK
                  </motion.p>
                )}
                {bizData.supplier.open === "waiting" && (
                  <motion.p
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    key={5}
                    className="bg-blue-700 px-5 py-1 rounded-md text-white"
                  >
                    WAITING
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {!bizData.supplier.timeslot.fetching.requesting &&
            bizData.supplier.timeslot.fetching.status && (
              <>
                <div className="mt-2 text-emerald-50 px-7 py-5 rounded-md shadow-sm shadow-neutral-100 sticky top-[90px] z-[10] bg-gradient-to-r from-emerald-600 to-emerald-700">
                  <div className="flex justify-between items-center">
                    <h1 className="text-[14px] md:text-lg md:text-2xl font-[400] flex items-center gap-2">
                      <Clock className="size-5" />{" "}
                      {moment(bizData.supplier.timeslot.startT).format(
                        "hh:mm A"
                      )}{" "}
                      -{" "}
                      {moment(bizData.supplier.timeslot.endT).format("hh:mm A")}
                    </h1>
                    <h1 className="text-xs md:text-sm text-emerald-50 font-[300] flex items-center gap-2">
                      {moment(bizData.supplier.timeslot.endT).format(
                        "MMMM d, yyyy"
                      )}
                    </h1>
                  </div>
                  <div className="flex justify-between items-start flex-col">
                    <p className="text-sm mt-1 font-[300]">
                      {bizData.supplier.name}, {bizData.supplier.location}
                    </p>
                    <div className="flex items-center gap-1 flex-wrap mt-3">
                      <p className="text-xs mt-1 font-[500] bg-white text-black px-5 py-1 rounded-sm flex items-center gap-2">
                        <Check
                          size="15px"
                          strokeWidth="3"
                          className="text-emerald-700"
                        />
                        {bizData.supplier.timeslot.complete} completed
                      </p>
                      <p className="text-xs mt-1 font-[500] bg-white text-black px-5 py-1 rounded-sm flex items-center gap-2">
                        <Pencil
                          size="15px"
                          strokeWidth="3"
                          className="text-yellow-700"
                        />
                        {bizData.supplier.timeslot.registered} registered
                      </p>
                      <p className="text-xs mt-1 font-[500] bg-white text-black px-5 py-1 rounded-sm flex items-center gap-2">
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
                                                      "attended",
                                                      d.bizregistrant.name,
                                                      true
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
                                                      "no_show",
                                                      d.bizregistrant.name,
                                                      true
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
                                                      "present",
                                                      d.bizregistrant.name
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

          <AnimatePresence>
            {showStatusModal && selectedAttendee && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center z-[9999]">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
                >
                  <h2 className="text-lg font-semibold mb-4">
                    Change Status for {selectedAttendee.name}
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">
                    You are marking this registrant as{" "}
                    <span className="font-medium">
                      {selectedAttendee.newStatus === "no show"
                        ? "NO SHOW"
                        : selectedAttendee.newStatus.toUpperCase()}
                    </span>
                    . What would you like your status to be?
                  </p>

                  <div className="space-y-3 mb-6">
                    {Object.keys(statusIcons).map((status) => (
                      <button
                        key={status}
                        onClick={() =>
                          setSupplierStatus(status as SupplierStatus)
                        }
                        className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                          supplierStatus === status
                            ? statusColors[status as SupplierStatus]
                            : "hover:bg-gray-50"
                        }`}
                      >
                        {statusIcons[status as SupplierStatus]}
                        <span className="font-medium">
                          {status.toUpperCase()}
                        </span>
                        {status === "break" && (
                          <span className="text-sm text-gray-500 ml-2">
                            (Take a break, water, etc.)
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setShowStatusModal(false);
                        setSelectedAttendee(null);
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmStatusChange}
                      className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
                    >
                      Confirm
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </>
      )}
    </>
  );
}
