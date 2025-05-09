const timezones = [
    {label: "(GMT-12:00) Baker Island", offset: 720},
    {label: "(GMT-11:00) American Samoa", offset: 660},
    {label: "(GMT-10:00) Honolulu", offset: 600},
    {label: "(GMT-9:00) Alaska", offset: 540},
    {label: "(GMT-8:00) Los Angeles", offset: 480},
    {label: "(GMT-7:00) Denver", offset: 420},
    {label: "(GMT-6:00) Chicago", offset: 360},
    {label: "(GMT-5:00) New York", offset: 300},
    {label: "(GMT-4:00) Santiago", offset: 240},
    {label: "(GMT-3:00) Buenos Aires", offset: 180},
    {label: "(GMT-2:00) South Georgia", offset: 120},
    {label: "(GMT-1:00) Azores", offset: 60},
    {label: "(GMT+0:00) London", offset: 0},
    {label: "(GMT+1:00) Berlin, Paris", offset: -60},
    {label: "(GMT+2:00) Cairo", offset: -120},
    {label: "(GMT+3:00) Moscow", offset: -180},
    {label: "(GMT+4:00) Dubai", offset: -240},
    {label: "(GMT+5:00) Karachi", offset: -300},
    {label: "(GMT+6:00) Dhaka", offset: -360},
    {label: "(GMT+7:00) Bangkok, Jakarta", offset: -420},
    {label: "(GMT+8:00) Beijing, Singapore, Manila", offset: -480},
    {label: "(GMT+9:00) Tokyo, Seoul", offset: -540},
    {label: "(GMT+10:00) Sydney", offset: -600},
    {label: "(GMT+11:00) Solomon Islands", offset: -660},
    {label: "(GMT+12:00) Auckland", offset: -720},
];

interface ChooseTimezoneProps {
    onChange: (offset: number) => void;
    value: number;
}

const ChooseTimezone: React.FC<ChooseTimezoneProps> = ({onChange, value}) => {
    return (
        <div className="w-full">
            <label htmlFor="timezone" className="font-[500] text-sm">
                Select Timezone <span className="font-[500] text-red-600">*</span>
            </label>
            <select
                id="timezone"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="mt-1.5 w-full border-1 rounded-lg py-1.5 px-3 border-neutral-200 outline-neutral-400 outline-offset-4"
            >
                {timezones.map((tz) => (
                    <option key={tz.label} value={tz.offset}>
                        {tz.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ChooseTimezone;
