import {Check, PersonStanding, X} from "lucide-react";
import {AnimatePresence, motion} from "framer-motion";
import TextInput from "../Inputs/TextInput";
import PasswordInput from "../Inputs/PasswordInput";
import EmailInput from "../Inputs/EmailInput";
import {useEffect, useState} from "react";

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

interface OrganizationOwnerComponent {
    data: OrganizationOwner;
    onDataChange: (dt: OrganizationOwner) => void;
}

interface PwCheckX {
    active: boolean;
    strength: number;
    strengthTranslation: string;
    caseOne: boolean;
    caseTwo: boolean;
    caseThree: boolean;
}

export default function OrganizationOwner({
                                              data,
                                              onDataChange,
                                          }: OrganizationOwnerComponent) {
    const [pwCheck, setPwCheck] = useState<PwCheckX>({
        active: false,
        strength: 0,
        strengthTranslation: "Weak",
        caseOne: false,
        caseTwo: false,
        caseThree: false,
    });

    const passwordStrength = (password: string): void => {
        let num = 0;

        if (/[A-Z]/.test(password)) {
            num += 1;
            setPwCheck((pv) => ({
                ...pv,
                caseOne: true,
            }));
        } else {
            setPwCheck((pv) => ({
                ...pv,
                caseOne: false,
            }));
        }
        if (/[a-z]/.test(password)) {
            num += 1;
            setPwCheck((pv) => ({
                ...pv,
                caseTwo: true,
            }));
        } else {
            setPwCheck((pv) => ({
                ...pv,
                caseTwo: false,
            }));
        }
        if (/[0-9]/.test(password)) {
            num += 1;
            setPwCheck((pv) => ({
                ...pv,
                caseThree: true,
            }));
        } else {
            setPwCheck((pv) => ({
                ...pv,
                caseThree: false,
            }));
        }
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            num += 1;
        } else {
        }
        setPwCheck((pv) => ({
            ...pv,
            strength: num,
            strengthTranslation:
                num === 0
                    ? "Very Weak"
                    : num === 1
                        ? "Weak"
                        : num === 2
                            ? "Moderate"
                            : num === 3
                                ? "Strong"
                                : "Very Strong",
        }));
    };

    useEffect(() => {
        if (!data.pw) return;

        passwordStrength(data.pw.value);
    }, [data.pw]);

    useEffect(() => {
        if (!data.conf_pw.value) return;

        if (data.conf_pw.value !== data.pw.value) {
            onDataChange({
                ...data,
                conf_pw: {
                    ...data.conf_pw,
                    err: "Passwords do not match.",
                },
            });
        } else {
            onDataChange({
                ...data,
                conf_pw: {
                    ...data.conf_pw,
                    err: "",
                },
            });
        }
    }, [data.conf_pw]);
    return (
        <>
            <div className="pg-1 px-5 geist">
                <section className="pt-8">
                    <div className="mt-5 step-icon p-5 rounded-2xl mx-auto bg-emerald-800 text-emerald-100 w-max">
                        <motion.div
                            initial={{opacity: 0, scale: 0}}
                            animate={{opacity: 1, scale: 1, transition: {delay: 0.05}}}
                        >
                            <PersonStanding/>
                        </motion.div>
                    </div>
                    <h1 className="mt-5 text-center text-2xl font-[600]">
                        Organization Owner
                    </h1>
                    <p className="text-xs text-center mt-2">
                        Welcome to Eventra! To start, introduce yourself first, then we'll
                        talk about your organization in the next step.
                    </p>
                    <div className="mt-5">
                        <div className="flex items-start gap-1">
                            <TextInput
                                identifier="fn"
                                title="First Name"
                                value={data.fn.value}
                                placeholder="John"
                                onInput={(d) => {
                                    onDataChange({
                                        ...data,
                                        fn: {
                                            value: d,
                                            err: "",
                                        },
                                    });
                                }}
                                error={data.fn.err}
                                className="w-1/2"
                            />
                            <TextInput
                                identifier="ln"
                                title="Last Name"
                                value={data.ln.value}
                                placeholder="Doe"
                                onInput={(d) => {
                                    onDataChange({
                                        ...data,
                                        ln: {
                                            value: d,
                                            err: "",
                                        },
                                    });
                                }}
                                error={data.ln.err}
                                className="w-1/2"
                            />
                        </div>
                        <EmailInput
                            identifier="email"
                            title="E-Mail"
                            value={data.email.value}
                            placeholder="someone@example.com"
                            onInput={(d) => {
                                onDataChange({
                                    ...data,
                                    email: {
                                        value: d,
                                        err: "",
                                    },
                                });
                            }}
                            error={data.email.err}
                        />
                        <div>
                            <PasswordInput
                                identifier="password"
                                title="Password"
                                value={data.pw.value}
                                onInput={(d) => {
                                    onDataChange({
                                        ...data,
                                        pw: {
                                            value: d,
                                            err: "",
                                        },
                                        conf_pw: {
                                            value: "",
                                            err: "",
                                        },
                                    });
                                }}
                                onFocus={() => {
                                    setPwCheck((pv) => ({
                                        ...pv,
                                        active: true,
                                    }));
                                }}
                                onBlur={() => {
                                    setPwCheck((pv) => ({
                                        ...pv,
                                        active: false,
                                    }));
                                }}
                                error={data.pw.err}
                            />
                            <AnimatePresence>
                                {pwCheck.active && (
                                    <motion.div
                                        initial={{y: 10, opacity: 0}}
                                        animate={{y: 0, opacity: 1}}
                                        exit={{y: 10, opacity: 0}}
                                        key={1}
                                        className="password-analysis"
                                    >
                                        <div
                                            className="st-bar  h-[5px] border-1 border-neutral-100 overflow-hidden w-full rounded-lg mt-2 flex justify-start">
                                            <div
                                                className={`bar h-full transition-all ${
                                                    pwCheck.strength <= 1
                                                        ? "bg-red-600"
                                                        : pwCheck.strength === 2
                                                            ? "bg-yellow-600"
                                                            : "bg-emerald-600"
                                                }`}
                                                style={{width: `${(pwCheck.strength / 4) * 100}%`}}
                                            ></div>
                                        </div>
                                        <p className="st-bar-trans text-xs mt-2">
                                            {pwCheck.strengthTranslation}
                                        </p>
                                        <ul className="mt-2 text-xs bg-white px-5 py-3 border-1 border-neutral-200 rounded-lg">
                                            <li className="flex items-center gap-2">
                                                {pwCheck.caseOne ? (
                                                    <Check size="19px" color="green"/>
                                                ) : (
                                                    <X size="19px" color="red"/>
                                                )}
                                                Password must have a capital letter
                                            </li>
                                            <li className="flex items-center gap-2">
                                                {pwCheck.caseTwo ? (
                                                    <Check size="19px" color="green"/>
                                                ) : (
                                                    <X size="19px" color="red"/>
                                                )}
                                                Password must have a lowercase letter
                                            </li>
                                            <li className="flex items-center gap-2">
                                                {pwCheck.caseThree ? (
                                                    <Check size="19px" color="green"/>
                                                ) : (
                                                    <X size="19px" color="red"/>
                                                )}
                                                Password must have a symbol
                                            </li>
                                        </ul>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        {pwCheck.caseOne &&
                            pwCheck.caseTwo &&
                            pwCheck.caseThree &&
                            !pwCheck.active && (
                                <PasswordInput
                                    identifier="cf-pw"
                                    title="Confirm Password"
                                    value={data.conf_pw.value}
                                    onInput={(d) => {
                                        onDataChange({
                                            ...data,
                                            conf_pw: {
                                                value: d,
                                                err: "",
                                            },
                                        });
                                    }}
                                    error={data.conf_pw.err}
                                />
                            )}
                    </div>
                </section>
            </div>
        </>
    );
}
