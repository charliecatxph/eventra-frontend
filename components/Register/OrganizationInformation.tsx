import { Building2 } from "lucide-react";
import { motion } from "framer-motion";
import TextInput from "../Inputs/TextInput";
import SelectCountry from "../CountrySelector/SelectCountry";
import ImageUploadWithCrop from "../Inputs/ImageUploadWithCrop";
import "cropperjs/dist/cropper.css";

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

interface OrganizationInformationComponent {
  data: OrganizationInformationX;
  onDataChange: (dt: OrganizationInformationX) => void;
}

export default function OrganizationInformation({
  data,
  onDataChange,
}: OrganizationInformationComponent) {
  return (
    <>
      <div className="pg-2 px-5 geist pb-[100px]">
        <section className="pt-8">
          <div className="mt-5 step-icon p-5 rounded-2xl mx-auto bg-emerald-800 text-emerald-100 w-max">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1, transition: { delay: 0.05 } }}
            >
              <Building2 />
            </motion.div>
          </div>
          <h1 className="mt-5 text-center text-2xl font-[600]">
            Organization Owner
          </h1>
          <p className="text-xs text-center mt-2">
            Enter your organization information below.
          </p>
          <div className="mt-5">
            <TextInput
              identifier="org-name"
              title="Name"
              value={data.name.value}
              placeholder="CTX Technologies"
              onInput={(d) => {
                onDataChange({
                  ...data,
                  name: {
                    value: d,
                    err: "",
                  },
                });
              }}
              error={data.name.err}
              req
            />
            <SelectCountry
              onInput={(d) => {
                onDataChange({
                  ...data,
                  country: {
                    value: d,
                    err: "",
                  },
                });
              }}
              value={data.country.value}
              error={data.country.err}
            />
            <TextInput
              identifier="website"
              title="Website"
              value={data.website.value}
              placeholder="www.ctxph.com"
              onInput={(d) => {
                onDataChange({
                  ...data,
                  website: {
                    value: d,
                    err: "",
                  },
                });
              }}
              error={data.website.err}
            />

            <ImageUploadWithCrop
              currentImage={data.logo.value}
              onChange={(d) => {
                onDataChange({
                  ...data,
                  logo: {
                    value: d,
                    err: "",
                  },
                });
              }}
              error={data.logo.err}
            />
          </div>
        </section>
      </div>
    </>
  );
}
