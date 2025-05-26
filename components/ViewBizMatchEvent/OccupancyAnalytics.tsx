import { TrendingUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { CircularProgress } from "@mui/material";

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

export default function OccupancyAnalytics({ isFetching, data }) {
  return (
    <>
      {!isFetching && (
        <>
          <h1 className="flex gap-2 items-center text-sm font-[500]">
            <TrendingUp size="15px" strokeWidth="2" /> Timeslots Occupancy
            Analytics
          </h1>
          {data.length === 0 && (
            <p className="text-center mt-10">No suppliers.</p>
          )}

          <AnimatePresence>
            {data.length !== 0 && (
              <>
                <div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={1}
                    className="atendee-table mt-5 rounded-lg overflow-hidden border-1 border-neutral-200 overflow-y-scroll"
                  >
                    <div className="relative overflow-x-scroll w-full">
                      <div className="grid grid-cols-[auto_1fr] bg-white font-[500] geist text-xs">
                        <div className="contents">
                          <div className="p-3 font-[500] bg-neutral-100 whitespace-nowrap">
                            Supplier
                          </div>
                          <div className="p-3 font-[500] bg-neutral-100 whitespace-nowrap">
                            Percentage
                          </div>
                        </div>

                        {data.map((d, i) => {
                          return (
                            <div
                              key={i}
                              className="contents border-b-1 border-neutral-200 font-[500] geist text-xs"
                            >
                              <div className="px-5 py-2 flex gap-5 whitespace-nowrap">
                                <div className="size-10 overflow-hidden rounded-full shadow-sm shadow-neutral-100 border-1 border-neutral-100">
                                  <img
                                    src={d.logoSecUrl}
                                    alt=""
                                    className="bg-neutral-50 w-full h-full"
                                  />
                                </div>
                                <div className="flex justify-center flex-col">
                                  <p className="truncate">{d.name}</p>

                                  <p className="font-[400] text-neutral-800 truncate flex items-center gap-1">
                                    {countriesKV[d.country]}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center pr-5">
                                <p className="shrink-0 w-[110px] flex flex-col">
                                  <span>
                                    {d.attendedPercentage || 0}% attended
                                  </span>

                                  <span>
                                    {d.noShowPercentage || 0}% no-show
                                  </span>
                                </p>
                                <div className="w-full flex flex-col gap-1">
                                  <div className="progress h-[7px] w-full bg-neutral-50 overflow-hidden rounded-full">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{
                                        width: `${d.attendedPercentage}%`,
                                      }}
                                      transition={{
                                        duration: 2,
                                        ease: "circOut",
                                      }}
                                      className="bar h-full bg-emerald-700"
                                    ></motion.div>
                                  </div>

                                  <div className="progress h-[7px] w-full bg-neutral-50 overflow-hidden rounded-full">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{
                                        width: `${d.noShowPercentage}%`,
                                      }}
                                      transition={{
                                        duration: 2,
                                        ease: "circOut",
                                      }}
                                      className="bar h-full bg-red-700"
                                    ></motion.div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
      {isFetching && (
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
    </>
  );
}
