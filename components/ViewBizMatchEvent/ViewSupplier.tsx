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
  ChevronDown,
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

export default function ViewSupplier({ socket }: { socket: Socket }) {
  const router = useRouter();
  const bzData = useSelector(bizDataSlice);
  const appData = useSelector(selectApp);
  const modal = useModal();
  const [supplierData, setSupplierData] = useState<any>({});
  const { suplId } = router.query;
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const fetchSupplierFull = async () => {
    try {
      const req = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/fetch-supplier-full`,
        {
          suplId: (suplId as string).trim(),
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${appData.acsTok}`,
          },
        }
      );
      setSupplierData(req.data.data);
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
      fetchSupplierFull();
    });
  }, [socket]);

  useEffect(() => {
    if (!suplId || !bzData.data.id) return;
    if (initialized) return;
    setLoading(true);
    fetchSupplierFull();
  }, [suplId, bzData]);

  // Enum mapping for display
  const attendedLabels: Record<string, string> = {
    attended: "Attended",
    present: "Present",
    registered: "Registered",
    no_show: "No Show",
  };
  const attendedOrder = ["attended", "present", "registered", "no_show"];

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
              <h1 className="text-2xl font-[500] ">View Supplier</h1>
              <p className="text-neutral-800 font-[500]">
                View the timesheet of this supplier
              </p>
            </div>

            <div>
              <h1 className="text-xl font-[400]  text-right">
                {supplierData.name}
              </h1>
              <p className="text-neutral-800 font-[500] text-right text-sm ">
                {countriesKV[supplierData.country]} - {supplierData.website}
              </p>
            </div>
          </div>
          <div className="mt-3">
            <div className="rounded-lg overflow-hidden border border-neutral-100 bg-white">
              <table className="min-w-full table-fixed geist text-sm">
                <thead>
                  <tr className="bg-neutral-100">
                    <th className="p-4 font-semibold text-center w-[150px]">
                      Status
                    </th>
                    <th className="p-4 font-semibold text-left w-[150px]">
                      Start Time
                    </th>
                    <th className="p-4 font-semibold text-left">End Time</th>

                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {supplierData.timeslots?.map((d: any, i: number) => (
                    <>
                      <tr
                        key={d.id || i}
                        className="border-b last:border-b-0 hover:bg-neutral-50 transition border-neutral-100"
                      >
                        <td className="p-4 text-center">
                          {(() => {
                            const regs = d.registrations || [];
                            const attendedCount = regs.filter(
                              (r: any) => r.attended === "attended"
                            ).length;
                            const presentCount = regs.filter(
                              (r: any) => r.attended === "present"
                            ).length;
                            const registeredCount = regs.filter(
                              (r: any) => r.attended === "registered"
                            ).length;
                            const noShowCount = regs.filter(
                              (r: any) => r.attended === "no_show"
                            ).length;
                            return (
                              <div className="flex gap-2 justify-center items-center">
                                <span className="w-7 h-7 flex items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold">
                                  {attendedCount}
                                </span>
                                <span className="w-7 h-7 flex items-center justify-center rounded-full bg-purple-500 text-white text-xs font-bold">
                                  {presentCount}
                                </span>
                                <span className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-500 text-white text-xs font-bold">
                                  {registeredCount}
                                </span>
                                <span className="w-7 h-7 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                                  {noShowCount}
                                </span>
                              </div>
                            );
                          })()}
                        </td>
                        <td className="p-4">
                          {moment(d.startT).format("hh:mm A")}
                        </td>
                        <td className="p-4 font-medium text-neutral-900">
                          {moment(d.endT).format("hh:mm A")}
                        </td>

                        <td className="p-4 text-neutral-700 ">
                          <div className="w-full flex justify-end items-center">
                            <div
                              className="flex items-center gap-2 cursor-pointer"
                              onClick={() => {
                                setExpandedIndex(
                                  expandedIndex === i ? null : i
                                );
                              }}
                            >
                              See Registrations{" "}
                              <ChevronDown
                                className={
                                  expandedIndex === i
                                    ? "rotate-180 transition-transform"
                                    : "transition-transform"
                                }
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                      {expandedIndex === i && (
                        <tr>
                          <td colSpan={4} className="bg-neutral-50 p-4">
                            <div>
                              <h3 className="font-semibold mb-2">
                                Registrations
                              </h3>
                              {(() => {
                                const regs = d.registrations || [];

                                if (regs.length === 0) {
                                  return (
                                    <div className="text-neutral-400">
                                      No registrations found.
                                    </div>
                                  );
                                }
                                return attendedOrder.map((status) => {
                                  const group = regs.filter(
                                    (r: any) => r.attended === status
                                  );
                                  if (group.length === 0) return null;
                                  return (
                                    <div key={status} className="mb-3">
                                      <div className="font-semibold mb-1">
                                        {attendedLabels[status]}
                                      </div>
                                      <ul className="">
                                        {group.map((reg: any, idx: number) => (
                                          <li key={idx} className="mb-1">
                                            <span className="font-medium">
                                              {reg.bizregistrant.name}
                                            </span>{" "}
                                            /{" "}
                                            <span className="text-neutral-600">
                                              {reg.bizregistrant.orgN} -{" "}
                                            </span>
                                            <span className="text-neutral-600">
                                              {reg.bizregistrant.orgP}
                                            </span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  );
                                });
                              })()}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                  {supplierData.timeslots?.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="p-8 text-center text-neutral-400"
                      >
                        No supplier data found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
