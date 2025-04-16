import { selectApp } from "@/features/appSlice";
import { getNotifications } from "@/functions/getNotifcations";
import { useClickOutside } from "@/hooks/UseClickOutside";
import { CircularProgress } from "@mui/material";
import { Bell } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface Notification {
  data: string;
  stamp: number;
  type: string;
}

export default function Notifications({ gate }: { gate: boolean }) {
  const appData = useSelector(selectApp);
  const [openNotifications, setOpenNotifications] = useState<boolean>(false);
  const rfx3 = useClickOutside<HTMLDivElement>(() => {
    setOpenNotifications(false);
  });

  const [notifications, setNotifications] = useState<Notification[] | []>([]);

  const fetchNotifications = async () => {
    try {
      const getNotificationsReq = await getNotifications(
        process.env.NEXT_PUBLIC_API || "",
        appData.acsTok
      ).catch((e) => {
        throw new Error(e?.err);
      });
      setNotifications([...getNotificationsReq.data]);
    } catch (e) {
      setNotifications([]);
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
        {openNotifications && (
          <div
            ref={rfx3}
            className="z-[999] max-h-[300px] overflow-y-scroll absolute top-[110%] right-0 bg-white border-1 border-neutral-100 overflow-hidden rounded-lg w-[500px] py-2 text-sm flex flex-col gap-1"
          >
            {!gate &&
              notifications.map((d, i) => {
                return (
                  <>
                    <div className=" px-5 py-1 border-y-1 border-neutral-100">
                      <h1 className="type font-[500]">
                        {d.type === "EVN-001" && "Registration"}
                      </h1>
                      <p>{d.data}</p>
                      <p className="text-right text-xs">
                        {moment.unix(d.stamp).format("MMM DD hh:mm:ss A")}
                      </p>
                    </div>
                  </>
                );
              })}
            {gate && (
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
          </div>
        )}
      </div>
    </>
  );
}
