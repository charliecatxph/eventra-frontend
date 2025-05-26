import { countriesKV } from "@/lib/constants/countries";

interface CountrySelectProps {
  value: string;
  onChangeCountry: (country: string) => void;
}

export default function CountrySelect({
  value,
  onChangeCountry,
}: CountrySelectProps) {
  return (
    <div>
      <label htmlFor="country" className="font-[500] text-sm">
        Country
        <span className="font-[500] text-red-600">*</span>
      </label>
      <select
        name="country"
        id="country-select"
        value={value}
        onChange={(e) => onChangeCountry(e.target.value)}
        className="mt-1.5 w-full border-1 rounded-lg py-1.5 px-3 border-neutral-200 outline-neutral-400 outline-offset-4"
      >
        <option value="none" disabled>
          Select a country...
        </option>
        {Object.entries(countriesKV).map(([code, name]) => (
          <option key={code} value={code}>
            {code} - {name}
          </option>
        ))}
      </select>
    </div>
  );
}
