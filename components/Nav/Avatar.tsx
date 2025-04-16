import { selectApp } from "@/features/appSlice";
import { useClickOutside } from "@/hooks/UseClickOutside";
import { useLogout } from "@/hooks/useLogout";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function Avatar() {
  const logout = useLogout();
  const appData = useSelector(selectApp);
  const [openProf, setOpenProf] = useState<boolean>(false);
  const rfx = useClickOutside<HTMLDivElement>(() => {
    setOpenProf(false);
  });
  return (
    <>
      <div className="pl-5 avatar h-full relative">
        <div
          onClick={() => {
            setOpenProf((pv) => !pv);
          }}
          className="xtc aspect-square h-full overflow-hidden rounded-full bg-red-600"
        >
          <img
            src={appData.logo}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        {openProf && (
          <div
            ref={rfx}
            className="absolute z-[999] top-[120%] right-0 bg-white w-[400px] px-2 py-1 border-1 border-neutral-200 rounded-md"
          >
            <div className="flex gap-5 items-center border-b-1 border-neutral-50 py-1.5">
              <div className="w-[30px] h-[30px] rounded-full overflow-hidden shrink-0">
                <img
                  src={appData.logo}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-[500]">{appData.org_name}</p>
                <p className="text-xs ">{appData.country}</p>
              </div>
            </div>
            <ul className="my-2">
              <li
                className="px-3 py-2 text-sm font-[500] hover:bg-neutral-50 rounded-lg"
                onClick={() => logout()}
              >
                Log Out
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
