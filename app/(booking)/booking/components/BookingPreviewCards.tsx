import Image from "next/image";
import { Clock3, Pencil, Star } from "lucide-react";

interface BookingPreviewCardsProps {
  serviceName: string;
  serviceImage: string;
  serviceDuration: string;
  servicePriceLabel: string;
  staffName?: string | null;
  staffImage?: string | null;
  fallbackStaffImage?: string;
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
  if (!visible || !onClick) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-1 bg-(--text-primary) text-[12px] font-bold text-white"
    >
      <Pencil size={12} />
      Change
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
      <div className="grid grid-cols-3 gap-2">
        <div className="flex min-w-0 flex-col overflow-hidden rounded-[18px] border border-(--border) bg-(--bg-secondary)">
          <div className="relative h-[80px] w-full overflow-hidden bg-(--bg-card-hover)">
            <Image
              src={serviceImage}
              alt={serviceName}
              width={240}
              height={180}
              sizes="140px"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col space-y-1 pt-2">
            <p className="min-h-6 px-2 text-[10px] font-bold leading-tight text-(--text-primary)">
              {serviceName}
            </p>
            <span className="w-full bg-(--accent-primary) px-2 py-1 text-center text-[11px] font-semibold uppercase tracking-wide text-white">
              Service
            </span>
            <div className="flex flex-col items-left justify-between gap-1 px-2">
              <span className="flex items-center gap-1 text-[8px] font-semibold text-(--text-secondary)">
                <Clock3 size={10} className="shrink-0" />
                {serviceDuration}
              </span>
              <span className="text-[12px] font-bold text-(--brand-gold)">
                {servicePriceLabel}
              </span>
            </div>
          </div>
          <ChangeBoxButton
            visible={showChangeButtons}
            onClick={onChangeService}
          />
        </div>

        <div className="flex min-w-0 flex-col overflow-hidden rounded-[18px] border border-(--border) bg-(--bg-secondary)">
          <div className="relative h-[80px] w-full overflow-hidden bg-(--bg-card-hover)">
            <Image
              src={resolvedStaffImage}
              alt={staffName ?? "Staff"}
              width={240}
              height={180}
              sizes="140px"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col pt-2">
            <p className="h-7 text-center text-[14px] font-bold text-(--text-primary)">
              {staffName ?? "Not selected"}
            </p>
            <span className="w-full bg-(--accent-primary) px-2 py-1 text-center text-[11px] font-semibold uppercase tracking-wide text-white">
              Staff
            </span>
            <div className="flex items-center justify-center gap-0.5 p-1">
            <Star
              size={15}
              className="fill-(--brand-gold) text-(--brand-gold)"
            />
            <span className="font-medium text-(--text-primary)">
              4.5
            </span>
          </div>
          </div>
          <ChangeBoxButton visible={showChangeButtons} onClick={onChangeStaff} />
        </div>

        <div className="flex min-w-0 flex-col overflow-hidden rounded-[18px] border border-(--border) bg-(--bg-secondary)">
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="bg-(--accent-primary) px-2 py-2 text-center">
              <p className="text-[8px] font-semibold uppercase tracking-wide text-white">
                {monthLabel}
              </p>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center bg-(--bg-card) py-2 text-center">
              {scheduled && dateLabel ? (
                <>
                  <span className="mt-8 mb-4 text-[25px] font-bold leading-none text-(--accent-primary) h-8">
                    {dateLabel}
                  </span>
                  {weekdayLabel ? (
                    <span className=" w-full bg-(--accent-primary) px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                      {weekdayLabel}
                    </span>
                  ) : null}
                  {timeLabel ? (
                    <span className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-(--text-primary)">
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
          </div>
          <ChangeBoxButton
            visible={showChangeButtons}
            onClick={onChangeDateTime}
          />
        </div>
      </div>

      {totalAmountLabel ? (
        <div className="mt-3 flex items-center justify-between border-t border-(--border) pt-2">
          <div className="flex items-center gap-1 text-[9px] font-semibold text-(--text-primary)">
            <span>Total Amount</span>
          </div>
          <span className="text-[16px] font-bold text-(--accent-primary)">
            {totalAmountLabel}
          </span>
        </div>
      ) : null}
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
