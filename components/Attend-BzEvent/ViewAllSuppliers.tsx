import { useEffect, useState } from "react";
import axios from "axios";
import {
  Building,
  Globe,
  SquareArrowOutUpRight,
  Check,
  X,
  Clock,
  Paperclip,
  Calendar,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { CircularProgress, Paper } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  bizmatchSlice,
  setIsFetching,
  setIsSuccess,
  setOffset,
  setSuppliers,
} from "@/features/attendBizmatchSlice";
import MPOF2025Header from "@/components/Attend-BzEvent/MPOF2025Header";
import { useRouter } from "next/router";
import { countriesKV } from "@/lib/constants/countries";
import { useModal } from "@/components/Modal/ModalContext";
import moment from "moment";
import TimeslotModal from "./TimeslotModal";

interface Supplier {
  attendeeStatus: {
    state: string;
    status: string;
    alreadyRegistered: boolean;
    timeslot_startT: string;
    timeslot_endT: string;
  };
  id: string;
  name: string;
  country: string;
  description: string;
  website: string;
  logoSecUrl: string;
  expandDesc?: boolean;
}

interface Timeslot {
  id: string;
  startT: string;
  endT: string;
  remainingSlots: number;
}

interface SupplierData {
  id: string;
  timeslots: Timeslot[];
  name: string;
  country: string;
}

interface ApiError {
  response?: {
    data?: {
      err?: string;
    };
  };
}

export default function ViewAllSuppliers() {
  const router = useRouter();
  const dispatch = useDispatch();
  const bizData = useSelector(bizmatchSlice);
  const modal = useModal();

  const [showTimeslotModal, setShowTimeslotModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierData | null>(
    null
  );

  const fetchTimeslots = async (
    supplierId: string,
    supplierName: string,
    supplierCountry: string
  ) => {
    try {
      modal.show({
        type: "loading",
        title: "Fetching timeslots...",
        color: "neutral",
      });

      const req = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/fetch-supplier-information`,
        {
          suplId: supplierId,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bizData.user.acsTok}`,
          },
        }
      );

      modal.hide();
      setSelectedSupplier({
        ...req.data.data,
        name: supplierName,
        country: supplierCountry,
      });
      setShowTimeslotModal(true);
    } catch (e) {
      modal.hide();
      modal.show({
        type: "std",
        title: "Error",
        description: "Failed to fetch timeslots. Please try again.",
        confirmText: "OK",
        onConfirm: () => {
          modal.hide();
        },
        color: "error",
        icon: <X />,
      });
    }
  };

  const fetchSuppliers = async () => {
    if (!bizData.user.id) return;
    const bzid = process.env.NEXT_PUBLIC_BZID;

    try {
      const d = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/get-biz-suppliers`,
        {
          bzId: bzid,
          atnId: bizData.user.id,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bizData.user.acsTok}`,
          },
        }
      );
      const parseSuppliers_descExpansion = [...d.data.data.suppliers].map(
        (d: Supplier) => {
          return { ...d, expandDesc: false };
        }
      );
      dispatch(setSuppliers(parseSuppliers_descExpansion));
      dispatch(setOffset(d.data.data.offset));
      dispatch(setIsSuccess(true));
    } finally {
      dispatch(setIsFetching(false));
    }
  };

  const handleTimeslotSelect = async (timeslot: Timeslot) => {
    if (!selectedSupplier) return;

    setShowTimeslotModal(false);
    modal.show({
      type: "std",
      title: "Confirm timeslot registration",
      description: `Are you sure you want to register at the timeslot ${moment(
        timeslot.startT
      )
        .utcOffset(bizData.main.offset * -1)
        .format("hh:mm A")} - ${moment(timeslot.endT)
        .utcOffset(bizData.main.offset * -1)
        .format("hh:mm A")} with ${selectedSupplier.name}?`,
      color: "success",
      onConfirm: async () => {
        modal.hide();
        modal.show({
          type: "loading",
          title: "Registering...",
          color: "neutral",
        });
        try {
          await axios.post(
            `${process.env.NEXT_PUBLIC_API}/register-to-timeslot-bz`,
            {
              atnId: bizData.user.id,
              tzId: timeslot.id,
              suplId: selectedSupplier.id,
            },
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${bizData.user.acsTok}`,
              },
            }
          );
          modal.hide();
          modal.show({
            type: "std",
            title: "Registration success",
            description: `You have been registered at ${
              selectedSupplier.name
            }, ${moment(timeslot.startT)
              .utcOffset(bizData.main.offset * -1)
              .format("hh:mm A")} - ${moment(timeslot.endT)
              .utcOffset(bizData.main.offset * -1)
              .format("hh:mm A")} slot. Please come on schedule.`,
            onConfirm: () => {
              modal.hide();
            },
            confirmText: "Exit",
            icon: <Check />,
            color: "success",
          });
          fetchSuppliers();
        } catch (e: unknown) {
          modal.hide();
          modal.show({
            type: "std",
            title: "Failed to register",
            description:
              (e as ApiError).response?.data?.err ||
              "An error occurred while registering for the timeslot.",
            onConfirm: () => {
              modal.hide();
              setShowTimeslotModal(true);
            },
            confirmText: "Try Again",
            icon: <X />,
            color: "error",
          });
        }
      },
      onCancel: () => {
        modal.hide();
        setShowTimeslotModal(true);
      },
      confirmText: "Yes",
      cancelText: "No",
      icon: <Clock />,
    });
  };

  const handleCancelTimeslot = async (suplId: string) => {
    modal.hide();
    modal.show({
      type: "std",
      title: "Cancel timeslot",
      description: "Are you sure you want to cancel your timeslot?",
      confirmText: "Yes",
      cancelText: "No",
      onConfirm: async () => {
        try {
          modal.hide();
          modal.show({
            type: "loading",
            title: "Cancelling...",
            color: "neutral",
          });
          await axios.post(
            `${process.env.NEXT_PUBLIC_API}/cancel-registration`,
            {
              suplId,
              atnId: bizData.user.id,
              bzId: bizData.user.bizmatcheventId,
            },
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${bizData.user.acsTok}`,
              },
            }
          );
          modal.hide();
          modal.show({
            type: "std",
            title: "Timeslot cancelled",
            description: "Your timeslot has been cancelled.",
            color: "success",
            icon: <Check />,
            onConfirm: () => {
              modal.hide();
            },
            confirmText: "Exit",
          });
          fetchSuppliers();
        } catch (e) {
          modal.hide();
          modal.show({
            type: "std",
            title: "Failed to cancel timeslot",
            color: "error",
            confirmText: "Exit",
            onConfirm: () => {
              modal.hide();
            },
            icon: <X />,
          });
        }
      },
      onCancel: () => {
        modal.hide();
      },
      icon: <Clock />,
      color: "error",
    });
  };

  useEffect(() => {
    dispatch(setIsFetching(true));
    fetchSuppliers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bizData.user.id]);

  const [showSchedule, setShowSchedule] = useState(false);

  const [timesheet, setTimesheet] = useState<any[]>([]);
  const [isTimesheetFetching, setIsTimesheetFetching] = useState(true);

  useEffect(() => {
    if (!bizData.user.id || !bizData.user.bizmatcheventId) return;
    if (!showSchedule) return;

    setIsTimesheetFetching(true);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API}/get-client-timesheet`,
        {
          bzId: bizData.user.bizmatcheventId,
          bizClientId: bizData.user.id,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bizData.user.acsTok}`,
          },
        }
      )
      .then((d) => {
        setTimesheet(d.data.data);
        setIsTimesheetFetching(false);
      })
      .catch((e) => {
        setTimesheet([]);
        setIsTimesheetFetching(false);
      });
  }, [bizData.user.id, bizData.user.bizmatcheventId, showSchedule]);

  return (
    <>
      <main className="bg-neutral-50 geist">
        <MPOF2025Header />
        <section className="supplier-directory px-5  mx-auto min-h-screen w-full max-w-[1200px]">
          <section className="supplier-list">
            <AnimatePresence mode="wait">
              {!bizData.main.isFetching && bizData.main.success ? (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="my-5 mt-10 bg-gradient-to-l from-emerald-500 to-emerald-700 text-white px-7 py-5 rounded-lg"
                  >
                    <h1 className="font-[700] text-2xl text-left">
                      Supplier List
                    </h1>
                    <p className="font-[500] text-sm text-left ">
                      Select a supplier below and secure your timeslot.
                    </p>
                    <div className="mt-5">
                      <div className="flex items-center gap-3">
                        <div className="icon bg-neutral-400/40 w-max p-2 rounded-md">
                          <Building size="15px" strokeWidth="3" />
                        </div>
                        <div className="flex justify-between items-center w-full">
                          <p className="font-[500] text-sm">
                            {bizData.main.suppliers.length} supplier
                            {bizData.main.suppliers.length > 1 && "s"}
                          </p>
                          <button
                            onClick={() => setShowSchedule(!showSchedule)}
                            className="text-xs text-white font-[500]"
                          >
                            {showSchedule
                              ? "Hide Appointments"
                              : "Show Appointments"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  {showSchedule && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="my-5 bg-white rounded-lg shadow-sm shadow-neutral-100 p-5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="icon w-max p-2 rounded-md">
                            <Calendar size="15px" strokeWidth="1.2" />
                          </div>
                          <h2 className="font-[600] text-neutral-700">
                            Your Timesheet
                          </h2>
                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-1 gap-3">
                        {isTimesheetFetching ? (
                          <div className="loading-state w-full flex items-center justify-center gap-5">
                            <CircularProgress
                              size={20}
                              thickness={5}
                              disableShrink
                              sx={{
                                color: "black",
                              }}
                            />
                          </div>
                        ) : (
                          timesheet?.map((timeslot, i) => (
                            <div
                              key={i}
                              className={`${
                                timeslot.status === "OPEN"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-neutral-50 text-black"
                              } p-3 rounded-md flex justify-between items-center gap-5`}
                            >
                              <div className=" flex items-center gap-2 text-[11px]   w-1/2">
                                <span>
                                  {moment(timeslot.startT).format("hh:mm A")} -{" "}
                                  {moment(timeslot.endT).format("hh:mm A")}
                                </span>
                              </div>
                              <p className="text-xs font-[600]  text-right truncate w-1/2">
                                {timeslot.status === "OPEN"
                                  ? "OPEN"
                                  : timeslot.supplier.name}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="render-suppliers grid-cols-1 grid geist gap-2"
                  >
                    {bizData.main.suppliers.map((d: Supplier, i: number) => (
                      <motion.div
                        key={i}
                        className="border-1 border-neutral-100 rounded-md overflow-hidden min-h-[200px] flex flex-col bg-white shadow-sm shadow-neutral-100"
                      >
                        {d.attendeeStatus.alreadyRegistered ? (
                          <>
                            {d.attendeeStatus.state === "attended" && (
                              <div className="px-7 py-2 bg-gradient-to-r from-emerald-500 to-emerald-700">
                                <div className="text-white rounded-sm text-xs font-[700]">
                                  ATTENDED -{" "}
                                  {moment(
                                    d.attendeeStatus.timeslot_startT
                                  ).format("hh:mm A")}{" "}
                                  -{" "}
                                  {moment(
                                    d.attendeeStatus.timeslot_endT
                                  ).format("hh:mm A")}
                                </div>
                              </div>
                            )}
                            {d.attendeeStatus.state === "registered" && (
                              <div className="px-7 py-2 bg-gradient-to-r from-blue-500 to-blue-700">
                                <div className="text-white rounded-sm text-xs font-[700]">
                                  REGISTERED -{" "}
                                  {moment(
                                    d.attendeeStatus.timeslot_startT
                                  ).format("hh:mm A")}{" "}
                                  -{" "}
                                  {moment(
                                    d.attendeeStatus.timeslot_endT
                                  ).format("hh:mm A")}
                                </div>
                              </div>
                            )}
                            {d.attendeeStatus.state === "no_show" && (
                              <div className="px-7 py-2 bg-gradient-to-r from-red-500 to-red-700">
                                <div className="text-white rounded-sm text-xs font-[700]">
                                  DID NOT SHOW UP -{" "}
                                  {moment(
                                    d.attendeeStatus.timeslot_startT
                                  ).format("hh:mm A")}{" "}
                                  -{" "}
                                  {moment(
                                    d.attendeeStatus.timeslot_endT
                                  ).format("hh:mm A")}
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="px-7 py-2 bg-gradient-to-r from-slate-500 to-slate-700">
                            <div className="text-neutral-100 rounded-sm text-xs font-[700]">
                              NOT REGISTERED
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-5 border-b-1 border-neutral-100 px-7 py-3 bg-neutral-50">
                          <div className="icon shrink-0 size-10 rounded-full border-1 overflow-hidden border-neutral-200">
                            <img src={d.logoSecUrl} alt="" />
                          </div>
                          <div>
                            <h1 className="text-sm font-[600] truncate">
                              {d.name}
                            </h1>
                            <p className="text-xs">{countriesKV[d.country]}</p>
                          </div>
                        </div>
                        <div className="px-7 py-3 flex gap-3 flex-col justify-between flex-1">
                          <div>
                            <div className="description">
                              <h1 className="text-xs font-[500]">
                                Description
                              </h1>
                              <p className="text-sm">
                                {d.description.length >= 120
                                  ? d.expandDesc
                                    ? d.description
                                    : d.description.slice(0, 120) + "..."
                                  : d.description}
                              </p>
                              {d.description.length >= 120 && (
                                <button
                                  onClick={() => {
                                    let shwl = [...bizData.main.suppliers];

                                    shwl[i] = {
                                      ...shwl[i],
                                      expandDesc: !shwl[i].expandDesc,
                                    };
                                    dispatch(setSuppliers(shwl));
                                  }}
                                  className="text-xs text-emerald-700 font-[500]"
                                >
                                  {d.expandDesc ? "Read Less" : "Read More"}
                                </button>
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="flex gap-1">
                              {d.attendeeStatus.state === "attended" ? (
                                <></>
                              ) : (
                                <>
                                  {" "}
                                  <button
                                    onClick={() => {
                                      fetchTimeslots(d.id, d.name, d.country);
                                    }}
                                    className={`text-white px-5 flex-1 font-[700] py-1.5 text-sm rounded-md ${
                                      d.attendeeStatus.state === "registered"
                                        ? "bg-blue-600 hover:bg-blue-700"
                                        : "bg-emerald-700 hover:bg-emerald-800"
                                    }`}
                                  >
                                    {d.attendeeStatus.state === "registered"
                                      ? "Change"
                                      : "Select Supplier"}
                                  </button>
                                  {d.attendeeStatus.state === "registered" && (
                                    <button
                                      onClick={() => {
                                        handleCancelTimeslot(d.id);
                                      }}
                                      className={`text-white px-5 flex-1 font-[700] py-1.5 text-sm rounded-md bg-red-700 hover:bg-red-800`}
                                    >
                                      Cancel
                                    </button>
                                  )}
                                  <a
                                    href={d.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <button className="bg-white border-1 h-full border-neutral-200 hover:bg-neutral-50 px-5 flex-0 rounded-md">
                                      <Globe size="18px" />
                                    </button>
                                  </a>
                                </>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs mt-2 text-neutral-700 font-[500]">
                              <SquareArrowOutUpRight size="13px" /> {d.website}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </>
              ) : (
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
                      color: "black",
                    }}
                  />
                  Getting suppliers...
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </section>
      </main>

      <AnimatePresence>
        {showTimeslotModal && selectedSupplier && (
          <TimeslotModal
            show={showTimeslotModal}
            onClose={() => setShowTimeslotModal(false)}
            supplierName={selectedSupplier.name}
            supplierCountry={countriesKV[selectedSupplier.country]}
            timeslots={selectedSupplier.timeslots}
            offset={bizData.main.offset}
            onSelectTimeslot={(timeslot) =>
              handleTimeslotSelect(timeslot as Timeslot)
            }
          />
        )}
      </AnimatePresence>
    </>
  );
}
