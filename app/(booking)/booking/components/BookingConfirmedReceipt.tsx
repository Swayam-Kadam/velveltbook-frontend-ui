"use client";

import Image from "next/image";
import {
  Download,
  Heart,
  Home,
  Mail,
  MapPin,
} from "lucide-react";

import { TAX_RATE } from "../booking.data";

export interface ReceiptLineItem {
  id: string;
  name: string;
  staffName: string;
  arrival: string;
  duration: string;
  price: number;
  tax: number;
  quantity: number;
}

interface BookingConfirmedReceiptProps {
  storeName: string;
  storeAddress: string;
  docketNo: string;
  serialNo: string;
  dateLabel: string;
  servedBy: string;
  customerName: string;
  customerPhone: string;
  paymentMethod: string;
  items: ReceiptLineItem[];
  onBack: () => void;
}

function money(value: number) {
  return `$${value.toFixed(2)}`;
}

function ReceiptQr({ value }: { value: string }) {
  const cells = value.split("").map((char) => char.charCodeAt(0));
  const size = 17;
  const bits: boolean[] = [];
  for (let i = 0; i < size * size; i += 1) {
    const seed = cells[i % cells.length] ?? 7;
    bits.push(((seed * (i + 3)) + i * 13) % 5 !== 0);
  }

  return (
    <div
      className="grid shrink-0 overflow-hidden rounded-sm border border-(--text-primary) p-1"
      style={{
        gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
        width: 88,
        height: 88,
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

export function BookingConfirmedReceipt({
  storeName,
  storeAddress,
  docketNo,
  serialNo,
  dateLabel,
  servedBy,
  customerName,
  customerPhone,
  paymentMethod,
  items,
  onBack,
}: BookingConfirmedReceiptProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = items.reduce((sum, item) => sum + item.tax * item.quantity, 0);
  const total = subtotal + tax;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const printedAt = dateLabel.split(" ")[0] ?? dateLabel;

  const handleDownload = () => {
    window.print();
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-heading)] text-[18px] font-bold tracking-wide text-(--text-primary)">
          TAX INVOICE
        </h2>
        <button
          type="button"
          onClick={handleDownload}
          aria-label="Download invoice"
          className="flex h-8 w-8 items-center justify-center rounded-full text-(--text-primary)"
        >
          <Download size={18} strokeWidth={2} />
        </button>
      </div>

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
            <p className="truncate text-[12px] font-bold uppercase text-(--text-primary)">
              {storeName}
            </p>
            <p className="mt-0.5 flex items-start gap-1 text-[9px] leading-snug text-(--text-muted)">
              <MapPin size={10} className="mt-0.5 shrink-0" />
              <span>{storeAddress}</span>
            </p>
            <p className="mt-0.5 text-[9px] text-(--text-secondary)">
              ABN: 47 123 456 789
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-[9px] text-(--text-secondary)">
              <Mail size={10} />
              hello@velvetbook.com
            </p>
          </div>
        </div>
        <div className="flex w-[72px] shrink-0 flex-col items-center justify-center border-l border-(--border) px-1.5">
          <p className="text-[8px] font-semibold tracking-wide text-(--text-muted)">
            SERIAL NO.
          </p>
          <p className="text-[22px] font-bold leading-none text-(--text-primary)">
            {serialNo}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1 text-center text-[10px]">
        <div>
          <p className="text-(--text-muted)">Docket No</p>
          <p className="font-semibold text-(--text-primary)">{docketNo}</p>
        </div>
        <div>
          <p className="text-(--text-muted)">Date</p>
          <p className="font-semibold text-(--text-primary)">{dateLabel}</p>
        </div>
        <div>
          <p className="text-(--text-muted)">Served by</p>
          <p className="truncate font-semibold text-(--text-primary)">
            {servedBy}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-(--border) px-2.5 py-2">
          <p className="text-[9px] font-bold tracking-wide text-(--text-muted)">
            SOLD TO
          </p>
          <p className="mt-1 text-[12px] font-semibold text-(--text-primary)">
            {customerName || "Guest"}
          </p>
          <p className="text-[10px] text-(--text-secondary)">
            {customerPhone || "—"}
          </p>
        </div>
        <div className="rounded-xl border border-(--border) px-2.5 py-2">
          <p className="text-[9px] font-bold tracking-wide text-(--text-muted)">
            DELIVER TO
          </p>
          <p className="mt-1 text-[12px] font-semibold text-(--text-primary)">
            —
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-(--border)">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left">
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
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-(--border) align-top text-[10px]"
                >
                  <td className="px-2 py-2">
                    <p className="font-bold text-(--text-primary)">{item.name}</p>
                    <p className="text-[9px] text-(--text-muted)">
                      Staff: {item.staffName}
                    </p>
                    <p className="text-[9px] text-(--text-muted)">
                      Arrival: {item.arrival}
                    </p>
                  </td>
                  <td className="px-1 py-2 text-(--text-secondary)">
                    {item.duration}
                  </td>
                  <td className="px-1 py-2 text-(--text-secondary)">GST</td>
                  <td className="px-1 py-2 text-(--text-secondary)">
                    {money(item.price)}
                  </td>
                  <td className="px-1 py-2 text-(--text-secondary)">
                    {item.quantity}
                  </td>
                  <td className="px-2 py-2 text-right font-bold text-(--text-primary)">
                    {money((item.price + item.tax) * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-1 bg-(--bg-secondary) px-2.5 py-1.5 text-[9px] text-(--text-secondary)">
          <span>Payment Method: {paymentMethod}</span>
          <span>Final Total: {money(total)}</span>
          <span>Status: PAID IN FULL</span>
        </div>
        <p className="px-2.5 py-1.5 text-right text-[10px] text-(--text-muted)">
          No. of Items ( {itemCount} )
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-(--border) px-2.5 py-2.5">
          <p className="text-[10px] font-bold text-(--text-primary)">
            PAID IN FULL
          </p>
          <p className="mt-1 text-[18px] font-bold text-(--text-primary)">
            {money(total)}
          </p>
        </div>
        <div className="rounded-xl border border-(--border) px-2.5 py-2 text-[10px]">
          <div className="flex justify-between text-(--text-secondary)">
            <span>Subtotal</span>
            <span>{money(subtotal)}</span>
          </div>
          <div className="mt-1 flex justify-between text-(--text-secondary)">
            <span>Tax (GST {Math.round(TAX_RATE * 100)}%)</span>
            <span>{money(tax)}</span>
          </div>
          <div className="mt-1 flex justify-between text-[#16A34A]">
            <span>Discount</span>
            <span>-$0.00</span>
          </div>
          <div className="mt-1.5 flex justify-between border-t border-(--border) pt-1.5 text-[11px] font-bold text-(--text-primary)">
            <span>TOTAL inc GST</span>
            <span>{money(total)}</span>
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
          printed {printedAt})
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-(--border) p-2.5">
        <ReceiptQr value={`${storeName}-${docketNo}`} />
        <div className="min-w-0">
          <p className="flex items-center gap-1 text-[12px] font-bold text-(--text-primary)">
            <Home size={13} />
            Scan to visit our store
          </p>
          <p className="mt-1 text-[10px] leading-snug text-(--text-secondary)">
            Scan this QR code to open our store and book services again.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-[#2D1659] py-3 text-[13px] font-semibold text-[#2D1659]"
        >
          Back to Overview
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="rounded-xl bg-[#2D1659] py-3 text-[13px] font-semibold text-white"
        >
          Download Invoice
        </button>
      </div>
    </section>
  );
}
