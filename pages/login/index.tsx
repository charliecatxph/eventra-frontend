import { appUpdate } from "@/features/appSlice";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { XCircle } from "lucide-react";
import { useRouter } from "next/router";
import { FormEvent, FormEventHandler, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import z from "zod";
import jwt from "jsonwebtoken";
import { redirectIfAuthenticated } from "@/hooks/RedirectIfAuthenticated";
import Head from "next/head";

type FieldValueWithError = {
  value: string;
  err: string;
};

interface LoginForm {
  email: FieldValueWithError;
  password: FieldValueWithError;
}

interface UserJWTPayload {
  fn: string;
  ln: string;
  email: string;
  org_name: string;
  country: string;
  website: string;
  logo: string;
  id: string;
}

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: {
      value: "",
      err: "",
    },
    password: {
      value: "",
      err: "",
    },
  });

  const [loggingIn, setLoggingIn] = useState<boolean>(false);
  const [serverResponseError, setServerResponseError] = useState<string>("");

  const emailSchema = z.string().trim().toLowerCase().email("Invalid E-Mail.");
  const handleSubmitLoginForm = async (e: FormEvent) => {
    e.preventDefault();
    setServerResponseError("");
    try {
      const emailVerif = await emailSchema.parseAsync(loginForm.email.value);

      if (loginForm.password.value.length === 0)
        return setLoginForm((pv) => ({
          ...pv,
          password: { ...pv.password, err: "Enter a password." },
        }));

      setLoggingIn(true);
      const req = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/login`,
        {
          data: JSON.stringify({
            email: emailVerif,
            pw: loginForm.password.value,
          }),
        },
        { withCredentials: true }
      );
      setLoggingIn(false);
      const decoded = jwt.decode(req.data.token) as UserJWTPayload;

      dispatch(
        appUpdate({
          fn: decoded.fn,
          ln: decoded.ln,
          email: decoded.email,
          org_name: decoded.org_name,
          country: decoded.country,
          website: decoded.website,
          logo: decoded.logo,
          acsTok: req.data.token,
          id: decoded.id,
        })
      );

      router.push("/dashboard");
    } catch (e) {
      if (e instanceof z.ZodError) {
        setLoginForm((pv) => ({
          ...pv,
          email: {
            ...pv.email,
            err: e.errors[0].message,
          },
        }));
      }

      if (axios.isAxiosError(e)) {
        if (!e.response) {
          setServerResponseError("No internet.");
        } else {
          setServerResponseError(e.response.data.err);
        }
      }
      setLoggingIn(false);
    }
  };

  // assume true
  const isAuthenticated = redirectIfAuthenticated();
  if (isAuthenticated) return <></>;

  return (
    <>
      <Head>
        <title>Eventra | Login </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen flex bg-[#212121] text-white">
        <section className="geist flex flex-1 w-1/2 items-center min-h-screen px-10">
          <div className="max-w-[600px] mx-auto h-max">
            <div className="flex flex-col items-start">
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
              <h1 className="mt-5 font-[700] text-2xl">
                Sign in to your account
              </h1>
              <p className="mt-2 text-neutral-300">
                An event management system designed for the purpose of business
                expansion.
              </p>
            </div>
            <form
              noValidate
              onSubmit={handleSubmitLoginForm}
              className="mt-5 flex flex-col gap-5"
            >
              <AnimatePresence>
                {serverResponseError && (
                  <motion.div
                    key={1}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="err bg-red-600 text-sm font-[600] rounded-md py-1.5 w-full"
                  >
                    <p className="text-center">{serverResponseError}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label htmlFor="email" className="font-[600] ">
                  E-Mail
                </label>
                <input
                  value={loginForm.email.value}
                  onInput={(e) => {
                    setLoginForm((pv) => ({
                      ...pv,
                      email: {
                        value: (e.target as HTMLInputElement).value,
                        err: "",
                      },
                    }));
                  }}
                  name="email"
                  type="email"
                  className="text-white bg-neutral-900 mt-1.5 w-full border-1 rounded-lg py-1.5 px-3 border-neutral-600 outline-neutral-400 outline-offset-4"
                />
                <AnimatePresence>
                  {loginForm.email.err && (
                    <motion.div
                      key={1}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="err flex items-center gap-2 text-red-300 text-sm mt-1 font-[600]"
                    >
                      <XCircle size={15} /> {loginForm.email.err}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div>
                <label htmlFor="password" className="font-[600] ">
                  Password
                </label>
                <input
                  value={loginForm.password.value}
                  onInput={(e) => {
                    setLoginForm((pv) => ({
                      ...pv,
                      password: {
                        value: (e.target as HTMLInputElement).value,
                        err: "",
                      },
                    }));
                  }}
                  name="password"
                  type="password"
                  className="text-white bg-neutral-900 mt-1.5 w-full border-1 rounded-lg py-1.5 px-3 border-neutral-600 outline-neutral-400 outline-offset-4"
                />
                <AnimatePresence>
                  {loginForm.password.err && (
                    <motion.div
                      key={1}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="err flex items-center gap-2 text-red-300 text-sm mt-1 font-[600]"
                    >
                      <XCircle size={15} /> {loginForm.password.err}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {!loggingIn && (
                <button
                  type="submit"
                  className="w-max px-5 bg-white hover:bg-neutral-200 text-black  border-neutral-600 border-1 py-1.5 rounded-md font-[600]"
                >
                  Log In
                </button>
              )}
              {loggingIn && (
                <button
                  type="submit"
                  className="flex gap-3 items-center w-max px-5 bg-neutral-700 text-white  border-neutral-600 border-1 py-1.5 rounded-md font-[600]"
                >
                  <CircularProgress
                    size={15}
                    thickness={5}
                    disableShrink
                    sx={{
                      color: "white", // spinner stroke
                    }}
                  />
                  Logging in...
                </button>
              )}
            </form>
          </div>
        </section>
        <div className="w-1/2 flex-1 h-screen overflow-hidden">
          <img
            src="/assets/loginbg.webp"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </main>
    </>
  );
}
