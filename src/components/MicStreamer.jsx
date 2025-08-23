//JJ
import React, { useEffect, useRef, useState } from "react";
import MicButton from "./mic/MicButton";
import "../app/styles/mic.css";

export default function MicStreamer() {
  const [listening, setListening] = useState(false);

  // 실시간(Partial)
  const [partialStt, setPartialStt] = useState("");   // 원문(STT)
  const [partialStd, setPartialStd] = useState("");   // 표준어(있으면)

  // 최종 누적 [{ stt?: string, standard?: string, t: number }]
  const [finals, setFinals] = useState([]);

  // 핸들
  const streamRef = useRef(null);
  const recRef    = useRef(null);
  const wsRef     = useRef(null);

  // MIME 협상
  const pickMime = () => {
    const cands = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/ogg;codecs=opus",
    ];
    for (const m of cands) {
      if (window.MediaRecorder && MediaRecorder.isTypeSupported(m)) return m;
    }
    return "";
  };

  // 메시지 파서 (서버가 문자열/객체 둘 다 보낼 수 있음)
  const handleWsMessage = (ev) => {
    try {
      const msg = JSON.parse(ev.data);

      // 1) {"partial":"..."} or {"partial":{stt, standard}}
      if (msg.partial !== undefined) {
        if (typeof msg.partial === "string") {
          // ffmpeg 진행상태("pcm_bytes=...")가 들어올 수 있어요 → 사람이 볼 필요 없으면 무시해도 됨
          if (!String(msg.partial).startsWith("pcm_bytes=")) {
            setPartialStt(String(msg.partial));
          }
        } else if (msg.partial && typeof msg.partial === "object") {
          setPartialStt(msg.partial.stt || "");
          setPartialStd(msg.partial.standard || "");
        }
      }

      // 2) {"final":"..."} or {"final":{stt, standard}}
      if (msg.final !== undefined) {
        if (typeof msg.final === "string") {
          setFinals((prev) => [...prev, { standard: String(msg.final), t: Date.now() }]);
        } else if (msg.final && typeof msg.final === "object") {
          const row = {
            stt: msg.final.stt ? String(msg.final.stt) : undefined,
            standard: msg.final.standard ? String(msg.final.standard) : undefined,
            t: Date.now(),
          };
          setFinals((prev) => [...prev, row]);
        }
        // 최종이 오면 현재 partial은 끊어주기
        setPartialStt("");
        setPartialStd("");
      }

      if (msg.error) console.error("[WS] error:", msg.error);
    } catch {
      // 바이너리/파싱 실패는 무시
    }
  };

  // WS 연결을 Promise로 감싸서 "열리면 resolve"
  const connectWS = () =>
    new Promise((resolve, reject) => {
      const host  = process.env.REACT_APP_WS_HOST || "localhost:8090";
      const proto = window.location.protocol === "https:" ? "wss" : "ws";
      const ws    = new WebSocket(`${proto}://${host}/ws/stt`);
      ws.binaryType = "arraybuffer";

      ws.onopen = () => {
        console.log("[WS] open");
        resolve(ws);
      };
      ws.onmessage = handleWsMessage;
      ws.onclose = (e) => {
        console.log("[WS] close", e.code, e.reason);
      };
      ws.onerror = (e) => {
        console.error("[WS] error", e);
        // 열린 적도 없이 곧장 에러면 reject
        if (ws.readyState !== WebSocket.OPEN) reject(e);
      };
    });

  const start = async () => {
    if (listening) return;

    const mimeType = pickMime();
    if (!mimeType) {
      alert("이 브라우저는 MediaRecorder(webm/opus)를 지원하지 않습니다. Chrome/Edge 최신 버전을 사용하세요.");
      return;
    }

    try {
      // 1) 마이크
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // 2) WS가 열린 후에만 녹음 시작
      const ws = await connectWS();
      wsRef.current = ws;

      // 3) 녹음
      const rec = new MediaRecorder(stream, { mimeType });
      rec.ondataavailable = async (e) => {
        // 열린 뒤에만 전송
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
        try {
          const buf = await e.data.arrayBuffer();
          wsRef.current.send(buf);
        } catch (err) {
          console.error("[REC] send error:", err);
        }
      };
      rec.onstart = () => console.log("[REC] start", mimeType);
      rec.onstop  = () => console.log("[REC] stop");
      rec.start(250);
      recRef.current = rec;

      // UI 초기화
      setPartialStt("");
      setPartialStd("");
      setListening(true);
    } catch (err) {
      console.error("마이크/WS 시작 실패:", err);
      // 마이크 열렸다면 닫기
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      setListening(false);
    }
  };

  const stop = () => {
    if (!listening) return;

    // 서버에 최종화
    try {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send("stop");
      }
    } catch {}

    // 녹음 종료
    try {
      if (recRef.current && recRef.current.state !== "inactive") recRef.current.stop();
    } catch {}
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    // WS 닫기 (조금 기다렸다 닫기)
    if (wsRef.current) {
      const ws = wsRef.current;
      wsRef.current = null;
      setTimeout(() => {
        try { ws.close(); } catch {}
      }, 300);
    }

    setListening(false);
  };

  const onToggle = () => (listening ? stop() : start());

  // 언마운트 시 정리
  useEffect(() => () => stop(), []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mic-page">
      <MicButton listening={listening} onToggle={onToggle} />

      <div className="mic-columns">
        <div className="col">
          <div className="col-title">실시간 인식 (원문/STT)</div>
          <div className="box live">{partialStt || "—"}</div>

          <div className="col-title">최종 인식 목록</div>
          <div className="list">
            {finals.map((row, i) => (
              <div className="list-item" key={row.t ?? i}>
                <div className="label">원문</div>
                <div className="value">{row.stt ?? <span className="muted">—</span>}</div>
              </div>
            ))}
            {finals.length === 0 && <div className="empty">아직 결과가 없습니다</div>}
          </div>
        </div>

        <div className="col">
          <div className="col-title">실시간 표준어 변환</div>
          <div className="box live">{partialStd || "—"}</div>

          <div className="col-title">최종 표준어</div>
          <div className="list">
            {finals.map((row, i) => (
              <div className="list-item" key={(row.t ?? i) + "-std"}>
                <div className="label">표준어</div>
                <div className="value">{row.standard ?? <span className="muted">—</span>}</div>
              </div>
            ))}
            {finals.length === 0 && <div className="empty">아직 결과가 없습니다</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
