import React, { useState, useRef, useEffect } from "react";
import Cropper from "cropperjs";

const ImageCropper = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const imageElement = useRef(null); // Ref to the image element
  const cropperRef = useRef(null); // Ref to the Cropper instance
  const fileInputRef = useRef(null); // Ref to the file input

  useEffect(() => {
    if (imageSrc && imageElement.current) {
      cropperRef.current = new Cropper(imageElement.current, {
        aspectRatio: 1, // 1:1 aspect ratio
        viewMode: 1, // Restrict the crop box within the image's bounds
        responsive: true, // Make the cropper responsive
        autoCropArea: 0.8, // Set the initial crop area
        minContainerWidth: 320, // Minimum width on mobile screens
        minContainerHeight: 320, // Minimum height on mobile screens
        zoomable: true, // Allow zooming of the image
        movable: true, // Allow moving the crop box
        background: true, // Show a background when cropping
      });
    }

    return () => {
      // Cleanup cropper instance on unmount
      if (cropperRef.current) {
        cropperRef.current.destroy();
      }
    };
  }, [imageSrc]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result); // Set the image source once loaded
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = () => {
    if (cropperRef.current) {
      const croppedCanvas = cropperRef.current.getCroppedCanvas();
      setCroppedImage(croppedCanvas.toDataURL()); // Get the cropped image as base64
    }
  };

  const handleClear = () => {
    setImageSrc(null);
    setCroppedImage(null);
  };

  return (
    <div className="image-cropper-container" style={{ textAlign: "center" }}>
      <h2>Image Cropper (1:1 Aspect Ratio)</h2>

      {/* File Input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ marginBottom: "20px" }}
      />

      {/* Image Element for Cropper */}
      {imageSrc && (
        <div
          className="cropper-container"
          style={{ maxWidth: "100%", width: "100%", margin: "0 auto" }}
        >
          <img
            ref={imageElement}
            src={imageSrc}
            alt="To be cropped"
            style={{ width: "100%" }}
          />
        </div>
      )}

      {/* Crop Button */}
      {imageSrc && (
        <button
          onClick={handleCrop}
          style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
        >
          Crop Image
        </button>
      )}

      {/* Clear Button */}
      {imageSrc && (
        <button
          onClick={handleClear}
          style={{ marginTop: "10px", padding: "10px 20px", cursor: "pointer" }}
        >
          Clear
        </button>
      )}

      {/* Cropped Image */}
      {croppedImage && (
        <div className="cropped-image-container" style={{ marginTop: "20px" }}>
          <h3>Cropped Image</h3>
          <img
            src={croppedImage}
            alt="Cropped"
            style={{ maxWidth: "100%", width: "300px" }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageCropper;
