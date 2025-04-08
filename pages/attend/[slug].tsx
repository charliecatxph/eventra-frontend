import { ArrowRight, Calendar, Check, Clock, Users, X } from "lucide-react";
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
  diet: {
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
  diet: {
    value: string;
    err: string;
  };
}

export default function AttendEv() {
  const [render, setRender] = useState<boolean>(false);
  const [hCaptchaToken, setHCaptchaToken] = useState(null);
  const captchaRef = useRef(null);

  const [events, setEvents] = useState<EVs[]>([]);
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
    diet: {
      value: "",
      err: "",
    },
  });

  const router = useRouter();
  const modal = useModal();

  const getAvailableEvents = async () => {
    try {
      const req = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/get-available-events?orgId=${router.query.slug}`
      );

      const acs = req.data;

      let tmp: EVs[] = [];
      acs.data.forEach((ev: any) => {
        tmp.push({
          name: ev.name,
          location: ev.location,
          organizedBy: ev.organizedBy,
          description: ev.description,
          offsetT: ev.offset,
          date: ev.date._seconds,
          startT: ev.startT._seconds,
          endT: ev.endT._seconds,
          allowWalkIn: ev.allowWalkIn,
          atendeeLim: parseInt(ev.atendeeLim),
          organizationId: ev.organizationId,
          coverFile: ev.coverFile,
          registrationEnded: ev.registrationEnded,
          evId: ev.evId,
          atendeeCount: ev.atendeeCount,
        });
      });

      setEvents(tmp);
      setRender(true);
    } catch (e) {}
  };

  useEffect(() => {
    if (!router.query.slug) return;

    getAvailableEvents();
  }, [router.query.slug]);

  const handleRegisterForEvent = (i: number) => {
    setCurrentEventReg({
      active: true,
      ...events[i],
    });
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
      if (key === "email" || key === "orgN" || key === "orgP") return;

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
        diet: registrationForm.diet.value.trim(),
        evId: currentEventReg.evId,
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
      setCurrentEventReg(currentEventRegDefaults);
      setRegistrationForm(regFormDefaults);
    }
  };

  const onLoad = () => {
    captchaRef.current?.execute();
  };

  if (!render) return <></>;

  return (
    <>
      <Head>
        <title>Eventra | Attend an Event</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen w-full bg-[#f5f6fb] px-5">
        <header className="mx-auto  bg-[#f5f6fb]  sticky top-0 left-0 z-[999]">
          <div className="max-w-[1100px] mx-auto py-5">
            <div className="logo flex justify-start  items-center gap-1">
              <svg
                width="30"
                height="39"
                viewBox="0 0 99 89"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="43.5" cy="36.5" r="25.5" fill="#EE1818" />
                <circle cx="62.5" cy="46.5" r="25.5" fill="#FED11C" />
                <circle cx="36.5" cy="52.5" r="25.5" fill="#A118FD" />
              </svg>

              <svg
                width="77"
                height="39"
                viewBox="0 0 37 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className=""
              >
                <path
                  d="M3.864 8.06C3.208 8.06 2.632 7.924 2.136 7.652C1.64 7.372 1.252 6.992 0.972 6.512C0.692 6.024 0.552 5.468 0.552 4.844C0.552 4.22 0.684 3.668 0.948 3.188C1.22 2.708 1.588 2.332 2.052 2.06C2.524 1.78 3.052 1.64 3.636 1.64C4.228 1.64 4.752 1.776 5.208 2.048C5.672 2.312 6.036 2.688 6.3 3.176C6.564 3.656 6.696 4.212 6.696 4.844C6.696 4.884 6.692 4.928 6.684 4.976C6.684 5.016 6.684 5.06 6.684 5.108H1.2V4.472H6.228L5.892 4.724C5.892 4.268 5.792 3.864 5.592 3.512C5.4 3.152 5.136 2.872 4.8 2.672C4.464 2.472 4.076 2.372 3.636 2.372C3.204 2.372 2.816 2.472 2.472 2.672C2.128 2.872 1.86 3.152 1.668 3.512C1.476 3.872 1.38 4.284 1.38 4.748V4.88C1.38 5.36 1.484 5.784 1.692 6.152C1.908 6.512 2.204 6.796 2.58 7.004C2.964 7.204 3.4 7.304 3.888 7.304C4.272 7.304 4.628 7.236 4.956 7.1C5.292 6.964 5.58 6.756 5.82 6.476L6.3 7.028C6.02 7.364 5.668 7.62 5.244 7.796C4.828 7.972 4.368 8.06 3.864 8.06ZM8.74472 8L5.94872 1.7H6.83672L9.40472 7.544H8.98472L11.5887 1.7H12.4287L9.62072 8H8.74472ZM14.9288 8.06C14.2728 8.06 13.6968 7.924 13.2008 7.652C12.7048 7.372 12.3168 6.992 12.0368 6.512C11.7568 6.024 11.6168 5.468 11.6168 4.844C11.6168 4.22 11.7488 3.668 12.0128 3.188C12.2848 2.708 12.6528 2.332 13.1168 2.06C13.5888 1.78 14.1168 1.64 14.7008 1.64C15.2928 1.64 15.8168 1.776 16.2728 2.048C16.7368 2.312 17.1008 2.688 17.3648 3.176C17.6288 3.656 17.7608 4.212 17.7608 4.844C17.7608 4.884 17.7568 4.928 17.7488 4.976C17.7488 5.016 17.7488 5.06 17.7488 5.108H12.2648V4.472H17.2928L16.9568 4.724C16.9568 4.268 16.8568 3.864 16.6568 3.512C16.4648 3.152 16.2008 2.872 15.8648 2.672C15.5288 2.472 15.1408 2.372 14.7008 2.372C14.2688 2.372 13.8808 2.472 13.5368 2.672C13.1928 2.872 12.9248 3.152 12.7328 3.512C12.5408 3.872 12.4448 4.284 12.4448 4.748V4.88C12.4448 5.36 12.5488 5.784 12.7568 6.152C12.9728 6.512 13.2688 6.796 13.6448 7.004C14.0288 7.204 14.4648 7.304 14.9528 7.304C15.3368 7.304 15.6928 7.236 16.0208 7.1C16.3568 6.964 16.6448 6.756 16.8848 6.476L17.3648 7.028C17.0848 7.364 16.7328 7.62 16.3088 7.796C15.8928 7.972 15.4328 8.06 14.9288 8.06ZM21.5227 1.64C22.0347 1.64 22.4827 1.74 22.8668 1.94C23.2587 2.132 23.5627 2.428 23.7787 2.828C24.0027 3.228 24.1147 3.732 24.1147 4.34V8H23.2627V4.424C23.2627 3.76 23.0947 3.26 22.7587 2.924C22.4307 2.58 21.9667 2.408 21.3667 2.408C20.9187 2.408 20.5267 2.5 20.1907 2.684C19.8627 2.86 19.6067 3.12 19.4227 3.464C19.2467 3.8 19.1587 4.208 19.1587 4.688V8H18.3067V1.7H19.1227V3.428L18.9907 3.104C19.1907 2.648 19.5107 2.292 19.9507 2.036C20.3907 1.772 20.9147 1.64 21.5227 1.64ZM27.2081 8.06C26.6161 8.06 26.1601 7.9 25.8401 7.58C25.5201 7.26 25.3601 6.808 25.3601 6.224V0.308H26.2121V6.176C26.2121 6.544 26.3041 6.828 26.4881 7.028C26.6801 7.228 26.9521 7.328 27.3041 7.328C27.6801 7.328 27.9921 7.22 28.2401 7.004L28.5401 7.616C28.3721 7.768 28.1681 7.88 27.9281 7.952C27.6961 8.024 27.4561 8.06 27.2081 8.06ZM24.2321 2.408V1.7H28.1321V2.408H24.2321ZM28.8911 8V1.7H29.7071V3.416L29.6231 3.116C29.7991 2.636 30.0951 2.272 30.5111 2.024C30.9271 1.768 31.4431 1.64 32.0591 1.64V2.468C32.0271 2.468 31.9951 2.468 31.9631 2.468C31.9311 2.46 31.8991 2.456 31.8671 2.456C31.2031 2.456 30.6831 2.66 30.3071 3.068C29.9311 3.468 29.7431 4.04 29.7431 4.784V8H28.8911ZM35.893 8V6.608L35.857 6.38V4.052C35.857 3.516 35.705 3.104 35.401 2.816C35.105 2.528 34.661 2.384 34.069 2.384C33.661 2.384 33.273 2.452 32.905 2.588C32.537 2.724 32.225 2.904 31.969 3.128L31.585 2.492C31.905 2.22 32.289 2.012 32.737 1.868C33.185 1.716 33.657 1.64 34.153 1.64C34.969 1.64 35.597 1.844 36.037 2.252C36.485 2.652 36.709 3.264 36.709 4.088V8H35.893ZM33.721 8.06C33.249 8.06 32.837 7.984 32.485 7.832C32.141 7.672 31.877 7.456 31.693 7.184C31.509 6.904 31.417 6.584 31.417 6.224C31.417 5.896 31.493 5.6 31.645 5.336C31.805 5.064 32.061 4.848 32.413 4.688C32.773 4.52 33.253 4.436 33.853 4.436H36.025V5.072H33.877C33.269 5.072 32.845 5.18 32.605 5.396C32.373 5.612 32.257 5.88 32.257 6.2C32.257 6.56 32.397 6.848 32.677 7.064C32.957 7.28 33.349 7.388 33.853 7.388C34.333 7.388 34.745 7.28 35.089 7.064C35.441 6.84 35.697 6.52 35.857 6.104L36.049 6.692C35.889 7.108 35.609 7.44 35.209 7.688C34.817 7.936 34.321 8.06 33.721 8.06Z"
                  fill="black"
                />
              </svg>
            </div>
          </div>
        </header>
        <section className="max-w-[1100px] mx-auto geist  py-5 ">
          <h1 className="text-center mt-10 font-[600] text-xl md:text-[30px]">
            Events
          </h1>
          <p className="text-center text-neutral-800 text-sm md:text-lg">
            Select the event you want to register to.
          </p>
          <div className="event-list flex flex-col gap-5 mt-5">
            {events.length === 0 ? (
              <h1 className="text-center ">Sorry, there are no events yet.</h1>
            ) : (
              events.map((d, i) => {
                return (
                  <>
                    <div className="event flex flex-col md:flex-row gap-1 md:gap-[20px] bg-white rounded-lg shadow-sm shadow-neutral-100 overflow-hidden">
                      <div className="ev-image aspect-video w-[100%] md:w-[50%] bg-red-200 relative shrink-0">
                        <img
                          src={d.coverFile}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <div className="tag absolute top-[20px] left-[20px]"></div>
                      </div>
                      <div className="ev-inf flex justify-between flex-col py-5 px-3">
                        <div>
                          {/* {d.atendeeCount !== 0 && (
                            <div className="tag flex items-center gap-2 bg-emerald-100 text-emerald-600 border-1 border-emerald-600 w-max px-4 py-1 text-xs rounded-full font-[500]">
                              <Users size="15px" /> {d.atendeeCount}{" "}
                              {d.atendeeCount > 1 ? "people" : "person"} already
                              registered
                            </div>
                          )}

                          {d.atendeeCount === 0 && (
                            <div className="tag flex items-center gap-2 bg-red-100 text-red-600 border-1 border-red-600 w-max px-4 py-1 text-xs rounded-full font-[500]">
                              No one has registered yet.
                            </div>
                          )} */}
                          <h1 className="font-[600] text-xl md:text-2xl mt-1">
                            {d.name}
                          </h1>
                          <p className="text-neutral-900 text-sm md:text-base">
                            Malaysian Palm Oil Council • {d.location}
                          </p>
                          <p className="description text-neutral-800 text-sm max-h-32 overflow-hidden line-clamp-3 ">
                            {d.description}
                          </p>
                          <div className="tags text-neutral-700 flex gap-4 items-center flex-wrap mt-5 text-xs md:text-sm">
                            <div className="tag flex items-center gap-2">
                              <Calendar size="15px" />{" "}
                              {moment
                                .unix(d.date)
                                .utcOffset(d.offsetT * -1)
                                .format("MMM DD, YYYY")}
                            </div>
                            <div className="tag flex items-center gap-2">
                              <Clock size="15px" />{" "}
                              {moment
                                .unix(d.startT)
                                .utcOffset(d.offsetT * -1)
                                .format("hh:mm A")}{" "}
                              -{" "}
                              {moment
                                .unix(d.endT)
                                .utcOffset(d.offsetT * -1)
                                .format("hh:mm A")}{" "}
                              (GMT{(d.offsetT * -1) / 60 > 0 ? "+" : ""}
                              {(d.offsetT * -1) / 60})
                            </div>
                            {/* <div className="tag flex items-center gap-2">
                              <Users size="15px" /> Capacity: {d.atendeeLim}{" "}
                              person
                              {d.atendeeLim > 1 ? "s" : ""}
                            </div> */}
                          </div>
                        </div>
                        <div className="mt-10 md:mt-0">
                          {d.atendeeLim <= d.atendeeCount ? (
                            <button className="text-red-600 font-[500] text-sm flex items-center gap-3 cursor-not-allowed">
                              <X size="17px" strokeWidth={3} />
                              Event is full.
                            </button>
                          ) : !d.registrationEnded ? (
                            <button
                              onClick={() => handleRegisterForEvent(i)}
                              className="hover:text-black font-[500] text-sm flex items-center gap-3 text-neutral-700"
                            >
                              <ArrowRight size="17px" strokeWidth={3} />
                              Register to this event
                            </button>
                          ) : (
                            <button className="text-red-600 font-[500] text-sm flex items-center gap-3 cursor-not-allowed">
                              <X size="17px" strokeWidth={3} />
                              Registration has ended.
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                );
              })
            )}
          </div>
        </section>
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
                  <div className="image h-[250px] w-full bg-red-50 relative">
                    <img
                      src={currentEventReg.coverFile}
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
                          .format("MMM DD, YYYY")}
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
                        req
                      />

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
                        />
                      </div>
                      <TextInput
                        identifier="diet"
                        title="Dietary Requirements"
                        value={registrationForm.diet.value}
                        placeholder="Please state any dietary requirements, allergies, etc."
                        onInput={(dx) =>
                          setRegistrationForm((pv) => ({
                            ...pv,
                            diet: { value: dx, err: "" },
                          }))
                        }
                        error={registrationForm.diet.err}
                        req
                      />
                      <HCaptcha
                        sitekey="f69ac368-e8b8-4074-8166-fd7a3f4a53de"
                        onLoad={onLoad}
                        onVerify={setHCaptchaToken}
                        ref={captchaRef}
                      />
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
                            className="flex gap-2 items-center bg-black text-white py-1.5 px-4 text-sm rounded-md hover:bg-neutral-900"
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
