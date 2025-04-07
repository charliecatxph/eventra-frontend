import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface EmailInput {
  identifier: string;
  title: string;
  value: string;
  placeholder?: string;
  onInput: (v: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  error: string;
  className?: string;
}

export default function EmailInput({
  identifier,
  title,
  value,
  placeholder,
  onInput,
  onFocus,
  onBlur,
  error,
  className,
}: EmailInput) {
  return (
    <div className={className || ""}>
      <label htmlFor={identifier} className="text-xs font-[500]">
        {title}
        <span className="font-[500] text-red-600">*</span>
      </label>
      <input
        type="email"
        name={identifier}
        id=""
        placeholder={placeholder || ""}
        value={value}
        onInput={(e) => {
          onInput((e.target as HTMLInputElement).value);
        }}
        onFocus={onFocus && onFocus}
        onBlur={onBlur && onBlur}
        className="px-5 py-1 focus:outline-green-400 border-1 block w-full rounded-md border-neutral-200"
      />

      <AnimatePresence>
        {error && (
          <motion.div
            key={1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="warn mt-[5px] flex items-center gap-2 text-xs text-red-600"
          >
            <AlertTriangle size="13px" className="shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
