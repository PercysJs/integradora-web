"use client";

import { useEffect, useState } from "react";
import { Ticket } from "../../domain/entities/Ticket";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare module "qz-tray";

interface TicketPrintProps {
  ticket: Ticket;
  onClose: () => void;
}

export function TicketPrint({ ticket, onClose }: TicketPrintProps) {
  const [printing, setPrinting] = useState(false);
  const [qzReady, setQzReady] = useState(false);

  const fecha = ticket.createdAt.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Mexico_City",
  });

  const hora = ticket.createdAt.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Mexico_City",
  });

  useEffect(() => {
   async function initQZ() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const qz = (await import("qz-tray")) as any;
    const qzInstance = qz.default || qz;

    qzInstance.security.setCertificatePromise(function(resolve: (value: string) => void) {
      fetch("/certificate.pem")
        .then(res => res.text())
        .then(cert => resolve(cert));
    });

    qzInstance.security.setSignatureAlgorithm("SHA512");
    qzInstance.security.setSignaturePromise(function(toSign: string) {
      return function(resolve: (value: string) => void, reject: (reason: unknown) => void) {
        fetch("/api/sign-message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: toSign }),
        })
          .then(res => res.text())
          .then(resolve)
          .catch(reject);
      };
    });

    if (!qzInstance.websocket.isActive()) {
      await qzInstance.websocket.connect();
    }
    setQzReady(true);
  } catch (e) {
    console.error("QZ Tray no disponible:", e);
    setQzReady(false);
  }
}
    initQZ();
  }, []);

  async function handlePrintQZ() {
    setPrinting(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const qz = (await import("qz-tray")) as any;
      const qzInstance = qz.default || qz;

      if (!qzInstance.websocket.isActive()) {
        await qzInstance.websocket.connect();
      }

      const config = qzInstance.configs.create("POS-58");

      const data = [
        "\x1B\x40",
        "\x1B\x61\x01",
        "\x1B\x21\x30",
        "ABS Transport\n",
        "\x1B\x21\x00",
        "Autobuses Blancos del Sur\n",
        "--------------------------------\n",
        "\x1B\x21\x10",
        "FOLIO\n",
        "\x1B\x21\x30",
        `${ticket.folio}\n`,
        "\x1B\x21\x00",
        "--------------------------------\n",
        "\x1B\x61\x00",
        "Pasajero:\n",
        `\x1B\x21\x08${ticket.passengerName}\x1B\x21\x00\n`,
        `Unidad: ${ticket.unitNumber}\n`,
        `Ruta: ${ticket.routeName}\n`,
        `Origen: ${ticket.originAddress}\n`,
        `Destino: ${ticket.destinationAddress}\n`,
        `Hora salida: ${ticket.departureTime}\n`,
        `Fecha: ${fecha} ${hora}\n`,
        "--------------------------------\n",
        "\x1B\x61\x01",
        "\x1B\x21\x10",
        "TOTAL\n",
        "\x1B\x21\x30",
        `$${ticket.price.toFixed(2)}\n`,
        "\x1B\x21\x00",
        "--------------------------------\n",
        "\x1B\x64\x03",
        "\x1D\x56\x41\x10",
      ];

      await qzInstance.print(config, data);
      onClose();
    } catch (e) {
      console.error("Error al imprimir:", e);
      alert("Error al imprimir. Verifica que QZ Tray esté activo.");
    } finally {
      setPrinting(false);
    }
  }

  function handlePrintBrowser() {
    window.print();
  }

  return (
    <div className="flex flex-col gap-4">

      <div id="ticket-print" className="bg-white border border-dashed border-gray-300 rounded-xl p-4 w-60 mx-auto font-mono text-xs break-words">

        <div className="text-center border-b border-dashed border-gray-300 pb-2 mb-2">
          <p className="font-bold text-lg">ABS Transport</p>
          <p className="text-gray-600 text-xs">Autobuses Blancos del Sur</p>
        </div>

        <div className="text-center mb-2">
          <p className="text-gray-500 text-xs uppercase tracking-widest">Folio</p>
          <p className="font-bold text-xl">{ticket.folio}</p>
        </div>

        <div className="flex flex-col gap-1.5 border-t border-dashed border-gray-300 pt-2">
          <div className="flex flex-col">
            <span className="text-gray-500 text-xs">Pasajero:</span>
            <span className="font-bold text-sm">{ticket.passengerName}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-xs">Unidad:</span>
            <span className="font-bold text-sm">{ticket.unitNumber}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-xs">Ruta:</span>
            <span className="font-bold text-sm">{ticket.routeName}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-xs">Origen:</span>
            <span className="font-semibold text-sm">{ticket.originAddress}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-xs">Destino:</span>
            <span className="font-semibold text-sm">{ticket.destinationAddress}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-xs">Hora de salida:</span>
            <span className="font-bold text-sm">{ticket.departureTime}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-xs">Fecha de compra:</span>
            <span className="font-semibold text-sm">{fecha} {hora}</span>
          </div>
        </div>

        <div className="text-center border-t border-dashed border-gray-300 mt-2 pt-2">
          <p className="text-gray-500 text-xs uppercase tracking-widest">Total</p>
          <p className="font-bold text-3xl">${ticket.price.toFixed(2)}</p>
        </div>

      </div>

      {!qzReady && (
        <p className="text-xs text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-center">
          ⚠️ QZ Tray no detectado — usando impresión del navegador
        </p>
      )}

      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition"
        >
          Cerrar
        </button>
        <button
          onClick={qzReady ? handlePrintQZ : handlePrintBrowser}
          disabled={printing}
          className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          {printing ? "Imprimiendo..." : "Imprimir boleto"}
        </button>
      </div>

      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #ticket-print, #ticket-print * { visibility: visible; }
          #ticket-print {
            position: fixed;
            left: 0;
            top: 0;
            width: 72mm !important;
            max-width: 72mm !important;
            border: none !important;
            padding: 3mm 4mm !important;
            font-size: 11px !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
          }
          @page { size: 80mm auto; margin: 0mm 2mm; }
        }
      `}</style>

    </div>
  );
}