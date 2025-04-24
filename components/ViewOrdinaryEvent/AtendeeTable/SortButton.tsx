import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useClickOutside } from "@/hooks/UseClickOutside";
import { useState } from "react";

interface SortButtonProps {
  currentSortMethod: string;
  onChangeSortMethod: (method: string) => void;
}

export default function SortButton({
  currentSortMethod,
  onChangeSortMethod,
}: SortButtonProps) {
  const [openSort, setOpenSort] = useState<boolean>(false);
  const sortRf = useClickOutside<HTMLDivElement>(() => setOpenSort(false));

  return (
    <>
      <div className="relative">
        {currentSortMethod === "name-asc" && (
          <button
            onClick={() => setOpenSort((pv) => !pv)}
            className="text-xs bg-white hover:bg-neutral-50 border-1 border-neutral-200 px-5 py-1.5 text-black flex items-center gap-2 rounded-md"
          >
            <ArrowUpDown size="15px" /> Name (A-Z){" "}
          </button>
        )}
        {currentSortMethod === "name-desc" && (
          <button
            onClick={() => {
              setOpenSort((pv) => !pv);
            }}
            className="text-xs bg-white hover:bg-neutral-50 border-1 border-neutral-200 px-5 py-1.5 text-black flex items-center gap-2 rounded-md"
          >
            <ArrowUpDown size="15px" /> Name (Z-A){" "}
          </button>
        )}
        {currentSortMethod === "registeredOn-asc" && (
          <button
            onClick={() => setOpenSort((pv) => !pv)}
            className="text-xs bg-white hover:bg-neutral-50 border-1 border-neutral-200 px-5 py-1.5 text-black flex items-center gap-2 rounded-md"
          >
            <ArrowUpDown size="15px" /> Registered On (Oldest First){" "}
          </button>
        )}
        {currentSortMethod === "registeredOn-desc" && (
          <button
            onClick={() => setOpenSort((pv) => !pv)}
            className="text-xs bg-white hover:bg-neutral-50 border-1 border-neutral-200 px-5 py-1.5 text-black flex items-center gap-2 rounded-md"
          >
            <ArrowUpDown size="15px" /> Registered On (Newest First){" "}
          </button>
        )}

        <AnimatePresence>
          {openSort && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              key={1}
              ref={sortRf}
              className="z-[10] absolute w-[250px] top-[110%] right-0 bg-white border-1 border-neutral-200 rounded-md overflow-hidden"
            >
              <ul className="py-0.5 flex flex-col gap-1">
                <li>
                  <button
                    onClick={() => {
                      onChangeSortMethod("name-asc");
                      setOpenSort(false);
                    }}
                    className="w-full text-xs hover:bg-neutral-50 px-5 py-2 text-black flex items-center gap-2"
                  >
                    <ArrowUp size="15px" /> Name (A-Z){" "}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      onChangeSortMethod("name-desc");
                      setOpenSort(false);
                    }}
                    className="w-full text-xs hover:bg-neutral-50 px-5 py-2 text-black flex items-center gap-2"
                  >
                    <ArrowDown size="15px" /> Name (Z-A){" "}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      onChangeSortMethod("registeredOn-asc");
                      setOpenSort(false);
                    }}
                    className="w-full text-xs hover:bg-neutral-50 px-5 py-2 text-black flex items-center gap-2"
                  >
                    <ArrowUp size="15px" /> Registered On (Oldest First){" "}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      onChangeSortMethod("registeredOn-desc");
                      setOpenSort(false);
                    }}
                    className="w-full text-xs hover:bg-neutral-50 px-5 py-2 text-black flex items-center gap-2"
                  >
                    <ArrowDown size="15px" /> Registered On (Newest First){" "}
                  </button>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
