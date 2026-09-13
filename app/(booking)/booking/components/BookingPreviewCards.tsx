import Image from "next/image";
import { Clock3, Pencil, Star, UserRound } from "lucide-react";

interface BookingPreviewCardsProps {
  serviceName: string;
  serviceImage: string;
  serviceDuration: string;
  servicePriceLabel: string;
  staffName?: string | null;
  staffImage?: string | null;
  fallbackStaffImage?: string;
  autoStaff?: boolean;
  monthLabel?: string;
  dateLabel?: string;
  weekdayLabel?: string;
  timeLabel?: string;
  scheduled?: boolean;
  showChangeButtons?: boolean;
  onChangeService?: () => void;
  onChangeStaff?: () => void;
  onChangeDateTime?: () => void;
  totalAmountLabel?: string;
}

function ChangeBoxButton({
  visible,
  onClick,
}: {
  visible: boolean;
  onClick?: () => void;
}) {
  if (!visible) return null;

  const canChange = Boolean(onClick);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!canChange}
      className={`
        flex w-full items-center justify-center gap-1 border-t-[2px] border-white
        py-1 text-[12px] font-bold text-(--text-primary)
        ${canChange ? "bg-(--brand-gold)" : "cursor-default bg-(--brand-gold-light)"}
      `}
    >
      {canChange ? "Change" : "Default"}
    </button>
  );
}

export function BookingPreviewCards({
  serviceName,
  serviceImage,
  serviceDuration,
  servicePriceLabel,
  staffName,
  staffImage,
  fallbackStaffImage,
  autoStaff = false,
  monthLabel = "Date & Time",
  dateLabel,
  weekdayLabel,
  timeLabel,
  scheduled = false,
  showChangeButtons = false,
  onChangeService,
  onChangeStaff,
  onChangeDateTime,
  totalAmountLabel,
}: BookingPreviewCardsProps) {
  const resolvedStaffImage = staffImage ?? fallbackStaffImage ?? serviceImage;

  return (
    <>
      <div className="grid grid-cols-3 items-stretch gap-2">
        <div className="flex h-full w-full min-w-0 flex-col overflow-hidden rounded-[10px] border border-(--border) bg-(--bg-secondary)">
          <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-(--bg-card-hover)">
            <Image
              src={serviceImage}
              alt={serviceName}
              fill
              sizes="120px"
              className="object-cover"
            />
          </div>
          <div className="flex h-[92px] flex-col overflow-hidden pt-1.5">
            <p className="line-clamp-2 px-1.5 text-[10px] font-bold leading-tight text-(--text-primary)">
              {serviceName}
            </p>
            <div className="mt-0.5 flex flex-col gap-0.5 px-1.5">
              <span className="flex items-center gap-1 text-[8px] font-semibold text-(--text-secondary)">
                <Clock3 size={10} className="shrink-0" />
                {serviceDuration}
              </span>
              <span className="text-[12px] font-bold text-(--brand-gold)">
                {servicePriceLabel}
              </span>
            </div>
            <span className="mt-auto w-full bg-(--accent-primary) px-2 py-1 text-center text-[11px] font-semibold uppercase tracking-wide text-white">
              Service
            </span>
          </div>
          <ChangeBoxButton
            visible={showChangeButtons}
            onClick={onChangeService}
          />
        </div>

        <div className="flex h-full w-full min-w-0 flex-col overflow-hidden rounded-[10px] border border-(--border) bg-(--bg-secondary)">
          <div className="relative flex aspect-square w-full shrink-0 items-center justify-center overflow-hidden bg-(--bg-card-hover)">
            {autoStaff ? (
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-(--border) bg-(--bg-card)">
                <UserRound
                  size={28}
                  strokeWidth={1.75}
                  className="text-(--text-muted)"
                />
              </span>
            ) : (
              <Image
                src={resolvedStaffImage}
                alt={staffName ?? "Staff"}
                fill
                sizes="120px"
                className="object-cover"
              />
            )}
          </div>
          <div className="flex h-[92px] flex-col overflow-hidden pt-1.5">
            <p className="line-clamp-1 px-1 text-center text-[13px] font-bold text-(--text-primary)">
              {autoStaff ? "Auto" : (staffName ?? "Not selected")}
            </p>
            <div className="mt-0.5 flex items-center justify-center gap-0.5">
              <Star
                size={10}
                className="fill-(--brand-gold) text-(--brand-gold)"
              />
              <span className="text-[11px] text-(--text-primary)">4.5</span>
            </div>
            <span className="mt-auto w-full bg-(--accent-primary) px-2 py-1 text-center text-[11px] font-semibold uppercase tracking-wide text-white">
              Staff
            </span>
          </div>
          <ChangeBoxButton
            visible={showChangeButtons}
            onClick={autoStaff ? undefined : onChangeStaff}
          />
        </div>

        <div className="flex h-full w-full min-w-0 flex-col overflow-hidden rounded-[10px] border border-(--border) bg-(--bg-secondary)">
          <div className="shrink-0 bg-(--accent-primary) px-2 py-1.5 text-center">
            <p className="truncate text-[8px] font-semibold uppercase tracking-wide text-white">
              {monthLabel}
            </p>
          </div>

          <div className="flex min-h-0 flex-1 flex-col items-center justify-center bg-(--bg-card) px-1 text-center">
            {scheduled && dateLabel ? (
              <>
                <span className="text-[22px] font-bold leading-none text-(--accent-primary)">
                  {dateLabel}
                </span>
                {timeLabel ? (
                  <span className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-(--text-primary)">
                    <Clock3
                      size={10}
                      className="shrink-0 text-(--accent-primary)"
                    />
                    {timeLabel}
                  </span>
                ) : null}
              </>
            ) : (
              <p className="px-2 text-[9px] font-semibold leading-tight text-(--text-muted)">
                Not scheduled
              </p>
            )}
          </div>

          <span className="w-full shrink-0 bg-(--accent-primary) px-2 py-1 text-center text-[11px] font-semibold uppercase tracking-wide text-white">
            {weekdayLabel || "Date"}
          </span>
          <ChangeBoxButton
            visible={showChangeButtons}
            onClick={onChangeDateTime}
          />
        </div>
      </div>

      {/* {totalAmountLabel ? (
        <div className="mt-3 flex items-center justify-between border-t border-(--border) pt-2">
          <div className="flex items-center gap-1 text-[9px] font-semibold text-(--text-primary)">
            <span>Total Amount</span>
          </div>
          <span className="text-[16px] font-bold text-(--accent-primary)">
            {totalAmountLabel}
          </span>
        </div>
      ) : null} */}
    </>
  );
}

export function parseDateLabelForPreview(dateLabel: string) {
  const parsed = new Date(dateLabel);
  if (Number.isNaN(parsed.getTime())) {
    return {
      monthLabel: "Date & Time",
      dateLabel: "",
      weekdayLabel: "",
      scheduled: false,
    };
  }

  return {
    monthLabel: parsed.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
    dateLabel: parsed.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    weekdayLabel: parsed.toLocaleDateString("en-US", { weekday: "long" }),
    scheduled: true,
  };
}
