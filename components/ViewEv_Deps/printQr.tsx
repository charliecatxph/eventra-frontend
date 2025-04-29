import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import { createRoot } from "react-dom/client";

interface QRProps {
  eventName: string;
  attendeeName: string;
  organization: string;
  position: string;
  identifier: string;
}

export function printQR({
  eventName,
  attendeeName,
  organization,
  position,
  identifier,
}: QRProps) {
  // Create a temporary container for rendering the QR code
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(
    <QRCodeCanvas
      value={`${process.env.NEXT_PUBLIC_DOMAIN}/passport?user=${identifier}`}
      size={200}
    />
  );

  // Allow QR to render before accessing canvas
  setTimeout(() => {
    const canvas = container.querySelector("canvas");
    if (!canvas) return;

    const qrCodeImageUrl = canvas.toDataURL();

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Code</title>
          <style>
            * { margin: 0; padding: 0; }
            @page { margin: 0; size: auto; }
            @media print { header, footer { display: none; } }

            .qr-cx {
              display: flex;
              align-items: center;
              gap: 20px;
            
              border: 1px gray dashed;
              padding: 1rem;
              
              width: 8cm;
              height:3cm;
              
            }

            @page { size: landscape; }

            .xct {
              display: flex;
              
              flex-direction: column;
              gap: 5px;
              font-family: "MS Gothic", sans-serif;
              width: 100%;
            }

            .qr-code > img {
           
              height: 2.5cm;
              width:2.5cm;
            }

            .company {
              font-size: 4px;
              font-weight: 400;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
              color: gray;
            }

            .company img {
              width: 8px;
              height: 8px;
            }


            .atnd-name {
              font-size: 1rem;
              font-weight: 600;
              text-align: center;
              margin-top: 0.5rem;
              text-transform:uppercase;
            }

            .atnd-org {
              font-size: 0.6rem;
              font-weight: 500;
              text-align: center;
              text-transform:uppercase;
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="qr-cx">
            <div class="qr-code">
              <img src="${qrCodeImageUrl}" alt="QR Code" />
            </div>
            <div class="xct">
              <p class="atnd-name">${attendeeName}</p>
              <p class="atnd-org">${organization}</p>
             
             
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();

    // Clean up
    setTimeout(() => {
      root.unmount();
      document.body.removeChild(container);
    }, 100);
  }, 300); // Wait for QR to render
}
