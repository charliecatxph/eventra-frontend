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
      value={`http://eventra.ctxtechnologies.com/atendee?=${identifier}`}
      size={120}
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
              gap: 40px;
              align-items: start;
              margin: 2rem;
              border: 1px gray dashed;
              padding: 1rem;
              padding-right: 3rem;
              width: max-content;
              height: 150px;
            }

            .xct {
              display: flex;
              flex-direction: column;
              gap: 5px;
              font-family: "MS Gothic", sans-serif;
            }

            .qr-code {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100%;
              width: 25%;
            }

            .company {
              font-size: 15px;
              font-weight: 400;
              display: flex;
              align-items: center;
              gap: 10px;
            }

            .company img {
              width: 20px;
              height: 20px;
            }

            .ev-title {
              font-size: 1.2rem;
              font-weight: 900;
            }

            .atnd-name {
              font-size: 1.1rem;
              font-weight: 600;
            }

            .atnd-org {
              font-size: 1rem;
              font-weight: 500;
            }

            .atnd-country {
              font-size: 1rem;
              font-weight: 500;
            }

            .identifier {
              color: gray;
              font-size:13px;
              margin-top: 0.5rem;
            }
          </style>
        </head>
        <body onload="window.print(); window.close()">
          <div class="qr-cx">
            <div class="qr-code">
              <img src="${qrCodeImageUrl}" alt="QR Code" />
            </div>
            <div class="xct">
              <div class="company">
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzkiIHZpZXdCb3g9IjAgMCA5OSA4OSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI0My41IiBjeT0iMzYuNSIgcj0iMjUuNSIgZmlsbD0iI0VFMTgxOCI+PC9jaXJjbGU+PGNpcmNsZSBjeD0iNjIuNSIgY3k9IjQ2LjUiIHI9IjI1LjUiIGZpbGw9IiNGRUQxMUMiPjwvY2lyY2xlPjxjaXJjbGUgY3g9IjM2LjUiIGN5PSI1Mi41IiByPSIyNS41IiBmaWxsPSIjQTExOEZEIj48L2NpcmNsZT48L3N2Zz4=" />
                <span>Eventra Event Passport</span>
              </div>

              <p class="ev-title">${eventName}</p>
              <p class="atnd-name">${attendeeName}</p>
              <p class="atnd-org">${organization}</p>
              <p class="atnd-country">${position}</p>
              <p class="identifier">[ ${identifier} ]</p>
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
