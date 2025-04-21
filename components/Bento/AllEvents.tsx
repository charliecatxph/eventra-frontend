import { useClickOutside } from "@/hooks/UseClickOutside";
import { CircularProgress } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeftRight,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { OrdinaryEvent, BizMatchEvent } from "@/interfaces/Interface";

interface AllEventsParams {
  isFetching: boolean;
  data: (OrdinaryEvent | BizMatchEvent)[];
}
export default function AllEvents({ isFetching, data }: AllEventsParams) {
  const router = useRouter();
  const [filterEvs, setFilterEvs] = useState<any>({
    status: "",
    ordEventOnly: false,
    bizEventOnly: false,
  });

  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const rfx2 = useClickOutside<HTMLDivElement>(() => {
    setOpenFilter(false);
  });

  const [aEvs, setAEvs] = useState<any[]>([]);

  useEffect(() => {
    if (data.length === 0) return;
    const shwlx = [...data];
    setAEvs(
      shwlx.filter(
        (ev) =>
          (!filterEvs.status || ev.status === filterEvs.status) &&
          (!filterEvs.ordEventOnly || ev.type === "Ordinary Event") &&
          (!filterEvs.bizEventOnly || ev.type === "BizMatch Event")
      )
    );
  }, [data, filterEvs]);
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="font-[500]">Events</h1>
        <div className="filters text-xs  flex gap-1 items-center select-none">
          <div
            onClick={() => {
              setFilterEvs((pv: any) => ({
                ...pv,
                ordEventOnly: !pv.ordEventOnly,
                bizEventOnly: false,
              }));
            }}
            className={`cursor-pointer py-1 px-2 border-1 border-neutral-100 rounded-full hover:bg-neutral-50 hover:text-emerald-600 ${
              filterEvs.ordEventOnly && "bg-emerald-600 text-white"
            }`}
          >
            Ordinary Events
          </div>
          <div
            onClick={() => {
              setFilterEvs((pv: any) => ({
                ...pv,
                ordEventOnly: false,
                bizEventOnly: !pv.bizEventOnly,
              }));
            }}
            className={`cursor-pointer py-1 px-2 border-1 border-neutral-100 rounded-full hover:bg-neutral-50 hover:text-emerald-600 ${
              filterEvs.bizEventOnly && "bg-emerald-600 text-white"
            }`}
          >
            BizMatch
          </div>
          <div className=" relative ">
            {!openFilter ? (
              <div
                onClick={() => setOpenFilter(true)}
                className="cursor-pointer flex gap-1 items-center hover:bg-neutral-50 hover:text-emerald-600 py-1 px-2 border-1 border-neutral-100 rounded-full "
              >
                {filterEvs.status === "" ? (
                  <>
                    {" "}
                    <div className="icon">
                      <svg
                        width="33"
                        height="10"
                        viewBox="0 0 33 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="10" cy="10" r="10" fill="#E7000B" />
                        <ellipse
                          cx="16.5"
                          cy="10"
                          rx="10.5"
                          ry="10"
                          fill="#D08700"
                        />
                        <circle cx="23" cy="10" r="10" fill="#009966" />
                      </svg>
                    </div>
                    All Statuses
                  </>
                ) : filterEvs.status === "Ongoing" ? (
                  <>
                    <div className="icon">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="10" cy="10" r="10" fill="#009966" />
                      </svg>
                    </div>
                    Ongoing
                  </>
                ) : filterEvs.status === "Upcoming" ? (
                  <>
                    <div className="icon">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="10" cy="10" r="10" fill="#D08700" />
                      </svg>
                    </div>
                    Upcoming
                  </>
                ) : (
                  <>
                    <div className="icon">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="10" cy="10" r="10" fill="#E7000B" />
                      </svg>
                    </div>
                    Past
                  </>
                )}
                <ChevronDown size="12px" />
              </div>
            ) : (
              <div
                onClick={() => setOpenFilter(false)}
                className="cursor-pointer flex gap-1 items-center hover:bg-neutral-50 hover:text-emerald-600 py-1 px-2 border-1 border-neutral-100 rounded-full "
              >
                {filterEvs.status === "" ? (
                  <>
                    {" "}
                    <div className="icon">
                      <svg
                        width="33"
                        height="10"
                        viewBox="0 0 33 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="10" cy="10" r="10" fill="#E7000B" />
                        <ellipse
                          cx="16.5"
                          cy="10"
                          rx="10.5"
                          ry="10"
                          fill="#D08700"
                        />
                        <circle cx="23" cy="10" r="10" fill="#009966" />
                      </svg>
                    </div>
                    All Statuses
                  </>
                ) : filterEvs.status === "Ongoing" ? (
                  <>
                    <div className="icon">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="10" cy="10" r="10" fill="#009966" />
                      </svg>
                    </div>
                    Ongoing
                  </>
                ) : filterEvs.status === "Upcoming" ? (
                  <>
                    <div className="icon">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="10" cy="10" r="10" fill="#D08700" />
                      </svg>
                    </div>
                    Upcoming
                  </>
                ) : (
                  <>
                    <div className="icon">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="10" cy="10" r="10" fill="#E7000B" />
                      </svg>
                    </div>
                    Past
                  </>
                )}
                <ChevronUp size="12px" />
              </div>
            )}
            <AnimatePresence>
              {openFilter && (
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  key={1}
                  ref={rfx2}
                  className="absolute top-[120%] right-0 w-[200px] px-2 py-1 rounded-lg bg-white shadow-sm shadow-neutral-200"
                >
                  <ul>
                    <li
                      onClick={() => {
                        setOpenFilter(false);
                        setFilterEvs((pv: any) => ({
                          ...pv,
                          status: "",
                        }));
                      }}
                      className="cursor-pointer px-3 py-1.5 hover:bg-neutral-50 rounded-md flex items-center gap-1"
                    >
                      <div className="icon">
                        <svg
                          width="25"
                          height="10"
                          viewBox="0 0 33 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx="10" cy="10" r="10" fill="#E7000B" />
                          <ellipse
                            cx="16.5"
                            cy="10"
                            r="10"
                            ry="10"
                            fill="#D08700"
                          />
                          <circle cx="23" cy="10" r="10" fill="#009966" />
                        </svg>
                      </div>
                      All Statuses
                    </li>
                    <li
                      onClick={() => {
                        setOpenFilter(false);
                        setFilterEvs((pv: any) => ({
                          ...pv,
                          status: "Ongoing",
                        }));
                      }}
                      className="cursor-pointer px-3 py-1.5 hover:bg-neutral-50 rounded-md flex items-center gap-1"
                    >
                      <div className="icon">
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx="10" cy="10" r="10" fill="#009966" />
                        </svg>
                      </div>
                      Ongoing
                    </li>
                    <li
                      onClick={() => {
                        setOpenFilter(false);
                        setFilterEvs((pv: any) => ({
                          ...pv,
                          status: "Upcoming",
                        }));
                      }}
                      className="cursor-pointer px-3 py-1.5 hover:bg-neutral-50 rounded-md flex items-center gap-1"
                    >
                      <div className="icon">
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx="10" cy="10" r="10" fill="#D08700" />
                        </svg>
                      </div>
                      Upcoming
                    </li>
                    <li
                      onClick={() => {
                        setOpenFilter(false);
                        setFilterEvs((pv: any) => ({
                          ...pv,
                          status: "Past",
                        }));
                      }}
                      className="cursor-pointer px-3 py-1.5 hover:bg-neutral-50 rounded-md flex items-center gap-1"
                    >
                      <div className="icon">
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx="10" cy="10" r="10" fill="#E7000B" />
                        </svg>
                      </div>
                      Past
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div>
        {isFetching && (
          <div className="grid place-content-center h-full w-full">
            <div className="flex items-center gap-2">
              <CircularProgress
                size={40}
                thickness={3}
                disableShrink
                sx={{
                  color: "black", // spinner stroke
                }}
              />
            </div>
          </div>
        )}

        {!isFetching && (
          <div className="events flex flex-col gap-1 mt-2">
            {aEvs.length === 0 ? (
              <p className="text-center">You have no events.</p>
            ) : (
              aEvs.map((d, i) => {
                return (
                  <>
                    <div
                      onClick={() => router.push(`/view-event/${d.id}`)}
                      className="hover:bg-neutral-50 event flex justify-between items-center px-4 py-3 border-1 border-neutral-100 rounded-md"
                    >
                      <div>
                        <h1 className="text-sm font-[500]">{d.name}</h1>
                        <p className="text-xs">
                          {moment
                            .unix(d.date)
                            .utcOffset(d.offset * -1)
                            .format("dddd, MMM DD, YYYY")}{" "}
                          {moment
                            .unix(d.startT)
                            .utcOffset(d.offset * -1)
                            .format("hh:mm A")}{" "}
                          -{" "}
                          {moment
                            .unix(d.endT)
                            .utcOffset(d.offset * -1)
                            .format("hh:mm A")}{" "}
                          (GMT
                          {(d.offset * -1) / 60 >= 0
                            ? `+${(d.offset * -1) / 60}`
                            : (d.offset * -1) / 60}
                          ), {d.location}
                        </p>
                      </div>
                      <div className="flex items-end flex-col justify-center">
                        <div className="status p-1.5 text-sm flex gap-1 items-center">
                          <div className="type border-1 border-neutral-100 shadow-sm shadow-neutral-50 text-xs  px-3 py-1 text-black rounded-full w-max flex gap-2 items-center">
                            {d.type === "Ordinary" ? (
                              <ArrowUpRight size="15px" />
                            ) : (
                              <ArrowLeftRight size="15px" />
                            )}
                            {d.type}
                          </div>
                          {d.status === "Upcoming" ? (
                            <div className="registered border-1 border-neutral-100 shadow-sm shadow-neutral-50 text-xs  px-3 py-1 text-black rounded-full w-max flex gap-2 items-center">
                              <div className="circle h-[12px] w-[12px] rounded-full bg-yellow-600"></div>
                              {d.status}
                            </div>
                          ) : d.status === "Ongoing" ? (
                            <div className="registered border-1 border-neutral-100 shadow-sm shadow-neutral-50 text-xs  px-3 py-1 text-black rounded-full w-max flex gap-2 items-center">
                              <div className="circle h-[12px] w-[12px] rounded-full bg-emerald-600"></div>
                              {d.status}
                            </div>
                          ) : (
                            <div className="registered border-1 border-neutral-100 shadow-sm shadow-neutral-50 text-xs  px-3 py-1 text-black rounded-full w-max flex gap-2 items-center">
                              <div className="circle h-[12px] w-[12px] rounded-full bg-red-600"></div>
                              {d.status}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                );
              })
            )}
          </div>
        )}
      </div>
    </>
  );
}
