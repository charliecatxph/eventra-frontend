import { selectApp } from "@/features/appSlice";
import { useClickOutside } from "@/hooks/UseClickOutside";
import { useLogout } from "@/hooks/useLogout";
import { AnimatePresence, motion } from "framer-motion";
import { Building, Earth } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function Avatar() {
  const logout = useLogout();
  const appData = useSelector(selectApp);
  const [openProf, setOpenProf] = useState<boolean>(false);
  const rfx = useClickOutside<HTMLDivElement>(() => {
    setOpenProf(false);
  });
  return (
    <>
      <div className="pl-5 avatar h-full relative">
        <div
          onClick={() => {
            setOpenProf((pv) => !pv);
          }}
          className="xtc aspect-square h-full overflow-hidden rounded-full bg-red-600"
        >
          <img
            src={appData.logo}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <AnimatePresence>
          {openProf && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              key={1}
              ref={rfx}
              className="absolute z-[999] top-[120%] right-0 bg-white w-[400px] border-1 border-neutral-200 rounded-md"
            >
              <div className="px-5 py-5 flex gap-5 items-center border-b-1 border-neutral-50">
                <div className="w-[50px] h-[50px] rounded-full overflow-hidden shrink-0">
                  <img
                    src={appData.logo}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-[700]">
                    {appData.fn} {appData.ln}
                  </p>
                  <p className="flex gap-2 items-center text-sm text-neutral-500">
                    <Building size="15px" />
                    {appData.org_name}
                  </p>
                  <p className="flex gap-2 items-center text-xs text-neutral-500">
                    <Earth size="15px" /> {appData.country}
                  </p>
                </div>
              </div>
              <ul className="my-2">
                <li
                  className="px-3 py-2 text-sm font-[500] hover:bg-neutral-50 rounded-lg"
                  onClick={() => logout()}
                >
                  Log Out
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
