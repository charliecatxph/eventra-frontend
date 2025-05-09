import {ChevronLeft, ChevronRight} from "lucide-react";

interface EventraPaginationParams {
    dataSize: number;
    limit: number;
    currPage: number;
    onPageNumberClick: (d: number) => void;
}

export default function EventraPagination({
                                              dataSize,
                                              limit,
                                              currPage,
                                              onPageNumberClick,
                                          }: EventraPaginationParams) {
    const renderPageNums = () => {
        let items = [];
        const net = Math.ceil(dataSize / limit);

        if (net <= 4) {
            for (let i = 0; i < net; i++) {
                items.push(
                    <div
                        onClick={() => onPageNumberClick(i + 1)}
                        className={`${
                            currPage === i + 1 ? "bg-black text-white" : "hover:bg-neutral-50"
                        } font-[600] w-[40px] h-[40px] grid place-content-center text-sm border-1 border-neutral-200 rounded-lg`}
                    >
                        {i + 1}
                    </div>
                );
            }
        } else {
            if (currPage > 4 && currPage !== net) {
                items.push(
                    <div
                        onClick={() => onPageNumberClick(1)}
                        className="hover:bg-neutral-50 font-[600] w-[40px] h-[40px] grid place-content-center text-sm border-1 border-neutral-200 rounded-lg"
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
                        className="hover:bg-neutral-900 bg-black text-white font-[600] w-[40px] h-[40px] grid place-content-center text-sm border-1 border-neutral-200 rounded-lg">
                        {currPage}
                    </div>
                );
                items.push(
                    <div className="font-[600] w-[40px] h-[40px] grid place-content-center text-sm">
                        ...
                    </div>
                );
                items.push(
                    <div
                        onClick={() => onPageNumberClick(net)}
                        className=" hover:bg-neutral-50 font-[600] w-[40px] h-[40px] grid place-content-center text-sm border-1 border-neutral-200 rounded-lg"
                    >
                        {net}
                    </div>
                );
            } else if (currPage === net) {
                items.push(
                    <div
                        onClick={() => onPageNumberClick(1)}
                        className="hover:bg-neutral-50 font-[600] w-[40px] h-[40px] grid place-content-center text-sm border-1 border-neutral-200 rounded-lg"
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
                        className="hover:bg-neutral-900 bg-black text-white font-[600] w-[40px] h-[40px] grid place-content-center text-sm border-1 border-neutral-200 rounded-lg">
                        {net}
                    </div>
                );
            } else {
                for (let i = 0; i < 4; i++) {
                    items.push(
                        <div
                            onClick={() => onPageNumberClick(i + 1)}
                            className={`${
                                currPage === i + 1
                                    ? "bg-black text-white"
                                    : "hover:bg-neutral-50"
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
                        onClick={() => onPageNumberClick(net)}
                        className=" hover:bg-neutral-50 font-[600] w-[40px] h-[40px] grid place-content-center text-sm border-1 border-neutral-200 rounded-lg"
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
            {Math.ceil(dataSize / limit) > 1 && (
                <div className="flex items-center gap-2 mt-2 justify-center">
                    {currPage !== 1 && (
                        <div
                            onClick={() => onPageNumberClick(currPage - 1)}
                            className="cursor-pointer flex gap-2 items-center px-5 h-[40px] text-sm font-[600] hover:bg-neutral-50 rounded-md"
                        >
                            <ChevronLeft size="18px"/> Previous
                        </div>
                    )}
                    {renderPageNums().map((d, i) => {
                        return <div className="cursor-pointer">{d}</div>;
                    })}
                    {currPage !== Math.ceil(dataSize / limit) && (
                        <div
                            onClick={() => onPageNumberClick(currPage + 1)}
                            className="cursor-pointer flex gap-2 items-center px-5 h-[40px] text-sm font-[600] hover:bg-neutral-50 rounded-md"
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
