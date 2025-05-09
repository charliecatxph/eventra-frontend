import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";

interface UEC {
    block: () => boolean;
    exCb: () => void;
}

export function useExitConfirmation({block, exCb}: UEC) {
    const router = useRouter();

    const [pendingRoute, setPendingRoute] = useState<string | null>(null);
    const isNavigating = useRef(false);
    const isBlocking = useRef(false);

    useEffect(() => {
        const updateBlockingState = () => {
            isBlocking.current = block(); // Always get the latest value
        };

        const handleRouteChange = (url: string) => {
            if (!isBlocking.current) return;
            if (isNavigating.current) return;
            setPendingRoute(url);
            exCb();
            router.events.emit("routeChangeError");
            throw "Navigation blocked.";
        };

        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = "";
        };

        updateBlockingState();

        router.events.on("routeChangeStart", handleRouteChange);
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            router.events.off("routeChangeStart", handleRouteChange);
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [router, exCb]);

    const confirmExit = () => {
        if (pendingRoute) {
            isNavigating.current = true;
            router.push(pendingRoute);
        }
    };

    const cancelExit = () => {
        setPendingRoute(null);
    };

    return {confirmExit, cancelExit};
}
