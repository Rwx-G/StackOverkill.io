'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import * as htmlToImage from 'html-to-image';
import { RefreshCw, Linkedin, Download, ExternalLink, Zap, HelpCircle, ChevronDown, Trophy, Check, ArrowLeft, Twitter } from 'lucide-react';
import { Button } from '@/components/ui';
import { useScoreStore } from '@/stores/scoreStore';
// Note: getContextualPhrase removed - now using translated phrases from JSON files
import { useTranslations } from '@/i18n/useTranslations';
import type { ScoreResult, ApplicationInput, InfrastructureInput } from '@stackoverkill/shared';
import { getVerdictText } from '@stackoverkill/shared';

// ============================================================
// ANIMATED EFFECTS (copied from homepage for live visualization)
// ============================================================

// Helper to get element dimensions ignoring CSS transforms (scale)
// Using offsetWidth/offsetHeight instead of getBoundingClientRect
function getElementSize(element: HTMLElement | null | undefined): { width: number; height: number } | null {
  if (!element) return null;
  return { width: element.offsetWidth, height: element.offsetHeight };
}

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
        x,
        y,
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
          if (this.lifespan !== undefined) {
            this.lifespan--;
            if (this.lifespan <= 0) return true;
          }
          this.rotation += this.vRotate;
          this.x += Math.cos(this.vPhi) * this.vLength;
          this.y += Math.sin(this.vPhi) * this.vLength;
          this.y += 2;
          if (this.friction) this.vLength *= this.friction;
          return false;
        },
        render() {
          if (!ctx || !vfx) return;
          ctx.globalAlpha = Math.random() * 0.5 + 0.5;
          ctx.strokeStyle = colors[0];
          ctx.fillStyle = colors[1];
          ctx.beginPath();
          this.points.forEach((p, i) => {
            const px = Math.cos(p.phi + this.rotation) * p.length + this.x;
            const py = Math.sin(p.phi + this.rotation) * p.length + this.y;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          });
          ctx.closePath();
          ctx.stroke();
          ctx.fill();
          ctx.globalAlpha = 1;

          vfx.globalAlpha = Math.random();
          vfx.fillStyle = colors[2 + ~~(Math.random() + 0.5)];
          vfx.beginPath();
          this.points.forEach((p, i) => {
            const px = Math.cos(p.phi + this.rotation) * p.length * 1.3 + this.x;
            const py = Math.sin(p.phi + this.rotation) * p.length * 1.3 + this.y;
            if (i === 0) vfx.moveTo(px, py);
            else vfx.lineTo(px, py);
          });
          vfx.closePath();
          vfx.fill();
        },
      };
    }

    function createExplosion(x: number, y: number, size: number) {
      if (!vfx) return;
      const reducedSize = size * 0.8;
      for (let i = 0; i < reducedSize; i++) {
        meteors.push(createRock(x, y, reducedSize));
      }
      const strength = (Math.random() * 30 + 20) * 0.8;
      const gradient = vfx.createRadialGradient(x, y, 0, x, y, strength);
      gradient.addColorStop(0, 'rgba(255, 100, 50, 0.8)');
      gradient.addColorStop(0.3, 'rgba(255, 80, 30, 0.5)');
      gradient.addColorStop(0.6, 'rgba(255, 50, 20, 0.3)');
      gradient.addColorStop(1, 'rgba(255, 30, 10, 0)');
      vfx.globalAlpha = 1;
      vfx.beginPath();
      vfx.fillStyle = gradient;
      vfx.arc(x, y, strength, 0, Math.PI * 2);
      vfx.fill();
    }

    function createMeteor(): MeteorType {
      const edge = ~~(Math.random() * 4 + 3);
      const vLength = Math.random() * 2 + 1;
      return {
        // Start from right side (some off-screen) to land across full width
        x: Math.random() * w * 1.4 + w * 0.1,
        y: Math.random() * -h * 0.5,
        rotation: Math.random() * Math.PI * 2,
        // Adjusted angle for rectangular card (~150° = steeper left-down diagonal)
        vPhi: Math.random() * 0.3 - 0.15 + Math.PI * 0.83,
        vLength,
        vRotate: Math.random() * 0.1 - 0.05,
        edge,
        points: [...Array(edge)].map((_, i) => ({
          phi: (i / edge) * Math.PI * 2 + Math.random() * 0.4 - 0.2,
          length: (Math.random() * vLength * 2 + vLength * 4) * 0.75,
        })),
        accPhi: Math.random() * 0.015 - 0.0075,
        type: 'meteor',
        update() {
          this.rotation += this.vRotate * 0.2;
          this.x += Math.cos(this.vPhi) * this.vLength * 0.2;
          this.y += Math.sin(this.vPhi) * this.vLength * 0.2;
          // Add downward drift
          this.x += Math.cos(Math.PI * 0.5) * 0.98 * 0.2;
          this.y += Math.sin(Math.PI * 0.5) * 0.98 * 0.2;
          this.vPhi += this.accPhi * 0.5;
          if (this.vPhi > Math.PI * 0.9 || this.vPhi < Math.PI * 0.75) {
            this.accPhi = -this.accPhi;
          }
          this.vLength *= 1.005;
          // Remove if hits bottom
          if (this.y > h - 10) {
            createExplosion(this.x, h - 5, this.edge);
            return true;
          }
          // Remove if goes off left edge
          if (this.x < -30) {
            return true;
          }
          return false;
        },
        render() {
          if (!ctx || !vfx) return;
          ctx.strokeStyle = colors[0];
          ctx.fillStyle = colors[1];
          ctx.beginPath();
          this.points.forEach((p, i) => {
            const x = Math.cos(p.phi + this.rotation) * p.length + this.x;
            const y = Math.sin(p.phi + this.rotation) * p.length + this.y;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          ctx.closePath();
          ctx.stroke();
          ctx.fill();

          vfx.globalAlpha = Math.random();
          vfx.fillStyle = colors[2 + ~~(Math.random() + 0.6)];
          vfx.beginPath();
          this.points.forEach((p, i) => {
            const x = Math.cos(p.phi + this.rotation) * p.length * 1.2 + this.x;
            const y = Math.sin(p.phi + this.rotation) * p.length * 1.2 + this.y;
            if (i === 0) vfx.moveTo(x, y);
            else vfx.lineTo(x, y);
          });
          vfx.closePath();
          vfx.fill();
        },
      };
    }

    function resize() {
      if (!canvas || !vfxCanvas) return;
      const rect = getElementSize(canvas.parentElement);
      if (!rect) return;
      w = rect.width;
      h = rect.height;
      canvas.width = w;
      canvas.height = h;
      vfxCanvas.width = w;
      vfxCanvas.height = h;
    }

    const MIN_METEORS = 6;

    function init() {
      if (!vfx) return;
      resize();
      vfx.globalCompositeOperation = 'screen';
      // Start with meteors spread across the canvas
      for (let i = 0; i < 8; i++) {
        const m = createMeteor();
        m.y = Math.random() * h * 0.8;
        m.x = Math.random() * w * 1.2;
        meteors.push(m);
      }
    }

    function draw() {
      if (!ctx || !vfx) return;
      ctx.clearRect(0, 0, w, h);

      vfx.globalCompositeOperation = 'destination-out';
      vfx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      vfx.fillRect(0, 0, w, h);
      vfx.globalCompositeOperation = 'source-over';

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        const shouldRemove = m.update();
        m.render();
        if (shouldRemove) {
          meteors.splice(i, 1);
          if (m.type === 'meteor') {
            meteors.push(createMeteor());
          }
        }
      }

      // Ensure minimum meteor count (in case of edge cases)
      const meteorCount = meteors.filter(m => m.type === 'meteor').length;
      while (meteorCount < MIN_METEORS && meteors.length < 50) {
        meteors.push(createMeteor());
      }

      animationId = requestAnimationFrame(draw);
    }

    init();
    draw();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden">
      {/* Red gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(127, 29, 29, 0.4) 0%, rgba(69, 10, 10, 0.5) 100%)',
        }}
      />
      {/* Impact glow at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/3"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(239, 68, 68, 0.4) 0%, transparent 70%)',
        }}
      />
      <canvas
        ref={vfxCanvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
        style={{
          display: 'block',
          filter: 'blur(4px) brightness(3) contrast(1.5)',
          mixBlendMode: 'screen',
        }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
        style={{
          display: 'block',
          mixBlendMode: 'multiply',
        }}
      />
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
      void main() {
        uv = positions[gl_VertexID];
        gl_Position = vec4(positions[gl_VertexID], 0.0, 1.0);
      }`;

    const fragmentShaderSource = `#version 300 es
      precision highp float;

      uniform float time;
      uniform vec2 vp;

      in vec2 uv;
      out vec4 fragColor;

      float rand(vec2 p) {
        return fract(sin(dot(p.xy, vec2(1., 300.))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = rand(i);
        float b = rand(i + vec2(1.0, 0.0));
        float c = rand(i + vec2(0.0, 1.0));
        float d = rand(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      #define OCTAVES 5
      float fbm(vec2 p) {
        float value = 0.;
        float amplitude = .4;
        for (int i = 0; i < OCTAVES; i++) {
          value += amplitude * noise(p);
          p *= 2.;
          amplitude *= .4;
        }
        return value;
      }

      void main() {
        vec2 p = uv.xy;
        p.x *= vp.x / vp.y;

        float gradient = mix(p.y*.2 + .1, p.y*1.2 + .9, fbm(p));
        float speed = 0.4;
        float details = 7.;
        float force = .9;
        float shift = .5;

        vec2 fast = vec2(p.x, p.y - time*speed) * details;
        float ns_a = fbm(fast);
        float ns_b = force * fbm(fast + ns_a + time) - shift;
        float nns = force * fbm(vec2(ns_a, ns_b));
        float ins = fbm(vec2(ns_b, ns_a));

        vec3 c1 = mix(vec3(.95, .45, .1), vec3(.6, .2, .0), ins + shift);

        float heightFade = smoothstep(0.45, -1.0, uv.y);
        float alpha = heightFade * 0.6;

        fragColor = vec4(c1 + vec3(ins - gradient), alpha);
      }`;

    function compileShader(source: string, type: number) {
      if (!gl) return null;
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    function resize() {
      if (!canvas || !gl) return;
      const rect = getElementSize(canvas.parentElement);
      if (!rect) return;
      canvas.width = rect.width;
      canvas.height = rect.height;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    const program = gl.createProgram();
    if (!program) return;

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const timeLocation = gl.getUniformLocation(program, 'time');
    const resolutionLocation = gl.getUniformLocation(program, 'vp');

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    resize();

    function render() {
      if (!canvas || !gl) return;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(timeLocation, (Date.now() - startTime) / 1000);
      gl.uniform2fv(resolutionLocation, [canvas.width, canvas.height]);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationId = requestAnimationFrame(render);
    }

    render();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
        style={{ display: 'block' }}
      />
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
      if (!canvas) return;
      const rect = getElementSize(canvas.parentElement);
      if (!rect) return;

      const ratio = window.devicePixelRatio || 1;
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx?.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function drawRoot(x: number, y: number, maxY: number) {
      if (!ctx) return;
      let sx = x, sy = y;
      let ex = sx + Math.floor(Math.random() * 30) - 15;
      let ey = sy + Math.floor(Math.random() * 15) + 5;

      const limit = Math.floor(Math.random() * 8) + 2;
      for (let i = 0; i < limit && ey < maxY; i++) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.6)';
        ctx.lineWidth = 1;
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.stroke();

        sx = ex;
        sy = ey;
        ex = sx + Math.floor(Math.random() * 30) - 15;
        ey = sy + Math.floor(Math.random() * 15) + 5;
      }
    }

    function drawLightning(startX: number, w: number, h: number) {
      if (!ctx) return;

      ctx.fillStyle = 'rgba(250, 204, 21, 0.08)';
      ctx.fillRect(0, 0, w, h);

      let sx = startX, sy = 0;
      let ex = sx + Math.floor(Math.random() * 20) - 10;
      let ey = sy + Math.floor(Math.random() * 15) + 5;

      const limit = Math.floor(h / 8);
      for (let i = 0; i < limit && ey < h; i++) {
        ctx.beginPath();
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 10;
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 1;
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.stroke();

        sx = ex;
        sy = ey;
        ex = sx + Math.floor(Math.random() * 20) - 10;
        ey = sy + Math.floor(Math.random() * 15) + 5;

        if (Math.random() < 0.15) {
          drawRoot(sx, sy, h);
        }
      }
      ctx.shadowBlur = 0;
    }

    function draw() {
      if (!canvas || !ctx) return;
      const rect = getElementSize(canvas.parentElement);
      if (!rect) return;

      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      if (firstFrame || Math.random() < 0.08) {
        const startX = Math.random() * w;
        drawLightning(startX, w, h);
        firstFrame = false;
      }

      animationId = requestAnimationFrame(draw);
    }

    resizeCanvas();
    draw();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(250,204,21,0.1) 0%, transparent 70%)',
        }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
        style={{ display: 'block' }}
      />
    </div>
  );
}

// Glow Effect - Checkmark stamp animation
function GlowEffect() {
  return (
    <div className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden">
      <div
        className="absolute inset-0 animate-glow-pulse"
        style={{
          background: 'radial-gradient(ellipse at 80% 50%, rgba(34,197,94,0.25) 0%, transparent 60%)',
        }}
      />

      <div className="absolute inset-0 flex items-center" style={{ paddingLeft: '80%' }}>
        <div className="animate-stamp-drop">
          <svg
            viewBox="0 0 100 100"
            className="w-16 h-16"
            style={{
              filter: 'drop-shadow(0 0 10px rgba(34,197,94,0.8)) drop-shadow(0 0 20px rgba(34,197,94,0.5))',
            }}
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(34,197,94,0.3)"
              strokeWidth="4"
            />
            <path
              d="M28 52 L42 66 L72 36"
              fill="none"
              stroke="#22c55e"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-checkmark-draw"
            />
          </svg>
        </div>
      </div>

      {[
        { tx: 30, ty: -20 },
        { tx: -30, ty: -20 },
        { tx: 40, ty: 0 },
        { tx: -40, ty: 0 },
        { tx: 25, ty: 25 },
        { tx: -25, ty: 25 },
        { tx: 0, ty: -35 },
        { tx: 0, ty: 30 },
      ].map((particle, i) => (
        <div
          key={i}
          className="absolute top-1/2 animate-impact-particle glow-particle"
          style={{
            left: '86%',
            width: '4px',
            height: '4px',
            background: '#22c55e',
            borderRadius: '50%',
            boxShadow: '0 0 6px #22c55e',
            ['--tx' as string]: `${particle.tx}px`,
            ['--ty' as string]: `${particle.ty}px`,
          }}
        />
      ))}
    </div>
  );
}

// Snow Effect - Adapted from CodePen Snow & Ice challenge
function FrostEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const FLAKE_COUNT = 40;
    let flakes: Array<{
      x: number;
      y: number;
      r: number;
      speedY: number;
      speedX: number;
      phase: number;
      drift: number;
    }> = [];
    let animationId: number;

    function resizeCanvas() {
      if (!canvas) return;
      const rect = getElementSize(canvas.parentElement);
      if (!rect) return;

      const ratio = window.devicePixelRatio || 1;
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx?.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function createFlakes() {
      if (!canvas) return;
      flakes = [];
      const rect = getElementSize(canvas.parentElement);
      if (!rect) return;

      for (let i = 0; i < FLAKE_COUNT; i++) {
        flakes.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          r: 0.5 + Math.random() * 1.5,
          speedY: 0.3 + Math.random() * 0.8,
          speedX: -0.2 + Math.random() * 0.4,
          phase: Math.random() * Math.PI * 2,
          drift: 0.15 + Math.random() * 0.25,
        });
      }
    }

    function draw() {
      if (!canvas || !ctx) return;
      const rect = getElementSize(canvas.parentElement);
      if (!rect) return;

      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';

      for (const f of flakes) {
        f.phase += 0.012;
        f.x += f.speedX + Math.sin(f.phase) * f.drift;
        f.y += f.speedY;

        if (f.y > h + 5) {
          f.y = -5;
          f.x = Math.random() * w;
        }
        if (f.x > w + 5) f.x = -5;
        if (f.x < -5) f.x = w + 5;

        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      animationId = requestAnimationFrame(draw);
    }

    resizeCanvas();
    createFlakes();
    draw();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(159,217,255,0.1) 0%, rgba(159,217,255,0.05) 100%)',
        }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
        style={{ display: 'block' }}
      />
    </div>
  );
}

// Rain Effect - Falling rain drops
function RainEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const DROP_COUNT = 25;
    let drops: Array<{
      x: number;
      y: number;
      length: number;
      speedY: number;
      opacity: number;
    }> = [];
    let animationId: number;

    function resizeCanvas() {
      if (!canvas) return;
      const rect = getElementSize(canvas.parentElement);
      if (!rect) return;

      const ratio = window.devicePixelRatio || 1;
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx?.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function createDrops() {
      if (!canvas) return;
      drops = [];
      const rect = getElementSize(canvas.parentElement);
      if (!rect) return;

      for (let i = 0; i < DROP_COUNT; i++) {
        drops.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          length: 6 + Math.random() * 8,
          speedY: 1.5 + Math.random() * 2,
          opacity: 0.25 + Math.random() * 0.4,
        });
      }
    }

    function draw() {
      if (!canvas || !ctx) return;
      const rect = getElementSize(canvas.parentElement);
      if (!rect) return;

      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      for (const d of drops) {
        d.y += d.speedY;

        if (d.y > h + d.length) {
          d.y = -d.length;
          d.x = Math.random() * w;
        }

        ctx.beginPath();
        ctx.strokeStyle = `rgba(100, 200, 255, ${d.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 1, d.y + d.length);
        ctx.stroke();
      }

      animationId = requestAnimationFrame(draw);
    }

    resizeCanvas();
    createDrops();
    draw();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(100,180,255,0.08) 0%, rgba(100,180,255,0.15) 100%)',
        }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
        style={{ display: 'block' }}
      />
    </div>
  );
}

// Underwater/Flood Effect - Bubbles rising with water depth
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

    interface Bubble {
      x: number;
      y: number;
      originX: number;
      r: number;
      speed: number;
      swayDir: number;
      sway: number;
    }

    const bubbles: Bubble[] = [];
    const bubbleSources = [
      0.15 + Math.random() * 0.15,
      0.45 + Math.random() * 0.2,
      0.75 + Math.random() * 0.15,
    ];

    function resizeCanvas() {
      if (!canvas) return;
      const rect = getElementSize(canvas.parentElement);
      if (!rect) return;

      const ratio = window.devicePixelRatio || 1;
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx?.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function initBubbles() {
      if (!canvas) return;
      bubbles.length = 0;
      const rect = getElementSize(canvas.parentElement);
      if (!rect) return;

      bubbleSources.forEach(sourceX => {
        const count = 3 + Math.floor(Math.random() * 2);
        for (let i = 0; i < count; i++) {
          const originX = rect.width * sourceX + (Math.random() - 0.5) * 20;
          bubbles.push({
            x: originX,
            y: rect.height * 0.6 + Math.random() * (rect.height * 0.4),
            originX,
            r: 1.5 + Math.random() * 2,
            speed: 12 + Math.random() * 18,
            swayDir: Math.random() > 0.5 ? -1 : 1,
            sway: 0,
          });
        }
      });
    }

    function draw() {
      if (!canvas || !ctx) return;
      const rect = getElementSize(canvas.parentElement);
      if (!rect) return;

      const w = rect.width;
      const h = rect.height;

      const waterLevel = h * 0.6;

      ctx.clearRect(0, 0, w, h);

      const gradient = ctx.createLinearGradient(0, waterLevel, 0, h);
      gradient.addColorStop(0, 'rgba(88, 28, 135, 0.12)');
      gradient.addColorStop(0.5, 'rgba(88, 28, 135, 0.2)');
      gradient.addColorStop(1, 'rgba(59, 7, 100, 0.3)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, waterLevel, w, h - waterLevel);

      bubbles.forEach(b => {
        b.sway = Math.sin(time * 2 + b.x * 0.1) * 10 * b.swayDir;
        b.y -= b.speed * timeStep;

        if (b.y < waterLevel - b.r) {
          b.y = h + b.r + Math.random() * 20;
          b.x = b.originX + (Math.random() - 0.5) * 15;
        }

        if (b.y > waterLevel) {
          ctx.beginPath();
          ctx.fillStyle = 'rgba(180, 160, 220, 0.5)';
          ctx.arc(b.x + b.sway, b.y, b.r, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.fillStyle = 'rgba(220, 200, 255, 0.6)';
          ctx.arc(b.x + b.sway - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.3, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      const waveConfigs = [
        { amplitude: 4, frequency: 0.04, speed: 1.8, phase: 0, opacity: 0.5, offset: 0 },
        { amplitude: 3, frequency: 0.06, speed: 2.2, phase: 2, opacity: 0.4, offset: 3 },
        { amplitude: 2.5, frequency: 0.08, speed: 1.5, phase: 4.5, opacity: 0.3, offset: 6 },
      ];

      waveConfigs.forEach(wave => {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(180, 160, 220, ${wave.opacity})`;
        ctx.lineWidth = 1.5;

        for (let x = 0; x <= w; x += 3) {
          const y = waterLevel + wave.offset
            + Math.sin(x * wave.frequency + time * wave.speed + wave.phase) * wave.amplitude
            + Math.sin(x * wave.frequency * 1.7 + time * wave.speed * 0.8) * (wave.amplitude * 0.4);

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      time += timeStep;
      animationId = requestAnimationFrame(draw);
    }

    resizeCanvas();
    initBubbles();
    draw();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
        style={{ display: 'block' }}
      />
    </div>
  );
}

// VerdictEffect wrapper - renders the appropriate effect based on verdict
function VerdictEffect({ effect }: { effect: string }) {
  switch (effect) {
    case 'storm':
      return <StormEffect />;
    case 'smoke':
      return <SmokeEffect />;
    case 'spark':
      return <SparkEffect />;
    case 'glow':
      return <GlowEffect />;
    case 'frost':
      return <FrostEffect />;
    case 'rain':
      return <RainEffect />;
    case 'flood':
      return <FloodEffect />;
    default:
      return null;
  }
}

// ============================================================
// END ANIMATED EFFECTS
// ============================================================

// Helper to encode result for shareable URL
const VERDICTS = ['OVERKILL_SEVERE', 'OVERKILL', 'SLIGHT_OVERKILL', 'BALANCED', 'SLIGHT_UNDERKILL', 'UNDERKILL', 'UNDERKILL_SEVERE'];

function encodeShareableId(scoreApp: number, scoreInfra: number, verdict: string, phraseIndex: number, locale: string): string {
  const verdictIndex = VERDICTS.indexOf(verdict);
  return `${scoreApp}-${scoreInfra}-${verdictIndex}-${phraseIndex}-${locale}`;
}

// CTA configuration based on verdict
type CTAConfig = {
  freelance: { show: boolean; title: string; subtitle: string; emphasis: boolean };
  kaliaops: { show: boolean; title: string; subtitle: string; emphasis: boolean };
};

const CTA_CONFIG: Record<string, CTAConfig> = {
  OVERKILL_SEVERE: {
    freelance: { show: true, title: 'Optimisation urgente', subtitle: 'Réduire les coûts et la complexité', emphasis: true },
    kaliaops: { show: false, title: '', subtitle: '', emphasis: false },
  },
  OVERKILL: {
    freelance: { show: true, title: 'Optimisation infra', subtitle: 'Simplifier et réduire les coûts', emphasis: true },
    kaliaops: { show: false, title: '', subtitle: '', emphasis: false },
  },
  SLIGHT_OVERKILL: {
    freelance: { show: true, title: 'Review architecture', subtitle: 'Identifier les optimisations possibles', emphasis: false },
    kaliaops: { show: false, title: '', subtitle: '', emphasis: false },
  },
  BALANCED: {
    freelance: { show: true, title: 'Expert Infra', subtitle: 'Conseil et maintenance', emphasis: false },
    kaliaops: { show: true, title: 'KaliaOps', subtitle: 'ITSM & Documentation', emphasis: false },
  },
  SLIGHT_UNDERKILL: {
    freelance: { show: true, title: 'Structuration infra', subtitle: 'Mettre en place les bonnes pratiques', emphasis: false },
    kaliaops: { show: true, title: 'KaliaOps', subtitle: 'Organiser vos process', emphasis: false },
  },
  UNDERKILL: {
    freelance: { show: true, title: 'Mise à niveau', subtitle: 'Structurer votre infrastructure', emphasis: true },
    kaliaops: { show: true, title: 'KaliaOps', subtitle: 'Documentation & process', emphasis: false },
  },
  UNDERKILL_SEVERE: {
    freelance: { show: true, title: 'Intervention urgente', subtitle: 'Sécuriser votre infrastructure', emphasis: true },
    kaliaops: { show: true, title: 'KaliaOps', subtitle: 'Structurer vos opérations', emphasis: true },
  },
};

const VERDICT_CONFIG: Record<string, {
  emoji: string;
  color: string;
  bgColor: string;
  label: string;
  effect: string;
  gradientFrom: string;
  gradientTo: string;
  phrases: string[];
}> = {
  OVERKILL_SEVERE: {
    emoji: '💀',
    color: 'text-red-500',
    bgColor: 'bg-red-500',
    label: 'OVERKILL SÉVÈRE',
    effect: 'storm',
    gradientFrom: '#dc2626',
    gradientTo: '#7f1d1d',
    phrases: [
      "Tu as déployé la Death Star pour chauffer ton café. ☕",
      "NASA t'a appelé, ils veulent récupérer leur infrastructure.",
      "Ton cluster Kubernetes pleure la nuit.",
      "Tu paies plus en cloud qu'en loyer, avoue.",
      "Même ton blog a un load balancer multi-région.",
      "Tes microservices ont des microservices.",
      "Tu as inventé l'over-engineering as a service.",
      "Ton Terraform a plus de lignes que ton app.",
      "Tu fais du GitOps pour ta liste de courses.",
      "Amazon t'envoie des cartes de remerciement.",
    ],
  },
  OVERKILL: {
    emoji: '🔥',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500',
    label: 'OVERKILL',
    effect: 'smoke',
    gradientFrom: '#f97316',
    gradientTo: '#9a3412',
    phrases: [
      "C'est beau, mais t'en fais peut-être un peu trop.",
      "Ton infra pourrait gérer 10x ta charge. Ou 100x.",
      "Tu as prévu la montée en charge... de 2045.",
      "Le CTO de Netflix serait impressionné.",
      "Tes factures AWS font pleurer ton comptable.",
      "Tu pourrais héberger Twitter dessus. Littéralement.",
      "Ta stack a plus de composants que d'utilisateurs.",
      "Prometheus surveille Prometheus qui surveille Prometheus.",
      "Tu fais du blue-green deployment pour changer un bouton.",
      "Kubernetes pour 3 pods, c'est... un choix.",
    ],
  },
  SLIGHT_OVERKILL: {
    emoji: '⚡',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500',
    label: 'OVERKILL LÉGER',
    effect: 'spark',
    gradientFrom: '#eab308',
    gradientTo: '#a16207',
    phrases: [
      "Un poil trop, mais ça reste raisonnable.",
      "Tu anticipes bien, peut-être un peu trop.",
      "Ta stack est prête pour une croissance... optimiste.",
      "Tu pourrais simplifier 2-3 trucs, mais bon.",
      "C'est le luxe d'avoir de la marge, non ?",
      "Ton monitoring est plus complexe que ton app.",
      "Tu as 3 environnements pour 2 développeurs.",
      "Le CI/CD parfait pour un MVP, vraiment ?",
      "Tu fais du caching à 4 niveaux. Pour un CRUD.",
      "Helm charts pour tout, même le café.",
    ],
  },
  BALANCED: {
    emoji: '✅',
    color: 'text-green-500',
    bgColor: 'bg-green-500',
    label: 'ÉQUILIBRÉ',
    effect: 'glow',
    gradientFrom: '#22c55e',
    gradientTo: '#166534',
    phrases: [
      "Bravo ! Tu as trouvé le sweet spot parfait. 🎯",
      "L'équilibre parfait entre besoins et moyens.",
      "Ni trop, ni trop peu. Tu gères.",
      "Ton CTO peut dormir tranquille.",
      "Ta facture cloud te dit merci.",
      "KISS : Keep It Simple, Stupid. Tu maîtrises.",
      "L'infra qui scale avec le business. Chapeau.",
      "Tu fais partie des 10% qui font bien.",
      "Pragmatisme level: Expert.",
      "Tu pourrais donner des cours.",
    ],
  },
  SLIGHT_UNDERKILL: {
    emoji: '🌧️',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500',
    label: 'UNDERKILL LÉGER',
    effect: 'rain',
    gradientFrom: '#06b6d4',
    gradientTo: '#0e7490',
    phrases: [
      "Ça tient, mais un petit effort serait bienvenu.",
      "Tu pourrais automatiser 2-3 trucs quand même.",
      "Le monitoring ? C'est pour les autres ?",
      "Un backup de temps en temps, ça fait pas de mal.",
      "T'as déjà pensé au CI/CD ?",
      "Tes déploiements manuels te remercient pas.",
      "Un peu de logging ne ferait pas de mal.",
      "La dette technique s'accumule doucement...",
      "Tu vis dangereusement, mais ça passe.",
      "Il suffirait de peu pour être bien.",
    ],
  },
  UNDERKILL: {
    emoji: '❄️',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500',
    label: 'UNDERKILL',
    effect: 'frost',
    gradientFrom: '#3b82f6',
    gradientTo: '#1e40af',
    phrases: [
      "Houston, on a un problème d'infrastructure.",
      "Ton FTP vers prod mérite mieux que ça.",
      "Les backups, c'est surfait de toute façon...",
      "Tu testes en prod, avoue.",
      "YOLO deployment : ta spécialité.",
      "Ton serveur tient avec du scotch et de l'espoir.",
      "La résilience ? Connais pas.",
      "Un incident et c'est le chaos.",
      "Tu joues à la roulette russe avec ta prod.",
      "Il est temps d'investir sérieusement.",
    ],
  },
  UNDERKILL_SEVERE: {
    emoji: '🌊',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500',
    label: 'UNDERKILL SÉVÈRE',
    effect: 'flood',
    gradientFrom: '#a855f7',
    gradientTo: '#581c87',
    phrases: [
      "Miracle que ça tienne encore ! Sérieusement, investis. 💀",
      "Tu déploies en FTP le vendredi soir, pas vrai ?",
      "Ton infra date de l'ère pré-Docker.",
      "Le moindre bug et tout s'effondre.",
      "Tu pries chaque matin que ça marche encore.",
      "C'est beau cette confiance aveugle dans ton serveur.",
      "Pas de backup, pas de monitoring, pas de regret ?",
      "Tu vis sur du temps emprunté, là.",
      "Un stagiaire et un rm -rf plus tard...",
      "Ton bus factor est à 0.5.",
    ],
  },
};

// Simplified static effects for the shareable card (no canvas animations)
function CardEffect({ effect, gradientFrom, gradientTo }: { effect: string; gradientFrom: string; gradientTo: string }) {
  const baseStyle = "absolute inset-0 pointer-events-none overflow-hidden rounded-2xl";

  switch (effect) {
    case 'storm':
      return (
        <div className={baseStyle}>
          <div className="absolute inset-0 bg-gradient-to-b from-red-900/40 to-red-950/60" />
          {/* Meteor streaks with glow */}
          {[
            { left: 10, top: 5, height: 60, width: 3 },
            { left: 30, top: 15, height: 50, width: 2.5 },
            { left: 55, top: 8, height: 70, width: 3.5 },
            { left: 75, top: 20, height: 45, width: 2 },
            { left: 90, top: 10, height: 55, width: 2.5 },
          ].map((meteor, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                height: `${meteor.height}px`,
                width: `${meteor.width}px`,
                left: `${meteor.left}%`,
                top: `${meteor.top}%`,
                transform: 'rotate(35deg)',
                background: 'linear-gradient(to bottom, #fb923c, #f97316 30%, transparent)',
                boxShadow: '0 0 10px #f97316, 0 0 20px #ea580c',
              }}
            />
          ))}
          {/* Impact glow at bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1/3"
            style={{
              background: 'radial-gradient(ellipse at 50% 100%, rgba(239, 68, 68, 0.4) 0%, transparent 70%)',
            }}
          />
        </div>
      );

    case 'smoke':
      return (
        <div className={baseStyle}>
          <div className="absolute inset-0 bg-gradient-to-t from-orange-900/50 to-orange-800/10" />
          {/* Smoke clouds with better styling */}
          {[
            { x: 5, y: 0, w: 120, h: 80, opacity: 0.25 },
            { x: 25, y: 15, w: 100, h: 70, opacity: 0.3 },
            { x: 50, y: 5, w: 140, h: 90, opacity: 0.2 },
            { x: 70, y: 20, w: 110, h: 75, opacity: 0.28 },
            { x: 85, y: 8, w: 90, h: 60, opacity: 0.22 },
          ].map((cloud, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${cloud.w}px`,
                height: `${cloud.h}px`,
                left: `${cloud.x}%`,
                bottom: `${cloud.y}%`,
                background: `radial-gradient(ellipse, rgba(251, 146, 60, ${cloud.opacity}) 0%, rgba(234, 88, 12, ${cloud.opacity * 0.5}) 50%, transparent 70%)`,
                filter: 'blur(15px)',
              }}
            />
          ))}
          {/* Glow at bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1/4"
            style={{
              background: 'radial-gradient(ellipse at 50% 100%, rgba(249, 115, 22, 0.35) 0%, transparent 70%)',
            }}
          />
        </div>
      );

    case 'spark':
      return (
        <div className={baseStyle}>
          <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/10 to-yellow-900/15" />
          {/* 4 lightning bolts spread across */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M20 5 L16 30 L22 32 L14 55" stroke="#facc15" strokeWidth="0.6" fill="none" opacity="0.5" />
            <path d="M45 8 L40 35 L47 37 L38 60" stroke="#fde047" strokeWidth="0.5" fill="none" opacity="0.4" />
            <path d="M70 3 L65 28 L72 30 L63 52" stroke="#facc15" strokeWidth="0.6" fill="none" opacity="0.5" />
            <path d="M90 10 L84 38 L91 40 L82 62" stroke="#fde047" strokeWidth="0.5" fill="none" opacity="0.4" />
          </svg>
        </div>
      );

    case 'glow':
      return (
        <div className={baseStyle}>
          {/* Subtle green glow */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at 50% 50%, rgba(34,197,94,0.15) 0%, transparent 60%)',
            }}
          />
        </div>
      );

    case 'rain':
      return (
        <div className={baseStyle}>
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-600/15 to-cyan-700/30" />
          {/* Rain drops - varied positions */}
          {[
            { x: 8, y: 5, h: 20 }, { x: 15, y: 25, h: 18 }, { x: 22, y: 10, h: 22 },
            { x: 30, y: 35, h: 16 }, { x: 38, y: 15, h: 24 }, { x: 45, y: 40, h: 18 },
            { x: 52, y: 8, h: 20 }, { x: 60, y: 28, h: 22 }, { x: 68, y: 18, h: 16 },
            { x: 75, y: 42, h: 20 }, { x: 82, y: 12, h: 24 }, { x: 90, y: 32, h: 18 },
          ].map((drop, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                width: '2px',
                height: `${drop.h}px`,
                left: `${drop.x}%`,
                top: `${drop.y}%`,
                background: 'linear-gradient(to bottom, rgba(103, 232, 249, 0.8), rgba(34, 211, 238, 0.4), transparent)',
                borderRadius: '2px',
              }}
            />
          ))}
          {/* Subtle cyan glow */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at 50% 30%, rgba(34, 211, 238, 0.15) 0%, transparent 60%)',
            }}
          />
        </div>
      );

    case 'frost':
      return (
        <div className={baseStyle}>
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/15 to-blue-700/25" />
          {/* Snowflakes - varied sizes and positions */}
          {[
            { x: 8, y: 12, size: 8 }, { x: 18, y: 35, size: 6 }, { x: 28, y: 20, size: 10 },
            { x: 40, y: 45, size: 7 }, { x: 52, y: 15, size: 9 }, { x: 62, y: 55, size: 6 },
            { x: 72, y: 28, size: 8 }, { x: 82, y: 48, size: 7 }, { x: 92, y: 18, size: 5 },
            { x: 15, y: 60, size: 6 }, { x: 45, y: 8, size: 5 }, { x: 75, y: 65, size: 7 },
          ].map((flake, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${flake.size}px`,
                height: `${flake.size}px`,
                left: `${flake.x}%`,
                top: `${flake.y}%`,
                background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(191, 219, 254, 0.6))',
                boxShadow: '0 0 6px rgba(191, 219, 254, 0.8)',
              }}
            />
          ))}
          {/* Icy glow */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at 50% 50%, rgba(147, 197, 253, 0.2) 0%, transparent 60%)',
            }}
          />
        </div>
      );

    case 'flood':
      return (
        <div className={baseStyle}>
          {/* Water gradient filling bottom 40% (lowered by ~7px) */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: '40%',
              background: 'linear-gradient(to bottom, rgba(147, 51, 234, 0.2) 0%, rgba(88, 28, 135, 0.4) 50%, rgba(59, 7, 100, 0.6) 100%)',
            }}
          />
          {/* Wave SVG at water surface */}
          <svg className="absolute w-full" style={{ top: '60%', height: '20px' }} viewBox="0 0 400 20" preserveAspectRatio="none">
            <path d="M0 10 Q 25 5, 50 10 T 100 10 T 150 10 T 200 10 T 250 10 T 300 10 T 350 10 T 400 10"
                  stroke="rgba(192, 132, 252, 0.5)" strokeWidth="2" fill="none" />
            <path d="M0 14 Q 30 8, 60 14 T 120 14 T 180 14 T 240 14 T 300 14 T 360 14 T 400 14"
                  stroke="rgba(168, 85, 247, 0.4)" strokeWidth="1.5" fill="none" />
            <path d="M0 18 Q 40 12, 80 18 T 160 18 T 240 18 T 320 18 T 400 18"
                  stroke="rgba(139, 92, 246, 0.3)" strokeWidth="1" fill="none" />
          </svg>
          {/* Bubbles - grouped in 3 sources like homepage (adjusted for 40% water) */}
          {[
            { x: 15, y: 30 }, { x: 18, y: 22 }, { x: 12, y: 15 },
            { x: 50, y: 28 }, { x: 53, y: 20 }, { x: 48, y: 12 },
            { x: 82, y: 26 }, { x: 85, y: 18 }, { x: 80, y: 10 },
          ].map((bubble, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${8 + (i % 3) * 4}px`,
                height: `${8 + (i % 3) * 4}px`,
                left: `${bubble.x}%`,
                bottom: `${bubble.y}%`,
                background: 'radial-gradient(circle at 30% 30%, rgba(216, 180, 254, 0.7), rgba(147, 51, 234, 0.3))',
                boxShadow: '0 0 4px rgba(192, 132, 252, 0.5)',
              }}
            />
          ))}
          {/* Subtle purple glow at bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1/4"
            style={{
              background: 'radial-gradient(ellipse at 50% 100%, rgba(147, 51, 234, 0.3) 0%, transparent 70%)',
            }}
          />
        </div>
      );

    default:
      return null;
  }
}

// Shareable Card Component - Fixed positioning for consistent layout
function ShareableCard({
  result,
  config,
  cardRef,
  phrase,
  isRoastMode,
  onEmojiTripleTap,
  translations,
}: {
  result: ScoreResult;
  config: typeof VERDICT_CONFIG[string];
  cardRef: React.RefObject<HTMLDivElement>;
  phrase: string;
  isRoastMode?: boolean;
  onEmojiTripleTap?: () => void;
  translations: {
    label: string;
    gap: string;
    pts: string;
    takeTest: string;
  };
}) {
  // Triple-tap detection for easter egg
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleEmojiClick = () => {
    tapCountRef.current += 1;

    if (tapTimerRef.current) {
      clearTimeout(tapTimerRef.current);
    }

    if (tapCountRef.current >= 3) {
      tapCountRef.current = 0;
      onEmojiTripleTap?.();
    } else {
      tapTimerRef.current = setTimeout(() => {
        tapCountRef.current = 0;
      }, 500); // Reset after 500ms
    }
  };

  return (
    <div
      ref={cardRef}
      className="relative w-full max-w-lg aspect-[1200/630] rounded-2xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, #1e293b 0%, #0f172a 100%)`,
      }}
    >
      {/* Animated effect layer */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <VerdictEffect effect={config.effect} />
      </div>

      {/* Content - all positions are absolute for consistency */}
      <div className="relative z-10 h-full w-full">
        {/* Logo - fixed top-left */}
        <div className="absolute top-4 left-4 flex items-center gap-2 text-white/80">
          <Zap className="w-5 h-5 text-orange-500" />
          <span className="font-bold text-sm">StackOverkill.io</span>
        </div>

        {/* Verdict - fixed position from top */}
        <div className="absolute top-[8%] left-0 right-0 flex flex-col items-center">
          <button
            type="button"
            onClick={handleEmojiClick}
            className="text-4xl mb-2 hover:scale-110 active:scale-95 transition-transform select-none cursor-default"
          >
            {config.emoji}
          </button>
          <div
            className={`inline-flex items-center justify-center px-6 py-2 rounded-xl text-white font-extrabold text-lg leading-none whitespace-nowrap ${config.bgColor}`}
            style={{ minHeight: '40px' }}
          >
            {translations.label}
          </div>
        </div>

        {/* Phrase - fixed height zone in the middle (centered between badge and scores) */}
        <div className="absolute top-[42%] left-0 right-0 h-[18%] flex items-center justify-center px-4">
          {phrase && (
            <p className={`text-center text-xs line-clamp-2 transition-colors duration-300 ${isRoastMode ? 'text-orange-400' : 'text-slate-300'}`} style={{ maxWidth: '90%' }}>
              {isRoastMode && <span className="mr-1">🌶️</span>}
              {phrase}
              {isRoastMode && <span className="ml-1">🌶️</span>}
            </p>
          )}
        </div>

        {/* Scores - fixed position from bottom */}
        <div className="absolute bottom-[18%] left-0 right-0 flex justify-center gap-8 text-white">
          <div className="text-center w-16">
            <p className="text-xs text-slate-400 mb-1">APP</p>
            <p className="text-3xl font-bold text-primary-400">{result.scoreApp}</p>
          </div>
          <div className="text-center w-8">
            <p className="text-xs text-slate-400 mb-1 uppercase">vs</p>
            <p className="text-lg text-slate-500">⚡</p>
          </div>
          <div className="text-center w-16">
            <p className="text-xs text-slate-400 mb-1">INFRA</p>
            <p className="text-3xl font-bold text-accent">{result.scoreInfra}</p>
          </div>
        </div>

        {/* Gap - fixed position */}
        <div className="absolute bottom-[10%] left-0 right-0 text-center text-sm text-slate-400">
          {translations.gap} <span className={`font-bold ${config.color}`}>{result.gap > 0 ? '+' : ''}{result.gap} {translations.pts}</span>
        </div>

        {/* CTA - fixed bottom-right */}
        <div className="absolute bottom-4 right-4 text-xs text-slate-500">
          {translations.takeTest} stackoverkill.io
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  const router = useRouter();
  const { t, getVerdictPhrases, locale, isHydrated } = useTranslations();
  const cardRef = useRef<HTMLDivElement>(null);
  const { appAnswers, infraAnswers, result, setResult, reset, getCompleteInput, leaderboardEntry, setLeaderboardEntry } = useScoreStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [randomPhrase, setRandomPhrase] = useState<string>('');
  const [phraseIndex, setPhraseIndex] = useState<number>(0);
  const [showHelp, setShowHelp] = useState(false);
  const [leaderboardOptIn, setLeaderboardOptIn] = useState(false);
  const [leaderboardSubmitting, setLeaderboardSubmitting] = useState(false);
  const [leaderboardJustSubmitted, setLeaderboardJustSubmitted] = useState(false);
  const [leaderboardPercentile, setLeaderboardPercentile] = useState<number | null>(null);
  const [percentile, setPercentile] = useState<number | null>(null);
  const [percentileTotal, setPercentileTotal] = useState<number>(0);
  const [ogImageUploaded, setOgImageUploaded] = useState(false);
  const [isRoastMode, setIsRoastMode] = useState(false);
  const [roastText, setRoastText] = useState<string>('');
  const [badgeCopied, setBadgeCopied] = useState(false);

  // Select contextual phrase when result is available
  useEffect(() => {
    if (result && !loading && isHydrated) {
      // Get translated phrases for this verdict
      const translatedPhrases = getVerdictPhrases(result.verdict);

      if (translatedPhrases.length > 0) {
        // On limite à 0-2 car l'OG image n'a que 3 phrases par verdict
        const randomIndex = Math.floor(Math.random() * Math.min(3, translatedPhrases.length));
        setRandomPhrase(translatedPhrases[randomIndex]);
        setPhraseIndex(randomIndex);
      }
    }
  }, [result, loading, isHydrated, locale, getVerdictPhrases]);

  // Auto-upload OG image when result and phrase are ready (only if not already stored)
  useEffect(() => {
    const uploadOgImage = async () => {
      // Wait for all conditions to be met (including locale hydration)
      if (!result || !randomPhrase || loading || ogImageUploaded || !cardRef.current || !isHydrated) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const shareableId = encodeShareableId(result.scoreApp, result.scoreInfra, result.verdict, phraseIndex, locale);

      try {
        // First, check if image already exists (save user resources)
        const existsResponse = await fetch(`${apiUrl}/api/v1/og/exists/${shareableId}`);
        if (existsResponse.ok) {
          const { exists } = await existsResponse.json();
          if (exists) {
            setOgImageUploaded(true);
            return;
          }
        }

        // Image doesn't exist - wait for animation to settle for better frame capture
        await new Promise((resolve) => setTimeout(resolve, 400));

        if (!cardRef.current) return;

        // Capture the DOM
        const element = cardRef.current;
        const dataUrl = await htmlToImage.toPng(element, {
          pixelRatio: 2,
          skipFonts: true,
          canvasWidth: element.scrollWidth * 2,
          canvasHeight: element.scrollHeight * 2,
          width: element.scrollWidth,
          height: element.scrollHeight,
        });

        // Upload to backend
        const response = await fetch(`${apiUrl}/api/v1/og/upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: shareableId,
            image: dataUrl,
          }),
        });

        if (response.ok) {
          setOgImageUploaded(true);
        }
      } catch (err) {
        console.error('Error uploading OG image:', err);
      }
    };

    uploadOgImage();
  }, [result, randomPhrase, loading, ogImageUploaded, phraseIndex, locale, isHydrated]);

  useEffect(() => {
    const calculateScore = async () => {
      const input = getCompleteInput();

      if (!input) {
        router.push('/test');
        return;
      }

      // If we already have a result, use it
      if (result) {
        setLoading(false);
        return;
      }

      try {
        // Add a minimum delay for dramatic effect
        const minDelay = new Promise((resolve) => setTimeout(resolve, 2000));

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const fetchPromise = fetch(`${apiUrl}/api/v1/score/calculate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        });

        const [response] = await Promise.all([fetchPromise, minDelay]);

        if (!response.ok) {
          throw new Error('Erreur lors du calcul');
        }

        const data: ScoreResult = await response.json();
        setResult(data);
      } catch (err) {
        console.error('Score calculation error:', err);
        setError('Impossible de calculer le score. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    calculateScore();
  }, [getCompleteInput, result, router, setResult]);

  // Fetch percentile when result is available
  useEffect(() => {
    if (!result || loading) return;

    const fetchPercentile = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const gap = result.scoreInfra - result.scoreApp;
        const response = await fetch(`${apiUrl}/api/v1/leaderboard/percentile?gap=${gap}`);
        if (response.ok) {
          const data = await response.json();
          setPercentile(data.percentile);
          setPercentileTotal(data.total);
        }
      } catch (err) {
        console.error('Percentile fetch error:', err);
      }
    };

    fetchPercentile();
  }, [result, loading]);

  // Update roast text when mode changes
  useEffect(() => {
    if (result && isRoastMode) {
      setRoastText(getVerdictText(result.verdict, true));
    }
  }, [result, isRoastMode]);

  const handleReset = () => {
    reset();
    router.push('/');
  };

  const handleDownloadImage = async () => {
    if (!cardRef.current || isGenerating) return;

    setIsGenerating(true);
    try {
      // Force capture full element including any overflow
      const element = cardRef.current;
      const dataUrl = await htmlToImage.toPng(element, {
        pixelRatio: 2,
        skipFonts: true,
        canvasWidth: element.scrollWidth * 2,
        canvasHeight: element.scrollHeight * 2,
        width: element.scrollWidth,
        height: element.scrollHeight,
      });

      const link = document.createElement('a');
      link.download = `stackoverkill-${result?.verdict || 'result'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating image:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = () => {
    if (!result) return;

    // Generate shareable URL with encoded result
    const shareableId = encodeShareableId(result.scoreApp, result.scoreInfra, result.verdict, phraseIndex, locale);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://stackoverkill.io';
    const shareUrl = `${baseUrl}/r/${shareableId}?utm_source=linkedin&utm_medium=social&utm_campaign=share`;

    // Open LinkedIn share with the shareable URL (which has dynamic OG image)
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=700');
  };

  const handleShareTwitter = () => {
    if (!result) return;

    // Generate shareable URL with encoded result
    const shareableId = encodeShareableId(result.scoreApp, result.scoreInfra, result.verdict, phraseIndex, locale);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://stackoverkill.io';
    const shareUrl = `${baseUrl}/r/${shareableId}?utm_source=twitter&utm_medium=social&utm_campaign=share`;

    // Generate tweet text based on verdict
    const gap = result.scoreInfra - result.scoreApp;
    const config = VERDICT_CONFIG[result.verdict];
    let tweetText = '';

    if (gap > 30) {
      tweetText = `${config?.emoji || '💀'} Mon infra est ${gap > 50 ? 'COMPLÈTEMENT' : ''} OVERKILL (+${gap}) 🔥\n\nEt toi, ta stack est adaptée à tes besoins ?\n\n`;
    } else if (gap < -30) {
      tweetText = `${config?.emoji || '🌊'} Mon infra est ${gap < -50 ? 'DANGEREUSEMENT' : ''} sous-dimensionnée (${gap}) ❄️\n\nEt toi, ta stack tient la route ?\n\n`;
    } else {
      tweetText = `${config?.emoji || '✅'} J'ai trouvé le sweet spot parfait pour mon infra ! 🎯\n\nEt toi, ta stack est bien dimensionnée ?\n\n`;
    }

    // Open Twitter/X share
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  // Check if user already submitted this exact score to leaderboard
  const hasAlreadySubmitted = leaderboardEntry && result &&
    leaderboardEntry.scoreApp === result.scoreApp &&
    leaderboardEntry.scoreInfra === result.scoreInfra;

  const handleLeaderboardSubmit = async () => {
    if (!result || leaderboardSubmitting || hasAlreadySubmitted) return;

    setLeaderboardSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const response = await fetch(`${apiUrl}/api/v1/leaderboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scoreApp: result.scoreApp,
          scoreInfra: result.scoreInfra,
          verdict: result.verdict,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Store in Zustand (persisted to localStorage)
        setLeaderboardEntry({
          nickname: data.entry.nickname,
          appName: data.entry.appName,
          scoreApp: result.scoreApp,
          scoreInfra: result.scoreInfra,
        });
        setLeaderboardJustSubmitted(true);
        // Store percentile for display
        if (data.percentile !== undefined) {
          setLeaderboardPercentile(data.percentile);
        }
      }
    } catch (err) {
      console.error('Leaderboard submission error:', err);
    } finally {
      setLeaderboardSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center">
          <div className="text-6xl mb-6 animate-bounce">🔮</div>
          <h1 className="text-2xl font-bold text-white mb-4 font-display">
            {t('result.loading.title')}
          </h1>
          <p className="text-slate-400">{t('result.loading.subtitle')}</p>
          <div className="flex justify-center gap-2 mt-6">
            <span className="w-3 h-3 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
            <span className="w-3 h-3 bg-accent rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
            <span className="w-3 h-3 bg-accent rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center max-w-md">
          <div className="text-6xl mb-6">😵</div>
          <h1 className="text-2xl font-bold text-white mb-4 font-display">
            {t('result.error.title')}
          </h1>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-accent hover:bg-accent/90 text-white font-medium rounded-xl transition-colors"
          >
            {t('result.error.retry')}
          </button>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  const config = VERDICT_CONFIG[result.verdict] || VERDICT_CONFIG.BALANCED;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* CSS animations for effects */}
      <style jsx global>{`
        @keyframes blob-float-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(15px, -20px) scale(1.05); }
          50% { transform: translate(-10px, 10px) scale(0.95); }
          75% { transform: translate(20px, 15px) scale(1.02); }
        }
        @keyframes blob-float-2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-25px, 15px) rotate(5deg); }
          66% { transform: translate(20px, -10px) rotate(-3deg); }
        }
        @keyframes blob-float-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -25px) scale(1.1); }
        }
        @keyframes blob-float-4 {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(-15px, -15px); }
          40% { transform: translate(10px, -25px); }
          60% { transform: translate(25px, 10px); }
          80% { transform: translate(-20px, 20px); }
        }
        .animate-blob-1 { animation: blob-float-1 12s ease-in-out infinite; }
        .animate-blob-2 { animation: blob-float-2 15s ease-in-out infinite; }
        .animate-blob-3 { animation: blob-float-3 10s ease-in-out infinite; }
        .animate-blob-4 { animation: blob-float-4 18s ease-in-out infinite; }
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
        @keyframes slide-in-right {
          0% { opacity: 0; transform: translateX(20px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in { animation: slide-in-right 0.3s ease-out forwards; }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
      `}</style>

      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Blob 1 */}
        <div className="absolute top-1/4 -left-20 animate-blob-1">
          <div className="w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        </div>
        {/* Blob 2 */}
        <div className="absolute bottom-1/4 -right-20 animate-blob-2">
          <div className="w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
        </div>
        {/* Blob 3 - Central */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-blob-3">
          <div className="w-[600px] h-[600px] bg-gradient-radial from-accent/5 to-transparent rounded-full" />
        </div>
        {/* Blob 4 */}
        <div className="absolute top-[60%] left-[10%] animate-blob-4">
          <div className="w-72 h-72 bg-red-500/10 rounded-full blur-3xl" />
        </div>
        {/* Blob 5 */}
        <div className="absolute top-[20%] right-[15%] animate-blob-2">
          <div className="w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
        </div>
        {/* Blob 6 */}
        <div className="absolute bottom-[30%] left-[40%] animate-blob-1">
          <div className="w-80 h-80 bg-purple-500/8 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 w-full px-4 py-3 sm:py-4 border-b border-white/10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t('common.back')}</span>
          </Link>
          <div className="flex items-center gap-2 text-slate-400">
            <Zap className="w-4 h-4 text-accent" />
            <span className="font-medium text-sm sm:text-base">{t('common.brand')}</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col justify-center px-4 py-4 sm:py-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto w-full">
          {/* Shareable Card - wrapper for centering with mobile scaling */}
          {/* On mobile: card is scaled to 70% but keeps original dimensions for OG capture */}
          {/* translateX interpolates from 0 at 360px to ~10px at 412px */}
          <div className="flex justify-center">
            <div className="w-full max-w-lg">
              <div
                className="origin-top-left sm:origin-top transform scale-[0.7] sm:scale-100 w-[143%] sm:w-full sm:translate-x-0"
                style={{ '--tw-translate-x': 'clamp(0px, calc((100vw - 360px) * 0.19), 10px)' } as React.CSSProperties}
              >
                <ShareableCard
                  result={result}
                  config={config}
                  cardRef={cardRef}
                  phrase={isRoastMode ? roastText : randomPhrase}
                  isRoastMode={isRoastMode}
                  onEmojiTripleTap={() => {
                    const newMode = !isRoastMode;
                    setIsRoastMode(newMode);
                    if (newMode) {
                      // Get a new roast text when activating
                      setRoastText(getVerdictText(result.verdict, true));
                    }
                  }}
                  translations={{
                    label: t(`result.verdicts.${result.verdict}.label` as any),
                    gap: t('result.card.gap'),
                    pts: t('result.card.pts'),
                    takeTest: t('result.share.takeTest'),
                  }}
                />
              </div>
            </div>
          </div>

          {/* Share buttons - Row 1 */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-4 sm:mt-6">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#0A66C2] hover:bg-[#004182] text-white text-xs sm:text-sm font-medium rounded-lg transition-colors"
            >
              <Linkedin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">LinkedIn</span>
            </button>
            <button
              onClick={handleShareTwitter}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-black hover:bg-zinc-800 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors border border-zinc-700"
            >
              <Twitter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">X</span>
            </button>
            <button
              onClick={() => {
                if (!result) return;
                const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://stackoverkill.io';
                const badgeUrl = `${baseUrl}/api/v1/badge?s=${result.scoreApp}&i=${result.scoreInfra}&v=${result.verdict}`;
                const shareableId = encodeShareableId(result.scoreApp, result.scoreInfra, result.verdict, phraseIndex, locale);
                const linkUrl = `${baseUrl}/r/${shareableId}`;
                const markdown = `[![StackOverkill](${badgeUrl})](${linkUrl})`;
                navigator.clipboard.writeText(markdown);
                setBadgeCopied(true);
                setTimeout(() => setBadgeCopied(false), 2000);
              }}
              className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                badgeCopied
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-purple-600 hover:bg-purple-500 text-white'
              }`}
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="hidden sm:inline">{badgeCopied ? t('result.actions.copied') : 'GitHub'}</span>
              {badgeCopied && <Check className="w-3.5 h-3.5 sm:hidden" />}
            </button>
          </div>

          {/* Local actions - Row 2 */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-2">
            <button
              onClick={handleDownloadImage}
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-2 py-1.5 sm:py-2 text-slate-400 hover:text-white text-xs sm:text-sm transition-colors disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {t('result.actions.download')}
            </button>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-2 py-1.5 sm:py-2 text-slate-400 hover:text-white text-xs sm:text-sm transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {t('result.actions.redo')}
            </button>
          </div>

          {/* Leaderboard opt-in */}
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/10">
            {/* Percentile */}
            {percentile !== null && percentileTotal > 0 && (
              <>
                <div className="flex items-center justify-center gap-2 text-sm text-slate-300 animate-fade-in">
                  <span className="text-lg">🏆</span>
                  {result.scoreInfra - result.scoreApp > 0 ? (
                    <span>{t('result.percentile.moreOverkill').replace('{percent}', String(percentile)).replace('{total}', String(percentileTotal))}</span>
                  ) : result.scoreInfra - result.scoreApp < 0 ? (
                    <span>{t('result.percentile.moreUnderkill').replace('{percent}', String(100 - percentile)).replace('{total}', String(percentileTotal))}</span>
                  ) : (
                    <span>{t('result.percentile.moreBalanced').replace('{percent}', String(Math.max(percentile, 100 - percentile))).replace('{total}', String(percentileTotal))}</span>
                  )}
                </div>
                <div className="border-t border-white/10 my-3" />
              </>
            )}
            {hasAlreadySubmitted && leaderboardEntry ? (
              <Link
                href={`/leaderboard?highlight=${encodeURIComponent(leaderboardEntry.nickname)}`}
                className="flex items-center gap-3 text-green-400 hover:bg-white/5 -m-2 p-2 rounded-lg transition-colors"
              >
                <Check className="w-5 h-5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{leaderboardJustSubmitted ? t('result.leaderboard.justAdded') : t('result.leaderboard.alreadyIn')}</p>
                  <p className="text-xs text-slate-400">
                    {t('result.leaderboard.youAre')} <span className="text-white font-medium">{leaderboardEntry.nickname}</span> {t('result.leaderboard.with')} <span className="text-white">{leaderboardEntry.appName}</span>
                  </p>
                </div>
                <span className="text-xs text-slate-500">{t('result.leaderboard.view')}</span>
              </Link>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setLeaderboardOptIn(!leaderboardOptIn)}
                  className={`flex items-center gap-2 flex-1 p-2 -m-2 rounded-lg transition-all ${
                    leaderboardOptIn
                      ? 'bg-accent/10'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <div className="text-left">
                    <p className="text-sm text-white">{t('result.leaderboard.participate')}</p>
                    <p className="text-xs text-slate-500">{t('result.leaderboard.anonymous')}</p>
                  </div>
                </button>
                {leaderboardOptIn && (
                  <button
                    onClick={handleLeaderboardSubmit}
                    disabled={leaderboardSubmitting}
                    className="px-4 py-2 bg-accent hover:bg-accent/90 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 animate-slide-in"
                  >
                    {leaderboardSubmitting ? t('result.leaderboard.sending') : t('result.leaderboard.send')}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Help toggle */}
          <div className="mt-4 sm:mt-6 relative">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="mx-auto flex items-center gap-2 text-xs sm:text-sm text-slate-500 hover:text-slate-300 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {t('result.actions.needHelp')}
              <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${showHelp ? 'rotate-180' : ''}`} />
            </button>

            {/* CTAs - revealed on click, positioned absolute to not shift content */}
            {(() => {
              const ctaConfig = CTA_CONFIG[result.verdict] || CTA_CONFIG.BALANCED;
              const showBoth = ctaConfig.freelance.show && ctaConfig.kaliaops.show;
              return (
                <div
                  className={`absolute left-0 right-0 top-full mt-3 grid ${showBoth ? 'grid-cols-2' : 'grid-cols-1 max-w-xs mx-auto'} gap-3 z-20 transition-all duration-200 ease-out ${
                    showHelp
                      ? 'opacity-100 translate-y-0 pointer-events-auto'
                      : 'opacity-0 -translate-y-2 pointer-events-none'
                  }`}
                >
                  {ctaConfig.freelance.show && (
                    <a
                      href="https://www.rwx-g.fr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 p-3 bg-slate-800/95 backdrop-blur-sm rounded-xl border transition-all shadow-lg ${
                        ctaConfig.freelance.emphasis
                          ? 'border-accent/50 hover:border-accent hover:bg-slate-700/95 ring-1 ring-accent/20'
                          : 'border-white/10 hover:border-accent/50 hover:bg-slate-700/95'
                      }`}
                    >
                      <span className="text-lg">🛠️</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{ctaConfig.freelance.title}</p>
                        <p className="text-xs text-slate-400 truncate">{ctaConfig.freelance.subtitle}</p>
                      </div>
                      <ExternalLink className="w-3 h-3 text-slate-500 flex-shrink-0" />
                    </a>
                  )}
                  {ctaConfig.kaliaops.show && (
                    <a
                      href="https://kaliaops.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 p-3 bg-slate-800/95 backdrop-blur-sm rounded-xl border transition-all shadow-lg ${
                        ctaConfig.kaliaops.emphasis
                          ? 'border-accent/50 hover:border-accent hover:bg-slate-700/95 ring-1 ring-accent/20'
                          : 'border-white/10 hover:border-accent/50 hover:bg-slate-700/95'
                      }`}
                    >
                      <span className="text-lg">📊</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{ctaConfig.kaliaops.title}</p>
                        <p className="text-xs text-slate-400 truncate">{ctaConfig.kaliaops.subtitle}</p>
                      </div>
                      <ExternalLink className="w-3 h-3 text-slate-500 flex-shrink-0" />
                    </a>
                  )}
                </div>
              );
            })()}
          </div>
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
