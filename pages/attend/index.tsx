import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Calendar,
  Check,
  Clock,
  Download,
  Users,
  InfoIcon,
  X,
} from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import moment from "moment";
import { CircularProgress } from "@mui/material";
import TextInput from "@/components/Inputs/TextInput";
import { useModal } from "@/components/Modal/ModalContext";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import Head from "next/head";
import "intl-tel-input/styles";

import dynamic from "next/dynamic";

const IntlTelInput = dynamic(() => import("intl-tel-input/reactWithUtils"), {
  ssr: false,
});

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

  const [render, setRender] = useState<boolean>(false);
  const [hCaptchaToken, setHCaptchaToken] = useState(null);
  const captchaRef = useRef(null);
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
  });

  const router = useRouter();
  const modal = useModal();

  const fetchEvent = async () => {
    try {
      const xtc = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/fetch-ord-event`,
        { evId: process.env.NEXT_PUBLIC_EV },
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
        startT: xtcdat.startT._seconds,
        endT: xtcdat.endT._seconds,
        date: xtcdat.date._seconds,
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
    } catch (e) {
      setRender(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, []);

  useEffect(() => {
    setNotice("");
  }, [number]);

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
        token: hCaptchaToken,
      })
    );
    try {
      const rqx = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/attend-ord-ev`,
        form,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setIsRegistering(false);
      modal.show({
        icon: <Check />,
        title: "Registered",
        content: rqx.data.msg,
        confirmText: "Register Another Atendee",
        cancelText: "Exit",
        onConfirm: () => {
          setRegistrationForm(regFormDefaults);
          captchaRef.current?.resetCaptcha();
          modal.hide();
        },
        onCancel: () => {
          setCurrentEventReg(currentEventRegDefaults);
          setRegistrationForm(regFormDefaults);
          modal.hide();
        },

        color: "emerald",
      });
    } catch (e) {
      if (e.message === "Network Error") {
        modal.show({
          icon: <X />,
          title: "Network Error",
          content: "Please check if you are connected to the internet.",
          confirmText: "Try Again",
          cancelText: "Exit",
          onConfirm: () => {
            modal.hide();
          },
          onCancel: () => {
            setCurrentEventReg(currentEventRegDefaults);
            setRegistrationForm(regFormDefaults);
            modal.hide();
          },

          color: "red",
        });
      } else {
        modal.show({
          icon: <X />,
          title: "Error",
          content: e.response.data.err,
          confirmText: "Try Again",
          cancelText: "Exit",
          onConfirm: () => {
            modal.hide();
          },
          onCancel: () => {
            setCurrentEventReg(currentEventRegDefaults);
            setRegistrationForm(regFormDefaults);
            modal.hide();
          },

          color: "red",
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
          <CircularProgress disableShrink />
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
        <link rel="icon" href="/assets/petalsfav/favicon.ico" />
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
                  <a href="#description">Description</a>
                </li>
                <li className="cursor-pointer px-2 py-1 text-neutral-800 hover:text-neutral-900">
                  <a href="#program">Event Programme</a>
                </li>
                <li className="cursor-pointer px-2 py-1 text-neutral-800 hover:text-neutral-900">
                  <a href="#sponsorship">Sponsorships</a>
                </li>
              </ul>
            </div>
          </div>
        </header>
        <section className="overflow-hidden">
          <div className="eventra-reg-container geist">
            <div className="wrapper relative evs-hero ">
              <div className="floating flex flex-col gap-[20px] relative pt-[30px] z-[2] md:flex-row md:pt-[100px] lg:pt-[150px]">
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
                    <ArrowUpRight size="18px" strokeWidth={3} />
                    Register MPOF 2025
                  </button>
                  <a
                    href="https://drive.google.com/file/d/1PVxY56IvWsaVnY0AJI7WD0UC-itmKrwp/view?usp=sharing"
                    target="_blank"
                  >
                    <button className="text-xs  lg:text-sm bg-neutral-50 border-1 border-neutral-500 hover:bg-neutral-100 text-neutral-900 rounded-full px-5 py-1.5 mt-3  font-[600] flex gap-2 items-center">
                      <Download size="15px" strokeWidth={3} />
                      Download Program Brochure
                    </button>
                  </a>
                </div>
              </div>
              <div className="relative mt-[50px] w-[200px] z-[5] lg:mt-[100px] lg:w-[250px] xl:mt-[130px] xl:w-[300px]">
                <img src="/assets/support.png" alt="" />
              </div>{" "}
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
              <div className="absolute bottom-[400px] z-[1] right-[-200px] opacity-50  max-w-[1100px] md:bottom-0 md:opacity-100 md:right-[-500px] lg:right-[-200px] lg:bottom-[50px]">
                <img src="/assets/hero-img.png" alt="" className="w-full" />
              </div>
            </div>
          </div>
        </section>
        <section className="inter mt-20" id="description">
          <div className="eventra-reg-container">
            <h1 className="text-center text-xl font-[700] text-orange-500 md:text-2xl">
              Description
            </h1>
            <div className="flex flex-col text-sm items-center gap-5 max-w-[1200px] mx-auto font-[400] mt-5 md:text-base">
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
              Event Programme{" "}
              <span className="text-orange-400 text-base">(Tentative)</span>
            </h1>
            <div className="scheds mt-5 grid grid-cols-1 gap-[10px] text-xs md:text-sm lg:text-base lg:grid-cols-2">
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
                    <div className="w-1/4 p-4 border-r border-orange-400 text-indigo-800 font-semibold">
                      0830 – 0920 hrs
                    </div>
                    <div className="w-3/4 p-4 text-indigo-800 font-semibold">
                      Registration
                    </div>
                  </div>

                  <div className="flex bg-gray-100">
                    <div className="w-1/4 p-4 border-r border-orange-400 text-indigo-800 font-semibold">
                      0925 hrs
                    </div>
                    <div className="w-3/4 p-4">
                      <div className="text-indigo-800 font-semibold">
                        Arrival of the Honourable Datuk Seri Johari bin Abdul
                        Ghani
                      </div>
                      <div>
                        Minister of Plantation and Commodities, Malaysia
                      </div>
                    </div>
                  </div>

                  <div className="flex bg-white">
                    <div className="w-1/4 p-4 border-r border-orange-400 text-indigo-800 font-semibold">
                      0930 – 0945 hrs
                    </div>
                    <div className="w-3/4 p-4">
                      <div className="text-indigo-800 font-semibold">
                        Welcome Remarks by the Chairman/CEO
                      </div>
                      <div>Malaysian Palm Oil Council (MPOC)</div>
                    </div>
                  </div>

                  <div className="flex bg-gray-100">
                    <div className="w-1/4 p-4 border-r border-orange-400 text-indigo-800 font-semibold">
                      0945 – 1015 hrs
                    </div>
                    <div className="w-3/4 p-4">
                      <div className="text-indigo-800 font-semibold">
                        Keynote Address by the Honourable Datuk Seri Johari bin
                        Abdul Ghani
                      </div>
                      <div>
                        Minister of Plantation and Commodities, Malaysia
                      </div>
                      <div className="mt-4">
                        Opening Ceremony of MPOF Philippines 2025
                      </div>
                    </div>
                  </div>

                  <div className="flex bg-white">
                    <div className="w-1/4 p-4 border-r border-orange-400 text-indigo-800 font-semibold">
                      1015 – 1045 hrs
                    </div>
                    <div className="w-3/4 p-4">
                      <div className="text-indigo-800 font-semibold">
                        Plenary Paper: Lauric Oils: Evolving Supply & Demand and
                        Future Market Dynamics
                      </div>
                      <div>Dr. Julian McGill, Glenauk Economics</div>
                    </div>
                  </div>

                  <div className="flex bg-gray-100">
                    <div className="w-1/4 p-4 border-r border-orange-400 text-indigo-800 font-semibold">
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
                    <div className="w-1/4 p-4 border-r border-orange-400 text-indigo-800 font-semibold">
                      1115 – 1200 hrs
                    </div>
                    <div className="w-3/4 p-4">
                      <div className="text-indigo-800 font-semibold">
                        Panel Discussion - Unlocking ASEAN's Potential:
                      </div>
                      <div className="text-indigo-800 font-semibold">
                        Growth & Market Expansion in Lauric Oils & Downstream
                        Sectors
                      </div>
                      <div>
                        Moderator: Datul Saw Lee Chyan, Chairman, Malaysian
                        Oleochemical Manufacturers Group (MOMG)
                      </div>
                      <div>
                        Panelists: Industry Representatives from Malaysia and
                        the Philippines
                      </div>
                    </div>
                  </div>
                  <div className="flex bg-gray-100">
                    <div className="w-1/4 p-4 border-r border-orange-400 text-indigo-800 font-semibold">
                      1200 – 1230 hrs
                    </div>
                    <div className="w-3/4 p-4">
                      <div className="text-indigo-800 font-semibold">
                        Paper 1: What's Driving Demand For Palm-Based Fatty
                        Alcohols?
                      </div>

                      <div>TBC</div>
                    </div>
                  </div>
                  <div className="flex bg-gray-100">
                    <div className="w-1/4 p-4 border-r border-orange-400 text-indigo-800 font-semibold">
                      1230 – 1300 hrs
                    </div>
                    <div className="w-3/4 p-4">
                      <div className="text-indigo-800 font-semibold">
                        Paper 2: MCT Oil: The Future of Functional Nutrition and
                        Wellness
                      </div>

                      <div>TBC</div>
                    </div>
                  </div>
                  <div className="flex bg-gray-100">
                    <div className="w-1/4 p-4 border-r border-orange-400 text-indigo-800 font-semibold">
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
                    <div className="w-1/4 p-4 border-r border-orange-400 text-indigo-800 font-semibold">
                      1400 – 1430 hrs
                    </div>
                    <div className="w-3/4 p-4">
                      <div className="text-indigo-800 font-semibold">
                        Paper 3: Beyond Compliance: Advancing Sustainability
                        Through MSPO
                      </div>

                      <div>TBC</div>
                    </div>
                  </div>
                  <div className="flex bg-gray-100">
                    <div className="w-1/4 p-4 border-r border-orange-400 text-indigo-800 font-semibold">
                      1430 – 1500 hrs
                    </div>
                    <div className="w-3/4 p-4">
                      <div className="text-indigo-800 font-semibold">
                        Paper 4: Palm Oil in Nutrition: Scientific Insights and
                        Health Perspectives
                      </div>

                      <div>Dr. Sherlyn Lim, Avantsar Sdn Bhd</div>
                    </div>
                  </div>
                  <div className="flex bg-gray-100">
                    <div className="w-1/4 p-4 border-r border-orange-400 text-indigo-800 font-semibold">
                      1500 – 1530 hrs
                    </div>
                    <div className="w-3/4 p-4">
                      <div className="text-indigo-800 font-semibold">
                        Paper 5: Advancements in Frying Applications with
                        Malaysian Palm Olein
                      </div>

                      <div>TBC</div>
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
                    <div className="w-1/4 p-4 border-r border-orange-400 text-indigo-800 font-semibold">
                      1530 – 1600 hrs
                    </div>
                    <div className="w-3/4 p-4">
                      <div className="text-indigo-800 font-semibold">
                        Paper 6: Potential Growth of Lauric Oils in Specialty
                        Fats
                      </div>

                      <div>TBC</div>
                    </div>
                  </div>
                  <div className="flex bg-gray-100">
                    <div className="w-1/4 p-4 border-r border-orange-400 text-indigo-800 font-semibold">
                      1600 – 1630 hrs
                    </div>
                    <div className="w-3/4 p-4">
                      <div className="text-indigo-800 font-semibold">
                        Paper 7: Deep Dive into the Philippines' Personal Care
                        Market and Its Growth Potential
                      </div>

                      <div>TBC</div>
                    </div>
                  </div>
                  <div className="flex bg-gray-100">
                    <div className="w-1/4 p-4 border-r border-orange-400 text-indigo-800 font-semibold">
                      1630 – 1700 hrs
                    </div>
                    <div className="w-3/4 p-4">
                      <div className="text-indigo-800 font-semibold">
                        Paper 8: Palm & Lauric Market Outlook
                      </div>

                      <div>Dr. Sathia Varqa, Fastmarkets Global Limited</div>
                    </div>
                  </div>
                  <div className="flex bg-gray-100">
                    <div className="w-1/4 p-4 border-r border-orange-400 text-indigo-800 font-semibold">
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
                    <div className="w-1/4 p-4 border-r border-orange-400 text-indigo-800 font-semibold">
                      0900 – 1400 hrs
                    </div>
                    <div className="w-3/4 p-4 text-indigo-800 font-semibold">
                      BizMatch Session
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="sponsorships inter" id="sponsorship">
          <div className="eventra-reg-container">
            {/* Sponsorship Packages Header */}
            <h1 className="text-xl font-bold text-orange-500 mb-4 text-center mt-[100px] md:text-2xl">
              Sponsorship Packages
            </h1>

            {/* Introduction */}
            <p className="mb-6 text-sm">
              MPOF Philippines 2025 offers a range of sponsorship packages
              designed to enhance your brand visibility and connect your company
              with key decision-makers in the oils and fats industry. These
              packages provide exclusive promotional opportunities, ensuring
              maximum exposure throughout the conference.
            </p>

            <p className="mb-4 text-sm">
              Sponsors will benefit from brand recognition, targeted marketing,
              and direct engagement with key industry players. Sponsorship
              categories are as follows:
            </p>

            {/* Sponsorship Tiers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white p-3 rounded flex justify-between items-center">
                <span className="font-bold text-lg">Titanium</span>
                <span className="font-bold">USD6,700</span>
              </div>

              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-3 rounded flex justify-between items-center">
                <span className="font-bold text-lg">Gold</span>
                <span className="font-bold">USD3,500</span>
              </div>

              <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white p-3 rounded flex justify-between items-center">
                <span className="font-bold text-lg">Platinum</span>
                <span className="font-bold">USD4,500</span>
              </div>

              <div className="bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 p-3 rounded flex justify-between items-center">
                <span className="font-bold text-lg">Silver</span>
                <span className="font-bold">USD2,500</span>
              </div>

              <div className="md:col-span-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white p-3 rounded flex justify-between items-center">
                <span className="font-bold text-lg">Partner</span>
                <span className="font-bold">USD1,200</span>
              </div>
            </div>

            {/* Sponsorship Benefits */}
            <h2 className="text-xl font-bold text-orange-500 mb-6 text-center md:text-2xl">
              Sponsorship Benefits
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Titanium Benefits */}
              <div className="border border-gray-300 rounded overflow-hidden bg-white">
                <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white p-3">
                  <h3 className="font-bold">Titanium Sponsor - USD6,700</h3>
                </div>
                <div className="p-4">
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    <li>
                      Corporate video screening before the opening ceremony and
                      during session intervals.
                    </li>
                    <li>
                      Prominent branding at the conference venue (subject to
                      hotel policy).
                    </li>
                    <li>
                      Priority full-page advertisement in the seminar souvenir
                      programme.
                    </li>
                    <li>
                      Acknowledgement as the Titanium Sponsor across all printed
                      materials and throughout the event.
                    </li>
                    <li>
                      Top-tier logo placement on conference signage, backdrops,
                      brochures, and digital materials.
                    </li>
                    <li>
                      Access to delegate mailing addresses for post-event
                      marketing.
                    </li>
                    <li>
                      Inclusion of promotional materials in delegate welcome
                      kits.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Gold Benefits */}
              <div className="border border-gray-300 rounded overflow-hidden bg-white">
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-3">
                  <h3 className="font-bold">Gold Sponsor - USD3,500</h3>
                </div>
                <div className="p-4">
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    <li>
                      Branding at the conference venue (subject to hotel
                      policy).
                    </li>
                    <li>
                      Full-page advertisement in the seminar souvenir programme.
                    </li>
                    <li>
                      Logo placement on conference signage, backdrops and
                      brochures.
                    </li>
                    <li>
                      Access to delegate mailing addresses for post-event
                      marketing.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Platinum Benefits */}
              <div className="border border-gray-300 rounded overflow-hidden bg-white">
                <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white p-3">
                  <h3 className="font-bold">Platinum Sponsor - USD4,500</h3>
                </div>
                <div className="p-4">
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    <li>
                      Corporate video screening before the opening ceremony and
                      during session intervals.
                    </li>
                    <li>
                      Branding at the conference venue (subject to hotel
                      policy).
                    </li>
                    <li>
                      Priority full-page advertisement in the seminar souvenir
                      programme.
                    </li>
                    <li>
                      Acknowledgement as the Platinum Sponsor across all printed
                      materials and throughout the event.
                    </li>
                    <li>
                      Priority logo placement on conference signage, backdrops,
                      brochures, and digital materials.
                    </li>
                    <li>
                      Access to delegate mailing addresses for post-event
                      marketing.
                    </li>
                    <li>
                      Inclusion of promotional materials in delegate welcome
                      kits.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Silver Benefits */}
              <div className="border border-gray-300 rounded overflow-hidden bg-white">
                <div className="bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 p-3">
                  <h3 className="font-bold">Silver Sponsor - USD2,500</h3>
                </div>
                <div className="p-4">
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    <li>
                      Full-page advertisement in the seminar souvenir programme.
                    </li>
                    <li>
                      Recognition as the Silver Sponsor on all printed
                      materials.
                    </li>
                    <li>
                      Logo placement on conference signage, backdrops and
                      brochures.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Partner Benefits */}
              <div className="border border-gray-300 rounded overflow-hidden md:col-span-2 bg-white">
                <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-3">
                  <h3 className="font-bold">Partner - USD1,200</h3>
                </div>
                <div className="p-4">
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    <li>
                      Full-page advertisement in the seminar souvenir programme.
                    </li>
                    <li>
                      Logo placement on conference signage, backdrops and
                      brochures.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="relative z-10 mb-20 mt-5">
              {/* Main speech bubble */}
              <div className="border border-indigo-300 rounded-3xl p-8 bg-white">
                <p className="text-gray-800 mb-6">
                  To explore sponsorship opportunities and secure your preferred
                  package, please reach out to our team:
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">
                      Rina Marjati Gustam
                    </h3>
                    <p className="text-gray-700">
                      <a href="mailto:rina@mpoc.org.my">rina@mpoc.org.my</a>
                    </p>
                    <div className="w-32 h-0.5 bg-orange-400 mt-2"></div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">
                      William Lau
                    </h3>
                    <p className="text-gray-700">
                      <a href="mailto:williamlhh@mpoc.org.my">
                        williamlhh@mpoc.org.my
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                <svg
                  width="40"
                  height="20"
                  viewBox="0 0 40 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M0 0 L40 0 L20 20 Z" fill="white" />
                  <path
                    d="M0 0 L40 0 L20 20 Z"
                    stroke="#a5b4fc"
                    fill="none"
                    strokeWidth="1"
                  />
                </svg>
              </div>
            </div>

            <div className="text-center text-lg font-semibold text-orange-500 italic relative z-10">
              Our team will be happy to assist you with
              <br />
              sponsorship confirmation and any inquiries
              <br />
              regarding available packages.
            </div>
          </div>
        </section>
        <div className="provided-to-u mx-auto w-max flex flex-col items-center mt-[200px] inter text-xs opacity-25 select-none">
          <p className="font-[600]">
            <a href="https://facebook.com/ctxsoftwaresphilippines">
              Made by CTX Softwares Philippines (CTX Technologies)
            </a>
          </p>
          <p className="text-[500] flex items-center">
            Registration powered by{" "}
            <img src="favicon.ico" className="h-[15px] w-[15px] inline mx-1" />
            Eventra® Events v1.0
          </p>
        </div>
      </main>
      <AnimatePresence>
        {currentEventReg.active && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key={1}
              className="registration-form fixed w-full h-full top-0 left-0 bg-neutral-900/70 z-[9999] geist overflow-y-auto py-5 px-5"
            >
              <div className="grid place-content-center min-h-screen w-full">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    transition: { delay: 0.2, duration: 0.2 },
                  }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={2}
                  className="form w-full max-w-[600px] bg-white rounded-xl overflow-hidden"
                >
                  <div className="image aspect-video w-full bg-red-50 relative">
                    <img
                      src="/assets/cover.png"
                      alt=""
                      className="w-full h-full object-cover brightness-60 z-[1]"
                    />
                    <div className="bg-gradient-to-t from-slate-600/90 to-transparent z-[2] h-[100%] w-full absolute top-0"></div>
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
                        <X size="15px" />
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
                    <div className="tags text-neutral-700 flex gap-3 items-center flex-wrap mt-3 text-sm">
                      <div className="tag flex items-center gap-2">
                        <Calendar size="15px" />{" "}
                        {moment
                          .unix(currentEventReg.date)
                          .utcOffset(currentEventReg.offsetT * -1)
                          .format("dddd, MMM DD, YYYY")}
                      </div>
                      <div className="tag flex items-center gap-2">
                        <Clock size="15px" />{" "}
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
                              name: { value: dx, err: "" },
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
                              salutations: { value: dx, err: "" },
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
                            email: { value: dx, err: "" },
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
                            addr: { value: dx, err: "" },
                          }))
                        }
                        error={registrationForm.addr.err}
                      />
                      <div className="flex flex-col md:flex-row items-start gap-2">
                        <TextInput
                          identifier="org-n"
                          title="Organization Name"
                          value={registrationForm.orgN.value}
                          placeholder=""
                          onInput={(dx) =>
                            setRegistrationForm((pv) => ({
                              ...pv,
                              orgN: { value: dx, err: "" },
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
                              orgP: { value: dx, err: "" },
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
                      <IntlTelInput
                        onChangeNumber={setNumber}
                        onChangeValidity={setIsValid}
                        onChangeErrorCode={setErrorCode}
                        initOptions={{
                          initialCountry: "ph",
                        }}
                      />
                      <AnimatePresence>
                        {notice && (
                          <motion.div
                            key={1}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="warn mt-[5px] flex items-center gap-2 text-xs text-red-600"
                          >
                            <AlertTriangle size="13px" className="shrink-0" />
                            {notice}
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

                      <div className="quest bg-emerald-50 rounded-xl mt-2 px-8 py-5 text-emerald-700">
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
                            <li className="text-xs">+63 915 644 2425</li>
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
                            <li className="text-xs">+63 966 387 4917</li>
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
                            className="bg-black text-white py-1.5 px-4 text-sm rounded-md hover:bg-neutral-900"
                          >
                            Register
                          </button>
                        )}

                        {isRegistering && (
                          <button
                            onClick={() => {}}
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
