import Loading from "@/components/LoadingWithInf";
import { useModal } from "@/components/Modal/ModalContext";
import axios, { AxiosError } from "axios";
import { TriangleAlert } from "lucide-react";
import { FormEvent, useState } from "react";
import jwt from "jsonwebtoken";
import { useDispatch, useSelector } from "react-redux";
import { appUpdate, selectApp } from "@/features/appSlice";
import { AppDispatch } from "@/features/store";
import { useRouter } from "next/router";
import Head from "next/head";

interface LoginForm {
  email: string;
  pw: string;
}

export default function Login() {
  const router = useRouter();
  const appData = useSelector(selectApp);

  const dispatch = useDispatch<AppDispatch>();

  const [loginData, setLoginData] = useState<LoginForm>({
    email: "",
    pw: "",
  });

  const [regStat, setRegStat] = useState<any>({
    active: false,
    success: false,
    fail: false,
    failMsg: "",
  });

  const handleSubmit = async () => {
    const form = new FormData();
    const payload = JSON.stringify({ ...loginData });
    form.append("data", payload);

    try {
      setRegStat((pv: any) => ({
        ...pv,
        active: true,
      }));
      const req = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/login`,
        form,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setRegStat((pv: any) => ({
        ...pv,
        active: true,
        success: true,
      }));

      const decoded = jwt.decode(req.data.token);

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
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (e: any) {
      if (!e.response) {
        return setRegStat((pv: any) => ({
          ...pv,
          active: true,
          fail: true,
          failMsg: "Server is offline.",
        }));
      }
      setRegStat((pv: any) => ({
        ...pv,
        active: true,
        fail: true,
        failMsg: e.response.data.msg,
      }));
    }
  };
  return (
    <>
      <Head>
        <title>Eventra | Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Loading
        active={regStat.active}
        success={regStat.success}
        fail={regStat.fail}
        description="Logging in..."
        bottom="Please wait."
        successDescription="Logged in, redirecting you to the dashboard."
        failDescription={regStat.failMsg}
        successButton="Login"
        failButton="Go Back"
        onSuccessClick={() => {
          setRegStat({
            active: false,
            success: false,
            fail: false,
            failMsg: "",
          });
        }}
        onFailClick={() => {
          setRegStat({
            active: false,
            success: false,
            fail: false,
            failMsg: "",
          });
        }}
      />
      <div className="mx-auto max-w-[500px] border-1 mt-[250px] py-10 rounded-lg border-neutral-200 shadow-2xs">
        <header className="geist">
          <svg
            width="97"
            height="59"
            viewBox="0 0 37 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto"
          >
            <path
              d="M3.864 8.06C3.208 8.06 2.632 7.924 2.136 7.652C1.64 7.372 1.252 6.992 0.972 6.512C0.692 6.024 0.552 5.468 0.552 4.844C0.552 4.22 0.684 3.668 0.948 3.188C1.22 2.708 1.588 2.332 2.052 2.06C2.524 1.78 3.052 1.64 3.636 1.64C4.228 1.64 4.752 1.776 5.208 2.048C5.672 2.312 6.036 2.688 6.3 3.176C6.564 3.656 6.696 4.212 6.696 4.844C6.696 4.884 6.692 4.928 6.684 4.976C6.684 5.016 6.684 5.06 6.684 5.108H1.2V4.472H6.228L5.892 4.724C5.892 4.268 5.792 3.864 5.592 3.512C5.4 3.152 5.136 2.872 4.8 2.672C4.464 2.472 4.076 2.372 3.636 2.372C3.204 2.372 2.816 2.472 2.472 2.672C2.128 2.872 1.86 3.152 1.668 3.512C1.476 3.872 1.38 4.284 1.38 4.748V4.88C1.38 5.36 1.484 5.784 1.692 6.152C1.908 6.512 2.204 6.796 2.58 7.004C2.964 7.204 3.4 7.304 3.888 7.304C4.272 7.304 4.628 7.236 4.956 7.1C5.292 6.964 5.58 6.756 5.82 6.476L6.3 7.028C6.02 7.364 5.668 7.62 5.244 7.796C4.828 7.972 4.368 8.06 3.864 8.06ZM8.74472 8L5.94872 1.7H6.83672L9.40472 7.544H8.98472L11.5887 1.7H12.4287L9.62072 8H8.74472ZM14.9288 8.06C14.2728 8.06 13.6968 7.924 13.2008 7.652C12.7048 7.372 12.3168 6.992 12.0368 6.512C11.7568 6.024 11.6168 5.468 11.6168 4.844C11.6168 4.22 11.7488 3.668 12.0128 3.188C12.2848 2.708 12.6528 2.332 13.1168 2.06C13.5888 1.78 14.1168 1.64 14.7008 1.64C15.2928 1.64 15.8168 1.776 16.2728 2.048C16.7368 2.312 17.1008 2.688 17.3648 3.176C17.6288 3.656 17.7608 4.212 17.7608 4.844C17.7608 4.884 17.7568 4.928 17.7488 4.976C17.7488 5.016 17.7488 5.06 17.7488 5.108H12.2648V4.472H17.2928L16.9568 4.724C16.9568 4.268 16.8568 3.864 16.6568 3.512C16.4648 3.152 16.2008 2.872 15.8648 2.672C15.5288 2.472 15.1408 2.372 14.7008 2.372C14.2688 2.372 13.8808 2.472 13.5368 2.672C13.1928 2.872 12.9248 3.152 12.7328 3.512C12.5408 3.872 12.4448 4.284 12.4448 4.748V4.88C12.4448 5.36 12.5488 5.784 12.7568 6.152C12.9728 6.512 13.2688 6.796 13.6448 7.004C14.0288 7.204 14.4648 7.304 14.9528 7.304C15.3368 7.304 15.6928 7.236 16.0208 7.1C16.3568 6.964 16.6448 6.756 16.8848 6.476L17.3648 7.028C17.0848 7.364 16.7328 7.62 16.3088 7.796C15.8928 7.972 15.4328 8.06 14.9288 8.06ZM21.5227 1.64C22.0347 1.64 22.4827 1.74 22.8668 1.94C23.2587 2.132 23.5627 2.428 23.7787 2.828C24.0027 3.228 24.1147 3.732 24.1147 4.34V8H23.2627V4.424C23.2627 3.76 23.0947 3.26 22.7587 2.924C22.4307 2.58 21.9667 2.408 21.3667 2.408C20.9187 2.408 20.5267 2.5 20.1907 2.684C19.8627 2.86 19.6067 3.12 19.4227 3.464C19.2467 3.8 19.1587 4.208 19.1587 4.688V8H18.3067V1.7H19.1227V3.428L18.9907 3.104C19.1907 2.648 19.5107 2.292 19.9507 2.036C20.3907 1.772 20.9147 1.64 21.5227 1.64ZM27.2081 8.06C26.6161 8.06 26.1601 7.9 25.8401 7.58C25.5201 7.26 25.3601 6.808 25.3601 6.224V0.308H26.2121V6.176C26.2121 6.544 26.3041 6.828 26.4881 7.028C26.6801 7.228 26.9521 7.328 27.3041 7.328C27.6801 7.328 27.9921 7.22 28.2401 7.004L28.5401 7.616C28.3721 7.768 28.1681 7.88 27.9281 7.952C27.6961 8.024 27.4561 8.06 27.2081 8.06ZM24.2321 2.408V1.7H28.1321V2.408H24.2321ZM28.8911 8V1.7H29.7071V3.416L29.6231 3.116C29.7991 2.636 30.0951 2.272 30.5111 2.024C30.9271 1.768 31.4431 1.64 32.0591 1.64V2.468C32.0271 2.468 31.9951 2.468 31.9631 2.468C31.9311 2.46 31.8991 2.456 31.8671 2.456C31.2031 2.456 30.6831 2.66 30.3071 3.068C29.9311 3.468 29.7431 4.04 29.7431 4.784V8H28.8911ZM35.893 8V6.608L35.857 6.38V4.052C35.857 3.516 35.705 3.104 35.401 2.816C35.105 2.528 34.661 2.384 34.069 2.384C33.661 2.384 33.273 2.452 32.905 2.588C32.537 2.724 32.225 2.904 31.969 3.128L31.585 2.492C31.905 2.22 32.289 2.012 32.737 1.868C33.185 1.716 33.657 1.64 34.153 1.64C34.969 1.64 35.597 1.844 36.037 2.252C36.485 2.652 36.709 3.264 36.709 4.088V8H35.893ZM33.721 8.06C33.249 8.06 32.837 7.984 32.485 7.832C32.141 7.672 31.877 7.456 31.693 7.184C31.509 6.904 31.417 6.584 31.417 6.224C31.417 5.896 31.493 5.6 31.645 5.336C31.805 5.064 32.061 4.848 32.413 4.688C32.773 4.52 33.253 4.436 33.853 4.436H36.025V5.072H33.877C33.269 5.072 32.845 5.18 32.605 5.396C32.373 5.612 32.257 5.88 32.257 6.2C32.257 6.56 32.397 6.848 32.677 7.064C32.957 7.28 33.349 7.388 33.853 7.388C34.333 7.388 34.745 7.28 35.089 7.064C35.441 6.84 35.697 6.52 35.857 6.104L36.049 6.692C35.889 7.108 35.609 7.44 35.209 7.688C34.817 7.936 34.321 8.06 33.721 8.06Z"
              fill="black"
            />
          </svg>
        </header>
        <section className="sign-in-form geist px-5 my-5">
          <div className="flex flex-col gap-2">
            <div className="input-box border-1 border-neutral-200 rounded-md px-2 py-2">
              <label htmlFor="email" className="text-xs font-[500]">
                E-Mail
              </label>
              <input
                type="email"
                name="email"
                id=""
                value={loginData.email}
                onInput={(e) => {
                  setLoginData((pv) => ({
                    ...pv,
                    email: (e.target as HTMLInputElement).value,
                  }));
                }}
                className="py-1 focus:outline-none h-[20px] block w-full"
              />
            </div>
            <div className="input-box border-1 border-neutral-200 rounded-md px-2 py-2">
              <label htmlFor="password" className="text-xs font-[500]">
                Password
              </label>
              <input
                type="password"
                name="password"
                id=""
                value={loginData.pw}
                onInput={(e) => {
                  setLoginData((pv) => ({
                    ...pv,
                    pw: (e.target as HTMLInputElement).value,
                  }));
                }}
                className="py-1 focus:outline-none h-[20px] block w-full"
              />
            </div>
            <p className="text-xs text-right mt-1 text-neutral-700">
              Forgot your password?{" "}
              <button className="text-emerald-600 font-[600]">Reset</button>
            </p>

            <button
              type="submit"
              onClick={() => handleSubmit()}
              className="bg-emerald-700 text-emerald-100 w-full mt-5 rounded-md py-2.5 text-xs hover:bg-emerald-700 font-semibold"
            >
              Log In
            </button>
            <p className="text-xs text-center mt-2 text-neutral-700">
              Don't have an account?{" "}
              <button className="text-emerald-600 font-[600]">Create</button>
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
