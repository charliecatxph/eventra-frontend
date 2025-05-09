import {AnimatePresence, motion} from "framer-motion";
import {AlertTriangle} from "lucide-react";

interface TextAreaInput {
    identifier: string;
    title: string;
    value: string;
    placeholder?: string;
    onInput: (v: string) => void;
    error: string;
    className?: string;
}

export default function TextAreaInput({
                                          identifier,
                                          title,
                                          value,
                                          placeholder,
                                          onInput,
                                          error,
                                          className,
                                      }: TextAreaInput) {
    return (
        <>
            <div className={className || ""}>
                <label htmlFor={identifier} className="font-[500] text-sm">
                    {title}
                    <span className="font-[500] text-red-600">*</span>
                </label>
                <textarea
                    name={identifier}
                    className="mt-1.5 w-full border-1 rounded-lg py-1.5 px-3 border-neutral-200 outline-neutral-400 outline-offset-4 h-[200px] resize-none"
                    id=""
                    value={value}
                    placeholder={placeholder}
                    onInput={(e) => {
                        onInput((e.target as HTMLInputElement).value);
                    }}
                ></textarea>
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
        </>
    );
}
