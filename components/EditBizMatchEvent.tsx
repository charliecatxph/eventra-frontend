import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Trash,
  Calendar,
  Boxes,
  Repeat,
  Pencil,
  Info,
  AlertTriangle,
  Check,
  Router,
  Clock,
} from "lucide-react";
import TextInput from "./Inputs/TextInput";
import DateInput from "./Inputs/DateInput";
import TimeInput from "./Inputs/TimeInput";
import CountrySelect from "./Inputs/CountrySelect";
import { countriesKV } from "@/lib/constants/countries";
import { AnimatePresence, motion } from "framer-motion";
import CropperModal from "./ViewBizMatchEvent/CropperModal";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectApp } from "@/features/appSlice";
import { useModal } from "@/components/Modal/ModalContext";
import moment from "moment";
import { bizDataSlice } from "@/features/bizmatchEventSlice";
import { TimeslotPopup } from "./Appointment/Timesheets";
import { CircularProgress } from "@mui/material";

export interface Supplier {
  id: string;
  logoSecUrl: string;
  name: string;
  country: string;
  website: string;
  description: string;
  accessCode: string;
  status: { status: string };
  location: string;
  timeslots: any[];
  attendedPercentage?: number;
  bookedPercentage?: number;
  noShowPercentage?: number;
  presentPercentage?: number;
  registeredPercentage?: number;
}

export interface BizMatchEvent {
  id: string;
  date: string;
  endT: string;
  lim: number;
  name: string;
  offset: number;
  orgId: string;
  location: string;
  startT: string;
  suppliersCount: number;
  timeslotsCount: number;
  upl_on: string;
  clients?: any;
  stats?: any;
  suppliers?: any;
}

interface SupplierChanges {
  added: Supplier[];
  updated: Supplier[];
  deleted: Supplier[];
  all: Supplier[];
}

interface EditBizMatchEventProps {
  eventData: BizMatchEvent;
  suppliers: Supplier[];
  onCancel: () => void;
  onSave: (event: BizMatchEvent, changes: SupplierChanges) => void;
}

const validateEvent = (event: BizMatchEvent, suppliers: Supplier[]) => {
  const errors: { [key: string]: string } = {};

  if (!event.name.trim()) {
    errors.name = "Event name is required";
  }

  if (!event.location.trim()) {
    errors.location = "Location is required";
  }

  const startTime = Number(event.startT);
  const endTime = Number(event.endT);
  const eventDate = Number(event.date);

  if (isNaN(startTime) || isNaN(endTime) || isNaN(eventDate)) {
    errors.date = "Invalid date or time format";
  } else {
    const startDate = new Date(startTime * 1000);
    const endDate = new Date(endTime * 1000);
    const eventDateTime = new Date(eventDate * 1000);

    if (endDate <= startDate) {
      errors.endT = "End time must be after start time";
    }

    const now = new Date();
    if (eventDateTime < now) {
      errors.date = "Event date cannot be in the past";
    }
  }

  suppliers.forEach((supplier, index) => {
    if (!supplier.name.trim()) {
      errors[`supplier_${index}_name`] = "Supplier name is required";
    }

    if (!supplier.website.trim()) {
      errors[`supplier_${index}_website`] = "Supplier website is required";
    }
    if (!supplier.country) {
      errors[`supplier_${index}_country`] = "Supplier country is required";
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export type Timeslot = {
  id?: string;
  startT: number;
  endT: number;
  lim: number;
  origin?: "FETCH" | "ADD" | "EDIT";
  status?: string;
};

export default function EditBizMatchEvent({
  eventData,
  suppliers: initialSuppliers,
  onCancel,
  onSave,
}: EditBizMatchEventProps) {
  const appData = useSelector(selectApp);
  const [event, setEvent] = useState<BizMatchEvent>({
    ...eventData,
    date: eventData.date.toString(),
    startT: eventData.startT.toString(),
    endT: eventData.endT.toString(),
  });
  const [suppliers, setSuppliers] = useState<Supplier[]>([...initialSuppliers]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const bzData = useSelector(bizDataSlice);

  const [addSupplier, setAddSupplier] = useState<{
    active: boolean;
    name: { value: string; err: string };
    location: { value: string; err: string };
    website: { value: string; err: string };
    country: string;
    accessCode: { value: string; err: string };
    logo: { value: string; file: File | null; err: string };
    status: string;
    description: { value: string; err: string };
  }>({
    active: false,
    name: { value: "", err: "" },
    location: { value: "", err: "" },
    website: { value: "", err: "" },
    country: "PH",
    accessCode: { value: "", err: "" },
    logo: { value: "", file: null, err: "" },
    status: "open",
    description: { value: "", err: "" },
  });

  const [editSupplier, setEditSupplier] = useState<{
    active: boolean;
    supplier: Supplier | null;
    name: { value: string; err: string };
    location: { value: string; err: string };
    website: { value: string; err: string };
    country: string;
    accessCode: { value: string; err: string };
    logo: { value: string; file: File | null; err: string };
    status: string;
    description: { value: string; err: string };
  }>({
    active: false,
    supplier: null,
    name: { value: "", err: "" },
    location: { value: "", err: "" },
    website: { value: "", err: "" },
    country: "PH",
    accessCode: { value: "", err: "" },
    logo: { value: "", file: null, err: "" },
    status: "open",
    description: { value: "", err: "" },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState("");
  const [timeslots, setTimeslots] = useState<Timeslot[]>([]);

  const validateSupplier = (supplier: typeof addSupplier) => {
    const errors: { [key: string]: string } = {};

    if (!supplier.name.value.trim()) {
      errors.name = "Supplier name is required";
    }
    if (!supplier.location.value.trim()) {
      errors.location = "Location is required";
    }
    if (!supplier.website.value.trim()) {
      errors.website = "Website is required";
    }
    if (!supplier.country) {
      errors.country = "Country is required";
    }
    if (!supplier.logo.file && !supplier.logo.value) {
      errors.logo = "Logo is required";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  const handleAddSupplier = () => {
    const validation = validateSupplier(addSupplier);

    if (validation.isValid) {
      const newSupplier: Supplier = {
        id: Math.random().toString(36).substr(2, 9),
        logoSecUrl: addSupplier.logo.file
          ? URL.createObjectURL(addSupplier.logo.file)
          : addSupplier.logo.value,
        name: addSupplier.name.value,
        country: addSupplier.country,
        website: addSupplier.website.value,
        description: addSupplier.description.value,
        accessCode: addSupplier.accessCode.value,
        status: { status: addSupplier.status },
        location: addSupplier.location.value,
        timeslots: [],
      };
      setSuppliers((prev) => [...prev, newSupplier]);
      setAddSupplier({
        active: false,
        name: { value: "", err: "" },
        location: { value: "", err: "" },
        website: { value: "", err: "" },
        country: "PH",
        accessCode: { value: "", err: "" },
        logo: { value: "", file: null, err: "" },
        status: "open",
        description: { value: "", err: "" },
      });
    } else {
      setAddSupplier((prev) => ({
        ...prev,
        name: { ...prev.name, err: validation.errors.name || "" },
        location: { ...prev.location, err: validation.errors.location || "" },
        website: { ...prev.website, err: validation.errors.website || "" },
        logo: { ...prev.logo, err: validation.errors.logo || "" },
      }));
    }
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditSupplier({
      active: true,
      supplier,
      name: { value: supplier.name, err: "" },
      location: { value: supplier.location, err: "" },
      website: { value: supplier.website, err: "" },
      country: supplier.country,
      accessCode: { value: supplier.accessCode, err: "" },
      logo: { value: supplier.logoSecUrl, file: null, err: "" },
      status: supplier.status.status,
      description: { value: supplier.description, err: "" },
    });
  };

  const handleUpdateSupplier = () => {
    const validation = validateSupplier(editSupplier);

    if (validation.isValid && editSupplier.supplier) {
      const updatedSupplier: Supplier = {
        ...editSupplier.supplier,
        logoSecUrl: editSupplier.logo.file
          ? URL.createObjectURL(editSupplier.logo.file)
          : editSupplier.logo.value,
        name: editSupplier.name.value,
        country: editSupplier.country,
        website: editSupplier.website.value,
        description: editSupplier.description.value,
        accessCode: editSupplier.accessCode.value,
        status: { status: editSupplier.status },
        location: editSupplier.location.value,
        timeslots: editSupplier.supplier.timeslots,
      };
      if (editSupplier.logo.file) {
        const updatedSuppliers = suppliers.map((s) =>
          s.id === updatedSupplier.id ? updatedSupplier : s
        );
        setSuppliers(updatedSuppliers);
      } else {
        setSuppliers((prev) =>
          prev.map((s) => (s.id === updatedSupplier.id ? updatedSupplier : s))
        );
      }
      setEditSupplier({
        active: false,
        supplier: null,
        name: { value: "", err: "" },
        location: { value: "", err: "" },
        website: { value: "", err: "" },
        country: "PH",
        accessCode: { value: "", err: "" },
        logo: { value: "", file: null, err: "" },
        status: "open",
        description: { value: "", err: "" },
      });
    } else {
      setEditSupplier((prev) => ({
        ...prev,
        name: { ...prev.name, err: validation.errors.name || "" },
        location: { ...prev.location, err: validation.errors.location || "" },
        website: { ...prev.website, err: validation.errors.website || "" },
        logo: { ...prev.logo, err: validation.errors.logo || "" },
      }));
    }
  };

  const handleSave = async () => {
    const validation = validateEvent(event, suppliers);
    setErrors(validation.errors);

    if (validation.isValid) {
      const supplierChanges: SupplierChanges = {
        added: suppliers.filter(
          (s) => !initialSuppliers.find((is) => is.id === s.id)
        ),
        updated: suppliers.filter((s) => {
          const initial = initialSuppliers.find((is) => is.id === s.id);
          if (!initial) return false;
          return JSON.stringify(initial) !== JSON.stringify(s);
        }),
        deleted: initialSuppliers.filter(
          (is) => !suppliers.find((s) => s.id === is.id)
        ),
        all: suppliers,
      };

      modal.show({
        type: "std",
        icon: <AlertTriangle />,
        title: "Confirm Changes",
        description: "Are you sure you want to update this event?",
        confirmText: "Yes, Update Event",
        cancelText: "Cancel",
        onConfirm: () => {
          modal.hide();

          const formData = new FormData();

          const {
            clients,
            stats,
            suppliers: eventSuppliers,
            ...cleanedEvent
          } = event;

          formData.append("event", JSON.stringify(cleanedEvent));
          formData.append("timeslots", JSON.stringify(timeslots));

          const cleanSupplierData = (supplier: Supplier) => {
            const {
              attendedPercentage,
              bookedPercentage,
              noShowPercentage,
              presentPercentage,
              registeredPercentage,

              timeslots,
              ...cleanSupplier
            } = supplier;
            return {
              ...cleanSupplier,
              logoSecUrl: supplier.logoSecUrl.startsWith("blob:")
                ? null
                : supplier.logoSecUrl,
            };
          };

          const addedSuppliersData =
            supplierChanges.added.map(cleanSupplierData);
          formData.append(
            "added_suppliers",
            JSON.stringify(addedSuppliersData)
          );

          const updatedSuppliersData =
            supplierChanges.updated.map(cleanSupplierData);
          formData.append(
            "updated_suppliers",
            JSON.stringify(updatedSuppliersData)
          );

          const allLogoChanges = [
            ...supplierChanges.added,
            ...supplierChanges.updated,
          ];

          const processLogos = async () => {
            const logoPromises = allLogoChanges
              .filter((supplier) => supplier.logoSecUrl.startsWith("blob:"))
              .map((supplier) =>
                fetch(supplier.logoSecUrl)
                  .then((res) => res.blob())
                  .then((blob) => {
                    const file = new File([blob], "logo.png", {
                      type: "image/png",
                    });
                    formData.append(`logo`, file);
                    formData.append("meta[]", supplier.id);
                  })
              );

            await Promise.all(logoPromises);
          };

          const deleteSuppliersData =
            supplierChanges.deleted.map(cleanSupplierData);
          formData.append(
            "deleted_suppliers",
            JSON.stringify(deleteSuppliersData)
          );

          processLogos().then(() => {
            modal.show({
              type: "loading",
              title: "Updating event...",
              description: "Please wait while we update your BizMatch event...",
              color: "success",
            });

            axios
              .post(
                `${process.env.NEXT_PUBLIC_API}/update-biz-event`,
                formData,
                {
                  headers: {
                    Authorization: `Bearer ${appData.acsTok}`,
                    "Content-Type": "multipart/form-data",
                  },
                  withCredentials: true,
                }
              )
              .then((d) => {
                modal.hide();
                modal.show({
                  type: "std",
                  icon: <Check />,
                  title: "Event Updated",
                  description: "BizMatch event has been updated successfully.",
                  confirmText: "OK",
                  onConfirm: () => {
                    modal.hide();
                    onCancel();
                  },
                  color: "success",
                });
              })
              .catch((e) => {
                modal.hide();
                modal.show({
                  type: "std",
                  icon: <X />,
                  title: "Error",
                  description:
                    e.response?.data?.err ||
                    "An error occurred while updating the event",
                  confirmText: "Try Again",
                  onConfirm: () => modal.hide(),
                  color: "error",
                });
              });
          });
        },
        onCancel: () => modal.hide(),
        color: "success",
      });
    }
  };

  const [showTimeslotPopup, setShowTimeslotPopup] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editInitial, setEditInitial] = useState<
    | {
        start: string;
        end: string;
        limit: number;
      }
    | undefined
  >(undefined);

  const getUnix = (date: string, time: string): number => {
    const [year, month, day] = date.split("-");
    const [hours, minutes] = time.split(":");
    const datetime = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hours),
      Number(minutes)
    );
    return Math.floor(datetime.getTime() / 1000);
  };

  const handleEditTimeslot = (idx: number) => {
    const slot = timeslots[idx];
    setEditIdx(idx);
    setEditInitial({
      start: moment.unix(slot.startT).format("HH:mm"),
      end: moment.unix(slot.endT).format("HH:mm"),
      limit: slot.lim,
    });
    setShowTimeslotPopup(true);
  };

  const handleCreateOrEditTimeslot = (data: {
    start: string;
    end: string;
    limit: number;
  }): boolean => {
    if (!bzData.data.date) return false;
    const startT = getUnix(
      moment.unix(bzData.data.date).format("YYYY-MM-DD"),
      data.start
    );
    const endT = getUnix(
      moment.unix(bzData.data.date).format("YYYY-MM-DD"),
      data.end
    );

    if (startT >= endT) {
      modal.show({
        type: "std",
        title: "Invalid Timeslot",
        description: "Start time must be before end time.",
        color: "error",
        icon: <X />,
        confirmText: "OK",
        onConfirm: () => {
          modal.hide();
        },
      });
      return false;
    }
    // Conflict check (ignore self if editing)
    const hasConflict = timeslots.some((slot, idx) => {
      if (slot.status === "DELETE") return false;
      if (editIdx !== null && idx === editIdx) return false;
      return startT < slot.endT && endT > slot.startT;
    });
    if (hasConflict) {
      modal.show({
        type: "std",
        title: "Timeslot Conflict",
        description: "This timeslot conflicts with another timeslot.",
        color: "error",
        icon: <X />,
        confirmText: "OK",
        onConfirm: () => {
          modal.hide();
        },
      });
      return false;
    }
    if (editIdx !== null) {
      // Confirm edit
      modal.show({
        type: "std",
        title: "Edit Timeslot",
        description: "Are you sure you want to save these changes?",
        color: "primary",
        icon: <Clock />,
        confirmText: "Save",
        cancelText: "Cancel",
        onConfirm: () => {
          setTimeslots((pv: Timeslot[]) =>
            pv.map((slot, idx) =>
              idx === editIdx
                ? {
                    ...slot,
                    startT: startT,
                    endT: endT,
                    lim: data.limit,
                    status: slot.origin === "ADD" ? "" : "EDIT",
                  }
                : slot
            )
          );
          setEditIdx(null);
          setEditInitial(undefined);
          setShowTimeslotPopup(false);
          modal.hide();
        },
        onCancel: () => {
          modal.hide();
        },
      });
      return false; // Wait for modal confirm
    } else {
      setTimeslots((pv: Timeslot[]) => [
        ...pv,
        {
          startT: startT,
          endT: endT,
          lim: data.limit,
          origin: "ADD",
        },
      ]);
      return true;
    }
  };

  const modal = useModal();

  const [timeslotFetchStatus, setTimeslotFetchStatus] = useState({
    fetching: true,
    success: false,
  });

  const fetchBaseTimeslots = async () => {
    try {
      const req = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/fetch-base-timeslots`,
        {
          bzId: bzData.data.id,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${appData.acsTok}`,
            "Content-Type": "application/json",
          },
        }
      );

      req.data.data.forEach((timeslot: any) => {
        setTimeslots((pv: Timeslot[]) => [
          ...pv,
          {
            id: timeslot.id,
            startT: Math.floor(new Date(timeslot.startT).getTime() / 1000),
            endT: Math.floor(new Date(timeslot.endT).getTime() / 1000),
            origin: "FETCH",
            lim: timeslot.remainingSlots,
          },
        ]);
      });

      setTimeslotFetchStatus((pv) => ({
        ...pv,
        success: true,
      }));
    } catch (e) {
      setTimeslotFetchStatus((pv) => ({
        ...pv,
        success: false,
      }));
      onCancel();
    } finally {
      setTimeslotFetchStatus((pv) => ({
        ...pv,
        fetching: false,
      }));
    }
  };

  useEffect(() => {
    if (!bzData.data.id) return;
    if (timeslotFetchStatus.success) return;
    fetchBaseTimeslots();
  }, [bzData.data.id]);
  const handleDeleteTimeslot = (i: number) => {
    const timeslot = timeslots[i];

    const shwl: Timeslot[] = [...timeslots];
    if (timeslot.origin === "FETCH") {
      modal.show({
        type: "std",
        title: "Delete Timeslot",
        description:
          "This timeslot may not be empty. Deleting will delete all timeslot registrants in this speciifc timeslot after saving.",
        color: "error",
        icon: <X />,
        confirmText: "Delete",
        cancelText: "Cancel",
        onConfirm: () => {
          shwl[i] = {
            ...timeslot,
            status: "DELETE",
          };
          setTimeslots(shwl);
          modal.hide();
        },
        onCancel: () => modal.hide(),
      });
    } else {
      shwl.splice(i, 1);
      setTimeslots(shwl);
    }
  };

  return (
    <>
      <div className="w-full inter">
        <div>
          <h1 className="text-2xl font-[400] ">Edit Event</h1>
          <p className="text-neutral-800 font-[500]">
            Update your event details and manage suppliers
          </p>
        </div>
        <div className="flex gap-1">
          <div className="bg-white p-5 rounded-lg mt-3 flex-1 h-fit">
            <header className="flex items-center gap-2">
              <Calendar className="text-emerald-700" />
              <h1 className="font-[500] text-lg">Event Information</h1>
            </header>
            <section className="mt-2 flex gap-2 flex-col">
              <TextInput
                identifier={"name"}
                title={"B2B Name"}
                value={event.name}
                onInput={(v: string) => {
                  setEvent((prev) => ({
                    ...prev,
                    name: v,
                  }));
                }}
                error={errors.name || ""}
              />
              <TextInput
                identifier={"location"}
                title={"B2B Location"}
                value={event.location}
                onInput={(v: string) => {
                  setEvent((prev) => ({
                    ...prev,
                    location: v,
                  }));
                }}
                error={errors.location || ""}
              />

              <div className="bg-blue-50 text-blue-600 mt-1 px-4 py-2 rounded-md font-[500] text-xs flex gap-4 items-start">
                <Info size={16} className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-[600] mb-1">A quick note on timeslots</p>
                  <p>
                    Deleting a timeslot will delete all the timeslot registrants
                    in the timeslot you are trying to delete. However, this will
                    not remove them in the event and they will remain as a
                    "client" of the event. Subsequently, adding a timeslot will
                    not modify the previous timeslots, it will only append slots
                    to all the suppliers.
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex justify-between items-center">
                  <h1 className="font-[500]">Timeslots</h1>
                  <button
                    onClick={() => setShowTimeslotPopup(true)}
                    className="text-sm px-6 py-1 bg-emerald-600 text-white rounded-md font-[500] hover:bg-emerald-700"
                  >
                    Create Timeslot
                  </button>
                </div>
                {timeslotFetchStatus.fetching ? (
                  <div className="flex justify-center items-center py-8">
                    <CircularProgress
                      size={40}
                      thickness={3}
                      disableShrink
                      sx={{ color: "black" }}
                    />
                  </div>
                ) : timeslots.length === 0 ? (
                  <div className="text-center text-neutral-400 py-6 text-sm">
                    <span>No timeslots for this event.</span>
                  </div>
                ) : (
                  <ul className="flex flex-col gap-2 mt-2">
                    {timeslots
                      .sort((a: Timeslot, b: Timeslot) => a.startT - b.startT)
                      .map((slot: Timeslot, idx: number) => (
                        <>
                          {slot.status !== "DELETE" && (
                            <li
                              key={idx}
                              className=" bg-white rounded-md px-7 py-3 border border-neutral-50 shadow-sm shadow-neutral-50"
                            >
                              <div className="flex justify-between items-cent">
                                {slot.origin === "FETCH" && (
                                  <div className="bg-emerald-700 text-emerald-50 rounded-md px-5 py-1 w-max text-xs font-[500]">
                                    From Past Changes
                                  </div>
                                )}
                                {slot.origin === "ADD" && (
                                  <div className="bg-blue-700 text-blue-50 rounded-md px-5 py-1 w-max text-xs font-[500]">
                                    Added by the user
                                  </div>
                                )}
                                {slot.status === "EDIT" && (
                                  <div className="bg-purple-700 text-purple-50 rounded-md px-5 py-1 w-max text-xs font-[500]">
                                    Edited by the user
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <div className="flex flex-col">
                                  <span className="font-medium text-neutral-800">
                                    {moment.unix(slot.startT).format("hh:mm A")}{" "}
                                    - {moment.unix(slot.endT).format("hh:mm A")}
                                  </span>
                                  <span className="text-xs text-neutral-500">
                                    Attendee Limit: {slot.lim}
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleEditTimeslot(idx)}
                                    className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTimeslot(idx)}
                                    className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </li>
                          )}
                        </>
                      ))}
                  </ul>
                )}
              </div>
            </section>
          </div>
          <div className="bg-white p-5 rounded-lg mt-3 min-w-[700px] min-h-[600px]">
            <header className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <Boxes className="text-emerald-700" />
                <h1 className="font-[500] text-lg">Suppliers</h1>
              </div>
              <button
                onClick={() =>
                  setAddSupplier((prev) => ({ ...prev, active: true }))
                }
                className="font-[600] text-sm px-5 py-1 bg-emerald-700 rounded-md text-white hover:bg-emerald-800 transition-colors"
              >
                Add Supplier
              </button>
            </header>
            <section>
              <div className="mt-5">
                {suppliers.length === 0 && (
                  <p className="text-center text-neutral-600 py-10">
                    No suppliers added yet.
                  </p>
                )}
                <div className="flex flex-col gap-2">
                  {suppliers.map((supplier, index) => (
                    <div
                      key={supplier.id}
                      className="flex items-center justify-between p-4 border-1 border-neutral-200 rounded-md hover:bg-neutral-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-md bg-neutral-100 overflow-hidden">
                          {supplier.logoSecUrl && (
                            <img
                              src={supplier.logoSecUrl}
                              alt={supplier.name}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <h3 className="font-[500] text-sm">
                            {supplier.name}
                          </h3>
                          <p className="text-xs text-neutral-600">
                            {countriesKV[supplier.country] || supplier.country}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditSupplier(supplier)}
                          className="p-2 hover:bg-emerald-50 rounded-md group transition-colors"
                        >
                          <Pencil
                            size={16}
                            className="text-neutral-400 group-hover:text-emerald-500 transition-colors"
                          />
                        </button>
                        <button
                          onClick={() => {
                            const newSuppliers = [...suppliers];
                            newSuppliers.splice(index, 1);
                            setSuppliers(newSuppliers);
                          }}
                          className="p-2 hover:bg-red-50 rounded-md group transition-colors"
                        >
                          <Trash
                            size={16}
                            className="text-neutral-400 group-hover:text-red-500 transition-colors"
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
        <div className="w-full border-t-1 border-neutral-300 mt-5">
          <div className="flex gap-2 justify-end py-3 px-5">
            <button
              onClick={onCancel}
              className="px-5 py-2 rounded-md hover:bg-neutral-200 border-1 border-neutral-200 font-[500] text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-md bg-emerald-700 text-white hover:bg-emerald-800 font-[500] text-sm transition-colors"
            >
              Save
            </button>
          </div>
        </div>

        {/* Add Supplier Modal */}
        <AnimatePresence>
          {addSupplier.active && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="overlay h-full w-full fixed top-0 left-0 z-[999] bg-slate-900/80 overflow-y-auto py-5 px-5"
            >
              <div className="w-full min-h-screen grid place-items-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    transition: { delay: 0.2, duration: 0.2 },
                  }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="form w-full max-w-[600px] bg-white rounded-xl overflow-hidden"
                >
                  <div className="px-5 py-2 flex justify-between items-center bg-emerald-700 text-white">
                    <h1 className="font-[700]">Add Supplier</h1>
                    <div
                      className="p-2 rounded-full w-max cursor-pointer"
                      onClick={() =>
                        setAddSupplier((prev) => ({ ...prev, active: false }))
                      }
                    >
                      <X size="15px" strokeWidth={5} />
                    </div>
                  </div>
                  <div className="p-5 flex flex-col gap-2">
                    <div className="flex gap-2">
                      <TextInput
                        identifier="suplN"
                        title="Supplier Name"
                        value={addSupplier.name.value}
                        onInput={(d) => {
                          setAddSupplier((prev) => ({
                            ...prev,
                            name: { value: d, err: "" },
                          }));
                        }}
                        error={addSupplier.name.err}
                        placeholder=""
                        className="w-1/2"
                        req
                      />
                      <TextInput
                        identifier="location"
                        title="Location"
                        value={addSupplier.location.value}
                        onInput={(d) => {
                          setAddSupplier((prev) => ({
                            ...prev,
                            location: { value: d, err: "" },
                          }));
                        }}
                        error={addSupplier.location.err}
                        placeholder=""
                        className="w-1/2"
                      />
                    </div>
                    <TextInput
                      identifier="website"
                      title="Website"
                      value={addSupplier.website.value}
                      onInput={(d) => {
                        setAddSupplier((prev) => ({
                          ...prev,
                          website: { value: d, err: "" },
                        }));
                      }}
                      error={addSupplier.website.err}
                      placeholder=""
                      className=""
                      req
                    />

                    <CountrySelect
                      value={addSupplier.country}
                      onChangeCountry={(country) => {
                        setAddSupplier((prev) => ({
                          ...prev,
                          country,
                        }));
                      }}
                    />

                    <div className="flex flex-col">
                      <label
                        htmlFor="description"
                        className="font-[500] text-sm"
                      >
                        Description
                      </label>
                      <textarea
                        id="description"
                        value={addSupplier.description.value}
                        onChange={(e) => {
                          setAddSupplier((prev) => ({
                            ...prev,
                            description: { value: e.target.value, err: "" },
                          }));
                        }}
                        className="mt-1.5 w-full border-1 rounded-lg py-1.5 px-3 border-neutral-200 outline-neutral-400 outline-offset-4 min-h-[100px] resize-none"
                        placeholder="Enter supplier description..."
                      />
                      {addSupplier.description.err && (
                        <p className="text-red-500 text-xs mt-1">
                          {addSupplier.description.err}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col">
                        <h1 className="font-[500] mt-1 text-sm">
                          Logo<span className="text-red-600">*</span>
                        </h1>
                        <div className="flex-1 border-1 rounded-lg p-5 mt-1 flex justify-between items-center border-neutral-100">
                          <div className="image size-20 rounded-full bg-white overflow-hidden border-1 border-neutral-200">
                            <img
                              src={
                                addSupplier.logo.file
                                  ? URL.createObjectURL(addSupplier.logo.file)
                                  : addSupplier.logo.value
                              }
                              alt=""
                            />
                          </div>
                          <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const imageUrl = URL.createObjectURL(file);
                                setTempImageUrl(imageUrl);
                                setShowCropper(true);
                              }
                            }}
                          />
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-white px-5 py-1 font-[500] rounded-md text-sm flex gap-2 items-center hover:bg-neutral-200"
                          >
                            <Repeat size="14px" /> Change
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between">
                        <div>
                          <TextInput
                            identifier="acs-code"
                            title="Access Code"
                            value={addSupplier.accessCode.value}
                            onInput={(d) => {
                              setAddSupplier((prev) => ({
                                ...prev,
                                accessCode: { value: d, err: "" },
                              }));
                            }}
                            error={addSupplier.accessCode.err}
                            placeholder=""
                            className=""
                          />
                          <p className="bg-blue-50 text-blue-600 mt-1 px-4 py-1 rounded-md font-[500] text-xs">
                            Leave empty to auto-generate.
                          </p>
                        </div>
                        <div>
                          <label
                            htmlFor="status"
                            className="font-[500] text-sm"
                          >
                            Status
                            <span className="font-[500] text-red-600">*</span>
                          </label>
                          <select
                            name="status"
                            value={addSupplier.status}
                            onChange={(d) => {
                              setAddSupplier((prev) => ({
                                ...prev,
                                status: d.target.value,
                              }));
                            }}
                            className="mt-1.5 w-full border-1 rounded-lg py-1.5 px-3 border-neutral-200 outline-neutral-400 outline-offset-4"
                          >
                            <option value="open">Open</option>
                            <option value="closed">Closed</option>
                            <option value="in_meeting">In Meeting</option>
                            <option value="break">Break</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="buttons flex justify-end">
                      <button
                        onClick={handleAddSupplier}
                        className="px-5 bg-emerald-700 font-[700] mt-2 text-white w-max flex gap-2 items-center justify-center py-1.5 rounded-md text-sm"
                      >
                        Add Supplier
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Supplier Modal */}
        <AnimatePresence>
          {editSupplier.active && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="overlay h-full w-full fixed top-0 left-0 z-[999] bg-slate-900/80 overflow-y-auto py-5 px-5"
            >
              <div className="w-full min-h-screen grid place-items-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    transition: { delay: 0.2, duration: 0.2 },
                  }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="form w-full max-w-[600px] bg-white rounded-xl overflow-hidden"
                >
                  <div className="px-5 py-2 flex justify-between items-center bg-emerald-700 text-white">
                    <h1 className="font-[700]">Edit Supplier</h1>
                    <div
                      className="p-2 rounded-full w-max cursor-pointer"
                      onClick={() =>
                        setEditSupplier((prev) => ({ ...prev, active: false }))
                      }
                    >
                      <X size="15px" strokeWidth={5} />
                    </div>
                  </div>
                  <div className="p-5 flex flex-col gap-2">
                    <div className="flex gap-2">
                      <TextInput
                        identifier="suplN"
                        title="Supplier Name"
                        value={editSupplier.name.value}
                        onInput={(d) => {
                          setEditSupplier((prev) => ({
                            ...prev,
                            name: { value: d, err: "" },
                          }));
                        }}
                        error={editSupplier.name.err}
                        placeholder=""
                        className="w-1/2"
                        req
                      />
                      <TextInput
                        identifier="location"
                        title="Location"
                        value={editSupplier.location.value}
                        onInput={(d) => {
                          setEditSupplier((prev) => ({
                            ...prev,
                            location: { value: d, err: "" },
                          }));
                        }}
                        error={editSupplier.location.err}
                        placeholder=""
                        className="w-1/2"
                      />
                    </div>
                    <TextInput
                      identifier="website"
                      title="Website"
                      value={editSupplier.website.value}
                      onInput={(d) => {
                        setEditSupplier((prev) => ({
                          ...prev,
                          website: { value: d, err: "" },
                        }));
                      }}
                      error={editSupplier.website.err}
                      placeholder=""
                      className=""
                      req
                    />

                    <CountrySelect
                      value={editSupplier.country}
                      onChangeCountry={(country) => {
                        setEditSupplier((prev) => ({
                          ...prev,
                          country,
                        }));
                      }}
                    />

                    <div className="flex flex-col">
                      <label
                        htmlFor="description"
                        className="font-[500] text-sm"
                      >
                        Description
                      </label>
                      <textarea
                        id="description"
                        value={editSupplier.description.value}
                        onChange={(e) => {
                          setEditSupplier((prev) => ({
                            ...prev,
                            description: { value: e.target.value, err: "" },
                          }));
                        }}
                        className="mt-1.5 w-full border-1 rounded-lg py-1.5 px-3 border-neutral-200 outline-neutral-400 outline-offset-4 min-h-[100px] resize-none"
                        placeholder="Enter supplier description..."
                      />
                      {editSupplier.description.err && (
                        <p className="text-red-500 text-xs mt-1">
                          {editSupplier.description.err}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col">
                        <h1 className="font-[500] mt-1 text-sm">
                          Logo<span className="text-red-600">*</span>
                        </h1>
                        <div className="flex-1 border-1 rounded-lg p-5 mt-1 flex justify-between items-center border-neutral-100">
                          <div className="image size-20 rounded-full bg-white overflow-hidden border-1 border-neutral-200">
                            <img
                              src={
                                editSupplier.logo.file
                                  ? URL.createObjectURL(editSupplier.logo.file)
                                  : editSupplier.logo.value
                              }
                              alt=""
                            />
                          </div>
                          <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const imageUrl = URL.createObjectURL(file);
                                setTempImageUrl(imageUrl);
                                setShowCropper(true);
                              }
                            }}
                          />
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-white px-5 py-1 font-[500] rounded-md text-sm flex gap-2 items-center hover:bg-neutral-200"
                          >
                            <Repeat size="14px" /> Change
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between">
                        <div>
                          <TextInput
                            identifier="acs-code"
                            title="Access Code"
                            value={editSupplier.accessCode.value}
                            onInput={(d) => {
                              setEditSupplier((prev) => ({
                                ...prev,
                                accessCode: { value: d, err: "" },
                              }));
                            }}
                            error={editSupplier.accessCode.err}
                            placeholder=""
                            className=""
                          />
                          <p className="bg-blue-50 text-blue-600 mt-1 px-4 py-1 rounded-md font-[500] text-xs">
                            Leave empty to auto-generate.
                          </p>
                        </div>
                        <div>
                          <label
                            htmlFor="status"
                            className="font-[500] text-sm"
                          >
                            Status
                            <span className="font-[500] text-red-600">*</span>
                          </label>
                          <select
                            name="status"
                            value={editSupplier.status}
                            onChange={(d) => {
                              setEditSupplier((prev) => ({
                                ...prev,
                                status: d.target.value,
                              }));
                            }}
                            className="mt-1.5 w-full border-1 rounded-lg py-1.5 px-3 border-neutral-200 outline-neutral-400 outline-offset-4"
                          >
                            <option value="open">Open</option>
                            <option value="closed">Closed</option>
                            <option value="in_meeting">In Meeting</option>
                            <option value="break">Break</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="buttons flex justify-end">
                      <button
                        onClick={handleUpdateSupplier}
                        className="px-5 bg-emerald-700 font-[700] mt-2 text-white w-max flex gap-2 items-center justify-center py-1.5 rounded-md text-sm"
                      >
                        Update Supplier
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cropper Modal */}
        <CropperModal
          imageUrl={tempImageUrl}
          aspect={1}
          show={showCropper}
          onClose={() => {
            setShowCropper(false);
            setTempImageUrl("");
          }}
          onCrop={(croppedImage) => {
            fetch(croppedImage)
              .then((res) => res.blob())
              .then((blob) => {
                const file = new File([blob], "cropped-image.png", {
                  type: "image/png",
                });

                if (addSupplier.active) {
                  setAddSupplier((prev) => ({
                    ...prev,
                    logo: {
                      ...prev.logo,
                      file,
                    },
                  }));
                }

                if (editSupplier.active) {
                  setEditSupplier((prev) => ({
                    ...prev,
                    logo: {
                      ...prev.logo,
                      file,
                    },
                  }));
                }
              });
            setShowCropper(false);
            setTempImageUrl("");
          }}
        />
      </div>
      <TimeslotPopup
        open={showTimeslotPopup}
        onClose={() => {
          setShowTimeslotPopup(false);
          setEditIdx(null);
          setEditInitial(undefined);
        }}
        onCreate={handleCreateOrEditTimeslot}
        initialValues={editInitial}
        isEdit={editIdx !== null}
      />
    </>
  );
}
