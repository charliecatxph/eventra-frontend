import {useDispatch} from "react-redux";
import {closeModal, showModal} from "../features/modalStore";
import {AppDispatch} from "../features/store";
import {ReactNode} from "react";

export const useModal = () => {
    const dispatch = useDispatch<AppDispatch>();

    const info = (
        title: string,
        description: string,
        onConfirm?: () => void,
        onCancel?: () => void,
        confirmText?: string,
        cancelText?: string,
        icon?: ReactNode,
        type?: string
    ) => {
        dispatch(
            showModal({
                title: title,
                description: description,
                onConfirm: () => {
                    onConfirm && onConfirm();
                    dispatch(closeModal());
                },
                onCancel: () => {
                    onCancel && onCancel();
                    dispatch(closeModal());
                },
                confirmText: confirmText,
                cancelText: cancelText,
                icon: icon,
                type: type,
            })
        );
    };

    const promise = (
        iconStart: ReactNode,
        startTitle: string,
        startDescription: string,
        startOnConfirm: () => void,
        startOnCancel: () => void,
        startConfirmBtnText: string,
        startCancelBtnText: string,
        promise: () => Promise<any>,
        promiseText: string,
        iconSuccess: ReactNode,
        successTitle: string,
        successDescription: string,
        successOnConfirm: () => void,
        successOnCancel: () => void,
        successConfirmBtnText: string,
        successCancelBtnText: string,
        iconFail: ReactNode,
        failTitle: string,
        failDescription: string,
        failOnConfirm: () => void,
        failOnCancel: () => void,
        failConfirmBtnText: string,
        failCancelBtnText: string
    ) => {
        dispatch(
            showModal({
                title: startTitle,
                description: startDescription,
                onConfirm: async () => {
                    try {
                        dispatch(closeModal());

                        const xtl = async () => {
                            dispatch(
                                showModal({
                                    title: promiseText,
                                    type: "loading",
                                })
                            );
                            await promise();
                        };

                        const xtl2 = await xtl().catch((e) => {
                            throw new Error(e.message);
                        });

                        dispatch(closeModal());
                        dispatch(
                            showModal({
                                title: successTitle,
                                description: successDescription,
                                onConfirm: async () => {
                                    successOnConfirm();
                                    dispatch(closeModal());
                                },
                                onCancel: () => {
                                    successOnCancel();
                                    dispatch(closeModal());
                                },
                                confirmText: successConfirmBtnText,
                                cancelText: successCancelBtnText,
                                icon: iconSuccess,
                                type: "ok",
                            })
                        );
                    } catch (e) {
                        dispatch(closeModal());
                        dispatch(
                            showModal({
                                title: failTitle,
                                description: e.message,
                                onConfirm: async () => {
                                    failOnConfirm();
                                },
                                onCancel: () => {
                                    failOnCancel();
                                    dispatch(closeModal());
                                },
                                confirmText: failConfirmBtnText,
                                cancelText: failCancelBtnText,
                                icon: iconFail,
                                type: "fail",
                            })
                        );
                    }
                },
                onCancel: () => {
                    startOnCancel();
                    dispatch(closeModal());
                },
                confirmText: startConfirmBtnText,
                cancelText: startCancelBtnText,
                icon: iconStart,
                type: "initial",
            })
        );
    };

    //   const confirm = (message: string, onConfirm: () => void) => {
    //     dispatch(showConfirm({ message }));
    //     dispatch(setOnConfirm(() => onConfirm));
    //   };

    //   const promise = async ({
    //     message,
    //     asyncFn,
    //     successMessage,
    //     errorMessage,
    //   }: {
    //     message: string;
    //     asyncFn: () => Promise<any>;
    //     successMessage?: string;
    //     errorMessage?: string;
    //   }) => {
    //     dispatch(showConfirm({ message }));
    //     dispatch(
    //       setOnConfirm(async () => {
    //         dispatch(startLoading());
    //         try {
    //           await asyncFn();
    //           dispatch(showSuccess(successMessage ?? 'Success'));
    //         } catch (err) {
    //           dispatch(showError(errorMessage ?? 'Something went wrong'));
    //         }
    //         setTimeout(() => dispatch(hideModal()), 2000);
    //       })
    //     );
    //   };

    const close = () => {
        dispatch(closeModal());
    };

    return {info, close, promise};
};
