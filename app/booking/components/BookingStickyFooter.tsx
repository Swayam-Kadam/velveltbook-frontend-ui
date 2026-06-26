import { ChevronRight, Lock } from "lucide-react";

interface BookingStickyFooterProps {
  totalLabel: string;
  buttonLabel: string;
  onAction: () => void;
  showLock?: boolean;
}

export function BookingStickyFooter({
  totalLabel,
  buttonLabel,
  onAction,
  showLock = false,
}: BookingStickyFooterProps) {
  return (
    <div
      className="
         left-2 right-2 z-40 mt-3
        feature-card overflow-hidden rounded-xl p-0
      "
    >
      <div className="flex items-stretch">
        <div className="flex flex-col justify-center px-3 py-2.5">
          <span className="text-[8px] text-(--text-muted)">Total Payable</span>
          <span className="text-sm font-semibold text-(--text-primary)">
            {totalLabel}
          </span>
        </div>

        <button
          type="button"
          onClick={onAction}
          className="
            primary-button flex flex-1 items-center justify-center gap-1.5
            rounded-none px-3 py-3 text-[9px] font-medium text-white
          "
        >
          {showLock && <Lock size={12} strokeWidth={1.8} />}
          <span>{buttonLabel}</span>
          {!showLock && <ChevronRight size={14} strokeWidth={2} />}
        </button>
      </div>
    </div>
  );
}
