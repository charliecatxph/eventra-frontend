import { CircleArrowOutUpRight } from "lucide-react";
import { motion } from "framer-motion";

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

interface SummaryComponent {
  pg1: OrganizationOwner;
  pg2: OrganizationInformationX;
}

export default function Summary({ pg1, pg2 }: SummaryComponent) {
  return (
    <>
      <section className="summary pb-[50px] geist px-5 pt-8">
        <div className="mt-5 step-icon p-5 rounded-2xl mx-auto bg-emerald-800 text-emerald-100 w-max">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, transition: { delay: 0.05 } }}
          >
            <CircleArrowOutUpRight />
          </motion.div>
        </div>
        <h1 className="mt-5 text-center text-2xl font-[600]">Review</h1>
        <p className="text-xs text-center mt-2">
          Review you Eventra registration here.
        </p>
        <div className="information text-xs flex flex-col gap-1 mt-5 border-1 rounded-md border-neutral-200">
          <div className="row flex flex-col px-5 py-2 border-b-1 border-neutral-200">
            <h1 className="font-[500]">First Name</h1>
            <p className="text-sm">{pg1.fn.value}</p>
          </div>
          <div className="row flex flex-col px-5 py-2 border-b-1 border-neutral-200">
            <h1 className="font-[500]">Last Name</h1>
            <p className="text-sm">{pg1.ln.value}</p>
          </div>
          <div className="row flex flex-col px-5 py-2">
            <h1 className="font-[500]">E-Mail</h1>
            <p className="text-sm">{pg1.email.value}</p>
          </div>
        </div>
        <div className="information text-xs flex flex-col gap-1 mt-5 border-1 rounded-md border-neutral-200">
          <div className="row flex flex-col px-5 py-2 border-b-1 border-neutral-200">
            <h1 className="font-[500]">Organization Name</h1>
            <p className="text-sm">{pg2.name.value}</p>
          </div>
          <div className="row flex flex-col px-5 py-2 border-b-1 border-neutral-200">
            <h1 className="font-[500]">Country</h1>
            <p className="text-sm">{pg2.country.value}</p>
          </div>
          <div className="row flex flex-col px-5 py-2">
            <h1 className="font-[500]">Website</h1>
            <p className="text-sm">
              {pg2.website.value ? pg2.website.value : "No website."}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
