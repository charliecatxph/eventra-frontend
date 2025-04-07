import { useClickOutside } from "@/hooks/UseClickOutside";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Ellipsis, Settings } from "lucide-react";
import { useState } from "react";

interface SupplierComponent {
  name: string;
  country: string;
  logo: string;
  description: string;
  index: number;
  website: string;
  onModify: (index: number) => void;
  onDelete: (index: number) => void;
}

export default function SupplierComponent({
  logo,
  name,
  country,
  website,
  description,
  index,
  onModify,
  onDelete,
}: SupplierComponent) {
  const [openSupplierSettings, setOpenSupplierSettings] =
    useState<boolean>(false);
  const supRef = useClickOutside<HTMLDivElement>(() => {
    setOpenSupplierSettings(false);
  });
  return (
    <>
      <div className="supplier border-1 border-neutral-50 shadow-sm shadow-neutral-50 rounded-lg w-full flex flex-col">
        <div className="px-5 py-4 flex gap-2 justify-between border-b-1 border-neutral-50">
          <div className="flex gap-4 items-center">
            <div className="icon border-1 border-neutral-200 shadow-sm shadow-neutral-200 rounded-full overflow-hidden h-[40px] w-[40px]">
              <img src={logo} alt="" className="h-full w-full object-cover" />
            </div>
            <div>
              <h1 className="font-[500] text-sm">{name}</h1>
              <p className="text-xs text-neutral-800">{country}</p>
            </div>
          </div>
          <div className="grid place-items-center relative">
            <Ellipsis onClick={() => setOpenSupplierSettings((pv) => !pv)} />
            <AnimatePresence>
              {openSupplierSettings && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  key={1}
                  ref={supRef}
                  className="absolute text-sm top-[105%] right-0 w-[200px] bg-white border-1 border-neutral-100 rounded-lg shadow-sm shadow-neutral-50 py-1"
                >
                  <ul>
                    <li
                      className="px-3 py-1 hover:bg-neutral-50"
                      onClick={() => {
                        setOpenSupplierSettings(false);
                        onModify(index);
                      }}
                    >
                      Edit
                    </li>
                    <li
                      className="px-3 py-1 hover:bg-neutral-50"
                      onClick={() => {
                        setOpenSupplierSettings(false);
                        onDelete(index);
                      }}
                    >
                      Delete
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="px-5 py-4 flex-grow">
          <h1 className="font-[500] text-sm">Website</h1>
          <p className="cursor-pointer text-blue-600 font-[500] text-xs mt-1 flex gap-2 items-center w-max">
            <ArrowUpRight size="15px" />
            {website}
          </p>
          <h1 className="font-[500] text-sm mt-2">Description</h1>
          <p className="text-xs mt-1 flex gap-2 items-center">{description}</p>
        </div>
      </div>
    </>
  );
}
