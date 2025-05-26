import { AnimatePresence, motion } from "framer-motion";
import TextInput from "@/components/Inputs/TextInput";
import {
  bizmatchSlice,
  resetLoginFormData,
  setLoginFormData,
  setMode,
  setProcessing,
  setServerResponseError,
  setSupplierAccount,
  setUser,
  setUserType,
} from "@/features/attendBizmatchSlice";
import PasswordInput from "@/components/Inputs/PasswordInput";
import { CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import z from "zod";
import axios from "axios";
import { useEffect } from "react";
import jwt from "jsonwebtoken";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const bizData = useSelector(bizmatchSlice);

  const registerFunction = async () => {
    const emailSchema = z
      .string()
      .trim()
      .toLowerCase()
      .email("Invalid E-Mail.");
    dispatch(setServerResponseError(""));
    try {
      const emailVerif = await emailSchema.parseAsync(
        bizData.form.data.email.value
      );

      if (bizData.form.data.pw.value.length === 0) {
        return dispatch(
          setLoginFormData({
            ...bizData.form.data,
            pw: {
              ...bizData.form.data.pw,
              err: "Enter a password.",
            },
          })
        );
      }
      if (bizData.form.data.name.value.trim() === "") {
        return dispatch(
          setLoginFormData({
            ...bizData.form.data,
            name: {
              ...bizData.form.data.name,
              err: "Enter a name.",
            },
          })
        );
      }

      if (bizData.form.data.orgN.value.trim() === "") {
        return dispatch(
          setLoginFormData({
            ...bizData.form.data,
            orgN: {
              ...bizData.form.data.orgN,
              err: "Enter a organization name.",
            },
          })
        );
      }

      if (bizData.form.data.orgP.value.trim() === "") {
        return dispatch(
          setLoginFormData({
            ...bizData.form.data,
            orgP: {
              ...bizData.form.data.orgP,
              err: "Enter a organization position.",
            },
          })
        );
      }

      dispatch(setProcessing(true));

      const bzid = process.env.NEXT_PUBLIC_BZID;

      const req = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/registrant-register-biz`,
        {
          name: bizData.form.data.name.value,
          orgN: bizData.form.data.orgN.value,
          orgP: bizData.form.data.orgP.value,
          email: emailVerif,
          pw: bizData.form.data.pw.value,
          bzId: bzid,
        },
        { withCredentials: true }
      );

      dispatch(setProcessing(false));
      const decode = jwt.decode(req.data.token);
      dispatch(
        setUser({
          isLoggedIn: true,
          id: decode.id,
          bizmatcheventId: decode.bizmatcheventId,
          name: decode.name,
          orgN: decode.orgN,
          orgP: decode.orgP,
          email: decode.email,
          acsTok: req.data.token,
        })
      );
      dispatch(setUserType("client"));
    } catch (e) {
      if (e instanceof z.ZodError) {
        dispatch(
          setLoginFormData({
            ...bizData.form.data,
            email: {
              ...bizData.form.data.email,
              err: e.errors[0].message,
            },
          })
        );
      }

      if (axios.isAxiosError(e)) {
        if (!e.response) {
          dispatch(setServerResponseError("No internet."));
        } else {
          dispatch(setServerResponseError(e.response.data.err));
        }
      }
      dispatch(setProcessing(false));
    }
  };

  const loginFunction = async () => {
    const emailSchema = z
      .string()
      .trim()
      .toLowerCase()
      .email("Invalid E-Mail.");
    dispatch(setServerResponseError(""));
    try {
      const emailVerif = await emailSchema.parseAsync(
        bizData.form.data.email.value
      );

      if (bizData.form.data.pw.value.length === 0) {
        return dispatch(
          setLoginFormData({
            ...bizData.form.data,
            pw: {
              ...bizData.form.data.pw,
              err: "Enter a password.",
            },
          })
        );
      }
      dispatch(setProcessing(true));
      const req = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/login-client-biz`,
        { email: emailVerif, pw: bizData.form.data.pw.value },
        { withCredentials: true }
      );

      const decode = jwt.decode(req.data.token);

      dispatch(
        setUser({
          isLoggedIn: true,
          id: decode.id,
          bizmatcheventId: decode.bizmatcheventId,
          name: decode.name,
          orgN: decode.orgN,
          orgP: decode.orgP,
          email: decode.email,
          acsTok: req.data.token,
        })
      );
      dispatch(setUserType("client"));
      dispatch(setProcessing(false));
    } catch (e) {
      if (e instanceof z.ZodError) {
        dispatch(
          setLoginFormData({
            ...bizData.form.data,
            email: {
              ...bizData.form.data.email,
              err: e.errors[0].message,
            },
          })
        );
      }
      if (axios.isAxiosError(e)) {
        if (!e.response) {
          dispatch(setServerResponseError("No internet."));
        } else {
          dispatch(setServerResponseError(e.response.data.err));
        }
      }
      dispatch(setProcessing(false));
    }
  };

  const supplierLoginFunction = async () => {
    dispatch(setServerResponseError(""));
    try {
      if (bizData.form.data.email.value.trim() === "") {
        return dispatch(
          setLoginFormData({
            ...bizData.form.data,
            email: {
              ...bizData.form.data.pw,
              err: "Enter your access code.",
            },
          })
        );
      }
      dispatch(setProcessing(true));
      const req = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/login-supplier-biz`,
        { acsCode: bizData.form.data.email.value.trim() },
        { withCredentials: true }
      );

      const decode = jwt.decode(req.data.token);

      dispatch(
        setSupplierAccount({
          ...bizData.supplier,
          id: decode.id,
          isLoggedIn: true,
          bizmatcheventId: decode.bizmatcheventId,
          country: decode.country,
          description: decode.description,
          location: decode.location,
          logoSecUrl: decode.logoSecUrl,
          name: decode.name,
          website: decode.website,
          timeslots: [],
          open: decode.status.isOpen,
          acsTok: req.data.token,
        })
      );
      dispatch(setUserType("supplier"));
      dispatch(setProcessing(false));
      router.push("/attend-bizmatch");
    } catch (e) {
      if (axios.isAxiosError(e)) {
        if (!e.response) {
          dispatch(setServerResponseError("No internet."));
        } else {
          dispatch(setServerResponseError(e.response.data.err));
        }
      }
      dispatch(setProcessing(false));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    switch (bizData.form.mode) {
      case "register": {
        registerFunction();
        break;
      }
      case "login": {
        loginFunction();
        break;
      }

      case "supplier": {
        supplierLoginFunction();
        break;
      }
    }
  };

  useEffect(() => {
    dispatch(resetLoginFormData());
  }, [bizData.form.mode]);

  useEffect(() => {
    dispatch(setServerResponseError(""));
  }, [JSON.stringify(bizData.form.data)]);

  return (
    <>
      <div className="min-h-screen w-full grid place-items-center px-5">
        <AnimatePresence mode="wait">
          {bizData.form.mode === "register" && (
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              key={1}
              className="w-full flex items-center flex-col"
            >
              <div className="w-full max-w-[600px] bg-white px-7 py-5 shadow-sm shadow-neutral-50 border-1 border-neutral-100 rounded-md">
                <div className="flex flex-col items-center py-5">
                  <img src="/assets/mpoc.png" alt="" />
                  <h1 className="mt-5 text-center font-[600] text-2xl">
                    Register your Organization
                  </h1>
                  <p className="text-center text-sm text-neutral-800 mt-2">
                    Please register first to avoid the hassle of entering this
                    information for every timeslot you sign up for.
                  </p>
                </div>

                <AnimatePresence>
                  {bizData.form.serverResponseError && (
                    <motion.div
                      key={1}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="err bg-red-600 text-sm font-[600] rounded-md py-1.5 w-full"
                    >
                      <p className="text-center text-white inter">
                        {bizData.form.serverResponseError}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <form
                  onSubmit={(e) => !bizData.form.processing && handleSubmit(e)}
                  className="flex flex-col gap-2 mt-5"
                >
                  <TextInput
                    identifier="name"
                    title="Your Name"
                    value={bizData.form.data.name.value}
                    onInput={(dx) => {
                      dispatch(
                        setLoginFormData({
                          ...bizData.form.data,
                          name: {
                            value: dx,
                            err: "",
                          },
                        })
                      );
                    }}
                    error={bizData.form.data.name.err}
                    req
                  />
                  <TextInput
                    identifier="orgN"
                    title="Organization Name"
                    value={bizData.form.data.orgN.value}
                    onInput={(dx) => {
                      dispatch(
                        setLoginFormData({
                          ...bizData.form.data,
                          orgN: {
                            value: dx,
                            err: "",
                          },
                        })
                      );
                    }}
                    error={bizData.form.data.orgN.err}
                    req
                  />

                  <TextInput
                    identifier="orgP"
                    title="Position in Organization"
                    value={bizData.form.data.orgP.value}
                    onInput={(dx) => {
                      dispatch(
                        setLoginFormData({
                          ...bizData.form.data,
                          orgP: {
                            value: dx,
                            err: "",
                          },
                        })
                      );
                    }}
                    error={bizData.form.data.orgP.err}
                    req
                  />

                  <TextInput
                    identifier="email"
                    title="E-Mail"
                    value={bizData.form.data.email.value}
                    onInput={(dx) => {
                      dispatch(
                        setLoginFormData({
                          ...bizData.form.data,
                          email: {
                            value: dx,
                            err: "",
                          },
                        })
                      );
                    }}
                    error={bizData.form.data.email.err}
                    req
                  />

                  <PasswordInput
                    identifier="pw"
                    title="Password"
                    value={bizData.form.data.pw.value}
                    onInput={(dx) => {
                      dispatch(
                        setLoginFormData({
                          ...bizData.form.data,
                          pw: {
                            value: dx,
                            err: "",
                          },
                        })
                      );
                    }}
                    error={bizData.form.data.pw.err}
                    req
                  />
                  <button
                    type={"submit"}
                    className={`${
                      !bizData.form.processing
                        ? "bg-[#212121] hover:bg-neutral-800 text-white"
                        : "bg-neutral-100 border-1 border-neutral-300 text-black"
                    } mt-5 transition-all flex items-center justify-center gap-2 py-2  font-[600] rounded-lg`}
                  >
                    {bizData.form.processing ? (
                      <>
                        <CircularProgress
                          disableShrink
                          value={70}
                          thickness={6}
                          size={15}
                          sx={{
                            color: "black",
                          }}
                        />
                        Registering...
                      </>
                    ) : (
                      "Register and Sign In"
                    )}
                  </button>

                  <p className="mt-5 text-center text-sm">
                    Already registered your organization?{" "}
                    <button
                      className="font-[600]"
                      onClick={() => dispatch(setMode("login"))}
                    >
                      Login here.
                    </button>
                  </p>
                </form>
              </div>
              <p className="mt-5 text-center text-sm">
                Are you a supplier?{" "}
                <button
                  className="font-[600]"
                  onClick={() => dispatch(setMode("supplier"))}
                >
                  Login here.
                </button>
              </p>
            </motion.div>
          )}
          {bizData.form.mode === "login" && (
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              key={2}
              className="w-full flex items-center flex-col"
            >
              <div className="w-full max-w-[600px] bg-white px-7 py-5 shadow-sm shadow-neutral-50 border-1 border-neutral-100 rounded-md">
                <div className="flex flex-col items-center py-5">
                  <img src="/assets/mpoc.png" alt="" />
                  <h1 className="mt-5 text-center font-[600] text-2xl">
                    Login to MPOF2025 BizMatch
                  </h1>
                  <p className="text-center text-sm text-neutral-800 mt-2">
                    Enter your credentials to attend a supplier's timeslot.
                  </p>
                </div>

                <AnimatePresence>
                  {bizData.form.serverResponseError && (
                    <motion.div
                      key={1}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="err bg-red-600 text-sm font-[600] rounded-md py-1.5 w-full"
                    >
                      <p className="text-center text-white inter">
                        {bizData.form.serverResponseError}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <form
                  className="flex flex-col gap-2 mt-5"
                  onSubmit={(e) => !bizData.form.processing && handleSubmit(e)}
                >
                  <TextInput
                    identifier="email"
                    title="E-Mail"
                    value={bizData.form.data.email.value}
                    onInput={(dx) => {
                      dispatch(
                        setLoginFormData({
                          ...bizData.form.data,
                          email: {
                            value: dx,
                            err: "",
                          },
                        })
                      );
                    }}
                    error={bizData.form.data.email.err}
                    req
                  />

                  <PasswordInput
                    identifier="pw"
                    title="Password"
                    value={bizData.form.data.pw.value}
                    onInput={(dx) => {
                      dispatch(
                        setLoginFormData({
                          ...bizData.form.data,
                          pw: {
                            value: dx,
                            err: "",
                          },
                        })
                      );
                    }}
                    error={bizData.form.data.pw.err}
                    req
                  />
                  <button
                    type="submit"
                    className={`${
                      !bizData.form.processing
                        ? "bg-[#212121] hover:bg-neutral-800 text-white"
                        : "bg-neutral-100 border-1 border-neutral-300 text-black"
                    } mt-5 transition-all flex items-center justify-center gap-2 py-2  font-[600] rounded-lg`}
                  >
                    {bizData.form.processing ? (
                      <>
                        <CircularProgress
                          disableShrink
                          value={70}
                          thickness={6}
                          size={15}
                          sx={{
                            color: "black",
                          }}
                        />
                        Logging in...
                      </>
                    ) : (
                      "Log In"
                    )}
                  </button>

                  <p className="mt-5 text-center text-sm">
                    Don't have an account yet?{" "}
                    <button
                      type="button"
                      className="font-[600]"
                      onClick={() => dispatch(setMode("register"))}
                    >
                      Register here.
                    </button>
                  </p>
                </form>
              </div>
              <p className="mt-5 text-center text-sm">
                Are you a supplier?{" "}
                <button
                  className="font-[600]"
                  onClick={() => dispatch(setMode("supplier"))}
                >
                  Login here.
                </button>
              </p>
            </motion.div>
          )}
          {bizData.form.mode === "supplier" && (
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              key={3}
              className="w-full flex items-center flex-col"
            >
              <div className="w-full max-w-[600px] bg-white px-7 py-5 shadow-sm shadow-neutral-50 border-1 border-neutral-100 rounded-md">
                <div className="flex flex-col items-center py-5">
                  <img src="/assets/mpoc.png" alt="" />
                  <h1 className="mt-5 text-center font-[600] text-2xl">
                    MPOF2025 Supplier Login
                  </h1>
                  <p className="text-center text-sm text-neutral-800 mt-2">
                    Enter your access code to see your appointments.
                  </p>
                </div>

                <AnimatePresence>
                  {bizData.form.serverResponseError && (
                    <motion.div
                      key={1}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="err bg-red-600 text-sm font-[600] rounded-md py-1.5 w-full"
                    >
                      <p className="text-center text-white inter">
                        {bizData.form.serverResponseError}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <form
                  onSubmit={(e) => !bizData.form.processing && handleSubmit(e)}
                  className="flex flex-col gap-2 mt-5"
                >
                  <TextInput
                    identifier="acscode"
                    title="Access Code"
                    value={bizData.form.data.email.value}
                    onInput={(dx) => {
                      dispatch(
                        setLoginFormData({
                          ...bizData.form.data,
                          email: {
                            value: dx.toUpperCase(),
                            err: "",
                          },
                        })
                      );
                    }}
                    error={bizData.form.data.email.err}
                    placeholder="AAXPPL"
                    req
                  />

                  <button
                    type="submit"
                    className={`${
                      !bizData.form.processing
                        ? "bg-[#212121] hover:bg-neutral-800 text-white"
                        : "bg-neutral-100 border-1 border-neutral-300 text-black"
                    } mt-5 transition-all flex items-center justify-center gap-2 py-2  font-[600] rounded-lg`}
                  >
                    {bizData.form.processing ? (
                      <>
                        <CircularProgress
                          disableShrink
                          value={70}
                          thickness={6}
                          size={15}
                          sx={{
                            color: "black",
                          }}
                        />
                        Logging in...
                      </>
                    ) : (
                      "Log In"
                    )}
                  </button>
                </form>
              </div>
              <p className="mt-5 text-center text-sm">
                Are you a client?{" "}
                <button
                  className="font-[600]"
                  onClick={() => dispatch(setMode("login"))}
                >
                  Login here.
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
