import { memo } from "react";

function StatusMessage({ kind = "info", children }) {
  const colors = {
    info: "#0f172a",
    success: "#166534",
    error: "#b91c1c",
  };

  return (
    <p
      className="card"
      style={{ marginTop: "1rem", borderLeft: `4px solid ${colors[kind]}`, padding: "0.75rem 1rem" }}
    >
      {children}
    </p>
  );
}

export default memo(StatusMessage);
