import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface PasswordInput {
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

export default function PasswordInput({
  identifier,
  title,
  value,
  placeholder,
  onInput,
  onFocus,
  onBlur,
  error,
  className,
}: PasswordInput) {
  const [show, setShow] = useState(false);
  return (
    <div className={className || ""}>
      <label htmlFor={identifier} className="font-[500] text-sm">
        {title}
        <span className="font-[500] text-red-600">*</span>
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={identifier}
          id=""
          placeholder={placeholder || ""}
          value={value}
          onInput={(e) => {
            onInput((e.target as HTMLInputElement).value);
          }}
          onFocus={onFocus && onFocus}
          onBlur={onBlur && onBlur}
          className="mt-1.5 w-full border-1 rounded-lg py-1.5 px-3 pr-10 border-neutral-200 outline-neutral-400 outline-offset-4"
        />
        <button
          type="button"
          tabIndex={-1}
          className="absolute inset-y-0 right-3 flex items-center text-neutral-400 hover:text-neutral-700"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? (
            <EyeOff size={18} className="pointer-events-none" />
          ) : (
            <Eye size={18} className="pointer-events-none" />
          )}
        </button>
      </div>
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
