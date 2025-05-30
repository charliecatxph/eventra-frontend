import {
  ArrowLeft,
  Check,
  ChevronDown,
  Clock,
  Minus,
  Pencil,
  User,
  Users,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  bizmatchSlice,
  setSupplierAccount,
  setSupplierTimeslots,
} from "@/features/attendBizmatchSlice";
import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import { useRouter } from "next/router";
import axios from "axios";
import moment from "moment/moment";
import { CircularProgress } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import jwt from "jsonwebtoken";

export default function SupplierTimesheet() {
  const dispatch = useDispatch();
  const router = useRouter();
  const bizData = useSelector(bizmatchSlice);
  const socketRef = useRef<Socket>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchingStatus, setFetchingStatus] = useState(false);
  const { timeslot } = router.query;

  const bizData_supplier__static = useRef(null);
  const currentTimeslot__static = useRef(null);

  const [currentTimeslot, setCurrentTimeslot] = useState<any>({
    id: "",
    fetching: {
      requesting: false,
      status: false,
    },
  });

  useEffect(() => {
    bizData_supplier__static.current = bizData.supplier;
  }, [bizData]);

  useEffect(() => {
    currentTimeslot__static.current = currentTimeslot;
  }, [currentTimeslot]);

  const handleSupplierUpdate = async () => {
    try {
      const req = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/get-supplier-data-biz`,
        {},
        { withCredentials: true }
      );
      const decode = jwt.decode(req.data.token);
      dispatch(
        setSupplierAccount({
          ...bizData_supplier__static.current,
          id: decode.id,
          isLoggedIn: true,
          bizmatcheventId: decode.bizmatcheventId,
          country: decode.country,
          description: decode.description,
          location: decode.location,
          logoSecUrl: decode.logoSecUrl,
          name: decode.name,
          website: decode.website,

          open: decode.status.isOpen,
        })
      );
    } catch (err) {
      router.push("/attend-bizmatch");
    }
  };

  const handleTimeslotInitialization = async (ts: string) => {
    try {
      setCurrentTimeslot((pv) => ({
        ...pv,
        fetching: {
          requesting: true,
          status: false,
        },
      }));
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/fetch-timeslot-information`,
        {
          tsId: ts.trim(),
        },
        { withCredentials: true }
      );

      const { registrations, ...resData } = res.data.data;

      setCurrentTimeslot((pv) => ({
        ...pv,
        ...resData,
        noShow: registrations.filter((obj) => obj.attended === "no_show")
          .length,
        registered: registrations.filter((obj) =>
          ["registered", "present"].includes(obj.attended)
        ).length,
        complete: registrations.filter((obj) => obj.attended === "attended")
          .length,
        fetching: {
          requesting: false,
          status: true,
        },
        filteredRegistrants: {
          noShow: registrations.filter((obj) => obj.attended === "no_show"),
          registered: registrations.filter((obj) =>
            ["registered", "present"].includes(obj.attended)
          ),
          complete: registrations.filter((obj) => obj.attended === "attended"),
        },
      }));
    } catch (err) {
      router.push("/attend-bizmatch");
    }
  };

  const handleAttendeeStateChange = async (ts: string) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/fetch-timeslot-information`,
        {
          tsId: ts.trim(),
        },
        { withCredentials: true }
      );

      const { registrations, ...resData } = res.data.data;

      setCurrentTimeslot((pv) => ({
        ...pv,
        ...resData,
        noShow: registrations.filter((obj) => obj.attended === "no_show")
          .length,
        registered: registrations.filter((obj) =>
          ["registered", "present"].includes(obj.attended)
        ).length,
        complete: registrations.filter((obj) => obj.attended === "attended")
          .length,
        filteredRegistrants: {
          noShow: registrations.filter((obj) => obj.attended === "no_show"),
          registered: registrations.filter((obj) =>
            ["registered", "present"].includes(obj.attended)
          ),
          complete: registrations.filter((obj) => obj.attended === "attended"),
        },
      }));
    } catch (err) {
      router.push("/attend-bizmatch");
    }
  };

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
        { withCredentials: true }
      );
    } catch (err) {
      router.push("/attend-bizmatch");
    }
  };

  const fetchTimeslots = async () => {
    try {
      setIsFetching(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/get-supplier-timeslots`,
        {
          suplId: bizData.supplier.id,
        },
        { withCredentials: true }
      );

      dispatch(setSupplierTimeslots([...res.data.data.timeslots]));
      setIsFetching(false);
      setFetchingStatus(true);
    } catch (e) {
      router.push("/attend-bizmatch");
    }
  };

  useEffect(() => {
    if (!timeslot) {
      fetchTimeslots();
      return;
    }
    setCurrentTimeslot((pv) => ({
      ...pv,
      id: timeslot,
    }));
    handleTimeslotInitialization(timeslot);
  }, [timeslot]);

  useEffect(() => {
    if (!bizData.supplier.id) return;

    const fetchAndConnect = async () => {
      try {
        await fetchTimeslots();
        const socket = io("http://localhost:8000", { withCredentials: true });
        socketRef.current = socket;

        socket.on("connect", () => {
          socket.emit("identify", {
            type: "EVN-BIZ_SUPPLIER",
            bzId: bizData.supplier.bizmatcheventId,
          });
        });

        socket.on("WS-EVN_BIZ_STATUS_FLIP", () => {
          handleSupplierUpdate();
        });

        socket.on("WS-EVN_BIZ_ATTENDEE_CHANGED", () => {
          handleAttendeeStateChange(currentTimeslot__static.current.id);
        });

        socket.on("WS-EVN_BIZ_SUPPLIER_UPDATE", () => {
          handleAttendeeStateChange(currentTimeslot__static.current.id);
        });

        socket.on("disconnect", (e) => {});
      } catch (err) {
        setIsFetching(false);
        setFetchingStatus(false);

        router.push("/attend-bizmatch");
      }
    };

    fetchAndConnect();

    return () => {
      socketRef.current?.disconnect();
    };
  }, [bizData.supplier.id]);

  return (
    <>
      <header className="py-5 sticky top-0 bg-white z-[9999]">
        <div className="container w-full max-w-[1300px] mx-auto px-5">
          <div className="wrapper flex items-center justify-between">
            <div className="logo flex gap-5 items-center">
              <img
                src="/assets/petals.png"
                alt="MPOF2025 Petals"
                className="size-10"
              />
              <h1 className="text-xl font-[600] geist">
                MPOF2025 BizMatch Supplier Dashboard
              </h1>
            </div>
            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="logo size-7 rounded-full border-1 border-neutral-200 overflow-hidden">
                  <img src={bizData.supplier.logoSecUrl} alt="" />
                </div>
                <p className="text-sm font-[500]">{bizData.supplier.name}</p>
                <button>
                  <ChevronDown size="16px" strokeWidth="3px" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <section>
        <div className="container w-full max-w-[1300px] px-5 mx-auto">
          <div className="wrapper my-5">
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
                  !isFetching &&
                  fetchingStatus && (
                    <h1 className="mt-5 text-center">No timeslots issued.</h1>
                  )}
                {isFetching && (
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

                <div className="grid grid-cols-3 gap-3 my-5">
                  {bizData.supplier.timeslots &&
                    !isFetching &&
                    fetchingStatus &&
                    bizData.supplier.timeslots.map((d, i) => {
                      return (
                        <>
                          <div
                            onClick={() => router.push(`?timeslot=${d.id}`)}
                            className="bg-white geist rounded-md shadow-sm shadow-neutral-100 overflow-hidden cursor-pointer"
                          >
                            <div className="p-3 bg-neutral-200 text-black">
                              <p className="font-[600]">
                                {moment(d.startT).format("hh:mm A")} -{" "}
                                {moment(d.endT).format("hh:mm A")}
                              </p>
                            </div>
                            <div className="px-3 py-3 ">
                              <div className="flex justify-between items-center">
                                <p className="text-sm font-[500]">Attendees</p>
                                <div className="flex gap-2 items-center text-xs">
                                  <p className="count bg-emerald-600 text-white font-[700] px-3 py-0.5 rounded-full flex items-center gap-2">
                                    <Check size="13px" />{" "}
                                    {
                                      d.registrations.filter(
                                        (d) => d.attended === "attended"
                                      ).length
                                    }
                                  </p>
                                  <p className="count bg-yellow-600 text-white font-[700] px-3 py-0.5 rounded-full flex items-center gap-2">
                                    <User size="13px" />{" "}
                                    {
                                      d.registrations.filter(
                                        (d) => d.attended === "present"
                                      ).length
                                    }
                                  </p>
                                  <p className="count bg-blue-600 text-white font-[700] px-3 py-0.5 rounded-full flex items-center gap-2">
                                    <Users size="13px" />
                                    {
                                      d.registrations.filter(
                                        (d) => d.attended === "registered"
                                      ).length
                                    }
                                  </p>
                                  <p className="count bg-red-600 text-white font-[700] px-3 py-0.5 rounded-full flex items-center gap-2">
                                    <X size="13px" />
                                    {
                                      d.registrations.filter(
                                        (d) => d.attended === "no_show"
                                      ).length
                                    }
                                  </p>
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
                    Your supplier status is:
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

                {!currentTimeslot.fetching.requesting &&
                  currentTimeslot.fetching.status && (
                    <>
                      <div className="mt-2 bg-emerald-700 text-emerald-50 px-7 py-5 rounded-md shadow-sm shadow-neutral-100 sticky top-[90px] z-[10]">
                        <div className="flex justify-between items-center">
                          <h1 className="text-2xl font-[700] flex items-center gap-2">
                            <Clock />{" "}
                            {moment(currentTimeslot.startT).format("hh:mm A")} -{" "}
                            {moment(currentTimeslot.endT).format("hh:mm A")}
                          </h1>
                          <h1 className="text-sm text-emerald-50 font-[700] flex items-center gap-2">
                            {moment(currentTimeslot.endT).format(
                              "MMMM d, yyyy"
                            )}
                          </h1>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm mt-1 font-[600]">
                            {bizData.supplier.name}, {bizData.supplier.location}
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-xs mt-1 font-[500] bg-white text-black px-5 py-1 rounded-full flex items-center gap-2">
                              <Check
                                size="15px"
                                strokeWidth="3"
                                className="text-emerald-700"
                              />
                              {currentTimeslot.complete} completed
                            </p>
                            <p className="text-xs mt-1 font-[500] bg-white text-black px-5 py-1 rounded-full flex items-center gap-2">
                              <Pencil
                                size="15px"
                                strokeWidth="3"
                                className="text-yellow-700"
                              />
                              {currentTimeslot.registered} registered
                            </p>
                            <p className="text-xs mt-1 font-[500] bg-white text-black px-5 py-1 rounded-full flex items-center gap-2">
                              <X
                                size="15px"
                                strokeWidth="3"
                                className="text-red-700"
                              />
                              {currentTimeslot.noShow} didn't show up at all
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-5">
                        <h1 className="font-[600] sticky top-0">Completed</h1>
                        <div className="h-full">
                          {currentTimeslot.filteredRegistrants.complete
                            .length === 0 && (
                            <div className="h-[400px] atendee-table mt-5 rounded-lg overflow-hidden border-1 border-neutral-200 w-full grid place-items-center">
                              <p>No data.</p>
                            </div>
                          )}
                          <AnimatePresence>
                            {currentTimeslot.filteredRegistrants.complete
                              .length !== 0 && (
                              <>
                                <div>
                                  <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    key={1}
                                    className="h-[400px] atendee-table mt-5 rounded-lg overflow-hidden border-1 border-neutral-200 overflow-y-scroll overflow-x-scroll"
                                  >
                                    <table className="table-fixed bg-white font-[500] geist text-xs w-full">
                                      <tr className="sticky top-0">
                                        <th className="w-[200px] p-3 font-[500] bg-neutral-100 whitespace-nowrap text-left">
                                          Organization / E-Mail
                                        </th>
                                        <th className="w-[400px] p-3 font-[500] bg-neutral-100 whitespace-nowrap text-left">
                                          Represented By / Position
                                        </th>

                                        <th className="w-[400px] p-3 font-[500] bg-neutral-100  text-right">
                                          Options
                                        </th>
                                      </tr>

                                      {currentTimeslot.filteredRegistrants.complete.map(
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
                                                <td className="w-[400px] p-3  ">
                                                  <div className="flex justify-center flex-col">
                                                    <p className="truncate">
                                                      {d.bizregistrant.name}
                                                    </p>

                                                    <p className="font-[400] text-neutral-800 truncate flex items-center gap-1">
                                                      {d.bizregistrant.orgP}
                                                    </p>
                                                  </div>
                                                </td>

                                                <td className="w-[400px] p-3 ">
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
                                                      Revert, mark as present
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
                          </AnimatePresence>
                        </div>
                      </div>
                      <div className="">
                        <h1 className="font-[600] mt-2">Registered</h1>
                        <div className="h-full">
                          {currentTimeslot.filteredRegistrants.registered
                            .length === 0 && (
                            <div className="h-[400px] atendee-table mt-5 rounded-lg overflow-hidden border-1 border-neutral-200 w-full grid place-items-center">
                              <p>No data.</p>
                            </div>
                          )}
                          <AnimatePresence>
                            {currentTimeslot.filteredRegistrants.registered
                              .length !== 0 && (
                              <>
                                <div>
                                  <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    key={2}
                                    className="h-[400px] atendee-table mt-5 rounded-lg overflow-hidden border-1 border-neutral-200 overflow-y-scroll overflow-x-scroll"
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

                                      {currentTimeslot.filteredRegistrants.registered.map(
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

                                                <td className="w-[400px] p-3 ">
                                                  <div className="w-full flex justify-end gap-2 ">
                                                    {d.attended ===
                                                      "present" && (
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
                                                          Revert, mark as
                                                          registered
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
                                                          Mark as Complete
                                                        </button>
                                                      </>
                                                    )}

                                                    {d.attended !==
                                                      "present" && (
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
                                                          <X size="15px" /> Mark
                                                          as No-Show
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
                                                          Mark as Present
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
                          </AnimatePresence>
                        </div>
                      </div>
                      <div className="">
                        <h1 className="font-[600] mt-2">No-Shows</h1>
                        <div className="h-full">
                          {currentTimeslot.filteredRegistrants.noShow.length ===
                            0 && (
                            <div className="h-[400px] atendee-table mt-5 rounded-lg overflow-hidden border-1 border-neutral-200 w-full grid place-items-center">
                              <p>No data.</p>
                            </div>
                          )}
                          <AnimatePresence>
                            {currentTimeslot.filteredRegistrants.noShow
                              .length !== 0 && (
                              <>
                                <div>
                                  <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    key={3}
                                    className="h-[400px] atendee-table mt-5 rounded-lg overflow-hidden border-1 border-neutral-200 overflow-y-scroll overflow-x-scroll"
                                  >
                                    <table className="table-fixed bg-white font-[500] geist text-xs w-full">
                                      <tr className="sticky top-0">
                                        <th className="w-[200px] p-3 font-[500] bg-neutral-100 whitespace-nowrap text-left">
                                          Organization / E-Mail
                                        </th>
                                        <th className="w-[400px] p-3 font-[500] bg-neutral-100 whitespace-nowrap text-left">
                                          Represented By / Position
                                        </th>

                                        <th className="w-[400px] p-3 font-[500] bg-neutral-100  text-right">
                                          Options
                                        </th>
                                      </tr>

                                      {currentTimeslot.filteredRegistrants.noShow.map(
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
                                                <td className="w-[400px] p-3  ">
                                                  <div className="flex justify-center flex-col">
                                                    <p className="truncate">
                                                      {d.bizregistrant.name}
                                                    </p>

                                                    <p className="font-[400] text-neutral-800 truncate flex items-center gap-1">
                                                      {d.bizregistrant.orgP}
                                                    </p>
                                                  </div>
                                                </td>

                                                <td className="w-[400px] p-3 ">
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
                                                      Revert, mark as registered
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
                          </AnimatePresence>
                        </div>
                      </div>
                    </>
                  )}

                {currentTimeslot.fetching.requesting && (
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
          </div>
        </div>
      </section>
    </>
  );
}
