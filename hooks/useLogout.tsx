import {resetApp} from "@/features/appSlice";
import axios from "axios";
import {useRouter} from "next/router";
import {useDispatch} from "react-redux";

export const useLogout = () => {
    const dispatch = useDispatch();
    const router = useRouter();
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
    };
    return logout;
};
