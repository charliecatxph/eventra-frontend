import Head from "next/head";
import ViewAllSuppliers from "@/components/Attend-BzEvent/ViewAllSuppliers";
import {
  bizmatchSlice,
  setSupplierAccount,
  setUser,
  setUserType,
} from "@/features/attendBizmatchSlice";
import { useDispatch, useSelector } from "react-redux";
import Login from "@/components/Attend-BzEvent/Login";
import { useEffect, useState } from "react";
import axios from "axios";
import jwt from "jsonwebtoken";
import { useRouter } from "next/router";
import SupplierMain from "@/components/Attend-BzEvent/Supplier/SupplierMain";

export default function AttendBizMatch() {
  const router = useRouter();
  const dispatch = useDispatch();
  const bizData = useSelector(bizmatchSlice);

  const { supplier } = router.query;

  const [render, setRender] = useState<boolean>(false);

  const userDefault = {
    isLoggedIn: false,
    id: "",
    bizmatcheventId: "",
    name: "",
    orgN: "",
    orgP: "",
    email: "",
    acsTok: "",
  };

  useEffect(() => {
    if (JSON.stringify(bizData.user) !== JSON.stringify(userDefault))
      return setRender(true);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API}/get-user-data-biz`,
        {},
        { withCredentials: true }
      )
      .then((d) => {
        const decode = jwt.decode(d.data.token);
        dispatch(
          setUser({
            isLoggedIn: true,
            id: decode.id,
            bizmatcheventId: decode.bizmatcheventId,
            name: decode.name,
            orgN: decode.orgN,
            orgP: decode.orgP,
            email: decode.email,
            acsTok: d.data.token,
          })
        );
        dispatch(setUserType("client"));

        setRender(true);
      })
      .catch((e) => {
        axios
          .post(
            `${process.env.NEXT_PUBLIC_API}/get-supplier-data-biz`,
            {},
            { withCredentials: true }
          )
          .then((d) => {
            const decode = jwt.decode(d.data.token);

            dispatch(
              setSupplierAccount({
                ...bizData.supplier,
                id: decode.id,
                isLoggedIn: true,
                bizmatcheventId: decode.bizmatcheventId,
                country: decode.country,
                description: decode.description,
                location: decode.location,
                logoSecUrl: decode.logoSecUrl,
                name: decode.name,
                website: decode.website,
                timeslots: [],
                open: decode.status.status,
                acsTok: d.data.token,
              })
            );
            dispatch(setUserType("supplier"));

            setRender(true);
          })
          .catch((e) => {
            setRender(true);
          });
      });
  }, []);

  if (!render) return <></>;

  return (
    <>
      <Head>
        <title>MPOF2025 BizMatch | Eventra</title>
        <link rel="icon" href="/assets/petalsfav/favicon.ico" />
      </Head>

      {!bizData.user.isLoggedIn && !bizData.supplier.isLoggedIn && <Login />}

      {!supplier &&
        bizData.user.isLoggedIn &&
        bizData.userType === "client" && <ViewAllSuppliers />}

      {bizData.userType === "supplier" && bizData.supplier.isLoggedIn && (
        <SupplierMain />
      )}
    </>
  );
}
