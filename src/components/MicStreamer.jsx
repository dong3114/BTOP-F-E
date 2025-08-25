//JJ
import React, { useEffect, useRef, useState } from "react";
import MicButton from "./mic/MicButton";
import "../app/styles/mic.css";

export default function MicStreamer() {
  const [listening, setListening] = useState(false);
  // 최종 누적 [{ stt?: string, standard?: string, t: number }]
  const [finals, setFinals] = useState([]);

  // 핸들
  const streamRef   = useRef(null);
  const wsRef       = useRef(null);

  // PCM(WebAudio) 핸들
  const audioCtxRef = useRef(null);
  const sourceRef   = useRef(null);
  const procRef     = useRef(null);

  // 최종 도착 대기
  const awaitingFinalRef = useRef(false);
  const finalTimerRef    = useRef(null);

  // ------------ 서버 메시지 처리 ------------
  const handleWsMessage = (ev) => {
    try {
      const msg = JSON.parse(ev.data);

      if (msg.info)  console.log("[WS] info:", msg.info);
      if (msg.error) console.error("[WS] error:", msg.error);

      // 최종 결과만 반영
      if (msg.final !== undefined) {
        if (typeof msg.final === "string") {
          // 문자열이면 표준어만 온다고 가정
          setFinals((prev) => [...prev, { standard: String(msg.final), t: Date.now() }]);
        } else if (msg.final && typeof msg.final === "object") {
          // 다양한 키 대응: stt/raw/text/original → 원문, standard/norm/normalized → 표준어
          const raw =
            msg.final.stt ??
            msg.final.raw ??
            msg.final.text ??
            msg.final.original ??
            undefined;

          const standard =
            msg.final.standard ??
            msg.final.norm ??
            msg.final.normalized ??
            undefined;

          setFinals((prev) => [...prev, { stt: raw, standard, t: Date.now() }]);
        }

        // 최종 수신되면 WS 닫기
        awaitingFinalRef.current = false;
        if (finalTimerRef.current) {
          clearTimeout(finalTimerRef.current);
          finalTimerRef.current = null;
        }
        setTimeout(() => {
          if (wsRef.current) {
            try { wsRef.current.close(); } catch {}
            wsRef.current = null;
          }
        }, 300);
      }
      // partial은 UI에서 표시하지 않으므로 무시
    } catch {
      // 바이너리/파싱 실패는 무시
    }
  };

  // ------------ WS 연결(PCM 16k 모드 고정) ------------
  const openWs = (onOpen) => {
    const host  = process.env.REACT_APP_WS_HOST || "localhost:8090";
    const proto = window.location.protocol === "https:" ? "wss" : "ws";
    const ws    = new WebSocket(`${proto}://${host}/ws/stt?pcm=16000`);
    ws.binaryType = "arraybuffer";

    ws.onopen    = () => { console.log("[WS] open"); onOpen && onOpen(); };
    ws.onmessage = handleWsMessage;
    ws.onclose   = (e) => console.log("[WS] close", e.code, e.reason || "");
    ws.onerror   = (e) => console.error("[WS] error", e);

    wsRef.current = ws;
  };

  // ------------ 다운샘플링/형변환 ------------
  const resampleTo16k = (input, inRate) => {
    const outRate = 16000;
    if (inRate === outRate) return input.slice();

    if (inRate === 48000) {
      // 3:1 간단 decimate (중간 샘플)
      const outLen = Math.floor(input.length / 3);
      const out = new Float32Array(outLen);
      let j = 0;
      for (let i = 0; i + 2 < input.length; i += 3) {
        out[j++] = input[i + 1];
      }
      return out;
    }

    // 일반 레이트: 선형보간(간이)
    const ratio = inRate / outRate;
    const outLen = Math.floor(input.length / ratio);
    const out = new Float32Array(outLen);
    for (let i = 0; i < outLen; i++) {
      const srcPos = i * ratio;
      const i0 = Math.floor(srcPos);
      const i1 = Math.min(i0 + 1, input.length - 1);
      const t = srcPos - i0;
      out[i] = (1 - t) * input[i0] + t * input[i1];
    }
    return out;
  };

  const floatToInt16 = (float32Array) => {
    const out = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      let s = Math.max(-1, Math.min(1, float32Array[i]));
      out[i] = s < 0 ? (s * 0x8000) : (s * 0x7fff);
    }
    return out;
  };

  // ------------ 시작(16k PCM로 전송) ------------
  const start = async () => {
    if (listening) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      openWs(() => {
        const ac = new (window.AudioContext || window.webkitAudioContext)();
        audioCtxRef.current = ac;

        const src = ac.createMediaStreamSource(stream);
        sourceRef.current = src;

        // 2048 샘플 버퍼 → 약 4096바이트 (8KB 제한 여유)
        const bufferSize = 2048;
        const proc = ac.createScriptProcessor(bufferSize, 1, 1);
        procRef.current = proc;

        proc.onaudioprocess = (e) => {
          const ws = wsRef.current;
          if (!ws || ws.readyState !== WebSocket.OPEN) return;

          const ch0 = e.inputBuffer.getChannelData(0);
          const ds  = resampleTo16k(ch0, ac.sampleRate);
          const i16 = floatToInt16(ds);
          ws.send(i16.buffer);
        };

        src.connect(proc);
        proc.connect(ac.destination); // 일부 브라우저는 그래프 연결 필요

        setListening(true);
        awaitingFinalRef.current = false;
        console.log("[REC-PCM] start", `${ac.sampleRate}Hz → 16000Hz Int16`);
      });
    } catch (err) {
      console.error("마이크 시작 실패:", err);
      setListening(false);
    }
  };

  // ------------ 정지/정리 ------------
  const stop = () => {
    if (!listening) return;

    // 오디오 그래프/마이크 먼저 정리(더 이상 전송 안 함)
    try {
      if (procRef.current) {
        procRef.current.disconnect();
        procRef.current.onaudioprocess = null;
      }
      if (sourceRef.current) sourceRef.current.disconnect();
      if (audioCtxRef.current) audioCtxRef.current.close();
    } catch {}
    procRef.current = null;
    sourceRef.current = null;
    audioCtxRef.current = null;

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    // WS는 final 수신까지 열어둠
    try {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        awaitingFinalRef.current = true;
        wsRef.current.send("stop"); // 서버에 최종화 지시

        // 안전 타임아웃(예: 12초)
        finalTimerRef.current = setTimeout(() => {
          if (awaitingFinalRef.current) {
            console.warn("[WS] final timeout → force close");
            try { wsRef.current?.close(); } catch {}
            wsRef.current = null;
            awaitingFinalRef.current = false;
          }
        }, 12000);
      }
    } catch {}

    setListening(false);
  };

  const onToggle = () => (listening ? stop() : start());

  useEffect(() => () => {
    // 언마운트 시 정리
    try { if (procRef.current) { procRef.current.disconnect(); procRef.current.onaudioprocess = null; } } catch {}
    try { sourceRef.current?.disconnect(); } catch {}
    try { audioCtxRef.current?.close(); } catch {}
    if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null; }
    try { wsRef.current?.close(); } catch {}
    if (finalTimerRef.current) clearTimeout(finalTimerRef.current);
  }, []);

  return (
    <div className="mic-page">
      <MicButton listening={listening} onToggle={onToggle} />

      <div className="mic-columns">
        <div className="col">
          <div className="col-title">최종 결과</div>
          <div className="list">
            {finals.map((row, i) => (
              <div className="list-item" key={row.t ?? i}>
                <div className="label">원문</div>
                <div className="value">{row.stt ?? <span className="muted">—</span>}</div>
                <div className="label" style={{marginTop: 6}}>표준어</div>
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
