import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import {
  Briefcase,
  Clock,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Printer,
  QrCodeIcon,
  User,
  X,
} from "lucide-react";
import { CircularProgress } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectApp } from "@/features/appSlice";
import { printQR } from "@/components/ViewEv_Deps/printQr";
import moment from "moment";

interface QRDeps {
  ev: string;
  active: boolean;
  onExit: () => void;
  onSuccessPulse: () => void;
  onFailPulse: () => void;
}

export default function QRCode({
  ev,
  active,
  onExit,
  onSuccessPulse,
  onFailPulse,
}: QRDeps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [decodedData, setDecodedData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const appData = useSelector(selectApp);

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

  const [qrCodeComponent, setQrCodeComponent] = useState<any>({
    qr: false,
    text: "",
    fetching: false,
    success: false,
    complete: false,
  });

  // We'll store the stream in a ref so we can stop it later
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!qrCodeComponent.qr) return;

    const getCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        streamRef.current = stream;

        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          video.onloadedmetadata = () => {
            video.play();
            setIsReady(true);
          };
        }
      } catch (err) {
        setError("Camera access denied or not available.");
      }
    };

    getCamera();

    // Cleanup: stop all media tracks on unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [qrCodeComponent.qr]);

  useEffect(() => {
    if (!active) return;
    setQrCodeComponent((pv) => ({
      ...pv,
      qr: true,
    }));

    return () => {
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

      setQrCodeComponent({
        qr: false,
        text: "",
        fetching: false,
        success: false,
        complete: false,
      });

      setDecodedData("");
    };
  }, [active]);

  useEffect(() => {
    if (!isReady) return;

    const interval = setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (
        !video ||
        !canvas ||
        video.videoWidth === 0 ||
        video.videoHeight === 0
      )
        return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        setDecodedData(code.data);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [isReady]);

  const handleQrRecognition = async (id: string) => {
    setQrCodeComponent((pv) => ({
      ...pv,
      qr: false,
      fetching: true,
      text: "Searching atendee...",
    }));

    try {
      const rx = await axios
        .post(
          `${process.env.NEXT_PUBLIC_API}/update-atendee-org`,
          { id: id, data: { attended: true } },
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

      setTimeout(() => {
        setQrCodeComponent((pv) => ({
          ...pv,
          qr: false,
          fetching: false,
          success: false,
          complete: true,
          text: "Atendee found.",
        }));
        setViewAtendee({
          active: true,
          attended: true,
          name: rx.data.data.name,
          orgN: rx.data.data.orgN,
          orgP: rx.data.data.orgP,
          email: rx.data.data.email,
          number: rx.data.data.phoneNumber,
          addr: rx.data.data.addr,
          salutation: rx.data.data.salutations,
          registeredOn: rx.data.data.registeredOn,
          id: rx.data.data.id,
        });
        onSuccessPulse();
      }, 200);
    } catch (e) {
      onFailPulse();
      setQrCodeComponent((pv) => ({
        ...pv,

        text: e.message,
        fetching: false,
        success: false,
        complete: true,
      }));
    }
  };

  useEffect(() => {
    if (!decodedData) return;
    handleQrRecognition(decodedData || "");
  }, [decodedData]);

  return (
    <AnimatePresence>
      {active && (
        <>
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
                    <h1 className=" font-[500]">Atendee Logged</h1>
                    <div
                      className="p-2 rounded-full w-max cursor-pointer"
                      onClick={() => {
                        onExit && onExit();
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
                      {viewAtendee.addr || ""}
                    </p>
                    <p className="text-sm text-neutral-900 flex gap-2 items-center">
                      <User size="15px" />
                      Salutation: {viewAtendee.salutation}
                    </p>
                    <p className="text-sm text-neutral-900 flex gap-2 items-center">
                      <Clock size="15px" />
                      Registered at:{" "}
                      {moment
                        .unix(viewAtendee.registeredOn)
                        .format("MMM DD, YYYY - hh:mm:ss A")}
                    </p>
                  </div>
                  <div className="px-5 py-4 flex gap-2">
                    <button
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

                        setQrCodeComponent({
                          qr: true,
                          text: "",
                          fetching: false,
                          success: false,
                          complete: false,
                        });

                        setDecodedData("");
                      }}
                      className="px-5 text-black border-1 hover:bg-neutral-50 border-neutral-100 w-1/2 flex gap-2 items-center justify-center py-1.5 rounded-md text-sm"
                    >
                      <QrCodeIcon
                        size="12px"
                        strokeWidth={3}
                        className="shrink-0"
                      />{" "}
                      Scan Another
                    </button>
                    <button
                      onClick={() => {
                        printQR({
                          eventName: ev,
                          attendeeName: viewAtendee.name,
                          organization: viewAtendee.orgN,
                          position: viewAtendee.orgP,
                          identifier: viewAtendee.id,
                        });
                      }}
                      className="px-5 bg-emerald-600 text-white w-1/2 flex gap-2 items-center justify-center py-1.5 rounded-md text-sm"
                    >
                      <Printer
                        size="12px"
                        strokeWidth={3}
                        className="shrink-0"
                      />{" "}
                      Print Passport
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
          {!viewAtendee.active && (
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
                  className="form w-full max-w-[400px] bg-white rounded-xl overflow-hidden p-5"
                >
                  <div className="flex justify-between items-center mb-5 ">
                    <h1 className="text-center font-[500] flex gap-2 items-center">
                      <QrCodeIcon size="15px" />
                      Scan E-Mail QR
                    </h1>
                    <X size="15px" onClick={() => onExit && onExit()} />
                  </div>
                  {!qrCodeComponent.complete && (
                    <>
                      {!qrCodeComponent.fetching && qrCodeComponent.qr && (
                        <div className="flex flex-col items-center gap-4">
                          <video
                            ref={videoRef}
                            className="w-full rounded shadow"
                            playsInline
                            muted
                          />
                          <canvas ref={canvasRef} className="hidden" />
                          {error && (
                            <div className="text-red-500 text-sm">
                              <strong>Error:</strong> {error}
                            </div>
                          )}
                        </div>
                      )}

                      {qrCodeComponent.fetching ? (
                        <>
                          <p className="flex justify-center items-center gap-2">
                            <CircularProgress
                              size={15}
                              thickness={5}
                              disableShrink
                              sx={{
                                color: "black", // spinner stroke
                              }}
                            />
                            Searching atendee...
                          </p>
                        </>
                      ) : (
                        <p className="mt-5 text-center text-neutral-600">
                          Please approach a QR to the camera.
                        </p>
                      )}
                    </>
                  )}

                  {qrCodeComponent.complete && !qrCodeComponent.success && (
                    <>
                      <div className="h-[100px] grid place-content-center">
                        <p className="text-center">{qrCodeComponent.text}</p>
                      </div>
                    </>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
