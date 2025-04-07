import {
  ChevronLeft,
  Box,
  Plus,
  Boxes,
  TriangleAlert,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";
import TextInput from "@/components/Inputs/TextInput";
import { useEffect, useState } from "react";
import TextAreaInput from "@/components/Inputs/TextAreaInput";
import ImageUploadWithCrop from "@/components/Inputs/ImageUploadWithCrop";
import SelectCountry from "@/components/CountrySelector/SelectCountry";
import { useModal } from "@/components/Modal/ModalContext";

// interface for output
interface Supplier {
  name: string;
  country: string;
  logo: string;
  website: string;
  description: string;
}

const supplierEdit_defaults = {
  name: {
    value: "",
    err: "",
  },
  country: {
    value: "",
    err: "",
  },
  logo: {
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
};

interface SupplierEdit {
  name: {
    value: string;
    err: string;
  };
  country: {
    value: string;
    err: string;
  };
  logo: {
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
}

interface AddSupplierPopup {
  active: boolean;
  onSubmit: (dt: Supplier) => void;
  onExit: () => void;
  defaultValues: Supplier;
}

export default function AddSupplier({
  active,
  onSubmit,
  onExit,
  defaultValues,
}: AddSupplierPopup) {
  const modal = useModal();
  const [supplierInf, setSupplierInf] = useState<SupplierEdit>(
    supplierEdit_defaults
  );

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const isDataInvalid = (): boolean => {
    let err = false;
    if (!supplierInf.name.value) {
      setSupplierInf((pv) => ({
        ...pv,
        name: {
          ...pv.name,
          err: "Enter a name.",
        },
      }));
      err = true;
    }

    if (!supplierInf.country.value) {
      setSupplierInf((pv) => ({
        ...pv,
        country: {
          ...pv.country,
          err: "Enter a country.",
        },
      }));
      err = true;
    }

    if (!supplierInf.logo.value) {
      setSupplierInf((pv) => ({
        ...pv,
        logo: {
          ...pv.logo,
          err: "Upload a logo.",
        },
      }));
      err = true;
    }

    if (
      !supplierInf.website.value.match(
        /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/
      )
    ) {
      setSupplierInf((pv) => ({
        ...pv,
        website: {
          ...pv.website,
          err: "Invalid link.",
        },
      }));
      err = true;
    }

    if (!supplierInf.description.value) {
      setSupplierInf((pv) => ({
        ...pv,
        description: {
          ...pv.description,
          err: "Enter a description for this supplier..",
        },
      }));
      err = true;
    }

    return err;
  };

  const hasChanges = (): boolean => {
    return Object.keys(supplierInf).some((key) => {
      return (
        supplierInf[key as keyof SupplierEdit].value !==
        supplierEdit_defaults[key as keyof SupplierEdit].value
      );
    });
  };

  const hasChangesEdit = (): boolean => {
    const { name, country, description, logo, website } = supplierInf;

    if (
      defaultValues.name !== name.value ||
      defaultValues.country !== country.value ||
      defaultValues.description !== description.value ||
      defaultValues.logo !== logo.value ||
      defaultValues.website !== website.value
    ) {
      return true;
    }

    return false;
  };

  const handleExit = () => {
    if (isEditing) {
      if (hasChangesEdit()) {
        modal.show({
          icon: <TriangleAlert />,
          title: "Cancel Supplier",
          content: "Data will not be saved if you exit.",
          confirmText: "Exit",
          cancelText: "Go Back",
          onConfirm: () => {
            onExit();
            setSupplierInf(supplierEdit_defaults);
            modal.hide();
          },
          onCancel: () => {
            modal.hide();
          },
          color: "red",
        });
      } else {
        onExit();
        setSupplierInf(supplierEdit_defaults);
      }
    } else {
      if (hasChanges()) {
        modal.show({
          icon: <TriangleAlert />,
          title: "Cancel Supplier",
          content: "Data will not be saved if you exit.",
          confirmText: "Exit",
          cancelText: "Go Back",
          onConfirm: () => {
            onExit();
            setSupplierInf(supplierEdit_defaults);
            modal.hide();
          },
          onCancel: () => {
            modal.hide();
          },
          color: "red",
        });
      } else {
        onExit();
        setSupplierInf(supplierEdit_defaults);
      }
    }
  };

  const handleSubmit = () => {
    if (isDataInvalid()) return;

    onSubmit({
      name: supplierInf.name.value,
      logo: supplierInf.logo.value,
      description: supplierInf.description.value,
      website: supplierInf.website.value,
      country: supplierInf.country.value,
    });

    onExit();
    setSupplierInf(supplierEdit_defaults);
  };

  useEffect(() => {
    if (
      defaultValues.name &&
      defaultValues.logo &&
      defaultValues.description &&
      defaultValues.country
    ) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }

    setSupplierInf({
      name: {
        value: defaultValues.name,
        err: "",
      },
      country: {
        value: defaultValues.country,
        err: "",
      },
      description: {
        value: defaultValues.description,
        err: "",
      },
      website: {
        value: defaultValues.website,
        err: "",
      },
      logo: {
        value: defaultValues.logo,
        err: "",
      },
    });
  }, [defaultValues]);

  if (!active) return <></>;

  return (
    <div className="add-supplier-scr fixed top-0 left-0 bg-white w-full h-full z-[999] geist overflow-y-scroll">
      <header className="px-5 py-5 sticky top-0 bg-white">
        <ChevronLeft onClick={() => handleExit()} />
      </header>
      <section className="px-5 mb-20">
        <div className="mt-5 step-icon p-5 rounded-2xl mx-auto bg-emerald-800 text-emerald-100 w-max">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, transition: { delay: 0.05 } }}
          >
            {isEditing ? <Settings /> : <Boxes />}
          </motion.div>
        </div>
        <h1 className="mt-5 text-center text-2xl font-[600]">
          {isEditing ? "Edit" : "Add"} Supplier
        </h1>
        <p className="text-xs text-center mt-2">
          {isEditing
            ? "Edit the supplier's information here."
            : "Enter the supplier information here."}
        </p>
        <div className="inputs mt-3 flex gap-1 flex-col">
          <TextInput
            identifier="name"
            title="Name"
            value={supplierInf.name.value}
            placeholder="CTX Technologies"
            onInput={(v) => {
              setSupplierInf((pv) => ({
                ...pv,
                name: {
                  value: v,
                  err: "",
                },
              }));
            }}
            error={supplierInf.name.err}
          />
          <TextInput
            identifier="website"
            title="Website"
            value={supplierInf.website.value}
            placeholder="www.ctxph.com"
            onInput={(v) => {
              setSupplierInf((pv) => ({
                ...pv,
                website: {
                  value: v,
                  err: "",
                },
              }));
            }}
            error={supplierInf.website.err}
          />
          <SelectCountry
            value={supplierInf.country.value}
            onInput={(dt) => {
              setSupplierInf((pv) => ({
                ...pv,
                country: {
                  ...pv.country,
                  value: dt,
                },
              }));
            }}
            error={supplierInf.country.err}
          />
          <TextAreaInput
            identifier="description"
            title="Description"
            value={supplierInf.description.value}
            onInput={(v) => {
              setSupplierInf((pv) => ({
                ...pv,
                description: {
                  value: v,
                  err: "",
                },
              }));
            }}
            error={supplierInf.description.err}
          />
          <ImageUploadWithCrop
            currentImage={supplierInf.logo.value}
            onChange={(dt) => {
              setSupplierInf((pv) => ({
                ...pv,
                logo: {
                  value: dt,
                  err: "",
                },
              }));
            }}
            error={supplierInf.logo.err}
          />
        </div>
      </section>
      <div className="proceed-btn px-5 fixed bottom-0 left-0 w-full geist bg-white">
        <button
          onClick={() => {
            handleSubmit();
          }}
          className="bg-emerald-800 text-emerald-100 rounded-lg w-full py-2 text-sm mb-3"
        >
          {isEditing ? "Apply Changes" : "Add Supplier"}
        </button>
      </div>
    </div>
  );
}
