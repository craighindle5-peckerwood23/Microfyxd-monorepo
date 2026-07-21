import React, { useRef, useEffect } from "react";

export function ArcanaSpeechResonance({ graphState, theme = 'dark' }: { graphState: any, theme?: 'dark' | 'light' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId: number;
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2 + 22; // mouth region

    // Determine if Arcana is "speaking"
    const speaking = !!graphState?.partialSpeechAudio || !!graphState?.speechAudio || graphState?.activeNode === "arcanaDirectorNode";

    // Color palette
    const accent = "#F9FFB3"; // speech resonance color
    const quantum = "#9BFF4F"; // lime quantum
    const aqua = "#3FFFD7"; // ego/neutral

    function draw(time: number) {
      ctx!.clearRect(0, 0, w, h);

      if (!speaking) {
        frameId = requestAnimationFrame(draw);
        return;
      }

      // SPEECH RESONANCE RINGS
      for (let i = 0; i < 4; i++) {
        const r = 12 + i * 10 + Math.sin(time / (180 + i * 40)) * 4;

        ctx!.save();
        ctx!.strokeStyle = accent;
        ctx!.lineWidth = 1;
        ctx!.globalAlpha = 0.35 - i * 0.08;
        ctx!.beginPath();
        ctx!.arc(cx, cy, r, 0, Math.PI * 2);
        ctx!.stroke();
        ctx!.restore();
      }

      // HARMONIC MOUTH GLOW
      ctx!.save();
      ctx!.fillStyle = "rgba(249,255,179,0.25)";
      ctx!.beginPath();
      ctx!.ellipse(cx, cy, 28, 12, 0, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.restore();

      // AMPLITUDE BARS (speech waveform)
      const bars = 14;
      for (let i = 0; i < bars; i++) {
        const amp =
          Math.sin(time / 140 + i * 0.6) * 10 +
          Math.cos(time / 200 + i * 0.3) * 6;

        ctx!.save();
        ctx!.fillStyle = accent;
        ctx!.globalAlpha = 0.55;
        ctx!.fillRect(
          cx - bars * 2 + i * 4,
          cy + 18,
          3,
          Math.max(4, amp)
        );
        ctx!.restore();
      }

      // QUANTUM RIPPLE (sync with LangGraph)
      const rippleR =
        40 + Math.sin(time / 260) * 8 + (graphState?.arcanaThought?.length || 0) * 0.1;

      ctx!.save();
      ctx!.strokeStyle = quantum;
      ctx!.lineWidth = 0.8;
      ctx!.globalAlpha = 0.25;
      ctx!.beginPath();
      ctx!.arc(cx, cy - 18, rippleR, 0, Math.PI * 2);
      ctx!.stroke();
      ctx!.restore();

      // INNER CORE SPEECH FLASH
      ctx!.save();
      ctx!.fillStyle = aqua;
      ctx!.globalAlpha = 0.18 + Math.sin(time / 120) * 0.12;
      ctx!.beginPath();
      ctx!.arc(cx, cy - 18, 18, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.restore();

      frameId = requestAnimationFrame(draw);
    }

    frameId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameId);
  }, [graphState, theme]);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <canvas
        ref={canvasRef}
        width={350}
        height={350}
        className="w-full h-full max-w-[350px] max-h-[350px]"
      />
    </div>
  );
}
