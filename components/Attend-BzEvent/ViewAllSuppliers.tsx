import { useEffect } from "react";
import axios from "axios";
import { Building, Globe, SquareArrowOutUpRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  bizmatchSlice,
  setIsFetching,
  setIsSuccess,
  setOffset,
  setSuppliers,
} from "@/features/attendBizmatchSlice";
import MPOF2025Header from "@/components/Attend-BzEvent/MPOF2025Header";
import { useRouter } from "next/router";
import { countriesKV } from "@/lib/constants/countries";

export default function ViewAllSuppliers() {
  const router = useRouter();
  const dispatch = useDispatch();
  const bizData = useSelector(bizmatchSlice);

  useEffect(() => {
    const bzid = process.env.NEXT_PUBLIC_BZID;
    dispatch(setIsFetching(true));
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API}/get-biz-suppliers`,
        {
          bzId: bzid,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bizData.user.acsTok}`,
          },
        }
      )
      .then((d) => {
        dispatch(setSuppliers([...d.data.data.suppliers]));
        dispatch(setOffset(d.data.data.offset));

        dispatch(setIsFetching(false));
        dispatch(setIsSuccess(true));
      });
  }, []);
  return (
    <>
      <main className="bg-neutral-50">
        <MPOF2025Header />
        <section className="supplier-directory px-5  mx-auto min-h-screen w-full max-w-[1200px]">
          <section className="supplier-list">
            <AnimatePresence mode="wait">
              {!bizData.main.isFetching && bizData.main.success ? (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="my-5 mt-10 bg-gradient-to-l from-emerald-500 to-emerald-700 text-white px-7 py-5 rounded-lg"
                  >
                    <h1 className="font-[700] text-2xl text-left">
                      Supplier List
                    </h1>
                    <p className="font-[500] text-sm text-left ">
                      Select a supplier below and secure your timeslot.
                    </p>
                    <div className="mt-5">
                      <div className="flex items-center gap-3">
                        <div className="icon bg-neutral-400/40 w-max p-2 rounded-md">
                          <Building size="15px" strokeWidth="3" />
                        </div>
                        <p className="font-[500] text-sm">
                          {bizData.main.suppliers.length} supplier
                          {bizData.main.suppliers.length > 1 && "s"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="render-suppliers grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid geist gap-2"
                  >
                    {bizData.main.suppliers.map((d, i) => (
                      <motion.div
                        key={i}
                        className="border-1 border-neutral-100 rounded-md overflow-hidden min-h-[300px] flex flex-col bg-white shadow-sm shadow-neutral-100"
                      >
                        <div className="flex items-center gap-5 border-b-1 border-neutral-100 px-7 py-3 bg-neutral-50">
                          <div className="icon shrink-0 size-10 rounded-full border-1 overflow-hidden border-neutral-200">
                            <img src={d.logoSecUrl} alt="" />
                          </div>
                          <div>
                            <h1 className="text-sm font-[600] truncate">
                              {d.name}
                            </h1>
                            <p className="text-xs">{countriesKV[d.country]}</p>
                          </div>
                        </div>
                        <div className="px-7 py-3 flex gap-3 flex-col justify-between flex-1">
                          <div>
                            <div className="description">
                              <h1 className="text-xs font-[500]">
                                Description
                              </h1>
                              <p className="text-sm">{d.description}</p>
                            </div>
                          </div>
                          <div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => {
                                  router.push(`?supplier=${d.id}`);
                                }}
                                className="bg-emerald-700 text-white px-5 flex-1 font-[700] py-1.5 text-sm rounded-md hover:bg-emerald-800"
                              >
                                Select Supplier
                              </button>
                              <a
                                href={d.website}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <button className="bg-white border-1 h-full border-neutral-200 hover:bg-neutral-50 px-5 flex-0 rounded-md">
                                  <Globe size="18px" />
                                </button>
                              </a>
                            </div>
                            <div className="flex items-center gap-2 text-xs mt-2 text-neutral-700 font-[500]">
                              <SquareArrowOutUpRight size="13px" /> {d.website}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  key={122}
                  className="loading-state h-[500px] w-full flex items-center justify-center gap-5"
                >
                  <CircularProgress
                    size={20}
                    thickness={5}
                    disableShrink
                    sx={{
                      color: "black", // spinner stroke
                    }}
                  />
                  Getting suppliers...
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </section>
      </main>
    </>
  );
}
