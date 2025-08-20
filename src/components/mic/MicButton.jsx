import React from "react";
import "../../app/styles/mic.css"; 

export default function MicButton({ listening, onToggle }) {
  return (
    <div
      className={`mic-container ${listening ? "listening" : ""}`}
      onClick={onToggle}
      role="button"
      aria-pressed={listening}
      title={listening ? "녹음 중지" : "녹음 시작"}
    >
      <div className="mic-btn">
        {/* 마이크 아이콘 (SVG) */}
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0h-2z"/>
        </svg>
      </div>
      {/* 파동 */}
      <div className="wave" />
      <div className="wave" />
      <div className="wave" />
    </div>
  );
}
