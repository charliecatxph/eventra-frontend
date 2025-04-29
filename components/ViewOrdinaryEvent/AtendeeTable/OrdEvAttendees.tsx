import { selectApp } from "@/features/appSlice";
import { useModal } from "@/components/Modal/ModalContext";
import { useModal as useOldModal } from "@/hooks/useModal";
import { CircularProgress, Pagination } from "@mui/material";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowUpRight,
  Briefcase,
  Check,
  Clock,
  Download,
  Ellipsis,
  Eye,
  FileQuestion,
  HomeIcon,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Printer,
  RefreshCcwDot,
  Search,
  Trash,
  User,
  X,
} from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TextInput from "../../Inputs/TextInput";
import { printQR } from "../../ViewEv_Deps/printQr";
import { Atendee } from "@/interfaces/Interface";
import { useClickOutside } from "@/hooks/UseClickOutside";
import SortButton from "./SortButton";
import EventraPagination from "./Pagination";
import Link from "next/link";

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

interface OrdEvAttendeesParameters {
  fetching: boolean;
  data: Atendee[];
  evName: string;
  search: string;
  setSearch: (d: string) => void;
  currentSortMethod: string;
  onChangeSortMethod: (d: string) => void;
  refetchAtendees: () => void;
  dataSize: number;
  limit: number;
  currPage: number;
  onPageNumberClick: (d: number) => void;
  evId: string;
}
const setEditAtendeeDef = {
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
  id: "",
};

export default function OrdEvAttendees({
  fetching,
  data,
  evName,
  search,
  setSearch,
  currentSortMethod,
  onChangeSortMethod,
  refetchAtendees,
  dataSize,
  limit,
  currPage,
  onPageNumberClick,
  evId,
}: OrdEvAttendeesParameters) {
  const modal = useModal();
  const oldModalSys = useOldModal();
  const appData = useSelector(selectApp);

  const [editAtendee, setEditAtendee] = useState<any>({
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

  const [viewAtendee, setViewAtendee] = useState<any>({
    active: false,
    attended: false,
    name: "",
    orgN: "",
    orgP: "",
    email: "",
    number: "",
    addr: "",
    salutation: "",
    registeredOn: 0,
    id: "",
  });

  const deleteAtendee = (id: string, qrId: string): Promise<any> => {
    const cacheId = id;
    const cacheQrId = qrId;
    return new Promise(async (resolve, reject) => {
      try {
        const x = await axios
          .post(
            `${process.env.NEXT_PUBLIC_API}/delete-atendee`,
            { id: cacheId, qrId: cacheQrId },
            {
              withCredentials: true,
              headers: { Authorization: `Bearer ${appData.acsTok}` },
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
      title: "Atendee Deletion",
      description: `Confirm delete ${name}? ${name}'s Eventra Passport will be invalid, and data can't be recovered.`,
      onConfirm: async () => {
        modal.hide();

        modal.show({
          type: "loading",
          title: "Deleting atendee...",
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
              refetchAtendees();
            },

            confirmText: "Exit",
            icon: <Check />,
            color: "success",
          });
        } catch (e) {
          modal.hide();
          modal.show({
            type: "std",
            title: "Fail to delete atendee.",
            description: "We can't delete your atendee. Please try again.",
            onConfirm: () => {
              modal.hide();
            },

            confirmText: "Exit",
            icon: <Check />,
            color: "error",
          });
        }
      },
      onCancel: () => {
        modal.hide();
      },
      confirmText: "Delete",
      cancelText: "Exit",
      icon: <Trash />,
      color: "error",
    });
  };

  const updateEditedAtendee = async () => {
    let err = false;
    Object.keys(editAtendee).forEach((key) => {
      if (key === "active" || key === "id" || key === "addr") return;
      if (
        key === "email" &&
        !editAtendee.email.value.match(
          /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        )
      ) {
        setEditAtendee((pv) => ({
          ...pv,
          email: {
            ...pv.email,
            err: "Invalid email.",
          },
        }));
        err = true;
      }
      if (!editAtendee[key].value) {
        setEditAtendee((pv) => ({
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

    setEditAtendee((pv) => ({
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
                id: editAtendee.id,
                data: {
                  addr: editAtendee.addr.value,
                  attended:
                    editAtendee.attended.value === "true" ? true : false,
                  email: editAtendee.email.value,
                  name: editAtendee.name.value,
                  orgN: editAtendee.orgN.value,
                  orgP: editAtendee.orgP.value,
                  phoneNumber: editAtendee.number.value,
                  salutations: editAtendee.salutation.value,
                  attendBizMatch: editAtendee.attendBizMatch.value,
                  country: editAtendee.country.value,
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

    oldModalSys.promise(
      <FileQuestion />,
      "Confirm Atendee Update",
      `Update this atendee? Previous data won't be saved.`,
      () => {},
      () => {},
      "Update",
      "Cancel",
      () => req(),
      "Updating atendee...",
      <Check />,
      "Update complete",
      "Your atendee has been updated.",
      () => {
        setEditAtendee(setEditAtendeeDef);
        refetchAtendees();
      },
      () => {
        setEditAtendee(setEditAtendeeDef);
      },
      "Proceed",
      "",
      <X />,
      "Fail",
      "We have failed to update your atendee.",
      () => {
        updateEditedAtendee();
      },
      () => {
        setEditAtendee(setEditAtendeeDef);
      },
      "Try again",
      "Exit"
    );
  };

  const resendEmail = (id: string) => {
    const req = () => {
      return new Promise(async (resolve, reject) => {
        try {
          const rx = await axios
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
    oldModalSys.close();

    oldModalSys.promise(
      <Mail />,
      "Resend Email?",
      `Confirm to resend e-mail confirmation?`,
      () => {},
      () => {},
      "Send E-Mail",
      "Cancel",
      () => req(),
      "Resending E-Mail confirmation...",
      <Check />,
      "Confirmation E-Mail sent",
      "Your atendee has been sent a confirmation e-mail.",
      () => {
        setViewAtendee({
          active: false,
          attended: false,
          name: "",
          orgN: "",
          orgP: "",
          email: "",
          number: "",
          addr: "",
          salutation: "",
          registeredAt: 0,
          id: "",
        });
      },
      () => {},
      "Proceed",
      "",
      <X />,
      "Fail",
      "We have failed to send your atendee a confirmation e-mail.",
      () => {
        resendEmail(viewAtendee.id);
      },
      () => {
        setViewAtendee({
          active: false,
          attended: false,
          name: "",
          orgN: "",
          orgP: "",
          email: "",
          number: "",
          addr: "",
          salutation: "",
          registeredAt: 0,
          id: "",
        });
      },
      "Try again",
      "Exit"
    );
  };

  const handleDataExport = () => {
    const printXLSX = (): Promise<any> => {
      return new Promise(async (resolve, reject) => {
        try {
          const response = await axios
            .post(
              `${process.env.NEXT_PUBLIC_API}/download-xlsx-ord`,
              {
                evId: evId,
              },
              {
                responseType: "blob",
                withCredentials: true,
                headers: {
                  Authorization: `Bearer ${appData.acsTok}`,
                },
              }
            )
            .catch((e) => {
              throw new Error("Fail to export XLSX.");
            });

          const link = document.createElement("a");
          link.href = URL.createObjectURL(response.data);
          link.download = `${moment().format(
            "MMMDDyyyy-hh:mm:ssA"
          )}_AtendeeExport.xlsx`;
          link.click();
          resolve("");
        } catch (e: any) {
          reject(e.message);
        }
      });
    };

    oldModalSys.close();

    oldModalSys.promise(
      <ArrowUpRight />,
      "Data Export",
      "Confirm export attendee data?",
      () => {},
      () => {},
      "Export",
      "Cancel",
      () => printXLSX(),
      "Exporting attendees to XLSX...",
      <Check />,
      "Export complete",
      "Your attendees have been compiled to an XLSX.",
      () => {},
      () => {},
      "Proceed",
      "",
      <X />,
      "Fail",
      "Fail to export attendees to XLSX.",
      () => {
        handleDataExport();
      },
      () => {},
      "Try again",
      "Exit"
    );
  };

  return (
    <>
      <AnimatePresence>
        {viewAtendee.active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key={1}
            className="registration-form fixed w-full h-full top-0 left-0 bg-neutral-900/70 z-[9999] geist overflow-y-auto py-5 px-5"
          >
            <div className="flex items-center justify-center min-h-screen w-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: { delay: 0.2, duration: 0.2 },
                }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={13}
                className="form w-full max-w-[400px] bg-white rounded-xl overflow-hidden "
              >
                <div className="px-5 py-2 flex justify-between items-center bg-emerald-600 text-white">
                  <h1 className=" font-[500]">Atendee Information</h1>
                  <div
                    className="p-2 rounded-full w-max cursor-pointer"
                    onClick={() => {
                      setViewAtendee({
                        active: false,
                        attended: false,
                        name: "",
                        orgN: "",
                        orgP: "",
                        email: "",
                        number: "",
                        addr: "",
                        salutation: "",
                        registeredAt: 0,
                        id: "",
                      });
                    }}
                  >
                    <X size="15px" strokeWidth={5} />
                  </div>
                </div>
                <div className="flex flex-col gap-2 px-5 py-5">
                  {viewAtendee.attended && (
                    <p className="text-[11px] px-4 py-1 bg-emerald-50 border-1 border-emerald-600 text-emerald-600 w-max rounded-full text-xs">
                      IN EVENT
                    </p>
                  )}
                  {!viewAtendee.attended && (
                    <p className="text-[11px] px-4 py-1 bg-red-50 border-1 border-red-600 text-red-600 w-max rounded-full text-xs">
                      NOT IN EVENT
                    </p>
                  )}
                  <h1 className="font-[600] text-xl">{viewAtendee.name}</h1>
                  <p className="text-sm text-neutral-900 flex gap-2 items-center">
                    <Briefcase size="15px" />
                    {viewAtendee.orgN} - {viewAtendee.orgP}
                  </p>
                  <p className="text-sm text-neutral-900 flex gap-2 items-center">
                    <Mail size="15px" />
                    {viewAtendee.email}
                  </p>
                  <p className="text-sm text-neutral-900 flex gap-2 items-center">
                    <Phone size="15px" />
                    {viewAtendee.number}
                  </p>
                  <p className="text-sm text-neutral-900 flex gap-2 items-center">
                    <MapPin size="15px" />
                    {viewAtendee.addr || "N/A"}
                  </p>
                  <p className="text-sm text-neutral-900 flex gap-2 items-center">
                    <User size="15px" />
                    Salutation: {viewAtendee.salutation}
                  </p>
                  <p className="text-sm text-neutral-900 flex gap-2 items-center">
                    <Clock size="15px" />
                    Registered at:{" "}
                    {moment
                      .unix(viewAtendee.registeredAt)
                      .format("MMM DD, YYYY - hh:mm:ss A")}
                  </p>
                </div>
                <div className="px-5 py-4 flex gap-2">
                  <button
                    onClick={() => resendEmail(viewAtendee.id)}
                    className="px-5 text-black border-1 hover:bg-neutral-50 border-neutral-100 w-1/2 flex gap-2 items-center justify-center py-1.5 rounded-md text-sm"
                  >
                    <Mail size="12px" strokeWidth={3} className="shrink-0" />{" "}
                    Resend E-Mail
                  </button>
                  <button
                    onClick={() =>
                      printQR({
                        eventName: evName,
                        attendeeName: viewAtendee.name,
                        organization: viewAtendee.orgN,
                        position: viewAtendee.orgP,
                        identifier: viewAtendee.id,
                      })
                    }
                    className="px-5 bg-emerald-600 text-white w-1/2 flex gap-2 items-center justify-center py-1.5 rounded-md text-sm"
                  >
                    <Printer size="12px" strokeWidth={3} className="shrink-0" />{" "}
                    Print Passport
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {editAtendee.active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key={1}
            className="registration-form fixed w-full h-full top-0 left-0 bg-neutral-900/70 z-[9999] geist overflow-y-auto py-5 px-5"
          >
            <div className="flex items-center justify-center min-h-screen w-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: { delay: 0.2, duration: 0.2 },
                }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={13}
                className="form w-full max-w-[600px] bg-white rounded-xl overflow-hidden "
              >
                <div className="px-5 py-2 flex justify-between items-center bg-emerald-600 text-white">
                  <h1 className=" font-[500]">Edit Atendee</h1>
                  <div
                    className="p-2 rounded-full w-max cursor-pointer"
                    onClick={() => {
                      setEditAtendee(setEditAtendeeDef);
                    }}
                  >
                    <X size="15px" strokeWidth={5} />
                  </div>
                </div>
                <div className="p-5 flex flex-col gap-2">
                  <div className="flex gap-2">
                    <TextInput
                      identifier="name"
                      title="Atendee Name"
                      value={editAtendee.name.value}
                      placeholder=""
                      onInput={(e) => {
                        setEditAtendee((pv) => ({
                          ...pv,
                          name: {
                            err: "",
                            value: e,
                          },
                        }));
                      }}
                      error={editAtendee.name.err}
                      className="w-1/2"
                      req
                    />
                    <TextInput
                      identifier="salutation"
                      title="Salutations"
                      value={editAtendee.salutation.value}
                      placeholder=""
                      onInput={(e) => {
                        setEditAtendee((pv) => ({
                          ...pv,
                          salutation: {
                            err: "",
                            value: e,
                          },
                        }));
                      }}
                      error={editAtendee.salutation.err}
                      className="w-1/2"
                      req
                    />
                  </div>
                  <TextInput
                    identifier="email"
                    title="E-Mail"
                    value={editAtendee.email.value}
                    placeholder=""
                    onInput={(e) => {
                      setEditAtendee((pv) => ({
                        ...pv,
                        email: {
                          err: "",
                          value: e,
                        },
                      }));
                    }}
                    error={editAtendee.email.err}
                    className=""
                    req
                  />
                  <div className="flex gap-2">
                    <TextInput
                      identifier="orgN"
                      title="Organization Name"
                      value={editAtendee.orgN.value}
                      placeholder=""
                      onInput={(e) => {
                        setEditAtendee((pv) => ({
                          ...pv,
                          orgN: {
                            err: "",
                            value: e,
                          },
                        }));
                      }}
                      error={editAtendee.orgN.err}
                      className="w-1/2"
                      req
                    />
                    <TextInput
                      identifier="orgP"
                      title="Organization Position"
                      value={editAtendee.orgP.value}
                      placeholder=""
                      onInput={(e) => {
                        setEditAtendee((pv) => ({
                          ...pv,
                          orgP: {
                            err: "",
                            value: e,
                          },
                        }));
                      }}
                      error={editAtendee.orgP.err}
                      className="w-1/2"
                      req
                    />
                  </div>
                  <TextInput
                    identifier="ph"
                    title="Phone Number"
                    value={editAtendee.number.value}
                    placeholder=""
                    onInput={(e) => {
                      setEditAtendee((pv) => ({
                        ...pv,
                        number: {
                          err: "",
                          value: e,
                        },
                      }));
                    }}
                    error={editAtendee.number.err}
                    className=""
                    req
                  />
                  <TextInput
                    identifier="address"
                    title="Address"
                    value={editAtendee.addr.value}
                    placeholder=""
                    onInput={(e) => {
                      setEditAtendee((pv) => ({
                        ...pv,
                        addr: {
                          err: "",
                          value: e,
                        },
                      }));
                    }}
                    error={editAtendee.addr.err}
                    className=""
                  />
                  <div>
                    <label htmlFor="country" className="font-[500] text-sm">
                      Country
                      <span className="font-[500] text-red-600">*</span>
                    </label>
                    <select
                      name="country"
                      id="country-select"
                      value={editAtendee.country.value}
                      onChange={(e) => {
                        setEditAtendee((pv) => ({
                          ...pv,
                          country: { value: e.target.value, err: "" },
                        }));
                      }}
                      className="mt-1.5 w-full border-1 rounded-lg py-1.5 px-3 border-neutral-200 outline-neutral-400 outline-offset-4"
                    >
                      <option value="none" disabled selected>
                        Select a country...
                      </option>
                      <option value="AF">Afghanistan</option>
                      <option value="AL">Albania</option>
                      <option value="DZ">Algeria</option>
                      <option value="AD">Andorra</option>
                      <option value="AO">Angola</option>
                      <option value="AG">Antigua and Barbuda</option>
                      <option value="AR">Argentina</option>
                      <option value="AM">Armenia</option>
                      <option value="AU">Australia</option>
                      <option value="AT">Austria</option>
                      <option value="AZ">Azerbaijan</option>
                      <option value="BS">Bahamas</option>
                      <option value="BH">Bahrain</option>
                      <option value="BD">Bangladesh</option>
                      <option value="BB">Barbados</option>
                      <option value="BY">Belarus</option>
                      <option value="BE">Belgium</option>
                      <option value="BZ">Belize</option>
                      <option value="BJ">Benin</option>
                      <option value="BT">Bhutan</option>
                      <option value="BO">Bolivia</option>
                      <option value="BA">Bosnia and Herzegovina</option>
                      <option value="BW">Botswana</option>
                      <option value="BR">Brazil</option>
                      <option value="BN">Brunei</option>
                      <option value="BG">Bulgaria</option>
                      <option value="BF">Burkina Faso</option>
                      <option value="BI">Burundi</option>
                      <option value="CV">Cabo Verde</option>
                      <option value="KH">Cambodia</option>
                      <option value="CM">Cameroon</option>
                      <option value="CA">Canada</option>
                      <option value="CF">Central African Republic</option>
                      <option value="TD">Chad</option>
                      <option value="CL">Chile</option>
                      <option value="CN">China</option>
                      <option value="CO">Colombia</option>
                      <option value="KM">Comoros</option>
                      <option value="CD">Congo (DRC)</option>
                      <option value="CG">Congo (Republic)</option>
                      <option value="CR">Costa Rica</option>
                      <option value="CI">Côte d'Ivoire</option>
                      <option value="HR">Croatia</option>
                      <option value="CU">Cuba</option>
                      <option value="CY">Cyprus</option>
                      <option value="CZ">Czech Republic</option>
                      <option value="DK">Denmark</option>
                      <option value="DJ">Djibouti</option>
                      <option value="DM">Dominica</option>
                      <option value="DO">Dominican Republic</option>
                      <option value="EC">Ecuador</option>
                      <option value="EG">Egypt</option>
                      <option value="SV">El Salvador</option>
                      <option value="GQ">Equatorial Guinea</option>
                      <option value="ER">Eritrea</option>
                      <option value="EE">Estonia</option>
                      <option value="SZ">Eswatini</option>
                      <option value="ET">Ethiopia</option>
                      <option value="FJ">Fiji</option>
                      <option value="FI">Finland</option>
                      <option value="FR">France</option>
                      <option value="GA">Gabon</option>
                      <option value="GM">Gambia</option>
                      <option value="GE">Georgia</option>
                      <option value="DE">Germany</option>
                      <option value="GH">Ghana</option>
                      <option value="GR">Greece</option>
                      <option value="GD">Grenada</option>
                      <option value="GT">Guatemala</option>
                      <option value="GN">Guinea</option>
                      <option value="GW">Guinea-Bissau</option>
                      <option value="GY">Guyana</option>
                      <option value="HT">Haiti</option>
                      <option value="HN">Honduras</option>
                      <option value="HU">Hungary</option>
                      <option value="IS">Iceland</option>
                      <option value="IN">India</option>
                      <option value="ID">Indonesia</option>
                      <option value="IR">Iran</option>
                      <option value="IQ">Iraq</option>
                      <option value="IE">Ireland</option>
                      <option value="IL">Israel</option>
                      <option value="IT">Italy</option>
                      <option value="JM">Jamaica</option>
                      <option value="JP">Japan</option>
                      <option value="JO">Jordan</option>
                      <option value="KZ">Kazakhstan</option>
                      <option value="KE">Kenya</option>
                      <option value="KI">Kiribati</option>
                      <option value="KW">Kuwait</option>
                      <option value="KG">Kyrgyzstan</option>
                      <option value="LA">Laos</option>
                      <option value="LV">Latvia</option>
                      <option value="LB">Lebanon</option>
                      <option value="LS">Lesotho</option>
                      <option value="LR">Liberia</option>
                      <option value="LY">Libya</option>
                      <option value="LI">Liechtenstein</option>
                      <option value="LT">Lithuania</option>
                      <option value="LU">Luxembourg</option>
                      <option value="MG">Madagascar</option>
                      <option value="MW">Malawi</option>
                      <option value="MY">Malaysia</option>
                      <option value="MV">Maldives</option>
                      <option value="ML">Mali</option>
                      <option value="MT">Malta</option>
                      <option value="MH">Marshall Islands</option>
                      <option value="MR">Mauritania</option>
                      <option value="MU">Mauritius</option>
                      <option value="MX">Mexico</option>
                      <option value="FM">Micronesia</option>
                      <option value="MD">Moldova</option>
                      <option value="MC">Monaco</option>
                      <option value="MN">Mongolia</option>
                      <option value="ME">Montenegro</option>
                      <option value="MA">Morocco</option>
                      <option value="MZ">Mozambique</option>
                      <option value="MM">Myanmar</option>
                      <option value="NA">Namibia</option>
                      <option value="NR">Nauru</option>
                      <option value="NP">Nepal</option>
                      <option value="NL">Netherlands</option>
                      <option value="NZ">New Zealand</option>
                      <option value="NI">Nicaragua</option>
                      <option value="NE">Niger</option>
                      <option value="NG">Nigeria</option>
                      <option value="MK">North Macedonia</option>
                      <option value="NO">Norway</option>
                      <option value="OM">Oman</option>
                      <option value="PK">Pakistan</option>
                      <option value="PW">Palau</option>
                      <option value="PA">Panama</option>
                      <option value="PG">Papua New Guinea</option>
                      <option value="PY">Paraguay</option>
                      <option value="PE">Peru</option>
                      <option value="PH">Philippines</option>
                      <option value="PL">Poland</option>
                      <option value="PT">Portugal</option>
                      <option value="QA">Qatar</option>
                      <option value="RO">Romania</option>
                      <option value="RU">Russia</option>
                      <option value="RW">Rwanda</option>
                      <option value="KN">Saint Kitts and Nevis</option>
                      <option value="LC">Saint Lucia</option>
                      <option value="VC">
                        Saint Vincent and the Grenadines
                      </option>
                      <option value="WS">Samoa</option>
                      <option value="SM">San Marino</option>
                      <option value="ST">Sao Tome and Principe</option>
                      <option value="SA">Saudi Arabia</option>
                      <option value="SN">Senegal</option>
                      <option value="RS">Serbia</option>
                      <option value="SC">Seychelles</option>
                      <option value="SL">Sierra Leone</option>
                      <option value="SG">Singapore</option>
                      <option value="SK">Slovakia</option>
                      <option value="SI">Slovenia</option>
                      <option value="SB">Solomon Islands</option>
                      <option value="SO">Somalia</option>
                      <option value="ZA">South Africa</option>
                      <option value="KR">South Korea</option>
                      <option value="SS">South Sudan</option>
                      <option value="ES">Spain</option>
                      <option value="LK">Sri Lanka</option>
                      <option value="SD">Sudan</option>
                      <option value="SR">Suriname</option>
                      <option value="SE">Sweden</option>
                      <option value="CH">Switzerland</option>
                      <option value="SY">Syria</option>
                      <option value="TW">Taiwan</option>
                      <option value="TJ">Tajikistan</option>
                      <option value="TZ">Tanzania</option>
                      <option value="TH">Thailand</option>
                      <option value="TL">Timor-Leste</option>
                      <option value="TG">Togo</option>
                      <option value="TO">Tonga</option>
                      <option value="TT">Trinidad and Tobago</option>
                      <option value="TN">Tunisia</option>
                      <option value="TR">Turkey</option>
                      <option value="TM">Turkmenistan</option>
                      <option value="TV">Tuvalu</option>
                      <option value="UG">Uganda</option>
                      <option value="UA">Ukraine</option>
                      <option value="AE">United Arab Emirates</option>
                      <option value="GB">United Kingdom</option>
                      <option value="US">United States</option>
                      <option value="UY">Uruguay</option>
                      <option value="UZ">Uzbekistan</option>
                      <option value="VU">Vanuatu</option>
                      <option value="VA">Vatican City</option>
                      <option value="VE">Venezuela</option>
                      <option value="VN">Vietnam</option>
                      <option value="YE">Yemen</option>
                      <option value="ZM">Zambia</option>
                      <option value="ZW">Zimbabwe</option>
                    </select>
                  </div>
                  <AnimatePresence>
                    {editAtendee.country.err && (
                      <motion.div
                        key={1}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="warn mt-[5px] flex items-center gap-2 text-xs text-red-600"
                      >
                        <AlertTriangle size="13px" className="shrink-0" />
                        {editAtendee.country.err}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div>
                    <label htmlFor="attended" className="font-[500] text-sm">
                      BizMatch Status
                      <span className="font-[500] text-red-600">*</span>
                    </label>
                    <select
                      name="attended"
                      id=""
                      value={editAtendee.attendBizMatch.value}
                      onChange={(e) => {
                        setEditAtendee((pv) => ({
                          ...pv,
                          attendBizMatch: {
                            value: (e.target as HTMLSelectElement).value,
                            err: "",
                          },
                        }));
                      }}
                      className="mt-1.5 w-full border-1 rounded-lg py-1.5 px-3 border-neutral-200 outline-neutral-400 outline-offset-4"
                    >
                      <option value="none" disabled selected>
                        Select an entry...
                      </option>
                      <option value="ys">
                        Sure, I would like to receive a confirmation.
                      </option>
                      <option value="ym">
                        Yes, maybe I'll attend. I would like to receive a follow
                        up email.
                      </option>
                      <option value="no">No, I'm not interested.</option>
                    </select>
                  </div>
                  <AnimatePresence>
                    {editAtendee.attendBizMatch.err && (
                      <motion.div
                        key={1}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="warn mt-[5px] flex items-center gap-2 text-xs text-red-600"
                      >
                        <AlertTriangle size="13px" className="shrink-0" />
                        {editAtendee.attendBizMatch.err}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div>
                    <label htmlFor="attended" className="font-[500] text-sm">
                      Status
                      <span className="font-[500] text-red-600">*</span>
                    </label>
                    <select
                      name="attended"
                      id=""
                      value={editAtendee.attended.value}
                      onChange={(e) => {
                        setEditAtendee((pv) => ({
                          ...pv,
                          attended: {
                            value: (e.target as HTMLSelectElement).value,
                            err: "",
                          },
                        }));
                      }}
                      className="mt-1.5 w-full border-1 rounded-lg py-1.5 px-3 border-neutral-200 outline-neutral-400 outline-offset-4"
                    >
                      <option value="true">IN EVENT</option>
                      <option value="false">NOT IN EVENT</option>
                    </select>
                  </div>
                  <div className="buttons flex justify-end">
                    <button
                      onClick={() => {
                        updateEditedAtendee();
                      }}
                      className="px-5 bg-emerald-600 text-white w-max flex gap-2 items-center justify-center py-1.5 rounded-md text-sm"
                    >
                      Upload Changes
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div>
        <div className="flex justify-between items-center">
          <h1 className=" font-[500] text-sm">Atendees</h1>
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
                  setSearch((d.target as HTMLInputElement).value);
                }}
                value={search}
                className="text-xs w-full border-1 rounded-lg py-1.5 px-3 border-neutral-200 outline-neutral-400 outline-offset-4"
              />
            </div>

            <SortButton
              currentSortMethod={currentSortMethod}
              onChangeSortMethod={onChangeSortMethod}
            />

            <div>
              <button
                onClick={() => refetchAtendees()}
                className="text-xs bg-white hover:bg-neutral-50 border-1 border-neutral-200 px-5 py-1.5 text-black flex items-center gap-2 rounded-md"
              >
                <RefreshCcwDot size="15px" /> Refresh{" "}
              </button>
            </div>

            <div>
              <button
                onClick={() => {
                  handleDataExport();
                }}
                className="text-xs bg-black hover:bg-neutral-800 px-5 py-1.5 text-white flex items-center gap-2 rounded-md"
              >
                <Download size="15px" /> Export Data to XLSX
              </button>
            </div>
          </div>
        </div>
        {!fetching && (
          <>
            {data.length === 0 && (
              <p className="text-center mt-10">No atendees.</p>
            )}

            {data.length !== 0 && (
              <>
                <div className="h-[400px] atendee-table mt-5 rounded-lg overflow-hidden border-1 border-neutral-200 overflow-y-scroll">
                  <div className="relative overflow-x-scroll w-full">
                    <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] bg-white font-[500] geist text-xs">
                      <div className="contents">
                        <div className="p-3 font-[500] bg-neutral-100 whitespace-nowrap">
                          Attendee
                        </div>
                        <div className="p-3 font-[500] bg-neutral-100 whitespace-nowrap">
                          Organization
                        </div>
                        <div className="p-3 font-[500] bg-neutral-100 whitespace-nowrap">
                          Phone Number
                        </div>
                        <div className="p-3 font-[500] bg-neutral-100 whitespace-nowrap">
                          Salutation
                        </div>
                        <div className="p-3 font-[500] bg-neutral-100 whitespace-nowrap">
                          Country
                        </div>
                        <div className="p-3 font-[500] bg-neutral-100 whitespace-nowrap">
                          Address
                        </div>
                        <div className="p-3 font-[500] bg-neutral-100 whitespace-nowrap">
                          Registered On
                        </div>
                        <div className="p-3 font-[500] bg-neutral-100 whitespace-nowrap">
                          BizMatch Status
                        </div>
                        <div className="p-3 font-[500] bg-neutral-100 whitespace-nowrap">
                          In Event?
                        </div>
                        <div className="p-3  font-[500] bg-neutral-100 whitespace-nowrap sticky right-0 z-10">
                          Options
                        </div>
                      </div>

                      {data.map((d, i) => {
                        return (
                          <div
                            key={i}
                            className="contents border-b-1 border-neutral-200 font-[500] geist text-xs"
                          >
                            <div className="px-5 py-2  flex justify-center flex-col whitespace-nowrap">
                              <p className="truncate">{d.name}</p>
                              <Link href={`mailto:${d.email}`}>
                                <p className="font-[400] text-neutral-800 truncate flex items-center gap-1">
                                  {d.email}
                                </p>
                              </Link>
                            </div>
                            <div className="px-5 py-2  flex justify-center flex-col whitespace-nowrap">
                              <p>{d.orgN}</p>
                              <p className="font-[400] text-neutral-800 flex items-center gap-1 truncate">
                                <Briefcase size="12px" className="shrink-0" />
                                {d.orgP}
                              </p>
                            </div>
                            <div className="px-5 py-2 flex items-center whitespace-nowrap">
                              <p className="font-[400] flex gap-1 items-center truncate">
                                <Phone size="12px" className="shrink-0" />
                                {d.phoneNumber}
                              </p>
                            </div>
                            <div className="px-5 py-2 flex items-center whitespace-nowrap">
                              <p className="font-[400] flex gap-1 items-center truncate">
                                <User size="12px" className="shrink-0" />
                                {d.salutations}
                              </p>
                            </div>
                            <div className="px-5 py-2  flex items-center whitespace-nowrap">
                              <p className="font-[400]">
                                {countriesKV[d.country]}
                              </p>
                            </div>
                            <div className="px-5 py-2 flex items-center whitespace-nowrap">
                              <p className="font-[400] flex gap-1 items-center truncate">
                                <HomeIcon size="12px" className="shrink-0" />
                                {d.addr || "N/A"}
                              </p>
                            </div>
                            <div className="px-5 py-2  flex items-center whitespace-nowrap">
                              <p className="font-[400]">
                                {moment
                                  .unix(d.registeredOn)
                                  .format("MMM DD, YYYY (hh:mm A)")}
                              </p>
                            </div>
                            <div className="px-5 py-2  flex items-center whitespace-nowrap">
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

                            <div className="px-5 py-2 flex items-center whitespace-nowrap">
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

                            <div className="bg-white px-5 py-2 text-right flex items-center gap-2 justify-end sticky z-[10] right-0">
                              <button
                                onClick={() => {
                                  setEditAtendee({
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
                                <Pencil size="15px" />
                              </button>
                              <button
                                onClick={() => {
                                  setViewAtendee({
                                    active: true,
                                    attended: d.attended,
                                    name: d.name,
                                    orgN: d.orgN,
                                    orgP: d.orgP,
                                    email: d.email,
                                    number: d.phoneNumber,
                                    addr: d.addr,
                                    salutation: d.salutations,
                                    registeredAt: d.registeredOn,
                                    id: d.id,
                                  });
                                }}
                                className="p-2 bg-white hover:bg-neutral-50 border-1 border-neutral-200 rounded-md"
                              >
                                <Eye size="15px" />
                              </button>
                              <button
                                onClick={() =>
                                  printQR({
                                    eventName: evName,
                                    attendeeName: d.name,
                                    organization: d.orgN,
                                    position: d.orgP,
                                    identifier: d.id,
                                  })
                                }
                                className="p-2 bg-white hover:bg-neutral-50 border-1 border-neutral-200 rounded-md"
                              >
                                <Printer size="15px" />
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
                                <Trash size="15px" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <EventraPagination
                  dataSize={dataSize}
                  currPage={currPage}
                  limit={limit}
                  onPageNumberClick={onPageNumberClick}
                />
              </>
            )}
          </>
        )}

        {fetching && (
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
