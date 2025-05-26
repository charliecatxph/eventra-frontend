import {ChevronLeft, ChevronRight} from "lucide-react";
import {useDispatch, useSelector} from "react-redux";
import {ordinaryEventData, setPageNumber} from "@/features/ordinaryEventSlice";

export default function EventraPagination() {
    const ordEvData = useSelector(ordinaryEventData)
    const dispatch = useDispatch();
    const renderPageNums = () => {
        let items = [];
        const net = Math.ceil(ordEvData.attendeeData.totalAtnSize / ordEvData.requests.limit);

        if (net <= 4) {
            for (let i = 0; i < net; i++) {
                items.push(
                    <div
                        onClick={() => dispatch(setPageNumber(i + 1))}
                        className={`${
                            ordEvData.requests.page === i + 1 ? "bg-emerald-700 text-white" : "hover:bg-emerald-50"
                        } font-[600] w-[40px] h-[40px] grid place-content-center text-sm border-1 border-neutral-200 rounded-lg`}
                    >
                        {i + 1}
                    </div>
                );
            }
        } else {
            if (ordEvData.requests.page > 4 && ordEvData.requests.page !== net) {
                items.push(
                    <div
                        onClick={() => dispatch(setPageNumber(1))}
                        className="hover:bg-emerald-50 font-[600] w-[40px] h-[40px] grid place-content-center text-sm border-1 border-neutral-200 rounded-lg"
                    >
                        {1}
                    </div>
                );
                items.push(
                    <div className="font-[600] w-[40px] h-[40px] grid place-content-center text-sm">
                        ...
                    </div>
                );
                items.push(
                    <div
                        className="hover:bg-emerald-800 bg-emerald-700 text-white font-[600] w-[40px] h-[40px] grid place-content-center text-sm border-1 border-neutral-200 rounded-lg">
                        {ordEvData.requests.page}
                    </div>
                );
                items.push(
                    <div className="font-[600] w-[40px] h-[40px] grid place-content-center text-sm">
                        ...
                    </div>
                );
                items.push(
                    <div
                        onClick={() => dispatch(setPageNumber(net))}
                        className=" hover:bg-emerald-50 font-[600] w-[40px] h-[40px] grid place-content-center text-sm border-1 border-neutral-200 rounded-lg"
                    >
                        {net}
                    </div>
                );
            } else if (ordEvData.requests.page === net) {
                items.push(
                    <div
                        onClick={() => dispatch(setPageNumber(1))}
                        className="hover:bg-emerald-50 font-[600] w-[40px] h-[40px] grid place-content-center text-sm border-1 border-neutral-200 rounded-lg"
                    >
                        {1}
                    </div>
                );
                items.push(
                    <div className="font-[600] w-[40px] h-[40px] grid place-content-center text-sm">
                        ...
                    </div>
                );
                items.push(
                    <div
                        className="hover:bg-emerald-800 bg-emerald-700 text-white font-[600] w-[40px] h-[40px] grid place-content-center text-sm border-1 border-neutral-200 rounded-lg">
                        {net}
                    </div>
                );
            } else {
                for (let i = 0; i < 4; i++) {
                    items.push(
                        <div
                            onClick={() => dispatch(setPageNumber(i + 1))}
                            className={`${
                                ordEvData.requests.page === i + 1
                                    ? "bg-emerald-700 text-white"
                                    : "hover:bg-emerald-50"
                            }  font-[600] w-[40px] h-[40px] grid place-content-center text-sm border-1 border-neutral-200 rounded-lg`}
                        >
                            {i + 1}
                        </div>
                    );
                }
                items.push(
                    <div className="font-[600] w-[40px] h-[40px] grid place-content-center text-sm">
                        ...
                    </div>
                );
                items.push(
                    <div
                        onClick={() => dispatch(setPageNumber(net))}
                        className=" hover:bg-emerald-50 font-[600] w-[40px] h-[40px] grid place-content-center text-sm border-1 border-neutral-200 rounded-lg"
                    >
                        {net}
                    </div>
                );
            }
        }

        return items;
    };
    return (
        <div className="select-none">
            {Math.ceil(ordEvData.attendeeData.totalAtnSize / ordEvData.requests.limit) > 1 && (
                <div className="flex items-center gap-2 mt-2 justify-center">
                    {ordEvData.requests.page !== 1 && (
                        <div
                            onClick={() => dispatch(setPageNumber(ordEvData.requests.page - 1))}
                            className="cursor-pointer flex gap-2 items-center px-5 h-[40px] text-sm font-[600] hover:bg-emerald-50 rounded-md"
                        >
                            <ChevronLeft size="18px"/> Previous
                        </div>
                    )}
                    {renderPageNums().map((d, i) => {
                        return <div className="cursor-pointer">{d}</div>;
                    })}
                    {ordEvData.requests.page !== Math.ceil(ordEvData.attendeeData.totalAtnSize / ordEvData.requests.limit) && (
                        <div
                            onClick={() => dispatch(setPageNumber(ordEvData.requests.page + 1))}
                            className="cursor-pointer flex gap-2 items-center px-5 h-[40px] text-sm font-[600] hover:bg-emerald-50 rounded-md"
                        >
                            Next
                            <ChevronRight size="18px"/>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
