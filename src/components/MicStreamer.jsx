import React, { useEffect, useRef, useState } from "react";
import MicButton from "./mic/MicButton";
import "../app/styles/mic.css"; // 파동/UI 스타일

export default function MicStreamer() {
  const [listening, setListening] = useState(false);
  const [partial, setPartial]   = useState("");
  const [finals, setFinals]     = useState([]);

  // 리소스 핸들
  const streamRef = useRef(null);
  const recRef    = useRef(null);
  const wsRef     = useRef(null);

  // MIME 협상 (크로스브라우저)
  const pickMime = () => {
    const cands = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/ogg;codecs=opus",
    ];
    for (const m of cands) {
      if (window.MediaRecorder && MediaRecorder.isTypeSupported(m)) return m;
    }
    return ""; // 브라우저 미지원
  };

  const connectWS = () => {
    const host  = process.env.REACT_APP_WS_HOST || "localhost:8090";
    const proto = window.location.protocol === "https:" ? "wss" : "ws";
    const ws    = new WebSocket(`${proto}://${host}/ws/stt`);
    ws.binaryType = "arraybuffer";

    ws.onopen = () => console.log("[WS] open");
    ws.onclose = (e) => console.log("[WS] close", e.code, e.reason);
    ws.onerror = (e) => console.error("[WS] error", e);

    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        if (msg.partial) setPartial(String(msg.partial));
        if (msg.final)   setFinals((prev) => [...prev, String(msg.final)]);
        if (msg.error)   console.error("[WS] error:", msg.error);
      } catch {
        // 텍스트 이외(바이너리)는 무시
      }
    };

    wsRef.current = ws;
  };

  const start = async () => {
    if (listening) return;
    const mimeType = pickMime();
    if (!mimeType) {
      alert("이 브라우저는 MediaRecorder(웹m/opus)를 지원하지 않습니다. Chrome/Edge 최신 버전을 사용하세요.");
      return;
    }

    try {
      // 1) 마이크 권한/스트림
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // 2) WS 연결
      connectWS();

      // 3) 녹음기 생성 및 청크 전송
      const rec = new MediaRecorder(stream, { mimeType });
      rec.ondataavailable = async (e) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
        // Blob -> ArrayBuffer -> 전송
        const buf = await e.data.arrayBuffer();
        wsRef.current.send(buf);
      };
      rec.onstart = () => console.log("[REC] start", mimeType);
      rec.onstop  = () => console.log("[REC] stop");

      // 250ms 타임슬라이스로 청크 전송
      rec.start(250);
      recRef.current = rec;

      // UI 상태
      setPartial("");
      setListening(true);
    } catch (err) {
      console.error("마이크 시작 실패:", err);
      setListening(false);
    }
  };

  const stop = () => {
    if (!listening) return;

    // 서버에 최종화 신호
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send("stop");
    }

    // 녹음 중지
    if (recRef.current && recRef.current.state !== "inactive") recRef.current.stop();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    // WS 닫기(약간 대기 후)
    if (wsRef.current) {
      const ws = wsRef.current;
      wsRef.current = null;
      setTimeout(() => { try { ws.close(); } catch {} }, 300);
    }

    setListening(false);
  };

  const onToggle = () => (listening ? stop() : start());

  // 언마운트 정리
  useEffect(() => () => stop(), []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
  <div className="mic-page"> {/* 가운데 정렬 레이아웃 */}
    <MicButton listening={listening} onToggle={onToggle} />
    <div className="mic-status">
      {listening ? "듣는 중..." : "대기 중 (버튼을 눌러 시작)"}
    </div>
    <div className="transcript">
      <div><strong> </strong> {partial}</div>
      {finals.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <strong>Final:</strong>
          {finals.map((t, i) => (
            <div key={i} className="final-item">• {t}</div>
          ))}
        </div>
      )}
    </div>
  </div>
);

}
