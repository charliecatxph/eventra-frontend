import {AnimatePresence, motion} from "framer-motion";
import {AlertTriangle, X} from "lucide-react";
import TextInput from "@/components/Inputs/TextInput";
import type {EditAttendee} from "@/interfaces/Interface";

interface EditAttendeeParams {
    values: EditAttendee,
    setValues: (dx: EditAttendee) => void,
    callback: () => void
}

const setEditAttendeeDef: EditAttendee = {
    active: false,
    attended: {
        value: "",
        err: "",
    },
    name: {
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
    email: {
        value: "",
        err: "",
    },
    number: {
        value: "",
        err: "",
    },
    addr: {
        value: "",
        err: "",
    },
    salutation: {
        value: "",
        err: "",
    },
    attendBizMatch: {
        value: "",
        err: ""
    },
    country: {
        value: "",
        err: ""
    },
    id: "",
};


export default function EditAttendee({values, setValues, callback}: EditAttendeeParams) {

    return (
        <AnimatePresence>
            {values.active && <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                key={1}
                className="registration-form fixed w-full h-full top-0 left-0 bg-neutral-900/70 z-[9999] geist overflow-y-auto py-5 px-5"
            >
                <div className="flex items-center justify-center min-h-screen w-full">
                    <motion.div
                        initial={{opacity: 0, scale: 0.9}}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            transition: {delay: 0.2, duration: 0.2},
                        }}
                        exit={{opacity: 0, scale: 0.9}}
                        key={13}
                        className="form w-full max-w-[600px] bg-white rounded-xl overflow-hidden "
                    >
                        <div className="px-5 py-2 flex justify-between items-center bg-emerald-700 text-white">
                            <h1 className=" font-[700]">Edit Attendee</h1>
                            <div
                                className="p-2 rounded-full w-max cursor-pointer"
                                onClick={() => {
                                    setValues(setEditAttendeeDef);
                                }}
                            >
                                <X size="15px" strokeWidth={5}/>
                            </div>
                        </div>
                        <div className="p-5 flex flex-col gap-2">
                            <div className="flex gap-2">
                                <TextInput
                                    identifier="name"
                                    title="Atendee Name"
                                    value={values.name.value}
                                    placeholder=""
                                    onInput={(e) => {
                                        setValues({
                                            ...values,
                                            name: {
                                                value: e,
                                                err: ""
                                            }
                                        })
                                    }}
                                    error={values.name.err}
                                    className="w-1/2"
                                    req
                                />
                                <TextInput
                                    identifier="salutation"
                                    title="Salutations"
                                    value={values.salutation.value}
                                    placeholder=""
                                    onInput={(e) => {
                                        setValues({
                                            ...values,
                                            salutation: {
                                                value: e,
                                                err: ""
                                            }
                                        })
                                    }}
                                    error={values.salutation.err}
                                    className="w-1/2"
                                    req
                                />
                            </div>
                            <TextInput
                                identifier="email"
                                title="E-Mail"
                                value={values.email.value}
                                placeholder=""
                                onInput={(e) => {
                                    setValues({
                                        ...values,
                                        email: {
                                            value: e,
                                            err: ""
                                        }
                                    })
                                }}
                                error={values.email.err}
                                className=""
                                req
                            />
                            <div className="flex gap-2">
                                <TextInput
                                    identifier="orgN"
                                    title="Organization Name"
                                    value={values.orgN.value}
                                    placeholder=""
                                    onInput={(e) => {
                                        setValues({
                                            ...values,
                                            orgN: {
                                                value: e,
                                                err: ""
                                            }
                                        })
                                    }}
                                    error={values.orgN.err}
                                    className="w-1/2"
                                    req
                                />
                                <TextInput
                                    identifier="orgP"
                                    title="Organization Position"
                                    value={values.orgP.value}
                                    placeholder=""
                                    onInput={(e) => {
                                        setValues({
                                            ...values,
                                            orgP: {
                                                value: e,
                                                err: ""
                                            }
                                        })
                                    }}
                                    error={values.orgP.err}
                                    className="w-1/2"
                                    req
                                />
                            </div>
                            <TextInput
                                identifier="ph"
                                title="Phone Number"
                                value={values.number.value}
                                placeholder=""
                                onInput={(e) => {
                                    setValues({
                                        ...values,
                                        number: {
                                            value: e,
                                            err: ""
                                        }
                                    })
                                }}
                                error={values.number.err}
                                className=""
                                req
                            />
                            <TextInput
                                identifier="address"
                                title="Address"
                                value={values.addr.value}
                                placeholder=""
                                onInput={(e) => {
                                    setValues({
                                        ...values,
                                        addr: {
                                            value: e,
                                            err: ""
                                        }
                                    })
                                }}
                                error={values.addr.err}
                                className=""
                            />
                            <div>
                                <label htmlFor="country" className="font-[500] text-sm">
                                    Country
                                    <span className="font-[500] text-red-600">*</span>
                                </label>
                                <select
                                    name="country"
                                    id="country-select"
                                    value={values.country.value}
                                    onChange={(e) => {
                                        setValues({
                                            ...values,
                                            country: {
                                                value: e.target.value,
                                                err: ""
                                            }
                                        })
                                    }}
                                    className="mt-1.5 w-full border-1 rounded-lg py-1.5 px-3 border-neutral-200 outline-neutral-400 outline-offset-4"
                                >
                                    <option value="none" disabled selected>
                                        Select a country...
                                    </option>
                                    <option value="AF">Afghanistan</option>
                                    <option value="AL">Albania</option>
                                    <option value="DZ">Algeria</option>
                                    <option value="AD">Andorra</option>
                                    <option value="AO">Angola</option>
                                    <option value="AG">Antigua and Barbuda</option>
                                    <option value="AR">Argentina</option>
                                    <option value="AM">Armenia</option>
                                    <option value="AU">Australia</option>
                                    <option value="AT">Austria</option>
                                    <option value="AZ">Azerbaijan</option>
                                    <option value="BS">Bahamas</option>
                                    <option value="BH">Bahrain</option>
                                    <option value="BD">Bangladesh</option>
                                    <option value="BB">Barbados</option>
                                    <option value="BY">Belarus</option>
                                    <option value="BE">Belgium</option>
                                    <option value="BZ">Belize</option>
                                    <option value="BJ">Benin</option>
                                    <option value="BT">Bhutan</option>
                                    <option value="BO">Bolivia</option>
                                    <option value="BA">Bosnia and Herzegovina</option>
                                    <option value="BW">Botswana</option>
                                    <option value="BR">Brazil</option>
                                    <option value="BN">Brunei</option>
                                    <option value="BG">Bulgaria</option>
                                    <option value="BF">Burkina Faso</option>
                                    <option value="BI">Burundi</option>
                                    <option value="CV">Cabo Verde</option>
                                    <option value="KH">Cambodia</option>
                                    <option value="CM">Cameroon</option>
                                    <option value="CA">Canada</option>
                                    <option value="CF">Central African Republic</option>
                                    <option value="TD">Chad</option>
                                    <option value="CL">Chile</option>
                                    <option value="CN">China</option>
                                    <option value="CO">Colombia</option>
                                    <option value="KM">Comoros</option>
                                    <option value="CD">Congo (DRC)</option>
                                    <option value="CG">Congo (Republic)</option>
                                    <option value="CR">Costa Rica</option>
                                    <option value="CI">Côte d'Ivoire</option>
                                    <option value="HR">Croatia</option>
                                    <option value="CU">Cuba</option>
                                    <option value="CY">Cyprus</option>
                                    <option value="CZ">Czech Republic</option>
                                    <option value="DK">Denmark</option>
                                    <option value="DJ">Djibouti</option>
                                    <option value="DM">Dominica</option>
                                    <option value="DO">Dominican Republic</option>
                                    <option value="EC">Ecuador</option>
                                    <option value="EG">Egypt</option>
                                    <option value="SV">El Salvador</option>
                                    <option value="GQ">Equatorial Guinea</option>
                                    <option value="ER">Eritrea</option>
                                    <option value="EE">Estonia</option>
                                    <option value="SZ">Eswatini</option>
                                    <option value="ET">Ethiopia</option>
                                    <option value="FJ">Fiji</option>
                                    <option value="FI">Finland</option>
                                    <option value="FR">France</option>
                                    <option value="GA">Gabon</option>
                                    <option value="GM">Gambia</option>
                                    <option value="GE">Georgia</option>
                                    <option value="DE">Germany</option>
                                    <option value="GH">Ghana</option>
                                    <option value="GR">Greece</option>
                                    <option value="GD">Grenada</option>
                                    <option value="GT">Guatemala</option>
                                    <option value="GN">Guinea</option>
                                    <option value="GW">Guinea-Bissau</option>
                                    <option value="GY">Guyana</option>
                                    <option value="HT">Haiti</option>
                                    <option value="HN">Honduras</option>
                                    <option value="HU">Hungary</option>
                                    <option value="IS">Iceland</option>
                                    <option value="IN">India</option>
                                    <option value="ID">Indonesia</option>
                                    <option value="IR">Iran</option>
                                    <option value="IQ">Iraq</option>
                                    <option value="IE">Ireland</option>
                                    <option value="IL">Israel</option>
                                    <option value="IT">Italy</option>
                                    <option value="JM">Jamaica</option>
                                    <option value="JP">Japan</option>
                                    <option value="JO">Jordan</option>
                                    <option value="KZ">Kazakhstan</option>
                                    <option value="KE">Kenya</option>
                                    <option value="KI">Kiribati</option>
                                    <option value="KW">Kuwait</option>
                                    <option value="KG">Kyrgyzstan</option>
                                    <option value="LA">Laos</option>
                                    <option value="LV">Latvia</option>
                                    <option value="LB">Lebanon</option>
                                    <option value="LS">Lesotho</option>
                                    <option value="LR">Liberia</option>
                                    <option value="LY">Libya</option>
                                    <option value="LI">Liechtenstein</option>
                                    <option value="LT">Lithuania</option>
                                    <option value="LU">Luxembourg</option>
                                    <option value="MG">Madagascar</option>
                                    <option value="MW">Malawi</option>
                                    <option value="MY">Malaysia</option>
                                    <option value="MV">Maldives</option>
                                    <option value="ML">Mali</option>
                                    <option value="MT">Malta</option>
                                    <option value="MH">Marshall Islands</option>
                                    <option value="MR">Mauritania</option>
                                    <option value="MU">Mauritius</option>
                                    <option value="MX">Mexico</option>
                                    <option value="FM">Micronesia</option>
                                    <option value="MD">Moldova</option>
                                    <option value="MC">Monaco</option>
                                    <option value="MN">Mongolia</option>
                                    <option value="ME">Montenegro</option>
                                    <option value="MA">Morocco</option>
                                    <option value="MZ">Mozambique</option>
                                    <option value="MM">Myanmar</option>
                                    <option value="NA">Namibia</option>
                                    <option value="NR">Nauru</option>
                                    <option value="NP">Nepal</option>
                                    <option value="NL">Netherlands</option>
                                    <option value="NZ">New Zealand</option>
                                    <option value="NI">Nicaragua</option>
                                    <option value="NE">Niger</option>
                                    <option value="NG">Nigeria</option>
                                    <option value="MK">North Macedonia</option>
                                    <option value="NO">Norway</option>
                                    <option value="OM">Oman</option>
                                    <option value="PK">Pakistan</option>
                                    <option value="PW">Palau</option>
                                    <option value="PA">Panama</option>
                                    <option value="PG">Papua New Guinea</option>
                                    <option value="PY">Paraguay</option>
                                    <option value="PE">Peru</option>
                                    <option value="PH">Philippines</option>
                                    <option value="PL">Poland</option>
                                    <option value="PT">Portugal</option>
                                    <option value="QA">Qatar</option>
                                    <option value="RO">Romania</option>
                                    <option value="RU">Russia</option>
                                    <option value="RW">Rwanda</option>
                                    <option value="KN">Saint Kitts and Nevis</option>
                                    <option value="LC">Saint Lucia</option>
                                    <option value="VC">
                                        Saint Vincent and the Grenadines
                                    </option>
                                    <option value="WS">Samoa</option>
                                    <option value="SM">San Marino</option>
                                    <option value="ST">Sao Tome and Principe</option>
                                    <option value="SA">Saudi Arabia</option>
                                    <option value="SN">Senegal</option>
                                    <option value="RS">Serbia</option>
                                    <option value="SC">Seychelles</option>
                                    <option value="SL">Sierra Leone</option>
                                    <option value="SG">Singapore</option>
                                    <option value="SK">Slovakia</option>
                                    <option value="SI">Slovenia</option>
                                    <option value="SB">Solomon Islands</option>
                                    <option value="SO">Somalia</option>
                                    <option value="ZA">South Africa</option>
                                    <option value="KR">South Korea</option>
                                    <option value="SS">South Sudan</option>
                                    <option value="ES">Spain</option>
                                    <option value="LK">Sri Lanka</option>
                                    <option value="SD">Sudan</option>
                                    <option value="SR">Suriname</option>
                                    <option value="SE">Sweden</option>
                                    <option value="CH">Switzerland</option>
                                    <option value="SY">Syria</option>
                                    <option value="TW">Taiwan</option>
                                    <option value="TJ">Tajikistan</option>
                                    <option value="TZ">Tanzania</option>
                                    <option value="TH">Thailand</option>
                                    <option value="TL">Timor-Leste</option>
                                    <option value="TG">Togo</option>
                                    <option value="TO">Tonga</option>
                                    <option value="TT">Trinidad and Tobago</option>
                                    <option value="TN">Tunisia</option>
                                    <option value="TR">Turkey</option>
                                    <option value="TM">Turkmenistan</option>
                                    <option value="TV">Tuvalu</option>
                                    <option value="UG">Uganda</option>
                                    <option value="UA">Ukraine</option>
                                    <option value="AE">United Arab Emirates</option>
                                    <option value="GB">United Kingdom</option>
                                    <option value="US">United States</option>
                                    <option value="UY">Uruguay</option>
                                    <option value="UZ">Uzbekistan</option>
                                    <option value="VU">Vanuatu</option>
                                    <option value="VA">Vatican City</option>
                                    <option value="VE">Venezuela</option>
                                    <option value="VN">Vietnam</option>
                                    <option value="YE">Yemen</option>
                                    <option value="ZM">Zambia</option>
                                    <option value="ZW">Zimbabwe</option>
                                </select>
                            </div>
                            <AnimatePresence>
                                {values.country.err && (
                                    <motion.div
                                        key={1}
                                        initial={{opacity: 0}}
                                        animate={{opacity: 1}}
                                        exit={{opacity: 0}}
                                        className="warn mt-[5px] flex items-center gap-2 text-xs text-red-600"
                                    >
                                        <AlertTriangle size="13px" className="shrink-0"/>
                                        {values.country.err}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div>
                                <label htmlFor="attended" className="font-[500] text-sm">
                                    BizMatch Status
                                    <span className="font-[500] text-red-600">*</span>
                                </label>
                                <select
                                    name="attended"
                                    id=""
                                    value={values.attendBizMatch.value}
                                    onChange={(e) => {
                                        setValues({
                                            ...values,
                                            attendBizMatch: {
                                                value: e.target.value,
                                                err: ""
                                            }
                                        })
                                    }}
                                    className="mt-1.5 w-full border-1 rounded-lg py-1.5 px-3 border-neutral-200 outline-neutral-400 outline-offset-4"
                                >
                                    <option value="none" disabled selected>
                                        Select an entry...
                                    </option>
                                    <option value="ys">
                                        Sure, I would like to receive a confirmation.
                                    </option>
                                    <option value="ym">
                                        Yes, maybe I'll attend. I would like to receive a follow
                                        up email.
                                    </option>
                                    <option value="no">No, I'm not interested.</option>
                                </select>
                            </div>
                            <AnimatePresence>
                                {values.attendBizMatch.err && (
                                    <motion.div
                                        key={1}
                                        initial={{opacity: 0}}
                                        animate={{opacity: 1}}
                                        exit={{opacity: 0}}
                                        className="warn mt-[5px] flex items-center gap-2 text-xs text-red-600"
                                    >
                                        <AlertTriangle size="13px" className="shrink-0"/>
                                        {values.attendBizMatch.err}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div>
                                <label htmlFor="attended" className="font-[500] text-sm">
                                    Status
                                    <span className="font-[500] text-red-600">*</span>
                                </label>
                                <select
                                    name="attended"
                                    id=""
                                    value={values.attended.value}
                                    onChange={(e) => {
                                        setValues({
                                            ...values,
                                            attended: {
                                                value: e.target.value,
                                                err: ""
                                            }
                                        })
                                    }}
                                    className="mt-1.5 w-full border-1 rounded-lg py-1.5 px-3 border-neutral-200 outline-neutral-400 outline-offset-4"
                                >
                                    <option value="true">IN EVENT</option>
                                    <option value="false">NOT IN EVENT</option>
                                </select>
                            </div>
                            <div className="buttons flex justify-end">
                                <button
                                    onClick={() => {
                                        callback();
                                    }}
                                    className="px-5 bg-emerald-700 font-[700] mt-2 text-white w-max flex gap-2 items-center justify-center py-1.5 rounded-md text-sm"
                                >
                                    Upload Changes
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
            }
        </AnimatePresence>
    )
}