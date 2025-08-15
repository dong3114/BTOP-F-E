// PATH: src/components/MicStreamer.jsx

import React, { useEffect, useRef, useState } from 'react';

export default function MicStreamer() {
  const wsRef = useRef(null);
  const recRef = useRef(null);
  const [status, setStatus] = useState('idle');
  const [logs, setLogs] = useState([]);

  const log = (m) => setLogs((prev) => [...prev, m].slice(-8));

  const start = async () => {
    // 1) 마이크 권한
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // 2) WebSocket 연결 (8090)
    const wsUrl =
      (window.location.protocol === 'https:' ? 'wss://' : 'ws://') +
      'localhost:8090/ws/stt';
    const ws = new WebSocket(wsUrl);
    ws.binaryType = 'arraybuffer';

    ws.onopen = () => {
      log('WS connected');
      setStatus('recording');
    };
    ws.onclose = () => {
      log('WS closed');
      setStatus('idle');
    };
    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.partial) log(`Partial: ${msg.partial}`);
        if (msg.final) log(`Final: ${msg.final}`);
      } catch {
        log(String(e.data));
      }
    };
    wsRef.current = ws;

    // 3) MediaRecorder (Opus → 서버에서 FFmpeg로 PCM 변환)
    const mime = 'audio/webm;codecs=opus';
    if (!MediaRecorder.isTypeSupported(mime)) {
      alert('브라우저가 audio/webm;codecs=opus를 지원하지 않습니다.');
      return;
    }
    const rec = new MediaRecorder(stream, {
      mimeType: mime,
      audioBitsPerSecond: 48000,
    });

    rec.ondataavailable = async (e) => {
      if (!e.data.size || !wsRef.current || wsRef.current.readyState !== 1)
        return;
      const buf = await e.data.arrayBuffer();
      wsRef.current.send(buf); // 서버로 바이너리 전송
    };

    rec.start(250); // 250ms마다 청크 전송
    recRef.current = rec;
  };

  const stop = () => {
    if (recRef.current && recRef.current.state !== 'inactive') recRef.current.stop();
    if (wsRef.current && wsRef.current.readyState === 1) {
      wsRef.current.send('stop');
      wsRef.current.close();
    }
    setStatus('idle');
  };

  useEffect(() => () => stop(), []); // 언마운트 시 정리

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <div>
        <button onClick={start} disabled={status === 'recording'}>
          🎙️ Start
        </button>
        <button onClick={stop} disabled={status !== 'recording'}>
          ⏹ Stop
        </button>
        <span style={{ marginLeft: 8 }}>status: {status}</span>
      </div>
      <div
        style={{
          whiteSpace: 'pre-wrap',
          fontFamily: 'monospace',
          background: '#f5f5f5',
          padding: 8,
          borderRadius: 6,
        }}
      >
        {logs.join('\n')}
      </div>
    </div>
  );
}
