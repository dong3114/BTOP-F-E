// JJ

class PCMWorkletProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];
    if (input && input[0]) {
      // 단일 채널만 사용
      this.port.postMessage(new Float32Array(input[0]));
    }
    return true; // 계속 실행
  }
}
registerProcessor("pcm-worklet", PCMWorkletProcessor);
