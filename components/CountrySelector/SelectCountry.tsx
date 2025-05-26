import {useClickOutside} from "@/hooks/UseClickOutside";
import {AnimatePresence, motion} from "framer-motion";
import {AlertTriangle, ChevronsUpDown, Search,} from "lucide-react";
import {useEffect, useState} from "react";

interface SelectCountry {
    onInput: (v: string) => void;
    value: string;
    error: string;
}

interface Country {
    name: string;
    emoji: string;
}

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


export default function SelectCountry({
                                          onInput,
                                          value,
                                          error,
                                      }: SelectCountry) {
    const [activate, setActivate] = useState<boolean>(false);

    const [searchCountry, setSearchCountry] = useState<{ code: string; fullName: string }[]>([]);

    const rrf = useClickOutside<HTMLDivElement>(() => setActivate(false));
    const [local, setLocal] = useState<string>("");

    useEffect(() => {
        if (!local) {

            setSearchCountry(
                Object.entries(countriesKV).map(([code, fullName]) => ({code, fullName}))
            );
            return;
        }

        const results = [];
        const searchTerm = local.toLowerCase();

        for (const [code, fullName] of Object.entries(countriesKV)) {
            if (fullName.toLowerCase().includes(searchTerm)) {
                results.push({code, fullName});
            }
        }

        setSearchCountry(results);
    }, [local]);
    return (
        <>
     
            <div className="relative">
                <div>
                    <label htmlFor="country" className="font-[500] text-sm">
                        Country<span className="font-[500] text-red-600">*</span>
                    </label>
                    <div
                        onClick={() => setActivate(!activate)}
                        className="mt-1.5 w-full border-1 rounded-lg py-1.5 px-3 border-neutral-200 outline-neutral-400 outline-offset-4 flex gap-2 justify-between items-center text-neutral-500"
                    >
                        <p className={value && "text-black"}>
                            {value ? countriesKV[value] : "Select Country"}
                        </p>
                        <ChevronsUpDown size="16px"/>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                key={1}
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                exit={{opacity: 0}}
                                className="warn mt-[5px] flex items-center gap-2 text-xs text-red-600"
                            >
                                <AlertTriangle size="13px" className="shrink-0"/>
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <AnimatePresence>
                    {activate && (
                        <motion.div
                            initial={{y: 10, opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            exit={{y: 10, opacity: 0}}
                            key={1}
                            ref={rrf}
                            className="absolute top-[110%] z-[9999] text-sm bg-white border-1 border-neutral-200 rounded-md overflow-hidden w-full"
                        >
                            <div className="text-neutral-200 px-3 py-1.5 border-b-1 border-neutral-200">
                                <div className="flex items-center gap-2">
                                    <Search size="14px"/>
                                    <input
                                        type="text"
                                        placeholder="Search for a country..."
                                        className="grow-1 text-black focus:outline-none"
                                        onInput={(e) => {
                                            setLocal((e.target as HTMLInputElement).value);
                                        }}
                                    />
                                </div>
                            </div>
                            <ul className="max-h-[200px] overflow-y-scroll">
                                {searchCountry.length === 0 ? (
                                    <li className="p-3 text-xs border-b-1 border-neutral-200">
                                        No countries found on query.
                                    </li>
                                ) : (
                                    searchCountry.map((d, i) => {
                                        return (
                                            <li
                                                className="hover:bg-emerald-700 text-xs hover:text-emerald-100 p-3 border-b-1 border-neutral-200"
                                                key={i}
                                                onClick={() => {
                                                    onInput(`${d.code}`);
                                                    setActivate(false);
                                                }}
                                            >
                                                {d.fullName}
                                            </li>
                                        );
                                    })
                                )}
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
