import {
    ArrowLeftRight,
    ArrowUpRight,
    ChevronDown,
    ChevronRight,
    ChevronUp,
    HomeIcon,
    Plus,
    QrCode,
} from "lucide-react";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {useDispatch, useSelector} from "react-redux";
import {resetApp, selectApp} from "@/features/appSlice";
import {AppDispatch} from "@/features/store";
import axios from "axios";
import {useSecureRoute} from "@/hooks/UseSecureRoute";
import {useClickOutside} from "@/hooks/UseClickOutside";
import moment from "moment";
import {CircularProgress} from "@mui/material";
import Head from "next/head";

interface SubMenu {
    user: boolean;
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
}

export default function BizMatch() {
    const [fetching, setFetching] = useState<boolean>(true);
    const [render, setRender] = useState<boolean>(false);
    const usecure = useSecureRoute(() => setRender(true));
    const appData = useSelector(selectApp);
    const dispatch = useDispatch<AppDispatch>();

    const [bEvs, setBEvs] = useState<BizEv[]>([]);
    const [openProf, setOpenProf] = useState<boolean>(false);
    const rfx = useClickOutside<HTMLDivElement>(() => {
        setOpenProf(false);
    });

    const [openFilter, setOpenFilter] = useState<boolean>(false);
    const rfx2 = useClickOutside<HTMLDivElement>(() => {
        setOpenFilter(false);
    });

    const router = useRouter();

    const handleLogout = async () => {
        try {
            const req = await axios.post(
                `${process.env.NEXT_PUBLIC_API}/logout`,
                {},
                {withCredentials: true}
            );
            setRender(false);
            dispatch(resetApp());
            router.push("/login");
        } catch (e) {
        }
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
            const req = await axios.post(
                `${process.env.NEXT_PUBLIC_API}/fetch-events?mode=partial-biz`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${appData.acsTok}`,
                    },
                    withCredentials: true,
                }
            );
            const acs = req.data;
            let tmp: BizEv[] = [];
            acs.bz.forEach((bizmatchEvent: any) => {
                const status =
                    moment().unix() < bizmatchEvent.startT._seconds
                        ? "Upcoming"
                        : moment().unix() >= bizmatchEvent.startT._seconds &&
                        moment().unix() <= bizmatchEvent.endT._seconds
                            ? "Ongoing"
                            : "Past";

                tmp.push({
                    status: status,
                    name: bizmatchEvent.name,
                    date: bizmatchEvent.date,
                    startT: bizmatchEvent.startT._seconds,
                    endT: bizmatchEvent.endT._seconds,
                    organizationId: bizmatchEvent.organizationId,
                    lim: bizmatchEvent.lim,
                    offset: bizmatchEvent.timeOffset * -1,
                    timeslotsCount: bizmatchEvent.timeslotsCount,
                    suppliersCount: bizmatchEvent.suppliersCount,
                    type: "BizMatch Event",
                    id: bizmatchEvent.id,
                });
            });

            const shwlx = [...tmp];
            shwlx.sort((a, b) => b.endT - a.endT);
            setBEvs(shwlx);

            setTimeout(() => {
                setFetching(false);
            }, 1000);
        } catch (e) {
        }
    };

    useEffect(() => {
        if (appData.acsTok) {
            fetchEvents();
        }
    }, [appData.acsTok]);

    if (!render) return <></>;

    return (
        <>
            <Head>
                <title>Eventra | BizMatch</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main className="min-h-screen w-full bg-[#f5f6fb]">
                <header
                    className="eventra-container flex bg-[#f5f6fb] justify-between py-5 items-center select-none px-5 sticky top-0 left-0 z-[999]">
                    <div className="logo flex items-center gap-1">
                        <svg
                            width="30"
                            height="39"
                            viewBox="0 0 99 89"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle cx="43.5" cy="36.5" r="25.5" fill="#EE1818"/>
                            <circle cx="62.5" cy="46.5" r="25.5" fill="#FED11C"/>
                            <circle cx="36.5" cy="52.5" r="25.5" fill="#A118FD"/>
                        </svg>

                        <svg
                            width="77"
                            height="39"
                            viewBox="0 0 37 9"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="mx-auto"
                        >
                            <path
                                d="M3.864 8.06C3.208 8.06 2.632 7.924 2.136 7.652C1.64 7.372 1.252 6.992 0.972 6.512C0.692 6.024 0.552 5.468 0.552 4.844C0.552 4.22 0.684 3.668 0.948 3.188C1.22 2.708 1.588 2.332 2.052 2.06C2.524 1.78 3.052 1.64 3.636 1.64C4.228 1.64 4.752 1.776 5.208 2.048C5.672 2.312 6.036 2.688 6.3 3.176C6.564 3.656 6.696 4.212 6.696 4.844C6.696 4.884 6.692 4.928 6.684 4.976C6.684 5.016 6.684 5.06 6.684 5.108H1.2V4.472H6.228L5.892 4.724C5.892 4.268 5.792 3.864 5.592 3.512C5.4 3.152 5.136 2.872 4.8 2.672C4.464 2.472 4.076 2.372 3.636 2.372C3.204 2.372 2.816 2.472 2.472 2.672C2.128 2.872 1.86 3.152 1.668 3.512C1.476 3.872 1.38 4.284 1.38 4.748V4.88C1.38 5.36 1.484 5.784 1.692 6.152C1.908 6.512 2.204 6.796 2.58 7.004C2.964 7.204 3.4 7.304 3.888 7.304C4.272 7.304 4.628 7.236 4.956 7.1C5.292 6.964 5.58 6.756 5.82 6.476L6.3 7.028C6.02 7.364 5.668 7.62 5.244 7.796C4.828 7.972 4.368 8.06 3.864 8.06ZM8.74472 8L5.94872 1.7H6.83672L9.40472 7.544H8.98472L11.5887 1.7H12.4287L9.62072 8H8.74472ZM14.9288 8.06C14.2728 8.06 13.6968 7.924 13.2008 7.652C12.7048 7.372 12.3168 6.992 12.0368 6.512C11.7568 6.024 11.6168 5.468 11.6168 4.844C11.6168 4.22 11.7488 3.668 12.0128 3.188C12.2848 2.708 12.6528 2.332 13.1168 2.06C13.5888 1.78 14.1168 1.64 14.7008 1.64C15.2928 1.64 15.8168 1.776 16.2728 2.048C16.7368 2.312 17.1008 2.688 17.3648 3.176C17.6288 3.656 17.7608 4.212 17.7608 4.844C17.7608 4.884 17.7568 4.928 17.7488 4.976C17.7488 5.016 17.7488 5.06 17.7488 5.108H12.2648V4.472H17.2928L16.9568 4.724C16.9568 4.268 16.8568 3.864 16.6568 3.512C16.4648 3.152 16.2008 2.872 15.8648 2.672C15.5288 2.472 15.1408 2.372 14.7008 2.372C14.2688 2.372 13.8808 2.472 13.5368 2.672C13.1928 2.872 12.9248 3.152 12.7328 3.512C12.5408 3.872 12.4448 4.284 12.4448 4.748V4.88C12.4448 5.36 12.5488 5.784 12.7568 6.152C12.9728 6.512 13.2688 6.796 13.6448 7.004C14.0288 7.204 14.4648 7.304 14.9528 7.304C15.3368 7.304 15.6928 7.236 16.0208 7.1C16.3568 6.964 16.6448 6.756 16.8848 6.476L17.3648 7.028C17.0848 7.364 16.7328 7.62 16.3088 7.796C15.8928 7.972 15.4328 8.06 14.9288 8.06ZM21.5227 1.64C22.0347 1.64 22.4827 1.74 22.8668 1.94C23.2587 2.132 23.5627 2.428 23.7787 2.828C24.0027 3.228 24.1147 3.732 24.1147 4.34V8H23.2627V4.424C23.2627 3.76 23.0947 3.26 22.7587 2.924C22.4307 2.58 21.9667 2.408 21.3667 2.408C20.9187 2.408 20.5267 2.5 20.1907 2.684C19.8627 2.86 19.6067 3.12 19.4227 3.464C19.2467 3.8 19.1587 4.208 19.1587 4.688V8H18.3067V1.7H19.1227V3.428L18.9907 3.104C19.1907 2.648 19.5107 2.292 19.9507 2.036C20.3907 1.772 20.9147 1.64 21.5227 1.64ZM27.2081 8.06C26.6161 8.06 26.1601 7.9 25.8401 7.58C25.5201 7.26 25.3601 6.808 25.3601 6.224V0.308H26.2121V6.176C26.2121 6.544 26.3041 6.828 26.4881 7.028C26.6801 7.228 26.9521 7.328 27.3041 7.328C27.6801 7.328 27.9921 7.22 28.2401 7.004L28.5401 7.616C28.3721 7.768 28.1681 7.88 27.9281 7.952C27.6961 8.024 27.4561 8.06 27.2081 8.06ZM24.2321 2.408V1.7H28.1321V2.408H24.2321ZM28.8911 8V1.7H29.7071V3.416L29.6231 3.116C29.7991 2.636 30.0951 2.272 30.5111 2.024C30.9271 1.768 31.4431 1.64 32.0591 1.64V2.468C32.0271 2.468 31.9951 2.468 31.9631 2.468C31.9311 2.46 31.8991 2.456 31.8671 2.456C31.2031 2.456 30.6831 2.66 30.3071 3.068C29.9311 3.468 29.7431 4.04 29.7431 4.784V8H28.8911ZM35.893 8V6.608L35.857 6.38V4.052C35.857 3.516 35.705 3.104 35.401 2.816C35.105 2.528 34.661 2.384 34.069 2.384C33.661 2.384 33.273 2.452 32.905 2.588C32.537 2.724 32.225 2.904 31.969 3.128L31.585 2.492C31.905 2.22 32.289 2.012 32.737 1.868C33.185 1.716 33.657 1.64 34.153 1.64C34.969 1.64 35.597 1.844 36.037 2.252C36.485 2.652 36.709 3.264 36.709 4.088V8H35.893ZM33.721 8.06C33.249 8.06 32.837 7.984 32.485 7.832C32.141 7.672 31.877 7.456 31.693 7.184C31.509 6.904 31.417 6.584 31.417 6.224C31.417 5.896 31.493 5.6 31.645 5.336C31.805 5.064 32.061 4.848 32.413 4.688C32.773 4.52 33.253 4.436 33.853 4.436H36.025V5.072H33.877C33.269 5.072 32.845 5.18 32.605 5.396C32.373 5.612 32.257 5.88 32.257 6.2C32.257 6.56 32.397 6.848 32.677 7.064C32.957 7.28 33.349 7.388 33.853 7.388C34.333 7.388 34.745 7.28 35.089 7.064C35.441 6.84 35.697 6.52 35.857 6.104L36.049 6.692C35.889 7.108 35.609 7.44 35.209 7.688C34.817 7.936 34.321 8.06 33.721 8.06Z"
                                fill="black"
                            />
                        </svg>
                    </div>
                    <div className="controls inter flex gap-2 text-sm ">
                        <div
                            onClick={() => router.push("/create-event")}
                            className="add-event shadow-sm shadow-neutral-200 cursor-pointer bg-white px-5 py-3 rounded-full flex gap-2 items-center text-neutral-600 hover:bg-emerald-600 hover:text-white transition-colors"
                        >
                            <button>
                                <Plus/>
                            </button>
                            <p className="font-[500]">Create Event</p>
                        </div>
                        <div
                            className="scan-qr shadow-sm shadow-neutral-200 cursor-pointer bg-white px-5 py-3 rounded-full flex gap-2 items-center text-neutral-600 hover:bg-emerald-600 hover:text-white transition-colors">
                            <button>
                                <QrCode/>
                            </button>
                            <p className="font-[500]">Scan QR Code</p>
                        </div>
                        <div
                            className="relative usr-log shadow-sm shadow-neutral-200 bg-white rounded-full px-2 py-3 items-center flex gap-2">
                            <div
                                className="avatar h-[33px] w-[33px] rounded-full overflow-hidden border-2 border-emerald-600">
                                <img src={appData.logo} alt="" className="h-full w-full"/>
                            </div>
                            <p className="font-[500] text-sm">{appData.org_name}</p>
                            <button className="text-neutral-600">
                                {!openProf ? (
                                    <ChevronDown onClick={() => setOpenProf(true)}/>
                                ) : (
                                    <ChevronUp onClick={() => setOpenProf(false)}/>
                                )}
                            </button>
                            <AnimatePresence>
                                {openProf && (
                                    <motion.div
                                        initial={{y: 10, opacity: 0}}
                                        animate={{y: 0, opacity: 1}}
                                        exit={{y: 10, opacity: 0}}
                                        key={1}
                                        className="absolute top-[120%] right-0 bg-white rounded-2xl w-[400px] overflow-hidden"
                                        ref={rfx}
                                    >
                                        <div
                                            className="py-5 px-5 flex gap-2 items-center border-b-1 border-neutral-200">
                                            <div
                                                className="avatar h-[33px] w-[33px] rounded-full overflow-hidden border-2 border-emerald-600">
                                                <img
                                                    src={appData.logo}
                                                    alt=""
                                                    className="h-full w-full"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-[500]">{appData.org_name}</p>
                                                <p className="text-xs">{appData.country}</p>
                                            </div>
                                        </div>
                                        <ul className="flex gap-1 flex-col p-2">
                                            <li className="py-3 px-5 rounded-2xl hover:bg-neutral-50 cursor-pointer">
                                                Manage
                                            </li>
                                            <li
                                                className="py-3 px-5  rounded-2xl hover:bg-neutral-50 text-red-600 font-[500] cursor-pointer"
                                                onClick={() => handleLogout()}
                                            >
                                                Log Out
                                            </li>
                                        </ul>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>
                <section className="eventra-container inter px-5 pb-5">
                    <div className="flex gap-5 mt-5">
                        <nav className="side-navi w-full max-w-[300px] select-none mt-18">
                            <ul className="flex flex-col gap-2 text-sm">
                                <li
                                    onClick={() => router.push("/dashboard")}
                                    className="font-[500]  hover:bg-neutral-50 transition-colors flex items-center px-7 py-4 shadow-sm shadow-neutral-200 rounded-full gap-2 bg-white text-neutral-600 cursor-pointer"
                                >
                                    <HomeIcon size="20px"/> Dashboard
                                </li>
                                <li
                                    onClick={() => router.push("/events")}
                                    className="font-[500]  hover:bg-neutral-50 transition-colors flex items-center px-7 py-4 shadow-sm shadow-neutral-200 rounded-full gap-2 bg-white text-neutral-600 cursor-pointer"
                                >
                                    <ArrowUpRight size="20px"/> Events
                                </li>
                                <li className="font-[500]  flex items-center px-7 py-4 shadow-sm shadow-neutral-200 rounded-full gap-2 bg-emerald-600 text-white cursor-pointer">
                                    <ArrowLeftRight size="20px"/> BizMatch
                                </li>
                            </ul>
                        </nav>
                        <div className="main-dash w-full">
                            <h1 className="text-2xl font-[600]">BizMatch</h1>
                            <div className="dash-start mt-10">
                                <div
                                    className="w-full min-h-[600px] mt-5 rounded-2xl p-5  bg-white shadow-sm shadow-neutral-200">
                                    <div className="flex justify-between items-center">
                                        <h1 className="text-sm font-[500]">All BizMatch Events</h1>
                                        <div className="filters text-xs  flex gap-1 items-center select-none">
                                            <div className=" relative ">
                                                {!openFilter ? (
                                                    <div
                                                        onClick={() => setOpenFilter(true)}
                                                        className="cursor-pointer flex gap-1 items-center hover:bg-neutral-50 hover:text-emerald-600 py-1 px-2 border-1 border-neutral-100 rounded-full "
                                                    >
                                                        <div className="icon">
                                                            <svg
                                                                width="33"
                                                                height="10"
                                                                viewBox="0 0 33 20"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <circle cx="10" cy="10" r="10" fill="#E7000B"/>
                                                                <ellipse
                                                                    cx="16.5"
                                                                    cy="10"
                                                                    rx="10.5"
                                                                    ry="10"
                                                                    fill="#D08700"
                                                                />
                                                                <circle cx="23" cy="10" r="10" fill="#009966"/>
                                                            </svg>
                                                        </div>
                                                        All Statuses
                                                        <ChevronDown size="12px"/>
                                                    </div>
                                                ) : (
                                                    <div
                                                        onClick={() => setOpenFilter(false)}
                                                        className="cursor-pointer flex gap-1 items-center hover:bg-neutral-50 hover:text-emerald-600 py-1 px-2 border-1 border-neutral-100 rounded-full "
                                                    >
                                                        <div className="icon">
                                                            <svg
                                                                width="33"
                                                                height="10"
                                                                viewBox="0 0 33 20"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <circle cx="10" cy="10" r="10" fill="#E7000B"/>
                                                                <ellipse
                                                                    cx="16.5"
                                                                    cy="10"
                                                                    rx="10.5"
                                                                    ry="10"
                                                                    fill="#D08700"
                                                                />
                                                                <circle cx="23" cy="10" r="10" fill="#009966"/>
                                                            </svg>
                                                        </div>
                                                        All Statuses
                                                        <ChevronUp size="12px"/>
                                                    </div>
                                                )}
                                                <AnimatePresence>
                                                    {openFilter && (
                                                        <motion.div
                                                            initial={{y: 10, opacity: 0}}
                                                            animate={{y: 0, opacity: 1}}
                                                            exit={{y: 10, opacity: 0}}
                                                            key={1}
                                                            ref={rfx2}
                                                            className="absolute top-[120%] right-0 w-[200px] px-2 py-1 rounded-lg bg-white shadow-sm shadow-neutral-200"
                                                        >
                                                            <ul>
                                                                <li className="cursor-pointer px-3 py-1.5 hover:bg-neutral-50 rounded-md flex items-center gap-1">
                                                                    <div className="icon">
                                                                        <svg
                                                                            width="25"
                                                                            height="10"
                                                                            viewBox="0 0 33 20"
                                                                            fill="none"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                        >
                                                                            <circle
                                                                                cx="10"
                                                                                cy="10"
                                                                                r="10"
                                                                                fill="#E7000B"
                                                                            />
                                                                            <ellipse
                                                                                cx="16.5"
                                                                                cy="10"
                                                                                r="10"
                                                                                ry="10"
                                                                                fill="#D08700"
                                                                            />
                                                                            <circle
                                                                                cx="23"
                                                                                cy="10"
                                                                                r="10"
                                                                                fill="#009966"
                                                                            />
                                                                        </svg>
                                                                    </div>
                                                                    All Statuses
                                                                </li>
                                                                <li className="cursor-pointer px-3 py-1.5 hover:bg-neutral-50 rounded-md flex items-center gap-1">
                                                                    <div className="icon">
                                                                        <svg
                                                                            width="10"
                                                                            height="10"
                                                                            viewBox="0 0 20 20"
                                                                            fill="none"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                        >
                                                                            <circle
                                                                                cx="10"
                                                                                cy="10"
                                                                                r="10"
                                                                                fill="#009966"
                                                                            />
                                                                        </svg>
                                                                    </div>
                                                                    Ongoing
                                                                </li>
                                                                <li className="cursor-pointer px-3 py-1.5 hover:bg-neutral-50 rounded-md flex items-center gap-1">
                                                                    <div className="icon">
                                                                        <svg
                                                                            width="10"
                                                                            height="10"
                                                                            viewBox="0 0 20 20"
                                                                            fill="none"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                        >
                                                                            <circle
                                                                                cx="10"
                                                                                cy="10"
                                                                                r="10"
                                                                                fill="#D08700"
                                                                            />
                                                                        </svg>
                                                                    </div>
                                                                    Upcoming
                                                                </li>
                                                                <li className="cursor-pointer px-3 py-1.5 hover:bg-neutral-50 rounded-md flex items-center gap-1">
                                                                    <div className="icon">
                                                                        <svg
                                                                            width="10"
                                                                            height="10"
                                                                            viewBox="0 0 20 20"
                                                                            fill="none"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                        >
                                                                            <circle
                                                                                cx="10"
                                                                                cy="10"
                                                                                r="10"
                                                                                fill="#E7000B"
                                                                            />
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
                                    {fetching && (
                                        <>
                                            <div className="loading h-full w-full grid place-content-center">
                                                <CircularProgress disableShrink/>
                                            </div>
                                        </>
                                    )}
                                    {!fetching && (
                                        <div className="events flex flex-col gap-1 mt-2">
                                            {bEvs.length === 0 ? (
                                                <p className="text-center">You have no events.</p>
                                            ) : (
                                                bEvs.map((d, i) => {
                                                    return (
                                                        <>
                                                            <div
                                                                className="event flex justify-between items-center px-4 py-3 border-1 border-neutral-100 rounded-md">
                                                                <div>
                                                                    <h1 className="text-sm font-[500]">
                                                                        {d.name}
                                                                    </h1>
                                                                    <p className="text-xs">
                                                                        {" "}
                                                                        {getFormattedTime(
                                                                            d.startT,
                                                                            d.offset
                                                                        )} - {getFormattedTime(d.endT, d.offset)}{" "}
                                                                        (GMT
                                                                        {d.offset / 60 >= 0
                                                                            ? `+${d.offset / 60}`
                                                                            : d.offset / 60}
                                                                        )
                                                                    </p>
                                                                </div>
                                                                <div className="flex items-end flex-col justify-center">
                                                                    <p className="status p-1.5 text-sm">
                                                                        {d.status === "Upcoming" ? (
                                                                            <div
                                                                                className="registered border-1 border-neutral-100 shadow-sm shadow-neutral-50 text-xs  px-3 py-1 text-black rounded-full w-max flex gap-2 items-center">
                                                                                <div
                                                                                    className="circle h-[12px] w-[12px] rounded-full bg-yellow-600"></div>
                                                                                {d.status}
                                                                            </div>
                                                                        ) : d.status === "Ongoing" ? (
                                                                            <div
                                                                                className="registered border-1 border-neutral-100 shadow-sm shadow-neutral-50 text-xs  px-3 py-1 text-black rounded-full w-max flex gap-2 items-center">
                                                                                <div
                                                                                    className="circle h-[12px] w-[12px] rounded-full bg-emerald-600"></div>
                                                                                {d.status}
                                                                            </div>
                                                                        ) : (
                                                                            <div
                                                                                className="registered border-1 border-neutral-100 shadow-sm shadow-neutral-50 text-xs  px-3 py-1 text-black rounded-full w-max flex gap-2 items-center">
                                                                                <div
                                                                                    className="circle h-[12px] w-[12px] rounded-full bg-red-600"></div>
                                                                                {d.status}
                                                                            </div>
                                                                        )}
                                                                    </p>
                                                                    <ChevronRight size="15px"/>
                                                                </div>
                                                            </div>
                                                        </>
                                                    );
                                                })
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div
                            className=" w-full max-w-[400px] max-h-[500px] bg-white mt-18 rounded-2xl shadow-sm shadow-neutral-200">
                            <div className="p-5 h-full">
                                <h1 className="text-sm font-[500]">Activity</h1>
                                {fetching && (
                                    <>
                                        {" "}
                                        <div className="loading h-full w-full grid place-content-center">
                                            <CircularProgress disableShrink/>
                                        </div>
                                    </>
                                )}
                                {!fetching && (
                                    <div className="activities mt-2">
                                        <div
                                            className="activity flex gap-5 items-center bg-white border-1 border-neutral-100 shadow-sm shadow-neutral-50 px-4 py-3 rounded-xl">
                                            <div
                                                className="icon rounded-full p-3 border-1 border-neutral-200 bg-emerald-600 w-max text-emerald-100">
                                                <Plus size="15px" strokeWidth="4px"/>
                                            </div>
                                            <div>
                                                <p className="text-sm font-[500]">Registration</p>
                                                <p className="text-xs">
                                                    Charl Concepcion has registered on event "VINCEOLEO
                                                    Philippines"
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
