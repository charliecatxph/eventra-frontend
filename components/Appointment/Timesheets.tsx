import { Info, Clock, X } from "lucide-react";
import NumberInput from "../Inputs/NumberInput";
import TimeInput from "../Inputs/TimeInput";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion";
import { useModal } from "../Modal/ModalContext";

interface Timeslot {
  startT: number;
  endT: number;
  lim: number;
}

interface TimesheetProps {
  timeslots: Timeslot[];
  setTimeslots: Dispatch<SetStateAction<Timeslot[]>>;
  evDates: {
    date: { value: string; err: string };
    startT: { value: string; err: string };
    endT: { value: string; err: string };
    offset: { value: number; err: string };
  };
}

interface TimeslotPopupProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: { start: string; end: string; limit: number }) => boolean;
}

export default function Timesheets({
  timeslots,
  setTimeslots,
  evDates,
}: TimesheetProps) {
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
  const modal = useModal();

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

  const handleDeleteTimeslot = (idx: number) => {
    modal.show({
      type: "std",
      title: "Delete Timeslot",
      description: "Are you sure you want to delete this timeslot?",
      color: "error",
      icon: <X />,
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: () => {
        setTimeslots((pv) => pv.filter((_, i) => i !== idx));
        modal.hide();
      },
      onCancel: () => modal.hide(),
    });
  };

  const handleCreateOrEditTimeslot = (data: {
    start: string;
    end: string;
    limit: number;
  }): boolean => {
    if (!evDates.date.value) return false;
    const startT = getUnix(evDates.date.value, data.start);
    const endT = getUnix(evDates.date.value, data.end);
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
          setTimeslots((pv) =>
            pv.map((slot, idx) =>
              idx === editIdx ? { startT, endT, lim: data.limit } : slot
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
      setTimeslots((pv) => [
        ...pv,
        {
          startT,
          endT,
          lim: data.limit,
        },
      ]);
      return true;
    }
  };

  return (
    <>
      <section className="eventra-container-narrow pt-5">
        <div className="px-7 py-5 bg-white rounded-xl mt-5 flex gap-2 flex-col">
          <div className="tip shadow-sm shadow-neutral-50 flex rounded-xl overflow-hidden">
            <div className="bg-blue-200 px-8 grid place-items-center">
              <Info className="text-blue-800" size="19px" />
            </div>
            <div className="p-2 bg-blue-50 pl-3 text-sm">
              <h1 className="font-[600] text-blue-800">What are timesheets?</h1>
              <p className="text-xs text-blue-900">
                <span className="line-through">
                  Timesheets are time slots that will be applied to each and
                  every supplier. They serve as the "appointment" slot for the
                  customers. Timesheets can't be modified after uploading, and
                  it also can't be customized per supplier.{" "}
                </span>
                <b>
                  Timesheets are now removed. You can create timeslots manually.
                </b>
              </p>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="flex-col flex gap-5 w-full">
              <div className="timeslot-list rounded-lg p-4 bg-neutral-50/25 min-h-[80px] mt-2">
                <div className="flex justify-between items-center mb-2">
                  <h1 className="font-[500]">Timeslots</h1>
                  <button
                    className="bg-emerald-700 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
                    onClick={() => setShowTimeslotPopup(true)}
                  >
                    Create Timeslot
                  </button>
                </div>
                {timeslots.length === 0 ? (
                  <div className="text-center text-neutral-400 py-6 text-sm">
                    <span>No timeslots created yet.</span>
                  </div>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {timeslots
                      .sort((a, b) => a.startT - b.startT)
                      .map((slot, idx) => (
                        <li
                          key={idx}
                          className="flex items-center justify-between bg-white rounded-md px-4 py-2 border border-neutral-50 shadow-sm shadow-neutral-100"
                        >
                          <div className="flex flex-col">
                            <span className="font-medium text-neutral-800">
                              {moment.unix(slot.startT).format("hh:mm A")} -{" "}
                              {moment.unix(slot.endT).format("hh:mm A")}
                            </span>
                            <span className="text-xs text-neutral-500">
                              Attendee Limit: {slot.lim}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                              onClick={() => handleEditTimeslot(idx)}
                            >
                              Edit
                            </button>
                            <button
                              className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
                              onClick={() => handleDeleteTimeslot(idx)}
                            >
                              Delete
                            </button>
                          </div>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
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

export function TimeslotPopup({
  open,
  onClose,
  onCreate,
  initialValues,
  isEdit,
}: TimeslotPopupProps & {
  initialValues?: { start: string; end: string; limit: number };
  isEdit?: boolean;
}) {
  const [fields, setFields] = useState({
    start: initialValues?.start || "",
    end: initialValues?.end || "",
    limit: initialValues?.limit || 1,
    err: { start: "", end: "", limit: "" },
  });

  useEffect(() => {
    setFields({
      start: initialValues?.start || "",
      end: initialValues?.end || "",
      limit: initialValues?.limit || 1,
      err: { start: "", end: "", limit: "" },
    });
  }, [initialValues, open]);

  const handleCreate = () => {
    let hasErr = false;
    let err = { start: "", end: "", limit: "" };
    if (!fields.start) {
      err.start = "Start time required";
      hasErr = true;
    }
    if (!fields.end) {
      err.end = "End time required";
      hasErr = true;
    }
    if (fields.limit < 1) {
      err.limit = "Limit must be at least 1";
      hasErr = true;
    }
    if (hasErr) {
      setFields((prev) => ({ ...prev, err }));
      return;
    }
    const success = onCreate({
      start: fields.start,
      end: fields.end,
      limit: fields.limit,
    });
    if (success) onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed top-0 left-0 w-full h-full z-[9999] bg-slate-900/80 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl w-full max-w-[400px] p-7 relative shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { duration: 0.25 } }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex flex-col items-center mb-4">
              <div className="bg-emerald-100 p-4 rounded-full flex items-center justify-center mb-2">
                <Clock className="text-emerald-700" size={32} />
              </div>
              <h2 className="font-bold text-lg text-emerald-800">
                {isEdit ? "Edit Timeslot" : "Create Timeslot"}
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              <TimeInput
                identifier="popup-start"
                title="Start Time"
                value={fields.start}
                onChange={(v) =>
                  setFields((prev) => ({
                    ...prev,
                    start: v,
                    err: { ...prev.err, start: "" },
                  }))
                }
                error={fields.err.start}
                req
                className="w-full"
              />
              <TimeInput
                identifier="popup-end"
                title="End Time"
                value={fields.end}
                onChange={(v) =>
                  setFields((prev) => ({
                    ...prev,
                    end: v,
                    err: { ...prev.err, end: "" },
                  }))
                }
                error={fields.err.end}
                req
                className="w-full"
              />
              <NumberInput
                identifier="popup-limit"
                title="Attendee Limit"
                value={fields.limit}
                onInput={(v) =>
                  setFields((prev) => ({
                    ...prev,
                    limit: Number(v),
                    err: { ...prev.err, limit: "" },
                  }))
                }
                error={fields.err.limit}
                className="w-full"
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className={`px-4 py-2 text-sm ${
                  isEdit
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                } text-white rounded-md transition-colors`}
              >
                {isEdit ? "Save" : "Create"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
