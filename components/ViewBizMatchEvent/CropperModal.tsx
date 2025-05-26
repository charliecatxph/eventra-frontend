import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

interface CropperModalProps {
  imageUrl: string;
  aspect?: number;
  onCrop: (croppedImage: string) => void;
  onClose: () => void;
  show: boolean;
}

export default function CropperModal({
  imageUrl,
  aspect = 1,
  onCrop,
  onClose,
  show,
}: CropperModalProps) {
  let cropperRef: any = null;

  const handleCrop = () => {
    if (cropperRef) {
      const croppedCanvas = cropperRef.getCroppedCanvas({
        width: 300,
        height: 300,
      });

      if (croppedCanvas) {
        const croppedImage = croppedCanvas.toDataURL();
        onCrop(croppedImage);
      }
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="overlay h-full w-full fixed top-0 left-0 z-[1000] bg-slate-900/80 overflow-y-auto py-5 px-5"
        >
          <div className="w-full min-h-screen grid place-items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: { delay: 0.2, duration: 0.2 },
              }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="form w-full max-w-[600px] bg-white rounded-xl overflow-hidden"
            >
              <div className="px-5 py-2 flex justify-between items-center bg-emerald-700 text-white">
                <h1 className="font-[700]">Crop Image</h1>
                <div
                  className="p-2 rounded-full w-max cursor-pointer"
                  onClick={onClose}
                >
                  <X size="15px" strokeWidth={5} />
                </div>
              </div>
              <div className="p-5">
                <div className="max-h-[400px] overflow-hidden">
                  <Cropper
                    src={imageUrl}
                    style={{ height: 400, width: "100%" }}
                    aspectRatio={aspect}
                    guides={true}
                    viewMode={1}
                    dragMode="move"
                    cropBoxMovable={true}
                    cropBoxResizable={true}
                    toggleDragModeOnDblclick={false}
                    autoCropArea={1}
                    background={false}
                    onInitialized={(instance) => {
                      cropperRef = instance;
                    }}
                    className="rounded-full"
                  />
                  <style jsx global>{`
                    .cropper-view-box,
                    .cropper-face {
                      border-radius: 50%;
                    }
                    .cropper-view-box {
                      box-shadow: 0 0 0 1px #39b54a;
                      outline: 0;
                    }
                    .cropper-face {
                      background-color: inherit !important;
                    }
                    .cropper-dashed,
                    .cropper-point.point-se,
                    .cropper-point.point-sw,
                    .cropper-point.point-nw,
                    .cropper-point.point-ne {
                      display: none !important;
                    }
                    .cropper-view-box {
                      outline: inherit !important;
                    }
                  `}</style>
                </div>
                <div className="buttons flex justify-end gap-2 mt-4">
                  <button
                    onClick={onClose}
                    className="px-5 bg-neutral-100 font-[500] text-neutral-700 w-max flex gap-2 items-center justify-center py-1.5 rounded-md text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCrop}
                    className="px-5 bg-emerald-700 font-[700] text-white w-max flex gap-2 items-center justify-center py-1.5 rounded-md text-sm"
                  >
                    Crop & Save
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
