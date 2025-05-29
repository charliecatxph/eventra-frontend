import { AnimatePresence, motion } from "framer-motion";
import moment from "moment";
import { Clock } from "lucide-react";

interface TimeslotModalProps {
  show: boolean;
  onClose: () => void;
  supplierName: string;
  supplierCountry: string;
  timeslots: Array<{
    id: string;
    startT: string;
    endT: string;
    remainingSlots: number;
  }>;
  offset: number;
  onSelectTimeslot: (timeslot: {
    id: string;
    startT: string;
    endT: string;
  }) => void;
}

export default function TimeslotModal({
  show,
  onClose,
  supplierName,
  supplierCountry,
  timeslots,
  offset,
  onSelectTimeslot,
}: TimeslotModalProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-99999 flex items-end md:items-center justify-center geist px-2"
    >
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
        exit={{ opacity: 0, y: 15 }}
        className="bg-white rounded-t-xl md:rounded-xl w-full md:w-[500px] max-h-[90vh] overflow-hidden"
      >
        <div className="p-6 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-lg font-semibold">{supplierName}</h2>
              <p className="text-sm text-neutral-600">{supplierCountry}</p>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[60vh] p-4">
          {timeslots.length > 0 ? (
            <div className="space-y-2">
              {timeslots.map((slot) => (
                <button
                  key={slot.id}
                  disabled={slot.remainingSlots === 0}
                  onClick={() => onSelectTimeslot(slot)}
                  className={`w-full px-5 py-3 rounded-lg font-[500] border border-neutral-100 flex justify-between items-center transition-colors ${
                    slot.remainingSlots === 0
                      ? "bg-neutral-900 text-white cursor-not-allowed"
                      : "hover:bg-neutral-50 cursor-pointer"
                  }`}
                >
                  <span>
                    {moment(slot.startT)
                      .utcOffset(offset * -1)
                      .format("hh:mm A")}{" "}
                    -{" "}
                    {moment(slot.endT)
                      .utcOffset(offset * -1)
                      .format("hh:mm A")}
                  </span>
                  {slot.remainingSlots === 0 ? (
                    <span className="text-xs bg-red-700 text-red-50 px-5 py-1 font-[700] rounded-full">
                      BOOKED
                    </span>
                  ) : (
                    <span className="text-xs bg-emerald-700 text-emerald-50 px-5 py-1 font-[700] rounded-full">
                      AVAILABLE
                    </span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-center text-neutral-600 py-8">
              No timeslots available.
            </p>
          )}
        </div>

        <div className="p-4 border-t border-neutral-100">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-neutral-100 hover:bg-neutral-200 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
