"use client";

import { useEffect, useRef } from "react";

/**
 * Optional WebGL hero background — enabled with
 * <CursorBackground variant="shader" />.
 *
 * A slowly-evolving fbm noise field in the site's purple/cyan palette, lit by
 * a soft lobe that follows the cursor. Silently no-ops if WebGL is missing,
 * in which case the base gradient wash behind it still shows.
 */

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;
uniform vec2  uRes;
uniform vec2  uMouse;   // pixels, origin top-left
uniform float uTime;
uniform float uHasMouse;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  // keep the noise square regardless of viewport aspect
  vec2 p = uv * vec2(uRes.x / uRes.y, 1.0);

  float n = fbm(p * 2.4 + vec2(uTime * 0.045, uTime * 0.03));
  n = fbm(p * 2.4 + vec2(n, -n) * 0.6 + uTime * 0.02);

  vec3 deep   = vec3(0.031, 0.031, 0.039); // #08080a
  vec3 purple = vec3(0.486, 0.227, 0.929); // #7c3aed
  vec3 cyan   = vec3(0.133, 0.827, 0.933); // #22d3ee

  vec3 col = mix(deep, purple, smoothstep(0.35, 0.95, n) * 0.55);
  col = mix(col, cyan, smoothstep(0.72, 1.0, n) * 0.12);

  // cursor lobe — flip Y because gl_FragCoord is bottom-left
  if (uHasMouse > 0.5) {
    vec2 m = vec2(uMouse.x, uRes.y - uMouse.y);
    float d = distance(gl_FragCoord.xy, m) / max(uRes.y, 1.0);
    float glow = exp(-d * 4.2);
    col += purple * glow * 0.42;
    col += cyan * glow * glow * 0.10;
  }

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.warn("[ShaderBackground]", gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      (canvas.getContext("webgl", { antialias: false }) as WebGLRenderingContext | null) ??
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return; // base gradient wash remains visible

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn("[ShaderBackground]", gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]), // single oversized triangle
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uHasMouse = gl.getUniformLocation(prog, "uHasMouse");

    const mouse = { x: 0, y: 0, tx: 0, ty: 0, has: 0 };
    let raf = 0;
    const start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5); // shader is fill-rate bound
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = canvas.width / Math.max(rect.width, 1);
      mouse.tx = (e.clientX - rect.left) * dpr;
      mouse.ty = (e.clientY - rect.top) * dpr;
      mouse.has = 1;
    };
    const onLeave = () => {
      mouse.has = 0;
    };

    const frame = () => {
      mouse.x += (mouse.tx - mouse.x) * 0.12;
      mouse.y += (mouse.ty - mouse.y) * 0.12;
      gl.uniform1f(uTime, (performance.now() - start) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uHasMouse, mouse.has);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    };

    resize();
    frame();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}
