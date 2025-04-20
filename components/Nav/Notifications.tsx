import { selectApp } from "@/features/appSlice";
import { getNotifications } from "@/functions/getNotifcations";
import { useClickOutside } from "@/hooks/UseClickOutside";
import { CircularProgress } from "@mui/material";
import { Bell } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";

interface Notification {
  data: string;
  stamp: number;
  type: string;
}

export default function Notifications() {
  const appData = useSelector(selectApp);
  const [openNotifications, setOpenNotifications] = useState<boolean>(false);
  const rfx3 = useClickOutside<HTMLDivElement>(() => {
    setOpenNotifications(false);
  });

  const [isFetching, setIsFetching] = useState<boolean>(false);

  const [notifications, setNotifications] = useState<Notification[] | []>([]);

  const fetchNotifications = async () => {
    try {
      setIsFetching(true);
      const getNotificationsReq = await getNotifications(
        appData.id,
        process.env.NEXT_PUBLIC_API || "",
        appData.acsTok
      ).catch((e) => {
        throw new Error(e?.err);
      });

      setNotifications([...getNotificationsReq.data]);
      setIsFetching(false);
    } catch (e) {
      setNotifications([]);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);
  return (
    <>
      <div className="h-full relative">
        <button
          onClick={() => setOpenNotifications((pv) => !pv)}
          className="flex gap-2 items-center  h-full pl-3 pr-5 text-sm border-1 border-neutral-200 hover:bg-black hover:text-white font-[300]"
          style={
            openNotifications
              ? { color: "white", backgroundColor: "black" }
              : {}
          }
        >
          <Bell size="15px" /> Notifications
        </button>
        <AnimatePresence>
          {openNotifications && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              key={1}
              ref={rfx3}
              className="z-[999] max-h-[300px] overflow-y-scroll absolute top-[110%] right-0 bg-white border-1 shadow-sm border-neutral-100 overflow-hidden rounded-lg w-[350px] text-sm flex flex-col gap-1"
            >
              <h1 className="px-5 py-3 font-[500] text-[15px] sticky top-0 left-0 bg-white z-[99]">
                Notifications
              </h1>
              {!isFetching &&
                notifications.map((d, i) => {
                  return (
                    <>
                      <div className=" px-5 py-2 border-y-1 border-neutral-100">
                        <div className="flex gap-2 items-center">
                          <h1 className="type font-[500] bg-neutral-900 w-max px-4 py-1 text-white text-xs rounded-full">
                            {d.type === "EVN-001" && "Registration"}
                          </h1>
                          <p className="text-right text-xs text-neutral-500">
                            {moment.unix(d.stamp).format("MMM DD hh:mm:ss A")}
                          </p>
                        </div>
                        <p className="mt-1 ">{d.data}</p>
                      </div>
                    </>
                  );
                })}
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
              {!isFetching && notifications.length === 0 && (
                <>
                  <div className="h-[200px] grid place-content-center w-full">
                    <div className="flex items-center gap-2">
                      <h1 className="text-sm font-[500] text-neutral-500">
                        No Notifications
                      </h1>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
