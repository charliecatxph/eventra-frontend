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
              flex-direction: column;
              gap: 20px;
              align-items: start;
            
              border: 1px gray dashed;
              padding: 1rem;
              margin: 2rem;
              width: 9cm;
              
            }

            .xct {
              display: flex;
              flex-direction: column;
              gap: 5px;
              font-family: "MS Gothic", sans-serif;
              width: 100%;
            }

            .qr-code {
              width:100%;
              display: flex;
              flex-direction: column;
            }

            .qr-code > img {
              margin: 0 auto;
              height: 3cm;
              width:3cm;
            }

            .company {
              font-size: 9px;
              font-weight: 400;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
              color: gray;
            }

            .company img {
              width: 10px;
              height: 10px;
            }

            .ev-title {
              font-size: 0.9rem;
              font-weight: 900;
              text-align: center;
            }

            .atnd-name {
              font-size: 1.2rem;
              font-weight: 600;
              text-align: center;
              margin-top: 0.5rem;
            }

            .atnd-org {
              font-size: 1rem;
              font-weight: 500;
              text-align: center;
            }

            .atnd-country {
              font-size: 1rem;
              font-weight: 500;
              text-align: center;
            }

            .identifier {
              color: gray;
              font-size:13px;
              margin-top: 0.5rem;
              text-align: center;
              font-size: 0.7rem;
              
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="qr-cx">
            <div class="qr-code">
              <img src="${qrCodeImageUrl}" alt="QR Code" />
            </div>
            <div class="xct">
            

              <p class="ev-title">${eventName}</p>
              <p class="atnd-name">${attendeeName}</p>
              <p class="atnd-org">${organization}</p>
              <p class="atnd-country">${position}</p>
              <p class="identifier">[ ${identifier} ]</p>
                <div class="company">
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzkiIHZpZXdCb3g9IjAgMCA5OSA4OSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI0My41IiBjeT0iMzYuNSIgcj0iMjUuNSIgZmlsbD0iI0VFMTgxOCI+PC9jaXJjbGU+PGNpcmNsZSBjeD0iNjIuNSIgY3k9IjQ2LjUiIHI9IjI1LjUiIGZpbGw9IiNGRUQxMUMiPjwvY2lyY2xlPjxjaXJjbGUgY3g9IjM2LjUiIGN5PSI1Mi41IiByPSIyNS41IiBmaWxsPSIjQTExOEZEIj48L2NpcmNsZT48L3N2Zz4=" />
                <span>Powered by Eventra</span>
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
