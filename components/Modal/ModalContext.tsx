import {createContext, ReactNode, useContext, useState} from "react";
import {Modal} from "./Modal";
import {AnimatePresence} from "framer-motion";

type ModalTypes = "std" | "loading";

interface ModalOptions {
    type: ModalTypes;
    title: string;
    description?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    icon?: ReactNode | null;
    color: string;
}

interface ModalContextType {
    show: (options: ModalOptions) => void;
    hide: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({children}: { children: ReactNode }) => {
    const [modal, setModal] = useState<ModalOptions | null>(null);

    const show = (options: ModalOptions) => setModal(options);
    const hide = () => setModal(null);

    return (
        <ModalContext.Provider value={{show, hide}}>
            {children}
            <AnimatePresence>
                {modal?.type === "std" && <Modal {...modal} hide={hide}/>}
            </AnimatePresence>
            <AnimatePresence>
                {modal?.type === "loading" && <Modal {...modal} hide={hide}/>}
            </AnimatePresence>
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useModal must be used within a ModalProvider");
    }
    return context;
};
