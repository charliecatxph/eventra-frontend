import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ReactNode} from "react";
import {RootState} from "./store";

interface Modal {
    type: string;
    title: string;
    description?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    icon?: ReactNode | null;
}

const initialState: Modal = {
    type: "",
    title: "",
    description: "",
    onConfirm: () => {
    },
    onCancel: () => {
    },
    confirmText: "",
    cancelText: "",
    icon: null,
};

const modalSlice = createSlice({
    name: "modals",
    initialState,
    reducers: {
        showModal: (state, action: PayloadAction<Partial<Modal>>) => {
            state.icon = action.payload?.icon;
            state.title = action.payload?.title || "";
            state.description = action.payload?.description || "";
            state.confirmText = action.payload?.confirmText || "";
            state.cancelText = action.payload?.cancelText || "";
            state.onConfirm = action.payload?.onConfirm;
            state.onCancel = action.payload?.onCancel;
            state.type = action.payload.type || "";
        },
        closeModal: () => {
            return {...initialState};
        },
    },
});

export const {showModal, closeModal} = modalSlice.actions;
export const modalSelect = (state: RootState) => state.modal;
export default modalSlice.reducer;
