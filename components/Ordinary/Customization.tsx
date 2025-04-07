import { ArrowRight } from "lucide-react";
import NumberInput from "../Inputs/NumberInput";
import { useEffect, useRef, useState } from "react";

export default function Customization({ data, onDataChange }) {
  const rfx = useRef<HTMLInputElement>(null);

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!data.coverFile.value) return;
    const imx = data.coverFile.value;
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageUrl(reader.result as string); // Set the preview URL as the image URL
    };

    reader.readAsDataURL(imx);
  }, [data.coverFile.value]);

  return (
    <>
      <section className="eventra-container-narrow pt-5">
        <div className="px-7 py-5 bg-white rounded-xl mt-5 flex gap-2 flex-col">
          <div className="flex items-start gap-5">
            <input
              type="file"
              onChange={(d) => {
                onDataChange({
                  ...data,
                  coverFile: {
                    value: d.target.files?.[0],
                    err: "",
                  },
                });
              }}
              className="hidden"
              ref={rfx}
              name=""
              id=""
            />
            <div className="w-1/2">
              <div
                className="overflow-hidden border-1 border-neutral-50 rounded-lg shadow-sm shadow-neutral-200  bg-red-50 aspect-video relative"
                onClick={() => rfx.current?.click()}
              >
                <img
                  src={imageUrl || null}
                  alt=""
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
              </div>
              <h1 className="text-sm font-[500] mt-2 text-center">
                Cover Image
              </h1>
            </div>
            <div className="w-1/2 flex gap-2 flex-col">
              <NumberInput
                identifier="limit"
                title="Event Capacity"
                value={data.atendeeLim.value}
                onInput={(d) => {
                  onDataChange({
                    ...data,
                    atendeeLim: {
                      value: parseInt(d),
                      err: "",
                    },
                  });
                }}
                error=""
              />
              <div>
                <label htmlFor="timezone" className="font-[500] text-sm">
                  Allow Walk-In?
                  <span className="font-[500] text-red-600">*</span>
                </label>
                <select
                  id="timezone"
                  value={data.allowWalkIn.value}
                  onChange={(d) => {
                    onDataChange({
                      ...data,
                      allowWalkIn: {
                        value: d.target.value,
                        err: "",
                      },
                    });
                  }}
                  className="mt-1.5 w-full border-1 rounded-lg py-1.5 px-3 border-neutral-200 outline-neutral-400 outline-offset-4"
                >
                  <option value="true">Yes, allow walk in.</option>
                  <option value="false">No, don't allow.</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
