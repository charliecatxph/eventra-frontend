import {AnimatePresence, motion} from "framer-motion";
import {AlertTriangle} from "lucide-react";

interface TimeInput {
    identifier: string;
    title: string;
    value: string;
    placeholder?: string;
    onChange: (v: string) => void;
    error: string;
    className?: string;
    req?: boolean;
}

export default function TimeInput({
                                      identifier,
                                      title,
                                      value,
                                      placeholder,
                                      onChange,
                                      error,
                                      className,
                                      req,
                                  }: TimeInput) {
    return (
        <div className={className || ""}>
            <label htmlFor={identifier} className="font-[500] text-sm">
                {title}
                {req && <span className="font-[500] text-red-600">*</span>}
            </label>
            <input
                type="time"
                name={identifier}
                id=""
                placeholder={placeholder || ""}
                value={value}
                onChange={(e) => {
                    onChange((e.target as HTMLInputElement).value);
                }}
                className="mt-1.5 w-full border-1 rounded-lg py-1.5 px-3 border-neutral-200 outline-neutral-400 outline-offset-4"
            />

            <AnimatePresence>
                {error && (
                    <motion.div
                        key={1}
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        className="warn mt-[5px] flex items-center gap-2 text-xs text-red-600"
                    >
                        <AlertTriangle size="13px" className="shrink-0"/>
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
