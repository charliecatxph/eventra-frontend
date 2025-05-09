import {AlertTriangle, Crop, Upload} from "lucide-react";
import {createRef, useRef, useState} from "react";
import {Cropper, ReactCropperElement} from "react-cropper";
import {AnimatePresence, motion} from "framer-motion";

interface ImageUploadWithCrop {
    currentImage: string;
    onChange: (v: string) => void;
    error: string;
}

export default function ImageUploadWithCrop({
                                                currentImage,
                                                onChange,
                                                error,
                                            }: ImageUploadWithCrop) {
    const logoRef = useRef<HTMLInputElement | null>(null);
    const [tempLogo, setTempLogo] = useState<any>("");

    const cropperRef = createRef<ReactCropperElement>();

    const handleLogoUpload = (e: any) => {
        if (!e.target?.files[0]) return;
        e.preventDefault();

        onChange("");
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setTempLogo(reader.result as any);
        };
        reader.readAsDataURL(files[0]);
    };

    const getCropData = () => {
        if (typeof cropperRef.current?.cropper !== "undefined") {
            onChange(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
            setTempLogo("");
        }
    };
    return (
        <>
            <div className="input-box aspect-square w-full">
                <label htmlFor="ev-f" className="font-[500] text-sm">
                    Company Logo
                </label>
                <input
                    type="file"
                    name="ev-f"
                    id=""
                    ref={logoRef}
                    className="hidden"
                    onChange={handleLogoUpload}
                />
                <div
                    onClick={() => {
                        !tempLogo ? !currentImage && logoRef.current?.click() : "";
                    }}
                    className="upload-body relative overflow-hidden aspect-square w-full mt-1.5 border-1 border-neutral-200 border-dashed rounded-md grid place-content-center"
                >
                    {!currentImage ? (
                        tempLogo ? (
                            <Cropper
                                ref={cropperRef}
                                style={{height: 200, width: "100%"}}
                                zoomTo={0.5}
                                initialAspectRatio={1}
                                aspectRatio={1}
                                src={tempLogo || ""}
                                viewMode={1}
                                minCropBoxHeight={10}
                                minCropBoxWidth={10}
                                background={false}
                                responsive={true}
                                autoCropArea={1}
                                checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                                guides={true}
                            />
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-neutral-300">
                                <Upload/>
                                <p className="text-xs">Tap and upload your image here.</p>
                                <p className="text-[10px]">.jpg/.png/.jfif/.gif, max 5mB</p>
                            </div>
                        )
                    ) : (
                        <img
                            src={currentImage}
                            className="w-full h-full object-cover absolute top-0 left-0"
                        />
                    )}
                </div>
                {tempLogo && (
                    <button
                        onClick={() => {
                            getCropData();
                        }}
                        className="bg-emerald-800 flex gap-2 items-center justify-center font-[500] text-emerald-100 rounded-lg w-full py-2 text-sm mt-3"
                    >
                        <Crop size="16px"/> Crop
                    </button>
                )}
                {currentImage && (
                    <button
                        onClick={() => {
                            logoRef.current?.click();
                        }}
                        className="bg-emerald-800 font-[500] text-emerald-100 rounded-lg w-full py-2 text-sm mt-3"
                    >
                        Change Logo
                    </button>
                )}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            key={1}
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            className="warn mt-[5px] flex items-center gap-2 text-xs text-red-600"
                        >
                            <AlertTriangle size="13px" className="shrink-0"/>
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
