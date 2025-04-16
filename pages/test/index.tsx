import { useModal } from "@/hooks/useModal";
import { ArrowUpRight, Check, TriangleAlert, X } from "lucide-react";
export default function Test() {
  const modal = useModal();

  const promiseTest = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject("OK");
      }, 5000);
    });
  };

  const open = () => {
    modal.promise(
      <ArrowUpRight />,
      "Upload Event",
      "You are uploading the event now.",
      () => {},
      () => {},
      "Upload",
      "Cancel",
      promiseTest,
      "Uploading event...",
      <Check />,
      "Upload complete",
      "Your event has been uploaded.",
      () => {},
      () => {},
      "Proceed",
      "Exit",
      <X />,
      "Fail",
      "We have failed to uploaded your event.",
      () => {},
      () => {},
      "Try again",
      "Exit"
    );
  };

  return (
    <>
      <button onClick={() => open()}>Show modal</button>
    </>
  );
}
