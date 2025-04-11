import {
  ArrowDownRight,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  Box,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  DoorOpen,
  HomeIcon,
  Info,
  MapPin,
  Menu,
  Plus,
  QrCode,
  RedoDot,
  ScanQrCode,
  Search,
  SquarePen,
  TriangleAlert,
  User,
  Users,
  X,
} from "lucide-react";
import { Geist, Geist_Mono } from "next/font/google";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { appUpdate, resetApp, selectApp } from "@/features/appSlice";
import { AppDispatch } from "@/features/store";
import axios from "axios";
import jwt from "jsonwebtoken";
import { useSecureRoute } from "@/hooks/UseSecureRoute";
import { useClickOutside } from "@/hooks/UseClickOutside";
import moment from "moment";
import { CircularProgress } from "@mui/material";
import Home from "..";
import { useModal } from "@/components/Modal/ModalContext";
import Head from "next/head";

interface SubMenu {
  user: boolean;
}

interface OrdinaryEV {
  status: string;
  allowWalkIn: boolean;
  atendeeLim: number;
  date: number;
  startT: number;
  endT: number;
  location: string;
  organizationId: string;
  name: string;
  sec_url: string;
  offset: number;
  type: string;
  id: string;
  atnSz: number;
}

interface BizEv {
  status: string;
  name: string;
  date: number;
  startT: number;
  endT: number;
  organizationId: string;
  lim: number;
  offset: number;
  timeslotsCount: number;
  suppliersCount: number;
  type: string;
  id: string;
  atnSz: number;
}

export default function Dashboard() {
  const modal = useModal();
  const [fetching, setFetching] = useState<boolean>(true);
  const [render, setRender] = useState<boolean>(false);
  const usecure = useSecureRoute(() => setRender(true));
  const appData = useSelector(selectApp);
  const dispatch = useDispatch<AppDispatch>();

  const [highlightOrdEv, setHighlightOrdEv] = useState<OrdinaryEV>();
  const [highlightBizEv, setHighlightBizEv] = useState<BizEv>();
  const [aEvs, setAEvs] = useState<any[]>([]);
  const [aEvsSpec, setAEvsSpec] = useState<any[]>([]);
  const [openProf, setOpenProf] = useState<boolean>(false);
  const rfx = useClickOutside<HTMLDivElement>(() => {
    setOpenProf(false);
  });

  const [filterEvs, setFilterEvs] = useState<any>({
    status: "",
    ordEventOnly: false,
    bizEventOnly: false,
  });

  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const rfx2 = useClickOutside<HTMLDivElement>(() => {
    setOpenFilter(false);
  });

  const [notifications, setNotifications] = useState<any[]>([]);

  const router = useRouter();

  const handleLogout = () => {
    modal.show({
      icon: <DoorOpen />,
      title: "Log Out",
      content:
        "By logging out, you will be signed out of your account. If you're in the middle of any important tasks, please make sure you've saved everything before you proceed.",
      confirmText: "Log Out",
      cancelText: "Go Back",
      onConfirm: async () => {
        try {
          const req = await axios.post(
            `${process.env.NEXT_PUBLIC_API}/logout`,
            {},
            { withCredentials: true }
          );
          setRender(false);
          dispatch(resetApp());
          router.push("/login");
          modal.hide();
        } catch (e) {}
      },
      onCancel: () => {
        modal.hide();
      },
      color: "red",
    });
  };

  const getHighlightEvent = (events: any[]): any => {
    // check first if there is any ongoing or upcoming events, but prioritize checking ongoing events.
    for (const event of events) {
      if (event.status === "Ongoing") {
        return event;
      }
    }

    for (const event of events) {
      if (event.status === "Upcoming") {
        let curr = null;
        curr = event;
        for (const evx of events) {
          if (evx.startT < curr.startT && evx.status === "Upcoming") {
            curr = evx;
          }
        }
        return curr;
      }
    }

    // if it loops entirely and there is absolutely no upcoming or ongoing events, get the past events, get latest one
    return events.sort((a, b) => a.endT - b.endT)[0];
  };

  const getFormattedTime = (seconds: number, offset: number) => {
    return moment.unix(seconds).utcOffset(offset).format("h:mm a");
  };

  const getFormattedDate = (milliseconds: number, offset: number) => {
    return moment
      .unix(Math.floor(milliseconds / 1000))
      .utcOffset(offset)
      .format("MMM DD, YYYY");
  };

  const fetchEvents = async () => {
    try {
      // fetch ord-ev and biz-ev
      const req = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/fetch-events?mode=full`,
        {},
        {
          headers: {
            Authorization: `Bearer ${appData.acsTok}`,
          },
          withCredentials: true,
        }
      );

      const req2 = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/fetch-notifications`,
        {},
        {
          headers: {
            Authorization: `Bearer ${appData.acsTok}`,
          },
          withCredentials: true,
        }
      );
      const acs = req.data;
      const acs2 = req2.data;
      let tmp: OrdinaryEV[] = [];
      let tmp2: any = [];
      let tmp3: any = [];

      // append ev-data to tmps
      acs.data.forEach((ordinaryEvent: any) => {
        const status =
          moment().unix() < ordinaryEvent.startT._seconds
            ? "Upcoming"
            : moment().unix() >= ordinaryEvent.startT._seconds &&
              moment().unix() <= ordinaryEvent.endT._seconds
            ? "Ongoing"
            : "Past";

        tmp.push({
          status: status,
          allowWalkIn: ordinaryEvent.allowWalkIn,
          atendeeLim: ordinaryEvent.atendeeLim,
          date: ordinaryEvent.date._seconds * 1000,
          startT: ordinaryEvent.startT._seconds,
          endT: ordinaryEvent.endT._seconds,
          location: ordinaryEvent.location,
          organizationId: ordinaryEvent.organizationId,
          name: ordinaryEvent.name,
          sec_url: ordinaryEvent.coverFile,
          offset: ordinaryEvent.offset * -1,
          type: "Ordinary Event",
          id: ordinaryEvent.id,
          atnSz: ordinaryEvent.atnSz,
        });
      });

      acs.bz.forEach((bizmatchEvent: any) => {
        const status =
          moment().unix() < bizmatchEvent.startT._seconds
            ? "Upcoming"
            : moment().unix() >= bizmatchEvent.startT._seconds &&
              moment().unix() <= bizmatchEvent.endT._seconds
            ? "Ongoing"
            : "Past";

        tmp2.push({
          status: status,
          name: bizmatchEvent.name,
          date: bizmatchEvent.date._seconds * 1000,
          startT: bizmatchEvent.startT._seconds,
          endT: bizmatchEvent.endT._seconds,
          organizationId: bizmatchEvent.organizationId,
          lim: bizmatchEvent.lim,
          offset: bizmatchEvent.offset * -1,
          timeslotsCount: bizmatchEvent.timeslotsCount,
          suppliersCount: bizmatchEvent.suppliersCount,
          type: "BizMatch Event",
          id: bizmatchEvent.id,
        });
      });

      acs2.data.forEach((notification) => {
        tmp3.push({
          data: notification.data,
          stamp: notification.stamp._seconds,
          type: notification.type,
        });
      });

      const shwlx = [...tmp, ...tmp2];
      shwlx.sort((a, b) => b.endT - a.endT);
      setAEvs(shwlx);
      setAEvsSpec(shwlx);
      setNotifications(tmp3);

      setHighlightOrdEv(getHighlightEvent(tmp));
      setHighlightBizEv(getHighlightEvent(tmp2));

      setTimeout(() => {
        setFetching(false);
      }, 1000);
    } catch (e) {}
  };

  useEffect(() => {
    if (appData.acsTok) {
      fetchEvents();
    }
  }, [appData.acsTok]);

  useEffect(() => {
    if (aEvsSpec.length === 0) return;
    const shwlx = [...aEvsSpec];
    setAEvs(
      shwlx.filter(
        (ev) =>
          (!filterEvs.status || ev.status === filterEvs.status) &&
          (!filterEvs.ordEventOnly || ev.type === "Ordinary Event") &&
          (!filterEvs.bizEventOnly || ev.type === "BizMatch Event")
      )
    );
  }, [aEvsSpec, filterEvs]);

  if (!render) return <></>;

  return (
    <>
      <Head>
        <title>Eventra | Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen w-full bg-[#fff]"></main>
    </>
  );
}
