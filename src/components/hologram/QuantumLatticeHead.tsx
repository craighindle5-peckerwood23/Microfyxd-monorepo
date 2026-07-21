import React, { useEffect, useRef } from "react";

export function QuantumLatticeHead({ graphState, theme = 'dark' }: { graphState: any, theme?: 'dark' | 'light' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let frameId: number;

    const w = canvas.width;
    const h = canvas.height;
    const centerX = w / 2;
    const centerY = h / 2;

    // base params
    const baseRadius = 100;
    const layers = 3;
    const nodeCount = 120;

    // color by active node
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
      default: "#9BFF4F",
    };
    const accent = palette[active] || palette.default;

    const nodes: any[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const layer = i % layers;
      const angle = (i / nodeCount) * Math.PI * 2;
      const radius = baseRadius + layer * 24;
      nodes.push({ layer, angle, radius });
    }

    function draw(time: number) {
      ctx!.clearRect(0, 0, w, h);

      // subtle background glow
      ctx!.save();
      const gradient = ctx!.createRadialGradient(
        centerX,
        centerY,
        10,
        centerX,
        centerY,
        baseRadius * 2
      );
      if (theme === 'dark') {
          gradient.addColorStop(0, "rgba(63,255,215,0.25)");
          gradient.addColorStop(1, "rgba(2,4,10,0)");
      } else {
          gradient.addColorStop(0, "rgba(63,255,215,0.15)");
          gradient.addColorStop(1, "rgba(255,255,255,0)");
      }
      
      ctx!.fillStyle = gradient;
      ctx!.fillRect(0, 0, w, h);
      ctx!.restore();

      // breathing scale
      const breath = 1 + Math.sin(time / 1200) * 0.04;

      // draw entanglement lines
      ctx!.save();
      ctx!.strokeStyle = theme === 'dark' ? "rgba(63,255,215,0.35)" : "rgba(63,255,215,0.5)";
      ctx!.lineWidth = 0.6;
      nodes.forEach((n, i) => {
        const next = nodes[(i + 7) % nodeCount];
        ctx!.beginPath();
        const x1 =
          centerX +
          Math.cos(n.angle + time / 400 + n.layer * 0.4) *
            n.radius *
            breath *
            (1 + n.layer * 0.05);
        const y1 =
          centerY +
          Math.sin(n.angle + time / 400 + n.layer * 0.4) *
            n.radius *
            breath *
            (1 + n.layer * 0.05);
        const x2 =
          centerX +
          Math.cos(next.angle + time / 400 + next.layer * 0.4) *
            next.radius *
            breath *
            (1 + next.layer * 0.05);
        const y2 =
          centerY +
          Math.sin(next.angle + time / 400 + next.layer * 0.4) *
            next.radius *
            breath *
            (1 + next.layer * 0.05);
        ctx!.moveTo(x1, y1);
        ctx!.lineTo(x2, y2);
        ctx!.stroke();
      });
      ctx!.restore();

      // inner neural core
      ctx!.save();
      ctx!.fillStyle = "rgba(249,255,179,0.35)";
      ctx!.beginPath();
      ctx!.arc(centerX, centerY, baseRadius * 0.45, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.restore();

      // nodes
      ctx!.save();
      nodes.forEach((n) => {
        const pulse =
          1 +
          Math.sin(time / 300 + n.layer * 0.8 + n.angle * 3) *
            (0.12 + n.layer * 0.04);
        const x =
          centerX +
          Math.cos(n.angle + time / 500 + n.layer * 0.3) *
            n.radius *
            breath;
        const y =
          centerY +
          Math.sin(n.angle + time / 500 + n.layer * 0.3) *
            n.radius *
            breath;

        const r = 1.2 + n.layer * 0.6 * pulse;

        ctx!.beginPath();
        ctx!.fillStyle =
          n.layer === 0
            ? "rgba(63,255,215,0.9)"
            : n.layer === 1
            ? accent
            : "rgba(249,255,179,0.8)";
        ctx!.arc(x, y, r, 0, Math.PI * 2);
        ctx!.fill();
      });
      ctx!.restore();

      // resonance rings when Arcana speaks
      if (active === "arcanaDirectorNode") {
        ctx!.save();
        ctx!.strokeStyle = accent;
        ctx!.lineWidth = 0.8;
        const ringCount = 3;
        for (let i = 0; i < ringCount; i++) {
          const r =
            baseRadius * 0.6 +
            (i * 12) +
            Math.sin(time / 250 + i) * 4;
          ctx!.beginPath();
          ctx!.arc(centerX, centerY + 18, r, 0, Math.PI * 2);
          ctx!.stroke();
        }
        ctx!.restore();
      }

      frameId = requestAnimationFrame(draw);
    }

    frameId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameId);
  }, [graphState, theme]);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={350}
        height={350}
        className="w-full h-full max-w-[350px] max-h-[350px]"
      />
    </div>
  );
}
