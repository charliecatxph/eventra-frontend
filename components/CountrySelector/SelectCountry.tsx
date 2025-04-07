import { useClickOutside } from "@/hooks/UseClickOutside";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowUpDown,
  ChevronsUpDown,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
interface SelectCountry {
  onInput: (v: string) => void;
  value: string;
  error: string;
}

interface Country {
  name: string;
  emoji: string;
}

const countries = [
  { name: "Afghanistan", emoji: "🇦🇫" },
  { name: "Albania", emoji: "🇦🇱" },
  { name: "Algeria", emoji: "🇩🇿" },
  { name: "Andorra", emoji: "🇦🇩" },
  { name: "Angola", emoji: "🇦🇴" },
  { name: "Antigua & Barbuda", emoji: "🇦🇬" },
  { name: "Argentina", emoji: "🇦🇷" },
  { name: "Armenia", emoji: "🇦🇲" },
  { name: "Australia", emoji: "🇦🇺" },
  { name: "Austria", emoji: "🇦🇹" },
  { name: "Azerbaijan", emoji: "🇦🇿" },
  { name: "Bahamas", emoji: "🇧🇸" },
  { name: "Bahrain", emoji: "🇧🇭" },
  { name: "Bangladesh", emoji: "🇧🇩" },
  { name: "Barbados", emoji: "🇧🇧" },
  { name: "Belarus", emoji: "🇧🇾" },
  { name: "Belgium", emoji: "🇧🇪" },
  { name: "Belize", emoji: "🇧🇿" },
  { name: "Benin", emoji: "🇧🇯" },
  { name: "Bhutan", emoji: "🇧🇹" },
  { name: "Bolivia", emoji: "🇧🇴" },
  { name: "Bosnia & Herzegovina", emoji: "🇧🇦" },
  { name: "Botswana", emoji: "🇧🇼" },
  { name: "Brazil", emoji: "🇧🇷" },
  { name: "Brunei", emoji: "🇧🇳" },
  { name: "Bulgaria", emoji: "🇧🇬" },
  { name: "Burkina Faso", emoji: "🇧🇫" },
  { name: "Burundi", emoji: "🇧🇮" },
  { name: "Cabo Verde", emoji: "🇨🇻" },
  { name: "Cambodia", emoji: "🇰🇭" },
  { name: "Cameroon", emoji: "🇨🇲" },
  { name: "Canada", emoji: "🇨🇦" },
  { name: "Central African Republic", emoji: "🇨🇫" },
  { name: "Chad", emoji: "🇹🇩" },
  { name: "Chile", emoji: "🇨🇱" },
  { name: "China", emoji: "🇨🇳" },
  { name: "Colombia", emoji: "🇨🇴" },
  { name: "Comoros", emoji: "🇰🇲" },
  { name: "Congo", emoji: "🇨🇬" },
  { name: "Costa Rica", emoji: "🇨🇷" },
  { name: "Côte d'Ivoire", emoji: "🇨🇮" },
  { name: "Croatia", emoji: "🇭🇷" },
  { name: "Cuba", emoji: "🇨🇺" },
  { name: "Cyprus", emoji: "🇨🇾" },
  { name: "Czech Republic", emoji: "🇨🇿" },
  { name: "Denmark", emoji: "🇩🇰" },
  { name: "Djibouti", emoji: "🇩🇯" },
  { name: "Dominica", emoji: "🇩🇲" },
  { name: "Dominican Republic", emoji: "🇩🇴" },
  { name: "DR Congo", emoji: "🇨🇩" },
  { name: "Ecuador", emoji: "🇪🇨" },
  { name: "Egypt", emoji: "🇪🇬" },
  { name: "El Salvador", emoji: "🇸🇻" },
  { name: "Equatorial Guinea", emoji: "🇬🇶" },
  { name: "Eritrea", emoji: "🇪🇷" },
  { name: "Estonia", emoji: "🇪🇪" },
  { name: "Eswatini", emoji: "🇸🇿" },
  { name: "Ethiopia", emoji: "🇪🇹" },
  { name: "Fiji", emoji: "🇫🇯" },
  { name: "Finland", emoji: "🇫🇮" },
  { name: "France", emoji: "🇫🇷" },
  { name: "Gabon", emoji: "🇬🇦" },
  { name: "Gambia", emoji: "🇬🇲" },
  { name: "Georgia", emoji: "🇬🇪" },
  { name: "Germany", emoji: "🇩🇪" },
  { name: "Ghana", emoji: "🇬🇭" },
  { name: "Greece", emoji: "🇬🇷" },
  { name: "Grenada", emoji: "🇬🇩" },
  { name: "Guatemala", emoji: "🇬🇹" },
  { name: "Guinea", emoji: "🇬🇳" },
  { name: "Guinea-Bissau", emoji: "🇬🇼" },
  { name: "Guyana", emoji: "🇬🇾" },
  { name: "Haiti", emoji: "🇭🇹" },
  { name: "Holy See", emoji: "🇻🇦" },
  { name: "Honduras", emoji: "🇭🇳" },
  { name: "Hungary", emoji: "🇭🇺" },
  { name: "Iceland", emoji: "🇮🇸" },
  { name: "India", emoji: "🇮🇳" },
  { name: "Indonesia", emoji: "🇮🇩" },
  { name: "Iran", emoji: "🇮🇷" },
  { name: "Iraq", emoji: "🇮🇶" },
  { name: "Ireland", emoji: "🇮🇪" },
  { name: "Israel", emoji: "🇮🇱" },
  { name: "Italy", emoji: "🇮🇹" },
  { name: "Jamaica", emoji: "🇯🇲" },
  { name: "Japan", emoji: "🇯🇵" },
  { name: "Jordan", emoji: "🇯🇴" },
  { name: "Kazakhstan", emoji: "🇰🇿" },
  { name: "Kenya", emoji: "🇰🇪" },
  { name: "Kiribati", emoji: "🇰🇮" },
  { name: "Kuwait", emoji: "🇰🇼" },
  { name: "Kyrgyzstan", emoji: "🇰🇬" },
  { name: "Laos", emoji: "🇱🇸" },
  { name: "Latvia", emoji: "🇱🇻" },
  { name: "Lebanon", emoji: "🇱🇧" },
  { name: "Lesotho", emoji: "🇱🇸" },
  { name: "Liberia", emoji: "🇱🇷" },
  { name: "Libya", emoji: "🇱🇾" },
  { name: "Liechtenstein", emoji: "🇱🇮" },
  { name: "Lithuania", emoji: "🇱🇹" },
  { name: "Luxembourg", emoji: "🇱🇺" },
  { name: "Madagascar", emoji: "🇲🇬" },
  { name: "Malawi", emoji: "🇲🇼" },
  { name: "Malaysia", emoji: "🇲🇾" },
  { name: "Maldives", emoji: "🇲🇻" },
  { name: "Mali", emoji: "🇲🇱" },
  { name: "Malta", emoji: "🇲🇹" },
  { name: "Marshall Islands", emoji: "🇲🇭" },
  { name: "Mauritania", emoji: "🇲🇷" },
  { name: "Mauritius", emoji: "🇲🇺" },
  { name: "Mexico", emoji: "🇲🇽" },
  { name: "Micronesia", emoji: "🇲🇸" },
  { name: "Moldova", emoji: "🇲🇩" },
  { name: "Monaco", emoji: "🇲🇨" },
  { name: "Mongolia", emoji: "🇲🇳" },
  { name: "Montenegro", emoji: "🇲🇪" },
  { name: "Morocco", emoji: "🇲🇦" },
  { name: "Mozambique", emoji: "🇲🇿" },
  { name: "Myanmar", emoji: "🇲🇲" },
  { name: "Namibia", emoji: "🇳🇦" },
  { name: "Nauru", emoji: "🇳🇷" },
  { name: "Nepal", emoji: "🇳🇵" },
  { name: "Netherlands", emoji: "🇳🇱" },
  { name: "New Zealand", emoji: "🇳🇿" },
  { name: "Nicaragua", emoji: "🇳🇮" },
  { name: "Niger", emoji: "🇳🇪" },
  { name: "Nigeria", emoji: "🇳🇬" },
  { name: "North Korea", emoji: "🇰🇵" },
  { name: "North Macedonia", emoji: "🇲🇰" },
  { name: "Norway", emoji: "🇳🇴" },
  { name: "Oman", emoji: "🇴🇲" },
  { name: "Pakistan", emoji: "🇵🇰" },
  { name: "Palau", emoji: "🇵🇼" },
  { name: "Panama", emoji: "🇵🇦" },
  { name: "Papua New Guinea", emoji: "🇵🇬" },
  { name: "Paraguay", emoji: "🇵🇾" },
  { name: "Peru", emoji: "🇵🇪" },
  { name: "Philippines", emoji: "🇵🇭" },
  { name: "Poland", emoji: "🇵🇱" },
  { name: "Portugal", emoji: "🇵🇹" },
  { name: "Qatar", emoji: "🇶🇦" },
  { name: "Romania", emoji: "🇷🇴" },
  { name: "Russia", emoji: "🇷🇺" },
  { name: "Rwanda", emoji: "🇷🇼" },
  { name: "Saint Kitts & Nevis", emoji: "🇰🇳" },
  { name: "Saint Lucia", emoji: "🇱🇨" },
  { name: "Samoa", emoji: "🇼🇸" },
  { name: "San Marino", emoji: "🇸🇲" },
  { name: "São Tomé & Príncipe", emoji: "🇸🇹" },
  { name: "Saudi Arabia", emoji: "🇸🇦" },
  { name: "Senegal", emoji: "🇸🇳" },
  { name: "Serbia", emoji: "🇷🇸" },
  { name: "Seychelles", emoji: "🇸🇨" },
  { name: "Sierra Leone", emoji: "🇱🇸" },
  { name: "Singapore", emoji: "🇸🇬" },
  { name: "Slovakia", emoji: "🇸🇰" },
  { name: "Slovenia", emoji: "🇸🇮" },
  { name: "Solomon Islands", emoji: "🇸🇧" },
  { name: "Somalia", emoji: "🇸🇴" },
  { name: "South Africa", emoji: "🇿🇦" },
  { name: "South Korea", emoji: "🇰🇷" },
  { name: "South Sudan", emoji: "🇸🇸" },
  { name: "Spain", emoji: "🇪🇸" },
  { name: "Sri Lanka", emoji: "🇱🇰" },
  { name: "St. Vincent & Grenadines", emoji: "🇻🇨" },
  { name: "State of Palestine", emoji: "🇵🇸" },
  { name: "Sudan", emoji: "🇸🇩" },
  { name: "Suriname", emoji: "🇸🇷" },
  { name: "Sweden", emoji: "🇸🇪" },
  { name: "Switzerland", emoji: "🇨🇭" },
  { name: "Syria", emoji: "🇸🇾" },
  { name: "Tajikistan", emoji: "🇹🇯" },
  { name: "Tanzania", emoji: "🇹🇿" },
  { name: "Thailand", emoji: "🇹🇭" },
  { name: "Timor-Leste", emoji: "🇹🇱" },
  { name: "Togo", emoji: "🇹🇬" },
  { name: "Tonga", emoji: "🇹🇴" },
  { name: "Trinidad & Tobago", emoji: "🇹🇹" },
  { name: "Tunisia", emoji: "🇹🇳" },
  { name: "Turkey", emoji: "🇹🇷" },
  { name: "Turkmenistan", emoji: "🇹🇲" },
  { name: "Tuvalu", emoji: "🇹🇻" },
  { name: "Uganda", emoji: "🇺🇬" },
  { name: "Ukraine", emoji: "🇺🇦" },
  { name: "United Arab Emirates", emoji: "🇦🇪" },
  { name: "United Kingdom", emoji: "🇬🇧" },
  { name: "United States", emoji: "🇺🇸" },
  { name: "Uruguay", emoji: "🇺🇾" },
  { name: "Uzbekistan", emoji: "🇺🇿" },
  { name: "Vanuatu", emoji: "🇻🇺" },
  { name: "Venezuela", emoji: "🇻🇪" },
  { name: "Vietnam", emoji: "🇻🇳" },
  { name: "Yemen", emoji: "🇾🇪" },
  { name: "Zambia", emoji: "🇿🇲" },
  { name: "Zimbabwe", emoji: "🇿🇼" },
];

export default function SelectCountry({
  onInput,
  value,
  error,
}: SelectCountry) {
  const [activate, setActivate] = useState<boolean>(false);
  const [searchCountry, setSearchCountry] = useState<Country[]>([]);
  const rrf = useClickOutside<HTMLDivElement>(() => setActivate(false));
  const [local, setLocal] = useState<string>("");

  useEffect(() => {
    if (!local) {
      setSearchCountry(countries);
      return;
    }

    const results = [];
    for (let i = 0; i < countries.length; i++) {
      if (countries[i].name.toLowerCase().indexOf(local.toLowerCase()) !== -1) {
        results.push(countries[i]);
      }
    }

    setSearchCountry(results);
  }, [local]);
  return (
    <>
      <div className="relative">
        <div>
          <label htmlFor="country" className="font-[500] text-sm">
            Country<span className="font-[500] text-red-600">*</span>
          </label>
          <div
            onClick={() => setActivate(!activate)}
            className="mt-1.5 w-full border-1 rounded-lg py-1.5 px-3 border-neutral-200 outline-neutral-400 outline-offset-4 flex gap-2 justify-between items-center text-neutral-500"
          >
            <p className={value && "text-black"}>
              {value ? value : "Select Country"}
            </p>
            <ChevronsUpDown size="16px" />
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                key={1}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="warn mt-[5px] flex items-center gap-2 text-xs text-red-600"
              >
                <AlertTriangle size="13px" className="shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {activate && (
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              key={1}
              ref={rrf}
              className="absolute top-[110%] z-[9999] text-sm bg-white border-1 border-neutral-200 rounded-md overflow-hidden w-full"
            >
              <div className="text-neutral-200 px-3 py-1.5 border-b-1 border-neutral-200">
                <div className="flex items-center gap-2">
                  <Search size="14px" />
                  <input
                    type="text"
                    placeholder="Search for a country..."
                    className="grow-1 text-black focus:outline-none"
                    onInput={(e) => {
                      setLocal((e.target as HTMLInputElement).value);
                    }}
                  />
                </div>
              </div>
              <ul className="max-h-[200px] overflow-y-scroll">
                {searchCountry.length === 0 ? (
                  <li className="p-3 text-xs border-b-1 border-neutral-200">
                    No countries found on query.
                  </li>
                ) : (
                  searchCountry.map((d, i) => {
                    return (
                      <li
                        className="hover:bg-emerald-700 text-xs hover:text-emerald-100 p-3 border-b-1 border-neutral-200"
                        key={i}
                        onClick={() => {
                          onInput(`${d.name}`);
                          setActivate(false);
                        }}
                      >
                        {d.emoji} {d.name}
                      </li>
                    );
                  })
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
