import {AArrowDown, AArrowUp, Settings2} from "lucide-react";
import {useClickOutside} from "@/hooks/UseClickOutside";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {ordinaryEventData, setFilters, setSortMethod} from "@/features/ordinaryEventSlice";
import {AnimatePresence, motion} from "framer-motion";

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
type Mode = "f" | "s";
export default function SortButton() {
    const dispatch = useDispatch()
    const ordEvData = useSelector(ordinaryEventData)
    const [openSort, setOpenSort] = useState<boolean>(false);
    const sortRf = useClickOutside<HTMLDivElement>(() => setOpenSort(false));
    const [mode, setMode] = useState<Mode>("s");
    return (
        <>

            <div className="select-none">
                <div
                    className="settings relative text-black">
                    <p onClick={() => setOpenSort(pv => !pv)}
                       className={`flex items-center gap-2 text-xs px-5 py-1.5 font-[500] rounded-md overflow-hidden cursor-pointer transition-colors ${openSort ? "bg-emerald-700 text-white hover:bg-emerald-800" : "bg-white hover:bg-neutral-50 border-1 border-neutral-200"}`}>
                        <Settings2 className="size-4"/> Table Settings</p>
                    <AnimatePresence>
                        {openSort &&
                            <motion.div ref={sortRf}
                                        initial={{opacity: 0, scale: 0.95}}
                                        animate={{opacity: 1, scale: 1}}
                                        exit={{opacity: 0, scale: 0.95}}
                                        transition={{duration: 0.2, ease: "easeOut"}}
                                        key={1}
                                        style={{transformOrigin: "top right"}}
                                        className="absolute top-[110%] right-0 bg-white rounded-md w-[300px] px-4 py-3 z-[1000] border-1 border-neutral-200">
                                <div className="selection bg-emerald-50 flex gap-2 px-2 py-1 rounded-md text-[13px]">
                                    <div onClick={() => setMode("s")}
                                         className={`basis-1/2 ${mode === "s" ? "bg-emerald-700 text-white cursor-default" : "cursor-pointer text-neutral-600"}  py-1.5 px-2 text-center font-[600] rounded-sm`}>Sort
                                    </div>
                                    <div onClick={() => setMode("f")}
                                         className={`basis-1/2 ${mode === "f" ? "bg-emerald-700 text-white cursor-default" : "cursor-pointer text-neutral-600"}  py-1.5 px-2 text-center font-[600] rounded-sm`}>Filter
                                    </div>
                                </div>
                                {mode === "s" && <div className="sort mt-2">
                                    <h1 className="text-sm font-[500]">Sort Settings</h1>
                                    <div className="flex gap-2 py-3 items-center">
                                        <p className="text-xs w-1/3">Sort by</p>
                                        <select onChange={(e) => {
                                            dispatch(setSortMethod(`${e.target.value}-${ordEvData.requests.sort.order}`))

                                        }} value={ordEvData.requests.sort.method} name="" id=""
                                                className="w-2/3 border-1 py-1.5 px-3 text-sm rounded-sm border-neutral-200 font-[500]">
                                            <option value="name">Name</option>
                                            <option value="orgN">Organization</option>
                                            <option value="addr">Address</option>
                                            <option value="registeredOn">Registered On</option>

                                        </select>
                                    </div>
                                    <div className="flex gap-2">
                                        <div
                                            onClick={() => dispatch(setSortMethod(`${ordEvData.requests.sort.method}-asc`))}
                                            className={`flex basis-1/2 gap-2 border-1  text-xs py-2 px-4 items-center font-[600] rounded-sm  ${ordEvData.requests.sort.order === "asc" ? "bg-emerald-700 text-white hover:bg-emerald-600" : "border-neutral-200 bg-white hover:bg-neutral-50"} cursor-pointer`}>
                                            <AArrowUp className="size-5"/> Ascending
                                        </div>
                                        <div
                                            onClick={() => dispatch(setSortMethod(`${ordEvData.requests.sort.method}-desc`))}
                                            className={`flex basis-1/2 gap-2 border-1  text-xs py-2 px-4 items-center font-[600] rounded-sm  ${ordEvData.requests.sort.order === "desc" ? "bg-emerald-700 text-white hover:bg-emerald-600" : "border-neutral-200 bg-white hover:bg-neutral-50"} cursor-pointer`}>
                                            <AArrowDown className="size-5"/> Descending
                                        </div>
                                    </div>
                                </div>}
                                {mode === "f" && <div className="filter mt-2">
                                    <h1 className="text-sm font-[500]">Filter Settings</h1>
                                    <div>
                                        <h2 className="text-xs mt-2 font-[500] text-neutral-900">Attendance Status</h2>
                                        <div className="grid grid-cols-2 mt-1">
                                            <div className="flex items-center gap-2">
                                                <input type="checkbox" name="my" id=""
                                                       checked={ordEvData.requests.filter.attended[0]}
                                                       onChange={(e) => dispatch(setFilters({
                                                           ...ordEvData.requests.filter,
                                                           attended: [e.target.checked, ordEvData.requests.filter.attended[1]]
                                                       }))}
                                                       className="size-3 checked:bg-emerald-700 accent-emerald-700"/>
                                                <p className="text-sm">In Event</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input type="checkbox" name="my" id=""
                                                       checked={ordEvData.requests.filter.attended[1]}
                                                       onChange={(e) => dispatch(setFilters({
                                                           ...ordEvData.requests.filter,
                                                           attended: [ordEvData.requests.filter.attended[0], e.target.checked]
                                                       }))}
                                                       className="size-3 checked:bg-emerald-700 accent-emerald-700"/>
                                                <p className="text-sm">Not In Event</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-xs mt-2 font-[500] text-neutral-900">BizMatch</h2>
                                        <div className="grid grid-cols-1 mt-1">
                                            <div className="flex items-center gap-2">
                                                <input type="checkbox" name="my" id=""
                                                       checked={ordEvData.requests.filter.extras.attendBizMatch.ys}
                                                       onChange={(e) => dispatch(setFilters({
                                                           ...ordEvData.requests.filter,
                                                           extras: {
                                                               ...ordEvData.requests.filter.extras,
                                                               attendBizMatch: {
                                                                   ...ordEvData.requests.filter.extras.attendBizMatch,
                                                                   ys: e.target.checked
                                                               }
                                                           }
                                                       }))}
                                                       className="size-3 checked:bg-emerald-700 accent-emerald-700"/>
                                                <p className="text-sm">Sure, I will attend</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input type="checkbox" name="my" id=""
                                                       checked={ordEvData.requests.filter.extras.attendBizMatch.ym}
                                                       onChange={(e) => dispatch(setFilters({
                                                           ...ordEvData.requests.filter,
                                                           extras: {
                                                               ...ordEvData.requests.filter.extras,
                                                               attendBizMatch: {
                                                                   ...ordEvData.requests.filter.extras.attendBizMatch,
                                                                   ym: e.target.checked
                                                               }
                                                           }
                                                       }))}
                                                       className="size-3 checked:bg-emerald-700 accent-emerald-700"/>
                                                <p className="text-sm">Maybe, send me a follow-up</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input type="checkbox" name="my" id=""
                                                       checked={ordEvData.requests.filter.extras.attendBizMatch.no}
                                                       onChange={(e) => dispatch(setFilters({
                                                           ...ordEvData.requests.filter,
                                                           extras: {
                                                               ...ordEvData.requests.filter.extras,
                                                               attendBizMatch: {
                                                                   ...ordEvData.requests.filter.extras.attendBizMatch,
                                                                   no: e.target.checked
                                                               }
                                                           }
                                                       }))}
                                                       className="size-3 checked:bg-emerald-700 accent-emerald-700"/>
                                                <p className="text-sm">No, I will not attend</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-xs mt-2 font-[500] text-neutral-900">Country</h2>
                                        <div className="grid grid-cols-2 mt-1">

                                            {Object.keys(ordEvData.requests.filter.extras.country).map((d, i) => {
                                                return (
                                                    <div key={i} className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            name="my"
                                                            id=""
                                                            checked={ordEvData.requests.filter.extras.country[d]}
                                                            onChange={(e) => {
                                                                dispatch(setFilters({
                                                                    ...ordEvData.requests.filter,
                                                                    extras: {
                                                                        ...ordEvData.requests.filter.extras,
                                                                        country: {
                                                                            ...ordEvData.requests.filter.extras.country,
                                                                            [d]: e.target.checked
                                                                        }
                                                                    }
                                                                }))
                                                            }}
                                                            className="size-3 checked:bg-emerald-700 accent-emerald-700"
                                                        />
                                                        <p className="text-sm">{countriesKV[d]}</p>
                                                    </div>
                                                );
                                            })}


                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-xs mt-2 font-[500] text-neutral-900">Organization</h2>
                                        <div className="grid grid-cols-1 mt-1 max-h-[100px] overflow-y-scroll">
                                            {Object.keys(ordEvData.requests.filter.extras.orgN).map((d, i) => {
                                                return (
                                                    <div key={i} className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            name="my"
                                                            id=""
                                                            checked={ordEvData.requests.filter.extras.orgN[d]}
                                                            onChange={(e) => {
                                                                dispatch(setFilters({
                                                                    ...ordEvData.requests.filter,
                                                                    extras: {
                                                                        ...ordEvData.requests.filter.extras,
                                                                        orgN: {
                                                                            ...ordEvData.requests.filter.extras.orgN,
                                                                            [d]: e.target.checked
                                                                        }
                                                                    }
                                                                }))
                                                            }}
                                                            className="size-3 checked:bg-emerald-700 accent-emerald-700"
                                                        />
                                                        <p className="text-sm">{d}</p>
                                                    </div>
                                                );
                                            })}

                                        </div>
                                    </div>

                                </div>}
                            </motion.div>}
                    </AnimatePresence>
                </div>
            </div>

        </>
    );
}
