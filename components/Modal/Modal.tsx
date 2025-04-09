import { motion } from "framer-motion";
import { useClickOutside } from "@/hooks/UseClickOutside";
import { useEffect, useState } from "react";

type ModalProps = {
  icon?: React.ReactNode;
  title?: string;
  content?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  hide?: () => void;
  color: string;
};

export const Modal = ({
  icon,
  title,
  content,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  hide,
  color,
}: ModalProps) => {
  const rf = useClickOutside<HTMLDivElement>(() => onCancel && onCancel());
  return (
    <>
      {color === "red" && (
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
                  {content}
                </p>
              </div>
            </div>
            <div className="flex justify-end items-center bg-neutral-50 px-4 py-2">
              <div className="flex gap-2 text-sm">
                <button
                  onClick={() => {
                    onCancel && onCancel();
                  }}
                  className="hover:bg-neutral-50 bg-white border-1 font-[500] border-neutral-400 px-4 py-1.5 rounded-md"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => (onConfirm ? onConfirm() : "")}
                  className="hover:bg-red-500 bg-red-600 text-white font-[500] px-4 py-1.5 rounded-md"
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {color === "emerald" && (
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
                  {content}
                </p>
              </div>
            </div>
            <div className="flex justify-end items-center bg-neutral-50 px-4 py-2">
              <div className="flex gap-2 text-sm">
                <button
                  onClick={() => {
                    onCancel && onCancel();
                  }}
                  className="hover:bg-neutral-50 bg-white border-1 font-[500] border-neutral-400 px-4 py-1.5 rounded-md"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => (onConfirm ? onConfirm() : "")}
                  className="hover:bg-emerald-500 bg-emerald-600 text-white font-[500] px-4 py-1.5 rounded-md"
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};
