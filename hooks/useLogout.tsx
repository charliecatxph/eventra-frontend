import { useModal } from "@/components/Modal/ModalContext";
import { resetApp } from "@/features/appSlice";
import axios from "axios";
import { LogOut } from "lucide-react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

export const useLogout = () => {
  const modal = useModal();
  const dispatch = useDispatch();
  const router = useRouter();
  const logout = () => {
    const rqx = () => {
      return new Promise(async (resolve, reject) => {
        try {
          modal.show({
            type: "std",
            title: "Log Out",
            description: "Are you sure you want to log out?",
            onConfirm: async () => {
              modal.hide();
              modal.show({
                type: "loading",
                title: "Logging out...",
                color: "neutral",
              });
              await axios
                .post(
                  `${process.env.NEXT_PUBLIC_API}/logout`,
                  {},
                  { withCredentials: true }
                )
                .catch((e) => {
                  throw new Error("Fail to log out user.");
                });
              modal.hide();
              dispatch(resetApp());
              router.push("/login");
              resolve("OK");
            },
            confirmText: "OK",
            color: "error",
            onCancel: () => {
              modal.hide();
            },
            cancelText: "Cancel",
            icon: <LogOut />,
          });
        } catch (e: any) {
          reject(e.message);
        }
      });
    };
    rqx();
  };
  return logout;
};
