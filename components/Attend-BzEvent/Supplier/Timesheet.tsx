import {
  bizmatchSlice,
  setSupplierAccount,
} from "@/features/attendBizmatchSlice";
import { CircularProgress } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  CircleDashed,
  Clock,
  DoorOpen,
  User,
  UserCheck,
  Users,
  X,
  Coffee,
  UserCog,
  Timer,
  Clock4,
  CircleFadingPlus,
  ArrowLeftRight,
} from "lucide-react";
import moment from "moment";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useClickOutside } from "@/hooks/UseClickOutside";
import axios from "axios";
import { useModal } from "@/components/Modal/ModalContext";

type SupplierStatus = "open" | "closed" | "in_meeting" | "break" | "waiting";

const statusIcons = {
  open: (
    <UserCheck className="text-emerald-600" size="16px" strokeWidth={"2"} />
  ),
  closed: <X className="text-red-600" size="16px" strokeWidth={"2"} />,
  break: <Coffee className="text-amber-600" size="16px" strokeWidth={"2"} />,
  waiting: <Timer className="text-purple-600" size="16px" strokeWidth={"2"} />,
  in_meeting: (
    <ArrowLeftRight className="text-purple-600" size="16px" strokeWidth={"2"} />
  ),
};

const statusColors = {
  open: "bg-emerald-100 text-emerald-700",
  closed: "bg-red-100 text-red-700",
  break: "bg-amber-100 text-amber-700",
  waiting: "bg-purple-100 text-purple-700",
  in_meeting: "bg-blue-100 text-blue-700",
};

const kvStat = {
  open: "Open",
  closed: "Closed",
  in_meeting: "In Meeting",
  break: "Break",
  waiting: "Waiting",
};

interface TimeSlot {
  startT: string;
  status: {
    status: string;
    name: string;
    orgN: string;
  };
}

const AnimatedTimeDigit = ({ digit }: { digit: string }) => (
  <motion.span
    key={digit}
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 10 }}
    transition={{ duration: 0.15 }}
    className="inline-block w-[0.6em] text-center"
  >
    {digit}
  </motion.span>
);

const AnimatedTime = ({ time }: { time: string }) => {
  // Split time into positions (HH:MM:SS AM/PM)
  const timeDigits = {
    hour1: time.charAt(0),
    hour2: time.charAt(1),
    colon1: time.charAt(2),
    min1: time.charAt(3),
    min2: time.charAt(4),
    colon2: time.charAt(5),
    sec1: time.charAt(6),
    sec2: time.charAt(7),
    space: time.charAt(8),
    ampm1: time.charAt(9),
    ampm2: time.charAt(10),
  };

  return (
    <div className="inline-flex">
      <AnimatePresence mode="wait">
        <AnimatedTimeDigit
          key={`h1-${timeDigits.hour1}`}
          digit={timeDigits.hour1}
        />
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <AnimatedTimeDigit
          key={`h2-${timeDigits.hour2}`}
          digit={timeDigits.hour2}
        />
      </AnimatePresence>
      <span>:</span>
      <AnimatePresence mode="wait">
        <AnimatedTimeDigit
          key={`m1-${timeDigits.min1}`}
          digit={timeDigits.min1}
        />
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <AnimatedTimeDigit
          key={`m2-${timeDigits.min2}`}
          digit={timeDigits.min2}
        />
      </AnimatePresence>
      <span>:</span>
      <AnimatePresence mode="wait">
        <AnimatedTimeDigit
          key={`s1-${timeDigits.sec1}`}
          digit={timeDigits.sec1}
        />
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <AnimatedTimeDigit
          key={`s2-${timeDigits.sec2}`}
          digit={timeDigits.sec2}
        />
      </AnimatePresence>
      <span>&nbsp;</span>
      <AnimatePresence mode="wait">
        <AnimatedTimeDigit
          key={`ap1-${timeDigits.ampm1}`}
          digit={timeDigits.ampm1}
        />
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <AnimatedTimeDigit
          key={`ap2-${timeDigits.ampm2}`}
          digit={timeDigits.ampm2}
        />
      </AnimatePresence>
    </div>
  );
};

export default function SupplierTimesheetDisplay() {
  const dispatch = useDispatch();
  const modal = useModal();
  const router = useRouter();
  const bizData = useSelector(bizmatchSlice);
  const { timeslot } = router.query;
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentStatus, setCurrentStatus] = useState<SupplierStatus>("open");
  const [showStatusPicker, setShowStatusPicker] = useState(false);

  const statusPickerRef = useClickOutside<HTMLDivElement>(() => {
    setShowStatusPicker(false);
  });

  useEffect(() => {
    setCurrentStatus(bizData.supplier.open as SupplierStatus);
  }, [bizData]);

  useEffect(() => {
    let worker: Worker;

    try {
      if (typeof window !== "undefined") {
        worker = new window.Worker("/timeWorker.js");

        worker.onmessage = (event) => {
          if (event.data.error) {
            console.error("Worker error:", event.data.error);
            return;
          }
          setCurrentTime(moment(event.data).utcOffset(8).format("hh:mm:ss A"));
        };

        worker.onerror = (error) => {
          console.error("Worker error:", error);
        };

        // Send initial message to start the timer
        worker.postMessage("start");
      }
    } catch (error) {
      console.error("Failed to initialize worker:", error);
      // Fallback to regular interval if worker fails
      const interval = setInterval(() => {
        setCurrentTime(moment().format("hh:mm:ss A"));
      }, 1000);
      return () => clearInterval(interval);
    }

    return () => {
      if (worker) {
        worker.terminate();
      }
    };
  }, []);

  const handleStatusChange = async (status: SupplierStatus) => {
    if (!status) return;

    try {
      modal.hide();
      modal.show({
        type: "loading",
        title: "Changing status...",
        color: "blue",
      });
      await axios.post(
        `${process.env.NEXT_PUBLIC_API}/change-supplier-status`,
        {
          suplId: bizData.supplier.id,
          bzId: bizData.supplier.bizmatcheventId,
          newStatus: status,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${bizData.supplier.acsTok}`,
            "Content-Type": "application/json",
          },
        }
      );
      modal.hide();
      dispatch(
        setSupplierAccount({
          ...bizData.supplier,
          open: status,
        })
      );
    } catch (e) {
      router.push("/attend-bizmatch");
    }
  };

  return (
    <>
      <div className="flex justify-between flex-col md:flex-row md:items-center">
        <div className="md:basis-1/2">
          <h1 className="font-[500] text-xl md:text-2xl">
            Hello,{" "}
            <span className="font-[700] text-emerald-700">
              {bizData.supplier.name}
            </span>
            !
          </h1>
          <p className="text-neutral-800 text-sm md:text-base">
            Your schedule for this event is as displayed below.
          </p>
        </div>
        <div className="flex justify-between md:justify-end gap-5 mt-2 md:mt-0 md:items-center md:basis-1/2">
          <div className="bg-white px-7 py-5 w-[100%] flex flex-col gap-2 rounded-lg shadow-sm shadow-neutral-100">
            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-sm font-[500]">Current Time:</p>
              <p className="font-[300] text-left md:text-right">
                {currentTime ? (
                  <AnimatedTime time={currentTime} />
                ) : (
                  <>Synchronizing...</>
                )}
              </p>
            </motion.div>

            <div className="flex items-center justify-between">
              <p className="text-sm font-[500]">Your status:</p>
              <div className="relative flex justify-end">
                <motion.button
                  className={`px-4 text-sm py-2 rounded-lg flex font-[500] items-center gap-2 ${
                    statusColors[bizData.supplier.open]
                  }`}
                  onClick={() => setShowStatusPicker(!showStatusPicker)}
                  whileTap={{ scale: 0.98 }}
                >
                  {statusIcons[bizData.supplier.open]}
                  {kvStat[bizData.supplier.open]}
                </motion.button>

                <AnimatePresence>
                  {showStatusPicker && (
                    <motion.div
                      ref={statusPickerRef}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-[100%] right-0 mt-2 bg-white rounded-lg shadow-lg p-2 z-50 min-w-[200px]"
                    >
                      {Object.keys(statusIcons).map((status) => (
                        <motion.button
                          key={status}
                          className={`w-full px-4 py-2 rounded-lg flex font-[500] items-center gap-2 mb-1 last:mb-0 ${
                            bizData.supplier.open === status
                              ? statusColors[status as SupplierStatus]
                              : "hover:bg-neutral-50"
                          }`}
                          onClick={() => {
                            setCurrentStatus(status as SupplierStatus);
                            setShowStatusPicker(false);
                            handleStatusChange(status as SupplierStatus);
                          }}
                        >
                          {statusIcons[status as SupplierStatus]}
                          {kvStat[status]}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {bizData.supplier.timeslots.length === 0 &&
        !bizData.supplier.fetching.requesting &&
        bizData.supplier.fetching.status && (
          <h1 className="mt-5 text-center">No timeslots issued.</h1>
        )}
      {bizData.supplier.fetching.requesting ? (
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
      ) : (
        <div className=" bg-white p-5 mt-5 rounded-lg">
          <div>
            <h1 className="flex gap-3 font-[600] text-lg items-center">
              <Clock />
              Today's Schedule
            </h1>
            <p className="mt-1 text-sm">Your timeslots for today:</p>
          </div>
          <table className="w-full table-gap border-collapse border-spacing-y-1 mt-5">
            <tbody>
              {bizData.supplier.timeslots &&
                !bizData.supplier.fetching.requesting &&
                bizData.supplier.fetching.status &&
                bizData.supplier.timeslots.map((d, i: number) => {
                  if (d.status.status === "OPEN") {
                    return (
                      <>
                        <tr className="bg-neutral-50/50 border-1 border-neutral-100 rounded-lg">
                          <td className="font-[600] text-neutral-800 text-xs md:text-sm w-[200px] text-center">
                            <div className="p-5">
                              {moment(d.startT).format("hh:mm A")}
                            </div>
                          </td>
                          <td>
                            <p className="flex items-center gap-2 font-[500] text-sm">
                              <CircleDashed size="18px" className="shrink-0" />{" "}
                              Slot Available
                            </p>
                          </td>

                          <td className="w-[200px]">
                            <p className="bg-neutral-100 w-max mx-auto px-5 py-1 rounded-full font-[600] text-sm">
                              OPEN
                            </p>
                          </td>
                        </tr>
                      </>
                    );
                  } else if (d.status.status === "SCHEDULED") {
                    return (
                      <>
                        <tr
                          onClick={() =>
                            router.push(`/attend-bizmatch?timeslot=${d.id}`)
                          }
                          className="p-5 bg-blue-50/50 border-1 border-blue-200 rounded-lg cursor-pointer"
                        >
                          <td className="font-[600] text-neutral-800 text-xs md:text-sm w-[200px] text-center">
                            <div className="p-5">
                              {moment(d.startT).format("hh:mm A")}
                            </div>
                          </td>
                          <td>
                            <p className="font-[500] text-xs md:text-sm">
                              {d.status.name}
                            </p>
                            <p className="font-[400] text-[10px] md:text-xs">
                              {d.status.orgN}
                            </p>
                          </td>

                          <td className="w-[200px]">
                            <p className="bg-blue-100 text-blue-600 mx-auto w-max px-5 py-1 rounded-full font-[600] text-xs">
                              SCHEDULED
                            </p>
                          </td>
                        </tr>
                      </>
                    );
                  } else if (d.status.status === "REOPENED") {
                    return (
                      <>
                        <tr
                          onClick={() =>
                            router.push(`/attend-bizmatch?timeslot=${d.id}`)
                          }
                          className="p-5 bg-yellow-50/50 border-1 border-yellow-200 rounded-lg cursor-pointer"
                        >
                          <td className="font-[600] text-neutral-800 text-xs md:text-sm w-[200px] text-center">
                            <div className="p-5">
                              {moment(d.startT).format("hh:mm A")}
                            </div>
                          </td>
                          <td>
                            <p className="flex items-center gap-2 font-[500] text-xs md:text-sm">
                              <CircleFadingPlus
                                size="18px"
                                className="shrink-0"
                              />{" "}
                              Slot Re-opened
                            </p>
                          </td>

                          <td className="w-[200px]">
                            <p className="bg-yellow-100 text-yellow-600 mx-auto w-max px-5 py-1 rounded-full font-[600] text-xs">
                              REOPENED
                            </p>
                          </td>
                        </tr>
                      </>
                    );
                  } else if (d.status.status === "ATTENDED") {
                    return (
                      <>
                        <tr
                          onClick={() =>
                            router.push(`/attend-bizmatch?timeslot=${d.id}`)
                          }
                          className="p-5 bg-emerald-50/50 border-1 border-emerald-200 rounded-lg cursor-pointer"
                        >
                          <td className="font-[600] text-neutral-800 text-xs md:text-sm w-[200px] text-center">
                            <div className="p-5">
                              {moment(d.startT).format("hh:mm A")}
                            </div>
                          </td>
                          <td>
                            <p className="font-[500] text-xs md:text-sm">
                              {d.status.name}
                            </p>
                            <p className="font-[400] text-[10px] md:text-xs">
                              {d.status.orgN}
                            </p>
                          </td>

                          <td className="w-[200px]">
                            <p className="bg-emerald-100 text-emerald-600 mx-auto w-max px-5 py-1 rounded-full font-[600] text-xs">
                              ATTENDED
                            </p>
                          </td>
                        </tr>
                      </>
                    );
                  } else if (d.status.status === "IN MEETING") {
                    return (
                      <>
                        <tr
                          onClick={() =>
                            router.push(`/attend-bizmatch?timeslot=${d.id}`)
                          }
                          className="p-5 bg-purple-50/50 border-1 border-purple-200 rounded-lg cursor-pointer"
                        >
                          <td className="font-[600] text-neutral-800 text-xs md:text-sm w-[200px] text-center">
                            <div className="p-5">
                              {moment(d.startT).format("hh:mm A")}
                            </div>
                          </td>
                          <td>
                            <p className="font-[500] text-xs md:text-sm">
                              {d.status.name}
                            </p>
                            <p className="font-[400] text-[10px] md:text-xs">
                              {d.status.orgN}
                            </p>
                          </td>

                          <td className="w-[200px]">
                            <p className="bg-purple-100 text-purple-600 mx-auto w-max px-5 py-1 rounded-full font-[600] text-xs">
                              IN MEETING
                            </p>
                          </td>
                        </tr>
                      </>
                    );
                  }
                })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
