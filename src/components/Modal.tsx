import { useEffect, useEffectEvent, useRef, type ReactNode } from "react";
import { Icon } from "./Icon";

export function Modal({
  open,
  onClose,
  title,
  eyebrow,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const close = useEffectEvent(onClose);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    window.setTimeout(() => dialogRef.current?.focus(), 0);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previous?.focus();
    };
  }, [open]);
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-end bg-[#17211b]/55 p-0 backdrop-blur-sm sm:place-items-center sm:p-5"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-4xl bg-[#fffdf8] p-6 shadow-2xl outline-none sm:max-w-lg sm:rounded-4xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            {eyebrow && (
              <p className="mb-2 text-xs font-bold uppercase tracking-[.2em] text-[#e75d43]">
                {eyebrow}
              </p>
            )}
            <h2
              id="modal-title"
              className="font-display text-3xl font-semibold tracking-tight"
            >
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="grid size-10 shrink-0 place-items-center rounded-full bg-[#f0eee8] transition hover:bg-[#e7e3da]"
            aria-label="Close modal"
          >
            <Icon name="close" />
          </button>
        </div>
        <div className="mt-7">{children}</div>
      </div>
    </div>
  );
}
