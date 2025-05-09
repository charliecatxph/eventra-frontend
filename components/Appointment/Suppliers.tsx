import {ArrowRight, Plus, Trash,} from "lucide-react";
import {AnimatePresence, motion} from "framer-motion";
import TextInput from "../Inputs/TextInput";
import SelectCountry from "../CountrySelector/SelectCountry";
import TextAreaInput from "../Inputs/TextAreaInput";
import ImageUploadWithCrop from "../Inputs/ImageUploadWithCrop";
import "cropperjs/dist/cropper.css";
import {useState} from "react";
import SupplierComponent from "./Suppliers_Deps/SupplierComponent";
import {useModal} from "../Modal/ModalContext";

const supplierEditDefaults = {
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
};

export default function Suppliers({data, onDataChange}) {
    const modal = useModal();
    const [supplierEdit, setSupplierEdit] = useState<any>({
        active: false,
        mode: "",
        editIndex: -1,
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
    });

    const handleAddSupplier = () => {
        const {logo, name, country, website, description} = supplierEdit;

        if (
            !logo.value ||
            !name.value ||
            !country.value ||
            !website.value ||
            !description.value
        )
            return;

        if (supplierEdit.mode !== "edit") {
            onDataChange([
                ...data,
                {
                    logo: logo.value.trim(),
                    name: name.value.trim(),
                    country: country.value.trim(),
                    website: website.value.trim(),
                    description: description.value.trim(),
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
            description: {
                value: supDatax.description,
                err: "",
            },
        });
    };

    const handleDelete = (i: number) => {
        modal.show({
            icon: <Trash/>,
            title: "Delete Supplier",
            content: "Delete this supplier? This action is irreversible.",
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
                                setSupplierEdit((pv) => ({
                                    ...pv,
                                    active: true,
                                    mode: "new",
                                }))
                            }
                            className="flex items-center gap-2 text-xs bg-neutral-50 px-3 py-1 rounded-md border-1 border-neutral-200"
                        >
                            <Plus size="15px"/> Add a Supplier
                        </button>
                    </div>
                    <div className="suppliers h-[300px] grid grid-cols-2 gap-2 overflow-y-scroll">
                        {data.map((d, i) => {
                            return (
                                <>
                                    <SupplierComponent
                                        logo={d.logo}
                                        name={d.name}
                                        country={d.country}
                                        website={d.website}
                                        description={d.description}
                                        index={i}
                                        onModify={(i) => {
                                            handleModifySupplier(i);
                                        }}
                                        onDelete={(i) => {
                                            handleDelete(i);
                                        }}
                                    />
                                </>
                            );
                        })}
                    </div>
                </div>
            </section>
            <AnimatePresence>
                {supplierEdit.active && (
                    <motion.div
                        key={1}
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        className="modal-container fixed top-0 left-0 h-full w-full bg-slate-900/80 z-[9999] geist overflow-y-auto"
                    >
                        <div className=" grid place-content-center min-h-screen w-full">
                            {" "}
                            <motion.div
                                initial={{scale: 0.9, opacity: 0}}
                                animate={{
                                    scale: 1,
                                    opacity: 1,
                                    transition: {duration: 0.3, delay: 0.1},
                                }}
                                exit={{scale: 0.9, opacity: 0}}
                                key={2}
                                className="bg-white w-[900px] rounded-lg p-5 "
                            >
                                <h1 className="text-lg font-[600]">
                                    {supplierEdit.mode === "edit"
                                        ? "Edit Supplier"
                                        : "Add a Supplier"}
                                </h1>
                                <p className="text-sm text-neutral-900">
                                    {supplierEdit.mode === "edit"
                                        ? "Edit the supplier information here."
                                        : "Enter the supplier information here."}
                                </p>
                                <div className="inputs mt-5 flex flex-col gap-2">
                                    <div className="flex items-start gap-2">
                                        <div className="w-1/3">
                                            <ImageUploadWithCrop
                                                currentImage={supplierEdit.logo.value}
                                                onChange={(dx) =>
                                                    setSupplierEdit((pv) => ({
                                                        ...pv,
                                                        logo: {
                                                            value: dx,
                                                            err: "",
                                                        },
                                                    }))
                                                }
                                                error={supplierEdit.logo.err}
                                            />
                                        </div>
                                        <div className="w-2/3 flex flex-col gap-2">
                                            <TextInput
                                                identifier="sup-name"
                                                title="Supplier Name"
                                                value={supplierEdit.name.value}
                                                placeholder="My Supplier 1"
                                                onInput={(d) => {
                                                    setSupplierEdit((pv) => ({
                                                        ...pv,
                                                        name: {
                                                            value: d,
                                                            err: "",
                                                        },
                                                    }));
                                                }}
                                                error={supplierEdit.name.err}
                                                className=""
                                                req
                                            />
                                            <SelectCountry
                                                onInput={(d) => {
                                                    setSupplierEdit((pv) => ({
                                                        ...pv,
                                                        country: {
                                                            value: d,
                                                            err: "",
                                                        },
                                                    }));
                                                }}
                                                value={supplierEdit.country.value}
                                                error={supplierEdit.country.err}
                                            />

                                            <TextInput
                                                identifier="sup-web"
                                                title="Supplier Website"
                                                value={supplierEdit.website.value}
                                                placeholder="www.eventratechnologies.com"
                                                onInput={(d) => {
                                                    setSupplierEdit((pv) => ({
                                                        ...pv,
                                                        website: {
                                                            value: d,
                                                            err: "",
                                                        },
                                                    }));
                                                }}
                                                error={supplierEdit.website.err}
                                                className=""
                                                req
                                            />
                                        </div>
                                    </div>

                                    <TextAreaInput
                                        identifier="sup-desc"
                                        title="Supplier Description"
                                        value={supplierEdit.description.value}
                                        placeholder=""
                                        onInput={(d) => {
                                            setSupplierEdit((pv) => ({
                                                ...pv,
                                                description: {
                                                    value: d,
                                                    err: "",
                                                },
                                            }));
                                        }}
                                        error={supplierEdit.description.err}
                                        className=""
                                    />
                                    <div className="flex justify-end pt-5 eventra-container-narrow w-full gap-2">
                                        <button
                                            onClick={() => {
                                                setSupplierEdit(supplierEditDefaults);
                                            }}
                                            className="flex gap-2 items-center text-sm bg-neutral-50 hover:bg-neutral-100 border-1 border-neutral-200 text-neutral-500  px-8 py-1 rounded-md w-max"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleAddSupplier();
                                            }}
                                            className="flex gap-2 items-center text-sm bg-black hover:bg-neutral-900 text-white px-5 py-1 rounded-md w-max"
                                        >
                                            {supplierEdit.mode === "edit" ? (
                                                <ArrowRight size="15px"/>
                                            ) : (
                                                <Plus size="15px"/>
                                            )}
                                            {supplierEdit.mode === "edit"
                                                ? "Apply Changes"
                                                : "Add Supplier"}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
