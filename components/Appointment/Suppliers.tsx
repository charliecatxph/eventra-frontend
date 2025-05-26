import { ArrowRight, Plus, Trash, X, Repeat } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import TextInput from "../Inputs/TextInput";
import SelectCountry from "../CountrySelector/SelectCountry";
import TextAreaInput from "../Inputs/TextAreaInput";
import "cropperjs/dist/cropper.css";
import { useState, useRef } from "react";
import SupplierComponent from "./Suppliers_Deps/SupplierComponent";
import { useModal } from "../Modal/ModalContext";
import CropperModal from "../ViewBizMatchEvent/CropperModal";

interface Supplier {
  logo: string;
  name: string;
  country: string;
  website: string;
  description: string;
  location: string;
}

interface SupplierEditState {
  active: boolean;
  editIndex: number;
  mode: string;
  logo: {
    value: string;
    err: string;
  };
  name: {
    value: string;
    err: string;
  };
  country: {
    value: string;
    err: string;
  };
  website: {
    value: string;
    err: string;
  };
  description: {
    value: string;
    err: string;
  };
  location: {
    value: string;
    err: string;
  };
}

const supplierEditDefaults: SupplierEditState = {
  active: false,
  editIndex: -1,
  mode: "",
  logo: {
    value: "",
    err: "",
  },
  name: {
    value: "",
    err: "",
  },
  country: {
    value: "",
    err: "",
  },
  website: {
    value: "",
    err: "",
  },
  description: {
    value: "",
    err: "",
  },
  location: {
    value: "",
    err: "",
  },
};

export default function Suppliers({
  data,
  onDataChange,
}: {
  data: Supplier[];
  onDataChange: (data: Supplier[]) => void;
}) {
  const modal = useModal();
  const [supplierEdit, setSupplierEdit] =
    useState<SupplierEditState>(supplierEditDefaults);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState("");

  const validateFields = () => {
    let isValid = true;
    const updatedState = { ...supplierEdit };

    // Validate name
    if (!supplierEdit.name.value.trim()) {
      updatedState.name.err = "Name is required";
      isValid = false;
    } else if (supplierEdit.name.value.trim().length < 3) {
      updatedState.name.err = "Name must be at least 3 characters";
      isValid = false;
    } else {
      updatedState.name.err = "";
    }

    // Validate country
    if (!supplierEdit.country.value) {
      updatedState.country.err = "Country is required";
      isValid = false;
    } else {
      updatedState.country.err = "";
    }

    // Validate website
    if (!supplierEdit.website.value.trim()) {
      updatedState.website.err = "Website is required";
      isValid = false;
    } else if (
      !supplierEdit.website.value.match(
        /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/
      )
    ) {
      updatedState.website.err = "Please enter a valid website URL";
      isValid = false;
    } else {
      updatedState.website.err = "";
    }

    // Validate logo
    if (!supplierEdit.logo.value) {
      updatedState.logo.err = "Logo is required";
      isValid = false;
    } else {
      updatedState.logo.err = "";
    }

    setSupplierEdit(updatedState);
    return isValid;
  };

  const handleAddSupplier = () => {
    if (!validateFields()) return;

    const { logo, name, country, website, description } = supplierEdit;

    if (supplierEdit.mode !== "edit") {
      onDataChange([
        ...data,
        {
          logo: logo.value.trim(),
          name: name.value.trim(),
          country: country.value.trim(),
          website: website.value.trim(),
          description: description.value.trim(),
          location: supplierEdit.location.value.trim(),
        },
      ]);
    } else {
      let shwlx = [...data];
      shwlx[supplierEdit.editIndex] = {
        logo: logo.value.trim(),
        name: name.value.trim(),
        country: country.value.trim(),
        website: website.value.trim(),
        description: description.value.trim(),
        location: supplierEdit.location.value.trim(),
      };
      onDataChange(shwlx);
    }

    setSupplierEdit(supplierEditDefaults);
  };

  const handleModifySupplier = (i: number) => {
    const supDatax = data[i];

    setSupplierEdit({
      active: true,
      mode: "edit",
      editIndex: i,
      logo: {
        value: supDatax.logo,
        err: "",
      },
      name: {
        value: supDatax.name,
        err: "",
      },
      country: {
        value: supDatax.country,
        err: "",
      },
      website: {
        value: supDatax.website,
        err: "",
      },
      location: {
        value: supDatax.location,
        err: "",
      },
      description: {
        value: supDatax.description,
        err: "",
      },
    });
  };

  const handleDelete = (i: number) => {
    modal.show({
      type: "std",
      icon: <Trash />,
      title: "Delete Supplier",
      description: "Delete this supplier? This action is irreversible.",
      confirmText: "Delete",
      cancelText: "Go Back",
      onConfirm: () => {
        let shwlx = [...data];
        shwlx.splice(i, 1);
        onDataChange(shwlx);
        modal.hide();
      },
      onCancel: () => {
        modal.hide();
      },
      color: "red",
    });
  };

  return (
    <>
      <section className="eventra-container-narrow pt-5">
        <div className="px-7 py-5 bg-white rounded-xl mt-5 flex gap-2 flex-col">
          <div className="flex items-center justify-between">
            <h1 className="text-sm font-[500]">Suppliers</h1>
            <button
              onClick={() =>
                setSupplierEdit((prev) => ({
                  ...prev,
                  active: true,
                  mode: "new",
                }))
              }
              className="flex items-center gap-2 text-xs bg-neutral-50 px-3 py-1 rounded-md border-1 border-neutral-200 hover:bg-neutral-100 transition-colors"
            >
              <Plus size="15px" /> Add a Supplier
            </button>
          </div>
          <div className="suppliers h-[300px] grid grid-cols-2 gap-2 overflow-y-scroll">
            {data.map((supplier, index) => (
              <SupplierComponent
                key={index}
                logo={supplier.logo}
                name={supplier.name}
                country={supplier.country}
                website={supplier.website}
                description={supplier.description}
                index={index}
                onModify={handleModifySupplier}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      </section>
      <AnimatePresence>
        {supplierEdit.active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
                className="form w-full max-w-[600px] bg-white rounded-xl overflow-hidden"
              >
                <div className="px-5 py-2 flex justify-between items-center bg-emerald-700 text-white">
                  <h1 className="font-[700]">
                    {supplierEdit.mode === "edit"
                      ? "Edit Supplier"
                      : "Add Supplier"}
                  </h1>
                  <div
                    className="p-2 rounded-full w-max cursor-pointer"
                    onClick={() => setSupplierEdit(supplierEditDefaults)}
                  >
                    <X size="15px" strokeWidth={5} />
                  </div>
                </div>
                <div className="p-5 flex flex-col gap-2">
                  <div className="flex gap-2">
                    <TextInput
                      identifier="suplN"
                      title="Supplier Name"
                      value={supplierEdit.name.value}
                      onInput={(d) => {
                        setSupplierEdit((prev) => ({
                          ...prev,
                          name: { value: d, err: "" },
                        }));
                      }}
                      error={supplierEdit.name.err}
                      placeholder=""
                      className="w-1/2"
                      req
                    />
                    <TextInput
                      identifier="location"
                      title="Location"
                      value={supplierEdit.location.value}
                      onInput={(d) => {
                        setSupplierEdit((prev) => ({
                          ...prev,
                          location: { value: d, err: "" },
                        }));
                      }}
                      error={supplierEdit.location.err}
                      placeholder=""
                      className="w-1/2"
                      req
                    />
                  </div>
                  <TextInput
                    identifier="website"
                    title="Website"
                    value={supplierEdit.website.value}
                    onInput={(d) => {
                      setSupplierEdit((prev) => ({
                        ...prev,
                        website: { value: d, err: "" },
                      }));
                    }}
                    error={supplierEdit.website.err}
                    placeholder=""
                    className=""
                    req
                  />

                  <SelectCountry
                    value={supplierEdit.country.value}
                    onInput={(dt) => {
                      setSupplierEdit((prev) => ({
                        ...prev,
                        country: {
                          ...prev.country,
                          value: dt,
                        },
                      }));
                    }}
                    error={supplierEdit.country.err}
                  />

                  <div className="flex flex-col">
                    <label htmlFor="description" className="font-[500] text-sm">
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={supplierEdit.description.value}
                      onChange={(e) => {
                        setSupplierEdit((prev) => ({
                          ...prev,
                          description: { value: e.target.value, err: "" },
                        }));
                      }}
                      className="mt-1.5 w-full border-1 rounded-lg py-1.5 px-3 border-neutral-200 outline-neutral-400 outline-offset-4 min-h-[100px] resize-none"
                      placeholder="Enter supplier description..."
                    />
                    {supplierEdit.description.err && (
                      <p className="text-red-500 text-xs mt-1">
                        {supplierEdit.description.err}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex flex-col">
                      <h1 className="font-[500] mt-1 text-sm">
                        Logo<span className="text-red-600">*</span>
                      </h1>
                      <div className="flex-1 border-1 rounded-lg p-5 mt-1 flex justify-between items-center border-neutral-100">
                        <div className="image size-20 rounded-full bg-white overflow-hidden border-1 border-neutral-200">
                          <img
                            src={supplierEdit.logo.value}
                            alt=""
                            className="h-full w-full object-cover"
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
                      {supplierEdit.logo.err && (
                        <p className="text-red-500 text-xs mt-1">
                          {supplierEdit.logo.err}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="buttons flex justify-end gap-2 mt-6">
                    <button
                      onClick={() => setSupplierEdit(supplierEditDefaults)}
                      className="px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 rounded-md transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddSupplier}
                      className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors flex items-center gap-2"
                    >
                      {supplierEdit.mode === "edit" ? (
                        <>
                          Apply Changes
                          <ArrowRight size={15} />
                        </>
                      ) : (
                        <>
                          Add Supplier
                          <Plus size={15} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cropper Modal */}
      <CropperModal
        imageUrl={tempImageUrl}
        aspect={1}
        show={showCropper}
        onClose={() => {
          setShowCropper(false);
          setTempImageUrl("");
        }}
        onCrop={(croppedImage: string) => {
          setSupplierEdit((prev) => ({
            ...prev,
            logo: {
              value: croppedImage,
              err: "",
            },
          }));
          setShowCropper(false);
          setTempImageUrl("");
        }}
      />
    </>
  );
}
