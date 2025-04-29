import {
  AlertTriangle,
  ArrowLeft,
  Bell,
  Boxes,
  Briefcase,
  Check,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  CircleX,
  Clock,
  Download,
  Eye,
  FileQuestion,
  Filter,
  HomeIcon,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Printer,
  QrCode,
  QrCodeIcon,
  RefreshCcwDot,
  Search,
  Smartphone,
  Trash,
  User,
  Users,
  X,
} from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { appUpdate, resetApp, selectApp } from "@/features/appSlice";
import { AppDispatch } from "@/features/store";
import axios from "axios";
import { useSecureRoute } from "@/hooks/UseSecureRoute";
import { useClickOutside } from "@/hooks/UseClickOutside";
import moment from "moment";
import { CircularProgress } from "@mui/material";
import { printQR } from "@/components/ViewEv_Deps/printQr";
import { useModal } from "@/hooks/useModal";
import Head from "next/head";
import { Line, Pie } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from "chart.js";
import QRCode from "@/components/QRCode";
import TextInput from "@/components/Inputs/TextInput";
import Avatar from "@/components/Nav/Avatar";
import OrdEvRegLineAnalytics from "@/components/Bento/OrdEvRegLineAnalytics";
import { getOrdEventAnalytics } from "@/functions/getOrdEventAnalytics";
import { fetchAtendees } from "@/functions/getAtendees";
import OrdEvRegPieAnalytics from "@/components/Bento/OrdEvRegPieAnalytics";
import Notifications from "@/components/Nav/Notifications";
import HighlightedOrdinaryEvent from "@/components/Bento/HighlightedOrdinaryEvent";
import { getOrdinaryEventInformation } from "@/functions/getOrdinaryEventInformation";

import { Atendee, OrdinaryEvent } from "@/interfaces/Interface";
import OrdEvAttendees from "@/components/ViewOrdinaryEvent/AtendeeTable/OrdEvAttendees";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

interface PieChartData {
  labels: string[];
  datasets: [
    {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }
  ];
}

interface LineChartData {
  labels: string[];
  datasets: [
    {
      label: string;
      data: number[];
      borderColor: string;
      tension: number;
      pointRadius: number;
      pointHoverRadius: number;
      pointBackgroundColor: string;
      pointHoverBackgroundColor: string;
      pointBorderColor: string;
      pointHoverBorderColor: string;
    }
  ];
}

interface FetchingData {
  mainEvent: boolean;
  lineAnalytics: boolean;
  pieAnalytics: boolean;
  atendees: boolean;
  notifications: boolean;
}

export default function ViewEvent() {
  const modal = useModal();

  const [fetching, setFetching] = useState<FetchingData>({
    mainEvent: false,
    lineAnalytics: false,
    pieAnalytics: false,
    atendees: false,
    notifications: false,
  });

  const [render, setRender] = useState<boolean>(false);
  useSecureRoute(() => {
    setRender(true);
  });

  const appData = useSelector(selectApp);

  const [rpdOrd, setRpdOrd] = useState<LineChartData>({
    labels: [],
    datasets: [
      {
        label: "Registrations",
        data: [],
        borderColor: "oklch(55.8% 0.288 302.321)",

        tension: 1,

        pointRadius: 4, // Visible point
        pointHoverRadius: 6, // Enlarges on hover
        pointBackgroundColor: "#fff",
        pointHoverBackgroundColor: "#4338CA",
        pointBorderColor: "#000",
        pointHoverBorderColor: "#fff",
      },
    ],
  });

  const [ioutOrd, setIoutOrd] = useState<PieChartData>({
    labels: ["Not in Event", "In Event"],
    datasets: [
      {
        label: "Atendee",
        data: [],
        backgroundColor: ["rgba(231, 76, 60,0.2)", "rgba(52, 152, 219,0.2)"],
        borderColor: ["rgba(231, 76, 60,1.0)", "rgba(52, 152, 219,1.0)"],
        borderWidth: 1,
      },
    ],
  });

  const [qrScanner, setQrScanner] = useState<boolean>(false);

  const [currEvent, setCurrEvent] = useState<OrdinaryEvent>({
    id: "",
    name: "",
    orgId: "",
    allowWalkIn: false,
    attendeeLim: 0,
    coverFile: "",
    coverFilePubId: "",
    date: 0,
    description: "",
    endT: 0,
    location: "",
    offset: 0,
    organizedBy: "",
    startT: 0,
    upl_on: 0,
    type: "",
    status: "",
  });

  const [attendees, setAttendees] = useState<Atendee[]>([]);

  // atendee sort logic
  const [currentSortMethod, setCurrentSortMethod] =
    useState<string>("registeredOn-desc");
  const [search, setSearch] = useState<string>("");
  const [atnLimit, setAtnLimit] = useState<number>(10);
  const [atnSize, setAtnSize] = useState<number>(0);
  const [currPage, setCurrPage] = useState<number>(1);

  const router = useRouter();

  // initial fetch
  const fetchEventData = async () => {
    try {
      setFetching((pv) => ({
        mainEvent: true,
        lineAnalytics: true,
        pieAnalytics: true,
        atendees: true,
        notifications: true,
      }));
      const ordinaryEventInformation: OrdinaryEvent =
        await getOrdinaryEventInformation(
          router.query.slug as string,
          appData.acsTok
        ).catch((e) => {
          throw new Error(e?.err);
        });

      setCurrEvent(ordinaryEventInformation);

      const getOrdEventAnalyticsReq = await getOrdEventAnalytics(
        process.env.NEXT_PUBLIC_API || "",
        appData.acsTok,
        ordinaryEventInformation.id,
        ordinaryEventInformation.offset,
        "rpd"
      ).catch((e) => {
        throw new Error(e?.err);
      });
      setRpdOrd(getOrdEventAnalyticsReq.data);

      const getOrdRegistrationCount = await fetchAtendees(
        "all",
        ordinaryEventInformation.id,
        appData.acsTok,
        atnLimit,
        1,
        currentSortMethod.split("-")[0],
        currentSortMethod.split("-")[1],
        ""
      ).catch((e) => {
        throw new Error(e?.err);
      });

      setIoutOrd((pv) => ({
        ...pv,
        datasets: [
          {
            ...pv.datasets[0],
            data: [
              getOrdRegistrationCount.data[0].stats.out,
              getOrdRegistrationCount.data[0].stats.in,
            ],
          },
        ],
      }));

      setAttendees([...getOrdRegistrationCount.data[0].attendees]);
      setAtnSize(getOrdRegistrationCount.data[0].stats.total);

      setTimeout(() => {
        setFetching((pv) => ({
          mainEvent: false,
          lineAnalytics: false,
          pieAnalytics: false,
          atendees: false,
          notifications: false,
        }));
      }, 500);
      setRender(true);
    } catch (e) {
      setRender(false);
      router.push("/dashboard");
    }
  };

  // on manual click of the dedicated refresh button
  const refetchAtendees = async () => {
    setFetching((pv) => ({
      ...pv,
      lineAnalytics: true,
      pieAnalytics: true,
      atendees: true,
    }));

    try {
      const getOrdEventAnalyticsReq = await getOrdEventAnalytics(
        process.env.NEXT_PUBLIC_API || "",
        appData.acsTok,
        currEvent.id,
        currEvent.offset,
        "rpd"
      ).catch((e) => {
        throw new Error(e?.err);
      });
      setRpdOrd(getOrdEventAnalyticsReq.data);

      const getOrdRegistrationCount = await fetchAtendees(
        "all",
        currEvent.id,
        appData.acsTok,
        atnLimit,
        currPage,
        currentSortMethod.split("-")[0],
        currentSortMethod.split("-")[1],
        search
      ).catch((e) => {
        throw new Error(e?.err);
      });

      setIoutOrd((pv) => ({
        ...pv,
        datasets: [
          {
            ...pv.datasets[0],
            data: [
              getOrdRegistrationCount.data[0].stats.out,
              getOrdRegistrationCount.data[0].stats.in,
            ],
          },
        ],
      }));

      setAttendees([...getOrdRegistrationCount.data[0].attendees]);

      // if there are is something on search, it means we are filtering the data and we expect filtered data
      if (search) {
        setAtnSize(getOrdRegistrationCount.data[0].stats.queryTotal);
      } else {
        setAtnSize(getOrdRegistrationCount.data[0].stats.total);
      }

      setFetching((pv) => ({
        ...pv,
        lineAnalytics: false,
        pieAnalytics: false,
        atendees: false,
      }));
    } catch (e) {
      router.push("/dashboard");
    }
  };

  // function for refreshing the atendees thru search and sort
  const refetchAtendeesSortSearch = async () => {
    setFetching((pv) => ({
      ...pv,
      atendees: true,
    }));

    try {
      const getOrdRegistrationCount = await fetchAtendees(
        "all",
        currEvent.id,
        appData.acsTok,
        atnLimit,
        currPage,
        currentSortMethod.split("-")[0],
        currentSortMethod.split("-")[1],
        search
      ).catch((e) => {
        throw new Error(e?.err);
      });
      setAttendees([...getOrdRegistrationCount.data[0].attendees]);

      // atn size is dynamically set with reference to the query length, query is limited by the atnLim variable
      setAtnSize(getOrdRegistrationCount.data[0].stats.queryTotal);

      setFetching((pv) => ({
        ...pv,
        atendees: false,
      }));
    } catch (e) {
      router.push("/dashboard");
    }
  };

  useEffect(() => {
    if (!currEvent.id || fetching.atendees) return;
    const debounce = setTimeout(() => {
      refetchAtendeesSortSearch();
    }, 500);

    return () => {
      clearTimeout(debounce);
    };
  }, [currentSortMethod, search, currEvent.id, currPage]);

  useEffect(() => {
    if (!router.query.slug || !appData.acsTok) return;
    fetchEventData();
  }, [router.query.slug, appData.acsTok]);

  if (!render) return <></>;

  return (
    <>
      <Head>
        <title>Eventra | View Event ({router.query.slug})</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <QRCode
        ev={currEvent.name}
        active={qrScanner}
        onExit={() => {
          setQrScanner(false);
        }}
        onSuccessPulse={() => {
          refetchAtendees();
        }}
        onFailPulse={() => {}}
      />

      <main className=" min-h-screen w-full bg-[#fff] inter">
        <nav className="w-full h-[60px] bg-white border-b-2 border-neutral-100 flex">
          <div className="h-full w-[60px] grid place-content-center border-r-2 border-neutral-100">
            <svg
              width="30"
              height="26"
              viewBox="0 0 30 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <ellipse cx="13" cy="9.5" rx="9" ry="9.5" fill="#F11716" />
              <circle cx="20.5" cy="13.5" r="9.5" fill="#FDD21A" />
              <circle cx="9.5" cy="16.5" r="9.5" fill="#AA2AD4" />
            </svg>
          </div>
          <div className="h-full w-[204px] border-r-2 border-neutral-100 flex items-center pl-5">
            <svg
              width="129"
              height="31"
              viewBox="0 0 129 31"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_42_267)">
                <path
                  d="M6.89541 15.779C5.67577 15.779 4.62032 15.5155 3.72904 14.9885C2.85341 14.4615 2.17323 13.7097 1.6885 12.7332C1.21941 11.7567 0.984863 10.6175 0.984863 9.31548C0.984863 8.01348 1.21941 6.88198 1.6885 5.92098C2.17323 4.94448 2.85341 4.19273 3.72904 3.66573C4.60468 3.12323 5.63668 2.85198 6.82504 2.85198C7.95086 2.85198 8.94377 3.11548 9.80377 3.64248C10.6638 4.15398 11.3283 4.89798 11.7974 5.87448C12.2821 6.85098 12.5245 8.02898 12.5245 9.40848V10.0362H3.56486C3.62741 11.2452 3.94795 12.152 4.5265 12.7565C5.12068 13.361 5.91814 13.6632 6.91886 13.6632C7.65377 13.6632 8.26359 13.4927 8.74832 13.1517C9.23304 12.8107 9.56923 12.3535 9.75686 11.78L12.3369 11.9427C12.0085 13.0897 11.3596 14.0197 10.3901 14.7327C9.43632 15.4302 8.27141 15.779 6.89541 15.779ZM3.56486 8.17623H9.89759C9.81941 7.07573 9.49886 6.26198 8.93595 5.73498C8.38868 5.20798 7.68504 4.94448 6.82504 4.94448C5.93377 4.94448 5.19886 5.22348 4.62032 5.78148C4.05741 6.32398 3.70559 7.12223 3.56486 8.17623ZM15.8504 15.5L11.3002 3.13098H13.9506L17.3515 12.989L20.7524 3.13098H23.4262L18.8526 15.5H15.8504ZM28.0521 15.779C26.8325 15.779 25.777 15.5155 24.8857 14.9885C24.0101 14.4615 23.3299 13.7097 22.8452 12.7332C22.3761 11.7567 22.1416 10.6175 22.1416 9.31548C22.1416 8.01348 22.3761 6.88198 22.8452 5.92098C23.3299 4.94448 24.0101 4.19273 24.8857 3.66573C25.7614 3.12323 26.7934 2.85198 27.9817 2.85198C29.1076 2.85198 30.1005 3.11548 30.9605 3.64248C31.8205 4.15398 32.485 4.89798 32.9541 5.87448C33.4388 6.85098 33.6812 8.02898 33.6812 9.40848V10.0362H24.7216C24.7841 11.2452 25.1047 12.152 25.6832 12.7565C26.2774 13.361 27.0748 13.6632 28.0756 13.6632C28.8105 13.6632 29.4203 13.4927 29.905 13.1517C30.3897 12.8107 30.7259 12.3535 30.9136 11.78L33.4936 11.9427C33.1652 13.0897 32.5163 14.0197 31.5468 14.7327C30.593 15.4302 29.4281 15.779 28.0521 15.779ZM24.7216 8.17623H31.0543C30.9761 7.07573 30.6556 6.26198 30.0927 5.73498C29.5454 5.20798 28.8417 4.94448 27.9817 4.94448C27.0905 4.94448 26.3556 5.22348 25.777 5.78148C25.2141 6.32398 24.8623 7.12223 24.7216 8.17623ZM34.0895 15.5V3.13098H36.3646L36.4584 6.43248L36.1535 6.26973C36.2942 5.46373 36.56 4.81273 36.9509 4.31673C37.3418 3.82073 37.8187 3.45648 38.3817 3.22398C38.9446 2.97598 39.5544 2.85198 40.2111 2.85198C41.1493 2.85198 41.9233 3.06123 42.5331 3.47973C43.1586 3.88273 43.6276 4.44073 43.9404 5.15373C44.2687 5.85123 44.4329 6.64948 44.4329 7.54848V15.5H41.9467V8.29248C41.9467 7.56398 41.8686 6.95173 41.7122 6.45573C41.5558 5.95973 41.2978 5.57998 40.9382 5.31648C40.5786 5.05298 40.1095 4.92123 39.5309 4.92123C38.6553 4.92123 37.9438 5.20798 37.3966 5.78148C36.8493 6.35498 36.5757 7.19198 36.5757 8.29248V15.5H34.0895ZM49.7275 15.5C48.5391 15.5 47.6635 15.2287 47.1006 14.6862C46.5377 14.1437 46.2562 13.299 46.2562 12.152V0.224731H48.7424V11.966C48.7424 12.5395 48.8675 12.9347 49.1177 13.1517C49.3678 13.3687 49.7509 13.4772 50.2669 13.4772H52.0495V15.5H49.7275ZM44.3564 5.15373V3.13098H52.0495V5.15373H44.3564ZM52.5663 15.5V3.13098H54.8414L54.9352 6.40923L54.7241 6.33948C54.8961 5.22348 55.2401 4.40973 55.7561 3.89823C56.2878 3.38673 56.9992 3.13098 57.8905 3.13098H59.0867V5.33973H57.8905C57.2651 5.33973 56.7412 5.44048 56.3191 5.64198C55.8969 5.84348 55.5763 6.15348 55.3574 6.57198C55.1541 6.99048 55.0525 7.53298 55.0525 8.19948V15.5H52.5663ZM62.2875 15.779C60.9897 15.779 59.9499 15.4845 59.1681 14.8955C58.4019 14.3065 58.0188 13.4772 58.0188 12.4077C58.0188 11.3382 58.3394 10.509 58.9804 9.91998C59.6372 9.31548 60.6457 8.88148 62.0061 8.61798L66.2983 7.80423C66.2983 6.84323 66.0715 6.13023 65.6181 5.66523C65.1646 5.18473 64.4923 4.94448 63.601 4.94448C62.8035 4.94448 62.1781 5.12273 61.7246 5.47923C61.2712 5.82023 60.9584 6.33173 60.7864 7.01373L58.2299 6.85098C58.4644 5.61098 59.043 4.63448 59.9655 3.92148C60.9037 3.20848 62.1155 2.85198 63.601 2.85198C65.2897 2.85198 66.5719 3.30148 67.4475 4.20048C68.3388 5.08398 68.7844 6.33173 68.7844 7.94373V12.7565C68.7844 13.051 68.8314 13.2602 68.9252 13.3842C69.0346 13.4927 69.2066 13.547 69.4412 13.547H69.8868V15.5C69.8086 15.5155 69.6835 15.531 69.5115 15.5465C69.3395 15.562 69.1597 15.5697 68.9721 15.5697C68.4404 15.5697 67.9792 15.4845 67.5883 15.314C67.213 15.1435 66.9315 14.8645 66.7439 14.477C66.5563 14.074 66.4624 13.5392 66.4624 12.8727L66.7204 12.989C66.5954 13.5315 66.3217 14.012 65.8995 14.4305C65.493 14.849 64.9692 15.1822 64.3281 15.4302C63.7026 15.6627 63.0224 15.779 62.2875 15.779ZM62.6863 13.826C63.4368 13.826 64.0779 13.6865 64.6095 13.4075C65.1412 13.113 65.5555 12.71 65.8526 12.1985C66.1497 11.687 66.2983 11.1057 66.2983 10.4547V9.66423L62.6394 10.3617C61.8888 10.5012 61.3572 10.726 61.0444 11.036C60.7474 11.3305 60.5988 11.7102 60.5988 12.1752C60.5988 12.7022 60.7786 13.113 61.1383 13.4075C61.5135 13.6865 62.0295 13.826 62.6863 13.826ZM78.3911 15.779C77.2185 15.779 76.2178 15.5 75.3891 14.942C74.576 14.3685 73.9584 13.5935 73.5362 12.617C73.114 11.6405 72.9029 10.5477 72.9029 9.33873C72.9029 8.12973 73.1062 7.04473 73.5127 6.08373C73.9349 5.10723 74.5447 4.33223 75.3422 3.75873C76.1553 3.18523 77.1404 2.89848 78.2973 2.89848C79.4544 2.89848 80.4238 3.17748 81.2057 3.73548C82.0031 4.29348 82.6051 5.05298 83.0117 6.01398C83.4338 6.95948 83.6449 8.03673 83.6449 9.24573V9.61773H74.0991C74.146 11.2142 74.5525 12.462 75.3187 13.361C76.1005 14.2445 77.1247 14.6862 78.3911 14.6862C79.4075 14.6862 80.2362 14.446 80.8773 13.9655C81.5184 13.4695 81.9562 12.8262 82.1907 12.0357L83.4104 12.1287C83.0977 13.1827 82.5035 14.0585 81.6278 14.756C80.7522 15.438 79.6733 15.779 78.3911 15.779ZM74.0991 8.61798H82.4018C82.3393 7.16098 81.9484 6.02948 81.2291 5.22348C80.5255 4.40198 79.5482 3.99123 78.2973 3.99123C77.1091 3.99123 76.1396 4.40198 75.3891 5.22348C74.6385 6.02948 74.2085 7.16098 74.0991 8.61798ZM87.2866 15.5L82.6661 3.17748H83.8857L87.9903 14.4072L92.0948 3.17748H93.3145L88.6939 15.5H87.2866ZM97.8302 15.779C96.6575 15.779 95.6568 15.5 94.8281 14.942C94.015 14.3685 93.3973 13.5935 92.9751 12.617C92.553 11.6405 92.3419 10.5477 92.3419 9.33873C92.3419 8.12973 92.5451 7.04473 92.9517 6.08373C93.3739 5.10723 93.9837 4.33223 94.7812 3.75873C95.5942 3.18523 96.5793 2.89848 97.7364 2.89848C98.8935 2.89848 99.863 3.17748 100.645 3.73548C101.442 4.29348 102.044 5.05298 102.451 6.01398C102.873 6.95948 103.084 8.03673 103.084 9.24573V9.61773H93.5381C93.585 11.2142 93.9915 12.462 94.7577 13.361C95.5395 14.2445 96.5637 14.6862 97.8302 14.6862C98.8466 14.6862 99.6753 14.446 100.316 13.9655C100.958 13.4695 101.395 12.8262 101.63 12.0357L102.85 12.1287C102.537 13.1827 101.943 14.0585 101.067 14.756C100.191 15.438 99.1124 15.779 97.8302 15.779ZM93.5381 8.61798H101.841C101.778 7.16098 101.388 6.02948 100.668 5.22348C99.9646 4.40198 98.9873 3.99123 97.7364 3.99123C96.5481 3.99123 95.5786 4.40198 94.8281 5.22348C94.0775 6.02948 93.6475 7.16098 93.5381 8.61798ZM103.81 15.5V3.17748H104.865L104.912 6.47898L104.748 6.40923C104.857 5.63423 105.115 4.99098 105.522 4.47948C105.928 3.95248 106.429 3.55723 107.023 3.29373C107.633 3.03023 108.297 2.89848 109.017 2.89848C109.955 2.89848 110.729 3.10773 111.339 3.52623C111.948 3.94473 112.402 4.51048 112.699 5.22348C112.996 5.92098 113.145 6.70373 113.145 7.57173V15.5H112.019V8.12973C112.019 7.29273 111.909 6.56423 111.69 5.94423C111.471 5.30873 111.127 4.82048 110.658 4.47948C110.189 4.12298 109.564 3.94473 108.782 3.94473C107.609 3.94473 106.671 4.32448 105.967 5.08398C105.279 5.84348 104.935 6.85873 104.935 8.12973V15.5H103.81ZM118.014 15.5C117.107 15.5 116.427 15.283 115.973 14.849C115.535 14.415 115.316 13.764 115.316 12.896V0.294481H116.442V12.8495C116.442 13.454 116.583 13.8802 116.864 14.1282C117.146 14.3762 117.56 14.5002 118.107 14.5002H119.562V15.5H118.014ZM113.252 4.17723V3.17748H119.562V4.17723H113.252ZM124.358 15.779C123.31 15.779 122.411 15.6085 121.661 15.2675C120.91 14.911 120.324 14.4382 119.902 13.8492C119.48 13.2447 119.245 12.5627 119.198 11.8032L120.371 11.687C120.449 12.586 120.832 13.3145 121.52 13.8725C122.208 14.415 123.154 14.6862 124.358 14.6862C125.468 14.6862 126.32 14.5002 126.915 14.1282C127.509 13.7407 127.806 13.1672 127.806 12.4077C127.806 12.0047 127.712 11.656 127.524 11.3615C127.352 11.067 126.993 10.8112 126.446 10.5942C125.898 10.3617 125.07 10.1525 123.959 9.96648C122.787 9.76498 121.88 9.51698 121.239 9.22248C120.613 8.91248 120.175 8.54048 119.925 8.10648C119.691 7.65698 119.573 7.12223 119.573 6.50223C119.573 5.43273 119.964 4.56473 120.746 3.89823C121.544 3.23173 122.615 2.89848 123.959 2.89848C124.898 2.89848 125.687 3.06898 126.328 3.40998C126.985 3.75098 127.509 4.20823 127.9 4.78173C128.291 5.33973 128.549 5.95973 128.674 6.64173L127.501 6.78123C127.423 6.28523 127.235 5.82798 126.938 5.40948C126.657 4.97548 126.266 4.63448 125.765 4.38648C125.265 4.12298 124.663 3.99123 123.959 3.99123C122.959 3.99123 122.177 4.20823 121.614 4.64223C121.051 5.07623 120.77 5.68848 120.77 6.47898C120.77 6.97498 120.871 7.37798 121.074 7.68798C121.278 7.99798 121.637 8.25373 122.153 8.45523C122.669 8.64123 123.389 8.81173 124.311 8.96673C125.515 9.16823 126.453 9.41623 127.126 9.71073C127.798 10.0052 128.275 10.3695 128.556 10.8035C128.838 11.2375 128.979 11.7645 128.979 12.3845C128.979 13.113 128.791 13.733 128.416 14.2445C128.04 14.7405 127.509 15.1202 126.821 15.3837C126.133 15.6472 125.312 15.779 124.358 15.779Z"
                  fill="#1D0C4E"
                />
                <path
                  d="M4.36249 28.086C3.58067 28.086 2.91873 27.9 2.37667 27.528C1.84503 27.1457 1.43849 26.629 1.15703 25.978C0.886001 25.327 0.750488 24.5985 0.750488 23.7925C0.750488 22.9865 0.886001 22.2632 1.15703 21.6225C1.43849 20.9715 1.84503 20.4548 2.37667 20.0725C2.91873 19.6902 3.58067 19.499 4.36249 19.499C4.98794 19.499 5.53 19.6178 5.98867 19.8555C6.45776 20.0932 6.83825 20.4187 7.13012 20.832C7.422 21.2453 7.63049 21.7258 7.75558 22.2735L6.95812 22.3355C6.80176 21.6638 6.50467 21.1472 6.06685 20.7855C5.62903 20.4135 5.06091 20.2275 4.36249 20.2275C3.49727 20.2275 2.80927 20.5478 2.29849 21.1885C1.79812 21.8188 1.54794 22.6868 1.54794 23.7925C1.54794 24.8982 1.79812 25.7713 2.29849 26.412C2.80927 27.0423 3.49727 27.3575 4.36249 27.3575C5.06091 27.3575 5.63946 27.1612 6.09812 26.7685C6.55679 26.3758 6.85388 25.8178 6.9894 25.0945L7.78685 25.1565C7.67218 25.7248 7.4637 26.2312 7.1614 26.6755C6.86952 27.1095 6.48382 27.4557 6.00431 27.714C5.53522 27.962 4.98794 28.086 4.36249 28.086ZM10.5072 27.9C9.90261 27.9 9.44915 27.7553 9.14682 27.466C8.85497 27.1767 8.70901 26.7427 8.70901 26.164V17.763H9.45955V26.133C9.45955 26.536 9.55337 26.8202 9.74101 26.9855C9.92864 27.1508 10.2049 27.2335 10.5697 27.2335H11.5392V27.9H10.5072ZM7.33303 20.3515V19.685H11.5392V20.3515H7.33303ZM11.1139 27.9L14.2099 23.746L11.239 19.685H12.1146L14.6946 23.2655L17.2277 19.685H18.119L15.1637 23.7615L18.2441 27.9H17.3684L14.7102 24.2265L12.0208 27.9H11.1139ZM20.7637 27.9C20.159 27.9 19.7056 27.7553 19.4033 27.466C19.1114 27.1767 18.9655 26.7427 18.9655 26.164V17.763H19.7161V26.133C19.7161 26.536 19.8099 26.8202 19.9975 26.9855C20.1852 27.1508 20.4614 27.2335 20.8262 27.2335H21.7957V27.9H20.7637ZM17.5895 20.3515V19.685H21.7957V20.3515H17.5895ZM25.2125 28.086C24.4307 28.086 23.7635 27.9 23.211 27.528C22.669 27.1457 22.2572 26.629 21.9758 25.978C21.6943 25.327 21.5536 24.5985 21.5536 23.7925C21.5536 22.9865 21.6891 22.2632 21.9601 21.6225C22.2416 20.9715 22.6481 20.4548 23.1798 20.0725C23.7218 19.6902 24.3785 19.499 25.1499 19.499C25.9214 19.499 26.5676 19.685 27.0888 20.057C27.6205 20.429 28.0218 20.9353 28.2928 21.576C28.5743 22.2063 28.715 22.9245 28.715 23.7305V23.9785H22.351C22.3823 25.0428 22.6534 25.8747 23.1641 26.474C23.6854 27.063 24.3681 27.3575 25.2125 27.3575C25.8901 27.3575 26.4425 27.1973 26.8699 26.877C27.2974 26.5463 27.5892 26.1175 27.7456 25.5905L28.5587 25.6525C28.3502 26.3552 27.9541 26.939 27.3703 27.404C26.7865 27.8587 26.0672 28.086 25.2125 28.086ZM22.351 23.312H27.8863C27.8446 22.3407 27.584 21.5863 27.1045 21.049C26.6354 20.5013 25.9839 20.2275 25.1499 20.2275C24.3577 20.2275 23.7114 20.5013 23.211 21.049C22.7107 21.5863 22.424 22.3407 22.351 23.312ZM32.2636 28.086C31.4818 28.086 30.8198 27.9 30.2778 27.528C29.7462 27.1457 29.3396 26.629 29.0582 25.978C28.7871 25.327 28.6516 24.5985 28.6516 23.7925C28.6516 22.9865 28.7871 22.2632 29.0582 21.6225C29.3396 20.9715 29.7462 20.4548 30.2778 20.0725C30.8198 19.6902 31.4818 19.499 32.2636 19.499C32.8891 19.499 33.4311 19.6178 33.8898 19.8555C34.3589 20.0932 34.7394 20.4187 35.0313 20.832C35.3231 21.2453 35.5316 21.7258 35.6567 22.2735L34.8593 22.3355C34.7029 21.6638 34.4058 21.1472 33.968 20.7855C33.5302 20.4135 32.962 20.2275 32.2636 20.2275C31.3984 20.2275 30.7104 20.5478 30.1996 21.1885C29.6993 21.8188 29.4491 22.6868 29.4491 23.7925C29.4491 24.8982 29.6993 25.7713 30.1996 26.412C30.7104 27.0423 31.3984 27.3575 32.2636 27.3575C32.962 27.3575 33.5406 27.1612 33.9993 26.7685C34.458 26.3758 34.755 25.8178 34.8905 25.0945L35.688 25.1565C35.5733 25.7248 35.3649 26.2312 35.0625 26.6755C34.7707 27.1095 34.3849 27.4557 33.9054 27.714C33.4364 27.962 32.8891 28.086 32.2636 28.086ZM36.0221 27.9V16.895H36.7726V21.793L36.6788 21.7775C36.7413 21.2712 36.9029 20.8475 37.1635 20.5065C37.4346 20.1655 37.7733 19.9123 38.1799 19.747C38.5864 19.5817 39.0295 19.499 39.509 19.499C40.124 19.499 40.6348 19.6385 41.0413 19.9175C41.4479 20.1862 41.7502 20.5582 41.9482 21.0335C42.1464 21.4985 42.2453 22.0255 42.2453 22.6145V27.9H41.4948V22.9865C41.4948 22.1288 41.328 21.452 40.9944 20.956C40.6609 20.4497 40.1084 20.1965 39.337 20.1965C38.5448 20.1965 37.9193 20.4497 37.4606 20.956C37.002 21.4623 36.7726 22.1392 36.7726 22.9865V27.9H36.0221ZM43.1354 27.9V19.685H43.8391L43.8703 21.886L43.7609 21.8395C43.8338 21.3228 44.0058 20.894 44.2769 20.553C44.5479 20.2017 44.8815 19.9382 45.2776 19.7625C45.6842 19.5868 46.1271 19.499 46.6067 19.499C47.2322 19.499 47.7482 19.6385 48.1547 19.9175C48.5612 20.1965 48.8635 20.5737 49.0616 21.049C49.2596 21.514 49.3587 22.0358 49.3587 22.6145V27.9H48.6082V22.9865C48.6082 22.4285 48.5352 21.9428 48.3892 21.5295C48.2433 21.1058 48.014 20.7803 47.7013 20.553C47.3885 20.3153 46.9715 20.1965 46.4503 20.1965C45.6685 20.1965 45.0431 20.4497 44.574 20.956C44.1153 21.4623 43.886 22.1392 43.886 22.9865V27.9H43.1354ZM53.4357 28.086C52.7059 28.086 52.07 27.9103 51.528 27.559C50.9859 27.2077 50.5637 26.7117 50.2615 26.071C49.9695 25.4303 49.8237 24.6708 49.8237 23.7925C49.8237 22.9142 49.9695 22.1547 50.2615 21.514C50.5637 20.8733 50.9859 20.3773 51.528 20.026C52.07 19.6747 52.7059 19.499 53.4357 19.499C54.1653 19.499 54.8012 19.6747 55.3433 20.026C55.8853 20.3773 56.3023 20.8733 56.5942 21.514C56.8964 22.1547 57.0477 22.9142 57.0477 23.7925C57.0477 24.6708 56.8964 25.4303 56.5942 26.071C56.3023 26.7117 55.8853 27.2077 55.3433 27.559C54.8012 27.9103 54.1653 28.086 53.4357 28.086ZM53.4357 27.3575C54.3113 27.3575 54.9993 27.0423 55.4996 26.412C56 25.7713 56.2502 24.8982 56.2502 23.7925C56.2502 22.6868 56 21.8188 55.4996 21.1885C54.9993 20.5478 54.3113 20.2275 53.4357 20.2275C52.56 20.2275 51.872 20.5478 51.3717 21.1885C50.8713 21.8188 50.6211 22.6868 50.6211 23.7925C50.6211 24.8982 50.8713 25.7713 51.3717 26.412C51.872 27.0423 52.56 27.3575 53.4357 27.3575ZM59.0595 27.9C58.6217 27.9 58.2777 27.7915 58.0275 27.5745C57.7773 27.3472 57.6522 27.0062 57.6522 26.5515V16.895H58.4028V26.5205C58.4028 26.7478 58.4653 26.9235 58.5904 27.0475C58.7259 27.1715 58.9188 27.2335 59.169 27.2335H59.7319V27.9H59.0595ZM63.0966 28.086C62.3669 28.086 61.731 27.9103 61.1889 27.559C60.6469 27.2077 60.2247 26.7117 59.9224 26.071C59.6305 25.4303 59.4846 24.6708 59.4846 23.7925C59.4846 22.9142 59.6305 22.1547 59.9224 21.514C60.2247 20.8733 60.6469 20.3773 61.1889 20.026C61.731 19.6747 62.3669 19.499 63.0966 19.499C63.8262 19.499 64.4622 19.6747 65.0042 20.026C65.5462 20.3773 65.9633 20.8733 66.2551 21.514C66.5575 22.1547 66.7086 22.9142 66.7086 23.7925C66.7086 24.6708 66.5575 25.4303 66.2551 26.071C65.9633 26.7117 65.5462 27.2077 65.0042 27.559C64.4622 27.9103 63.8262 28.086 63.0966 28.086ZM63.0966 27.3575C63.9722 27.3575 64.6602 27.0423 65.1606 26.412C65.6609 25.7713 65.9111 24.8982 65.9111 23.7925C65.9111 22.6868 65.6609 21.8188 65.1606 21.1885C64.6602 20.5478 63.9722 20.2275 63.0966 20.2275C62.2209 20.2275 61.5329 20.5478 61.0326 21.1885C60.5322 21.8188 60.282 22.6868 60.282 23.7925C60.282 24.8982 60.5322 25.7713 61.0326 26.412C61.5329 27.0423 62.2209 27.3575 63.0966 27.3575ZM70.1931 30.411C69.6094 30.411 69.083 30.3077 68.6139 30.101C68.1553 29.8943 67.78 29.6102 67.488 29.2485C67.2066 28.8868 67.0398 28.4735 66.9877 28.0085L67.7851 27.9465C67.8477 28.4735 68.0822 28.892 68.4888 29.202C68.9058 29.5223 69.4739 29.6825 70.1931 29.6825C71.0375 29.6825 71.6942 29.4603 72.1633 29.016C72.6429 28.582 72.8826 27.9568 72.8826 27.1405V25.637C72.6429 26.195 72.2884 26.6445 71.8193 26.9855C71.3502 27.3265 70.7873 27.497 70.1306 27.497C69.4322 27.497 68.8224 27.3317 68.3011 27.001C67.78 26.6703 67.3734 26.2053 67.0815 25.606C66.7897 24.9963 66.6437 24.2885 66.6437 23.4825C66.6437 22.6868 66.7844 21.9945 67.0659 21.4055C67.3578 20.8062 67.7643 20.3412 68.2855 20.0105C68.8067 19.6695 69.4166 19.499 70.115 19.499C70.7822 19.499 71.3607 19.685 71.8506 20.057C72.3406 20.4187 72.6898 20.8785 72.8982 21.4365V19.685H73.6331V27.1405C73.6331 27.8225 73.4924 28.4063 73.211 28.892C72.9295 29.388 72.5334 29.7652 72.0226 30.0235C71.5118 30.2818 70.902 30.411 70.1931 30.411ZM70.1462 26.7685C70.9698 26.7685 71.6265 26.474 72.1164 25.885C72.6168 25.296 72.8722 24.4952 72.8826 23.4825C72.8826 22.8418 72.768 22.2787 72.5386 21.793C72.3197 21.297 72.0018 20.9147 71.5848 20.646C71.1782 20.367 70.6987 20.2275 70.1462 20.2275C69.3123 20.2275 68.6504 20.522 68.1604 21.111C67.6809 21.6897 67.4411 22.4802 67.4411 23.4825C67.4411 24.4952 67.6862 25.296 68.1761 25.885C68.666 26.474 69.3227 26.7685 70.1462 26.7685ZM74.6403 27.9V19.685H75.3908V27.9H74.6403ZM74.609 18.2435V17.019H75.4221V18.2435H74.609ZM79.5515 28.086C78.7697 28.086 78.1023 27.9 77.5498 27.528C77.0078 27.1457 76.596 26.629 76.3145 25.978C76.0331 25.327 75.8924 24.5985 75.8924 23.7925C75.8924 22.9865 76.0279 22.2632 76.2989 21.6225C76.5804 20.9715 76.9869 20.4548 77.5185 20.0725C78.0607 19.6902 78.7173 19.499 79.489 19.499C80.2598 19.499 80.9064 19.685 81.4279 20.057C81.9595 20.429 82.3606 20.9353 82.6319 21.576C82.9133 22.2063 83.0541 22.9245 83.0541 23.7305V23.9785H76.6898C76.7211 25.0428 76.9921 25.8747 77.5029 26.474C78.0241 27.063 78.7071 27.3575 79.5515 27.3575C80.2286 27.3575 80.7813 27.1973 81.209 26.877C81.6358 26.5463 81.9282 26.1175 82.0846 25.5905L82.8977 25.6525C82.6889 26.3552 82.2926 26.939 81.7093 27.404C81.1253 27.8587 80.406 28.086 79.5515 28.086ZM76.6898 23.312H82.2253C82.1831 22.3407 81.9228 21.5863 81.4435 21.049C80.9744 20.5013 80.3224 20.2275 79.489 20.2275C78.6962 20.2275 78.0502 20.5013 77.5498 21.049C77.0495 21.5863 76.7628 22.3407 76.6898 23.312ZM86.4307 28.086C85.7318 28.086 85.1329 27.9723 84.6325 27.745C84.1322 27.5073 83.7413 27.1922 83.4598 26.7995C83.1784 26.3965 83.022 25.9418 82.9907 25.4355L83.7725 25.358C83.8241 25.9573 84.0798 26.443 84.5387 26.815C84.9969 27.1767 85.6278 27.3575 86.4307 27.3575C87.1703 27.3575 87.7387 27.2335 88.1351 26.9855C88.5307 26.7272 88.7293 26.3448 88.7293 25.8385C88.7293 25.5698 88.6667 25.3373 88.5416 25.141C88.4267 24.9447 88.1867 24.7742 87.8224 24.6295C87.4573 24.4745 86.9045 24.335 86.1649 24.211C85.3831 24.0767 84.778 23.9113 84.3511 23.715C83.9336 23.5083 83.642 23.2603 83.4755 22.971C83.3191 22.6713 83.2409 22.3148 83.2409 21.9015C83.2409 21.1885 83.5012 20.6098 84.0227 20.1655C84.5544 19.7212 85.2682 19.499 86.1649 19.499C86.7904 19.499 87.3165 19.6127 87.7442 19.84C88.182 20.0673 88.5307 20.3722 88.7918 20.7545C89.0522 21.1265 89.2242 21.5398 89.3078 21.9945L88.526 22.0875C88.4736 21.7568 88.3485 21.452 88.1507 21.173C87.9631 20.8837 87.702 20.6563 87.3689 20.491C87.0351 20.3153 86.634 20.2275 86.1649 20.2275C85.4972 20.2275 84.9765 20.3722 84.6013 20.6615C84.226 20.9508 84.0384 21.359 84.0384 21.886C84.0384 22.2167 84.1056 22.4853 84.2416 22.692C84.3769 22.8987 84.6169 23.0692 84.9609 23.2035C85.3049 23.3275 85.7842 23.4412 86.3995 23.5445C87.2016 23.6788 87.8271 23.8442 88.2758 24.0405C88.7238 24.2368 89.042 24.4797 89.2296 24.769C89.4173 25.0583 89.5111 25.4097 89.5111 25.823C89.5111 26.3087 89.386 26.722 89.1358 27.063C88.8856 27.3937 88.5307 27.6468 88.0725 27.8225C87.6136 27.9982 87.0663 28.086 86.4307 28.086Z"
                  fill="#4E4E4E"
                />
              </g>
              <defs>
                <clipPath id="clip0_42_267">
                  <rect width="129" height="31" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div
            className="h-full flex items-center justify-between px-5"
            style={{ width: "calc(100% - 264px)" }}
          >
            <div>
              <h1 className="font-[400] text-base flex gap-2 items-center">
                <Boxes size="18px" strokeWidth={1.5} /> Events{" "}
                <ChevronRight className="text-neutral-600" />{" "}
                <p className="font-[500]">
                  {fetching.mainEvent
                    ? "Getting event information..."
                    : currEvent.name}
                </p>
              </h1>
            </div>
            <div className="flex gap-2 h-full py-3 border-l-2 border-neutral-100 pl-5 px-3">
              <Notifications />
              <Avatar />
            </div>
          </div>
        </nav>
        <section className="flex" style={{ height: "calc(100vh - 60px)" }}>
          <aside className="w-[264px] bg-neutral-50 h-full flex flex-col justify-between py-5">
            <ul className="flex flex-col gap-2 px-3 ">
              <li
                onClick={() => router.push("/dashboard")}
                className="mt-2 py-2 text-neutral-700 hover:bg-neutral-100 px-4 rounded-lg flex gap-2 items-center"
              >
                <ArrowLeft size="18px" />
                Go To Dashboard
              </li>
              <li
                onClick={() => {
                  modal.info(
                    "Unavailable",
                    "This feature is still in development, please wait for the next version of Eventra.",
                    () => {},
                    () => {},
                    "Okay",
                    "",
                    <AlertTriangle />,
                    "initial"
                  );
                }}
                className="py-2 text-neutral-700 hover:bg-neutral-100 px-4 rounded-lg flex gap-2 items-center"
              >
                <Pencil size="18px" />
                Edit Event
              </li>

              <li
                onClick={() => setQrScanner(true)}
                className="py-2 text-neutral-700 hover:bg-neutral-100 px-4 rounded-lg flex gap-2 items-center"
              >
                <QrCode size="18px" />
                Scan E-Mail QR
              </li>
            </ul>

            <ul className="flex flex-col gap-2 pt-5 border-t-2 border-neutral-200 px-3 ">
              <li
                onClick={() => {
                  modal.info(
                    "Unavailable",
                    "This feature is still in development, please wait for the next version of Eventra.",
                    () => {},
                    () => {},
                    "Okay",
                    "",
                    <AlertTriangle />,
                    "initial"
                  );
                }}
                className="py-2 text-neutral-700 hover:bg-neutral-100 px-4 rounded-lg flex gap-2 items-center"
              >
                <Trash size="18px" />
                Delete Event
              </li>
            </ul>
          </aside>
          <div
            className="h-full bg-neutral-100 flex justify-center pt-5 px-5 overflow-y-scroll"
            style={{ width: "calc(100vw - 264px)" }}
          >
            <div className="h-full w-full">
              <div className="grid grid-cols-3 gap-2">
                <div className="relative h-[250px] p-5 col-span-1 bg-white shadow-sm shadow-neutral-50 rounded-md geist overflow-hidden">
                  {!fetching.mainEvent && (
                    <>
                      <div className="relative z-[2]">
                        {currEvent.status === "Upcoming" ? (
                          <div className="text-white flex items-center gap-3 text-xs">
                            <div className="circle h-[12px] w-[12px] rounded-full bg-yellow-600"></div>
                            {currEvent.status}
                          </div>
                        ) : currEvent.status === "Ongoing" ? (
                          <div className="text-white flex items-center gap-3 text-xs">
                            <div className="circle h-[12px] w-[12px] rounded-full bg-emerald-600"></div>
                            {currEvent.status}
                          </div>
                        ) : (
                          <div className="text-white flex items-center gap-3 text-xs">
                            <div className="circle h-[12px] w-[12px] rounded-full bg-red-600"></div>
                            {currEvent.status}
                          </div>
                        )}
                        <h1 className="text-2xl text-white font-[500] mt-1">
                          {currEvent.name}
                        </h1>
                        <p className="text-neutral-100 text-sm">
                          {moment
                            .unix(currEvent.date)
                            .utcOffset(currEvent.offset * -1)
                            .format("dddd, MMM DD, YYYY")}{" "}
                          :{" "}
                          {moment
                            .unix(currEvent.startT)
                            .utcOffset(currEvent.offset * -1)
                            .format("hh:mm A")}
                          {" - "}
                          {moment
                            .unix(currEvent.endT)
                            .utcOffset(currEvent.offset * -1)
                            .format("hh:mm A")}
                          {" / "}
                          {currEvent.location}
                        </p>
                        <p className="text-neutral-100 text-sm flex items-center gap-2 mt-2">
                          <Users size="15px" /> Capacity:{" "}
                          {currEvent.attendeeLim} atendees
                        </p>
                        {currEvent.allowWalkIn && (
                          <p className="text-neutral-100 text-sm flex items-center gap-2 mt-2">
                            <CircleCheck size="15px" /> Walk-in is allowed.
                          </p>
                        )}

                        {!currEvent.allowWalkIn && (
                          <p className="text-neutral-100 text-sm flex items-center gap-2 mt-2">
                            <CircleX size="15px" /> Walk-in is not allowed.
                          </p>
                        )}
                      </div>
                      <div className="absolute top-0 right-0 w-full h-full z-[1]">
                        <img
                          src={currEvent.coverFile}
                          alt=""
                          className="h-full w-full object-cover brightness-30"
                        />
                      </div>
                    </>
                  )}
                  {fetching.mainEvent && (
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
                <div className="h-[250px] col-span-1 bg-white shadow-sm shadow-neutral-50 rounded-md px-5 py-3 flex gap-2 flex-col">
                  <OrdEvRegLineAnalytics
                    isFetching={fetching.lineAnalytics}
                    data={rpdOrd}
                  />
                </div>
                <div className="h-[250px] col-span-1 bg-white shadow-sm shadow-neutral-50 rounded-md px-5 py-3 flex gap-2 flex-col">
                  <OrdEvRegPieAnalytics
                    isFetching={fetching.pieAnalytics}
                    data={ioutOrd}
                  />
                </div>

                <div className="col-span-3 bg-white min-h-[500px] shadow-sm shadow-neutral-50 rounded-md p-5">
                  <OrdEvAttendees
                    fetching={fetching.atendees}
                    data={attendees}
                    evName={currEvent.name}
                    refetchAtendees={() => {
                      refetchAtendees();
                    }}
                    currentSortMethod={currentSortMethod} // current sort method
                    onChangeSortMethod={(st) => setCurrentSortMethod(st)} // change sort method
                    search={search} // current search value
                    setSearch={(st) => setSearch(st)} // search bar callback change str
                    currPage={currPage} // pagination, current page
                    dataSize={atnSize} // pagination, how many attendees have been fetched?
                    limit={atnLimit} // pagination limit
                    onPageNumberClick={(d) => setCurrPage(d)} // refetch atendees on page number click, fetching is centralized to the parent for centralized loading
                    evId={currEvent.id}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
