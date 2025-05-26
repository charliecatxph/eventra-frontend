import {selectApp} from "@/features/appSlice";
import {useModal} from "@/components/Modal/ModalContext";
import {CircularProgress} from "@mui/material";
import axios from "axios";
import {
    Briefcase,
    Check,
    Download,
    Eye,
    FileQuestion,
    HomeIcon,
    Mail,
    Pencil,
    Phone,
    Printer,
    RefreshCcw,
    Search,
    Trash,
    User,
    X,
} from "lucide-react";
import moment from "moment";
import {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {printQR} from "../../ViewEv_Deps/printQr";
import type {AttendeeOrdSPCAdmin, EditAttendee as EditAttendeeStruct} from "@/interfaces/Interface"
import SortButton from "./SortButton";
import EventraPagination from "./Pagination";
import Link from "next/link";
import EditAttendee from "@/components/ViewOrdinaryEvent/AtendeeTable/EditAttendee";
import ViewAttendee from "@/components/ViewOrdinaryEvent/AtendeeTable/ViewAttendee";
import DataExportPopup from "@/components/ViewOrdinaryEvent/AtendeeTable/DataExportPopup";
import {
    ordinaryEventData,
    setAttendees,
    setEvent,
    setFetching,
    setLineChartData,
    setPageNumber,
    setPieChartData,
    setRequestLimit,
    setSearchQuery,
    setTotalAttendeeSize,
    setTotalRegistered
} from "@/features/ordinaryEventSlice";
import {useRouter} from "next/router";
import {AnimatePresence, motion} from 'framer-motion'
import fetchEventData from "@/functions/fetchEventData";

const countriesKV = {
    AF: "Afghanistan",
    AL: "Albania",
    DZ: "Algeria",
    AD: "Andorra",
    AO: "Angola",
    AG: "Antigua and Barbuda",
    AR: "Argentina",
    AM: "Armenia",
    AU: "Australia",
    AT: "Austria",
    AZ: "Azerbaijan",
    BS: "Bahamas",
    BH: "Bahrain",
    BD: "Bangladesh",
    BB: "Barbados",
    BY: "Belarus",
    BE: "Belgium",
    BZ: "Belize",
    BJ: "Benin",
    BT: "Bhutan",
    BO: "Bolivia",
    BA: "Bosnia and Herzegovina",
    BW: "Botswana",
    BR: "Brazil",
    BN: "Brunei",
    BG: "Bulgaria",
    BF: "Burkina Faso",
    BI: "Burundi",
    KH: "Cambodia",
    CM: "Cameroon",
    CA: "Canada",
    CV: "Cape Verde",
    CF: "Central African Republic",
    TD: "Chad",
    CL: "Chile",
    CN: "China",
    CO: "Colombia",
    KM: "Comoros",
    CD: "Congo (Democratic Republic)",
    CG: "Congo (Republic)",
    CR: "Costa Rica",
    HR: "Croatia",
    CU: "Cuba",
    CY: "Cyprus",
    CZ: "Czech Republic",
    DK: "Denmark",
    DJ: "Djibouti",
    DM: "Dominica",
    DO: "Dominican Republic",
    EC: "Ecuador",
    EG: "Egypt",
    SV: "El Salvador",
    GQ: "Equatorial Guinea",
    ER: "Eritrea",
    EE: "Estonia",
    SZ: "Eswatini",
    ET: "Ethiopia",
    FJ: "Fiji",
    FI: "Finland",
    FR: "France",
    GA: "Gabon",
    GM: "Gambia",
    GE: "Georgia",
    DE: "Germany",
    GH: "Ghana",
    GR: "Greece",
    GD: "Grenada",
    GT: "Guatemala",
    GN: "Guinea",
    GW: "Guinea-Bissau",
    GY: "Guyana",
    HT: "Haiti",
    HN: "Honduras",
    HU: "Hungary",
    IS: "Iceland",
    IN: "India",
    ID: "Indonesia",
    IR: "Iran",
    IQ: "Iraq",
    IE: "Ireland",
    IL: "Israel",
    IT: "Italy",
    CI: "Ivory Coast",
    JM: "Jamaica",
    JP: "Japan",
    JO: "Jordan",
    KZ: "Kazakhstan",
    KE: "Kenya",
    KI: "Kiribati",
    KW: "Kuwait",
    KG: "Kyrgyzstan",
    LA: "Laos",
    LV: "Latvia",
    LB: "Lebanon",
    LS: "Lesotho",
    LR: "Liberia",
    LY: "Libya",
    LI: "Liechtenstein",
    LT: "Lithuania",
    LU: "Luxembourg",
    MG: "Madagascar",
    MW: "Malawi",
    MY: "Malaysia",
    MV: "Maldives",
    ML: "Mali",
    MT: "Malta",
    MH: "Marshall Islands",
    MR: "Mauritania",
    MU: "Mauritius",
    MX: "Mexico",
    FM: "Micronesia",
    MD: "Moldova",
    MC: "Monaco",
    MN: "Mongolia",
    ME: "Montenegro",
    MA: "Morocco",
    MZ: "Mozambique",
    MM: "Myanmar",
    NA: "Namibia",
    NR: "Nauru",
    NP: "Nepal",
    NL: "Netherlands",
    NZ: "New Zealand",
    NI: "Nicaragua",
    NE: "Niger",
    NG: "Nigeria",
    MK: "North Macedonia",
    NO: "Norway",
    OM: "Oman",
    PK: "Pakistan",
    PW: "Palau",
    PS: "Palestine",
    PA: "Panama",
    PG: "Papua New Guinea",
    PY: "Paraguay",
    PE: "Peru",
    PH: "Philippines",
    PL: "Poland",
    PT: "Portugal",
    QA: "Qatar",
    RO: "Romania",
    RU: "Russia",
    RW: "Rwanda",
    KN: "Saint Kitts and Nevis",
    LC: "Saint Lucia",
    VC: "Saint Vincent and the Grenadines",
    WS: "Samoa",
    SM: "San Marino",
    ST: "Sao Tome and Principe",
    SA: "Saudi Arabia",
    SN: "Senegal",
    RS: "Serbia",
    SC: "Seychelles",
    SL: "Sierra Leone",
    SG: "Singapore",
    SK: "Slovakia",
    SI: "Slovenia",
    SB: "Solomon Islands",
    SO: "Somalia",
    ZA: "South Africa",
    KR: "South Korea",
    SS: "South Sudan",
    ES: "Spain",
    LK: "Sri Lanka",
    SD: "Sudan",
    SR: "Suriname",
    SE: "Sweden",
    CH: "Switzerland",
    SY: "Syria",
    TJ: "Tajikistan",
    TZ: "Tanzania",
    TH: "Thailand",
    TL: "Timor-Leste",
    TG: "Togo",
    TO: "Tonga",
    TT: "Trinidad and Tobago",
    TN: "Tunisia",
    TR: "Turkey",
    TM: "Turkmenistan",
    TV: "Tuvalu",
    UG: "Uganda",
    UA: "Ukraine",
    AE: "United Arab Emirates",
    GB: "United Kingdom",
    US: "United States",
    UY: "Uruguay",
    UZ: "Uzbekistan",
    VU: "Vanuatu",
    VA: "Vatican City",
    VE: "Venezuela",
    VN: "Vietnam",
    YE: "Yemen",
    ZM: "Zambia",
    ZW: "Zimbabwe",
};


const setEditAttendeeDef: EditAttendeeStruct = {
    active: false,
    attended: {
        value: "",
        err: "",
    },
    name: {
        value: "",
        err: "",
    },
    orgN: {
        value: "",
        err: "",
    },
    orgP: {
        value: "",
        err: "",
    },
    email: {
        value: "",
        err: "",
    },
    number: {
        value: "",
        err: "",
    },
    addr: {
        value: "",
        err: "",
    },
    salutation: {
        value: "",
        err: "",
    },
    attendBizMatch: {
        value: "",
        err: ""
    },
    country: {
        value: "",
        err: ""
    },
    id: "",
};


export default function OrdEvAttendees() {
    const router = useRouter()
    const dispatch = useDispatch();
    const ordEvData = useSelector(ordinaryEventData)
    const modal = useModal();
    const appData = useSelector(selectApp);

    const [editAttendee, setEditAttendee] = useState<EditAttendeeStruct>({
        active: false,
        attended: {
            value: "",
            err: "",
        },
        name: {
            value: "",
            err: "",
        },
        orgN: {
            value: "",
            err: "",
        },
        orgP: {
            value: "",
            err: "",
        },
        email: {
            value: "",
            err: "",
        },
        number: {
            value: "",
            err: "",
        },
        addr: {
            value: "",
            err: "",
        },
        salutation: {
            value: "",
            err: "",
        },
        attendBizMatch: {
            value: "",
            err: "",
        },
        country: {
            value: "",
            err: "",
        },
        id: "",
    });
    const [viewAttendee, setViewAttendee] = useState<Partial<AttendeeOrdSPCAdmin>>({
        active: false,
        attended: false,
        name: "",
        orgN: "",
        orgP: "",
        email: "",
        phoneNumber: "",
        addr: "",
        salutations: "",
        registeredOn: 0,
        evId: "",
    });
    const [exportData, setExportData] = useState<boolean>(false)

    const fetchData = async (mode) => {
        try {
            if (mode === "attendees") {
                dispatch(setFetching({
                    ...ordEvData.fetchingStates,
                    attendees: true,
                }))
            } else {
                dispatch(setFetching({
                    mainEvent: true,
                    lineAnalytics: true,
                    pieAnalytics: true,
                    attendees: true,
                    notifications: true,
                }))
            }
            const req: any = await fetchEventData({
                evId: router.query.slug as string,
                accessToken: appData.acsTok,
                requestLimit: ordEvData.requests.limit,
                page: ordEvData.requests.page,
                sortMethod: ordEvData.requests.sort.method,
                sortOrder: ordEvData.requests.sort.order,
                filter: ordEvData.requests.filter,
                search: ordEvData.requests.search
            })


            dispatch(setEvent(req.data.eventData))
            dispatch(setLineChartData({
                ...ordEvData.lineChartData,
                labels: [...req.data.lineChartData.labels],
                datasets: [{
                    ...ordEvData.lineChartData.datasets[0],
                    data: [...req.data.lineChartData.data]
                }, {
                    ...ordEvData.lineChartData.datasets[1],
                    data: [...req.data.lineChartData.movingAvg]
                }]
            }))
            dispatch(setPieChartData({
                ...ordEvData.pieChartData,
                datasets: [
                    {
                        ...ordEvData.pieChartData.datasets[0],
                        data: [
                            req.data.pieChartData[1],
                            req.data.pieChartData[0],
                        ],
                    },
                ],
            }))
            dispatch(setAttendees(req.data.attendees))
            dispatch(setTotalAttendeeSize(req.data.querySizeResult))
            dispatch(setTotalRegistered(req.data.totalRegistered))
            if (mode === "attendees") {
                dispatch(setFetching({
                    ...ordEvData.fetchingStates,
                    attendees: false,
                }))
            } else {
                dispatch(setFetching({
                    mainEvent: false,
                    lineAnalytics: false,
                    pieAnalytics: false,
                    attendees: false,
                    notifications: false,
                }))
            }

        } catch (e) {

            router.push("/dashboard")
        }
    }

    const deleteAtendee = (id: string, qrId: string): Promise<any> => {
        const cacheId = id;
        const cacheQrId = qrId;
        return new Promise(async (resolve, reject) => {
            try {
                const x = await axios
                    .post(
                        `${process.env.NEXT_PUBLIC_API}/delete-atendee`,
                        {id: cacheId, qrId: cacheQrId},
                        {
                            withCredentials: true,
                            headers: {Authorization: `Bearer ${appData.acsTok}`},
                        }
                    )
                    .catch((e) => {
                        throw new Error("Error in deleting atendee.");
                    });
                resolve("Atendee has been deleted.");
            } catch (e) {
                reject(e.message);
            }
        });
    };

    const handleDeleteAtendee = (id: string, name: string, qrId: string) => {
        modal.show({
            type: "std",
            title: "Attendee Deletion",
            description: `Confirm delete ${name}? ${name}'s Eventra Passport will be invalid, and data can't be recovered.`,
            onConfirm: async () => {
                modal.hide();

                modal.show({
                    type: "loading",
                    title: "Deleting attendee...",
                    color: "neutral",
                });
                try {
                    await deleteAtendee(id, qrId);
                    modal.hide();
                    modal.show({
                        type: "std",
                        title: "Delete success.",
                        description: "Your attendee has been deleted.",
                        onConfirm: () => {
                            modal.hide();
                            fetchData("attendees")
                        },

                        confirmText: "Exit",
                        icon: <Check/>,
                        color: "success",
                    });
                } catch (e) {
                    modal.hide();
                    modal.show({
                        type: "std",
                        title: "Fail to delete attendee.",
                        description: "We can't delete your attendee. Please try again.",
                        onConfirm: () => {
                            modal.hide();
                        },

                        confirmText: "Exit",
                        icon: <Check/>,
                        color: "error",
                    });
                }
            },
            onCancel: () => {
                modal.hide();
            },
            confirmText: "Delete",
            cancelText: "Exit",
            icon: <Trash/>,
            color: "error",
        });
    };

    const updateEditedAttendee = async () => {
        let err = false;
        Object.keys(editAttendee).forEach((key) => {
            if (key === "active" || key === "id" || key === "addr") return;
            if (
                key === "email" &&
                !editAttendee.email.value.match(
                    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
                )
            ) {
                setEditAttendee((pv) => ({
                    ...pv,
                    email: {
                        ...pv.email,
                        err: "Invalid email.",
                    },
                }));
                err = true;
            }
            if (!editAttendee[key].value) {
                setEditAttendee((pv) => ({
                    ...pv,
                    [key]: {
                        ...pv[key],
                        err: "This field is required.",
                    },
                }));
                err = true;
            }
        });

        if (err) return;

        setEditAttendee((pv) => ({
            ...pv,
            active: false,
        }));

        const req = () => {
            return new Promise(async (resolve, reject) => {
                try {
                    await axios
                        .post(
                            `${process.env.NEXT_PUBLIC_API}/update-atendee-org`,
                            {
                                id: editAttendee.id,
                                data: {
                                    addr: editAttendee.addr.value,
                                    attended:
                                        editAttendee.attended.value === "true",
                                    email: editAttendee.email.value,
                                    name: editAttendee.name.value,
                                    orgN: editAttendee.orgN.value,
                                    orgP: editAttendee.orgP.value,
                                    phoneNumber: editAttendee.number.value,
                                    salutations: editAttendee.salutation.value,
                                    attendBizMatch: editAttendee.attendBizMatch.value,
                                    country: editAttendee.country.value,
                                },
                            },
                            {
                                withCredentials: true,
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${appData.acsTok}`,
                                },
                            }
                        )
                        .catch((e) => {
                            throw new Error(e.response.data.err);
                        });
                    resolve("");
                } catch (e) {
                    reject("");
                }
            });
        };

        modal.hide();
        modal.show({
            type: "std",
            title: "Confirm Attendee Update",
            description: "Update this attendee? Previous data won't be saved.",
            onConfirm: async () => {
                modal.hide();
                modal.show({
                    type: "loading",
                    title: "Updating attendee...",
                    color: "neutral"
                })
                req().then(d => {
                    modal.hide();
                    modal.show({
                        type: "std",
                        title: "Update complete",
                        description: "Your attendee has been updated.",
                        onConfirm: async () => {
                            modal.hide();
                            setEditAttendee(setEditAttendeeDef);
                            fetchData("attendees")
                        },

                        confirmText: "Proceed",

                        icon: <Check/>,
                        color: "success",
                    })
                }).catch(e => {
                    modal.hide();
                    modal.show({
                        type: "std",
                        title: "Fail",
                        description: "We have failed to update your attendee.",
                        onConfirm: async () => {
                            modal.hide();
                            updateEditedAttendee();

                        },
                        onCancel: () => {
                            modal.hide()
                            setEditAttendee(setEditAttendeeDef);
                        },
                        confirmText: "Try Again",
                        cancelText: "Exit",
                        icon: <X/>,
                        color: "error",
                    })
                })
            },
            onCancel: () => {
                modal.hide()
            },
            confirmText: "Apply Changes",
            cancelText: "Cancel",
            icon: <FileQuestion/>,
            color: "success",
        })


    };

    const resendEmail = (id: string) => {
        const req = () => {
            return new Promise(async (resolve, reject) => {
                try {
                    await axios
                        .post(
                            `${process.env.NEXT_PUBLIC_API}/resend-email-ord`,
                            {
                                id: id,
                            },
                            {
                                withCredentials: true,
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${appData.acsTok}`,
                                },
                            }
                        )
                        .catch((e) => {
                            throw new Error(e.response.data.err);
                        });

                    resolve("");
                } catch (e) {
                    reject("");
                }
            });
        };

        modal.hide();
        modal.show({
            type: "std",
            title: "Resend E-Mail",
            description: "Confirm to resend e-mail confirmation?",
            onConfirm: async () => {
                modal.hide();
                modal.show({
                    type: "loading",
                    title: "Sending e-mail confirmation...",
                    color: "neutral"
                })
                req().then(d => {
                    modal.hide();
                    modal.show({
                        type: "std",
                        title: "Confirmation E-Mail sent",
                        description: "Your attendee has been sent a confirmation e-mail.",
                        onConfirm: async () => {
                            modal.hide();
                            setViewAttendee({
                                active: false,
                                attended: false,
                                name: "",
                                orgN: "",
                                orgP: "",
                                email: "",
                                phoneNumber: "",
                                addr: "",
                                salutations: "",
                                registeredOn: 0,
                                id: "",
                            });
                        },

                        confirmText: "Exit",

                        icon: <Check/>,
                        color: "success",
                    })
                }).catch(e => {
                    modal.hide();
                    modal.show({
                        type: "std",
                        title: "Fail",
                        description: "We have failed to send your attendee a confirmation e-mail.",
                        onConfirm: async () => {
                            modal.hide();
                            resendEmail(viewAttendee.id as string);

                        },
                        onCancel: () => {
                            modal.hide()
                            setViewAttendee({
                                active: false,
                                attended: false,
                                name: "",
                                orgN: "",
                                orgP: "",
                                email: "",
                                phoneNumber: "",
                                addr: "",
                                salutations: "",
                                registeredOn: 0,
                                id: "",
                            });
                        },
                        confirmText: "Try Again",
                        cancelText: "Exit",
                        icon: <X/>,
                        color: "error",
                    })
                })
            },
            onCancel: () => {
                modal.hide()
            },
            confirmText: "Send E-Mail",
            cancelText: "Cancel",
            icon: <Mail/>,
            color: "success",
        })
    };

    const handleDataExport = async (sort: any, filter: any) => {
        const st = sort;
        const fl = filter;

        try {
            setExportData(false)
            modal.show({
                type: "loading",
                title: "Exporting data...",
                color: "neutral"
            })
            const response = await axios
                .post(
                    `${process.env.NEXT_PUBLIC_API}/download-xlsx-ord`,
                    {
                        evId: ordEvData.eventData.id,
                        sort: sort,
                        filter: filter,
                    },
                    {
                        responseType: "blob",
                        withCredentials: true,
                        headers: {
                            Authorization: `Bearer ${appData.acsTok}`,
                            "Content-Type": "application/json"
                        },
                    }
                )
                .catch((e) => {
                    throw new Error("Fail to export XLSX.");
                });
            modal.hide();
            modal.show({
                type: "std",
                title: "Export success",
                description: "Attendees has been exported to an XLSX.",
                onConfirm: () => {
                    modal.hide();

                },

                confirmText: "Exit",
                icon: <Check/>,
                color: "success",
            });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(response.data);
            link.download = `${moment().format(
                "MMMDDyyyy-hh:mm:ssA"
            )}_AtendeeExport.xlsx`;
            link.click();

        } catch (e: any) {

            modal.hide();
            modal.show({
                type: "std",
                title: "Export fail",
                description: "Fail to export attendees",
                onConfirm: () => {
                    modal.hide();
                    handleDataExport(st, fl)
                },
                onCancel: () => {
                    modal.hide()

                },
                confirmText: "Try again",
                cancelText: "Exit",
                icon: <X/>,
                color: "error",
            });
        }


    };


    const hasInit = useRef<boolean>(false);

    useEffect(() => {
        if (!ordEvData.initialized) return;

        if (!hasInit.current) {
            hasInit.current = true;
            return;
        }

        const debounce = setTimeout(() => {
            fetchData("attendees")
        }, 500);

        return () => {
            clearTimeout(debounce);
        };
    }, [JSON.stringify(ordEvData.requests), ordEvData.initialized]); // listens for changes in the requests key


    useEffect(() => {
        dispatch(setPageNumber(1))
    }, [JSON.stringify({
        ...ordEvData.requests.filter,
        ...ordEvData.requests.sort,
        search: ordEvData.requests.search
    })]);
    return (
        <>

            <DataExportPopup active={exportData} exit={() => setExportData(false)} filters={ordEvData.requests.filter}
                             cb={(d, x) => handleDataExport(d, x)}/>
            <ViewAttendee values={{
                ...viewAttendee,
                evId: ordEvData.eventData.id,
            }} setValues={(d) => {
                setViewAttendee({...d});
            }} resendEmailCb={(d) => resendEmail(d)}/>
            <EditAttendee values={editAttendee} setValues={(d) => setEditAttendee({...d})}
                          callback={() => updateEditedAttendee()}/>
            <div>
                {ordEvData.initialized && <div className="flex justify-between items-center">
                    <h1 className=" font-[500] text-sm">Attendees</h1>
                    <div className="flex gap-2 items-center">
                        <div className="search flex relative items-center">
                            <Search
                                size="15px"
                                className="absolute right-[10px] top-1/2 translate-y-[-50%]"
                            />
                            <input
                                type="text"
                                placeholder="Find an atendee..."
                                onInput={(d) => {
                                    dispatch(setSearchQuery((d.target as HTMLInputElement).value))
                                }}
                                value={ordEvData.requests.search}
                                className="text-xs w-full border-1 rounded-lg py-1.5 px-3  border-neutral-200  focus:outline-none focus:ring-2 focus:ring-emerald-700 ring-offset-4"
                            />
                        </div>
                        <div>
                            <select
                                onChange={(e) => dispatch(setRequestLimit(e.target.value))}
                                value={ordEvData.requests.limit.toString()}
                                className="text-xs bg-white hover:bg-neutral-50 border-1 border-neutral-200 px-3 py-1.5 text-black flex items-center gap-2 rounded-md"
                            >
                                <option value="10">Limit to 10</option>
                                <option value="50">Limit to 50</option>
                                <option value="100">Limit to 100</option>
                            </select>
                        </div>
                        <div>
                            <button
                                onClick={() => {
                                    fetchData("attendees")
                                }}
                                className="text-xs bg-white hover:bg-neutral-50 border-1 border-neutral-200 px-3 py-1.5 text-black flex items-center gap-2 rounded-md"
                            >
                                <RefreshCcw size="15px"/> Refresh
                            </button>
                        </div>

                        <SortButton

                        />


                        <div>
                            <button
                                onClick={() => {
                                    setExportData(true)
                                }}
                                className="text-xs bg-emerald-700 hover:bg-emerald-800 font-[600] px-5 py-1.5 text-white flex items-center gap-2 rounded-md"
                            >
                                <Download size="15px"/> Export Data
                            </button>
                        </div>
                    </div>
                </div>}
                {!ordEvData.fetchingStates.attendees && (
                    <>
                        {ordEvData.attendeeData.data.length === 0 && (
                            <p className="text-center mt-10">No attendees.</p>
                        )}

                        <AnimatePresence>
                            {ordEvData.attendeeData.data.length !== 0 && (
                                <>
                                    <div>
                                        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}
                                                    key={1}
                                                    className="h-[400px] atendee-table mt-5 rounded-lg overflow-hidden border-1 border-neutral-200 overflow-y-scroll">
                                            <div className="relative overflow-x-scroll w-full">
                                                <div
                                                    className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] bg-white font-[500] geist text-xs">
                                                    <div className="contents">
                                                        <div
                                                            className="p-3 font-[500] bg-neutral-100 whitespace-nowrap">
                                                            Attendee
                                                        </div>
                                                        <div
                                                            className="p-3 font-[500] bg-neutral-100 whitespace-nowrap">
                                                            Organization
                                                        </div>
                                                        <div
                                                            className="p-3 font-[500] bg-neutral-100 whitespace-nowrap">
                                                            Phone Number
                                                        </div>
                                                        <div
                                                            className="p-3 font-[500] bg-neutral-100 whitespace-nowrap">
                                                            Salutation
                                                        </div>
                                                        <div
                                                            className="p-3 font-[500] bg-neutral-100 whitespace-nowrap">
                                                            Country
                                                        </div>
                                                        <div
                                                            className="p-3 font-[500] bg-neutral-100 whitespace-nowrap">
                                                            Address
                                                        </div>
                                                        <div
                                                            className="p-3 font-[500] bg-neutral-100 whitespace-nowrap">
                                                            Registered On
                                                        </div>
                                                        <div
                                                            className="p-3 font-[500] bg-neutral-100 whitespace-nowrap">
                                                            BizMatch Status
                                                        </div>
                                                        <div
                                                            className="p-3 font-[500] bg-neutral-100 whitespace-nowrap">
                                                            In Event?
                                                        </div>
                                                        <div
                                                            className="p-3  font-[500] bg-neutral-100 whitespace-nowrap sticky right-0 z-10">
                                                            Options
                                                        </div>
                                                    </div>

                                                    {ordEvData.attendeeData.data.map((d, i) => {
                                                        return (
                                                            <div
                                                                key={i}
                                                                className="contents border-b-1 border-neutral-200 font-[500] geist text-xs"
                                                            >
                                                                <div
                                                                    className="px-5 py-2  flex justify-center flex-col whitespace-nowrap">
                                                                    <p className="truncate">{d.name}</p>
                                                                    <Link href={`mailto:${d.email}`}>
                                                                        <p className="font-[400] text-neutral-800 truncate flex items-center gap-1">
                                                                            {d.email}
                                                                        </p>
                                                                    </Link>
                                                                </div>
                                                                <div
                                                                    className="px-5 py-2  flex justify-center flex-col whitespace-nowrap">
                                                                    <p>{d.orgN}</p>
                                                                    <p className="font-[400] text-neutral-800 flex items-center gap-1 truncate">
                                                                        <Briefcase size="12px" className="shrink-0"/>
                                                                        {d.orgP}
                                                                    </p>
                                                                </div>
                                                                <div
                                                                    className="px-5 py-2 flex items-center whitespace-nowrap">
                                                                    <p className="font-[400] flex gap-1 items-center truncate">
                                                                        <Phone size="12px" className="shrink-0"/>
                                                                        {d.phoneNumber}
                                                                    </p>
                                                                </div>
                                                                <div
                                                                    className="px-5 py-2 flex items-center whitespace-nowrap">
                                                                    <p className="font-[400] flex gap-1 items-center truncate">
                                                                        <User size="12px" className="shrink-0"/>
                                                                        {d.salutations}
                                                                    </p>
                                                                </div>
                                                                <div
                                                                    className="px-5 py-2  flex items-center whitespace-nowrap">
                                                                    <p className="font-[400]">
                                                                        {countriesKV[d.country]}
                                                                    </p>
                                                                </div>
                                                                <div
                                                                    className="px-5 py-2 flex items-center whitespace-nowrap">
                                                                    <p className="font-[400] flex gap-1 items-center truncate">
                                                                        <HomeIcon size="12px" className="shrink-0"/>
                                                                        {d.addr || "N/A"}
                                                                    </p>
                                                                </div>
                                                                <div
                                                                    className="px-5 py-2  flex items-center whitespace-nowrap">
                                                                    <p className="font-[400]">
                                                                        {moment
                                                                            .unix(d.registeredOn)
                                                                            .format("MMM DD, YYYY (hh:mm A)")}
                                                                    </p>
                                                                </div>
                                                                <div
                                                                    className="px-5 py-2  flex items-center whitespace-nowrap">
                                                                    <p className="font-[400]">
                                                                        {d.attendBizMatch === "ys" && (
                                                                            <p className="text-[11px] px-4 py-1 bg-emerald-50 border-1 border-emerald-600 text-emerald-600 w-max rounded-full text-xs">
                                                                                SURE
                                                                            </p>
                                                                        )}
                                                                        {d.attendBizMatch === "ym" && (
                                                                            <p className="text-[11px] px-4 py-1 bg-yellow-50 border-1 border-yellow-600 text-yellow-600 w-max rounded-full text-xs">
                                                                                MAYBE
                                                                            </p>
                                                                        )}
                                                                        {d.attendBizMatch === "no" && (
                                                                            <p className="text-[11px] px-4 py-1 bg-red-50 border-1 border-red-600 text-red-600 w-max rounded-full text-xs">
                                                                                NO
                                                                            </p>
                                                                        )}
                                                                    </p>
                                                                </div>

                                                                <div
                                                                    className="px-5 py-2 flex items-center whitespace-nowrap">
                                                                    {d.attended && (
                                                                        <p className="text-[11px] px-4 py-1 bg-emerald-50 border-1 border-emerald-600 text-emerald-600 w-max rounded-full text-xs">
                                                                            IN EVENT
                                                                        </p>
                                                                    )}
                                                                    {!d.attended && (
                                                                        <p className="text-[11px] px-4 py-1 bg-red-50 border-1 border-red-600 text-red-600 w-max rounded-full text-xs">
                                                                            NOT IN EVENT
                                                                        </p>
                                                                    )}
                                                                </div>

                                                                <div
                                                                    className="bg-white px-5 py-2 text-right flex items-center gap-2 justify-end sticky z-[10] right-0">
                                                                    <button
                                                                        onClick={() => {
                                                                            setEditAttendee({
                                                                                active: true,
                                                                                attended: {
                                                                                    err: "",
                                                                                    value: d.attended ? "true" : "false",
                                                                                },
                                                                                name: {
                                                                                    err: "",
                                                                                    value: d.name,
                                                                                },
                                                                                orgN: {
                                                                                    err: "",
                                                                                    value: d.orgN,
                                                                                },
                                                                                orgP: {
                                                                                    err: "",
                                                                                    value: d.orgP,
                                                                                },
                                                                                email: {
                                                                                    err: "",
                                                                                    value: d.email,
                                                                                },
                                                                                number: {
                                                                                    err: "",
                                                                                    value: d.phoneNumber,
                                                                                },
                                                                                addr: {
                                                                                    err: "",
                                                                                    value: d.addr,
                                                                                },
                                                                                salutation: {
                                                                                    err: "",
                                                                                    value: d.salutations,
                                                                                },
                                                                                attendBizMatch: {
                                                                                    err: "",
                                                                                    value: d.attendBizMatch,
                                                                                },
                                                                                country: {
                                                                                    err: "",
                                                                                    value: d.country,
                                                                                },
                                                                                id: d.id,
                                                                            });
                                                                        }}
                                                                        className="p-2 bg-white hover:bg-neutral-50 border-1 border-neutral-200 rounded-md"
                                                                    >
                                                                        <Pencil size="15px"/>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            setViewAttendee({
                                                                                active: true,
                                                                                attended: d.attended,
                                                                                name: d.name,
                                                                                orgN: d.orgN,
                                                                                orgP: d.orgP,
                                                                                email: d.email,
                                                                                phoneNumber: d.phoneNumber,
                                                                                addr: d.addr,
                                                                                salutations: d.salutations,
                                                                                registeredOn: d.registeredOn,
                                                                                id: d.id,
                                                                            });
                                                                        }}
                                                                        className="p-2 bg-white hover:bg-neutral-50 border-1 border-neutral-200 rounded-md"
                                                                    >
                                                                        <Eye size="15px"/>
                                                                    </button>
                                                                    <button
                                                                        onClick={() =>
                                                                            printQR({
                                                                                eventName: ordEvData.eventData.name,
                                                                                attendeeName: d.name,
                                                                                organization: d.orgN,
                                                                                position: d.orgP,
                                                                                identifier: d.id,
                                                                            })
                                                                        }
                                                                        className="p-2 bg-white hover:bg-neutral-50 border-1 border-neutral-200 rounded-md"
                                                                    >
                                                                        <Printer size="15px"/>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            handleDeleteAtendee(
                                                                                d.id,
                                                                                d.name,
                                                                                d.public_id_qr
                                                                            );
                                                                        }}
                                                                        className="p-2 bg-white hover:bg-neutral-50 border-1 border-neutral-200 rounded-md"
                                                                    >
                                                                        <Trash size="15px"/>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>


                                            </div>

                                        </motion.div>
                                        <div
                                            className="mt-2 text-xs text-neutral-500 flex items-center justify-between">
                                            <p>Data as of: {moment().format("MMM DD, YYYY - HH:mm:ss")}</p>
                                            <p className="font-[500] text-neutral-500 select-none">Showing {ordEvData.attendeeData.data.length} of {ordEvData.attendeeData.totalAtnSize} attendee{ordEvData.attendeeData.totalAtnSize > 1 && "s"}</p>
                                        </div>
                                        <EventraPagination

                                        />
                                    </div>
                                </>
                            )}
                        </AnimatePresence>
                    </>
                )}

                {ordEvData.fetchingStates.attendees && (
                    <>
                        <div className="h-[600px]">
                            <div className="loading h-full w-full grid place-content-center">
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
                    </>
                )}
            </div>
        </>
    );
}
