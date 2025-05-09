import {ModalProvider} from "@/components/Modal/ModalContext";
import "@/styles/globals.css";
import type {AppProps} from "next/app";
import {Provider} from "react-redux";
import {store} from "@/features/store";
import Modal from "@/components/Modal/ModalSpec";

export default function App({Component, pageProps}: AppProps) {
    return (
        <Provider store={store}>
            <ModalProvider>
                <Component {...pageProps} />
                <Modal/>
            </ModalProvider>
        </Provider>
    );
}
