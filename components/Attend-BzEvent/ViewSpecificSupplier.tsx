import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronRight,
  Clock,
  Pointer,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  bizmatchSlice,
  resetSupplier,
  setViewSupplier,
} from "@/features/attendBizmatchSlice";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import moment from "moment";
import { CircularProgress } from "@mui/material";
import MPOF2025Header from "@/components/Attend-BzEvent/MPOF2025Header";
import { useModal } from "@/components/Modal/ModalContext";
import { countriesKV } from "@/lib/constants/countries";

export default function ViewSpecificSupplier() {
  const modal = useModal();
  const router = useRouter();
  const dispatch = useDispatch();
  const bizData = useSelector(bizmatchSlice);

  const { supplier } = router.query;

  const [isFetching, setIsFetching] = useState(true);
  const [success, setSuccess] = useState(false);
  const [selectedTimeslot, setSelectedTimeslot] = useState({
    id: "",
    supplierId: "",
    startT: "",
    endT: "",
  });

  const fetchTimeslots = async () => {
    try {
      setIsFetching(true);
      const req = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/fetch-supplier-information`,
        {
          suplId: supplier,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bizData.user.acsTok}`,
          },
        }
      );

      dispatch(
        setViewSupplier({
          ...bizData.main.viewSupplier,
          data: {
            ...req.data.data,
            timeslots: [...req.data.data.timeslots],
          },
        })
      );

      setIsFetching(false);
      setSuccess(true);
    } catch (e) {
      setIsFetching(false);
      setSuccess(false);
      router.push("/attend-bizmatch");
    }
  };

  const attendTimeslot = () => {
    try {
      modal.show({
        type: "std",
        title: "Confirm timeslot registration",
        description: `Are you sure you want to register at the timeslot ${moment(
          selectedTimeslot.startT
        )
          .utcOffset(bizData.main.offset * -1)
          .format("hh:mm A")} - ${moment(selectedTimeslot.endT)
          .utcOffset(bizData.main.offset * -1)
          .format("hh:mm A")} with ${bizData.main.viewSupplier.data.name}?`,
        color: "success",
        onConfirm: async () => {
          modal.hide();
          modal.show({
            type: "loading",
            title: "Registering...",
            color: "neutral",
          });
          try {
            const req = await axios.post(
              `${process.env.NEXT_PUBLIC_API}/register-to-timeslot-bz`,
              {
                atnId: bizData.user.id,
                tzId: selectedTimeslot.id,
                suplId: selectedTimeslot.supplierId,
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
            fetchTimeslots();
            modal.show({
              type: "std",
              title: "Registration success",
              description: `You have been registered at ${
                bizData.main.viewSupplier.data.name
              }, ${moment(selectedTimeslot.startT)
                .utcOffset(bizData.main.offset * -1)
                .format("hh:mm A")} - ${moment(selectedTimeslot.endT)
                .utcOffset(bizData.main.offset * -1)
                .format("hh:mm A")} slot. Please come on schedule.`,
              onConfirm: () => {
                modal.hide();
              },

              confirmText: "Exit",
              icon: <Check />,
              color: "success",
            });
          } catch (e) {
            modal.hide();
            fetchTimeslots();
            modal.show({
              type: "std",
              title: "Fail to register",
              description: e.response.data.err,
              onConfirm: () => {
                modal.hide();
              },

              confirmText: "Exit",
              icon: <X />,
              color: "error",
            });
          }
        },
        onCancel: () => {
          modal.hide();
        },
        confirmText: "Yes, register me.",
        cancelText: "No, cancel.",
        icon: <Clock />,
      });
    } catch (e) {}
  };

  useEffect(() => {
    if (!supplier) return;
    fetchTimeslots();

    return () => {
      dispatch(resetSupplier());
    };
  }, [supplier]);
  return (
    <>
      <main className="view-supl mx-auto min-h-screen w-full bg-neutral-50">
        <MPOF2025Header />
        <section>
          <div className="container max-w-[1200px] w-full mx-auto">
            <div className="wrapper px-5">
              <div className="breadcrumbs mt-10">
                <button
                  onClick={() => router.push("/attend-bizmatch")}
                  className="bg-white gcb border-1 flex items-center gap-2 border-neutral-100 shadow-sm shadow-neutral-50 rounded-md mb-5 text-xs font-[500] hover:bg-neutral-200 px-5 py-1 "
                >
                  <ArrowLeft size={15} />
                  Go Back
                </button>
                <ul className="flex items-center gap-2 text-xs text-neutral-800">
                  <li>Supplier Directory</li>
                  <li>
                    <ChevronRight strokeWidth={2} size={15} />
                  </li>
                  <li>{bizData.main.viewSupplier.data.name}</li>
                </ul>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-5 geist mt-5 border-1 rounded-lg p-5 border-neutral-100 shadow-sm shadow-neutral-50 bg-white"
              >
                <div className="flex gap-10 items-center">
                  <div className="icon size-15 md:size-[100px] bg-white rounded-full border-1 overflow-hidden border-neutral-100 shadow-sm shadow-neutral-100">
                    <img
                      src={bizData.main.viewSupplier.data.logoSecUrl}
                      alt=""
                    />
                  </div>
                  <div>
                    <h1 className="font-[600] text-lg md:text-3xl">
                      {bizData.main.viewSupplier.data.name}
                    </h1>
                    <p className="text-sm md:text-base">
                      {countriesKV[bizData.main.viewSupplier.data.country]}
                    </p>
                  </div>
                </div>
                <div>
                  <h1 className="text-sm font-[500]">Website</h1>
                  <a
                    className="flex items-center gap-2 text-emerald-800 font-[600] text-sm"
                    href={bizData.main.viewSupplier.data.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ArrowUpRight className="size-5" />{" "}
                    {bizData.main.viewSupplier.data.website}
                  </a>
                </div>
                <div>
                  <h1 className="text-sm font-[500]">Description</h1>
                  <p className="text-sm">
                    {bizData.main.viewSupplier.data.description}
                  </p>
                </div>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5 ">
                <div className="bg-white md:col-span-2  border-1 border-neutral-100 shadow-sm shadow-neutral-50 p-5 rounded-lg overflow-y-scroll max-h-[400px] select-none">
                  {!isFetching && success && (
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {bizData.main.viewSupplier.data.timeslots.length !== 0
                        ? bizData.main.viewSupplier.data.timeslots.map(
                            (d, i) => {
                              return (
                                <li
                                  key={i}
                                  onClick={() => {
                                    d.remainingSlots !== 0 &&
                                      setSelectedTimeslot({
                                        id: d.id,
                                        supplierId: d.supplierId,
                                        startT: d.startT,
                                        endT: d.endT,
                                      });
                                  }}
                                  className={`px-7 py-3 border-1 rounded-lg font-[500] geist border-neutral-100 transition-colors ${
                                    d.remainingSlots === 0
                                      ? "bg-neutral-900 text-white cursor-not-allowed"
                                      : "hover:bg-neutral-50 cursor-pointer"
                                  }  flex justify-between items-center`}
                                >
                                  <p>
                                    {moment(d.startT)
                                      .utcOffset(bizData.main.offset * -1)
                                      .format("hh:mm A")}{" "}
                                    -{" "}
                                    {moment(d.endT)
                                      .utcOffset(bizData.main.offset * -1)
                                      .format("hh:mm A")}
                                  </p>
                                  {d.remainingSlots === 0 ? (
                                    <p className="text-xs bg-red-700 text-red-50 px-5 py-1 font-[700] rounded-full">
                                      FULL
                                    </p>
                                  ) : (
                                    <p className="text-xs bg-emerald-700 text-emerald-50 px-5 py-1 font-[700] rounded-full">
                                      {d.remainingSlots} slot
                                      {d.remainingSlots > 1 && "s"}
                                    </p>
                                  )}
                                </li>
                              );
                            }
                          )
                        : "No timeslots."}
                    </ul>
                  )}

                  {isFetching && (
                    <div className="h-full w-full grid place-content-center">
                      <CircularProgress
                        size={20}
                        thickness={5}
                        disableShrink
                        sx={{
                          color: "b" + "lack", // spinner stroke
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="col-span-1 w-full border-1 border-neutral-100 shadow-sm shadow-neutral-50 rounded-lg bg-white">
                  {!isFetching &&
                    success &&
                    bizData.main.viewSupplier.data.timeslots.length !== 0 &&
                    !selectedTimeslot.id && (
                      <div className="no-slots-selected w-full h-full grid place-content-center">
                        <div className="flex flex-col items-center gap-2 text-neutral-700">
                          <Pointer size={18} />
                          <p className="text-sm font-[500]">
                            Select a timeslot.
                          </p>
                        </div>
                      </div>
                    )}

                  {!isFetching &&
                    success &&
                    bizData.main.viewSupplier.data.timeslots.length !== 0 &&
                    selectedTimeslot.id && (
                      <div className="min-h-[300px] w-full h-full p-5 flex justify-between flex-col">
                        <div>
                          <p className="text-xs font-[500]">
                            Selected timeslot:
                          </p>
                          <h1 className="inter leading-tight font-[700] text-lg">
                            {moment(selectedTimeslot.startT)
                              .utcOffset(bizData.main.offset * -1)
                              .format("hh:mm A")}{" "}
                            -{" "}
                            {moment(selectedTimeslot.endT)
                              .utcOffset(bizData.main.offset * -1)
                              .format("hh:mm A")}{" "}
                            w/ {bizData.main.viewSupplier.data.name}
                          </h1>
                          <div className="mt-2">
                            <p className="text-xs font-[500]">Register as:</p>
                            <p className="font-[600]">{bizData.user.name}</p>

                            <p className="font-[400] text-sm">
                              {bizData.user.orgP}, {bizData.user.orgN}
                            </p>
                            <p className="font-[400] text-sm">
                              {bizData.user.email}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => attendTimeslot()}
                          className="bg-emerald-700 text-emerald-50 px-3 py-1.5 rounded-md font-[600] text-sm hover:bg-emerald-800"
                        >
                          Secure this timeslot now
                        </button>
                      </div>
                    )}
                  {isFetching && (
                    <div className="h-full w-full grid place-content-center">
                      <CircularProgress
                        size={20}
                        thickness={5}
                        disableShrink
                        sx={{
                          color: "black", // spinner stroke
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
