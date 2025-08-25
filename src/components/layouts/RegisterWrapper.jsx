import React from "react";
import "./styles/RegisterWrapper.css";

export default function RegisterWrapper({
  children,
  align = "center",
  maxWidth = 480,
}) {
  const maxW = typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth;

  return (
    <div className={`page ${align === "center" ? "page--center" : "page--top"}`}>
      <div className="card" style={{ maxWidth: maxW }}>
        {children}
      </div>
    </div>
  );
}
