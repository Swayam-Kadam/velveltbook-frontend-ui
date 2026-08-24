"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CalendarClock,
  Check,
  ChevronRight,
  CirclePlus,
  ClipboardList,
  Clock3,
  Info,
  MessageCircle,
  PencilLine,
  ReceiptText,
  RotateCcw,
  ShoppingBag,
  Timer,
  Trash2,
  UserRound,
  X,
  XCircle,
} from "lucide-react";

import { CategorySidebar } from "@/menu/components/CategorySidebar";
import type { ExpertType } from "@/menu/components/ExpertSelection";
import { ServiceCard } from "@/menu/components/ServiceCard";
import {
  allMenuServices,
  getServicesByCategory,
  menuCategories,
} from "@/menu/menu.data";
import {
  bookingLocation,
  buildBookingDays,
  calcProductsTotal,
  calcServicesTotal,
  createDefaultServiceSchedule,
  formatServiceSchedule,
  getAvailableTimeSlots,
  getBookingDay,
  getOrganizationStaff,
  getSelectedProducts,
  getSelectedServices,
  getStaff,
  isServiceScheduleComplete,
  TAX_RATE,
  timeSlots,
} from "../booking.data";
import { ExpertProfileModal } from "./ExpertProfileModal";
import { BookingPreviewCards } from "./BookingPreviewCards";
import type {
  ServiceSchedule,
  ServiceSchedules,
  ServiceStaffAssignments,
} from "../booking.types";
import type { BookingOrganizationBannerInfo } from "./BookingOrganizationBanner";
import { BookingConfirmedReceipt } from "./BookingConfirmedReceipt";
import { BookingStoreChat } from "./BookingStoreChat";
import { BookingMonthCalendar } from "./steps/BookingMonthCalendar";

const CANCEL_WINDOW_SECONDS = 7 * 60;

type TimePeriod = "AM" | "PM";
type ServicePickerMode = "add" | "replace";
type EditPanel = null | "services" | "staff" | "datetime";
type DetailView = "services" | "receipt" | "chat";

interface EditDraft {
  serviceIds: string[];
  staff: ServiceStaffAssignments;
  schedules: ServiceSchedules;
}

interface HistoryEntry {
  draft: EditDraft;
  activeIndex: number;
}

interface BookingConfirmedScreenProps {
  selectedServiceIds: string[];
  selectedProductIds?: string[];
  productQuantities?: Record<string, number>;
  organizationId?: string;
  organizationBanner?: BookingOrganizationBannerInfo;
  staffId: string;
  serviceStaff: ServiceStaffAssignments;
  serviceSchedules: ServiceSchedules;
  expertType?: ExpertType;
  billingName?: string;
  billingPhone?: string;
  paymentMethod?: string;
  onSave?: (draft: EditDraft) => void;
  onReschedule?: (serviceId: string, dayId: string, time: string) => void;
  onCancelBooking?: () => void;
}

function formatCountdown(seconds: number) {
  const safe = Math.max(0, seconds);
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function cloneDraft(draft: EditDraft): EditDraft {
  return {
    serviceIds: [...draft.serviceIds],
    staff: { ...draft.staff },
    schedules: Object.fromEntries(
      Object.entries(draft.schedules).map(([id, schedule]) => [
        id,
        { ...schedule },
      ]),
    ),
  };
}

function formatInvoiceStamp(schedule?: ServiceSchedule) {
  if (!schedule?.dayId) return "";
  const day = getBookingDay(schedule.dayId);
  const [year, month, date] = day.iso.split("-");
  return `${date}-${month}-${year.slice(2)} ${schedule.time}`;
}

function getTimePeriod(time: string): TimePeriod {
  return time.endsWith("PM") ? "PM" : "AM";
}

function formatTimeParts(time: string) {
  const match = time.match(/^(.+?) (AM|PM)$/);
  return {
    clock: match?.[1] ?? time,
    period: (match?.[2] ?? getTimePeriod(time)) as TimePeriod,
  };
}

function Sparkle({
  className,
  color,
}: {
  className: string;
  color: string;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden
      className={`pointer-events-none absolute ${className}`}
      fill={color}
    >
      <path d="M8 0c.35 2.7 1.3 4.7 4 5.7-2.7 1-3.65 3-4 5.7-.35-2.7-1.3-4.7-4-5.7C6.7 4.7 7.65 2.7 8 0Z" />
    </svg>
  );
}

function TimeSlotPicker({
  activeDayId,
  activeTime,
  onSelectTime,
}: {
  activeDayId: string;
  activeTime: string;
  onSelectTime: (time: string) => void;
}) {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(() =>
    getTimePeriod(activeTime || "9:00 AM"),
  );

  const availableTimes = useMemo(
    () => getAvailableTimeSlots(activeDayId, timeSlots),
    [activeDayId],
  );
  const filteredTimes = useMemo(
    () => availableTimes.filter((time) => getTimePeriod(time) === timePeriod),
    [availableTimes, timePeriod],
  );

  useEffect(() => {
    if (activeTime) setTimePeriod(getTimePeriod(activeTime));
  }, [activeTime]);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold text-(--text-secondary)">
          Select Time
        </p>
        <div className="flex items-center gap-0.5 rounded-lg border border-(--border) p-0.5">
          {(["AM", "PM"] as const).map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => setTimePeriod(period)}
              className={`
                rounded-md px-2 py-0.5 text-[10px] font-semibold
                ${
                  timePeriod === period
                    ? "primary-button text-white"
                    : "text-(--text-secondary)"
                }
              `}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
      <div className="scrollbar-none flex gap-1.5 overflow-x-auto pb-0.5">
        {filteredTimes.map((time) => {
          const { clock, period } = formatTimeParts(time);
          const active = time === activeTime;
          return (
            <button
              key={time}
              type="button"
              onClick={() => onSelectTime(time)}
              className={`
                flex h-10 w-[4.6rem] shrink-0 flex-col items-center justify-center
                rounded-lg border text-center font-medium tabular-nums
                ${
                  active
                    ? "primary-button border-transparent text-white"
                    : "border-(--border) bg-(--bg-card) text-(--text-primary)"
                }
              `}
            >
              <span className="text-[10px]">{clock}</span>
              <span className="text-[8px] font-semibold">{period}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ConfirmedServiceMenuModal({
  mode,
  selectedServiceIds,
  currentServiceId,
  onPick,
  onClose,
}: {
  mode: ServicePickerMode;
  selectedServiceIds: string[];
  currentServiceId: string;
  onPick: (id: string) => void;
  onClose: () => void;
}) {
  const [activeCategory, setActiveCategory] = useState(() => {
    return (
      allMenuServices.find((service) => service.id === currentServiceId)
        ?.categoryId ??
      menuCategories[0]?.id ??
      "massage"
    );
  });

  const categoryServices = useMemo(
    () => getServicesByCategory(activeCategory),
    [activeCategory],
  );

  const selectedCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const id of selectedServiceIds) {
      const menuService = allMenuServices.find((service) => service.id === id);
      if (menuService) {
        counts[menuService.categoryId] =
          (counts[menuService.categoryId] ?? 0) + 1;
      }
    }
    return counts;
  }, [selectedServiceIds]);

  const activeCategoryLabel =
    menuCategories.find((category) => category.id === activeCategory)?.label ??
    "Services";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex h-[70dvh] w-full max-w-[430px] flex-col overflow-hidden rounded-2xl bg-(--bg-primary) shadow-(--shadow-glow)"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between gap-2 border-b border-(--border) px-3 py-3">
          <div>
            <h3 className="text-sm font-bold text-(--text-primary)">
              {mode === "add" ? "Add More Service" : "Change Service"}
            </h3>
            <p className="mt-0.5 text-[10px] text-(--text-muted)">
              {mode === "add"
                ? "Select one service, then staff and date/time"
                : "Browse categories and tap a service"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-(--border)"
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <CategorySidebar
            categories={menuCategories}
            activeId={activeCategory}
            onSelect={setActiveCategory}
            selectedCounts={selectedCounts}
          />

          <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-(--bg-secondary)">
            <div className="flex-1 overflow-y-auto px-2 pt-3 pb-3 scrollbar-thin scrollbar-thumb-(--accent-primary) scrollbar-track-(--bg-secondary)">
              <div className="mb-3">
                <h4 className="text-xs font-medium text-(--text-primary)">
                  {mode === "add" ? "Select a Service" : "Select Services"}
                </h4>
                <p className="text-[8px] text-(--text-muted)">
                  {activeCategoryLabel} · {categoryServices.length} available
                </p>
              </div>

              {categoryServices.length > 0 ? (
                <div className="grid grid-cols-3 gap-1.5">
                  {categoryServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      selected={selectedServiceIds.includes(service.id)}
                      onSelect={() => onPick(service.id)}
                    />
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-[10px] text-(--text-muted)">
                  No services in this category yet.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-(--border) px-3 py-3">
          <button
            type="button"
            onClick={onClose}
            className="primary-button w-full rounded-xl py-2.5 text-[12px] font-semibold text-white"
          >
            {mode === "add"
              ? "Cancel"
              : `Done (${selectedServiceIds.length} selected)`}
          </button>
        </div>
      </div>
    </div>
  );
}

function CancelBookingModal({
  onConfirm,
  onClose,
}: {
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-[340px] rounded-2xl bg-(--bg-primary) p-4 shadow-(--shadow-glow)"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-booking-title"
      >
        <h3
          id="cancel-booking-title"
          className="text-[16px] font-bold text-(--text-primary)"
        >
          Cancel this booking?
        </h3>
        <p className="mt-2 text-[12px] leading-snug text-(--text-secondary)">
          This will delete your booking. This action cannot be undone.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#2D1659] py-2.5 text-[13px] font-semibold text-[#2D1659]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-[#E53E3E] py-2.5 text-[13px] font-semibold text-white"
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
}

function RescheduleModal({
  services,
  bookingDays,
  initialServiceId,
  initialDayId,
  initialTime,
  onConfirm,
  onClose,
}: {
  services: { id: string; name: string; image: string; meta: string }[];
  bookingDays: ReturnType<typeof buildBookingDays>;
  initialServiceId: string;
  initialDayId: string;
  initialTime: string;
  onConfirm: (serviceId: string, dayId: string, time: string) => void;
  onClose: () => void;
}) {
  const [serviceId, setServiceId] = useState(initialServiceId);
  const [step, setStep] = useState<"service" | "datetime">("service");
  const [dayId, setDayId] = useState(initialDayId);
  const [time, setTime] = useState(initialTime);
  const selected = services.find((service) => service.id === serviceId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex max-h-[92dvh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-(--bg-primary)"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-(--border) px-4 py-3">
          <div>
            <h3 className="text-sm font-bold text-(--text-primary)">
              {step === "service" ? "Select Service" : "Select Date & Time"}
            </h3>
            <p className="mt-0.5 text-[11px] text-(--text-muted)">
              {step === "service"
                ? "Choose the service you want to reschedule"
                : selected?.name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-(--border)"
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>

        {step === "service" ? (
          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
            {services.map((service) => {
              const active = service.id === serviceId;
              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setServiceId(service.id)}
                  className={`
                    flex w-full items-center gap-3 rounded-xl border p-2 text-left
                    ${
                      active
                        ? "border-[#2D1659] bg-[#F3EAF8]"
                        : "border-(--border)"
                    }
                  `}
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-bold text-(--text-primary)">
                      {service.name}
                    </p>
                    <p className="text-[11px] text-(--text-muted)">
                      {service.meta}
                    </p>
                  </div>
                  {active && (
                    <Check size={16} className="shrink-0 text-[#2D1659]" />
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
            <BookingMonthCalendar
              days={bookingDays}
              activeDayId={dayId}
              onSelectDay={(nextDayId) => {
                const times = getAvailableTimeSlots(nextDayId, timeSlots);
                setDayId(nextDayId);
                setTime(times.includes(time) ? time : (times[0] ?? time));
              }}
            />
            <TimeSlotPicker
              activeDayId={dayId}
              activeTime={time}
              onSelectTime={setTime}
            />
          </div>
        )}

        <div className="border-t border-(--border) p-3.5">
          {step === "service" ? (
            <button
              type="button"
              disabled={!serviceId}
              onClick={() => setStep("datetime")}
              className="primary-button h-11 w-full rounded-xl text-[14px] font-semibold text-white disabled:opacity-50"
            >
              Next: Date & Time
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setStep("service")}
                className="h-11 rounded-xl border border-[#2D1659] text-[14px] font-semibold text-[#2D1659]"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => onConfirm(serviceId, dayId, time)}
                className="primary-button h-11 rounded-xl text-[14px] font-semibold text-white"
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function BookingConfirmedScreen({
  selectedServiceIds,
  selectedProductIds = [],
  productQuantities = {},
  organizationId,
  organizationBanner,
  staffId,
  serviceStaff,
  serviceSchedules,
  expertType = "",
  billingName = "",
  billingPhone = "",
  paymentMethod = "card",
  onSave,
  onReschedule,
  onCancelBooking,
}: BookingConfirmedScreenProps) {
  const router = useRouter();
  const tabButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const pendingSnapshot = useRef<HistoryEntry | null>(null);

  const [secondsLeft, setSecondsLeft] = useState(CANCEL_WINDOW_SECONDS);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<EditDraft | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [editPanel, setEditPanel] = useState<EditPanel>(null);
  const [servicePickerMode, setServicePickerMode] =
    useState<ServicePickerMode>("replace");
  const [addFlowServiceId, setAddFlowServiceId] = useState<string | null>(null);
  const [viewExpertId, setViewExpertId] = useState<string | null>(null);
  const [detailView, setDetailView] = useState<DetailView>("services");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  const org = organizationBanner ?? {
    name: bookingLocation.name,
    banner: bookingLocation.banner,
    availability: bookingLocation.availability,
    status: bookingLocation.status,
    thumbnail: bookingLocation.image,
    address: bookingLocation.address,
  };

  const displayServiceIds = draft?.serviceIds ?? selectedServiceIds;
  const displayStaff = draft?.staff ?? serviceStaff;
  const displaySchedules = draft?.schedules ?? serviceSchedules;

  const selectedServices = getSelectedServices(
    displayServiceIds,
    organizationId,
  );
  const selectedProducts = getSelectedProducts(selectedProductIds);
  const bookingDays = useMemo(() => buildBookingDays(new Date()), []);
  const therapists = useMemo(() => {
    let staff = getOrganizationStaff(organizationId);
    if (expertType === "male" || expertType === "female") {
      staff = staff.filter((member) => member.gender === expertType);
    }
    return staff.length > 0 ? staff : getOrganizationStaff(organizationId);
  }, [expertType, organizationId]);

  const items = useMemo(() => {
    const services = selectedServices.map((service) => {
      const assignedStaffId = displayStaff[service.id];
      const staff = assignedStaffId
        ? getStaff(assignedStaffId)
        : getStaff(staffId);
      const schedule = displaySchedules[service.id];
      const tax = Math.round(service.price * TAX_RATE);

      return {
        id: service.id,
        kind: "service" as const,
        name: service.name,
        meta: service.duration,
        price: service.price,
        tax,
        additional: 0,
        total: service.price + tax,
        image: service.image,
        staff,
        scheduleLabel: isServiceScheduleComplete(schedule)
          ? formatServiceSchedule(schedule)
          : "",
      };
    });

    const products = selectedProducts.map((product) => {
      const qty = Math.max(1, productQuantities[product.id] ?? 1);
      const price = product.price * qty;
      const tax = Math.round(price * TAX_RATE);

      return {
        id: product.id,
        kind: "product" as const,
        name: product.name,
        meta: `Qty ${qty}`,
        price,
        tax,
        additional: 0,
        total: price + tax,
        image: product.image,
        staff: null,
        scheduleLabel: "",
      };
    });

    return [...services, ...products];
  }, [
    displaySchedules,
    displayStaff,
    productQuantities,
    selectedProducts,
    selectedServices,
    staffId,
  ]);

  const bookingTotal =
    calcServicesTotal(displayServiceIds, organizationId).total +
    calcProductsTotal(selectedProductIds, productQuantities).total;

  useEffect(() => {
    setActiveIndex((current) => {
      if (items.length === 0) return 0;
      return Math.min(current, items.length - 1);
    });
  }, [items.length]);

  useEffect(() => {
    tabButtonRefs.current[activeIndex]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeIndex, items.length]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSecondsLeft((current) => (current <= 0 ? 0 : current - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const activeItem = items[activeIndex] ?? items[0];
  const targetServiceId =
    addFlowServiceId && displayServiceIds.includes(addFlowServiceId)
      ? addFlowServiceId
      : activeItem?.kind === "service"
        ? activeItem.id
        : (displayServiceIds[0] ?? "");
  const targetSchedule: ServiceSchedule =
    displaySchedules[targetServiceId] ?? createDefaultServiceSchedule();
  const isAddServiceFlow = Boolean(addFlowServiceId);
  const viewExpert = viewExpertId ? getStaff(viewExpertId) : null;
  const storeTitle = org.name.toLowerCase().includes("melbourne")
    ? org.name
    : `${org.name}, Melbourne`;
  const tabLabel = (kind: "service" | "product", index: number) =>
    `${kind === "product" ? "PRODUCT" : "SERVICE"} ${index + 1}`;

  const paymentLabel =
    {
      visa: "Visa",
      mastercard: "Mastercard",
      amex: "Amex",
      apple: "Apple Pay",
      google: "Google Pay",
      paypal: "PayPal",
      card: "Credit / Debit Card",
      razorpay: "Razorpay",
    }[paymentMethod] ?? "Card";

  const receiptItems = items
    .filter((item) => item.kind === "service")
    .map((item) => ({
      id: item.id,
      name: item.name,
      staffName: item.staff?.name ?? "Staff",
      arrival: formatInvoiceStamp(displaySchedules[item.id]) || "—",
      duration: item.meta,
      price: item.price,
      tax: item.tax,
      quantity: 1,
    }));

  const servedBy = receiptItems[0]?.staffName ?? "Staff";
  const invoiceDate =
    receiptItems[0]?.arrival && receiptItems[0].arrival !== "—"
      ? receiptItems[0].arrival
      : formatInvoiceStamp(displaySchedules[displayServiceIds[0] ?? ""]) ||
        new Date()
          .toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
          .replace(",", "");
  const serialNo = String((displayServiceIds.join("").length * 11) % 90 + 10);
  const docketNo = `39${serialNo}`;

  const currentDraft = (): EditDraft =>
    draft ?? {
      serviceIds: selectedServiceIds,
      staff: serviceStaff,
      schedules: serviceSchedules,
    };

  const beginChange = () => {
    pendingSnapshot.current = {
      draft: cloneDraft(currentDraft()),
      activeIndex,
    };
  };

  const applyDraft = (next: EditDraft) => {
    const snapshot = pendingSnapshot.current;
    pendingSnapshot.current = null;
    if (snapshot) {
      setHistory((current) => [...current, snapshot]);
    }
    setDraft(next);
  };

  const startEditing = () => {
    setDraft(
      cloneDraft({
        serviceIds: selectedServiceIds,
        staff: serviceStaff,
        schedules: serviceSchedules,
      }),
    );
    setHistory([]);
    pendingSnapshot.current = null;
    setDetailView("services");
    setIsEditing(true);
  };

  const exitEditing = () => {
    setIsEditing(false);
    setDraft(null);
    setHistory([]);
    pendingSnapshot.current = null;
    setEditPanel(null);
    setAddFlowServiceId(null);
  };

  const closeEditPanel = () => {
    pendingSnapshot.current = null;
    setAddFlowServiceId(null);
    setViewExpertId(null);
    setEditPanel(null);
  };

  const handleUndo = () => {
    const previous = history[history.length - 1];
    if (!previous) return;
    setHistory((current) => current.slice(0, -1));
    setDraft(cloneDraft(previous.draft));
    setActiveIndex(previous.activeIndex);
  };

  const handleCancelEdit = () => {
    exitEditing();
  };

  const handleSaveChanges = () => {
    if (draft) onSave?.(cloneDraft(draft));
    exitEditing();
  };

  const handleRemoveService = () => {
    if (
      !isEditing ||
      !targetServiceId ||
      displayServiceIds.length <= 1
    ) {
      return;
    }
    beginChange();
    const nextIds = displayServiceIds.filter((id) => id !== targetServiceId);
    const nextStaff = { ...displayStaff };
    const nextSchedules = { ...displaySchedules };
    delete nextStaff[targetServiceId];
    delete nextSchedules[targetServiceId];
    applyDraft({
      serviceIds: nextIds,
      staff: nextStaff,
      schedules: nextSchedules,
    });
  };

  const handlePickService = (serviceId: string) => {
    if (!targetServiceId && servicePickerMode === "replace") {
      setEditPanel(null);
      return;
    }

    beginChange();
    const live = currentDraft();

    if (servicePickerMode === "add") {
      if (live.serviceIds.includes(serviceId)) {
        pendingSnapshot.current = null;
        setActiveIndex(live.serviceIds.indexOf(serviceId));
        setAddFlowServiceId(null);
        setEditPanel(null);
        return;
      }
      applyDraft({
        serviceIds: [...live.serviceIds, serviceId],
        staff: { ...live.staff },
        schedules: {
          ...live.schedules,
          [serviceId]: createDefaultServiceSchedule(),
        },
      });
      setActiveIndex(live.serviceIds.length);
      setAddFlowServiceId(serviceId);
      setEditPanel("staff");
      return;
    }

    if (serviceId === targetServiceId) {
      pendingSnapshot.current = null;
      setEditPanel(null);
      return;
    }

    if (live.serviceIds.includes(serviceId)) {
      pendingSnapshot.current = null;
      setActiveIndex(live.serviceIds.indexOf(serviceId));
      setEditPanel(null);
      return;
    }

    const nextIds = live.serviceIds.map((id) =>
      id === targetServiceId ? serviceId : id,
    );
    const nextStaff = { ...live.staff };
    const nextSchedules = { ...live.schedules };
    if (nextStaff[targetServiceId]) {
      nextStaff[serviceId] = nextStaff[targetServiceId];
    }
    if (nextSchedules[targetServiceId]) {
      nextSchedules[serviceId] = { ...nextSchedules[targetServiceId] };
    }
    delete nextStaff[targetServiceId];
    delete nextSchedules[targetServiceId];
    applyDraft({
      serviceIds: nextIds,
      staff: nextStaff,
      schedules: nextSchedules,
    });
    setEditPanel(null);
  };

  const handlePickStaff = (nextStaffId: string) => {
    if (!targetServiceId) return;
    beginChange();
    applyDraft({
      ...currentDraft(),
      staff: {
        ...currentDraft().staff,
        [targetServiceId]: nextStaffId,
      },
    });
    if (isAddServiceFlow) {
      beginChange();
      setEditPanel("datetime");
      return;
    }
    setEditPanel(null);
  };

  const patchSchedule = (partial: Partial<ServiceSchedule>) => {
    if (!targetServiceId) return;
    const live = currentDraft();
    const current =
      live.schedules[targetServiceId] ?? createDefaultServiceSchedule();
    const next: EditDraft = {
      ...live,
      schedules: {
        ...live.schedules,
        [targetServiceId]: {
          ...current,
          ...partial,
          isSet: true,
        },
      },
    };
    if (pendingSnapshot.current) {
      applyDraft(next);
      return;
    }
    setDraft(next);
  };

  const openServicePicker = (mode: ServicePickerMode) => {
    setServicePickerMode(mode);
    setAddFlowServiceId(null);
    setEditPanel("services");
  };

  return (
    <div className="mx-auto min-h-dvh w-full max-w-[430px] bg-(--bg-primary) pb-[110px] lg:pb-8">
      <header className="relative overflow-hidden bg-[#2D1659] px-4 py-5">
        <Sparkle className="left-14 top-2 h-3 w-3" color="#E8A0C0" />
        <Sparkle className="right-10 top-3 h-2.5 w-2.5" color="#C69C6D" />
        <Sparkle className="bottom-4 left-8 h-2 w-2" color="#B9A3E8" />
        <Sparkle className="right-16 bottom-5 h-3.5 w-3.5" color="#E8A0C0" />
        <Sparkle className="top-1/2 right-6 h-2 w-2" color="#F4D399" />
        <span className="pointer-events-none absolute top-8 left-1/2 h-1.5 w-1.5 rounded-full bg-[#C69C6D]/80" />
        <span className="pointer-events-none absolute right-24 top-10 h-1 w-1 rounded-full bg-white/50" />

        <div className="relative z-10 flex items-center gap-3.5">
          <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-white shadow-[0_6px_16px_rgba(0,0,0,0.18)]">
            <Check size={28} strokeWidth={3.2} className="text-[#C69C6D]" />
          </span>
          <div className="min-w-0">
            <h1 className="text-[20px] leading-tight font-bold text-white">
              Booking Confirmed!
            </h1>
            <p className="mt-1 text-[12px] leading-snug text-white/85">
              Your booking has been confirmed. We look forward to serving you.
            </p>
          </div>
        </div>
      </header>

      <div className="space-y-4 px-3.5 pt-3.5">
        <div className="flex items-start gap-2.5 rounded-xl bg-[#FDECEC] px-3 py-2.5">
          <Timer
            size={22}
            strokeWidth={2.2}
            className="mt-0.5 shrink-0 text-[#E53E3E]"
          />
          <div className="min-w-0">
            {isEditing ? (
              <p className="text-[13px] leading-snug text-(--text-primary)">
                You have{" "}
                <span className="font-bold tabular-nums text-[#D32F2F]">
                  {formatCountdown(secondsLeft)}
                </span>{" "}
                to save your changes. Changes must be saved before the timer
                ends, otherwise cancellation charges may apply.
              </p>
            ) : (
              <>
                <p className="text-[13px] leading-snug text-(--text-primary)">
                  You have{" "}
                  <span className="font-bold tabular-nums text-[#D32F2F]">
                    {formatCountdown(secondsLeft)}
                  </span>{" "}
                  to cancel or modify your booking.
                </p>
                <p className="mt-1 text-[10px] leading-snug text-(--text-secondary)">
                  Cancel your booking before 7 minutes, otherwise cancellation
                  charges will be applicable.
                </p>
              </>
            )}
          </div>
        </div>

        <section>
          <div className="mb-2.5 flex items-center justify-between gap-2">
            <h2 className="text-[16px] font-bold text-(--text-primary)">
              Booking Details
            </h2>
            {isEditing && (
              <button
                type="button"
                onClick={() => openServicePicker("add")}
                className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#2D1659]"
              >
                Add More Service
                <CirclePlus size={16} strokeWidth={2.2} />
              </button>
            )}
          </div>

          <div className="mb-3 flex items-center gap-2.5">
            <div className="relative h-[42px] w-[52px] shrink-0 overflow-hidden rounded-[5px]">
              <Image
                src={org.thumbnail ?? org.banner}
                alt={org.name}
                fill
                sizes="52px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-bold text-(--text-primary)">
                {storeTitle}
              </p>
              <p className="truncate text-[11px] text-(--text-muted)">
                {org.address ?? bookingLocation.address}
              </p>
            </div>
            {!isEditing && (
              <button
                type="button"
                aria-label="Message store"
                onClick={() => setDetailView("chat")}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2D1659] text-white"
              >
                <MessageCircle size={18} strokeWidth={2} />
              </button>
            )}
          </div>

          {detailView === "receipt" ? (
            <BookingConfirmedReceipt
              storeName={org.name}
              storeAddress={org.address ?? bookingLocation.address}
              docketNo={docketNo}
              serialNo={serialNo}
              dateLabel={invoiceDate}
              servedBy={servedBy}
              customerName={billingName}
              customerPhone={billingPhone}
              paymentMethod={paymentLabel}
              items={receiptItems}
              onBack={() => setDetailView("services")}
            />
          ) : detailView === "chat" ? (
            <BookingStoreChat
              storeName={storeTitle}
              storeImage={org.thumbnail ?? org.banner}
              onBack={() => setDetailView("services")}
            />
          ) : (
            <>
          {items.length > 0 && (
            <div className="mb-2.5 flex items-end gap-2 border-b border-(--border)/60">
              <div
                className="scrollbar-none flex min-w-0 flex-1 gap-4 overflow-x-auto"
                role="tablist"
                aria-label="Booking items"
              >
                {items.map((item, index) => {
                  const active = index === activeIndex;
                  return (
                    <button
                      key={`${item.kind}-${item.id}`}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      ref={(node) => {
                        tabButtonRefs.current[index] = node;
                      }}
                      onClick={() => setActiveIndex(index)}
                      className={`
                        shrink-0 whitespace-nowrap -mb-px pb-1.5 text-[11px] font-bold
                        tracking-[0.08em]
                        ${
                          active
                            ? "border-b-2 border-[#2D1659] text-[#2D1659]"
                            : "border-b-2 border-transparent text-(--text-muted)"
                        }
                      `}
                    >
                      {tabLabel(item.kind, index)}
                    </button>
                  );
                })}
              </div>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={history.length === 0}
                  className="mb-1.5 inline-flex shrink-0 items-center gap-1 text-[12px] font-semibold text-[#C69C6D] disabled:opacity-40"
                >
                  Undo
                  <RotateCcw size={13} strokeWidth={2.3} />
                </button>
              )}
              {!isEditing && (
                <button
                  type="button"
                  onClick={startEditing}
                  // disabled={history.length === 0}
                  className=" bg-[#2D1659] m-1.5 inline-flex shrink-0 items-center px-1 py-0.5 rounded-[4px] gap-1 text-[12px] font-semibold text-white disabled:opacity-40"
                >
                  <PencilLine size={13} strokeWidth={2.3} />
                  Edit
                </button>
              )}
            </div>
          )}

          {activeItem && (
            <div className="rounded-xl border border-(--brand-gold)/55 bg-(--bg-card) p-2.5">
              <div className="mb-2.5 flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2D1659]">
                  <ShoppingBag size={13} className="text-white" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] leading-tight font-bold text-(--text-primary)">
                    Selected Services
                  </p>
                  <p className="text-[10px] text-(--text-muted)">
                    {items.length}{" "}
                    {items.length === 1 ? "service" : "services"} added
                  </p>
                </div>
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleRemoveService}
                    disabled={displayServiceIds.length <= 1}
                    className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-[#E53E3E] disabled:opacity-40"
                  >
                    Remove Service
                    <Trash2 size={13} strokeWidth={2.2} />
                  </button>
                )}
                <p className="text-[16px] font-bold text-(--brand-gold)">
                  ${bookingTotal}
                </p>
              </div>

              {(() => {
                const activeSchedule =
                  activeItem.kind === "service"
                    ? displaySchedules[activeItem.id]
                    : undefined;
                const activeScheduled = Boolean(
                  activeSchedule &&
                    isServiceScheduleComplete(activeSchedule),
                );
                const activeBookingDay = activeScheduled
                  ? getBookingDay(activeSchedule!.dayId)
                  : null;

                return (
                  <BookingPreviewCards
                    serviceName={activeItem.name}
                    serviceImage={activeItem.image}
                    serviceDuration={activeItem.meta}
                    servicePriceLabel={`$${activeItem.price}`}
                    staffName={activeItem.staff?.name}
                    staffImage={activeItem.staff?.image}
                    monthLabel={
                      activeBookingDay
                        ? new Date(
                            `${activeBookingDay.date}, ${new Date().getFullYear()}`,
                          ).toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                          })
                        : "Date & Time"
                    }
                    dateLabel={activeBookingDay?.date}
                    weekdayLabel={activeBookingDay?.weekday}
                    timeLabel={
                      activeScheduled ? activeSchedule!.time : undefined
                    }
                    scheduled={activeScheduled && Boolean(activeBookingDay)}
                    totalAmountLabel={`$${activeItem.total}`}
                  />
                );
              })()}
            </div>
          )}

          {isEditing && (
            <div className="mt-3 space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => openServicePicker("replace")}
                  className="flex items-center gap-1.5 rounded-sm bg-[#2D1659] px-2 py-2.5 text-left text-white"
                >
                  <ShoppingBag size={14} strokeWidth={2} className="shrink-0" />
                  <span className="min-w-0 flex-1 text-[7px] font-semibold leading-tight">
                    Change Service
                  </span>
                  <ChevronRight size={12} strokeWidth={2.5} className="shrink-0" />
                </button>
                <button
                  type="button"
                  onClick={() => setEditPanel("staff")}
                  className="flex items-center gap-1.5 rounded-sm bg-[#2D1659] px-2 py-2.5 text-left text-white"
                >
                  <UserRound size={14} strokeWidth={2} className="shrink-0" />
                  <span className="min-w-0 flex-1 text-[8px] font-semibold leading-tight">
                    Change Staff
                  </span>
                  <ChevronRight size={12} strokeWidth={2.5} className="shrink-0" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    beginChange();
                    setEditPanel("datetime");
                  }}
                  className="flex items-center gap-1.5 rounded-sm bg-[#2D1659] px-2 py-2.5 text-left text-white"
                >
                  <CalendarClock size={14} strokeWidth={2} className="shrink-0" />
                  <span className="min-w-0 flex-1 text-[8px] font-semibold leading-tight">
                    Date &amp; Time
                  </span>
                  <ChevronRight size={12} strokeWidth={2.5} className="shrink-0" />
                </button>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-[#F3EAF8] px-3 py-2.5">
                <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-(--text-primary)">
                  <ClipboardList size={16} className="text-[#2D1659]" />
                  Total Amount
                </span>
                <span className="text-[16px] font-bold text-(--brand-gold)">
                  ${bookingTotal}
                </span>
              </div>

              <div className="flex items-start gap-2 rounded-lg bg-[#EFE6F6] px-3 py-2">
                <Info
                  size={14}
                  strokeWidth={2.2}
                  className="mt-0.5 shrink-0 text-[#4A6FA5]"
                />
                <p className="text-[10px] leading-snug text-(--text-secondary)">
                  Editing booking may affect the total amount. Please review and
                  confirm your changes.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="rounded-xl border border-[#2D1659] py-3 text-[14px] font-semibold text-[#2D1659]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  className="rounded-xl bg-[#2D1659] py-3 text-[14px] font-semibold text-white"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
            </>
          )}
        </section>

        {!isEditing && detailView === "services" && (
          <>
            <div className="flex items-center gap-2.5 rounded-xl bg-[#EFE6F6] px-3 py-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2D1659] text-white">
                <MessageCircle size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-bold text-(--text-primary)">
                  Be in touch with store
                </p>
                <p className="text-[10px] leading-snug text-(--text-secondary)">
                  You can message the store for any questions or special
                  requests.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDetailView("chat")}
                className="inline-flex shrink-0 items-center gap-1 rounded-md border border-[#2D1659] px-2 py-1.5 text-[10px] font-semibold text-[#2D1659]"
              >
                <MessageCircle size={12} />
                Message Store
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDetailView("receipt")}
                className="flex flex-col items-center justify-center gap-1.5 rounded-xl bg-[#F3EAF8] px-1 py-3"
              >
                <ReceiptText size={20} className="text-[#6B3FA0]" />
                <span className="text-center text-[10px] leading-tight font-semibold text-(--text-primary)">
                  View Receipt
                </span>
              </button>
              <button
                type="button"
                onClick={() => setShowRescheduleModal(true)}
                className="flex flex-col items-center justify-center gap-1.5 rounded-xl bg-[#F8F1E3] px-1 py-3"
              >
                <CalendarClock size={20} className="text-[#C69C6D]" />
                <span className="text-center text-[10px] leading-tight font-semibold text-(--text-primary)">
                  Reschedule
                </span>
              </button>
              <button
                type="button"
                onClick={() => setShowCancelModal(true)}
                className="flex flex-col items-center justify-center gap-1.5 rounded-xl bg-[#FDECEC] px-1 py-3"
              >
                <XCircle size={20} className="text-[#E53E3E]" />
                <span className="text-center text-[10px] leading-tight font-semibold text-[#E53E3E]">
                  Cancel Booking
                </span>
              </button>
              {/* <button
                type="button"
                onClick={startEditing}
                className="flex flex-col items-center justify-center gap-1.5 rounded-xl bg-[#EAF1F7] px-1 py-3"
              >
                <PencilLine size={20} className="text-[#3B6B8A]" />
                <span className="text-center text-[10px] leading-tight font-semibold text-(--text-primary)">
                  Edit Booking
                </span>
              </button> */}
            </div>

            <button
              type="button"
              onClick={() => router.push("/home")}
              className="w-full rounded-xl bg-[#2D1659] py-3.5 text-[15px] font-semibold text-white"
            >
              Back to Home
            </button>
          </>
        )}
      </div>

      {editPanel === "services" && (
        <ConfirmedServiceMenuModal
          mode={servicePickerMode}
          selectedServiceIds={displayServiceIds}
          currentServiceId={targetServiceId}
          onPick={handlePickService}
          onClose={closeEditPanel}
        />
      )}

      {editPanel === "staff" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3"
          onClick={closeEditPanel}
          role="presentation"
        >
          <div
            className="flex max-h-[88dvh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-(--bg-primary) shadow-(--shadow-glow)"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between border-b border-(--border) px-4 py-3">
              <div>
                <h3 className="text-sm font-bold text-(--text-primary)">
                  {isAddServiceFlow
                    ? "Select Staff / Therapist"
                    : "Change Staff / Therapist"}
                </h3>
                <p className="mt-0.5 text-[11px] text-(--text-muted)">
                  {isAddServiceFlow
                    ? "Choose a therapist, then pick date & time"
                    : "Choose a therapist for this service"}
                </p>
              </div>
              <button
                type="button"
                onClick={closeEditPanel}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-(--border)"
                aria-label="Close"
              >
                <X size={14} />
              </button>
            </div>
            <div className="p-3">
              <div className="rounded-xl border border-(--border) bg-(--bg-secondary) p-2">
                <div className="scrollbar-none flex gap-2 overflow-x-auto pb-0.5">
                  {therapists.map((therapist) => {
                    const active =
                      displayStaff[targetServiceId] === therapist.id;
                    return (
                      <button
                        key={therapist.id}
                        type="button"
                        onClick={() => handlePickStaff(therapist.id)}
                        className={`
                          feature-card w-[96px] shrink-0 rounded-xl p-1.5 text-left
                          transition-all duration-200
                          ${
                            active
                              ? "border-(--accent-primary) shadow-(--shadow-glow)"
                              : "hover:border-[color-mix(in_srgb,var(--accent-primary)_30%,var(--border))]"
                          }
                        `}
                      >
                        <div className="relative h-[78px] overflow-hidden rounded-sm">
                          <Image
                            src={therapist.image}
                            alt={therapist.name}
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                          {active && (
                            <span className="border-3 border-white primary-button absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full text-white">
                              <Check size={10} strokeWidth={2.5} />
                            </span>
                          )}
                        </div>

                        <p className="mt-1.5 truncate text-[13px] font-bold text-(--text-primary)">
                          {therapist.name}
                        </p>

                        <div className="mt-1 flex items-center gap-2">
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={(event) => {
                              event.stopPropagation();
                              setViewExpertId(therapist.id);
                            }}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.stopPropagation();
                                setViewExpertId(therapist.id);
                              }
                            }}
                            className="w-full rounded-sm bg-(--accent-primary) px-2 text-center text-[10px] font-semibold uppercase tracking-wide text-white"
                          >
                            View
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewExpert && (
        <ExpertProfileModal
          staff={viewExpert}
          onClose={() => setViewExpertId(null)}
        />
      )}

      {editPanel === "datetime" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-0 sm:p-3"
          onClick={closeEditPanel}
          role="presentation"
        >
          <div
            className="flex max-h-[92dvh] w-[95%] max-w-md flex-col overflow-hidden rounded-2xl bg-(--bg-primary)"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between border-b border-(--border) px-4 py-3">
              <div>
                <h3 className="text-sm font-bold text-(--text-primary)">
                  {isAddServiceFlow
                    ? "Select Date & Time"
                    : "Change Date & Time"}
                </h3>
                <p className="mt-0.5 text-[11px] text-(--text-muted)">
                  {items.find((item) => item.id === targetServiceId)?.name ??
                    activeItem?.name}
                </p>
              </div>
              <button
                type="button"
                onClick={closeEditPanel}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-(--border)"
                aria-label="Close"
              >
                <X size={14} />
              </button>
            </div>
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
              <BookingMonthCalendar
                days={bookingDays}
                activeDayId={targetSchedule.dayId}
                onSelectDay={(dayId) => {
                  const times = getAvailableTimeSlots(dayId, timeSlots);
                  const time = times.includes(targetSchedule.time)
                    ? targetSchedule.time
                    : (times[0] ?? targetSchedule.time);
                  patchSchedule({ dayId, time });
                }}
              />
              <TimeSlotPicker
                activeDayId={targetSchedule.dayId}
                activeTime={targetSchedule.time}
                onSelectTime={(time) => patchSchedule({ time })}
              />
            </div>
            <div className="border-t border-(--border) p-3.5">
              <button
                type="button"
                onClick={() => {
                  pendingSnapshot.current = null;
                  setAddFlowServiceId(null);
                  setEditPanel(null);
                }}
                className="primary-button h-11 w-full rounded-xl text-[14px] font-semibold text-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {showCancelModal && (
        <CancelBookingModal
          onClose={() => setShowCancelModal(false)}
          onConfirm={() => {
            setShowCancelModal(false);
            onCancelBooking?.();
            router.push("/home");
          }}
        />
      )}

      {showRescheduleModal && (
        <RescheduleModal
          services={items
            .filter((item) => item.kind === "service")
            .map((item) => ({
              id: item.id,
              name: item.name,
              image: item.image,
              meta: item.meta,
            }))}
          bookingDays={bookingDays}
          initialServiceId={targetServiceId}
          initialDayId={targetSchedule.dayId}
          initialTime={targetSchedule.time}
          onClose={() => setShowRescheduleModal(false)}
          onConfirm={(serviceId, dayId, time) => {
            onReschedule?.(serviceId, dayId, time);
            setShowRescheduleModal(false);
          }}
        />
      )}
    </div>
  );
}
