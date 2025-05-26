"use client";
import moment from "moment";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectApp } from "@/features/appSlice";
import { io, Socket } from "socket.io-client";
import { countriesKV } from "@/lib/constants/countries";
import { useSecureRoute } from "@/hooks/UseSecureRoute";
import Head from "next/head";
import { useModal } from "@/components/Modal/ModalContext";
import { TriangleAlert } from "lucide-react";

interface Announcement {
  message: string;
  data: {
    logo: string;
    country: string;
    status: boolean;
    name: string;
    location: string;
  };
}

interface Supplier {
  bizmatcheventId: any;
  id: string;
  name: string;
  country: string;
  location: string;
  logoSecUrl: string;
  status: {
    isOpen: boolean;
    representedBy: string;
    orgN?: string;
  };
}

const announcements: Announcement[] = [];

export default function LiveBzDisplay() {
  const modal = useModal();
  const router = useRouter();
  const appData = useSelector(selectApp);
  const socketRef = useRef<Socket>(null);

  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Announcement>(
    announcements[0]
  );
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isSpeakingRef = useRef(false);

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [begin, setBegin] = useState<boolean>(false);

  const { bzId } = router.query;

  const speakAnnouncement = async (announcement: Announcement) => {
    const audio = new Audio("/assets/notification.mp3");
    await audio.play();

    await new Promise((res, rej) => setTimeout(() => res(""), 500));

    window.speechSynthesis.cancel();
    const text = `${announcement.data.name} is now ${
      announcement.data.status ? "OPEN" : "CLOSED"
    } at ${announcement.data.location}`;
    const utterance = new SpeechSynthesisUtterance(text);

    const voices = window.speechSynthesis.getVoices();

    const selectedVoice =
      voices.find(
        (voice) =>
          voice.lang === "en-GB" && voice.name.toLowerCase().includes("male")
      ) ||
      voices.find((voice) => voice.lang === "en-GB") ||
      voices.find((voice) => voice.lang.startsWith("en"));

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      console.log("Speech started for:", text);
      isSpeakingRef.current = true;
    };

    utterance.onend = () => {
      console.log("Speech completed for:", text);
      isSpeakingRef.current = false;
      setShowAnnouncement(false);
    };

    utterance.onerror = (event) => {
      console.error("Speech error:", {
        error: event.error,
        text: text,
        elapsedTime: event.elapsedTime,
        name: event.name,
      });
      isSpeakingRef.current = false;
    };

    utterance.onpause = () => {
      console.log("Speech paused for:", text);
    };

    utterance.onresume = () => {
      console.log("Speech resumed for:", text);
    };

    utterance.onmark = (event) => {
      console.log("Speech mark reached:", event.name);
    };

    utterance.onboundary = (event) => {
      console.log("Speech boundary reached:", {
        name: event.name,
        elapsedTime: event.elapsedTime,
        charIndex: event.charIndex,
      });
    };

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const queueRef = useRef<Announcement[]>([]);
  const isProcessing = useRef(false);

  const processQueue = async () => {
    if (isProcessing.current || queueRef.current.length === 0) return;

    isProcessing.current = true;

    const next = queueRef.current.shift();
    if (next) {
      setCurrentAnnouncement(next);
      setShowAnnouncement(true);
      await speakAnnouncement(next);
    }

    setTimeout(() => {
      isProcessing.current = false;
      processQueue(); // 🔁 continue to the next item
    }, 11000); // 11s gap between announcements
  };

  const fetchSupplierData = async (bzId: string) => {
    try {
      const req = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/get-bz-live-announcements`,
        {
          bzId: bzId.trim(),
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${appData.acsTok}`,
          },
        }
      );
      setSuppliers([...req.data.data]);

      if (req.data.data.length === 0) {
        router.push(`/view-bz-event/${router.query.bzId}`);
        modal.show({
          type: "std",
          title: "Live Display Error",
          description: "You don't have any suppliers set.",
          icon: <TriangleAlert />,
          onConfirm: () => {
            modal.hide();
          },
          confirmText: "Okay",
          color: "error",
        });
        return;
      }

      if (!socketRef.current) {
        socketRef.current = io(process.env.NEXT_PUBLIC_IO, {
          withCredentials: true,
        });
      }
    } catch (e) {
      router.push("/dashboard");
    }
  };

  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on("connect", () => {
      console.log("Connected to server:", socketRef.current.id);

      console.log(suppliers.length);

      socketRef.current.emit("identify", {
        type: "EVN-BZ-DISPLAY",
        bzId: suppliers[0].bizmatcheventId,
      });
    });
    socketRef.current.on("WS-EVN_BIZ_SUPPLIER_UPDATE", () => {
      fetchSupplierData(bzId as string);
    });

    socketRef.current.on("WS-EVN_BIZ_ATTENDEE_CHANGED", () => {
      fetchSupplierData(bzId as string);
    });

    socketRef.current.on("WS-EVN_BIZ_ANNOUNCE", (dx) => {
      queueRef.current.push(dx);
      processQueue();
    });
  }, [socketRef.current]);

  useEffect(() => {
    if (!bzId || !begin) return;
    fetchSupplierData(bzId as string);

    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        const loadedVoices = window.speechSynthesis.getVoices();
        console.log("Voices loaded:", loadedVoices.length);
        console.log(
          "Available voices:",
          loadedVoices.map((v) => `${v.name} (${v.lang})`)
        );
      };
    } else {
      console.log(
        "Initial voices:",
        voices.map((v) => `${v.name} (${v.lang})`)
      );
    }

    const initializeWorker = () => {
      try {
        const worker = new Worker(
          new URL("../workers/timeWorker.ts", import.meta.url)
        );

        worker.onmessage = (e) => {
          setCurrentTime(e.data);
        };

        worker.onerror = (error) => {
          console.error("Worker error:", error);
          setCurrentTime("Error: Worker failed");
          if (workerRef.current) {
            workerRef.current.terminate();
            workerRef.current = null;
            setTimeout(initializeWorker, 1000);
          }
        };

        worker.postMessage("start");
        workerRef.current = worker;
      } catch (error) {
        console.error("Failed to initialize worker:", error);
        setCurrentTime("Error: Failed to initialize");
        setTimeout(initializeWorker, 1000);
      }
    };

    initializeWorker();

    return () => {
      if (workerRef.current) {
        workerRef.current.postMessage("stop");
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, [bzId, begin]);

  // Cleanup socket connection on component unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const [render, setRender] = useState<boolean>(false);
  useSecureRoute(() => {
    setRender(true);
  });

  if (!render) return <></>;

  return (
    <>
      <Head>
        <title>Eventra | Live Display ({router.query.bzId})</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {begin && (
        <div>
          <div className="bg-[#212121] min-h-screen">
            <div className="px-15 py-10 text-white text-[50px] flex justify-between items-center font-[600]">
              <h1 className="flex items-center gap-10">
                <img src="/assets/petals.png" /> Malaysian Palm Oil Forum
                Philippines 2025
              </h1>
              <p>
                {currentTime
                  ? moment.unix(Number(currentTime)).format("hh:mm:ss A")
                  : "Initializing..."}
              </p>
            </div>

            <table className="w-full table-fixed">
              <tbody>
                {suppliers.map((d, i) => {
                  return (
                    <tr
                      key={`${d.name}-${d.country}`}
                      className="border-b border-gray-700"
                    >
                      <td className="py-6 pl-15 w-[200px] bg-[#2a2a2a]">
                        <div className="rounded-full size-[150px] overflow-hidden">
                          <img
                            src={d.logoSecUrl}
                            alt=""
                            className="w-full h-full"
                          />
                        </div>
                      </td>
                      <td className="py-6 px-15 w-[1000px] bg-[#2a2a2a] ">
                        <span className="text-[50px] font-[700] block truncate text-white">
                          {d.name}
                        </span>
                        <span className="text-[40px] font-[500] block text-gray-300">
                          {countriesKV[d.country]}
                        </span>
                      </td>
                      <td className="py-6 px-4 text-[40px] bg-[#2a2a2a] text-white text-center font-[600] ">
                        {d.location}
                      </td>
                      <td className="py-6 px-4 text-[40px] bg-[#2a2a2a] text-white ">
                        <span className="text-[40px] font-[700] block truncate text-white">
                          {d.status.orgN || "Not in a meeeting."}
                        </span>
                        <span className="text-[30px] font-[500] block text-gray-300">
                          {d.status.representedBy || "-"}
                        </span>
                      </td>
                      <td className="py-6 px-4 bg-[#2a2a2a] ">
                        {d.status.isOpen ? (
                          <span className="block w-max mx-auto px-6 py-2 rounded-full text-[32px] font-medium bg-emerald-500/20 text-emerald-400">
                            Open
                          </span>
                        ) : (
                          <span className="block w-max mx-auto px-6 py-2 rounded-full text-[32px] font-medium bg-red-500/20 text-red-400">
                            Closed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <AnimatePresence mode="wait">
            {showAnnouncement && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="top-0 left-0 fixed min-h-screen w-full z-[99999] bg-neutral-900/90 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    delay: 0.3,
                  }}
                  className="h-[800px] bg-[#212121] w-full fixed bottom-0 text-white p-20 flex flex-col"
                >
                  <div className="flex-1 flex items-start gap-20">
                    <div className="flex-1">
                      <h1 className="text-[90px] font-[700] leading-[1.1]">
                        {currentAnnouncement.data.name}
                        <span className="font-[500] text-[70px] block text-gray-300 mt-2">
                          {countriesKV[currentAnnouncement.data.country]}
                        </span>
                        <span className="font-[500] text-[70px] block text-gray-300 mt-2">
                          {currentAnnouncement.data.location}
                        </span>
                      </h1>
                    </div>

                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="w-[300px] h-[300px] bg-gradient-to-br overflow-hidden from-emerald-500/20 to-emerald-500/5 rounded-2xl border border-emerald-500/20 flex items-center justify-center"
                    >
                      <img
                        src={currentAnnouncement.data.logo}
                        alt=""
                        className="h-full w-full"
                      />
                    </motion.div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-800 pt-10">
                    <div className="text-gray-400 text-2xl">
                      Last Updated:{" "}
                      {currentTime
                        ? moment
                            .unix(Number(currentTime))
                            .format("MMMM D, YYYY hh:mm:ss A")
                        : "Initializing..."}
                    </div>
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className={`inline-flex items-center px-20 py-6 rounded-full text-[130px] font-[500] ${
                        currentAnnouncement.data.status
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {currentAnnouncement.data.status ? "OPEN" : "CLOSED"}
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {!begin && (
        <div className="h-screen w-screen grid place-content-center bg-[#212121] text-white">
          <div className="flex justify-center">
            <svg
              width="30"
              height="26"
              viewBox="0 0 30 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <ellipse cx="13" cy="9.5" rx="9" ry="9.5" fill="#F11716" />
              <circle cx="20.5" cy="13.5" r="9.5" fill="#FDD21A" />
              <circle cx="9.5" cy="16.5" r="9.5" fill="#AA2AD4" />
            </svg>
          </div>
          <button
            onClick={() => setBegin(true)}
            className="mt-10 bg-emerald-700 px-7 py-2 rounded-md font-[700]"
          >
            Start BizMatch Live Display
          </button>
        </div>
      )}
    </>
  );
}
