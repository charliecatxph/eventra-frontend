import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/features/store";
import { selectApp } from "@/features/appSlice";
import { appUpdate } from "@/features/appSlice";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import axios from "axios";

interface UserJWTPayload {
  fn: string;
  ln: string;
  email: string;
  org_name: string;
  country: string;
  website: string;
  logo: string;
  id: string;
}

export function redirectIfAuthenticated() {
  const router = useRouter();
  const appData = useSelector(selectApp);
  const dispatch = useDispatch<AppDispatch>();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const fetchUserData = async () => {
    try {
      const req = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/get-user-data`,
        {},
        { withCredentials: true }
      );

      const decoded = jwt.decode(req.data.token) as UserJWTPayload;

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

      router.push("/dashboard");
    } catch (e) {
      setIsAuthenticated(false);
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
      router.push("/dashboard");
    }
  }, []);

  return isAuthenticated;
}
