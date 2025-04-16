import { modalSelect } from "../../features/modalStore";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/features/store";
import { AnimatePresence, motion } from "framer-motion";
import { CircularProgress } from "@mui/material";

const Modal = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    type,
    title,
    description,
    onConfirm,
    onCancel,
    confirmText,
    cancelText,
    icon,
  } = useSelector(modalSelect);

  return (
    <>
      <AnimatePresence>
        {type === "initial" && (
          <motion.div
            key={1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-container fixed top-0 left-0 h-full w-full bg-slate-900/80 z-[9999] flex justify-center items-end md:items-center inter px-5"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                transition: { duration: 0.3, delay: 0.1 },
              }}
              exit={{ scale: 0.9, opacity: 0 }}
              key={2}
              className="modal bg-white rounded-2xl w-full md:w-[600px] overflow-hidden mb-5"
            >
              <div className="flex flex-col md:flex-row items-center gap-5  px-7 py-5 min-h-[170px]">
                <div className="">
                  <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                    {" "}
                    {icon}
                  </div>
                </div>
                <div className="">
                  <h1 className="font-[500] mt-1 text-center md:text-left">
                    {title}
                  </h1>
                  <p className="text-sm mt-2 text-neutral-800 text-center md:text-left">
                    {description}
                  </p>
                </div>
              </div>
              <div className="flex justify-end items-center bg-neutral-50 px-4 py-2">
                <div className="flex w-full flex-col-reverse gap-2 text-sm md:flex-row md:justify-end">
                  {cancelText && (
                    <button
                      onClick={() => {
                        onCancel && onCancel();
                      }}
                      className="w-full md:w-max hover:bg-blue-50 bg-white border-1 font-[500] border-neutral-400 px-4 py-1.5 rounded-md"
                    >
                      {cancelText}
                    </button>
                  )}
                  <button
                    onClick={() => (onConfirm ? onConfirm() : "")}
                    className="w-full md:w-max hover:bg-blue-500 bg-blue-600 text-white font-[500] px-4 py-1.5 rounded-md"
                  >
                    {confirmText}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
        {type === "ok" && (
          <motion.div
            key={3}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-container fixed top-0 left-0 h-full w-full bg-slate-900/80 z-[9999] flex justify-center items-end md:items-center inter px-5"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                transition: { duration: 0.3, delay: 0.1 },
              }}
              exit={{ scale: 0.9, opacity: 0 }}
              key={4}
              className="modal bg-white rounded-2xl w-full md:w-[600px] overflow-hidden mb-5"
            >
              <div className="flex flex-col md:flex-row items-center gap-5  px-7 py-5 min-h-[170px]">
                <div className="">
                  <div className="p-3 rounded-full bg-emerald-50 text-emerald-600">
                    {" "}
                    {icon}
                  </div>
                </div>
                <div className="">
                  <h1 className="font-[500] mt-1 text-center md:text-left">
                    {title}
                  </h1>
                  <p className="text-sm mt-2 text-neutral-800 text-center md:text-left">
                    {description}
                  </p>
                </div>
              </div>
              <div className="flex justify-end items-center bg-neutral-50 px-4 py-2">
                <div className="flex w-full flex-col-reverse gap-2 text-sm md:flex-row md:justify-end">
                  {cancelText && (
                    <button
                      onClick={() => {
                        onCancel && onCancel();
                      }}
                      className="w-full md:w-max hover:bg-neutral-50 bg-white border-1 font-[500] border-neutral-400 px-4 py-1.5 rounded-md"
                    >
                      {cancelText}
                    </button>
                  )}
                  <button
                    onClick={() => (onConfirm ? onConfirm() : "")}
                    className="w-full md:w-max hover:bg-emerald-500 bg-emerald-600 text-white font-[500] px-4 py-1.5 rounded-md"
                  >
                    {confirmText}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
        {type === "fail" && (
          <motion.div
            key={5}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-container fixed top-0 left-0 h-full w-full bg-slate-900/80 z-[9999] flex justify-center items-end md:items-center inter px-5"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                transition: { duration: 0.3, delay: 0.1 },
              }}
              exit={{ scale: 0.9, opacity: 0 }}
              key={6}
              className="modal bg-white rounded-2xl w-full md:w-[600px] overflow-hidden mb-5"
            >
              <div className="flex flex-col md:flex-row items-center gap-5  px-7 py-5 min-h-[170px]">
                <div className="">
                  <div className="p-3 rounded-full bg-red-50 text-red-600">
                    {" "}
                    {icon}
                  </div>
                </div>
                <div className="">
                  <h1 className="font-[500] mt-1 text-center md:text-left">
                    {title}
                  </h1>
                  <p className="text-sm mt-2 text-neutral-800 text-center md:text-left">
                    {description}
                  </p>
                </div>
              </div>
              <div className="flex justify-end items-center bg-neutral-50 px-4 py-2">
                <div className="flex w-full flex-col-reverse gap-2 text-sm md:flex-row md:justify-end">
                  {cancelText && (
                    <button
                      onClick={() => {
                        onCancel && onCancel();
                      }}
                      className="w-full md:w-max hover:bg-red-50 bg-white border-1 font-[500] border-neutral-400 px-4 py-1.5 rounded-md"
                    >
                      {cancelText}
                    </button>
                  )}
                  <button
                    onClick={() => (onConfirm ? onConfirm() : "")}
                    className="w-full md:w-max hover:bg-red-500 bg-red-600 text-white font-[500] px-4 py-1.5 rounded-md"
                  >
                    {confirmText}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
        {type === "loading" && (
          <motion.div
            key={7}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-container fixed top-0 left-0 h-full w-full bg-slate-900/80 z-[9999] flex justify-center items-end md:items-center inter px-5"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                transition: { duration: 0.3, delay: 0.1 },
              }}
              exit={{ scale: 0.9, opacity: 0 }}
              key={8}
              className="modal bg-white rounded-full w-max px-5 py-2 flex items-center gap-5 font-[500] text-sm overflow-hidden mb-5"
            >
              <CircularProgress
                size={15}
                thickness={5}
                disableShrink
                sx={{
                  color: "black", // spinner stroke
                }}
              />{" "}
              {title}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Modal;
