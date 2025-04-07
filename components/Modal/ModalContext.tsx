import { createContext, useContext, useState, ReactNode } from "react";
import { Modal } from "./Modal";
import { AnimatePresence } from "framer-motion";

type ModalOptions = {
  icon?: ReactNode;
  title?: string;
  content?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  hide?: () => void;
  color: string;
};

type ModalContextType = {
  show: (options: ModalOptions) => void;
  hide: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modal, setModal] = useState<ModalOptions | null>(null);

  const show = (options: ModalOptions) => setModal(options);
  const hide = () => setModal(null);

  return (
    <ModalContext.Provider value={{ show, hide }}>
      {children}
      <AnimatePresence>
        {modal && <Modal {...modal} hide={hide} />}
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
