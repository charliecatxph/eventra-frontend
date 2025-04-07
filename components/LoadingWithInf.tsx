import { CircularProgress } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";

interface LoadingComponent {
  active: boolean;
  success: boolean;
  fail: boolean;
  description: string;
  bottom?: string;
  successDescription: string;
  failDescription: string;
  successButton: string;
  failButton: string;
  onSuccessClick: () => void;
  onFailClick: () => void;
}

export default function Loading({
  active,
  success,
  fail,
  description,
  bottom,
  successDescription,
  failDescription,
  successButton,
  failButton,
  onSuccessClick,
  onFailClick,
}: LoadingComponent) {
  return (
    <>
      <AnimatePresence>
        {active && !success && !fail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key={1}
            className="fixed upl-scr top-0 left-0 w-full h-full bg-neutral-900/50 z-[9999] flex items-center justify-center geist px-5"
          >
            <motion.div
              initial={{ opacity: 0, height: "50px" }}
              animate={{
                opacity: 1,
                height: "150px",
                transition: { delay: 0.2 },
              }}
              exit={{ opacity: 0, height: "0px" }}
              key={2}
              className="bg-white w-2/3 px-5 overflow-hidden py-3 rounded-2xl flex items-center justify-center max-w-[400px]"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.5 } }}
                exit={{ opacity: 0 }}
                key={3}
                className="flex gap-1 flex-col justify-center items-center w-full"
              >
                <CircularProgress
                  thickness={5}
                  size={30}
                  sx={{
                    color: "#059669", // Equivalent to Tailwind's bg-emerald-600
                  }}
                />
                <p className="font-[500] text-sm mt-2">{description}</p>
                <p className="text-xs">{bottom}</p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && success && !fail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key={1}
            className="fixed upl-scr top-0 left-0 w-full h-full bg-neutral-900/50 z-[9999] flex items-center justify-center geist px-5"
          >
            <motion.div
              initial={{ opacity: 0, height: "50px" }}
              animate={{
                opacity: 1,
                height: "200px",
                transition: { delay: 0.2 },
              }}
              exit={{ opacity: 0, height: "0px" }}
              key={2}
              className="bg-white w-3/3 px-5 overflow-hidden py-3 rounded-lg flex items-center justify-center max-w-[400px]"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.5 } }}
                exit={{ opacity: 0 }}
                key={3}
                className="flex gap-1 flex-col justify-center items-center w-full"
              >
                <div className="rounded-full p-3 bg-emerald-600">
                  <Check size="20px" color="white" />
                </div>
                <p className="font-[500] text-sm mt-5 text-center">
                  {successDescription}
                </p>
                <button
                  onClick={() => onSuccessClick()}
                  className="hover:bg-emerald-600 font-[500] px-3 text-xs py-2 mt-5 w-full bg-emerald-700 text-white rounded-md"
                >
                  {successButton}
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && !success && fail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key={1}
            className="fixed upl-scr top-0 left-0 w-full h-full bg-neutral-900/50 z-[9999] flex items-center justify-center geist px-5"
          >
            <motion.div
              initial={{ opacity: 0, height: "50px" }}
              animate={{
                opacity: 1,
                height: "230px",
                transition: { delay: 0.2 },
              }}
              exit={{ opacity: 0, height: "0px" }}
              key={2}
              className="bg-white w-3/3 px-5 overflow-hidden py-3 rounded-lg flex items-center justify-center max-w-[400px]"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.5 } }}
                exit={{ opacity: 0 }}
                key={3}
                className="flex gap-1 flex-col justify-center items-center w-full"
              >
                <div className="rounded-full p-3 bg-red-600">
                  <X size="20px" color="white" />
                </div>
                <p className="font-[500] text-sm mt-5 text-center">
                  {failDescription}
                </p>
                <button
                  onClick={() => onFailClick()}
                  className="hover:bg-red-600 font-[500] px-3 text-xs py-2 mt-5 w-full bg-red-700 text-white rounded-md"
                >
                  {failButton}
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
