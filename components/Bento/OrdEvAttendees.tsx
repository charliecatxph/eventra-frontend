import { selectApp } from "@/features/appSlice";
import { useModal } from "@/hooks/useModal";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Briefcase,
  Check,
  Clock,
  Download,
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
import TextInput from "../Inputs/TextInput";
import { printQR } from "../ViewEv_Deps/printQr";
import { Atendee } from "@/interfaces/Interface";

interface OrdEvAttendeesParameters {
  fetching: boolean;
  data: Atendee[];
  evName: string;
  refetchAtendees: () => void;
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
  refetchAtendees,
}: OrdEvAttendeesParameters) {
  const modal = useModal();
  const appData = useSelector(selectApp);

  const [search, setSearch] = useState<string>("");
  const [filtered, setFiltered] = useState<any[]>([]);

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
    modal.promise(
      <FileQuestion />,
      "Atendee Deletion",
      `Confirm delete ${name}? ${name}'s Eventra Passport will be invalid, and data can't be recovered.`,
      () => {},
      () => {},
      "Delete",
      "Cancel",
      () => deleteAtendee(id, qrId),
      "Deleting atendee...",
      <Check />,
      "Delete complete",
      "Your atendee has been deleted.",
      () => {
        refetchAtendees();
      },
      () => {},
      "Proceed",
      "",
      <X />,
      "Fail",
      "We have failed to delete your atendee.",
      () => {},
      () => {},
      "Try again",
      "Exit"
    );
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

    modal.promise(
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
    modal.close();
    modal.promise(
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

  // handles atendee filtration
  useEffect(() => {
    if (data.length === 0) {
      setFiltered([]);
      return;
    }
    const tmp = data.filter((attendee) =>
      Object.values(attendee).some((value) =>
        value.toString().toLowerCase().includes(search.toLowerCase())
      )
    );

    setFiltered(tmp);
  }, [search, data]);
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
        {!fetching && (
          <>
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
                    className="text-xs bg-black hover:bg-neutral-800 px-5 py-1.5 text-white flex items-center gap-2 rounded-md"
                  >
                    <Download size="15px" /> Export Data
                  </button>
                </div>
              </div>
            </div>
            {filtered.length === 0 && (
              <p className="text-center mt-10">No atendees.</p>
            )}

            {filtered.length !== 0 && (
              <>
                <div className="atendee-table mt-5 rounded-lg overflow-hidden border-1 border-neutral-200 max-h-[500px] overflow-y-scroll">
                  <div className="relative overflow-x-scroll w-full">
                    <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] bg-white font-[500] geist text-xs">
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
                          Address
                        </div>
                        <div className="p-3 font-[500] bg-neutral-100 whitespace-nowrap">
                          Registered On
                        </div>
                        <div className="p-3 font-[500] bg-neutral-100 whitespace-nowrap">
                          In Event?
                        </div>
                        <div className="p-3  font-[500] bg-neutral-100 whitespace-nowrap sticky right-0 z-10">
                          Options
                        </div>
                      </div>

                      {filtered.map((d, i) => {
                        return (
                          <div
                            key={i}
                            className="contents border-b-1 border-neutral-200 font-[500] geist text-xs"
                          >
                            <div className="px-5 py-2  flex justify-center flex-col whitespace-nowrap">
                              <p className="truncate">{d.name}</p>
                              <p className="font-[400] text-neutral-800 truncate">
                                {d.email}
                              </p>
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
