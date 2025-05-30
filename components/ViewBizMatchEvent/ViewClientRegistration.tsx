import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectApp } from "@/features/appSlice";
import { fetchAtendees } from "@/functions/getAtendees";
import {
  X,
  Mail,
  Briefcase,
  Phone,
  MapPin,
  User,
  Clock,
  Check,
} from "lucide-react";
import moment from "moment";
import axios from "axios";
import { bizDataSlice } from "@/features/bizmatchEventSlice";
import { countriesKV } from "@/lib/constants/countries";
import { useModal } from "@/components/Modal/ModalContext";
import TimeslotModal from "@/components/Attend-BzEvent/TimeslotModal";
import { CircularProgress } from "@mui/material";
import { Socket } from "socket.io-client";

// Atendee interface from getAtendees.ts
interface Atendee {
  addr: string;
  attended: boolean;
  email: string;
  evId: string;
  name: string;
  orgN: string;
  orgP: string;
  phoneNumber: string;
  public_id_qr: string;
  registeredOn: number;
  salutations: string;
}

export default function ViewClientRegistration({ socket }: { socket: Socket }) {
  const router = useRouter();
  const bzData = useSelector(bizDataSlice);
  const appData = useSelector(selectApp);
  const modal = useModal();
  const [suplAtnData, setSuplAtnData] = useState<any>({});
  const [showTimeslotModal, setShowTimeslotModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [timeslots, setTimeslots] = useState<any[]>([]);
  const { atnId } = router.query;
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const fetchAtnSuplData = async () => {
    try {
      const req = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/fetch-supl-atn`,
        {
          atnId: (atnId as string).trim(),
          bzId: bzData.data.id,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${appData.acsTok}`,
          },
        }
      );
      setSuplAtnData({ ...req.data.data });
      setInitialized(true);
    } catch (e) {
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("WS-EVN_BIZ_SUPPLIER_UPDATE", () => {
      fetchAtnSuplData();
    });
  }, [socket]);

  // Fetch available timeslots for a supplier
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
        `${process.env.NEXT_PUBLIC_API}/fetch-supplier-information-admin`,
        { suplId: supplierId },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${appData.acsTok}`,
          },
        }
      );
      modal.hide();
      setSelectedSupplier({
        id: supplierId,
        name: supplierName,
        country: supplierCountry,
      });
      setTimeslots(req.data.data.timeslots);
      setShowTimeslotModal(true);
    } catch (e) {
      modal.hide();
      modal.show({
        type: "std",
        title: "Error",
        description: "Failed to fetch timeslots. Please try again.",
        confirmText: "OK",
        onConfirm: () => modal.hide(),
        color: "error",
        icon: <X />,
      });
    }
  };

  // Register or move to a timeslot
  const handleTimeslotSelect = async (timeslot: any) => {
    if (!selectedSupplier) return;
    setShowTimeslotModal(false);
    modal.show({
      type: "std",
      title: "Confirm timeslot registration",
      description: `Are you sure you want to register this client at the timeslot ${moment(
        timeslot.startT
      ).format("hh:mm A")} - ${moment(timeslot.endT).format("hh:mm A")} with ${
        selectedSupplier.name
      }?`,
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
            `${process.env.NEXT_PUBLIC_API}/register-to-timeslot-bz-admin`,
            {
              atnId: (atnId as string).trim(),
              tzId: timeslot.id,
              suplId: selectedSupplier.id,
            },
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${appData.acsTok}`,
              },
            }
          );
          modal.hide();
          modal.show({
            type: "std",
            title: "Registration success",
            description: `This client has been registered at ${
              selectedSupplier.name
            }, ${moment(timeslot.startT).format("hh:mm A")} - ${moment(
              timeslot.endT
            ).format("hh:mm A")} slot. Please come on schedule.`,
            onConfirm: () => modal.hide(),
            confirmText: "Exit",
            icon: <Check />,
            color: "success",
          });
          fetchAtnSuplData();
        } catch (e: any) {
          modal.hide();
          modal.show({
            type: "std",
            title: "Failed to register",
            description:
              e?.response?.data?.err ||
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

  // Cancel a registration
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
            `${process.env.NEXT_PUBLIC_API}/cancel-registration-admin`,
            {
              suplId,
              atnId: (atnId as string).trim(),
              bzId: bzData.data.id,
            },
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${appData.acsTok}`,
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
            onConfirm: () => modal.hide(),
            confirmText: "Exit",
          });
          fetchAtnSuplData();
        } catch (e) {
          modal.hide();
          modal.show({
            type: "std",
            title: "Failed to cancel timeslot",
            color: "error",
            confirmText: "Exit",
            onConfirm: () => modal.hide(),
            icon: <X />,
          });
        }
      },
      onCancel: () => modal.hide(),
      icon: <Clock />,
      color: "error",
    });
  };

  useEffect(() => {
    if (!atnId || !bzData.data.id) return;
    if (initialized) return;
    setLoading(true);
    fetchAtnSuplData();
  }, [atnId, bzData]);

  return (
    <div className="w-full inter">
      {loading ? (
        <div className="h-[600px] w-full grid place-content-center">
          <CircularProgress
            size={40}
            thickness={3}
            disableShrink
            sx={{ color: "black" }}
          />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-[500] ">View Attendee</h1>
              <p className="text-neutral-800 font-[500]">
                Manage and view this attendee's interactions
              </p>
            </div>

            <div>
              <h1 className="text-xl font-[400]  text-right">
                {suplAtnData.name}
              </h1>
              <p className="text-neutral-800 font-[500] text-right text-sm ">
                {suplAtnData.orgN}, {suplAtnData.orgP} - {suplAtnData.email}
              </p>
            </div>
          </div>
          <div className="mt-3">
            <div className="rounded-lg overflow-hidden border border-neutral-100 bg-white">
              <table className="min-w-full table-fixed geist text-sm">
                <thead>
                  <tr className="bg-neutral-100">
                    <th className="p-4 font-semibold text-left w-[80px]">
                      Logo
                    </th>
                    <th className="p-4 font-semibold text-left">Name</th>
                    <th className="p-4 font-semibold text-left">Country</th>
                    <th className="p-4 font-semibold text-left">Status</th>
                    <th className="p-4 font-semibold text-left">
                      Timeslot Start
                    </th>
                    <th className="p-4 font-semibold text-left">
                      Timeslot End
                    </th>
                    <th className="p-4 font-semibold text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {suplAtnData.data?.map((d: any, i: number) => (
                    <tr
                      key={d.id || i}
                      className="border-b last:border-b-0 hover:bg-neutral-50 transition border-neutral-100"
                    >
                      <td className="p-4">
                        <div className="rounded-full size-12 overflow-hidden bg-neutral-100 border border-neutral-100">
                          <img
                            src={d.logoSecUrl}
                            alt={d.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="p-4 font-medium text-neutral-900">
                        {d.name}
                      </td>
                      <td className="p-4 text-neutral-700">
                        {countriesKV[d.country] || d.country}
                      </td>
                      <td className="p-4">
                        {d.attendeeStatus?.state === "registered" && (
                          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs">
                            Registered
                          </span>
                        )}
                        {d.attendeeStatus?.state === "" && (
                          <span className="px-3 py-1 rounded-full bg-neutral-200 text-neutral-700 font-semibold text-xs">
                            Not Registered
                          </span>
                        )}
                        {d.attendeeStatus?.state === "attended" && (
                          <span className="px-3 py-1 rounded-full bg-emerald-200 text-emerald-700 font-semibold text-xs">
                            Attended
                          </span>
                        )}
                        {d.attendeeStatus?.state === "no_show" && (
                          <span className="px-3 py-1 rounded-full bg-red-200 text-red-700 font-semibold text-xs">
                            Didn't Show Up
                          </span>
                        )}
                        {d.attendeeStatus?.state === "present" && (
                          <span className="px-3 py-1 rounded-full bg-yellow-200 text-yellow-700 font-semibold text-xs">
                            In a Meeting
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-neutral-700">
                        {d.attendeeStatus?.timeslot_startT ? (
                          moment(d.attendeeStatus.timeslot_startT).format(
                            "hh:mm A"
                          )
                        ) : (
                          <span className="text-neutral-400">-</span>
                        )}
                      </td>
                      <td className="p-4 text-neutral-700">
                        {d.attendeeStatus?.timeslot_endT ? (
                          moment(d.attendeeStatus.timeslot_endT).format(
                            "hh:mm A"
                          )
                        ) : (
                          <span className="text-neutral-400">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        {d.attendeeStatus?.state === "registered" && (
                          <div className="flex gap-2">
                            <button
                              className="px-3 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100 font-semibold text-xs transition"
                              onClick={() => handleCancelTimeslot(d.id)}
                            >
                              Cancel
                            </button>
                            <button
                              className="px-3 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs transition"
                              onClick={() =>
                                fetchTimeslots(d.id, d.name, d.country)
                              }
                            >
                              Move Timeslot
                            </button>
                          </div>
                        )}
                        {d.attendeeStatus?.state === "" && (
                          <button
                            className="px-3 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-xs transition"
                            onClick={() =>
                              fetchTimeslots(d.id, d.name, d.country)
                            }
                          >
                            Register
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {suplAtnData.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="p-8 text-center text-neutral-400"
                      >
                        No attendee data found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <TimeslotModal
            show={showTimeslotModal}
            onClose={() => setShowTimeslotModal(false)}
            supplierName={selectedSupplier?.name || ""}
            supplierCountry={countriesKV[selectedSupplier?.country] || ""}
            timeslots={timeslots}
            offset={bzData.data.offset}
            onSelectTimeslot={handleTimeslotSelect}
          />
        </>
      )}
    </div>
  );
}
