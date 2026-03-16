'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Zap,
  Clock,
  Shield,
  Share2,
  ChevronDown,
  Flame,
  Snowflake,
  ArrowRight,
  CheckCircle,
  Skull,
  CloudRain,
  Waves,
} from 'lucide-react';
import { useScoreStore } from '@/stores/scoreStore';
import { useTranslations } from '@/i18n/useTranslations';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

const VERDICT_CONFIGS = [
  {
    key: 'severeOverkill',
    color: 'text-red-500',
    bgColor: 'bg-red-500',
    bg: 'bg-red-500/10',
    icon: Skull,
    effect: 'storm',
    glowColor: 'shadow-red-500/50',
    progress: 100,
  },
  {
    key: 'overkill',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500',
    bg: 'bg-orange-500/10',
    icon: Flame,
    effect: 'smoke',
    glowColor: 'shadow-orange-500/50',
    progress: 85,
  },
  {
    key: 'lightOverkill',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500',
    bg: 'bg-yellow-500/10',
    icon: Zap,
    effect: 'spark',
    glowColor: 'shadow-yellow-500/50',
    progress: 70,
  },
  {
    key: 'balanced',
    color: 'text-green-500',
    bgColor: 'bg-green-500',
    bg: 'bg-green-500/10',
    icon: CheckCircle,
    effect: 'glow',
    glowColor: 'shadow-green-500/50',
    progress: 50,
  },
  {
    key: 'lightUnderkill',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500',
    bg: 'bg-cyan-500/10',
    icon: CloudRain,
    effect: 'rain',
    glowColor: 'shadow-cyan-500/50',
    progress: 35,
  },
  {
    key: 'underkill',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500',
    bg: 'bg-blue-500/10',
    icon: Snowflake,
    effect: 'frost',
    glowColor: 'shadow-blue-500/50',
    progress: 20,
  },
  {
    key: 'severeUnderkill',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500',
    bg: 'bg-purple-500/10',
    icon: Waves,
    effect: 'flood',
    glowColor: 'shadow-purple-500/50',
    progress: 5,
  },
] as const;

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
    // Dark red body, orange-red fill, red-orange glow colors
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
          // Gravity
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

          // Glow
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
      // Create rocks (-20% size)
      const reducedSize = size * 0.8;
      for (let i = 0; i < reducedSize; i++) {
        meteors.push(createRock(x, y, reducedSize));
      }
      // Light flare (-20% size)
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
        x: Math.random() * w + w * 0.25,
        y: Math.random() * -h * 0.5,
        rotation: Math.random() * Math.PI * 2,
        vPhi: Math.random() * 0.4 - 0.2 + Math.PI * 0.75 + 0.611, // +35° inclination
        vLength,
        vRotate: Math.random() * 0.1 - 0.05,
        edge,
        points: [...Array(edge)].map((_, i) => ({
          phi: (i / edge) * Math.PI * 2 + Math.random() * 0.4 - 0.2,
          length: (Math.random() * vLength * 2 + vLength * 4) * 0.75, // -25% size
        })),
        accPhi: Math.random() * 0.015 - 0.0075,
        type: 'meteor',
        update() {
          this.rotation += this.vRotate * 0.2;
          this.x += Math.cos(this.vPhi) * this.vLength * 0.2;
          this.y += Math.sin(this.vPhi) * this.vLength * 0.2;
          this.x += Math.cos(Math.PI * 0.5) * 0.98 * 0.2;
          this.y += Math.sin(Math.PI * 0.5) * 0.98 * 0.2;
          this.vPhi += this.accPhi * 0.5;
          if (this.vPhi > Math.PI * 0.9 || this.vPhi < Math.PI * 0.6) {
            this.accPhi = -this.accPhi;
          }
          this.vLength *= 1.005;
          // Impact at bottom
          if (this.y > h - 10) {
            createExplosion(this.x, h - 5, this.edge);
            return true;
          }
          return false;
        },
        render() {
          if (!ctx || !vfx) return;
          // Main meteor body
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

          // Glow effect
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
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      w = rect.width;
      h = rect.height;
      canvas.width = w;
      canvas.height = h;
      vfxCanvas.width = w;
      vfxCanvas.height = h;
    }

    function init() {
      if (!vfx) return;
      resize();
      vfx.globalCompositeOperation = 'screen';
      for (let i = 0; i < 5; i++) {
        const m = createMeteor();
        m.y = Math.random() * h; // Distribute initially
        meteors.push(m);
      }
    }

    function draw() {
      if (!ctx || !vfx) return;
      ctx.clearRect(0, 0, w, h);

      // Fade trail effect - use destination-out to keep transparency
      vfx.globalCompositeOperation = 'destination-out';
      vfx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      vfx.fillRect(0, 0, w, h);
      vfx.globalCompositeOperation = 'source-over';

      // Update and render in reverse to safely remove items
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        const shouldRemove = m.update();
        m.render();
        if (shouldRemove) {
          meteors.splice(i, 1);
          // Only create new meteor if it was a meteor (not a rock)
          if (m.type === 'meteor') {
            meteors.push(createMeteor());
          }
        }
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
      {/* VFX canvas (glow trails) - with blur and brightness filter */}
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
      {/* Main canvas (meteor bodies) */}
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

    // Vertex shader
    const vertexShaderSource = `#version 300 es
      precision mediump float;
      const vec2 positions[6] = vec2[6](vec2(-1.0, -1.0), vec2(1.0, -1.0), vec2(-1.0, 1.0), vec2(-1.0, 1.0), vec2(1.0, -1.0), vec2(1.0, 1.0));
      out vec2 uv;
      void main() {
        uv = positions[gl_VertexID];
        gl_Position = vec4(positions[gl_VertexID], 0.0, 1.0);
      }`;

    // Fragment shader - Orange smoke
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

        // Orange colors instead of green/blue
        vec3 c1 = mix(vec3(.95, .45, .1), vec3(.6, .2, .0), ins + shift);

        // Fade out toward the top (uv.y goes from -1 at bottom to 1 at top)
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
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      canvas.width = rect.width;
      canvas.height = rect.height;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    // Create and link program
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

    // Enable alpha blending
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

// Spark Effect - Canvas-based lightning (adapted from JS example)
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
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;

      const ratio = window.devicePixelRatio || 1;
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx?.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    // Draw a lightning branch
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

    // Draw main lightning bolt
    function drawLightning(startX: number, w: number, h: number) {
      if (!ctx) return;

      // Flash effect
      ctx.fillStyle = 'rgba(250, 204, 21, 0.08)';
      ctx.fillRect(0, 0, w, h);

      let sx = startX, sy = 0;
      let ex = sx + Math.floor(Math.random() * 20) - 10;
      let ey = sy + Math.floor(Math.random() * 15) + 5;

      const limit = Math.floor(h / 8);
      for (let i = 0; i < limit && ey < h; i++) {
        // Main bolt - yellow glow
        ctx.beginPath();
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 10;
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.stroke();

        // Bright core
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

        // Random branches
        if (Math.random() < 0.15) {
          drawRoot(sx, sy, h);
        }
      }
      ctx.shadowBlur = 0;
    }

    function draw() {
      if (!canvas || !ctx) return;
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;

      const w = rect.width;
      const h = rect.height;

      // Clear canvas (transparent background)
      ctx.clearRect(0, 0, w, h);

      // Random lightning strikes - immediate on first frame
      if (firstFrame || Math.random() < 0.03) {
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
      {/* Subtle yellow glow background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(250,204,21,0.1) 0%, transparent 70%)',
        }}
      />
      {/* Lightning canvas */}
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
      {/* Green glow overlay - positioned at ~65% */}
      <div
        className="absolute inset-0 animate-glow-pulse"
        style={{
          background: 'radial-gradient(ellipse at 60% 50%, rgba(34,197,94,0.25) 0%, transparent 60%)',
        }}
      />

      {/* Checkmark container - drops from top, positioned at ~60% */}
      <div className="absolute inset-0 flex items-center" style={{ paddingLeft: '60%' }}>
        <div className="animate-stamp-drop">
          {/* Checkmark SVG */}
          <svg
            viewBox="0 0 100 100"
            className="w-16 h-16"
            style={{
              filter: 'drop-shadow(0 0 10px rgba(34,197,94,0.8)) drop-shadow(0 0 20px rgba(34,197,94,0.5))',
            }}
          >
            {/* Circle background */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(34,197,94,0.3)"
              strokeWidth="4"
            />
            {/* Checkmark */}
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

      {/* Impact particles - positioned at ~65% */}
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
          className="absolute top-1/2 animate-impact-particle"
          style={{
            left: '66%',
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

    const FLAKE_COUNT = 40; // Reduced for small card
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
      const rect = canvas.parentElement?.getBoundingClientRect();
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
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;

      for (let i = 0; i < FLAKE_COUNT; i++) {
        flakes.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          r: 0.5 + Math.random() * 1.5, // Smaller flakes for card
          speedY: 0.3 + Math.random() * 0.8,
          speedX: -0.2 + Math.random() * 0.4,
          phase: Math.random() * Math.PI * 2,
          drift: 0.15 + Math.random() * 0.25,
        });
      }
    }

    function draw() {
      if (!canvas || !ctx) return;
      const rect = canvas.parentElement?.getBoundingClientRect();
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

        // Wrap around
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
      {/* Subtle icy overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(159,217,255,0.1) 0%, rgba(159,217,255,0.05) 100%)',
        }}
      />
      {/* Snow canvas */}
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
      const rect = canvas.parentElement?.getBoundingClientRect();
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
      const rect = canvas.parentElement?.getBoundingClientRect();
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
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;

      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      for (const d of drops) {
        d.y += d.speedY;

        // Reset drop when it goes off screen
        if (d.y > h + d.length) {
          d.y = -d.length;
          d.x = Math.random() * w;
        }

        // Draw rain drop as a line
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
      {/* Rainy overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(100,180,255,0.08) 0%, rgba(100,180,255,0.15) 100%)',
        }}
      />
      {/* Rain canvas */}
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
      originX: number; // Source point X
      r: number;
      speed: number;
      swayDir: number;
      sway: number;
    }

    const bubbles: Bubble[] = [];
    // Bubble sources with chaos factor (base position + random offset)
    const bubbleSources = [
      0.15 + Math.random() * 0.15,  // ~15-30%
      0.45 + Math.random() * 0.2,   // ~45-65%
      0.75 + Math.random() * 0.15,  // ~75-90%
    ];

    function resizeCanvas() {
      if (!canvas) return;
      const rect = canvas.parentElement?.getBoundingClientRect();
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
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;

      // 3-4 bubbles per source
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
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;

      const w = rect.width;
      const h = rect.height;

      // Water level at 60% from top (partial flood, below progress bar)
      const waterLevel = h * 0.6;

      // Clear canvas
      ctx.clearRect(0, 0, w, h);

      // Draw water gradient only below water level
      const gradient = ctx.createLinearGradient(0, waterLevel, 0, h);
      gradient.addColorStop(0, 'rgba(88, 28, 135, 0.12)'); // Lighter at surface
      gradient.addColorStop(0.5, 'rgba(88, 28, 135, 0.2)');
      gradient.addColorStop(1, 'rgba(59, 7, 100, 0.3)');   // Darker at bottom
      ctx.fillStyle = gradient;
      ctx.fillRect(0, waterLevel, w, h - waterLevel);

      // Update and draw bubbles (only in water area)
      bubbles.forEach(b => {
        b.sway = Math.sin(time * 2 + b.x * 0.1) * 10 * b.swayDir;
        b.y -= b.speed * timeStep;

        // Reset bubble to its origin when it reaches water surface
        if (b.y < waterLevel - b.r) {
          b.y = h + b.r + Math.random() * 20;
          b.x = b.originX + (Math.random() - 0.5) * 15;
        }

        // Only draw if in water
        if (b.y > waterLevel) {
          // Draw bubble
          ctx.beginPath();
          ctx.fillStyle = 'rgba(180, 160, 220, 0.5)';
          ctx.arc(b.x + b.sway, b.y, b.r, 0, Math.PI * 2);
          ctx.fill();

          // Bubble highlight
          ctx.beginPath();
          ctx.fillStyle = 'rgba(220, 200, 255, 0.6)';
          ctx.arc(b.x + b.sway - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.3, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw organic wave lines at water surface
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
          // Combine multiple sine waves for organic look
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

function VerdictEffect({ effect, isActive }: { effect: string; isActive: boolean }) {
  if (!isActive) return null;

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

// CTA Button with store reset
function CTAButton({
  href,
  children,
  variant = 'primary',
  className = '',
  resetStore,
}: {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
  resetStore?: () => void;
}) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Reset the store (clears both memory and localStorage via persist middleware)
    if (resetStore) {
      resetStore();
    }
    router.push(href);
  };

  const baseStyles = variant === 'primary'
    ? 'text-white bg-gradient-to-r from-accent to-orange-500 shadow-2xl shadow-accent/25 hover:shadow-accent/40'
    : 'text-slate-900 bg-white hover:bg-slate-100 shadow-lg';

  return (
    <button
      onClick={handleClick}
      className={`group relative inline-flex items-center justify-center transform hover:scale-105 transition-all duration-300 ${baseStyles} ${className}`}
    >
      {variant === 'primary' && (
        <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent to-orange-500 animate-pulse opacity-30" />
      )}
      <span className="relative flex items-center gap-3">
        {children}
      </span>
    </button>
  );
}

export default function LandingPage() {
  const [hoveredVerdict, setHoveredVerdict] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const resetStore = useScoreStore((state) => state.reset);
  const { t, isHydrated } = useTranslations();

  useEffect(() => {
    // Trigger entrance animation after hydration completes
    if (isHydrated) {
      const timer = setTimeout(() => setIsLoaded(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isHydrated]);

  useEffect(() => {
    // Parallax scroll handler
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden">
      {/* Custom CSS for animations */}
      <style jsx global>{`
        @keyframes fire-flicker {
          0%, 100% { transform: scaleY(1) scaleX(1); opacity: 0.8; }
          25% { transform: scaleY(1.2) scaleX(0.9); opacity: 0.9; }
          50% { transform: scaleY(0.8) scaleX(1.1); opacity: 0.7; }
          75% { transform: scaleY(1.1) scaleX(0.95); opacity: 0.85; }
        }
        @keyframes fire-rise {
          0% { background-position: center 0px, center 0px, 50% 100%; }
          100% { background-position: center -200px, center -280px, 50% 100%; }
        }
        @keyframes ember {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-40px) scale(0); opacity: 0; }
        }
        @keyframes smoke-rise {
          0% { transform: translateY(20px) scale(0.8); opacity: 0; }
          50% { opacity: 0.6; }
          100% { transform: translateY(-30px) scale(1.5); opacity: 0; }
        }
        @keyframes lightning {
          0%, 90%, 100% { opacity: 0; }
          92%, 95% { opacity: 1; }
        }
        @keyframes spark {
          0%, 100% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.5); opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes frost-fall {
          0% { transform: translateY(-5px); opacity: 0.5; }
          50% { opacity: 1; }
          100% { transform: translateY(5px); opacity: 0.5; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes entrance-slide {
          0% { transform: translateY(50px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
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
        @keyframes blob-drift {
          0%, 100% { transform: translateX(0) translateY(0); }
          25% { transform: translateX(40px) translateY(-20px); }
          50% { transform: translateX(-30px) translateY(30px); }
          75% { transform: translateX(20px) translateY(10px); }
        }
        @keyframes blob-fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-blob-1 { animation: blob-fade-in 0.5s ease-out forwards, blob-float-1 12s ease-in-out 0.5s infinite; opacity: 0; }
        .animate-blob-2 { animation: blob-fade-in 0.5s ease-out forwards, blob-float-2 15s ease-in-out 0.5s infinite; opacity: 0; }
        .animate-blob-3 { animation: blob-fade-in 0.5s ease-out forwards, blob-float-3 10s ease-in-out 0.5s infinite; opacity: 0; }
        .animate-blob-4 { animation: blob-fade-in 0.5s ease-out forwards, blob-float-4 18s ease-in-out 0.5s infinite; opacity: 0; }
        .animate-blob-drift { animation: blob-fade-in 0.5s ease-out forwards, blob-drift 20s ease-in-out 0.5s infinite; opacity: 0; }

        /* Reduce intensity on HDR displays */
        @media (dynamic-range: high) {
          .blob-hdr-fix {
            filter: brightness(0.6) saturate(0.8);
          }
        }
        .animate-fire-flicker { animation: fire-flicker 0.5s ease-in-out infinite; }
        .animate-fire-rise { animation: fire-rise 1.75s linear infinite; }
        .animate-ember { animation: ember 1.5s ease-out infinite; }
        .animate-smoke-rise { animation: smoke-rise 3s ease-out infinite; }
        .animate-lightning { animation: lightning 2s ease-in-out infinite; }
        .animate-spark { animation: spark 0.8s ease-in-out infinite; }
        .animate-float { animation: float 2s ease-in-out infinite; }
        .animate-frost-fall { animation: frost-fall 2s ease-in-out infinite; }
        .animate-twinkle { animation: twinkle 1.5s ease-in-out infinite; }

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

        @keyframes electric-flicker {
          0%, 100% { opacity: 0.3; }
          10% { opacity: 0.8; }
          20% { opacity: 0.4; }
          30% { opacity: 1; }
          40% { opacity: 0.5; }
          50% { opacity: 0.9; }
          60% { opacity: 0.3; }
          70% { opacity: 0.7; }
          80% { opacity: 0.4; }
          90% { opacity: 0.8; }
        }
        @keyframes lightning-bolt {
          0%, 89%, 100% { opacity: 0; }
          90%, 95% { opacity: 1; }
        }
        @keyframes electric-spark {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes electric-border {
          0%, 100% { opacity: 0.5; }
          25% { opacity: 1; }
          50% { opacity: 0.3; }
          75% { opacity: 0.8; }
        }
        .animate-electric-flicker { animation: electric-flicker 0.5s ease-in-out infinite; }
        .animate-lightning-bolt { animation: lightning-bolt 1.5s ease-in-out infinite; }
        .animate-electric-spark { animation: electric-spark 0.3s ease-in-out infinite; }
        .animate-electric-border { animation: electric-border 0.8s ease-in-out infinite; }

        .animate-entrance { animation: entrance-slide 0.8s ease-out forwards; }
        .animate-entrance-delay-1 { animation: entrance-slide 0.8s ease-out 0.1s forwards; opacity: 0; }
        .animate-entrance-delay-2 { animation: entrance-slide 0.8s ease-out 0.2s forwards; opacity: 0; }
        .animate-entrance-delay-3 { animation: entrance-slide 0.8s ease-out 0.3s forwards; opacity: 0; }
        .animate-entrance-delay-4 { animation: entrance-slide 0.8s ease-out 0.4s forwards; opacity: 0; }
        .animate-entrance-delay-5 { animation: entrance-slide 0.8s ease-out 0.5s forwards; opacity: 0; }
      `}</style>

      {/* Animated background elements with chaotic parallax + idle animations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none blob-hdr-fix" style={{ willChange: 'transform' }}>
        {/* Blob 1 */}
        <div className="absolute top-1/4 -left-20 animate-blob-1" style={{ animationDelay: '0s' }}>
          <div
            className="w-96 h-96 bg-accent/20 rounded-full blur-3xl"
            style={{
              transform: `translateY(${scrollY * 0.1}px) translateX(${Math.sin(scrollY * 0.008) * 50}px) translateZ(0)`,
              willChange: 'transform',
              backfaceVisibility: 'hidden',
            }}
          />
        </div>
        {/* Blob 2 */}
        <div className="absolute bottom-1/4 -right-20 animate-blob-2" style={{ animationDelay: '2s' }}>
          <div
            className="w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"
            style={{
              transform: `translateY(${scrollY * 0.25}px) rotate(${scrollY * 0.05}deg) scale(${1 + Math.sin(scrollY * 0.005) * 0.2}) translateZ(0)`,
              willChange: 'transform',
              backfaceVisibility: 'hidden',
            }}
          />
        </div>

        {/* Blob 3 - Central */}
        <div className="absolute top-1/2 left-1/2 animate-blob-3" style={{ animationDelay: '1s' }}>
          <div
            className="w-[800px] h-[800px] bg-gradient-radial from-accent/5 to-transparent rounded-full"
            style={{
              transform: `translate(-50%, calc(-50% + ${scrollY * 0.4}px)) rotate(${scrollY * -0.02}deg) scale(${1 + Math.cos(scrollY * 0.003) * 0.1}) translateZ(0)`,
              willChange: 'transform',
              backfaceVisibility: 'hidden',
            }}
          />
        </div>
        {/* Blob 4 */}
        <div className="absolute top-[60%] left-[10%] animate-blob-4" style={{ animationDelay: '3s' }}>
          <div
            className="w-72 h-72 bg-red-500/10 rounded-full blur-3xl"
            style={{
              transform: `translateY(${scrollY * 0.35 + Math.sin(scrollY * 0.01) * 30}px) translateX(${Math.cos(scrollY * 0.01) * 40}px) rotate(${scrollY * 0.08}deg) translateZ(0)`,
              willChange: 'transform',
              backfaceVisibility: 'hidden',
            }}
          />
        </div>

        {/* Blob 5 */}
        <div className="absolute top-3/4 left-1/4 animate-blob-drift" style={{ animationDelay: '4s' }}>
          <div
            className="w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"
            style={{
              transform: `translateY(${scrollY * -0.15}px) translateX(${Math.sin(scrollY * 0.012) * 60}px) translateZ(0)`,
              willChange: 'transform',
              backfaceVisibility: 'hidden',
            }}
          />
        </div>
        {/* Blob 6 */}
        <div className="absolute top-[40%] right-[5%] animate-blob-1" style={{ animationDelay: '5s' }}>
          <div
            className="w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl"
            style={{
              transform: `translateY(${scrollY * -0.2}px) scale(${1 + Math.sin(scrollY * 0.007) * 0.3}) translateZ(0)`,
              willChange: 'transform',
              backfaceVisibility: 'hidden',
            }}
          />
        </div>

        {/* Blob 7 */}
        <div className="absolute top-1/3 right-1/4 animate-blob-2" style={{ animationDelay: '6s' }}>
          <div
            className="w-48 h-48 bg-purple-500/10 rounded-full blur-2xl"
            style={{
              transform: `translateY(${scrollY * 0.3}px) translateX(${scrollY * 0.15 + Math.sin(scrollY * 0.015) * 25}px) rotate(${scrollY * -0.1}deg) translateZ(0)`,
              willChange: 'transform',
              backfaceVisibility: 'hidden',
            }}
          />
        </div>
        {/* Blob 8 */}
        <div className="absolute top-[20%] left-[15%] animate-blob-4" style={{ animationDelay: '7s' }}>
          <div
            className="w-32 h-32 bg-pink-500/15 rounded-full blur-2xl"
            style={{
              transform: `translateY(${scrollY * 0.45 + Math.cos(scrollY * 0.02) * 20}px) translateX(${Math.sin(scrollY * 0.018) * 35}px) scale(${1 + Math.sin(scrollY * 0.01) * 0.4}) translateZ(0)`,
              willChange: 'transform',
              backfaceVisibility: 'hidden',
            }}
          />
        </div>
        {/* Blob 9 */}
        <div className="absolute top-[80%] right-[20%] animate-blob-3" style={{ animationDelay: '8s' }}>
          <div
            className="w-40 h-40 bg-yellow-500/8 rounded-full blur-2xl"
            style={{
              transform: `translateY(${scrollY * 0.5}px) translateX(${scrollY * -0.2 + Math.cos(scrollY * 0.013) * 45}px) translateZ(0)`,
              willChange: 'transform',
              backfaceVisibility: 'hidden',
            }}
          />
        </div>

        {/* Blob 10 */}
        <div className="absolute top-[10%] right-[40%] animate-blob-drift" style={{ animationDelay: '9s' }}>
          <div
            className="w-56 h-56 bg-emerald-500/8 rounded-full blur-3xl"
            style={{
              transform: `translateY(${scrollY * 0.2 + Math.sin(scrollY * 0.009) * 40}px) translateX(${scrollY * 0.1}px) rotate(${scrollY * 0.04}deg) translateZ(0)`,
              willChange: 'transform',
              backfaceVisibility: 'hidden',
            }}
          />
        </div>
        {/* Blob 11 */}
        <div className="absolute top-[90%] left-[40%] animate-blob-1" style={{ animationDelay: '10s' }}>
          <div
            className="w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"
            style={{
              transform: `translateY(${scrollY * -0.25}px) translateX(${scrollY * -0.12 + Math.sin(scrollY * 0.011) * 30}px) scale(${1 + Math.cos(scrollY * 0.006) * 0.25}) translateZ(0)`,
              willChange: 'transform',
              backfaceVisibility: 'hidden',
            }}
          />
        </div>
        {/* Blob 12 */}
        <div className="absolute top-[50%] left-[80%] animate-blob-2" style={{ animationDelay: '11s' }}>
          <div
            className="w-48 h-48 bg-rose-500/8 rounded-full blur-2xl"
            style={{
              transform: `translateY(${scrollY * 0.15 + Math.cos(scrollY * 0.014) * 35}px) translateX(${Math.sin(scrollY * 0.016) * 25}px) translateZ(0)`,
              willChange: 'transform',
              backfaceVisibility: 'hidden',
            }}
          />
        </div>

        {/* Blob 13 - Wild orbital */}
        <div className="absolute top-[30%] left-[60%] animate-blob-4" style={{ animationDelay: '12s' }}>
          <div
            className="w-36 h-36 bg-amber-500/12 rounded-full blur-2xl"
            style={{
              transform: `translateY(${Math.sin(scrollY * 0.012) * 80}px) translateX(${Math.cos(scrollY * 0.012) * 80}px) rotate(${scrollY * 0.15}deg) translateZ(0)`,
              willChange: 'transform',
              backfaceVisibility: 'hidden',
            }}
          />
        </div>
        {/* Blob 14 - Zigzag */}
        <div className="absolute top-[70%] left-[5%] animate-blob-3" style={{ animationDelay: '13s' }}>
          <div
            className="w-44 h-44 bg-teal-500/10 rounded-full blur-2xl"
            style={{
              transform: `translateY(${scrollY * 0.3}px) translateX(${Math.sin(scrollY * 0.025) * 100}px) translateZ(0)`,
              willChange: 'transform',
              backfaceVisibility: 'hidden',
            }}
          />
        </div>
      </div>

      {/* Hero Section - 100vh */}
      <section className="relative z-10 min-h-screen flex flex-col px-4 sm:px-6 lg:px-8">
        {/* Logo/Brand + Language Switcher - Fixed at top */}
        <div className={`pt-6 pb-4 flex justify-between items-center ${isLoaded ? 'animate-entrance' : 'opacity-0'}`}>
          <div className="flex-1" /> {/* Spacer for centering */}
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-sm font-medium">
            <Zap className="w-4 h-4 text-accent" />
            {t('common.brand')}
          </span>
          <div className="flex-1 flex justify-end">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Centered content - slightly offset down */}
        <main className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto text-center w-full pt-12">
          {/* Headline with impact */}
          <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-display mb-6 leading-tight ${isLoaded ? 'animate-entrance-delay-1' : 'opacity-0'}`}>
            <span className="text-white/90">{t('home.hero.title1')}</span>
            <br />
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-accent via-orange-400 to-red-500 bg-clip-text text-transparent">
                {t('home.hero.title2')}
              </span>
              <span className="absolute -inset-4 sm:-inset-8 bg-gradient-to-r from-accent/30 via-orange-400/25 to-red-500/30 blur-3xl sm:blur-[50px] rounded-full" />
            </span>
            <br />
            <span className="text-white/90">{t('home.hero.title3')}</span>
          </h1>

          {/* Subheadline */}
          <p className={`text-lg sm:text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed ${isLoaded ? 'animate-entrance-delay-2' : 'opacity-0'}`}>
            {t('home.hero.subtitle')}
            <br className="hidden sm:block" />
            <span className="text-white font-medium">
              {t('home.hero.subtitleHighlight')}
            </span>
          </p>

          {/* CTA Principal */}
          <div className={`mb-8 ${isLoaded ? 'animate-entrance-delay-3' : 'opacity-0'}`}>
            <CTAButton
              href="/test"
              variant="primary"
              className="px-10 py-5 text-xl font-bold rounded-2xl"
              resetStore={resetStore}
            >
              {t('home.cta.primary')}
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </CTAButton>
          </div>

          {/* Trust badges */}
          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-12 w-full max-w-2xl mx-auto ${isLoaded ? 'animate-entrance-delay-4' : 'opacity-0'}`}>
            {[
              { icon: Clock, labelKey: 'home.badges.time', sublabelKey: 'home.badges.timeDesc' },
              { icon: Shield, labelKey: 'home.badges.data', sublabelKey: 'home.badges.dataDesc' },
              { icon: Zap, labelKey: 'home.badges.free', sublabelKey: 'home.badges.freeDesc' },
              { icon: Share2, labelKey: 'home.badges.share', sublabelKey: 'home.badges.shareDesc' },
            ].map((badge, index) => (
              <div
                key={index}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <badge.icon className="w-5 h-5 text-accent flex-shrink-0" />
                <div className="text-left min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{t(badge.labelKey as any)}</p>
                  <p className="text-xs text-slate-400 truncate">{t(badge.sublabelKey as any)}</p>
                </div>
              </div>
            ))}
          </div>

        </main>

        {/* Scroll indicator - Fixed at bottom, symmetric with logo */}
        <div className={`pb-6 pt-4 flex justify-center ${isLoaded ? 'animate-entrance-delay-5' : 'opacity-0'}`}>
          <button
            onClick={() => {
              document.getElementById('verdicts-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label={t('home.scrollHint')}
          >
            <ChevronDown className="w-8 h-8 text-slate-500 animate-bounce" />
          </button>
        </div>
      </section>

      {/* Section Verdicts Preview - 100vh */}
      <section id="verdicts-section" className="relative z-10 min-h-screen flex flex-col justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            {t('home.verdicts.title')}
          </h2>
          <p className="text-slate-400 text-center mb-10 max-w-xl mx-auto">
            {t('home.verdicts.subtitle')}
          </p>

          {/* Verdict scale */}
          <div className="grid gap-3">
            {VERDICT_CONFIGS.map((item, index) => (
              <div
                key={item.key}
                className={`relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 cursor-default sm:cursor-default overflow-hidden ${
                  hoveredVerdict === index
                    ? `${item.bg} border-current ${item.color} shadow-lg ${item.glowColor}`
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
                onMouseEnter={() => setHoveredVerdict(index)}
                onMouseLeave={() => setHoveredVerdict(null)}
                onClick={() => {
                  setHoveredVerdict(hoveredVerdict === index ? null : index);
                }}
              >
                {/* Effect layer */}
                <VerdictEffect effect={item.effect} isActive={hoveredVerdict === index} />

                <div
                  className={`relative z-10 p-2 rounded-lg ${item.bg} ${item.color} transition-transform duration-300 ${
                    hoveredVerdict === index ? 'scale-110' : ''
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${hoveredVerdict === index ? 'animate-pulse' : ''}`} />
                </div>
                <div className="relative z-10 flex-1">
                  <p className={`font-bold transition-colors duration-300 ${
                    hoveredVerdict === index ? item.color : 'text-white'
                  }`}>
                    {t(`home.verdicts.items.${item.key}.name` as any)}
                  </p>
                  <p className={`text-sm transition-colors duration-300 ${
                    hoveredVerdict === index ? 'text-slate-300' : 'text-slate-400'
                  }`}>
                    {t(`home.verdicts.items.${item.key}.description` as any)}
                  </p>
                </div>
                {/* Progress bar indicator - from 5px min to 100% */}
                <div className="relative z-10 hidden sm:block w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${item.bgColor} ${
                      hoveredVerdict === index ? 'animate-pulse' : ''
                    }`}
                    style={{
                      width: item.progress === 5 ? '5px' : `${item.progress}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Second CTA */}
          <div className="text-center mt-12">
            <CTAButton
              href="/test"
              variant="secondary"
              className="px-8 py-4 text-lg font-semibold rounded-xl"
              resetStore={resetStore}
            >
              {t('home.cta.secondary')}
              <ArrowRight className="w-5 h-5" />
            </CTAButton>
          </div>
        </div>
      </section>

      {/* Combined section: "Pour qui ?" + Final CTA - 100vh together */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center">
        {/* Section "Pour qui ?" */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-10">
              {t('home.personas.title')}
            </h2>

            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { key: 'dev' },
                { key: 'cfo' },
                { key: 'cto' },
              ].map((persona) => (
                <div
                  key={persona.key}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="text-4xl mb-4">{t(`home.personas.${persona.key}.emoji` as any)}</div>
                  <h3 className="text-lg font-bold mb-2">{t(`home.personas.${persona.key}.title` as any)}</h3>
                  <p className="text-sm text-slate-400">{t(`home.personas.${persona.key}.description` as any)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-6xl mb-6">{t('home.final.emoji')}</div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {t('home.final.title')}
            </h2>
            <p className="text-slate-400 mb-8">
              {t('home.final.description')}
              <br />
              {t('home.final.spoiler')}
            </p>
            <CTAButton
              href="/test"
              variant="primary"
              className="px-12 py-6 text-xl font-bold rounded-2xl"
              resetStore={resetStore}
            >
              {t('home.cta.final')}
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </CTAButton>
          </div>
        </section>
      </div>

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
            <Link href="/leaderboard" className="hover:text-white transition-colors flex items-center gap-1">
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
