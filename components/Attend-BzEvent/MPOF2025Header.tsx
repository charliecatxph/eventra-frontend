import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useClickOutside } from "@/hooks/UseClickOutside";
import { useDispatch, useSelector } from "react-redux";
import {
  bizmatchSlice,
  resetSupplier,
  resetUser,
} from "@/features/attendBizmatchSlice";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";

export default function MPOF2025Header() {
  const dispatch = useDispatch();
  const bizData = useSelector(bizmatchSlice);
  const [userDropdown, setUserDropdown] = useState<boolean>(false);
  const refx = useClickOutside(() => {
    setUserDropdown(false);
  });

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API}/biz-logout`,
        {},
        { withCredentials: true }
      );
      dispatch(resetUser());
      dispatch(resetSupplier());
    } catch (e) {
      dispatch(resetUser());
    }
  };
  return (
    <>
      <header className="sticky top-0 bg-white shadow-sm shadow-neutral-50 z-[9999]">
        <div className="container max-w-[1200px] w-full mx-auto">
          <div className="wrapper px-5 py-3 flex items-center justify-between ">
            <div className="logo flex gap-5 items-center">
              <img
                src="/assets/petals.png"
                alt="MPOF2025 Petals"
                className="size-10"
              />
              <div className="hidden md:block">
                <h1 className="text-lg font-[600] geist">MPOF2025 BizMatch</h1>
                <p className="text-xs">Supplier List</p>
              </div>
            </div>
            <div className="relative">
              <p className="geist flex items-center gap-2 text-sm">
                Logged in as{" "}
                <span className="font-[500] block max-w-[80px] truncate">
                  {bizData.user.orgN}
                </span>
                {!userDropdown ? (
                  <ChevronDown
                    className="size-5 cursor-pointer"
                    strokeWidth="2.5"
                    onClick={() => setUserDropdown(true)}
                  />
                ) : (
                  <ChevronUp
                    className="size-5 cursor-pointer"
                    strokeWidth="2.5"
                    onClick={() => setUserDropdown(false)}
                  />
                )}
              </p>
              <AnimatePresence>
                {userDropdown && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    key={1}
                    style={{ transformOrigin: "top right" }}
                    ref={refx}
                    className="absolute top-[110%] right-0 w-[200px] h-10"
                  >
                    <button
                      onClick={() => handleLogout()}
                      className="bg-white border-1 border-neutral-100 hover:bg-neutral-50 shadow-sm shadow-neutral-50 w-full h-full font-[500] geist text-sm rounded-lg text-left px-5"
                    >
                      Log Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
