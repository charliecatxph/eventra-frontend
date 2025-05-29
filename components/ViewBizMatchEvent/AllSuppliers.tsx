import { AnimatePresence, motion } from "framer-motion";
import {
  Boxes,
  Check,
  Eye,
  FileQuestion,
  Globe,
  Lock,
  MapPin,
  Pencil,
  Repeat,
  Trash,
  X,
} from "lucide-react";
import { CircularProgress } from "@mui/material";
import TextInput from "@/components/Inputs/TextInput";
import CountrySelect from "@/components/Inputs/CountrySelect";
import { useState, useRef } from "react";
import { useModal } from "@/components/Modal/ModalContext";
import axios from "axios";
import { selectApp } from "@/features/appSlice";
import { useSelector } from "react-redux";
import { countriesKV } from "@/lib/constants/countries";
import CropperModal from "./CropperModal";

const editSupplier__defaults = {
  active: false,
  supplierName: {
    value: "",
    err: "",
  },
  location: {
    value: "",
    err: "",
  },
  website: {
    value: "",
    err: "",
  },
  country: "PH",
  accessCode: {
    value: "",
    err: "",
  },
  status: "open",
  description: {
    value: "",
    err: "",
  },
};

export default function AllSuppliers({ isFetching, data }) {
  const modal = useModal();
  const appData = useSelector(selectApp);
  const fileInputRef = useRef(null);
  const [showCropper, setShowCropper] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState("");
  const [editSupplier, setEditSupplier] = useState<any>({
    active: false,
    id: "",
    supplierName: {
      value: "",
      err: "",
    },
    location: {
      value: "",
      err: "",
    },
    website: {
      value: "",
      err: "",
    },
    country: "PH",
    accessCode: {
      value: "",
      err: "",
    },
    logo: {
      value: "", // URL from backend
      file: null, // File object when user uploads
      err: "",
    },
    status: "open",
    description: {
      value: "",
      err: "",
    },
  });

  const validateFields = () => {
    let hasErrors = false;
    const newEditSupplier = { ...editSupplier };

    // Validate supplier name
    if (!editSupplier.supplierName.value.trim()) {
      newEditSupplier.supplierName.err = "Supplier name is required";
      hasErrors = true;
    } else {
      newEditSupplier.supplierName.err = "";
    }

    // Validate location
    if (!editSupplier.location.value.trim()) {
      newEditSupplier.location.err = "Location is required";
      hasErrors = true;
    } else {
      newEditSupplier.location.err = "";
    }

    // Validate website
    try {
      const url = new URL(editSupplier.website.value.trim());
      if (
        !url.hostname.match(
          /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/
        )
      ) {
        newEditSupplier.website.err = "Invalid website URL format";
        hasErrors = true;
      } else {
        newEditSupplier.website.err = "";
      }
    } catch (e) {
      newEditSupplier.website.err = "Invalid website URL";
      hasErrors = true;
    }

    // Validate access code if provided
    if (editSupplier.accessCode.value.trim()) {
      if (editSupplier.accessCode.value.length < 6) {
        newEditSupplier.accessCode.err =
          "Access code must be at least 6 characters";
        hasErrors = true;
      } else {
        newEditSupplier.accessCode.err = "";
      }
    }

    // Update state with validation results
    setEditSupplier(newEditSupplier);
    return !hasErrors;
  };

  const handleSupplierUpdate = async () => {
    // Validate fields first
    if (!validateFields()) {
      return; // Stop if there are validation errors
    }

    const req = () => {
      return new Promise(async (resolve, reject) => {
        try {
          const formData = new FormData();

          // Add all the text fields
          formData.append("suplId", editSupplier.id);
          formData.append("name", editSupplier.supplierName.value);
          formData.append("country", editSupplier.country);
          formData.append("website", editSupplier.website.value);
          formData.append("location", editSupplier.location.value);
          formData.append("acsCode", editSupplier.accessCode.value);
          formData.append("description", editSupplier.description.value);
          formData.append("status", editSupplier.status);

          // Only append file if user has uploaded one
          if (editSupplier.logo.file) {
            formData.append("logo", editSupplier.logo.file);
          }

          await axios
            .post(`${process.env.NEXT_PUBLIC_API}/update-supplier`, formData, {
              withCredentials: true,
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${appData.acsTok}`,
              },
            })
            .catch((e) => {
              throw new Error(e.response.data.err);
            });
          resolve("");
        } catch (e) {
          reject(e);
        }
      });
    };

    setEditSupplier((pv) => ({
      ...pv,
      active: false,
    }));

    modal.hide();
    modal.show({
      type: "std",
      title: "Confirm Supplier Update",
      description: "Update this supplier? Previous data won't be saved.",
      onConfirm: async () => {
        modal.hide();
        modal.show({
          type: "loading",
          title: "Updating supplier...",
          color: "neutral",
        });
        req()
          .then((d) => {
            modal.hide();
            modal.show({
              type: "std",
              title: "Update complete",
              description: "Your supplier has been updated.",
              onConfirm: async () => {
                modal.hide();
                setEditSupplier(editSupplier__defaults);
                // fetchData("attendees")
              },

              confirmText: "Proceed",

              icon: <Check />,
              color: "success",
            });
          })
          .catch((e) => {
            console.log(e);
            modal.hide();
            modal.show({
              type: "std",
              title: "Fail",
              description: "We have failed to update your supplier.",
              onConfirm: async () => {
                modal.hide();
                handleSupplierUpdate();
              },
              onCancel: () => {
                modal.hide();
                setEditSupplier(editSupplier__defaults);
              },
              confirmText: "Try Again",
              cancelText: "Exit",
              icon: <X />,
              color: "error",
            });
          });
      },
      onCancel: () => {
        modal.hide();
        setEditSupplier((pv) => ({
          ...pv,
          active: true,
        }));
      },
      confirmText: "Apply Changes",
      cancelText: "Cancel",
      icon: <FileQuestion />,
      color: "success",
    });
  };

  const statusOverride = ({
    suplId,
    name,
    country,
    website,
    location,
    acsCode,
    open,
    description,
  }) => {
    const req = () => {
      return new Promise(async (resolve, reject) => {
        try {
          const formData = new FormData();

          // Add all the text fields
          formData.append("suplId", suplId);
          formData.append("name", name);
          formData.append("country", country);
          formData.append("website", website);
          formData.append("location", location);
          formData.append("acsCode", acsCode);
          formData.append("description", description || "");
          formData.append("status", open ? "open" : "closed");

          await axios
            .post(`${process.env.NEXT_PUBLIC_API}/update-supplier`, formData, {
              withCredentials: true,
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${appData.acsTok}`,
              },
            })
            .catch((e) => {
              throw new Error(e.response.data.err);
            });
          resolve("");
        } catch (e) {
          reject(e);
        }
      });
    };

    modal.hide();
    modal.show({
      type: "std",
      title: "Status Override",
      description: `This action will flip the supplier's state from ${
        open ? "OPEN" : "CLOSED"
      } to ${!open ? "OPEN" : "CLOSED"}.`,
      onConfirm: async () => {
        modal.hide();
        modal.show({
          type: "loading",
          title: "Updating supplier...",
          color: "neutral",
        });
        req()
          .then((d) => {
            modal.hide();
            modal.show({
              type: "std",
              title: "Override complete",
              description: "Your supplier's state has been overridden.",
              onConfirm: async () => {
                modal.hide();
              },
              confirmText: "Proceed",
              icon: <Check />,
              color: "success",
            });
          })
          .catch((e) => {
            console.log(e);
            modal.hide();
            modal.show({
              type: "std",
              title: "Fail",
              description: "We have failed to update your supplier.",
              onConfirm: async () => {
                modal.hide();
                statusOverride({
                  suplId,
                  name,
                  country,
                  website,
                  location,
                  acsCode,
                  open,
                  description,
                });
              },
              onCancel: () => {
                modal.hide();
              },
              confirmText: "Try Again",
              cancelText: "Exit",
              icon: <X />,
              color: "error",
            });
          });
      },
      onCancel: () => {
        modal.hide();
      },
      confirmText: "Apply Changes",
      cancelText: "Cancel",
      icon: <Repeat />,
      color: "success",
    });
  };

  return (
    <>
      <AnimatePresence>
        {editSupplier.active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key={1}
            className="overlay h-full w-full fixed top-0 left-0 z-[999] bg-slate-900/80 overflow-y-auto py-5 px-5"
          >
            <div className="w-full min-h-screen grid place-items-center">
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
                <div className="px-5 py-2 flex justify-between items-center bg-emerald-700 text-white">
                  <h1 className=" font-[700]">Edit Supplier</h1>
                  <div
                    className="p-2 rounded-full w-max cursor-pointer"
                    onClick={() => {
                      setEditSupplier(editSupplier__defaults);
                    }}
                  >
                    <X size="15px" strokeWidth={5} />
                  </div>
                </div>
                <div className="p-5 flex flex-col gap-2">
                  <div className="flex gap-2">
                    <TextInput
                      identifier="suplN"
                      title="Supplier Name"
                      value={editSupplier.supplierName.value}
                      onInput={(d) => {
                        setEditSupplier((pv) => ({
                          ...pv,
                          supplierName: {
                            value: d,
                            err: "",
                          },
                        }));
                      }}
                      error={editSupplier.supplierName.err}
                      placeholder=""
                      className="w-1/2"
                      req
                    />
                    <TextInput
                      identifier="location"
                      title="Location"
                      value={editSupplier.location.value}
                      onInput={(d) => {
                        setEditSupplier((pv) => ({
                          ...pv,
                          location: {
                            value: d,
                            err: "",
                          },
                        }));
                      }}
                      error={editSupplier.location.err}
                      placeholder=""
                      className="w-1/2"
                    />
                  </div>
                  <TextInput
                    identifier="website"
                    title="Website"
                    value={editSupplier.website.value}
                    onInput={(d) => {
                      setEditSupplier((pv) => ({
                        ...pv,
                        website: {
                          value: d,
                          err: "",
                        },
                      }));
                    }}
                    error={editSupplier.website.err}
                    placeholder=""
                    className=""
                    req
                  />

                  <CountrySelect
                    value={editSupplier.country}
                    onChangeCountry={(country) => {
                      setEditSupplier((pv) => ({
                        ...pv,
                        country,
                      }));
                    }}
                  />

                  <div className="flex flex-col">
                    <label htmlFor="description" className="font-[500] text-sm">
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={editSupplier.description.value}
                      onChange={(e) => {
                        setEditSupplier((pv) => ({
                          ...pv,
                          description: { value: e.target.value, err: "" },
                        }));
                      }}
                      className="mt-1.5 w-full border-1 rounded-lg py-1.5 px-3 border-neutral-200 outline-neutral-400 outline-offset-4 min-h-[100px] resize-none"
                      placeholder="Enter supplier description..."
                    />
                    {editSupplier.description.err && (
                      <p className="text-red-500 text-xs mt-1">
                        {editSupplier.description.err}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col">
                      <h1 className="font-[500] mt-1 text-sm">
                        Logo<span className="text-red-600">*</span>
                      </h1>
                      <div className="flex-1 border-1 rounded-lg p-5  mt-1 flex justify-between items-center border-neutral-100">
                        <div className="image size-20 rounded-full bg-white overflow-hidden border-1 border-neutral-200">
                          <img
                            src={
                              editSupplier.logo.file
                                ? URL.createObjectURL(editSupplier.logo.file)
                                : editSupplier.logo.value
                            }
                            alt=""
                          />
                        </div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const imageUrl = URL.createObjectURL(file);
                              setTempImageUrl(imageUrl);
                              setShowCropper(true);
                            }
                          }}
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-white px-5 py-1 font-[500] rounded-md text-sm flex gap-2 items-center hover:bg-neutral-200"
                        >
                          <Repeat size="14px" /> Change
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between">
                      <div>
                        <TextInput
                          identifier="acs-code"
                          title="Access Code"
                          value={editSupplier.accessCode.value}
                          onInput={(d) => {
                            setEditSupplier((pv) => ({
                              ...pv,
                              accessCode: {
                                value: d,
                                err: "",
                              },
                            }));
                          }}
                          error={editSupplier.accessCode.err}
                          placeholder=""
                          className=""
                        />
                        <p className="bg-blue-50 text-blue-600 mt-1 px-4 py-1 rounded-md font-[500] text-xs">
                          Leave empty to auto-generate.
                        </p>
                      </div>
                      <div>
                        <label htmlFor="status" className="font-[500] text-sm">
                          Status
                          <span className="font-[500] text-red-600">*</span>
                        </label>
                        <select
                          name="status"
                          id="status"
                          value={editSupplier.status}
                          onChange={(d) => {
                            setEditSupplier((pv) => ({
                              ...pv,
                              status: d.target.value,
                            }));
                          }}
                          className="mt-1.5 w-full border-1 rounded-lg py-1.5 px-3 border-neutral-200 outline-neutral-400 outline-offset-4"
                        >
                          <option value="open">Open</option>
                          <option value="closed">Closed</option>
                          <option value="in_meeting">In Meeting</option>
                          <option value="break">Break</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="buttons flex justify-end">
                    <button
                      onClick={() => {
                        handleSupplierUpdate();
                      }}
                      className="px-5 bg-emerald-700 font-[700] mt-2 text-white w-max flex gap-2 items-center justify-center py-1.5 rounded-md text-sm"
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
      {!isFetching && (
        <>
          <h1 className="flex gap-2 items-center text-sm font-[500]">
            <Boxes size="15px" strokeWidth="1.2" /> Suppliers
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
                    className="h-[400px] atendee-table mt-5 rounded-lg overflow-hidden border-1 border-neutral-200 overflow-y-scroll"
                  >
                    <div className="relative overflow-x-scroll w-full">
                      <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] bg-white font-[500] geist text-xs">
                        <div className="contents">
                          <div className="p-3 font-[500] bg-neutral-100 whitespace-nowrap">
                            Supplier
                          </div>
                          <div className="p-3 font-[500] bg-neutral-100 whitespace-nowrap">
                            Website
                          </div>
                          <div className="p-3 font-[500] bg-neutral-100 whitespace-nowrap">
                            Location
                          </div>
                          <div className="p-3 font-[500] bg-neutral-100 whitespace-nowrap">
                            Access Code
                          </div>
                          <div className="p-3 font-[500] bg-neutral-100 whitespace-nowrap">
                            Status
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
                              <div className="px-5 py-2  flex justify-center flex-col whitespace-nowrap">
                                <p className="font-[400] flex gap-1 items-center truncate">
                                  <Globe size="12px" className="shrink-0" />
                                  <a href={d.website} target="_blank">
                                    {d.website}
                                  </a>
                                </p>
                              </div>
                              <div className="px-5 py-2 flex items-center whitespace-nowrap">
                                <p className="font-[400] flex gap-1 items-center truncate">
                                  <MapPin size="12px" className="shrink-0" />
                                  {d.location || "Not set."}
                                </p>
                              </div>
                              <div className="px-5 py-2 flex items-center whitespace-nowrap">
                                <p className="font-[400] flex gap-1 items-center truncate">
                                  <Lock size="12px" className="shrink-0" />
                                  {d.accessCode}
                                </p>
                              </div>

                              <div className="px-5 py-2  flex items-center whitespace-nowrap">
                                {(() => {
                                  const statusMap = {
                                    open: "Open",
                                    closed: "Closed",
                                    in_meeting: "In Meeting",
                                    break: "Break",
                                    waiting: "Waiting",
                                  };
                                  const statusColors = {
                                    open: "bg-emerald-100/70 text-emerald-700 border-emerald-300",
                                    closed:
                                      "bg-red-100/70 text-red-700 border-red-300",
                                    in_meeting:
                                      "bg-blue-100/70 text-blue-700 border-blue-300",
                                    break:
                                      "bg-amber-100/70 text-amber-700 border-amber-300",
                                    waiting:
                                      "bg-purple-100/70 text-purple-700 border-purple-300",
                                  };
                                  // Normalize status string
                                  let statKey = (d.status.status || "")
                                    .toLowerCase()
                                    .replace(/ /g, "_");
                                  if (!statusMap[statKey]) statKey = "closed"; // fallback
                                  return (
                                    <span
                                      className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${
                                        statusColors[statKey] ||
                                        "bg-neutral-200 text-neutral-700 border-neutral-700"
                                      }`}
                                    >
                                      {statusMap[statKey] || d.status.status}
                                    </span>
                                  );
                                })()}
                              </div>

                              <div className="bg-white px-5 py-2 text-right flex items-center gap-2 justify-end sticky z-[10] right-0">
                                <button
                                  onClick={() => {
                                    setEditSupplier({
                                      active: true,
                                      id: d.id,
                                      supplierName: {
                                        value: d.name,
                                        err: "",
                                      },
                                      location: {
                                        value: d.location,
                                        err: "",
                                      },
                                      website: {
                                        value: d.website,
                                        err: "",
                                      },
                                      country: d.country,
                                      accessCode: {
                                        value: d.accessCode,
                                        err: "",
                                      },
                                      logo: {
                                        value: d.logoSecUrl,
                                        err: "",
                                      },
                                      status: d.status.status,
                                      description: {
                                        value: d.description || "",
                                        err: "",
                                      },
                                    });
                                  }}
                                  className="p-2 bg-white hover:bg-neutral-50 border-1 border-neutral-200 rounded-md"
                                >
                                  <Pencil size="15px" />
                                </button>
                                <button className="p-2 bg-white hover:bg-neutral-50 border-1 border-neutral-200 rounded-md">
                                  <Eye size="15px" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                  <p className="mt-5 font-[500] text-xs text-neutral-700">
                    Total of {data.length} supplier{data.length > 1 ? "s" : ""}
                  </p>
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
      <CropperModal
        imageUrl={tempImageUrl}
        aspect={1}
        show={showCropper}
        onClose={() => {
          setShowCropper(false);
          setTempImageUrl("");
        }}
        onCrop={(croppedImage) => {
          // Convert base64 to file
          fetch(croppedImage)
            .then((res) => res.blob())
            .then((blob) => {
              const file = new File([blob], "cropped-image.png", {
                type: "image/png",
              });
              setEditSupplier((prev) => ({
                ...prev,
                logo: {
                  ...prev.logo,
                  file,
                },
              }));
            });
          setShowCropper(false);
          setTempImageUrl("");
        }}
      />
    </>
  );
}
