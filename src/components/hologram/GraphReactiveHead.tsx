import React, { useRef, useEffect } from "react";

export function GraphReactiveHead({ graphState, theme = 'dark', listening = false }: { graphState: any, theme?: 'dark' | 'light', listening?: boolean }) {
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

    // Active LangGraph node
    const active = graphState?.activeNode;

    // Subsystem color mapping
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

    // Node-specific geometry modulation
    const modulation: Record<string, number> = {
      egoModelNode: 0.03,
      phenotypeNode: 0.06,
      doctrineNode: 0.01,
      sandboxNode: 0.08,
      selfRepairNode: 0.12,
      supabaseTraceNode: 0.05,
      automotiveObdNode: 0.09,
      safetyGateNode: 0.02,
      tripleConsensusNode: 0.04,
      arcanaDirectorNode: 0.07,
      default: 0.03,
    };
    const deform = modulation[active] || modulation.default;

    // Particle system for node events
    const particles: any[] = [];
    function spawnParticle() {
      particles.push({
        x: cx,
        y: cy,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        life: 40,
      });
    }

    function draw(time: number) {
      ctx!.clearRect(0, 0, w, h);

      // HEAD OUTLINE (reactive deformation)
      ctx!.save();
      ctx!.strokeStyle = accent;
      ctx!.lineWidth = 1.4;
      ctx!.globalAlpha = 0.85;

      ctx!.beginPath();
      for (let i = 0; i < 360; i += 6) {
        const rad = (i * Math.PI) / 180;
        const baseR = 85;
        const deformR =
          baseR +
          Math.sin(time / 300 + rad * 3) * (deform * 40) +
          Math.cos(time / 200 + rad * 2) * (deform * 20);

        const x = cx + Math.cos(rad) * deformR;
        const y = cy + Math.sin(rad) * deformR * 1.2;

        if (i === 0) ctx!.moveTo(x, y);
        else ctx!.lineTo(x, y);
      }
      ctx!.closePath();
      ctx!.stroke();
      ctx!.restore();

      // INNER CORE (reactive glow)
      ctx!.save();
      ctx!.fillStyle = accent;
      ctx!.globalAlpha = 0.18 + deform * 2;
      ctx!.beginPath();
      ctx!.arc(cx, cy, 50 + deform * 20, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.restore();

      // PARTICLE BURSTS (Supabase, sandbox, automotive)
      if (
        active === "supabaseTraceNode" ||
        active === "sandboxNode" ||
        active === "automotiveObdNode"
      ) {
        if (Math.random() < 0.4) spawnParticle();
      }

      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        ctx!.save();
        ctx!.fillStyle = accent;
        ctx!.globalAlpha = p.life / 40;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();

        if (p.life <= 0) particles.splice(index, 1);
      });

      // DOCTRINE STABILITY GRID
      if (active === "doctrineNode" || active === "safetyGateNode") {
        ctx!.save();
        ctx!.strokeStyle = "#FFB347";
        ctx!.globalAlpha = 0.25;
        ctx!.lineWidth = 0.6;

        for (let i = -3; i <= 3; i++) {
          ctx!.beginPath();
          ctx!.moveTo(cx - 70, cy + i * 14);
          ctx!.lineTo(cx + 70, cy + i * 14);
          ctx!.stroke();
        }
        ctx!.restore();
      }

      // LISTENING FLASH
      if (listening) {
        ctx!.save();
        ctx!.strokeStyle = "#3FFFD7";
        ctx!.globalAlpha = 0.2 + Math.sin(time / 150) * 0.2;
        ctx!.lineWidth = 2;
        ctx!.beginPath();
        ctx!.arc(cx, cy, 95, 0, Math.PI * 2);
        ctx!.stroke();
        ctx!.restore();
      }

      // SELF-REPAIR FLASH
      if (active === "selfRepairNode") {
        ctx!.save();
        ctx!.fillStyle = "#FF4F6A";
        ctx!.globalAlpha = 0.15 + Math.sin(time / 120) * 0.15;
        ctx!.beginPath();
        ctx!.arc(cx, cy, 110, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      }

      frameId = requestAnimationFrame(draw);
    }

    frameId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameId);
  }, [graphState, theme, listening]);

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
