import {
  ArrowUpRight,
  Briefcase,
  Check,
  Mail,
  Pencil,
  Trash,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { CircularProgress } from "@mui/material";
import { useModal } from "@/components/Modal/ModalContext";
import axios from "axios";
import { selectApp } from "@/features/appSlice";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
export default function AllClients({
  isFetching,
  data,
  setCurrentAttendeeRegistration,
}) {
  const router = useRouter();
  const modal = useModal();
  const appData = useSelector(selectApp);

  // Local function to handle client deletion
  const handleDeleteClient = (atnId: string, bzId: string) => {
    modal.show({
      type: "std",
      icon: <Trash />,
      title: "Delete Client",
      description:
        "Are you sure you want to delete this client? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      color: "error",
      onConfirm: () => {
        modal.hide();
        modal.show({
          type: "loading",
          title: "Deleting client...",
          description: "Please wait while we delete the client.",
          color: "error",
        });
        axios
          .post(
            `${process.env.NEXT_PUBLIC_API}/delete-client`,
            { atnId, bzId },
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${appData.acsTok}`,
              },
            }
          )
          .then(() => {
            modal.hide();
            modal.show({
              type: "std",
              icon: <Check />,
              title: "Client Deleted",
              description: "The client has been deleted successfully.",
              confirmText: "OK",
              color: "success",
              onConfirm: () => modal.hide(),
            });
          })
          .catch((e) => {
            modal.hide();
            modal.show({
              type: "std",
              icon: <Trash />,
              title: "Failed to Delete",
              description:
                e.response?.data?.err ||
                "An error occurred while deleting the client.",
              confirmText: "Try Again",
              cancelText: "Cancel",
              color: "error",
              onConfirm: () => {
                modal.hide();
                handleDeleteClient(atnId, bzId);
              },
              onCancel: () => modal.hide(),
            });
          });
      },
      onCancel: () => modal.hide(),
    });
  };

  return (
    <>
      <div className="flex flex-col ">
        {!isFetching && (
          <>
            <h1 className="flex gap-2 items-center text-sm font-[500]">
              <Briefcase size="15px" strokeWidth="2" />
              Clients
            </h1>
            {data.length === 0 && (
              <p className="text-center mt-10">No clients.</p>
            )}

            <AnimatePresence>
              {data.length !== 0 && (
                <>
                  <div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={1}
                      className="h-[400px] atendee-table mt-5 rounded-lg overflow-hidden border-1 border-neutral-200 overflow-y-scroll"
                    >
                      <div className="relative overflow-x-scroll w-full">
                        <div className="grid grid-cols-[1fr_1fr_auto] bg-white font-[500] geist text-xs">
                          <div className="contents">
                            <div className="p-3 font-[500] bg-neutral-100 whitespace-nowrap">
                              Organization / Represented By
                            </div>
                            <div className="p-3 font-[500] bg-neutral-100 whitespace-nowrap">
                              E-Mail
                            </div>

                            <div className="p-3  font-[500] bg-neutral-100 whitespace-nowrap sticky right-0 z-10">
                              Options
                            </div>
                          </div>

                          {data.map((d, i) => {
                            return (
                              <div
                                key={i}
                                className="contents border-b-1 border-neutral-200 font-[500] geist text-xs"
                              >
                                <div className="px-5 py-2 whitespace-nowrap">
                                  <div className="flex justify-center flex-col">
                                    <p className="truncate">{d.orgN}</p>

                                    <p className="font-[400] text-neutral-800 truncate flex items-center gap-1">
                                      {d.name}
                                    </p>
                                  </div>
                                </div>
                                <div className="px-5 py-2 flex items-center whitespace-nowrap">
                                  <p className="font-[400] flex gap-1 items-center truncate">
                                    <Mail size="12px" className="shrink-0" />
                                    {d.email}
                                  </p>
                                </div>

                                <div className="bg-white px-5 py-2 text-right flex items-center gap-2 justify-end sticky z-[10] right-0">
                                  <button
                                    onClick={() =>
                                      router.push(
                                        `/view-bz-event/${router.query.slug}?atnId=${d.id}`
                                      )
                                    }
                                    className="p-2 bg-white hover:bg-neutral-50 border-1 border-neutral-200 rounded-md"
                                  >
                                    <ArrowUpRight size="15px" />
                                  </button>

                                  <button
                                    onClick={() =>
                                      handleDeleteClient(
                                        d.id,
                                        d.bizmatcheventid
                                      )
                                    }
                                    className="p-2 bg-white hover:bg-neutral-50 border-1 border-neutral-200 rounded-md"
                                  >
                                    <Trash size="15px" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                    <p className="mt-5 font-[500] text-xs text-neutral-700">
                      Total of {data.length} client{data.length > 1 ? "s" : ""}
                    </p>
                  </div>
                </>
              )}
            </AnimatePresence>
          </>
        )}

        {isFetching && (
          <>
            <div className="h-[600px]">
              <div className="loading h-full w-full grid place-content-center">
                <CircularProgress
                  size={40}
                  thickness={3}
                  disableShrink
                  sx={{
                    color: "black", // spinner stroke
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
