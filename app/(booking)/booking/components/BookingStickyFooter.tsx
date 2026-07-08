import { ChevronRight, Lock } from "lucide-react";

interface BookingStickyFooterProps {
  totalLabel: string;
  buttonLabel: string;
  onAction: () => void;
  showLock?: boolean;
  buttonSubtext?: string;
  disabled?: boolean;
}

export function BookingStickyFooter({
  totalLabel,
  buttonLabel,
  onAction,
  showLock = false,
  buttonSubtext,
  disabled = false,
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
          disabled={disabled}
          className="
            primary-button flex flex-1 flex-col items-center justify-center
            gap-0.5 rounded-none px-3 py-2.5 text-white
            disabled:cursor-not-allowed disabled:opacity-50
          "
        >
          <span className="flex items-center gap-1.5 text-[9px] font-medium">
            {showLock && <Lock size={12} strokeWidth={1.8} />}
            {buttonLabel}
            {!showLock && <ChevronRight size={14} strokeWidth={2} />}
          </span>
          {buttonSubtext && (
            <span className="text-[6px] font-normal text-white/75">
              {buttonSubtext}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
