import { Atendee } from "@/interfaces/Interface";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { TriangleAlert } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DigitalID() {
  const router = useRouter();
  const [fetching, setFetching] = useState<boolean>(true);
  const [success, setSuccess] = useState<boolean>(false);
  const [animateStage, setAnimateStage] = useState<number>(1);
  const [user, setUser] = useState<Atendee>();

  const fetchData = async () => {
    setFetching(true);
    setTimeout(async () => {
      setAnimateStage(2);
      try {
        const req = await axios
          .post(`${process.env.NEXT_PUBLIC_API}/get-ordAttendee-data`, {
            atnId: router.query.user || "",
          })
          .catch((e) => {
            throw new Error("");
          });
        setSuccess(true);
        setUser({
          ...req.data.data,
        });
      } catch (e) {
        setSuccess(false);
      } finally {
        setFetching(false);
      }
    }, 1000);
  };

  const downloadVCard = ({
    name,
    orgN,
    orgP,
    phoneNumber,
    email,
  }: Partial<Atendee>) => {
    const vcardData = `
  BEGIN:VCARD
  VERSION:3.0
  FN:${name}
  ORG:${orgN}
  TITLE:${orgP}
  TEL;TYPE=WORK,VOICE:${phoneNumber}
  EMAIL:${email}
  END:VCARD
    `.trim();

    const blob = new Blob([vcardData], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${name.replace(/\s+/g, "_")}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (!router.query.user) return;
    fetchData();
  }, [router.query.user]);

  if (fetching) {
    return (
      <>
        <Head>
          <title>Eventra | Digital ID</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="h-screen w-screen grid place-content-center">
          <AnimatePresence>
            {animateStage === 1 && (
              <motion.div
                initial={{ scale: 0.9, y: 30, opacity: 0 }}
                animate={{
                  scale: 1,
                  y: 0,
                  opacity: 1,
                }}
                exit={{ scale: 0.9, y: -30, opacity: 0 }}
                transition={{ ease: "circOut" }}
                key={1}
                className="flex gap-5 items-center geist font-[600]"
              >
                <p className="flex gap-2 font-[600] items-center text-xs  mt-3">
                  <span className="font-[400]">Powered by </span>
                  <img src="/favicon-32x32.png" className="w-[20px] h-[20px]" />
                  Eventra Events
                </p>
              </motion.div>
            )}
            {animateStage === 2 && (
              <motion.div
                initial={{ scale: 0.9, y: 30, opacity: 0 }}
                animate={{
                  scale: 1,
                  y: 0,
                  opacity: 1,
                }}
                exit={{ scale: 0.9, y: -30, opacity: 0 }}
                transition={{ ease: "circOut", delay: 0.5 }}
                key={2}
                className="flex gap-5 items-center geist font-[600]"
              >
                <CircularProgress
                  size={18}
                  thickness={7}
                  disableShrink
                  sx={{
                    color: "black", // spinner stroke
                  }}
                />
                <p>Searching atendee...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </>
    );
  }

  if (!fetching && !success) {
    return (
      <main className="h-screen w-screen grid place-content-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: "circOut" }}
          className="flex flex-col items-center geist "
        >
          <TriangleAlert color="red" />
          <p className="flex gap-2 font-[600] items-center text-sm  mt-3 text-center">
            Atendee Not Found
          </p>
          <p className="text-xs pt-1 text-neutral-900 text-center">
            Atendee might not be registered to an event or has not been
            validated yet.
          </p>
        </motion.div>
      </main>
    );
  }

  if (!fetching && success) {
    return (
      <div className="px-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: "circOut" }}
          className="geist shadow-sm shadow-neutral-50 overflow-hidden mx-auto max-w-[500px] w-full mt-10 border-1 border-neutral-200 rounded-md"
        >
          <div className="flex gap-5 items-start p-5 bg-slate-50">
            <img
              src="/assets/petals.png"
              alt=""
              className="w-[50px] h-[50px]"
            />
            <div>
              <h1 className="font-[600] text-xl">
                Malaysian Palm Oil Forum 2025
              </h1>
              <p className="text-sm">June 3-4, DUSIT Thani Manila</p>
            </div>
          </div>
          <div className="h-[400px] grid place-content-center">
            <div className="flex flex-col items-center gap-1 mt-5 p-5">
              <p className="font-[500]">Hello! I'm,</p>
              <h1 className="text-3xl font-[700] text-center">{user?.name}</h1>
              <p className="text-xl font-[500] text-center">{user?.orgN}</p>
              <p className="text-base text-center">{user?.orgP}</p>
              <p className="text-center">{user?.email}</p>
              <p className="text-sm text-center">{user?.phoneNumber}</p>
            </div>
          </div>
          <div className="flex gap-5 items-start p-5 ">
            <button
              onClick={() =>
                downloadVCard({
                  name: user?.name || "",
                  orgN: user?.orgN || "",
                  orgP: user?.orgP || "",
                  phoneNumber: user?.phoneNumber || "",
                  email: user?.email || "",
                })
              }
              className="px-5 py-3 hover:bg-neutral-800 bg-neutral-900 text-white font-[600] w-full rounded-lg text-sm"
            >
              Download My Contact (.vcf)
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.5 } }}
          transition={{ ease: "circOut" }}
          className="mx-auto geist mt-5 flex flex-col gap-1 items-center"
        >
          <p className="text-neutral-600 font-[600] text-sm text-center">
            This ID is only valid throughout the event.
          </p>
          <p className="text-neutral-600 font-[400] text-sm pt-[4px] text-center">
            Scan another atendee's QR code to get their information.
          </p>
          <Link href="https://facebook.com/ctxsoftwaresphilippines">
            <p className="flex gap-2 font-[500] items-center text-xs text-neutral-600 mt-3">
              Powered by{" "}
              <img src="/favicon-32x32.png" className="w-[20px] h-[20px]" />
              Eventra Events
            </p>
          </Link>
        </motion.div>
      </div>
    );
  }
}
