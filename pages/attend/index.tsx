import {AlertTriangle, ArrowUpRight, Calendar, Check, Clock, Download, X,} from "lucide-react";
import {useEffect, useRef, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import axios from "axios";
import moment from "moment";
import {CircularProgress} from "@mui/material";
import TextInput from "@/components/Inputs/TextInput";
import {useModal} from "@/components/Modal/ModalContext";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import Head from "next/head";
import "intl-tel-input/styles";

import IntlTelInput from "intl-tel-input/react";

interface EVs {
    name: string;
    location: string;
    startT: number;
    organizedBy: string;
    endT: number;
    date: number;
    offsetT: number;
    allowWalkIn: boolean;
    atendeeLim: number;
    organizationId: string;
    coverFile: string;
    registrationEnded: boolean;
    description: string;
    evId: string;
    atendeeCount: number;
}

interface EVs2 {
    active: boolean;
    name: string;
    location: string;
    startT: number;
    endT: number;
    date: number;
    offsetT: number;
    organizedBy: string;
    allowWalkIn: boolean;
    atendeeLim: number;
    organizationId: string;
    coverFile: string;
    registrationEnded: boolean;
    description: string;
    evId: string;
    atendeeCount: number;
}

const currentEventRegDefaults = {
    active: false,
    name: "",
    location: "",
    startT: 0,
    endT: 0,
    date: 0,
    offsetT: 0,
    allowWalkIn: false,
    atendeeLim: 0,
    organizationId: "",
    coverFile: "",
    registrationEnded: false,
    description: "",
    organizedBy: "",
    evId: "",
    atendeeCount: 0,
};

const regFormDefaults = {
    name: {
        value: "",
        err: "",
    },
    email: {
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
    salutations: {
        value: "",
        err: "",
    },
    addr: {
        value: "",
        err: "",
    },
    country: {
        value: "none",
        err: "",
    },
    attendBizMatch: {
        value: "none",
        err: "",
    },
};

interface RegForm {
    name: {
        value: string;
        err: string;
    };
    email: {
        value: string;
        err: string;
    };
    orgN: {
        value: string;
        err: string;
    };
    orgP: {
        value: string;
        err: string;
    };
    salutations: {
        value: string;
        err: string;
    };
    addr: {
        value: string;
        err: string;
    };
    country: {
        value: string;
        err: string;
    };
    attendBizMatch: {
        value: string;
        err: string;
    };
}

const errorMap = [
    "Invalid number",
    "Invalid country code",
    "Too short",
    "Too long",
    "Invalid number",
];

export default function AttendEv() {
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [number, setNumber] = useState<string | null>(null);
    const [errorCode, setErrorCode] = useState<number | null>(null);
    const [notice, setNotice] = useState<string | null>(null);

    const intlTelInputRef = useRef<any>(null);

    const [render, setRender] = useState<boolean>(false);
    const [hCaptchaToken, setHCaptchaToken] = useState(null);
    const captchaRef = useRef<HCaptcha>(null);
    const [isRegistering, setIsRegistering] = useState<boolean>(false);

    const [currentEventReg, setCurrentEventReg] = useState<EVs2>({
        active: false,
        name: "",
        location: "",
        startT: 0,
        endT: 0,
        date: 0,
        offsetT: 0,
        allowWalkIn: false,
        atendeeLim: 0,
        organizationId: "",
        coverFile: "",
        registrationEnded: false,
        description: "",
        organizedBy: "",
        evId: "",
        atendeeCount: 0,
    });

    const [registrationForm, setRegistrationForm] = useState<RegForm>({
        name: {
            value: "",
            err: "",
        },
        email: {
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
        salutations: {
            value: "",
            err: "",
        },
        addr: {
            value: "",
            err: "",
        },
        country: {
            value: "none",
            err: "",
        },
        attendBizMatch: {
            value: "none",
            err: "",
        },
    });

    const modal = useModal();

    const fetchEvent = async () => {
        try {
            const xtc = await axios.post(
                `${process.env.NEXT_PUBLIC_API}/fetch-ord-event`,
                {evId: process.env.NEXT_PUBLIC_EV},
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const xtcdat = xtc.data.data;
            setCurrentEventReg({
                active: false,
                name: xtcdat.name,
                location: xtcdat.location,
                startT: xtcdat.startT,
                endT: xtcdat.endT,
                date: xtcdat.date,
                offsetT: xtcdat.offset,
                organizedBy: xtcdat.organizedBy,
                allowWalkIn: xtcdat.allowWalkIn,
                atendeeLim: xtcdat.atendeeLim,
                organizationId: xtcdat.organizationId,
                coverFile: xtcdat.coverFile,
                registrationEnded: xtcdat.registrationEnded,
                description: xtcdat.description,
                evId: xtcdat.evId,
                atendeeCount: xtcdat.atendeeCount,
            });
            setRender(true);
        } catch (e: any) {
            setRender(false);
        }
    };

    useEffect(() => {
        fetchEvent();
    }, []);

    useEffect(() => {
        setNotice("");
    }, [number]);

    const clearIntlTelInput = () => {
        const instance = intlTelInputRef.current?.getInstance();
        if (!instance) {
            console.warn("IntlTelInput not mounted yet");
            return;
        }
        instance.setNumber("");
    };

    const handleSubmitForm = async () => {
        let err = false;
        if (
            !registrationForm.email.value.match(
                /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
            )
        ) {
            setRegistrationForm((pv) => ({
                ...pv,
                email: {
                    ...pv.email,
                    err: "Invalid E-mail.",
                },
            }));
            err = true;
        }

        Object.keys(registrationForm).forEach((key) => {
            if (key === "email" || key === "addr") return;

            if (!registrationForm[key as keyof RegForm].value) {
                setRegistrationForm((pv) => ({
                    ...pv,
                    [key as keyof RegForm]: {
                        ...pv[key as keyof RegForm],
                        err: "This field is required.",
                    },
                }));
                err = true;
            }
        });

        if (registrationForm.country.value === "none") {
            setRegistrationForm((pv) => ({
                ...pv,
                country: {...pv.country, err: "Please select a country."},
            }));
            err = true;
        }

        if (registrationForm.attendBizMatch.value === "none") {
            setRegistrationForm((pv) => ({
                ...pv,
                attendBizMatch: {
                    ...pv.attendBizMatch,
                    err: "Please select an entry.",
                },
            }));
            err = true;
        }

        if (!isValid) {
            const errorMessage = errorMap[errorCode || 0] || "Invalid number";
            setNotice(`Error: ${errorMessage}`);
            err = true;
        }

        if (!hCaptchaToken) return;

        if (err) return;
        setIsRegistering(true);

        const form = new FormData();
        form.append(
            "data",
            JSON.stringify({
                name: registrationForm.name.value.trim(),
                email: registrationForm.email.value.trim(),
                orgN: registrationForm.orgN.value.trim(),
                orgP: registrationForm.orgP.value.trim(),
                phoneNumber: number?.trim(),
                salutations: registrationForm.salutations.value.trim(),
                addr: registrationForm.addr.value.trim(),
                evId: process.env.NEXT_PUBLIC_EV,
                attendBizMatch: registrationForm.attendBizMatch.value,
                country: registrationForm.country.value,
                token: hCaptchaToken,
            })
        );
        try {
            const rqx = await axios.post(
                `${process.env.NEXT_PUBLIC_API}/attend-ord-ev`,
                form,
                {
                    headers: {"Content-Type": "application/json"},
                }
            );
            setIsRegistering(false);
            modal.show({
                type: "std",
                title: "Registered",
                description: rqx.data.msg,
                onConfirm: () => {
                    setRegistrationForm(regFormDefaults);

                    clearIntlTelInput();
                    captchaRef.current?.resetCaptcha();
                    modal.hide();
                },
                onCancel: () => {
                    setCurrentEventReg(currentEventRegDefaults);
                    setRegistrationForm(regFormDefaults);
                    clearIntlTelInput();
                    modal.hide();
                },
                confirmText: "Register Another Atendee",
                cancelText: "Exit",
                icon: <Check/>,
                color: "success",
            });
        } catch (e: any) {
            if (e.message === "Network Error") {
                modal.show({
                    type: "std",
                    title: "Network Error",
                    description: "Please check if you are connected to the internet.",
                    onConfirm: () => {
                        modal.hide();
                    },
                    onCancel: () => {
                        setCurrentEventReg(currentEventRegDefaults);
                        setRegistrationForm(regFormDefaults);
                        modal.hide();
                    },
                    confirmText: "Try Again",
                    cancelText: "Exit",
                    icon: <X/>,
                    color: "success",
                });
            } else {
                modal.show({
                    type: "std",
                    title: "Error",
                    description: e.response?.data?.err,
                    onConfirm: () => {
                        modal.hide();
                    },
                    onCancel: () => {
                        setCurrentEventReg(currentEventRegDefaults);
                        setRegistrationForm(regFormDefaults);
                        modal.hide();
                    },
                    confirmText: "Try Again",
                    cancelText: "Exit",
                    icon: <X/>,
                    color: "error",
                });
            }

            setIsRegistering(false);
        }
    };

    const handleExitForm = () => {
        if (!isRegistering) {
            setCurrentEventReg((pv) => ({
                ...pv,
                active: false,
            }));
            setRegistrationForm(regFormDefaults);
        }
    };

    const onLoad = () => {
        captchaRef.current?.execute();
    };

    if (!render)
        return (
            <>
                <div className="load h-screen w-screen grid place-items-center">
                    <CircularProgress disableShrink/>
                </div>
            </>
        );

    return (
        <>
            <Head>
                <title>
                    MPOF2025 | Malaysian Palm Oil Forum Philippines 2025 (Dusit Thani,
                    Manila)
                </title>
                <link rel="icon" href="/assets/petalsfav/favicon.ico"/>
            </Head>
            <main className="min-h-screen w-full bg-[#FEF2E3] pb-[50px]">
                <header className="bg-[#FEF2E3] py-8 inter select-none sticky top-0 w-full z-[999]">
                    <div className="eventra-reg-container">
                        <div className="flex justify-between items-center">
                            <div className="flex gap-[40px] items-center">
                                <div className="icon shrink-0 w-[65px] h-[55px]">
                                    <img
                                        src="/assets/mpoclogo.png"
                                        alt=""
                                        className="w-full h-full"
                                    />
                                </div>
                                <div className="hidden lg:block">
                                    <p className="font-[700] text-emerald-600 text-[27px]">
                                        Malaysian Palm Oil Council
                                    </p>
                                </div>
                            </div>

                            <ul className=" items-center gap-[50px] text-sm font-[500] hidden md:flex">
                                <li className="cursor-pointer px-2 py-1 text-neutral-800 hover:text-neutral-900">
                                    <a href="#sponsors">Sponsors</a>
                                </li>
                                <li className="cursor-pointer px-2 py-1 text-neutral-800 hover:text-neutral-900">
                                    <a href="#description">Description</a>
                                </li>
                                <li className="cursor-pointer px-2 py-1 text-neutral-800 hover:text-neutral-900">
                                    <a href="#program">Event Programme</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </header>
                <section className="overflow-hidden">
                    <div className="eventra-reg-container geist">
                        <div className="wrapper relative evs-hero ">
                            <div
                                className="floating flex flex-col gap-[20px] relative pt-[30px] z-[2] md:flex-row md:pt-[100px] lg:pt-[150px]">
                                <div className="h-full flex items-start self-stretch shrink-0">
                                    <img
                                        src="/assets/petals.png"
                                        alt=""
                                        className="w-[50px] h-[50px]"
                                    />
                                </div>
                                <div>
                                    <h1 className="text-[22px] font-[700] text-[#F26522] md:text-[27px] lg:text-3xl xl:text-4xl">
                                        Malaysian Palm Oil Forum
                                    </h1>
                                    <h2 className="text-[20px] font-[600] text-[#2F3293] md:text-[24px] lg:text-2xl xl:text-3xl">
                                        Philippines 2025
                                    </h2>
                                    <p className="text-[16px]">June 3-4, Dusit Thani, Manila</p>

                                    <div className="text-xs font-[500] mt-5 text-neutral-700 md:text-sm lg:text-xl">
                                        <p>Lauric Oils:</p>
                                        <p className="text-base md:text-2xl text-black">
                                            Advancements,
                                        </p>
                                        <p className="text-base md:text-2xl text-black">
                                            Market Dynamics,
                                        </p>
                                        <p className="text-base md:text-2xl text-black">
                                            and Applications
                                        </p>
                                    </div>

                                    <button
                                        onClick={() =>
                                            setCurrentEventReg((pv) => ({
                                                ...pv,
                                                active: true,
                                            }))
                                        }
                                        className="text-base lg:text-lg bg-[#F26522] hover:bg-orange-500 rounded-full px-5 py-1.5 mt-5 text-white font-[600] flex gap-2 items-center"
                                    >
                                        <ArrowUpRight size="18px" strokeWidth={3}/>
                                        Register MPOF 2025
                                    </button>
                                    <a
                                        href="https://mpof2025.vinceoleo.com/assets/MPOF25-Philippines_USD.pdf"
                                        download
                                    >
                                        <button
                                            className="text-xs  lg:text-sm bg-neutral-50 border-1 border-neutral-500 hover:bg-neutral-100 text-neutral-900 rounded-full px-5 py-1.5 mt-3  font-[600] flex gap-2 items-center">
                                            <Download size="15px" strokeWidth={3}/>
                                            Download Program Brochure
                                        </button>
                                    </a>
                                </div>
                            </div>
                            <div
                                className="relative mt-[50px] w-[200px] z-[5] lg:mt-[100px] lg:w-[250px] xl:mt-[130px] xl:w-[300px]">
                                <img src="/assets/support.png" alt=""/>
                            </div>
                            {" "}
                            <div className="relative mt-5 w-[200px] z-[5] lg:w-[250px] xl:w-[300px]">
                                <h1 className="font-[500] text-xs lg:text-[13px] xl:text-sm inter">
                                    Official Event Organizer
                                </h1>
                                <a href="https://vinceoleo.com">
                                    <img
                                        src="/assets/vinceoleo.svg"
                                        alt=""
                                        className="h-[40px] lg:h-[42px] xl:h-[50px]"
                                    />
                                </a>
                            </div>
                            <div
                                className="absolute bottom-[400px] z-[1] right-[-200px] opacity-50  max-w-[1100px] md:bottom-0 md:opacity-100 md:right-[-500px] lg:right-[-200px] lg:bottom-[50px]">
                                <img src="/assets/hero-img.png" alt="" className="w-full"/>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="inter mt-20" id="sponsors">
                    <div className="eventra-reg-container">
                        <h1 className="text-center text-xl font-[700] text-orange-500 md:text-2xl">
                            Titanium Sponsors
                        </h1>
                        <div className="flex items-center justify-center gap-5 mt-10">
                            <div className="titanium aspect-video w-full grid place-content-center max-w-[200px]">
                                <img src="assets/wilmar.png" alt=""/>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="inter mt-20">
                    <div className="eventra-reg-container">
                        <h1 className="text-center text-xl font-[700] text-orange-500 md:text-2xl">
                            Platinum Sponsors
                        </h1>
                        <div className="flex items-center justify-center gap-5 mt-10">
                            <div className="platinum aspect-video w-full grid place-content-center max-w-[200px]">
                                <img src="assets/klk.png" alt=""/>
                            </div>
                            <div className="platinum aspect-video w-full grid place-content-center max-w-[200px]">
                                <img src="assets/palmtop.png" alt=""/>
                            </div>
                            <div className="platinum aspect-video w-full grid place-content-center max-w-[200px]">
                                <img src="assets/bursamy.png" alt=""/>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="inter mt-20">
                    <div className="eventra-reg-container">
                        <h1 className="text-center text-xl font-[700] text-orange-500 md:text-2xl">
                            Gold Sponsors
                        </h1>
                        <div className="flex items-center justify-center gap-5 mt-10">
                            <div className="platinum aspect-video w-full grid place-content-center max-w-[200px]">
                                <img src="assets/sgx.png" alt=""/>
                            </div>
                            <div className="platinum aspect-video w-full grid place-content-center max-w-[200px]">
                                <img src="assets/fgv.png" alt=""/>
                            </div>
                        </div>

                    </div>
                </section>
                <section className="inter mt-20">
                    <div className="eventra-reg-container">
                        <h1 className="text-center text-xl font-[700] text-orange-500 md:text-2xl">
                            Partners
                        </h1>
                        <div className="flex items-center justify-center gap-5 mt-10">
                            <div className="partners aspect-video w-full grid place-content-center max-w-[200px]">
                                <img src="assets/tristar.png" alt=""/>
                            </div>
                            <div className="partners aspect-video w-full grid place-content-center max-w-[200px]">
                                <img src="assets/iffco.png" alt=""/>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="inter mt-20" id="description">
                    <div className="eventra-reg-container">
                        <h1 className="text-center text-xl font-[700] text-orange-500 md:text-2xl">
                            Description
                        </h1>
                        <div
                            className="flex flex-col text-sm items-center gap-5 max-w-[1200px] mx-auto font-[400] mt-5 md:text-base">
                            <p className="text-center">
                                We invite you to the Malaysian Palm Oil Forum (MPOF) Philippines
                                2025, hosted by the Malaysian Palm Oil Council (MPOC) in Manila
                                on 3 - 4 June 2025. As a key platform for industry engagement,
                                MPOF brings together Malaysian palm oil producers, global
                                buyers, and end users to explore trade opportunities and market
                                expansion.
                            </p>
                            <p className="text-center">
                                This year's forum will spotlight lauric oils, aligning with the
                                Philippines' role as the world's largest coconut oil producer
                                and Malaysia's position as a key supplier of palm kernel oil.
                                Discussions will delve into the future of lauric oils, their
                                applications in oleochemicals, and the overall oils and fats
                                market outlook for 2025.
                            </p>
                            <p className="text-center">
                                The Philippines' growing demand for palm oil and its strategic
                                position in ASEAN make it an ideal venue for MPOF. With a strong
                                food and non-food manufacturing sector and a population of over
                                110 million, the country remains a significant market for oils
                                and fats, presenting exciting trade opportunities.
                            </p>
                            <p className="text-center">
                                MPOF Philippines 2025 offers a platform for direct engagement
                                between buyers and Malaysian palm oil suppliers, fostering
                                valuable business connections and strengthening industry
                                collaboration. Join us in Manila to explore new possibilities in
                                the evolving global oils and fats landscape.
                            </p>
                        </div>
                    </div>
                </section>
                <section className="programme inter mt-[100px]" id="program">
                    <div className="eventra-reg-container">
                        <h1 className="text-center text-xl font-[700] text-orange-500 md:text-2xl">
                            Event Programme
                        </h1>
                        <div
                            className="scheds mt-5 grid grid-cols-1 gap-[10px] text-xs md:text-sm lg:text-base lg:grid-cols-2">
                            <div className="w-full">
                                <h1 className="font-[500] text-lg my-2">03 June 2025</h1>
                                <div className="border border-indigo-900">
                                    <div className="flex bg-indigo-100 border-b border-indigo-900">
                                        <div className="w-1/4 p-4 font-bold border-r border-orange-400">
                                            Time
                                        </div>
                                        <div className="w-3/4 p-4 font-bold">Programme</div>
                                    </div>

                                    <div className="flex bg-white">
                                        <div
                                            className="w-1/4 p-4 border-r border-orange-400 text-indigo-800 font-semibold">
                                            0830 – 0920 hrs
                                        </div>
                                        <div className="w-3/4 p-4 text-indigo-800 font-semibold">
                                            Registration
                                        </div>
                                    </div>

                                    <div className="flex bg-gray-100">
                                        <div
                                            className="w-1/4 p-4 border-r border-orange-400 text-indigo-800 font-semibold">
                                            0925 hrs
                                        </div>
                                        <div className="w-3/4 p-4">
                                            <div className="text-indigo-800 font-semibold">
                                                Arrival of the Honourable Datuk Seri Johari bin Abdul Ghani
                                            </div>
                                            <div className="text-sm">
                                                Minister of Plantation and Commodities, Malaysia
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex bg-white">
                                        <div
                                            className="w-1/4 p-4 border-r border-orange-400 text-indigo-800 font-semibold">
                                            0930 – 0945 hrs
                                        </div>
                                        <div className="w-3/4 p-4">
                                            <div className="text-indigo-800 font-semibold">
                                                Welcome Remarks by Ms. Belvinder Sron
                                            </div>
                                            <div className="text-sm">
                                                CEO of Malaysian Palm Oil Council
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex bg-gray-100">
                                        <div
                                            className="w-1/4 p-4 border-r border-orange-400 text-indigo-800 font-semibold">
                                            0945 – 1015 hrs
                                        </div>
                                        <div className="w-3/4 p-4">
                                            <div className="text-indigo-800 font-semibold">
                                                Keynote Address by the Honourable Datuk Seri Johari bin Abdul Ghani
                                            </div>
                                            <div className="text-sm">
                                                Minister of Plantation and Commodities, Malaysia
                                            </div>
                                            <div className="mt-4 text-sm">
                                                Opening Ceremony of MPOF Philippines 2025
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex bg-white">
                                        <div
                                            className="w-1/4 p-4 border-r border-orange-400 text-indigo-800 font-semibold">
                                            1015 – 1045 hrs
                                        </div>
                                        <div className="w-3/4 p-4">
                                            <div className="text-indigo-800 font-semibold">
                                                Plenary Paper: Lauric Oils: Evolving Supply & Demand and Future
                                                Market Dynamics
                                            </div>
                                            <div className="text-sm">
                                                Dr. Julian McGill, Glenauk Economics
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex bg-gray-100">
                                        <div
                                            className="w-1/4 p-4 border-r border-orange-400 text-indigo-800 font-semibold">
                                            1045 – 1115 hrs
                                        </div>
                                        <div className="w-3/4 p-4 text-indigo-800 font-semibold">
                                            Morning Refreshments
                                        </div>
                                    </div>
                                    <div className="flex bg-orange-100 border-b border-indigo-900">
                                        <div className="p-4 font-bold  w-full border-y-1 border-orange-400">
                                            <h1 className="w-full text-center">
                                                {" "}
                                                Session I: Lauric Oils & Oleochemicals: Market Growth &
                                                Innovations
                                            </h1>
                                        </div>
                                    </div>
                                    <div className="flex bg-gray-100">
                                        <div
                                            className="w-1/4 p-4 border-r border-orange-400 text-indigo-800 font-semibold">
                                            1115 – 1200 hrs
                                        </div>
                                        <div className="w-3/4 p-4">
                                            <div className="text-indigo-800 font-semibold">
                                                Panel Discussion – Unlocking ASEAN’s Potential:
                                                Growth & Market Expansion in Lauric Oils & Downstream Sectors
                                            </div>

                                            <div className="text-sm">
                                                Moderator: Datuk Saw Lee Chyan, Chairman, Malaysian Oleochemical Manufacturers
                                                Group
                                            </div>
                                            <div className="text-sm">
                                                Panelist 1: Engr. Marco C. Reyes, Chairman, United Coconut Associations of the
                                                Philippines Inc.
                                            </div>
                                            <div className="text-sm">
                                                Panelist 2: Mr. Dean Lao Jr, President/CEO, Chemrez Technologies Inc.
                                            </div>
                                            <div className="text-sm">
                                                Panelist 3: Mr. Paul Bloemendal, CEO, PRETB Pte Ltd
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex bg-gray-100">
                                        <div
                                            className="w-1/4 p-4 border-r border-orange-400 text-indigo-800 font-semibold">
                                            1200 – 1230 hrs
                                        </div>
                                        <div className="w-3/4 p-4">
                                            <div className="text-indigo-800 font-semibold">
                                                Paper 1: Potential of Lauric Oils in Specialty Fats
                                            </div>
                                            <div className="text-sm">
                                                Datuk Dr. Robert Basker, Global Specialty Ingredients (M) Sdn Bhd
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex bg-gray-100">
                                        <div
                                            className="w-1/4 p-4 border-r border-orange-400 text-indigo-800 font-semibold">
                                            1230 – 1300 hrs
                                        </div>
                                        <div className="w-3/4 p-4">
                                            <div className="text-indigo-800 font-semibold">
                                                Paper 2: MCT Oil: The Future of Functional Nutrition and Wellness
                                            </div>

                                            <div className="text-sm">
                                                Mr. Low Liang Yeou, KLK Oleo
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex bg-gray-100">
                                        <div
                                            className="w-1/4 p-4 border-r border-orange-400 text-indigo-800 font-semibold">
                                            1300 – 1400 hrs
                                        </div>
                                        <div className="w-3/4 p-4 text-indigo-800 font-semibold">
                                            Networking Lunch
                                        </div>
                                    </div>
                                    <div className="flex bg-orange-100 border-b border-indigo-900">
                                        <div className="p-4 font-bold w-full border-y-1 border-orange-400">
                                            <h1 className="w-full text-center">
                                                {" "}
                                                Session II: Sustainability, Applications & Nutrition
                                                Insights
                                            </h1>
                                        </div>
                                    </div>
                                    <div className="flex bg-gray-100">
                                        <div
                                            className="w-1/4 p-4 border-r border-orange-400 text-indigo-800 font-semibold">
                                            1400 – 1430 hrs
                                        </div>
                                        <div className="w-3/4 p-4">
                                            <div className="text-indigo-800 font-semibold">
                                                Paper 3: Beyond Compliance: Advancing Sustainability
                                                Through MSPO
                                            </div>

                                            <div className="text-sm">
                                                Mr. Ravin Trapshah Ismail, Wilmar International Pte Ltd
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex bg-gray-100">
                                        <div
                                            className="w-1/4 p-4 border-r border-orange-400 text-indigo-800 font-semibold">
                                            1430 – 1500 hrs
                                        </div>
                                        <div className="w-3/4 p-4">
                                            <div className="text-indigo-800 font-semibold">
                                                Paper 4: Nutrients from Palm Oil: Health Benefits and its Applications
                                            </div>

                                            <div className="text-sm">
                                                Dr. Sherlyn Lim, Avantsar Sdn Bhd
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex bg-gray-100">
                                        <div
                                            className="w-1/4 p-4 border-r border-orange-400 text-indigo-800 font-semibold">
                                            1500 – 1530 hrs
                                        </div>
                                        <div className="w-3/4 p-4">
                                            <div className="text-indigo-800 font-semibold">
                                                Paper 5: Advancement in Frying Applications with Malaysian Palm Olein
                                            </div>

                                            <div className="text-sm">
                                                Mr. Johari Minal, Malaysian Palm Oil Board
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex bg-orange-100 border-b border-indigo-900">
                                        <div className="p-4 font-bold w-full border-y-1 border-orange-400">
                                            <h1 className="w-full text-center">
                                                {" "}
                                                Session III: Demand Drivers & Market Outlook
                                            </h1>
                                        </div>
                                    </div>
                                    <div className="flex bg-gray-100">
                                        <div
                                            className="w-1/4 p-4 border-r border-orange-400 text-indigo-800 font-semibold">
                                            1530 – 1600 hrs
                                        </div>
                                        <div className="w-3/4 p-4">
                                            <div className="text-indigo-800 font-semibold">
                                                Paper 6: Deep Dive in the Philippines’ Beauty and Personal Care Market
                                                and its Growth Potential
                                            </div>

                                            <div className="text-sm">
                                                Mr. William Lau, Malaysian Palm Oil Council
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex bg-gray-100">
                                        <div
                                            className="w-1/4 p-4 border-r border-orange-400 text-indigo-800 font-semibold">
                                            1600 – 1630 hrs
                                        </div>
                                        <div className="w-3/4 p-4">
                                            <div className="text-indigo-800 font-semibold">
                                                Paper 7: What’s Driving Demand for Palm-Based Fatty Alcohols?
                                            </div>

                                            <div className="text-sm">
                                                Mr. Paul Bloemendal, PRETB Pte Ltd
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex bg-gray-100">
                                        <div
                                            className="w-1/4 p-4 border-r border-orange-400 text-indigo-800 font-semibold">
                                            1630 – 1700 hrs
                                        </div>
                                        <div className="w-3/4 p-4">
                                            <div className="text-indigo-800 font-semibold">
                                                Paper 8: Palm & Lauric Market Outlook
                                            </div>

                                            <div className="text-sm">
                                                Dr. Sathia Varqa, Fastmarkets Global Limited
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex bg-gray-100">
                                        <div
                                            className="w-1/4 p-4 border-r border-orange-400 text-indigo-800 font-semibold">
                                            1700 hrs
                                        </div>
                                        <div className="w-3/4 p-4">
                                            <div className="text-indigo-800 font-semibold">
                                                End of Conference
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full">
                                <h1 className="font-[500] text-lg my-2">04 June 2025</h1>
                                <div className="border border-indigo-900">
                                    <div className="flex bg-indigo-100 border-b border-indigo-900">
                                        <div className="w-1/4 p-4 font-bold border-r border-orange-400">
                                            Time
                                        </div>
                                        <div className="w-3/4 p-4 font-bold">Programme</div>
                                    </div>

                                    <div className="flex bg-white">
                                        <div
                                            className="w-1/4 p-4 border-r border-orange-400 text-indigo-800 font-semibold">
                                            0900 – 1400 hrs
                                        </div>
                                        <div className="w-3/4 p-4 text-indigo-800 font-semibold">
                                            BizMatch Session
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="mt-5 italic text-neutral-900 text-center text-sm">
                            Disclaimer: MPOC reserves the right to cancel or change the time
                            or date of the event and change its venue, content, and speakers
                            at any time at its discretion.
                        </p>
                    </div>
                </section>
            </main>
            <AnimatePresence>
                {currentEventReg.active && (
                    <>
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            key={1}
                            className="registration-form fixed w-full h-full top-0 left-0 bg-neutral-900/70 z-[9999] geist overflow-y-auto py-5 px-5"
                        >
                            <div className="grid place-content-center min-h-screen w-full">
                                <motion.div
                                    initial={{opacity: 0, scale: 0.9}}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                        transition: {delay: 0.2, duration: 0.2},
                                    }}
                                    exit={{opacity: 0, scale: 0.9}}
                                    key={2}
                                    className="form w-full max-w-[600px] bg-white rounded-xl overflow-hidden"
                                >
                                    <div className="image aspect-video w-full bg-red-50 relative">
                                        <img
                                            src="/assets/cover.png"
                                            alt=""
                                            className="w-full h-full object-cover brightness-60 z-[1]"
                                        />
                                        <div
                                            className="bg-gradient-to-t from-slate-600/90 to-transparent z-[2] h-[100%] w-full absolute top-0"></div>
                                        <div className="absolute bottom-[20px] left-[20px] text-white z-[3]">
                                            <h1 className="text:lg md:text-xl font-[600]">
                                                {currentEventReg.name}
                                            </h1>
                                            <p className="text-xs md:text-sm">
                                                {currentEventReg.organizedBy} •{" "}
                                                {currentEventReg.location}
                                            </p>
                                        </div>
                                        <div className="absolute right-[15px] top-[20px] z-[5]">
                                            <button
                                                onClick={() => {
                                                    handleExitForm();
                                                }}
                                                className="bg-white text-black p-1 rounded-full"
                                            >
                                                <X size="15px"/>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="px-7 py-5 mt-3">
                                        <h1 className="text-black font-[600] text-lg">
                                            Register for this event
                                        </h1>
                                        <p className="text-neutral-700 text-sm">
                                            Fill out the form below to secure your spot.
                                        </p>
                                        <div
                                            className="tags text-neutral-700 flex gap-3 items-center flex-wrap mt-3 text-sm">
                                            <div className="tag flex items-center gap-2">
                                                <Calendar size="15px"/>{" "}
                                                {moment
                                                    .unix(currentEventReg.date)
                                                    .utcOffset(currentEventReg.offsetT * -1)
                                                    .format("dddd, MMM DD, YYYY")}
                                            </div>
                                            <div className="tag flex items-center gap-2">
                                                <Clock size="15px"/>{" "}
                                                {moment
                                                    .unix(currentEventReg.startT)
                                                    .utcOffset(currentEventReg.offsetT * -1)
                                                    .format("hh:mm A")}{" "}
                                                -{" "}
                                                {moment
                                                    .unix(currentEventReg.endT)
                                                    .utcOffset(currentEventReg.offsetT * -1)
                                                    .format("hh:mm A")}{" "}
                                                (GMT{(currentEventReg.offsetT * -1) / 60 > 0 ? "+" : ""}
                                                {(currentEventReg.offsetT * -1) / 60})
                                            </div>
                                            {/* <div className="tag flex items-center gap-2">
                        <Users size="15px" /> Capacity:{" "}
                        {currentEventReg.atendeeLim} person
                        {currentEventReg.atendeeLim > 1 ? "s" : ""}
                      </div> */}
                                        </div>
                                        <div className="mt-5 flex flex-col gap-2">
                                            <div className="flex flex-col md:flex-row items-start gap-2">
                                                <TextInput
                                                    identifier="fn"
                                                    title="Full Name"
                                                    value={registrationForm.name.value}
                                                    placeholder=""
                                                    onInput={(dx) =>
                                                        setRegistrationForm((pv) => ({
                                                            ...pv,
                                                            name: {value: dx, err: ""},
                                                        }))
                                                    }
                                                    error={registrationForm.name.err}
                                                    className="w-full md:w-1/2"
                                                    req
                                                />
                                                <TextInput
                                                    identifier="salutation"
                                                    title="Salutations (Mr. Ms. Mrs, etc.)"
                                                    value={registrationForm.salutations.value}
                                                    placeholder=""
                                                    onInput={(dx) =>
                                                        setRegistrationForm((pv) => ({
                                                            ...pv,
                                                            salutations: {value: dx, err: ""},
                                                        }))
                                                    }
                                                    error={registrationForm.salutations.err}
                                                    className="w-full md:w-1/2"
                                                    req
                                                />
                                            </div>

                                            <TextInput
                                                identifier="email"
                                                title="E-Mail"
                                                value={registrationForm.email.value}
                                                placeholder=""
                                                onInput={(dx) =>
                                                    setRegistrationForm((pv) => ({
                                                        ...pv,
                                                        email: {value: dx, err: ""},
                                                    }))
                                                }
                                                error={registrationForm.email.err}
                                                req
                                            />
                                            <TextInput
                                                identifier="addr"
                                                title="Address"
                                                value={registrationForm.addr.value}
                                                placeholder=""
                                                onInput={(dx) =>
                                                    setRegistrationForm((pv) => ({
                                                        ...pv,
                                                        addr: {value: dx, err: ""},
                                                    }))
                                                }
                                                error={registrationForm.addr.err}
                                            />
                                            <div>
                                                <label htmlFor="country" className="font-[500] text-sm">
                                                    Country
                                                    <span className="font-[500] text-red-600">*</span>
                                                </label>
                                                <select
                                                    name="country"
                                                    id="country-select"
                                                    value={registrationForm.country.value}
                                                    onChange={(e) => {
                                                        setRegistrationForm((pv) => ({
                                                            ...pv,
                                                            country: {value: e.target.value, err: ""},
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
                                                {registrationForm.country.err && (
                                                    <motion.div
                                                        key={1}
                                                        initial={{opacity: 0}}
                                                        animate={{opacity: 1}}
                                                        exit={{opacity: 0}}
                                                        className="warn mt-[5px] flex items-center gap-2 text-xs text-red-600"
                                                    >
                                                        <AlertTriangle size="13px" className="shrink-0"/>
                                                        {registrationForm.country.err}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                            <div className="flex flex-col md:flex-row items-start gap-2">
                                                <TextInput
                                                    identifier="org-n"
                                                    title="Organization Name"
                                                    value={registrationForm.orgN.value}
                                                    placeholder=""
                                                    onInput={(dx) =>
                                                        setRegistrationForm((pv) => ({
                                                            ...pv,
                                                            orgN: {value: dx, err: ""},
                                                        }))
                                                    }
                                                    error={registrationForm.orgN.err}
                                                    className="w-full md:w-1/2"
                                                    req
                                                />
                                                <TextInput
                                                    identifier="org-p"
                                                    title="Position"
                                                    value={registrationForm.orgP.value}
                                                    placeholder=""
                                                    onInput={(dx) =>
                                                        setRegistrationForm((pv) => ({
                                                            ...pv,
                                                            orgP: {value: dx, err: ""},
                                                        }))
                                                    }
                                                    error={registrationForm.orgP.err}
                                                    className="w-full md:w-1/2"
                                                    req
                                                />
                                            </div>

                                            <p className="font-[500] text-sm">
                                                Phone Number
                                                <span className="font-[500] text-red-600">*</span>
                                            </p>
                                            <div>
                                                <IntlTelInput
                                                    onChangeNumber={setNumber}
                                                    onChangeValidity={setIsValid}
                                                    onChangeErrorCode={setErrorCode}
                                                    ref={intlTelInputRef}
                                                    initOptions={{
                                                        initialCountry: "ph",
                                                        loadUtils: () => import("intl-tel-input/utils"),
                                                    }}
                                                />
                                            </div>
                                            <AnimatePresence>
                                                {notice && (
                                                    <motion.div
                                                        key={1}
                                                        initial={{opacity: 0}}
                                                        animate={{opacity: 1}}
                                                        exit={{opacity: 0}}
                                                        className="warn mt-[5px] flex items-center gap-2 text-xs text-red-600"
                                                    >
                                                        <AlertTriangle size="13px" className="shrink-0"/>
                                                        {notice}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                            <div>
                                                <label
                                                    htmlFor="attended"
                                                    className="font-[500] text-sm"
                                                >
                                                    Are you interested in attending the Business Matching
                                                    (BizMatch) session on June 4?
                                                    <span className="font-[500] text-red-600">*</span>
                                                </label>
                                                <select
                                                    name="attended"
                                                    id=""
                                                    value={registrationForm.attendBizMatch.value}
                                                    onChange={(e) => {
                                                        setRegistrationForm((pv) => ({
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
                                                        Yes, maybe I'll attend. I would like to receive a
                                                        follow up email.
                                                    </option>
                                                    <option value="no">No, I'm not interested.</option>
                                                </select>
                                            </div>
                                            <AnimatePresence>
                                                {registrationForm.attendBizMatch.err && (
                                                    <motion.div
                                                        key={1}
                                                        initial={{opacity: 0}}
                                                        animate={{opacity: 1}}
                                                        exit={{opacity: 0}}
                                                        className="warn mt-[5px] flex items-center gap-2 text-xs text-red-600"
                                                    >
                                                        <AlertTriangle size="13px" className="shrink-0"/>
                                                        {registrationForm.attendBizMatch.err}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                            <HCaptcha
                                                sitekey="f69ac368-e8b8-4074-8166-fd7a3f4a53de"
                                                onLoad={onLoad}
                                                onVerify={setHCaptchaToken}
                                                ref={captchaRef}
                                                key={123}
                                            />

                                            <div
                                                className="quest bg-emerald-50 rounded-xl mt-2 px-8 py-5 text-emerald-700">
                                                <h1 className="font-[500] text-xs">
                                                    If you have any questions, please do not hesitate to
                                                    contact:
                                                </h1>
                                                <div className="mt-2">
                                                    <ul>
                                                        <li className="font-[600] text-sm">
                                                            Marc Ferrancullo
                                                        </li>
                                                        <li className="text-xs">
                                                            <a href="mailto:marcferrancullo@gmail.com">
                                                                marcferrancullo@gmail.com
                                                            </a>
                                                        </li>
                                                        <li className="text-xs">
                                                            <a
                                                                href="https://wa.me/639156442425"
                                                                style={{
                                                                    display: "flex",
                                                                    alignItems: "flex",
                                                                    gap: "5px",
                                                                    fontWeight: 500,
                                                                    textDecoration: "none",
                                                                }}
                                                                target="_blank"
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="16"
                                                                    height="16"
                                                                    fill="green"
                                                                    viewBox="0 0 16 16"
                                                                >
                                                                    <path
                                                                        d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                                                                </svg>
                                                                +63 915 644 2425
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="mt-2">
                                                    <ul>
                                                        <li className="font-[600] text-sm">
                                                            Marciano Ferrancullo Jr.
                                                        </li>
                                                        <li className="text-xs">
                                                            <a href="mailto:marc_chevoleo@hotmail.com">
                                                                marc_chevoleo@hotmail.com
                                                            </a>
                                                        </li>
                                                        <li className="text-xs">
                                                            <a
                                                                href="https://wa.me/639663874917"
                                                                style={{
                                                                    display: "flex",
                                                                    alignItems: "flex",
                                                                    gap: "5px",
                                                                    fontWeight: 500,
                                                                    textDecoration: "none",
                                                                }}
                                                                target="_blank"
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="16"
                                                                    height="16"
                                                                    fill="green"
                                                                    viewBox="0 0 16 16"
                                                                >
                                                                    <path
                                                                        d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                                                                </svg>
                                                                +63 966 387 4917
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="mt-2">
                                                    <ul>
                                                        <li className="font-[600] text-sm">
                                                            Rina Mariati Gustam
                                                        </li>
                                                        <li className="text-xs">
                                                            <a href="mailto:rina@mpoc.org.my">
                                                                rina@mpoc.org.my
                                                            </a>
                                                        </li>
                                                        <li className="text-xs">
                                                            <a
                                                                href="https://wa.me/60123353004"
                                                                style={{
                                                                    display: "flex",
                                                                    alignItems: "flex",
                                                                    gap: "5px",
                                                                    fontWeight: 500,
                                                                    textDecoration: "none",
                                                                }}
                                                                target="_blank"
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="16"
                                                                    height="16"
                                                                    fill="green"
                                                                    viewBox="0 0 16 16"
                                                                >
                                                                    <path
                                                                        d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                                                                </svg>
                                                                +60 12-335 3004
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="mt-2">
                                                    <ul>
                                                        <li className="font-[600] text-sm">William Lau</li>
                                                        <li className="text-xs">
                                                            <a href="mailto:williamlhh@mpoc.org.my">
                                                                williamlhh@mpoc.org.my
                                                            </a>
                                                        </li>
                                                        <li className="text-xs">
                                                            <a
                                                                href="https://wa.me/60168707250"
                                                                style={{
                                                                    display: "flex",
                                                                    alignItems: "flex",
                                                                    gap: "5px",
                                                                    fontWeight: 500,
                                                                    textDecoration: "none",
                                                                }}
                                                                target="_blank"
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="16"
                                                                    height="16"
                                                                    fill="green"
                                                                    viewBox="0 0 16 16"
                                                                >
                                                                    <path
                                                                        d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                                                                </svg>
                                                                +60 16-870 7250
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <p className="text-center text-xs mt-2 text-neutral-700 select-none">
                                                For your safety, this site is protected by hCaptcha.
                                            </p>
                                            <div className="submit-btns flex justify-end mt-3">
                                                {!isRegistering && (
                                                    <button
                                                        onClick={() => handleSubmitForm()}
                                                        className="bg-black font-[600] text-white py-1.5 px-4 text-sm rounded-md hover:bg-neutral-800"
                                                    >
                                                        Register
                                                    </button>
                                                )}

                                                {isRegistering && (
                                                    <button
                                                        onClick={() => {
                                                        }}
                                                        className="cursor-not-allowed flex gap-2 items-center bg-black text-white py-1.5 px-4 text-sm rounded-md hover:bg-neutral-900"
                                                    >
                                                        <CircularProgress
                                                            disableShrink
                                                            value={70}
                                                            thickness={6}
                                                            size={15}
                                                            sx={{
                                                                color: "white",
                                                            }}
                                                        />
                                                        Registering...
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
