import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import OrganizationOwner from "@/components/Register/OrganizationOwner";
import OrganizationInformation from "@/components/Register/OrganizationInformation";
import Summary from "@/components/Register/Summary";
import Loading from "@/components/LoadingWithInf";
import axios from "axios";
import { useRouter } from "next/router";
import Head from "next/head";

interface OrganizationOwner {
  email: {
    value: string;
    err: string;
  };
  pw: {
    value: string;
    err: string;
  };
  fn: {
    value: string;
    err: string;
  };
  ln: {
    value: string;
    err: string;
  };
  conf_pw: {
    value: string;
    err: string;
  };
}

interface OrganizationInformationX {
  name: {
    value: string;
    err: string;
  };
  country: {
    value: string;
    err: string;
  };
  website: {
    value: string;
    err: string;
  };
  logo: {
    value: string;
    err: string;
  };
}

export default function Register() {
  const router = useRouter();
  const [regStat, setRegStat] = useState<any>({
    active: false,
    success: false,
    fail: false,
    failMsg: "",
  });
  const [step, setStep] = useState<number>(1);
  const [registerData, setRegisterData] = useState<OrganizationOwner>({
    email: {
      value: "",
      err: "",
    },
    pw: {
      value: "",
      err: "",
    },
    fn: {
      value: "",
      err: "",
    },
    ln: {
      value: "",
      err: "",
    },
    conf_pw: {
      value: "",
      err: "",
    },
  });
  const [organizationData, setOrganizationData] =
    useState<OrganizationInformationX>({
      name: {
        value: "",
        err: "",
      },
      country: {
        value: "",
        err: "",
      },
      website: {
        value: "",
        err: "",
      },
      logo: {
        value: "",
        err: "",
      },
    });

  const isPasswordOk = (password: string): boolean => {
    if (!/[A-Z]/.test(password)) {
      return false;
    }
    if (!/[a-z]/.test(password)) {
      return false;
    }

    if (!/[0-9]/.test(password)) {
      return false;
    }

    return true;
  };

  const base64ToFile = async (
    base64: string,
    fileName: string
  ): Promise<File> => {
    return new Promise((resolve, reject) => {
      try {
        const arr = base64.split(",");
        const mimeMatch = arr[0].match(/:(.*?);/);
        if (!mimeMatch) return reject("Invalid base64 format");

        const mime = mimeMatch[1]; // Extract MIME type
        const ext = mime.split("/")[1]; // Get file extension
        const bstr = atob(arr[1]); // Decode base64
        const u8arr = new Uint8Array(bstr.length);

        for (let i = 0; i < bstr.length; i++) {
          u8arr[i] = bstr.charCodeAt(i);
        }

        resolve(new File([u8arr], `${fileName}.${ext}`, { type: mime }));
      } catch (error) {
        reject(error);
      }
    });
  };

  const handleStepIncrementation = async () => {
    let err = false;
    switch (step) {
      case 1: {
        if (
          !registerData.email.value.match(
            /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
          )
        ) {
          setRegisterData((pv) => ({
            ...pv,
            email: {
              ...pv.email,
              err: "Invalid E-Mail.",
            },
          }));
          err = true;
        }

        if (!registerData.fn.value) {
          setRegisterData((pv) => ({
            ...pv,
            fn: {
              ...pv.fn,
              err: "Enter your first name.",
            },
          }));
          err = true;
        }
        if (!registerData.ln.value) {
          setRegisterData((pv) => ({
            ...pv,
            ln: {
              ...pv.ln,
              err: "Enter your last name.",
            },
          }));
          err = true;
        }

        if (!isPasswordOk(registerData.pw.value)) {
          setRegisterData((pv) => ({
            ...pv,
            pw: {
              ...pv.pw,
              err: "For security reasons, we require you to have a strong password.",
            },
          }));
          err = true;
        }

        if (registerData.conf_pw.value !== registerData.pw.value) {
          setRegisterData((pv) => ({
            ...pv,
            conf_pw: {
              ...pv.conf_pw,
              err: "Passwords do not match.",
            },
          }));
          err = true;
        }

        if (err) return;
        setStep(2);
        break;
      }
      case 2: {
        if (!organizationData.name.value) {
          setOrganizationData((pv) => ({
            ...pv,
            name: {
              ...pv.name,
              err: "Enter a name.",
            },
          }));
          err = true;
        }
        if (!organizationData.country.value) {
          setOrganizationData((pv) => ({
            ...pv,
            country: {
              ...pv.country,
              err: "Enter the country of your organization.",
            },
          }));
          err = true;
        }
        if (!organizationData.logo.value) {
          setOrganizationData((pv) => ({
            ...pv,
            logo: {
              ...pv.logo,
              err: "Upload your company logo.",
            },
          }));
          err = true;
        }

        if (
          !organizationData.website.value.match(
            /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/
          )
        ) {
          setOrganizationData((pv) => ({
            ...pv,
            website: {
              ...pv.website,
              err: "Invalid link.",
            },
          }));
          err = true;
        }

        if (err) return;
        setStep(3);
        break;
      }
      case 3: {
        const form = new FormData();
        const payload = JSON.stringify({
          fn: registerData.fn.value,
          ln: registerData.ln.value,
          email: registerData.email.value,
          pw: registerData.pw.value,
          orgN: organizationData.name.value,
          country: organizationData.country.value,
          website: organizationData.website.value,
        });

        form.append("data", payload);
        try {
          const file = await base64ToFile(
            organizationData.logo.value,
            Math.floor(1000000000 + Math.random() * 9000000000).toString()
          );
          form.append("logo", file);

          setRegStat((pv) => ({
            ...pv,
            active: true,
          }));

          const req = await axios.post(
            `${process.env.NEXT_PUBLIC_API}/eventra-register`,
            form
          );

          setRegStat((pv) => ({
            ...pv,
            active: true,
            success: true,
          }));
        } catch (e) {
          setRegStat((pv) => ({
            ...pv,
            active: true,
            fail: true,
            failMsg: e.response.data.msg,
          }));
        }

        break;
      }
    }
  };

  return (
    <>
      <Head>
        <title>Eventra | Register</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="hidden">
        <header className="pt-[160px] geist">
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
        <section className="px-5 geist pt-[40px]">
          <h1 className="font-[500] text-center text-2xl">
            Welcome to{" "}
            <span className="text-emerald-600 font-bold">Eventra</span>.
          </h1>
          <p className="text-center text-sm mt-2">
            A platform that let's you manage your events, handle atendees, and
            event data.
          </p>
        </section>
        <footer className="px-5 fixed w-full bottom-[20px] geist">
          <button className="text-sm bg-emerald-700 w-full py-2.5 font-[500] text-emerald-100 rounded-lg mt-[100px]">
            Start
          </button>
          <p className="text-sm text-center mt-3">
            Already have an account?{" "}
            <span className="text-emerald-600 font-bold">Login</span>
          </p>
        </footer>
      </div>
      <header className="px-5 geist">
        <header className="mt-5 flex justify-between items-center">
          <ChevronLeft
            onClick={() => {
              step - 1 === 0 ? setStep(1) : setStep(step - 1);
            }}
          />
          <div className="overflow-hidden border-1 border-neutral-200 progress h-[6px] w-[150px] rounded-xl">
            <div
              className={`bg-emerald-600 h-full transition-all`}
              style={{ width: ((step / 3) * 100).toString() + "%" }}
            ></div>
          </div>
          <div className="prog-en text-xs">{step} / 3</div>
        </header>
      </header>
      {step === 1 && (
        <OrganizationOwner
          data={registerData}
          onDataChange={(dt) => {
            setRegisterData(dt);
          }}
        />
      )}

      {step === 2 && (
        <OrganizationInformation
          data={organizationData}
          onDataChange={(dt) => {
            setOrganizationData(dt);
          }}
        />
      )}

      {step === 3 && <Summary pg1={registerData} pg2={organizationData} />}

      <Loading
        active={regStat.active}
        success={regStat.success}
        fail={regStat.fail}
        description="Registering to Eventra, please wait."
        bottom="Do not refresh the page."
        successDescription="You have been registered to Eventra."
        failDescription={regStat.failMsg}
        successButton="Login"
        failButton="Go Back"
        onSuccessClick={() => {
          router.push("/login");
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

      <div
        onClick={() => {
          handleStepIncrementation();
        }}
        className="proceed-btn px-5 fixed bottom-0 left-0 w-full geist"
      >
        <button className="hover:bg-emerald-700 bg-emerald-800 text-emerald-100 rounded-lg w-full py-2 text-sm mb-3">
          {step === 3 ? "Register to Eventa" : "Proceed"}
        </button>
      </div>

      {/* <section className="sign-in-form geist px-5 my-5">
        <div className="flex flex-col gap-2">
          <div className="input-box border-1 border-neutral-200 rounded-md px-2 py-2">
            <label htmlFor="org-name" className="text-xs font-[500]">
              Organization Name
            </label>
            <input
              type="text"
              name="org-name"
              id=""
              value={""}
              onInput={(e) => {
                // setLoginData((pv) => ({
                //   ...pv,
                //   email: (e.target as HTMLInputElement).value,
                // }));
              }}
              className="py-1 focus:outline-none h-[20px] block w-full"
            />
          </div>
          <div className="input-box border-1 border-neutral-200 rounded-md px-2 py-2">
            <label htmlFor="email" className="text-xs font-[500]">
              E-Mail
            </label>
            <input
              type="email"
              name="email"
              id=""
              value={""}
              onInput={(e) => {
                // setLoginData((pv) => ({
                //   ...pv,
                //   email: (e.target as HTMLInputElement).value,
                // }));
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
              value={""}
              onInput={(e) => {
                // setLoginData((pv) => ({
                //   ...pv,
                //   pw: (e.target as HTMLInputElement).value,
                // }));
              }}
              className="py-1 focus:outline-none h-[20px] block w-full"
            />
          </div>

          <button
            type="submit"
            className="bg-emerald-700 text-emerald-100 w-full mt-5 rounded-md py-2.5 text-xs hover:bg-emerald-700 font-semibold"
          >
            Register
          </button>
        </div>
        <p className="text-sm text-center mt-5 text-neutral-700">
          Already have an account?{" "}
          <button className="text-emerald-600 font-[600]">Login</button>
        </p>
      </section> */}
    </>
  );
}
