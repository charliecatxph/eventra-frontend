import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/features/store";
import { selectApp } from "@/features/appSlice";
import { appUpdate } from "@/features/appSlice";
import { useEffect } from "react";
import jwt from "jsonwebtoken";
import axios from "axios";

export function useSecureRoute(
  callback: () => void,
  callbackFail?: () => void
) {
  const router = useRouter();
  const appData = useSelector(selectApp);
  const dispatch = useDispatch<AppDispatch>();

  const fetchUserData = async () => {
    try {
      const req = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/get-user-data`,
        {},
        { withCredentials: true }
      );

      const decoded = jwt.decode(req.data.token);

      dispatch(
        appUpdate({
          fn: decoded.fn,
          ln: decoded.ln,
          email: decoded.email,
          org_name: decoded.org_name,
          country: decoded.country,
          website: decoded.website,
          logo: decoded.logo,
          acsTok: req.data.token,
          id: decoded.id,
        })
      );
      callback();
    } catch (e) {
      router.push("/login");
      callbackFail && callbackFail();
    }
  };

  useEffect(() => {
    if (
      !appData.acsTok ||
      !appData.country ||
      !appData.email ||
      !appData.fn ||
      !appData.ln ||
      !appData.logo ||
      !appData.org_name
    ) {
      fetchUserData();
    } else {
      callback();
    }
  }, [callback]);
}
