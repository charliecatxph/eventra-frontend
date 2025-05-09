import {AnimatePresence, motion} from "framer-motion";
import {AArrowDown, AArrowUp, DownloadIcon} from "lucide-react";
import {useEffect, useState} from "react";

type Mode = "f" | "s";

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


export default function DataExportPopup({active, filters, cb, exit}) {
    const [mode, setMode] = useState<Mode>("s");
    const [sortMethod, setSortMethod] = useState<any>({
        by: "registeredOn",
        order: "asc"
    })
    const [check, setCheck] = useState<any>({
        attended: {
            in: true,
            out: true,
        },
        attendBizMatch: {
            ys: true,
            ym: true,
            no: true,
        },
    })

    // populate
    useEffect(() => {
        if (!filters) return;

        const newCheck = {...check};

        Object.entries(filters).forEach(([key, values]) => {
            const map = {};
            values.forEach(value => {
                map[value] = true;
            });
            newCheck[key] = map;
        });

        setCheck(prev => ({
            ...prev,
            ...newCheck
        }));
    }, [filters]);

    const [summary, setSummary] = useState("");

    useEffect(() => {
        const {by, order} = sortMethod;

        const labelMap = {
            attended: {
                in: "In Event",
                out: "Not In Event",
            },
            attendBizMatch: {
                ys: "Yes, I will attend",
                ym: "Maybe, send me a follow-up",
                no: "No, I will not attend",
            },
        };

        const formatLabeled = (label: string, entries: Record<string, boolean>, map: Record<string, string>) => {
            const included = Object.entries(entries)
                .filter(([_, val]) => val)
                .map(([key]) => map[key] || key);

            if (included.length === 0) return `No ${label} selected.`;
            return `Include [${label}]:\n- ${included.join("\n- ")}`;
        };

        const formatInclusions = (label: string, entries: Record<string, boolean>) => {
            const included = Object.entries(entries)
                .filter(([_, val]) => val)
                .map(([key]) => key);

            const excluded = Object.entries(entries)
                .filter(([_, val]) => !val)
                .map(([key]) => key);

            if (included.length === 0) return `Exclude all [${label}]`;
            if (excluded.length === 0) return `Include all [${label}]`;
            return `Include [${label}]:\n- ${included.join("\n- ")}\n(excluding: ${excluded.join(", ")})`;
        };

        const summaryParts: string[] = [];

        if (check.attended) {
            summaryParts.push(formatLabeled("Attendance Status", check.attended, labelMap.attended));
        }

        if (check.attendBizMatch) {
            summaryParts.push(formatLabeled("BizMatch", check.attendBizMatch, labelMap.attendBizMatch));
        }

        if (check.orgN) {
            summaryParts.push(formatInclusions("Organization", check.orgN));
        }

        if (check.country) {
            summaryParts.push(formatInclusions("Country", check.country));
        }


        const sortFieldLabels: Record<string, string> = {
            name: "Name",
            addr: "Address",
            orgN: "Organization Name",
            registeredOn: "Registered On",
        };

        const sortFieldLabel = sortFieldLabels[by] || by;
        const sortOrderLabel = order === "asc" ? "ascending" : "descending";

        summaryParts.push(`Sort by [${sortFieldLabel}], ${sortOrderLabel}`);
        summaryParts.push(`Export format: XLSX`);

        setSummary(summaryParts.join("\n\n"));
    }, [check, sortMethod]);

    const handleExport = () => {
        let tmp = {
            attended: [],
            orgN: [],
            country: [],
            attendBizMatch: []
        }
        Object.keys(check.attended).forEach(key => {
            check.attended[key] && tmp.attended.push(key);
        })

        Object.keys(check.orgN).forEach(key => {
            check.orgN[key] && tmp.orgN.push(key);
        })

        Object.keys(check.country).forEach(key => {
            check.country[key] && tmp.country.push(key);
        })
        Object.keys(check.attendBizMatch).forEach(key => {
            check.attendBizMatch[key] && tmp.attendBizMatch.push(key);
        })

        cb(sortMethod, tmp)
    }


    return <>


        <AnimatePresence>

            {active && <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                key={1}
                className=" fixed w-full h-full top-0 left-0 bg-neutral-900/70 z-[9999] geist overflow-y-auto py-5 px-5"
            >
                <div className="grid place-items-center min-h-screen w-full">
                    <motion.div
                        initial={{opacity: 0, scale: 0.9}}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            transition: {delay: 0.2, duration: 0.2},
                        }}
                        exit={{opacity: 0, scale: 0.9}}
                        key={2}
                        className="form w-full max-w-[700px] bg-white rounded-xl overflow-hidden px-7 py-5"
                    >
                        <div>
                            <h1 className="flex items-center gap-3 font-[600] text-lg"><DownloadIcon
                                className="text-emerald-700 size-5"/> Data Export</h1>
                            <p className="mt-2 text-sm  text-neutral-800">Customize your export before downloading
                                attendee data</p>
                        </div>
                        <div className="mt-5 selection bg-emerald-50 flex gap-2 px-2 py-1 rounded-md text-[13px]">
                            <div onClick={() => setMode("s")}
                                 className={`basis-1/2 ${mode === "s" ? "bg-emerald-700 text-white cursor-default" : "cursor-pointer text-neutral-600"}  py-2 px-2 text-center font-[600] rounded-sm`}>Sort
                            </div>
                            <div onClick={() => setMode("f")}
                                 className={`basis-1/2 ${mode === "f" ? "bg-emerald-700 text-white cursor-default" : "cursor-pointer text-neutral-600"}  py-2 px-2 text-center font-[600] rounded-sm`}>Filter
                            </div>
                        </div>
                        {mode === "s" && <div className="flex gap-2 flex-col mt-2">
                            <div><h1 className=" text-sm font-[500] text-neutral-800">Sort by</h1>
                                <select name="" id="" value={sortMethod.by} onChange={(e) => {
                                    setSortMethod(pv => ({...pv, by: e.target.value}))
                                }}
                                        className="w-full mt-1 border-1 py-2 px-3 text-sm rounded-sm border-neutral-200 font-[400]">
                                    <option value="name">Name</option>
                                    <option value="orgN">Organization</option>
                                    <option value="addr">Address</option>
                                    <option value="registeredOn">Registered On</option>

                                </select></div>
                            <div>
                                <h1 className=" text-sm font-[500] text-neutral-800">Sort order</h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex gap-2 items-center">
                                        <input type="radio" checked={sortMethod.order === "asc"} name="st-ord" id=""
                                               onClick={() => {
                                                   setSortMethod(pv => ({...pv, order: "asc"}))
                                               }}
                                               className="size-4 checked:bg-emerald-700 accent-emerald-700"/> <p
                                        className="text-sm font-[500] flex items-center gap-2"><AArrowUp
                                        className="size-5"/> Ascending</p>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <input type="radio" checked={sortMethod.order === "desc"} name="st-ord" id=""
                                               onClick={() => {
                                                   setSortMethod(pv => ({...pv, order: "desc"}))
                                               }}
                                               className="size-4 checked:bg-emerald-700 accent-emerald-700"/> <p
                                        className="text-sm font-[500] flex items-center gap-2"><AArrowDown
                                        className="size-5"/> Descending</p>
                                    </div>
                                </div>
                            </div>
                        </div>}
                        {mode === "f" && <div className="flex gap-2 flex-col mt-5">
                            <div className="flex justify-between items-center">
                                <h1 className="text-sm font-[500] text-neutral-800">Select data to include/exclude:</h1>

                            </div>
                            <div className="filter mt-2 flex gap-2 flex-col">

                                <div>
                                    <div className="flex justify-between items-center">
                                        <h1 className="text-xs font-[500] text-neutral-800">Attendance Status</h1>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setCheck(pv => ({
                                                    ...pv,
                                                    attended: Object.keys(pv.attended).reduce((acc, key) => {
                                                        acc[key] = true;
                                                        return acc;
                                                    }, {})
                                                }))}
                                                className="px-4 py-1 border-1 border-emerald-700 text-xs rounded-sm hover:bg-neutral-50 hover:text-black text-emerald-700 font-[500]">Select
                                                All
                                            </button>
                                            <button
                                                onClick={() => setCheck(pv => ({
                                                    ...pv,
                                                    attended: Object.keys(pv.attended).reduce((acc, key) => {
                                                        acc[key] = false;
                                                        return acc;
                                                    }, {})
                                                }))}
                                                className="px-4 py-1 border-1 border-emerald-700 text-xs rounded-sm hover:bg-neutral-50 hover:text-black text-emerald-700 font-[500]">Deselect
                                                All
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 mt-1">
                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" name="my" id="" checked={check.attended.in}
                                                   onChange={(e) => setCheck(pv => ({
                                                       ...pv,
                                                       attended: {...pv.attended, in: e.target.checked}
                                                   }))}
                                                   className="size-3 checked:bg-emerald-700 accent-emerald-700"/>
                                            <p className="text-sm">In Event</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" name="my" id="" checked={check.attended.out}
                                                   onChange={(e) => setCheck(pv => ({
                                                       ...pv,
                                                       attended: {...pv.attended, out: e.target.checked}
                                                   }))}
                                                   className="size-3 checked:bg-emerald-700 accent-emerald-700"/>
                                            <p className="text-sm">Not In Event</p>
                                        </div>

                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center">
                                        <h1 className="text-xs font-[500] text-neutral-800">BizMatch</h1>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setCheck(pv => ({
                                                    ...pv,
                                                    attendBizMatch: Object.keys(pv.attendBizMatch).reduce((acc, key) => {
                                                        acc[key] = true;
                                                        return acc;
                                                    }, {})
                                                }))}
                                                className="px-4 py-1 border-1 border-emerald-700 text-xs rounded-sm hover:bg-neutral-50 hover:text-black text-emerald-700 font-[500]">Select
                                                All
                                            </button>
                                            <button
                                                onClick={() => setCheck(pv => ({
                                                    ...pv,
                                                    attendBizMatch: Object.keys(pv.attendBizMatch).reduce((acc, key) => {
                                                        acc[key] = false;
                                                        return acc;
                                                    }, {})
                                                }))}
                                                className="px-4 py-1 border-1 border-emerald-700 text-xs rounded-sm hover:bg-neutral-50 hover:text-black text-emerald-700 font-[500]">Deselect
                                                All
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 mt-1">
                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" name="my" id="" checked={check.attendBizMatch.ys}
                                                   onChange={(e) => setCheck(pv => ({
                                                       ...pv,
                                                       attendBizMatch: {...pv.attendBizMatch, ys: e.target.checked}
                                                   }))}
                                                   className="size-3 checked:bg-emerald-700 accent-emerald-700"/>
                                            <p className="text-sm">Sure, I will attend</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" name="my" id="" checked={check.attendBizMatch.ym}
                                                   onChange={(e) => setCheck(pv => ({
                                                       ...pv,
                                                       attendBizMatch: {...pv.attendBizMatch, ym: e.target.checked}
                                                   }))}
                                                   className="size-3 checked:bg-emerald-700 accent-emerald-700"/>
                                            <p className="text-sm">Maybe, send me a follow-up</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" name="my" id="" checked={check.attendBizMatch.no}
                                                   onChange={(e) => setCheck(pv => ({
                                                       ...pv,
                                                       attendBizMatch: {...pv.attendBizMatch, no: e.target.checked}
                                                   }))}
                                                   className="size-3 checked:bg-emerald-700 accent-emerald-700"/>
                                            <p className="text-sm">No, I will not attend</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center">
                                        <h1 className="text-xs font-[500] text-neutral-800">Country</h1>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setCheck(pv => ({
                                                    ...pv,
                                                    country: Object.keys(pv.country).reduce((acc, key) => {
                                                        acc[key] = true;
                                                        return acc;
                                                    }, {})
                                                }))}
                                                className="px-4 py-1 border-1 border-emerald-700 text-xs rounded-sm hover:bg-neutral-50 hover:text-black text-emerald-700 font-[500]">Select
                                                All
                                            </button>
                                            <button
                                                onClick={() => setCheck(pv => ({
                                                    ...pv,
                                                    country: Object.keys(pv.country).reduce((acc, key) => {
                                                        acc[key] = false;
                                                        return acc;
                                                    }, {})
                                                }))}
                                                className="px-4 py-1 border-1 border-emerald-700 text-xs rounded-sm hover:bg-neutral-50 hover:text-black text-emerald-700 font-[500]">Deselect
                                                All
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 mt-1">
                                        {Object.keys(check.country).map((d, i) => {
                                            return (
                                                <div key={i} className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        name="my"
                                                        id=""
                                                        checked={check.country[d]}
                                                        onChange={(e) => setCheck(pv => ({
                                                            ...pv,
                                                            country: {
                                                                ...pv.country,
                                                                [d]: e.target.checked
                                                            }
                                                        }))}
                                                        className="size-3 checked:bg-emerald-700 accent-emerald-700"
                                                    />
                                                    <p className="text-sm">{countriesKV[d]}</p>
                                                </div>
                                            );
                                        })}

                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center">
                                        <h1 className="text-xs font-[500] text-neutral-800">Organization</h1>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setCheck(pv => ({
                                                    ...pv,
                                                    orgN: Object.keys(pv.orgN).reduce((acc, key) => {
                                                        acc[key] = true;
                                                        return acc;
                                                    }, {})
                                                }))}
                                                className="px-4 py-1 border-1 border-emerald-700 text-xs rounded-sm hover:bg-neutral-50 hover:text-black text-emerald-700 font-[500]">Select
                                                All
                                            </button>
                                            <button
                                                onClick={() => setCheck(pv => ({
                                                    ...pv,
                                                    orgN: Object.keys(pv.orgN).reduce((acc, key) => {
                                                        acc[key] = false;
                                                        return acc;
                                                    }, {})
                                                }))}
                                                className="px-4 py-1 border-1 border-emerald-700 text-xs rounded-sm hover:bg-neutral-50 hover:text-black text-emerald-700 font-[500]">Deselect
                                                All
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 mt-1 max-h-[100px] overflow-y-scroll">
                                        {Object.keys(check.orgN).map((d, i) => {
                                            return (
                                                <div key={i} className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        name="my"
                                                        id=""
                                                        checked={check.orgN[d]}
                                                        onChange={(e) => setCheck(pv => ({
                                                            ...pv,
                                                            orgN: {
                                                                ...pv.orgN,
                                                                [d]: e.target.checked
                                                            }
                                                        }))}
                                                        className="size-3 checked:bg-emerald-700 accent-emerald-700"
                                                    />
                                                    <p className="text-sm">{d}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>}
                        <div
                            className="export-summary bg-emerald-50 text-emerald-700 p-5 border-1 border-emerald-200 rounded-md mt-5">
                            <h1 className="text-sm font-[700]">Export Summary</h1>
                            <div className="text-[13px] font-[500]"> {summary.split("\n").map((line, i) => (
                                <div key={i}>{line}</div>
                            ))}</div>
                        </div>
                        <div className="exp-buttons flex gap-1 mt-3 justify-end">
                            <button onClick={() => exit()}
                                    className="text-sm font-[600] px-5 py-2 rounded-md bg-white">Cancel
                            </button>
                            <button
                                onClick={() => handleExport()}
                                className="text-sm font-[600] px-5 py-2 rounded-md bg-emerald-700 text-emerald-50">Export
                            </button>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
            }

        </AnimatePresence>
    </>
}