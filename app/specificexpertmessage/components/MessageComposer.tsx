import { Camera, ImageIcon, Mic } from "lucide-react";

export function MessageComposer() {
  return (
    <div className="flex items-center gap-1.5 border-t border-(--border) pt-2">
      <input
        type="text"
        placeholder="Type your message..."
        className="
          search-glass min-w-0 flex-1 rounded-lg border px-2.5 py-2
          text-[9px] text-(--text-primary)
          placeholder:text-(--text-muted)
          focus:outline-none
        "
      />

      <button
        type="button"
        className="
          primary-button shrink-0 rounded-lg px-2.5 py-1.5
          text-[12px] font-bold text-white
        "
      >
        Send
      </button>

      <button
        type="button"
        aria-label="Attach image"
        className="shrink-0 p-1 text-(--text-primary)"
      >
        <ImageIcon size={22} strokeWidth={1.6} />
      </button>

      <button
        type="button"
        aria-label="Attach video"
        className="shrink-0 p-1 text-(--text-primary)"
      >
        <Camera size={22} strokeWidth={1.6} />
      </button>

      <button
        type="button"
        aria-label="Voice message"
        className="shrink-0 p-1 text-(--text-primary)"
      >
        <Mic size={22} strokeWidth={1.6} />
      </button>
    </div>
  );
}
