import {AnimatePresence, motion} from "framer-motion";
import {Briefcase, Clock, Mail, MapPin, Phone, Printer, User, X} from "lucide-react";
import moment from "moment/moment";
import {printQR} from "@/components/ViewEv_Deps/printQr";
import type {AttendeeOrdSPCAdmin} from "@/interfaces/Interface";

interface ViewAttendee {
    values: Partial<AttendeeOrdSPCAdmin>,
    setValues: (dx: Partial<AttendeeOrdSPCAdmin>) => void,
    resendEmailCb: (dx: string) => void
}

const attendeeViewDefaults: Partial<AttendeeOrdSPCAdmin> = {
    active: false,
    attended: false,
    name: "",
    orgN: "",
    orgP: "",
    email: "",
    phoneNumber: "",
    addr: "",
    salutations: "",
    registeredOn: 0,
    evId: "",
}

export default function ViewAttendee({values, setValues, resendEmailCb}: ViewAttendee) {

    return (
        <AnimatePresence>
            {values.active && <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                key={1}
                className="registration-form fixed w-full h-full top-0 left-0 bg-neutral-900/70 z-[9999] geist overflow-y-auto py-5 px-5"
            >
                <div className="flex items-center justify-center min-h-screen w-full">
                    <motion.div
                        initial={{opacity: 0, scale: 0.9}}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            transition: {delay: 0.2, duration: 0.2},
                        }}
                        exit={{opacity: 0, scale: 0.9}}
                        key={13}
                        className="form w-full max-w-[400px] bg-white rounded-xl overflow-hidden "
                    >
                        <div className="text-white px-5 py-2 flex justify-between items-center bg-emerald-600 ">
                            <h1 className=" font-[500]">Attendee Information</h1>
                            <div
                                className="p-2 rounded-full w-max cursor-pointer"
                                onClick={() => {
                                    setValues(attendeeViewDefaults)
                                }}
                            >
                                <X size="15px" strokeWidth={5}/>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 px-5 py-5">
                            {values.attended && (
                                <p className="text-[11px] px-4 py-1 bg-emerald-50 border-1 border-emerald-600 text-emerald-600 w-max rounded-full text-xs">
                                    IN EVENT
                                </p>
                            )}
                            {!values.attended && (
                                <p className="text-[11px] px-4 py-1 bg-red-50 border-1 border-red-600 text-red-600 w-max rounded-full text-xs">
                                    NOT IN EVENT
                                </p>
                            )}
                            <h1 className="font-[600] text-xl">{values.name}</h1>
                            <p className="text-sm text-neutral-900 flex gap-2 items-center">
                                <Briefcase size="15px"/>
                                {values.orgN} - {values.orgP}
                            </p>
                            <p className="text-sm text-neutral-900 flex gap-2 items-center">
                                <Mail size="15px"/>
                                {values.email}
                            </p>
                            <p className="text-sm text-neutral-900 flex gap-2 items-center">
                                <Phone size="15px"/>
                                {values.phoneNumber}
                            </p>
                            <p className="text-sm text-neutral-900 flex gap-2 items-center">
                                <MapPin size="15px"/>
                                {values.addr || "N/A"}
                            </p>
                            <p className="text-sm text-neutral-900 flex gap-2 items-center">
                                <User size="15px"/>
                                Salutation: {values.salutations}
                            </p>
                            <p className="text-sm text-neutral-900 flex gap-2 items-center">
                                <Clock size="15px"/>
                                Registered at:{" "}
                                {moment
                                    .unix(values.registeredOn as number)
                                    .format("MMM DD, YYYY - hh:mm:ss A")}
                            </p>
                        </div>
                        <div className="px-5 py-4 flex gap-2">
                            <button
                                onClick={() => resendEmailCb(values.id as string)}
                                className="px-5 text-black border-1 hover:bg-neutral-50 border-neutral-100 w-1/2 flex gap-2 items-center justify-center py-1.5 rounded-md text-sm"
                            >
                                <Mail size="12px" strokeWidth={3} className="shrink-0"/>{" "}
                                Resend E-Mail
                            </button>
                            <button
                                onClick={() =>
                                    printQR({
                                        eventName: values.evId as string,
                                        attendeeName: values.name as string,
                                        organization: values.orgN as string,
                                        position: values.orgP as string,
                                        identifier: values.id as string,
                                    })
                                }
                                className="px-5 bg-emerald-600 text-white w-1/2 flex gap-2 items-center justify-center py-1.5 rounded-md text-sm"
                            >
                                <Printer size="12px" strokeWidth={3} className="shrink-0"/>{" "}
                                Print Passport
                            </button>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
            }

        </AnimatePresence>
    )
}