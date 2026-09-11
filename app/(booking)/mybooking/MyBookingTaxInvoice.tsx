"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Download,
  Heart,
  Home,
  Mail,
  MapPin,
  Tag,
} from "lucide-react";

import type { Booking } from "@/data/booking/my-bookings";
import { SHARED_STAFF } from "@/data/shared/staff";

function parseMoney(value?: string) {
  if (!value) return 0;
  return Number(value.replace(/[^0-9.]/g, "")) || 0;
}

function money(value: number) {
  return `A$${value.toFixed(0)}`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function ReceiptQr({ value }: { value: string }) {
  const cells = value.split("").map((char) => char.charCodeAt(0));
  const size = 17;
  const bits: boolean[] = [];
  for (let i = 0; i < size * size; i += 1) {
    const seed = cells[i % cells.length] ?? 7;
    bits.push((seed * (i + 3) + i * 13) % 5 !== 0);
  }

  return (
    <div
      className="grid shrink-0 overflow-hidden rounded-sm border border-(--text-primary) p-1"
      style={{
        gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
        width: 72,
        height: 72,
      }}
      aria-hidden
    >
      {bits.map((filled, index) => (
        <span
          key={index}
          className={filled ? "bg-(--text-primary)" : "bg-white"}
        />
      ))}
    </div>
  );
}

function getStaffRole(therapistName: string) {
  const staff = SHARED_STAFF.find(
    (member) =>
      member.name.trim().toLowerCase() === therapistName.trim().toLowerCase(),
  );
  return staff ? "Senior Therapist" : "Therapist";
}

function buildInvoiceHtml(data: {
  storeName: string;
  storeAddress: string;
  invoiceNo: string;
  bookingId: string;
  invoiceDate: string;
  therapist: string;
  staffRole: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  service: string;
  duration: string;
  appointmentLabel: string;
  paymentMethod: string;
  linePrice: string;
  gst: string;
  total: string;
  printedDate: string;
}) {
  const d = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, escapeHtml(value)]),
  ) as typeof data;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Tax Invoice ${d.invoiceNo}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 24px;
      font-family: Arial, Helvetica, sans-serif;
      color: #2D1659;
      background: #fff;
    }
    h1 {
      margin: 0 0 16px;
      font-size: 22px;
      letter-spacing: 0.04em;
    }
    .box {
      border: 1px solid #d8d0de;
      border-radius: 12px;
      margin-bottom: 10px;
      overflow: hidden;
    }
    .row { display: flex; }
    .muted { color: #6b6280; }
    .small { font-size: 11px; }
    .tiny { font-size: 10px; }
    .bold { font-weight: 700; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .pad { padding: 10px; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; }
    th {
      background: #EEE6F5;
      text-align: left;
      padding: 8px 6px;
      font-size: 10px;
    }
    td { padding: 8px 6px; border-top: 1px solid #d8d0de; vertical-align: top; }
    .right { text-align: right; }
    .summary {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;
      background: #f5f2f7;
      padding: 8px 10px;
      font-size: 10px;
      color: #6b6280;
    }
    .logo {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      background: #2D1659;
      color: #d4af37;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 18px;
      flex-shrink: 0;
    }
    .status {
      width: 96px;
      border-left: 1px solid #d8d0de;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 8px;
    }
    .green { color: #16a34a; }
    @media print {
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <h1>TAX INVOICE</h1>

  <div class="box row">
    <div class="pad row" style="flex:1; gap:10px; align-items:center;">
      <div class="logo">VB</div>
      <div>
        <div class="bold" style="font-size:13px; text-transform:uppercase;">${d.storeName}</div>
        <div class="tiny muted">${d.storeAddress}</div>
        <div class="tiny muted">ABN: 47 123 456 789</div>
        <div class="tiny muted">hello@velvetbook.com</div>
      </div>
    </div>
    <div class="status">
      <div class="tiny muted">STATUS</div>
      <div class="bold small" style="margin-top:4px;">PAID IN FULL</div>
    </div>
  </div>

  <div class="box grid-3 pad small">
    <div>
      <div class="muted">Invoice no.</div>
      <div class="bold">${d.invoiceNo}</div>
      <div class="tiny muted">Booking ID ${d.bookingId}</div>
    </div>
    <div>
      <div class="muted">Invoice date</div>
      <div class="bold">${d.invoiceDate}</div>
    </div>
    <div>
      <div class="muted">Handled by</div>
      <div class="bold">${d.therapist}</div>
      <div class="tiny muted">${d.staffRole}</div>
    </div>
  </div>

  <div class="grid-3" style="margin-bottom:10px;">
    <div class="box pad">
      <div class="tiny bold muted">SOLD TO</div>
      <div class="small bold" style="margin-top:4px;">${d.customerName}</div>
      <div class="tiny muted">${d.customerPhone}</div>
      <div class="tiny muted">${d.customerEmail}</div>
    </div>
    <div class="box pad">
      <div class="tiny bold muted">DELIVERED TO</div>
      <div class="tiny muted" style="margin-top:4px;">${d.storeAddress}</div>
    </div>
    <div class="box pad">
      <div class="tiny bold muted">PICKED BY</div>
      <div class="small bold" style="margin-top:4px;">${d.customerName}</div>
      <div class="tiny muted">${d.storeAddress}</div>
    </div>
  </div>

  <div class="box">
    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th>Duration</th>
          <th>Tax</th>
          <th>Price</th>
          <th>Qty</th>
          <th class="right">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <div class="bold">${d.service}</div>
            <div class="tiny muted">Staff: ${d.therapist}</div>
            <div class="tiny muted">Arrival: ${d.appointmentLabel}</div>
          </td>
          <td>${d.duration}</td>
          <td>GST 10%</td>
          <td>${d.linePrice}</td>
          <td>1</td>
          <td class="right bold">${d.linePrice}</td>
        </tr>
      </tbody>
    </table>
    <div class="summary">
      <span>Payment Method: ${d.paymentMethod}</span>
      <span>Final Total: ${d.total}</span>
      <span>Status: PAID IN FULL.</span>
    </div>
    <div class="tiny muted right" style="padding:8px 10px;">No. of Items ( 1 )</div>
  </div>

  <div class="grid-2" style="margin-bottom:10px;">
    <div class="box pad">
      <div class="tiny bold muted">PAYMENT STATUS</div>
      <div class="row" style="justify-content:space-between; margin-top:6px;">
        <div class="bold small">Paid in full</div>
        <div class="bold" style="font-size:16px;">${d.total}</div>
      </div>
      <div class="tiny muted">Paid by ${d.paymentMethod}</div>
      <div class="tiny muted">Payment received: ${d.invoiceDate}</div>
    </div>
    <div class="box pad small">
      <div class="row" style="justify-content:space-between;"><span class="muted">Subtotal</span><span>${d.linePrice}</span></div>
      <div class="row" style="justify-content:space-between; margin-top:4px;"><span class="muted">GST 10%</span><span>${d.gst}</span></div>
      <div class="row green" style="justify-content:space-between; margin-top:4px;"><span>Discount</span><span>$0</span></div>
      <div class="row bold" style="justify-content:space-between; margin-top:8px; padding-top:8px; border-top:1px solid #d8d0de;">
        <span>Total incl. GST</span><span>${d.total}</span>
      </div>
    </div>
  </div>

  <div class="box pad tiny muted">
    Thank you for your custom, we value your support. (duplicate copy, printed ${d.printedDate})
  </div>
</body>
</html>`;
}

function downloadHtmlFile(filename: string, html: string) {
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function printHtml(html: string) {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.style.opacity = "0";
  iframe.style.pointerEvents = "none";
  document.body.appendChild(iframe);

  const frameWindow = iframe.contentWindow;
  const frameDocument = frameWindow?.document;
  if (!frameWindow || !frameDocument) {
    iframe.remove();
    return;
  }

  frameDocument.open();
  frameDocument.write(html);
  frameDocument.close();

  const triggerPrint = () => {
    try {
      frameWindow.focus();
      frameWindow.print();
    } finally {
      window.setTimeout(() => iframe.remove(), 800);
    }
  };

  window.setTimeout(triggerPrint, 150);
}

interface MyBookingTaxInvoiceProps {
  booking: Booking;
}

export function MyBookingTaxInvoice({ booking }: MyBookingTaxInvoiceProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const storeName = booking.organization.name.replace(/,.*/, "");
  const invoiceNo = booking.receiptNumber ?? `INV-${booking.id.toUpperCase()}`;
  const bookingId = `VBK-${booking.id.toUpperCase()}`;
  const invoiceDate = booking.paidAt
    ? booking.paidAt.replace(" · ", ", ")
    : `${booking.date}, ${booking.time}`;
  const customerName = booking.customerName ?? "Guest";
  const customerPhone = "+61 400 000 000";
  const customerEmail = "guest@email.com";
  const paymentMethod = booking.paymentMethod ?? "Card";

  const totalPaid = parseMoney(booking.summaryTotal ?? booking.price);
  const taxAmount = parseMoney(booking.tax ?? booking.taxesAndFees);
  const subtotal =
    parseMoney(booking.subtotal ?? booking.summarySubtotal) ||
    (taxAmount > 0 ? totalPaid - taxAmount : Math.round(totalPaid / 1.1));
  const gst = taxAmount || Math.max(0, Math.round(totalPaid - subtotal));
  const linePrice = subtotal || totalPaid - gst;
  const finalTotal = money(totalPaid || linePrice + gst);

  const handleDownload = () => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      const html = buildInvoiceHtml({
        storeName,
        storeAddress: booking.organization.address,
        invoiceNo,
        bookingId,
        invoiceDate,
        therapist: booking.therapist,
        staffRole: getStaffRole(booking.therapist),
        customerName,
        customerPhone,
        customerEmail,
        service: booking.service,
        duration: booking.duration ?? "60 min",
        appointmentLabel: `${booking.date}, ${booking.time}`,
        paymentMethod,
        linePrice: money(linePrice),
        gst: money(gst),
        total: finalTotal,
        printedDate: booking.date,
      });

      const safeName = invoiceNo.replace(/[^\w.-]+/g, "_");
      downloadHtmlFile(`Tax-Invoice-${safeName}.html`, html);
      printHtml(html);
    } finally {
      window.setTimeout(() => setIsDownloading(false), 400);
    }
  };

  return (
    <div className="flex min-h-0 flex-col overflow-hidden rounded-[18px] border border-(--border) bg-white shadow-[0_10px_30px_rgba(61,28,77,0.06)]">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-(--border) px-4 py-3">
        <h2 className="font-[family-name:var(--font-heading)] text-[18px] font-bold tracking-wide text-(--accent-primary)">
          TAX INVOICE
        </h2>
        <button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading}
          className="primary-button inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[12px] font-semibold text-white disabled:opacity-60"
        >
          <Download size={14} strokeWidth={2.4} />
          {isDownloading ? "Preparing..." : "Download"}
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3.5 scrollbar-thin scrollbar-thumb-(--accent-primary)/25">
        <section className="space-y-2.5 bg-white text-(--text-primary)">
          <div className="flex items-stretch overflow-hidden rounded-xl border border-(--border)">
            <div className="flex min-w-0 flex-1 items-center gap-2.5 p-2.5">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#2D1659]">
                <Image
                  src="/vb-logo.png"
                  alt="VelvetBook"
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[12px] font-bold uppercase text-(--accent-primary)">
                  {storeName}
                </p>
                <p className="mt-0.5 flex items-start gap-1 text-[9px] leading-snug text-(--text-muted)">
                  <MapPin size={10} className="mt-0.5 shrink-0" />
                  <span>{booking.organization.address}</span>
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-[9px] text-(--text-secondary)">
                  <Tag size={10} />
                  ABN: 47 123 456 789
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-[9px] text-(--text-secondary)">
                  <Mail size={10} />
                  hello@velvetbook.com
                </p>
              </div>
            </div>
            <div className="flex w-[88px] shrink-0 flex-col items-center justify-center border-l border-(--border) px-2 text-center">
              <p className="text-[8px] font-semibold tracking-wide text-(--text-muted)">
                STATUS
              </p>
              <p className="mt-1 text-[11px] font-bold leading-tight text-(--accent-primary)">
                PAID IN FULL
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 rounded-xl border border-(--border) px-2.5 py-2 text-[10px]">
            <div>
              <p className="text-(--text-muted)">Invoice no.</p>
              <p className="font-semibold text-(--text-primary)">{invoiceNo}</p>
              <p className="mt-0.5 text-[9px] text-(--text-muted)">
                Booking ID {bookingId}
              </p>
            </div>
            <div>
              <p className="text-(--text-muted)">Invoice date</p>
              <p className="font-semibold text-(--text-primary)">{invoiceDate}</p>
            </div>
            <div>
              <p className="text-(--text-muted)">Handled by</p>
              <p className="truncate font-semibold text-(--text-primary)">
                {booking.therapist}
              </p>
              <p className="text-[9px] text-(--text-muted)">
                {getStaffRole(booking.therapist)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-(--border) px-2.5 py-2">
              <p className="text-[9px] font-bold tracking-wide text-(--text-muted)">
                SOLD TO
              </p>
              <p className="mt-1 text-[11px] font-semibold text-(--text-primary)">
                {customerName}
              </p>
              <p className="text-[9px] text-(--text-secondary)">{customerPhone}</p>
              <p className="truncate text-[9px] text-(--text-secondary)">
                {customerEmail}
              </p>
            </div>
            <div className="rounded-xl border border-(--border) px-2.5 py-2">
              <p className="text-[9px] font-bold tracking-wide text-(--text-muted)">
                DELIVERED TO
              </p>
              <p className="mt-1 text-[10px] leading-snug text-(--text-secondary)">
                {booking.organization.address}
              </p>
            </div>
            <div className="rounded-xl border border-(--border) px-2.5 py-2">
              <p className="text-[9px] font-bold tracking-wide text-(--text-muted)">
                PICKED BY
              </p>
              <p className="mt-1 text-[11px] font-semibold text-(--text-primary)">
                {customerName}
              </p>
              <p className="text-[10px] leading-snug text-(--text-secondary)">
                {booking.organization.address}
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-(--border)">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] text-left">
                <thead className="bg-[#EEE6F5] text-[9px] font-semibold text-(--text-primary)">
                  <tr>
                    <th className="px-2 py-1.5 font-semibold">Description</th>
                    <th className="px-1 py-1.5 font-semibold">Duration</th>
                    <th className="px-1 py-1.5 font-semibold">Tax</th>
                    <th className="px-1 py-1.5 font-semibold">Price</th>
                    <th className="px-1 py-1.5 font-semibold">Qty</th>
                    <th className="px-2 py-1.5 text-right font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-(--border) align-top text-[10px]">
                    <td className="px-2 py-2">
                      <p className="font-bold text-(--text-primary)">
                        {booking.service}
                      </p>
                      <p className="text-[9px] text-(--text-muted)">
                        Staff: {booking.therapist}
                      </p>
                      <p className="text-[9px] text-(--text-muted)">
                        Arrival: {booking.date}, {booking.time}
                      </p>
                    </td>
                    <td className="px-1 py-2 text-(--text-secondary)">
                      {booking.duration ?? "60 min"}
                    </td>
                    <td className="px-1 py-2 text-(--text-secondary)">GST 10%</td>
                    <td className="px-1 py-2 text-(--text-secondary)">
                      {money(linePrice)}
                    </td>
                    <td className="px-1 py-2 text-(--text-secondary)">1</td>
                    <td className="px-2 py-2 text-right font-bold text-(--text-primary)">
                      {money(linePrice)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-1 bg-(--bg-secondary) px-2.5 py-1.5 text-[9px] text-(--text-secondary)">
              <span>Payment Method: {paymentMethod}</span>
              <span>Final Total: {finalTotal}</span>
              <span>Status: PAID IN FULL.</span>
            </div>
            <p className="px-2.5 py-1.5 text-right text-[10px] text-(--text-muted)">
              No. of Items ( 1 )
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-(--border) px-2.5 py-2.5">
              <p className="text-[9px] font-bold tracking-wide text-(--text-muted)">
                PAYMENT STATUS
              </p>
              <div className="mt-1.5 flex items-start justify-between gap-2">
                <p className="text-[12px] font-bold text-(--text-primary)">
                  Paid in full
                </p>
                <p className="text-[16px] font-bold text-(--accent-primary)">
                  {finalTotal}
                </p>
              </div>
              <p className="mt-1 text-[9px] text-(--text-secondary)">
                Paid by {paymentMethod}
              </p>
              <p className="text-[9px] text-(--text-secondary)">
                Payment received: {invoiceDate}
              </p>
            </div>
            <div className="rounded-xl border border-(--border) px-2.5 py-2 text-[10px]">
              <div className="flex justify-between text-(--text-secondary)">
                <span>Subtotal</span>
                <span>{money(linePrice)}</span>
              </div>
              <div className="mt-1 flex justify-between text-(--text-secondary)">
                <span>GST 10%</span>
                <span>{money(gst)}</span>
              </div>
              <div className="mt-1 flex justify-between text-[#16A34A]">
                <span>Discount</span>
                <span>$0</span>
              </div>
              <div className="mt-1.5 flex justify-between border-t border-(--border) pt-1.5 text-[11px] font-bold text-(--text-primary)">
                <span>Total incl. GST</span>
                <span>{finalTotal}</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-xl border border-(--border) px-2.5 py-2">
            <Heart
              size={14}
              className="mt-0.5 shrink-0 text-[#2D1659]"
              fill="currentColor"
            />
            <p className="text-[10px] leading-snug text-(--text-secondary)">
              Thank you for your custom, we value your support. (duplicate copy,
              printed {booking.date})
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-(--border) p-2.5">
            <ReceiptQr value={`${storeName}-${invoiceNo}`} />
            <div className="min-w-0">
              <p className="flex items-center gap-1 text-[12px] font-bold text-(--text-primary)">
                <Home size={13} />
                Payment QR preview
              </p>
              <p className="mt-1 text-[10px] leading-snug text-(--text-secondary)">
                Add a payment link and generate QR code to show the real QR here.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
