'use client';

import { useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Zap } from 'lucide-react';
import type { VerdictType } from '@stackoverkill/shared';
import { useTranslations } from '@/i18n/useTranslations';

// ============================================================
// ANIMATED EFFECTS (same as result page for live visualization)
// ============================================================

// Meteor Effect - Falling meteors with rotation and glow trails
function StormEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vfxCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const vfxCanvas = vfxCanvasRef.current;
    if (!canvas || !vfxCanvas) return;

    const ctx = canvas.getContext('2d');
    const vfx = vfxCanvas.getContext('2d');
    if (!ctx || !vfx) return;

    let animationId: number;
    let w = 0, h = 0;

    interface MeteorType {
      x: number;
      y: number;
      rotation: number;
      vPhi: number;
      vLength: number;
      vRotate: number;
      edge: number;
      points: Array<{ phi: number; length: number }>;
      accPhi: number;
      type: 'meteor' | 'rock';
      lifespan?: number;
      friction?: number;
      update: () => boolean;
      render: () => void;
    }

    const meteors: MeteorType[] = [];
    const colors = ['#400', '#911', '#e33', '#f52'];

    function createRock(x: number, y: number, base: number): MeteorType {
      const edge = ~~(Math.random() * 5 + 4);
      const vLength = Math.random() * 1.5 * base + 8;
      return {
        x, y,
        rotation: Math.random() * Math.PI * 2,
        vPhi: Math.random() * Math.PI * 0.5 + Math.PI * 1.25,
        vLength,
        vRotate: Math.random() * 0.2 - 0.1,
        edge,
        points: [...Array(edge)].map((_, i) => ({
          phi: (i / edge) * Math.PI * 2 + Math.random() * 0.4 - 0.2,
          length: Math.random() * vLength * 0.1 + vLength * 0.15,
        })),
        accPhi: 0,
        type: 'rock',
        lifespan: ~~(Math.random() * 20 + 10),
        friction: 0.94,
        update() {
          if (this.lifespan !== undefined) { this.lifespan--; if (this.lifespan <= 0) return true; }
          this.rotation += this.vRotate;
          this.x += Math.cos(this.vPhi) * this.vLength;
          this.y += Math.sin(this.vPhi) * this.vLength + 2;
          if (this.friction) this.vLength *= this.friction;
          return false;
        },
        render() {
          if (!ctx || !vfx) return;
          ctx.globalAlpha = Math.random() * 0.5 + 0.5;
          ctx.strokeStyle = colors[0]; ctx.fillStyle = colors[1];
          ctx.beginPath();
          this.points.forEach((p, i) => {
            const px = Math.cos(p.phi + this.rotation) * p.length + this.x;
            const py = Math.sin(p.phi + this.rotation) * p.length + this.y;
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
          });
          ctx.closePath(); ctx.stroke(); ctx.fill(); ctx.globalAlpha = 1;
          vfx.globalAlpha = Math.random();
          vfx.fillStyle = colors[2 + ~~(Math.random() + 0.5)];
          vfx.beginPath();
          this.points.forEach((p, i) => {
            const px = Math.cos(p.phi + this.rotation) * p.length * 1.3 + this.x;
            const py = Math.sin(p.phi + this.rotation) * p.length * 1.3 + this.y;
            i === 0 ? vfx.moveTo(px, py) : vfx.lineTo(px, py);
          });
          vfx.closePath(); vfx.fill();
        },
      };
    }

    function createExplosion(x: number, y: number, size: number) {
      if (!vfx) return;
      const reducedSize = size * 0.8;
      for (let i = 0; i < reducedSize; i++) meteors.push(createRock(x, y, reducedSize));
      const strength = (Math.random() * 30 + 20) * 0.8;
      const gradient = vfx.createRadialGradient(x, y, 0, x, y, strength);
      gradient.addColorStop(0, 'rgba(255, 100, 50, 0.8)');
      gradient.addColorStop(0.3, 'rgba(255, 80, 30, 0.5)');
      gradient.addColorStop(0.6, 'rgba(255, 50, 20, 0.3)');
      gradient.addColorStop(1, 'rgba(255, 30, 10, 0)');
      vfx.globalAlpha = 1; vfx.beginPath(); vfx.fillStyle = gradient;
      vfx.arc(x, y, strength, 0, Math.PI * 2); vfx.fill();
    }

    function createMeteor(): MeteorType {
      const edge = ~~(Math.random() * 4 + 3);
      const vLength = Math.random() * 2 + 1;
      return {
        x: Math.random() * w * 1.4 + w * 0.1, y: Math.random() * -h * 0.5,
        rotation: Math.random() * Math.PI * 2,
        vPhi: Math.random() * 0.3 - 0.15 + Math.PI * 0.83,
        vLength, vRotate: Math.random() * 0.1 - 0.05, edge,
        points: [...Array(edge)].map((_, i) => ({
          phi: (i / edge) * Math.PI * 2 + Math.random() * 0.4 - 0.2,
          length: (Math.random() * vLength * 2 + vLength * 4) * 0.75,
        })),
        accPhi: Math.random() * 0.015 - 0.0075, type: 'meteor',
        update() {
          this.rotation += this.vRotate * 0.2;
          this.x += Math.cos(this.vPhi) * this.vLength * 0.2 + Math.cos(Math.PI * 0.5) * 0.98 * 0.2;
          this.y += Math.sin(this.vPhi) * this.vLength * 0.2 + Math.sin(Math.PI * 0.5) * 0.98 * 0.2;
          this.vPhi += this.accPhi * 0.5;
          if (this.vPhi > Math.PI * 0.9 || this.vPhi < Math.PI * 0.75) this.accPhi = -this.accPhi;
          this.vLength *= 1.005;
          if (this.y > h - 10) { createExplosion(this.x, h - 5, this.edge); return true; }
          if (this.x < -30) return true;
          return false;
        },
        render() {
          if (!ctx || !vfx) return;
          ctx.strokeStyle = colors[0]; ctx.fillStyle = colors[1]; ctx.beginPath();
          this.points.forEach((p, i) => {
            const x = Math.cos(p.phi + this.rotation) * p.length + this.x;
            const y = Math.sin(p.phi + this.rotation) * p.length + this.y;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          });
          ctx.closePath(); ctx.stroke(); ctx.fill();
          vfx.globalAlpha = Math.random(); vfx.fillStyle = colors[2 + ~~(Math.random() + 0.6)]; vfx.beginPath();
          this.points.forEach((p, i) => {
            const x = Math.cos(p.phi + this.rotation) * p.length * 1.2 + this.x;
            const y = Math.sin(p.phi + this.rotation) * p.length * 1.2 + this.y;
            i === 0 ? vfx.moveTo(x, y) : vfx.lineTo(x, y);
          });
          vfx.closePath(); vfx.fill();
        },
      };
    }

    function resize() {
      if (!canvas || !vfxCanvas) return;
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      w = rect.width; h = rect.height;
      canvas.width = w; canvas.height = h; vfxCanvas.width = w; vfxCanvas.height = h;
    }

    const MIN_METEORS = 6;

    function init() {
      if (!vfx) return;
      resize(); vfx.globalCompositeOperation = 'screen';
      for (let i = 0; i < 8; i++) { const m = createMeteor(); m.y = Math.random() * h * 0.8; m.x = Math.random() * w * 1.2; meteors.push(m); }
    }

    function draw() {
      if (!ctx || !vfx) return;
      ctx.clearRect(0, 0, w, h);
      vfx.globalCompositeOperation = 'destination-out';
      vfx.fillStyle = 'rgba(0, 0, 0, 0.08)'; vfx.fillRect(0, 0, w, h);
      vfx.globalCompositeOperation = 'source-over';
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        if (m.update()) { meteors.splice(i, 1); if (m.type === 'meteor') meteors.push(createMeteor()); }
        else m.render();
      }
      const meteorCount = meteors.filter(m => m.type === 'meteor').length;
      while (meteorCount < MIN_METEORS && meteors.length < 50) { meteors.push(createMeteor()); }
      animationId = requestAnimationFrame(draw);
    }

    init(); draw();
    return () => { if (animationId) cancelAnimationFrame(animationId); };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(127, 29, 29, 0.4) 0%, rgba(69, 10, 10, 0.5) 100%)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-1/3" style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(239, 68, 68, 0.4) 0%, transparent 70%)' }} />
      <canvas ref={vfxCanvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" style={{ display: 'block', filter: 'blur(4px) brightness(3) contrast(1.5)', mixBlendMode: 'screen' }} />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" style={{ display: 'block', mixBlendMode: 'multiply' }} />
    </div>
  );
}

// Smoke Effect - WebGL shader-based orange smoke
function SmokeEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl2');
    if (!gl) return;

    let animationId: number;
    const startTime = Date.now();

    const vertexShaderSource = `#version 300 es
      precision mediump float;
      const vec2 positions[6] = vec2[6](vec2(-1.0, -1.0), vec2(1.0, -1.0), vec2(-1.0, 1.0), vec2(-1.0, 1.0), vec2(1.0, -1.0), vec2(1.0, 1.0));
      out vec2 uv;
      void main() { uv = positions[gl_VertexID]; gl_Position = vec4(positions[gl_VertexID], 0.0, 1.0); }`;

    const fragmentShaderSource = `#version 300 es
      precision highp float;
      uniform float time; uniform vec2 vp;
      in vec2 uv; out vec4 fragColor;
      float rand(vec2 p) { return fract(sin(dot(p.xy, vec2(1., 300.))) * 43758.5453123); }
      float noise(vec2 p) { vec2 i = floor(p); vec2 f = fract(p); float a = rand(i); float b = rand(i + vec2(1.0, 0.0)); float c = rand(i + vec2(0.0, 1.0)); float d = rand(i + vec2(1.0, 1.0)); vec2 u = f * f * (3.0 - 2.0 * f); return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y; }
      #define OCTAVES 5
      float fbm(vec2 p) { float value = 0.; float amplitude = .4; for (int i = 0; i < OCTAVES; i++) { value += amplitude * noise(p); p *= 2.; amplitude *= .4; } return value; }
      void main() { vec2 p = uv.xy; p.x *= vp.x / vp.y; float gradient = mix(p.y*.2 + .1, p.y*1.2 + .9, fbm(p)); float speed = 0.4; float details = 7.; float force = .9; float shift = .5; vec2 fast = vec2(p.x, p.y - time*speed) * details; float ns_a = fbm(fast); float ns_b = force * fbm(fast + ns_a + time) - shift; float nns = force * fbm(vec2(ns_a, ns_b)); float ins = fbm(vec2(ns_b, ns_a)); vec3 c1 = mix(vec3(.95, .45, .1), vec3(.6, .2, .0), ins + shift); float heightFade = smoothstep(0.45, -1.0, uv.y); float alpha = heightFade * 0.6; fragColor = vec4(c1 + vec3(ins - gradient), alpha); }`;

    function compileShader(source: string, type: number) {
      if (!gl) return null;
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source); gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { gl.deleteShader(shader); return null; }
      return shader;
    }

    function resize() {
      if (!canvas || !gl) return;
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      canvas.width = rect.width; canvas.height = rect.height;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    const program = gl.createProgram();
    if (!program) return;
    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;
    gl.attachShader(program, vertexShader); gl.attachShader(program, fragmentShader);
    gl.linkProgram(program); gl.useProgram(program);
    const timeLocation = gl.getUniformLocation(program, 'time');
    const resolutionLocation = gl.getUniformLocation(program, 'vp');
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    resize();

    function render() {
      if (!canvas || !gl) return;
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(timeLocation, (Date.now() - startTime) / 1000);
      gl.uniform2fv(resolutionLocation, [canvas.width, canvas.height]);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationId = requestAnimationFrame(render);
    }
    render();
    return () => { if (animationId) cancelAnimationFrame(animationId); };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" style={{ display: 'block' }} />
    </div>
  );
}

// Spark Effect - Canvas-based lightning
function SparkEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let firstFrame = true;

    function resizeCanvas() {
      if (!canvas || !ctx) return;
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const ratio = window.devicePixelRatio || 1;
      canvas.width = rect.width * ratio; canvas.height = rect.height * ratio;
      canvas.style.width = rect.width + 'px'; canvas.style.height = rect.height + 'px';
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function drawRoot(x: number, y: number, maxY: number) {
      if (!ctx) return;
      let sx = x, sy = y;
      let ex = sx + Math.floor(Math.random() * 30) - 15;
      let ey = sy + Math.floor(Math.random() * 15) + 5;
      const limit = Math.floor(Math.random() * 8) + 2;
      for (let i = 0; i < limit && ey < maxY; i++) {
        ctx.beginPath(); ctx.strokeStyle = 'rgba(250, 204, 21, 0.6)'; ctx.lineWidth = 1;
        ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
        sx = ex; sy = ey; ex = sx + Math.floor(Math.random() * 30) - 15; ey = sy + Math.floor(Math.random() * 15) + 5;
      }
    }

    function drawLightning(startX: number, w: number, h: number) {
      if (!ctx) return;
      ctx.fillStyle = 'rgba(250, 204, 21, 0.08)'; ctx.fillRect(0, 0, w, h);
      let sx = startX, sy = 0;
      let ex = sx + Math.floor(Math.random() * 20) - 10;
      let ey = sy + Math.floor(Math.random() * 15) + 5;
      const limit = Math.floor(h / 8);
      for (let i = 0; i < limit && ey < h; i++) {
        ctx.beginPath(); ctx.strokeStyle = '#facc15'; ctx.lineWidth = 2;
        ctx.shadowColor = '#facc15'; ctx.shadowBlur = 10; ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
        ctx.beginPath(); ctx.strokeStyle = '#fef08a'; ctx.lineWidth = 1; ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
        sx = ex; sy = ey; ex = sx + Math.floor(Math.random() * 20) - 10; ey = sy + Math.floor(Math.random() * 15) + 5;
        if (Math.random() < 0.15) drawRoot(sx, sy, h);
      }
      ctx.shadowBlur = 0;
    }

    function draw() {
      if (!canvas || !ctx) return;
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const w = rect.width, h = rect.height;
      ctx.clearRect(0, 0, w, h);
      if (firstFrame || Math.random() < 0.08) { drawLightning(Math.random() * w, w, h); firstFrame = false; }
      animationId = requestAnimationFrame(draw);
    }

    resizeCanvas(); draw();
    return () => { if (animationId) cancelAnimationFrame(animationId); };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(250,204,21,0.1) 0%, transparent 70%)' }} />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" style={{ display: 'block' }} />
    </div>
  );
}

// Glow Effect - Checkmark stamp animation
function GlowEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Mobile-responsive positioning for checkmark */}
      <style jsx>{`
        .glow-checkmark-container {
          padding-left: calc(60% + 75px);
          transform: translateY(0);
        }
        .glow-particle {
          left: calc(66% + 15px);
          top: 50%;
        }
        .glow-gradient {
          background: radial-gradient(ellipse at 60% 50%, rgba(34,197,94,0.25) 0%, transparent 60%);
        }
        @media (max-width: 640px) {
          .glow-checkmark-container {
            padding-left: calc(60% + 50px) !important;
            transform: translateY(15px) !important;
          }
          .glow-particle {
            left: calc(66% + 60px) !important;
            top: calc(50% + 15px) !important;
          }
          .glow-gradient {
            background: radial-gradient(ellipse at calc(60% + 50px) calc(50% + 15px), rgba(34,197,94,0.25) 0%, transparent 60%) !important;
          }
        }
      `}</style>
      <div className="absolute inset-0 animate-glow-pulse glow-gradient" />
      <div className="absolute inset-0 flex items-center glow-checkmark-container">
        <div className="animate-stamp-drop">
          <svg viewBox="0 0 100 100" className="w-16 h-16" style={{ filter: 'drop-shadow(0 0 10px rgba(34,197,94,0.8)) drop-shadow(0 0 20px rgba(34,197,94,0.5))' }}>
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(34,197,94,0.3)" strokeWidth="4" />
            <path d="M28 52 L42 66 L72 36" fill="none" stroke="#22c55e" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className="animate-checkmark-draw" />
          </svg>
        </div>
      </div>
      {[{ tx: 30, ty: -20 }, { tx: -30, ty: -20 }, { tx: 40, ty: 0 }, { tx: -40, ty: 0 }, { tx: 25, ty: 25 }, { tx: -25, ty: 25 }, { tx: 0, ty: -35 }, { tx: 0, ty: 30 }].map((particle, i) => (
        <div key={i} className="absolute top-1/2 animate-impact-particle glow-particle" style={{ width: '4px', height: '4px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 6px #22c55e', ['--tx' as string]: `${particle.tx}px`, ['--ty' as string]: `${particle.ty}px` }} />
      ))}
    </div>
  );
}

// Snow Effect
function FrostEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const FLAKE_COUNT = 40;
    let flakes: Array<{ x: number; y: number; r: number; speedY: number; speedX: number; phase: number; drift: number }> = [];
    let animationId: number;

    function resizeCanvas() {
      if (!canvas || !ctx) return;
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const ratio = window.devicePixelRatio || 1;
      canvas.width = rect.width * ratio; canvas.height = rect.height * ratio;
      canvas.style.width = rect.width + 'px'; canvas.style.height = rect.height + 'px';
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function createFlakes() {
      if (!canvas) return;
      flakes = [];
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      for (let i = 0; i < FLAKE_COUNT; i++) {
        flakes.push({ x: Math.random() * rect.width, y: Math.random() * rect.height, r: 0.5 + Math.random() * 1.5, speedY: 0.3 + Math.random() * 0.8, speedX: -0.2 + Math.random() * 0.4, phase: Math.random() * Math.PI * 2, drift: 0.15 + Math.random() * 0.25 });
      }
    }

    function draw() {
      if (!canvas || !ctx) return;
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const w = rect.width, h = rect.height;
      ctx.clearRect(0, 0, w, h); ctx.save(); ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      for (const f of flakes) {
        f.phase += 0.012; f.x += f.speedX + Math.sin(f.phase) * f.drift; f.y += f.speedY;
        if (f.y > h + 5) { f.y = -5; f.x = Math.random() * w; }
        if (f.x > w + 5) f.x = -5; if (f.x < -5) f.x = w + 5;
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore(); animationId = requestAnimationFrame(draw);
    }

    resizeCanvas(); createFlakes(); draw();
    return () => { if (animationId) cancelAnimationFrame(animationId); };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(159,217,255,0.1) 0%, rgba(159,217,255,0.05) 100%)' }} />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" style={{ display: 'block' }} />
    </div>
  );
}

// Rain Effect
function RainEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const DROP_COUNT = 25;
    let drops: Array<{ x: number; y: number; length: number; speedY: number; opacity: number }> = [];
    let animationId: number;

    function resizeCanvas() {
      if (!canvas || !ctx) return;
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const ratio = window.devicePixelRatio || 1;
      canvas.width = rect.width * ratio; canvas.height = rect.height * ratio;
      canvas.style.width = rect.width + 'px'; canvas.style.height = rect.height + 'px';
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function createDrops() {
      if (!canvas) return;
      drops = [];
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      for (let i = 0; i < DROP_COUNT; i++) {
        drops.push({ x: Math.random() * rect.width, y: Math.random() * rect.height, length: 6 + Math.random() * 8, speedY: 1.5 + Math.random() * 2, opacity: 0.25 + Math.random() * 0.4 });
      }
    }

    function draw() {
      if (!canvas || !ctx) return;
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const w = rect.width, h = rect.height;
      ctx.clearRect(0, 0, w, h);
      for (const d of drops) {
        d.y += d.speedY;
        if (d.y > h + d.length) { d.y = -d.length; d.x = Math.random() * w; }
        ctx.beginPath(); ctx.strokeStyle = `rgba(100, 200, 255, ${d.opacity})`; ctx.lineWidth = 1.5;
        ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - 1, d.y + d.length); ctx.stroke();
      }
      animationId = requestAnimationFrame(draw);
    }

    resizeCanvas(); createDrops(); draw();
    return () => { if (animationId) cancelAnimationFrame(animationId); };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(100,180,255,0.08) 0%, rgba(100,180,255,0.15) 100%)' }} />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" style={{ display: 'block' }} />
    </div>
  );
}

// Flood Effect
function FloodEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    const timeStep = 1 / 60;

    interface Bubble { x: number; y: number; originX: number; r: number; speed: number; swayDir: number; sway: number; }
    const bubbles: Bubble[] = [];
    const bubbleSources = [0.15 + Math.random() * 0.15, 0.45 + Math.random() * 0.2, 0.75 + Math.random() * 0.15];

    function resizeCanvas() {
      if (!canvas || !ctx) return;
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const ratio = window.devicePixelRatio || 1;
      canvas.width = rect.width * ratio; canvas.height = rect.height * ratio;
      canvas.style.width = rect.width + 'px'; canvas.style.height = rect.height + 'px';
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function initBubbles() {
      if (!canvas) return;
      bubbles.length = 0;
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      bubbleSources.forEach(sourceX => {
        const count = 3 + Math.floor(Math.random() * 2);
        for (let i = 0; i < count; i++) {
          const originX = rect.width * sourceX + (Math.random() - 0.5) * 20;
          bubbles.push({ x: originX, y: rect.height * 0.6 + Math.random() * (rect.height * 0.4), originX, r: 1.5 + Math.random() * 2, speed: 12 + Math.random() * 18, swayDir: Math.random() > 0.5 ? -1 : 1, sway: 0 });
        }
      });
    }

    function draw() {
      if (!canvas || !ctx) return;
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const w = rect.width, h = rect.height;
      const waterLevel = h * 0.6;
      ctx.clearRect(0, 0, w, h);
      const gradient = ctx.createLinearGradient(0, waterLevel, 0, h);
      gradient.addColorStop(0, 'rgba(88, 28, 135, 0.12)');
      gradient.addColorStop(0.5, 'rgba(88, 28, 135, 0.2)');
      gradient.addColorStop(1, 'rgba(59, 7, 100, 0.3)');
      ctx.fillStyle = gradient; ctx.fillRect(0, waterLevel, w, h - waterLevel);

      bubbles.forEach(b => {
        b.sway = Math.sin(time * 2 + b.x * 0.1) * 10 * b.swayDir; b.y -= b.speed * timeStep;
        if (b.y < waterLevel - b.r) { b.y = h + b.r + Math.random() * 20; b.x = b.originX + (Math.random() - 0.5) * 15; }
        if (b.y > waterLevel) {
          ctx.beginPath(); ctx.fillStyle = 'rgba(180, 160, 220, 0.5)'; ctx.arc(b.x + b.sway, b.y, b.r, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.fillStyle = 'rgba(220, 200, 255, 0.6)'; ctx.arc(b.x + b.sway - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.3, 0, Math.PI * 2); ctx.fill();
        }
      });

      const waveConfigs = [{ amplitude: 4, frequency: 0.04, speed: 1.8, phase: 0, opacity: 0.5, offset: 0 }, { amplitude: 3, frequency: 0.06, speed: 2.2, phase: 2, opacity: 0.4, offset: 3 }, { amplitude: 2.5, frequency: 0.08, speed: 1.5, phase: 4.5, opacity: 0.3, offset: 6 }];
      waveConfigs.forEach(wave => {
        ctx.beginPath(); ctx.strokeStyle = `rgba(180, 160, 220, ${wave.opacity})`; ctx.lineWidth = 1.5;
        for (let x = 0; x <= w; x += 3) {
          const y = waterLevel + wave.offset + Math.sin(x * wave.frequency + time * wave.speed + wave.phase) * wave.amplitude + Math.sin(x * wave.frequency * 1.7 + time * wave.speed * 0.8) * (wave.amplitude * 0.4);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      time += timeStep; animationId = requestAnimationFrame(draw);
    }

    resizeCanvas(); initBubbles(); draw();
    return () => { if (animationId) cancelAnimationFrame(animationId); };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" style={{ display: 'block' }} />
    </div>
  );
}

// VerdictEffect wrapper
function VerdictEffect({ effect }: { effect: string }) {
  switch (effect) {
    case 'storm': return <StormEffect />;
    case 'smoke': return <SmokeEffect />;
    case 'spark': return <SparkEffect />;
    case 'glow': return <GlowEffect />;
    case 'frost': return <FrostEffect />;
    case 'rain': return <RainEffect />;
    case 'flood': return <FloodEffect />;
    default: return null;
  }
}

// ============================================================
// END ANIMATED EFFECTS
// ============================================================

// Verdict configuration for display (text comes from translations)
const VERDICT_CONFIG: Record<string, {
  emoji: string;
  color: string;
  bgColor: string;
  effect: string;
}> = {
  OVERKILL_SEVERE: {
    emoji: '💀',
    color: 'text-red-500',
    bgColor: 'bg-red-500',
    effect: 'storm',
  },
  OVERKILL: {
    emoji: '🔥',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500',
    effect: 'smoke',
  },
  SLIGHT_OVERKILL: {
    emoji: '⚡',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500',
    effect: 'spark',
  },
  BALANCED: {
    emoji: '✅',
    color: 'text-green-500',
    bgColor: 'bg-green-500',
    effect: 'glow',
  },
  SLIGHT_UNDERKILL: {
    emoji: '🌧️',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500',
    effect: 'rain',
  },
  UNDERKILL: {
    emoji: '❄️',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500',
    effect: 'frost',
  },
  UNDERKILL_SEVERE: {
    emoji: '🌊',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500',
    effect: 'flood',
  },
};

const VERDICTS = Object.keys(VERDICT_CONFIG) as VerdictType[];

interface DecodedParams {
  scoreApp: number;
  scoreInfra: number;
  verdict: VerdictType;
  phraseIndex: number;
}

function decodeId(id: string): DecodedParams | null {
  const parts = id.split('-');
  if (parts.length < 3) return null;

  const scoreApp = parseInt(parts[0], 10);
  const scoreInfra = parseInt(parts[1], 10);
  const verdictIndex = parseInt(parts[2], 10);
  const phraseIndex = parts[3] ? parseInt(parts[3], 10) : 0;

  if (isNaN(scoreApp) || isNaN(scoreInfra) || isNaN(verdictIndex)) return null;
  if (scoreApp < 0 || scoreApp > 100 || scoreInfra < 0 || scoreInfra > 100) return null;
  if (verdictIndex < 0 || verdictIndex >= VERDICTS.length) return null;

  return {
    scoreApp,
    scoreInfra,
    verdict: VERDICTS[verdictIndex],
    phraseIndex,
  };
}

export default function ShareablePage() {
  const params = useParams();
  const id = params.id as string;
  const decoded = decodeId(id);
  const { t, tArray } = useTranslations();

  if (!decoded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
        <div className="text-center">
          <div className="text-6xl mb-6">🤔</div>
          <h1 className="text-2xl font-bold text-white mb-4">{t('shareable.invalidLink.title')}</h1>
          <p className="text-slate-400 mb-6">{t('shareable.invalidLink.description')}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/90 text-white font-medium rounded-xl transition-colors"
          >
            {t('shareable.invalidLink.cta')}
          </Link>
        </div>
      </div>
    );
  }

  const { scoreApp, scoreInfra, verdict, phraseIndex } = decoded;
  const config = VERDICT_CONFIG[verdict];
  const gap = scoreInfra - scoreApp;

  // Get label and phrases from translations
  const label = t(`result.verdicts.${verdict}.label` as any);
  const phrases = tArray(`result.verdicts.${verdict}.phrases`);
  const phrase = phrases[phraseIndex % phrases.length] || '';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* CSS animations for effects */}
      <style jsx global>{`
        @keyframes stamp-drop {
          0% { transform: translateY(-100px) scale(1.5); opacity: 0; }
          60% { transform: translateY(5px) scale(0.95); opacity: 1; }
          75% { transform: translateY(-3px) scale(1.02); }
          90% { transform: translateY(2px) scale(0.98); }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes checkmark-draw {
          0% { stroke-dasharray: 100; stroke-dashoffset: 100; }
          100% { stroke-dasharray: 100; stroke-dashoffset: 0; }
        }
        @keyframes impact-particle {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          100% { transform: translate(calc(-50% + var(--tx, 30px)), calc(-50% + var(--ty, -20px))) scale(2.5); opacity: 0; }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .animate-stamp-drop { animation: stamp-drop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-checkmark-draw { stroke-dasharray: 100; stroke-dashoffset: 100; animation: checkmark-draw 0.4s ease-out 0.3s forwards; }
        .animate-impact-particle { animation: impact-particle 0.4s ease-out 0.35s forwards; opacity: 0; }
        .animate-glow-pulse { animation: glow-pulse 1.5s ease-in-out infinite; }
      `}</style>

      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      </div>

      {/* Animated verdict effect - fullscreen background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <VerdictEffect effect={config.effect} />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full px-4 py-3 sm:py-4 border-b border-white/10">
        <div className="max-w-4xl mx-auto flex justify-center">
          <Link href="/" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-sm font-medium text-white hover:bg-white/15 transition-colors">
            <Zap className="w-4 h-4 text-accent" />
            <span className="hidden sm:inline">StackOverkill.io</span>
            <span className="sm:hidden">StackOverkill</span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="max-w-lg w-full text-center">
          {/* Emoji */}
          <div className="text-7xl mb-4">{config.emoji}</div>

          {/* Verdict badge */}
          <div className={`inline-flex items-center justify-center px-6 py-3 ${config.bgColor} rounded-xl text-white font-extrabold text-2xl mb-6`}>
            {label}
          </div>

          {/* Phrase */}
          <p className="text-slate-300 text-lg mb-8">{phrase}</p>

          {/* Scores */}
          <div className="flex items-center justify-center gap-8 mb-4">
            <div className="text-center">
              <p className="text-sm text-slate-400 mb-1">APP</p>
              <p className="text-4xl font-bold text-primary-400">{scoreApp}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-400 mb-1">VS</p>
              <p className="text-2xl text-slate-500">⚡</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-400 mb-1">INFRA</p>
              <p className="text-4xl font-bold text-accent">{scoreInfra}</p>
            </div>
          </div>

          {/* Gap */}
          <p className="text-slate-400 mb-10">
            {t('shareable.gap')} <span className={`font-bold ${config.color}`}>{gap > 0 ? '+' : ''}{gap} {t('shareable.pts')}</span>
          </p>

          {/* CTA */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent hover:bg-accent/90 text-white font-bold text-lg rounded-xl transition-colors shadow-lg shadow-accent/20"
          >
            <Zap className="w-5 h-5" />
            {t('shareable.cta')}
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full px-4 py-3 sm:py-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Zap className="w-4 h-4 text-accent" />
            <span className="font-medium">{t('common.brand')}</span>
            <span className="text-slate-600">{t('common.by')}</span>
            <a
              href="https://www.rwx-g.fr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
            >
              Rwx-G
            </a>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-400">
            <Link href="/leaderboard" className="hover:text-white transition-colors">
              🏆 {t('footer.leaderboard')}
            </Link>
            <Link href="/mentions-legales" className="hover:text-white transition-colors">
              {t('footer.legal')}
            </Link>
            <Link href="/confidentialite" className="hover:text-white transition-colors">
              {t('footer.privacy')}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
