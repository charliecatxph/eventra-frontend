import {resetApp} from "@/features/appSlice";
import {useModal} from "@/hooks/useModal";
import axios from "axios";
import {Check, DoorOpen, X} from "lucide-react";
import {useRouter} from "next/router";
import {useDispatch} from "react-redux";

export const useLogout = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const modal = useModal();
    const logout = () => {
        const rqx = () => {
            return new Promise(async (resolve, reject) => {
                try {
                    await axios
                        .post(
                            `${process.env.NEXT_PUBLIC_API}/logout`,
                            {},
                            {withCredentials: true}
                        )
                        .catch((e) => {
                            throw new Error("Fail to log out user.");
                        });

                    dispatch(resetApp());
                    resolve("OK");
                } catch (e: any) {
                    reject(e.message);
                }
            });
        };

        modal.promise(
            <DoorOpen/>,
            "Log Out",
            `If you have any tasks ongoing, save or close them first before logging out.`,
            () => {
            },
            () => {
            },
            "Logout",
            "Cancel",
            () => rqx().then((e) => router.push("/login")),
            "Logging out...",
            <Check/>,
            "You have been logged out.",
            "Your log in information has been cleared, you have to log in again.",
            () => {
            },
            () => {
            },
            "Proceed",
            "",
            <X/>,
            "Fail",
            "Fail to log out.",
            () => {
                logout();
            },
            () => {
            },
            "Try again",
            "Exit"
        );
    };
    return logout;
};
