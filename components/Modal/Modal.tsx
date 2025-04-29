import { motion } from "framer-motion";
import { useClickOutside } from "@/hooks/UseClickOutside";
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";

type ModalTypes = "std" | "loading";

interface ModalOptions {
  type: ModalTypes;
  title: string;
  description?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  icon?: React.ReactNode | null;
  color: string;
  hide: () => void;
}

export const Modal = ({
  type,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  icon,
  color,
  hide,
}: ModalOptions) => {
  const rf = useClickOutside<HTMLDivElement>(() => onCancel && onCancel());
  const [colors, setColors] = useState<any>({
    foreground: "",
    background: "",
  });

  useEffect(() => {
    switch (color) {
      case "success": {
        setColors({
          foreground: "oklch(50.8% 0.118 165.612)",
          background: "oklch(95% 0.052 163.051)",
        });
        break;
      }
      case "neutral": {
        setColors({
          foreground: "oklch(48.8% 0.243 264.376)",
          background: "oklch(93.2% 0.032 255.585)",
        });
        break;
      }
      case "error": {
        setColors({
          foreground: "oklch(51.4% 0.222 16.935)",
          background: "oklch(94.1% 0.03 12.58)",
        });
        break;
      }
      default: {
        setColors({
          foreground: "oklch(37.2% 0.044 257.287)",
          background: "oklch(96.8% 0.007 247.896)",
        });
      }
    }
  }, []);

  if (type === "loading") {
    return (
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
          className="modal bg-white rounded-full w-max px-5 py-2 flex items-center gap-5 font-[600] text-sm overflow-hidden mb-5"
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
    );
  }

  if (type === "std") {
    return (
      <>
        <motion.div
          key={1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          ref={rf}
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
                <div
                  className="p-3 rounded-full"
                  style={{
                    color: colors.foreground,
                    backgroundColor: colors.background,
                  }}
                >
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
                    className="w-full md:w-max hover:bg-blue-50 bg-white border-1 font-[500] border-neutral-200 px-4 py-1.5 rounded-md"
                  >
                    {cancelText}
                  </button>
                )}
                <button
                  onClick={() => (onConfirm ? onConfirm() : "")}
                  className="w-full md:w-max  text-white font-[500] px-4 py-1.5 rounded-md"
                  style={{
                    color: colors.background,
                    backgroundColor: colors.foreground,
                  }}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </>
    );
  }
};
