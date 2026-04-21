import { memo, useEffect, useId } from "react";

const KIND = {
  success: { accent: "#166534", subtle: "#f0fdf4", label: "Success" },
  error: { accent: "#b91c1c", subtle: "#fef2f2", label: "Error" },
  info: { accent: "#0f172a", subtle: "#f8fafc", label: "Notice" },
  warning: { accent: "#b45309", subtle: "#fffbeb", label: "Warning" },
};

function FeedbackDialog({ open, kind = "info", title, children, onClose, confirmLabel = "OK" }) {
  const titleId = useId();
  const tone = KIND[kind] || KIND.info;
  const heading = title ?? tone.label;

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    function onKey(event) {
      if (event.key === "Escape") onClose?.();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1100,
        background: "rgba(15, 23, 42, 0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        boxSizing: "border-box",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        style={{
          background: "#fff",
          borderRadius: 12,
          maxWidth: 400,
          width: "100%",
          border: `1px solid #e2e8f0`,
          boxShadow: "0 20px 40px rgba(15, 23, 42, 0.12)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "14px 18px",
            background: tone.subtle,
            borderLeft: `4px solid ${tone.accent}`,
          }}
        >
          <h2 id={titleId} style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: tone.accent }}>
            {heading}
          </h2>
        </div>
        <div style={{ padding: "18px 20px 20px", fontSize: "0.95rem", lineHeight: 1.55, color: "#334155" }}>{children}</div>
        <div style={{ padding: "0 20px 18px", display: "flex", justifyContent: "flex-end" }}>
          <button type="button" onClick={onClose} style={{ minWidth: 88 }}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(FeedbackDialog);
