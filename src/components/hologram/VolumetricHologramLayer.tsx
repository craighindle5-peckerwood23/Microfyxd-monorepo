import React, { useRef, useEffect } from "react";

export function VolumetricHologramLayer({ graphState, theme = 'dark' }: { graphState: any, theme?: 'dark' | 'light' }) {
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
    const cy = h / 2;

    const active = graphState?.activeNode;

    const palette: Record<string, string> = {
      egoModelNode: "#3FFFD7",
      phenotypeNode: "#9BFF4F",
      doctrineNode: "#FFB347",
      sandboxNode: "#C77DFF",
      selfRepairNode: "#FF4F6A",
      supabaseTraceNode: "#F9FFB3",
      automotiveObdNode: "#3FFFD7",
      safetyGateNode: "#FFB347",
      tripleConsensusNode: "#F9FFB3",
      arcanaDirectorNode: "#9BFF4F",
      default: "#9BFF4F",
    };
    const accent = palette[active] || palette.default;

    function draw(time: number) {
      ctx!.clearRect(0, 0, w, h);

      const depthPulse = Math.sin(time / 500) * 10;

      // Layer 1: inner volumetric core
      ctx!.save();
      const coreGrad = ctx!.createRadialGradient(
        cx,
        cy,
        0,
        cx,
        cy,
        60 + depthPulse
      );
      coreGrad.addColorStop(0, theme === 'dark' ? "rgba(249,255,179,0.55)" : "rgba(249,255,179,0.4)");
      coreGrad.addColorStop(0.4, accent + (theme === 'dark' ? "55" : "33"));
      coreGrad.addColorStop(1, "rgba(2,4,10,0)");
      ctx!.fillStyle = coreGrad;
      ctx!.fillRect(0, 0, w, h);
      ctx!.restore();

      // Layer 2: mid halo
      ctx!.save();
      const haloGrad = ctx!.createRadialGradient(
        cx,
        cy,
        40,
        cx,
        cy,
        110 + depthPulse
      );
      haloGrad.addColorStop(0, "rgba(63,255,215,0.35)");
      haloGrad.addColorStop(0.6, "rgba(155,255,79,0.18)");
      haloGrad.addColorStop(1, "rgba(2,4,10,0)");
      ctx!.fillStyle = haloGrad;
      ctx!.fillRect(0, 0, w, h);
      ctx!.restore();

      // Layer 3: outer volumetric shell
      ctx!.save();
      const shellGrad = ctx!.createRadialGradient(
        cx,
        cy,
        80,
        cx,
        cy,
        150 + depthPulse
      );
      shellGrad.addColorStop(0, theme === 'dark' ? "rgba(3,10,20,0.4)" : "rgba(255,255,255,0.2)");
      shellGrad.addColorStop(0.7, "rgba(63,255,215,0.12)");
      shellGrad.addColorStop(1, "rgba(2,4,10,0)");
      ctx!.fillStyle = shellGrad;
      ctx!.fillRect(0, 0, w, h);
      ctx!.restore();

      // Subtle vertical volumetric streaks
      ctx!.save();
      ctx!.globalAlpha = 0.18;
      for (let i = -3; i <= 3; i++) {
        const offset = i * 18 + Math.sin(time / 400 + i) * 6;
        const grad = ctx!.createLinearGradient(
          cx + offset,
          cy - 80,
          cx + offset,
          cy + 80
        );
        grad.addColorStop(0, "rgba(63,255,215,0)");
        grad.addColorStop(0.5, "rgba(63,255,215,0.45)");
        grad.addColorStop(1, "rgba(63,255,215,0)");
        ctx!.fillStyle = grad;
        ctx!.fillRect(cx + offset - 2, cy - 80, 4, 160);
      }
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
