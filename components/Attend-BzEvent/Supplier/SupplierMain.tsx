import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
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
  resetSupplier,
  resetSupplierAccount,
  resetUser,
  setSupplierAccount,
  setSupplierFetchingStatus,
  setSupplierScreenTimeslot,
  setSupplierTimeslots,
  setUserType,
} from "@/features/attendBizmatchSlice";
import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import { useRouter } from "next/router";
import axios from "axios";
import moment from "moment/moment";
import { CircularProgress } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import jwt from "jsonwebtoken";
import SupplierTimesheetDisplay from "@/components/Attend-BzEvent/Supplier/Timesheet";
import TimesheetDetail from "@/components/Attend-BzEvent/Supplier/TimesheetDetail";
import { useClickOutside } from "@/hooks/UseClickOutside";

export default function SupplierMain() {
  const dispatch = useDispatch();
  const router = useRouter();
  const bizData = useSelector(bizmatchSlice);
  const socketRef = useRef<Socket>(null);
  const { timeslot } = router.query;

  const refx = useClickOutside(() => {
    setUserDropdown(false);
  });

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API}/biz-logout`,
        {},
        { withCredentials: true }
      );
      dispatch(resetSupplierAccount());
      router.push("/attend-bizmatch");
    } catch (e) {
      dispatch(resetSupplierAccount());
      router.push("/attend-bizmatch");
    }
  };

  const [userDropdown, setUserDropdown] = useState<boolean>(false);

  const bizData_supplier__static = useRef(null);

  useEffect(() => {
    bizData_supplier__static.current = bizData.supplier;
  }, [bizData]);

  const handleSupplierUpdate = async () => {
    try {
      const req = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/get-supplier-data-biz`,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bizData.supplier.acsTok}`,
          },
        }
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
          open: decode.status.status,
        })
      );
    } catch (err) {
      router.push("/attend-bizmatch");
    }
  };

  const handleTimeslotInitialization = async (ts: string) => {
    try {
      dispatch(
        setSupplierScreenTimeslot({
          ...bizData.supplier.timeslot,
          fetching: {
            requesting: true,
            status: false,
          },
        })
      );
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/fetch-timeslot-information`,
        {
          tsId: ts.trim(),
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bizData.supplier.acsTok}`,
          },
        }
      );

      const { registrations, ...resData } = res.data.data;

      dispatch(
        setSupplierScreenTimeslot({
          ...bizData.supplier.timeslot,
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
            complete: registrations.filter(
              (obj) => obj.attended === "attended"
            ),
          },
        })
      );
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
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bizData.supplier.acsTok}`,
          },
        }
      );

      const { registrations, ...resData } = res.data.data;

      dispatch(
        setSupplierScreenTimeslot({
          ...bizData.supplier.timeslot,
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
            complete: registrations.filter(
              (obj) => obj.attended === "attended"
            ),
          },
        })
      );
    } catch (err) {
      router.push("/attend-bizmatch");
    }
  };

  const fetchTimeslots = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/get-supplier-timeslots`,
        {
          suplId: bizData.supplier.id,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bizData.supplier.acsTok}`,
          },
        }
      );

      dispatch(setSupplierTimeslots([...res.data.data.timeslots]));
    } catch (e) {
      await handleLogout();
      router.push("/attend-bizmatch");
    }
  };

  useEffect(() => {
    if (!timeslot) {
      dispatch(
        setSupplierFetchingStatus({
          requesting: true,
          status: false,
        })
      );
      fetchTimeslots().then((d) => {
        dispatch(
          setSupplierFetchingStatus({
            requesting: false,
            status: true,
          })
        );
      });

      return;
    }
    dispatch(
      setSupplierScreenTimeslot({
        ...bizData.supplier.timeslot,
        id: (timeslot as string).trim(),
      })
    );
    handleTimeslotInitialization(timeslot as string);
  }, [timeslot]);

  useEffect(() => {
    if (!bizData.supplier.id) return;

    const fetchAndConnect = async () => {
      try {
        await fetchTimeslots();
        const socket = io(process.env.NEXT_PUBLIC_IO, {
          withCredentials: true,
        });
        socketRef.current = socket;

        socket.on("connect", () => {
          socket.emit("identify", {
            type: "EVN-BIZ_SUPPLIER",
            bzId: bizData.supplier.bizmatcheventId,
          });
        });

        socket.on("WS-EVN_BIZ_EVENT_UPDATED", () => {
          fetchTimeslots();
        });

        socket.on("WS-EVN_BIZ_SUPPLIER_UPDATED", () => {
          handleSupplierUpdate();
          fetchTimeslots();
        });

        socket.on("WS-EVN_BIZ_CLIENT_REGISTERED_TO_TIMESLOT", () => {
          fetchTimeslots();
        });

        socket.on("WS-EVN_BIZ_SUPPLIER_UPDATED", () => {
          fetchTimeslots();
          handleAttendeeStateChange(
            bizData_supplier__static.current.timeslot.id
          );
        });

        socket.on("connect_error", (err) => {
          console.error("❌ Connection error:", err.message); // usually most helpful
        });

        socket.on("error", (err) => {
          console.error("⚠️ Socket error:", err);
        });

        socket.on("disconnect", (e) => {});
      } catch (err) {
        dispatch(
          setSupplierFetchingStatus({
            requesting: false,
            status: false,
          })
        );

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
      <main className="bg-neutral-50 min-h-screen">
        <header className="sticky top-0 bg-white shadow-sm shadow-neutral-50 z-[9999]">
          <div className="container max-w-[1300px] w-full mx-auto">
            <div className="px-5 wrapper py-3 flex items-center justify-between ">
              <div className="logo flex gap-5 items-center">
                <img
                  src="/assets/petals.png"
                  alt="MPOF2025 Petals"
                  className="size-10"
                />
                <div className="hidden md:block">
                  <h1 className="text-lg font-[600] geist">
                    MPOF2025 BizMatch
                  </h1>
                  <p className="text-xs geist font-[500]">Supplier</p>
                </div>
              </div>
              <div className="relative">
                <p className="geist flex items-center gap-2 text-sm">
                  Logged in as{" "}
                  <span className="font-[500] block max-w-[100px] truncate">
                    {bizData.supplier.name}
                  </span>
                  {!userDropdown ? (
                    <ChevronDown
                      className="size-5 cursor-pointer"
                      strokeWidth="2.5"
                      onClick={() => setUserDropdown(true)}
                    />
                  ) : (
                    <ChevronUp
                      className="size-5 cursor-pointer"
                      strokeWidth="2.5"
                      onClick={() => setUserDropdown(false)}
                    />
                  )}
                </p>
                <AnimatePresence>
                  {userDropdown && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      key={1}
                      style={{ transformOrigin: "top right" }}
                      ref={refx}
                      className="absolute top-[110%] right-0 w-[200px] h-10"
                    >
                      <button
                        onClick={() => handleLogout()}
                        className="bg-white border-1 border-neutral-100 hover:bg-neutral-50 shadow-sm shadow-neutral-50 w-full h-full font-[500] geist text-sm rounded-lg text-left px-5"
                      >
                        Log Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>
        <section className="geist">
          <div className="container w-full max-w-[1300px] px-5 mx-auto">
            <div className="wrapper pt-5">
              {!timeslot && <SupplierTimesheetDisplay />}
              {timeslot && <TimesheetDetail />}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
