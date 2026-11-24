"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type Theme = {
  name: string;
  light: string; // ray color near the top / center
  deep: string; // ray color at the sides
  glow: string; // glow color at bottom center (rgb, no alpha)
  halo: string[]; // halo gradient stops: inner, mid, outer, top
  dark: boolean;
};

const THEMES: Theme[] = [
  {
    name: "Ocean",
    light: "#5499ff",
    deep: "#243cf5",
    glow: "248,176,90",
    halo: ["#b4d6ff", "#cfe3ff", "#eef5ff", "#ffffff"],
    dark: false,
  },
  {
    name: "Violet",
    light: "#cc80ff",
    deep: "#8c26e6",
    glow: "255,140,175",
    halo: ["#e0c4ff", "#eadbff", "#f7efff", "#ffffff"],
    dark: false,
  },
  {
    name: "Forest",
    light: "#4dd999",
    deep: "#0d8059",
    glow: "250,222,100",
    halo: ["#b8ebcf", "#d3f3e1", "#eefaf3", "#fbfffd"],
    dark: false,
  },
  {
    name: "Night",
    light: "#66ccff",
    deep: "#8c59ff",
    glow: "255,120,60",
    halo: ["#1d2a5c", "#101838", "#080c20", "#04050d"],
    dark: true,
  },
];

const bgFor = (t: Theme) =>
  [
    `radial-gradient(ellipse 55% 60% at 50% 100%, rgba(${t.glow},0.9) 0%, rgba(${t.glow},0.4) 42%, rgba(${t.glow},0) 72%)`,
    `radial-gradient(ellipse 85% 85% at 50% 100%, ${t.halo[0]} 0%, ${t.halo[1]} 40%, ${t.halo[2]} 70%, ${t.halo[3]} 100%)`,
  ].join(", ");

type Props = {
  rays?: number;
  hoverRadius?: number;
  hoverStrength?: number;
  className?: string;
};

type Ray = {
  angle: number;
  lenF: number;
  alpha: number;
  side: number; // 0 = top (light) .. 1 = sides (deep)
  phase: number;
  ox: number;
  oy: number;
};

export default function RadialBurst({
  rays = 420,
  hoverRadius = 190,
  hoverStrength = 70,
  className = "",
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [themeIdx, setThemeIdx] = useState(0);
  const theme = THEMES[themeIdx];

  // target colors the animation loop eases toward
  const target = useRef({
    light: new THREE.Color(THEMES[0].light),
    deep: new THREE.Color(THEMES[0].deep),
  });

  useEffect(() => {
    target.current.light.set(THEMES[themeIdx].light);
    target.current.deep.set(THEMES[themeIdx].deep);
  }, [themeIdx]);

  useEffect(() => {
    const wrap = wrapRef.current!;
    let w = wrap.clientWidth;
    let h = wrap.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    wrap.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(0, w, 0, -h, -1, 1);

    // ---------- generate rays ----------
    const data: Ray[] = [];
    const colors = new Float32Array(rays * 2 * 4);
    const sizes = new Float32Array(rays);
    const dotColors = new Float32Array(rays * 4);

    for (let i = 0; i < rays; i++) {
      const angle = Math.PI * (0.02 + 0.96 * Math.random());
      data.push({
        angle,
        lenF: 0.3 + 0.7 * Math.pow(Math.random(), 0.7),
        alpha: 0.25 + 0.7 * Math.random(),
        side: Math.pow(Math.abs(Math.cos(angle)), 1.1),
        phase: Math.random() * Math.PI * 2,
        ox: 0,
        oy: 0,
      });
      sizes[i] = (2 + Math.pow(Math.random(), 2.2) * 5) * dpr;
    }

    const curLight = target.current.light.clone();
    const curDeep = target.current.deep.clone();
    const tmp = new THREE.Color();

    const writeColors = () => {
      for (let i = 0; i < rays; i++) {
        const r = data[i];
        tmp.copy(curLight).lerp(curDeep, r.side);
        colors[i * 8] = tmp.r;
        colors[i * 8 + 1] = tmp.g;
        colors[i * 8 + 2] = tmp.b;
        colors[i * 8 + 3] = r.alpha * 0.18;
        colors[i * 8 + 4] = tmp.r;
        colors[i * 8 + 5] = tmp.g;
        colors[i * 8 + 6] = tmp.b;
        colors[i * 8 + 7] = r.alpha;
        dotColors[i * 4] = tmp.r;
        dotColors[i * 4 + 1] = tmp.g;
        dotColors[i * 4 + 2] = tmp.b;
        dotColors[i * 4 + 3] = r.alpha;
      }
    };
    writeColors();

    // ---------- lines ----------
    const linePos = new Float32Array(rays * 2 * 3);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePos, 3));
    lineGeo.setAttribute("aColor", new THREE.BufferAttribute(colors, 4));

    const lineMat = new THREE.ShaderMaterial({
      transparent: true,
      depthTest: false,
      vertexShader: /* glsl */ `
        attribute vec4 aColor;
        varying vec4 vColor;
        void main() {
          vColor = aColor;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec4 vColor;
        void main() { gl_FragColor = vColor; }
      `,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    lines.frustumCulled = false;
    scene.add(lines);

    // ---------- dots ----------
    const dotPos = new Float32Array(rays * 3);
    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute("position", new THREE.BufferAttribute(dotPos, 3));
    dotGeo.setAttribute("aColor", new THREE.BufferAttribute(dotColors, 4));
    dotGeo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

    const dotMat = new THREE.ShaderMaterial({
      transparent: true,
      depthTest: false,
      vertexShader: /* glsl */ `
        attribute vec4 aColor;
        attribute float aSize;
        varying vec4 vColor;
        void main() {
          vColor = aColor;
          gl_PointSize = aSize;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec4 vColor;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          float edge = smoothstep(0.5, 0.38, d);
          gl_FragColor = vec4(vColor.rgb, vColor.a * edge);
        }
      `,
    });
    const dots = new THREE.Points(dotGeo, dotMat);
    dots.frustumCulled = false;
    scene.add(dots);

    // ---------- pointer ----------
    const pointer = { x: -9999, y: -9999 };
    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);

    // ---------- resize ----------
    const ro = new ResizeObserver(() => {
      w = wrap.clientWidth;
      h = wrap.clientHeight;
      renderer.setSize(w, h);
      camera.left = 0;
      camera.right = w;
      camera.top = 0;
      camera.bottom = -h;
      camera.updateProjectionMatrix();
    });
    ro.observe(wrap);

    // ---------- animate ----------
    let raf = 0;
    const start = performance.now();

    const tick = () => {
      const t = (performance.now() - start) / 1000;
      const ox = w / 2;
      const oy = h + 10;
      const R = Math.min(w * 0.4, h * 0.85);

      // ease ray colors toward the active theme
      const dL =
        Math.abs(curLight.r - target.current.light.r) +
        Math.abs(curLight.g - target.current.light.g) +
        Math.abs(curLight.b - target.current.light.b) +
        Math.abs(curDeep.r - target.current.deep.r) +
        Math.abs(curDeep.g - target.current.deep.g) +
        Math.abs(curDeep.b - target.current.deep.b);
      if (dL > 0.002) {
        curLight.lerp(target.current.light, 0.08);
        curDeep.lerp(target.current.deep, 0.08);
        writeColors();
        (lineGeo.attributes.aColor as THREE.BufferAttribute).needsUpdate = true;
        (dotGeo.attributes.aColor as THREE.BufferAttribute).needsUpdate = true;
      }

      for (let i = 0; i < rays; i++) {
        const r = data[i];
        const len = R * r.lenF * (1 + Math.sin(t * 0.6 + r.phase) * 0.012);
        const bx = ox + Math.cos(r.angle) * len;
        const by = oy - Math.sin(r.angle) * len;

        let tx = 0;
        let ty = 0;
        const dx = bx - pointer.x;
        const dy = by - pointer.y;
        const dist = Math.hypot(dx, dy);
        if (dist < hoverRadius) {
          const k = Math.pow(1 - dist / hoverRadius, 2) * hoverStrength;
          tx = (dx / (dist || 1)) * k;
          ty = (dy / (dist || 1)) * k;
        }
        r.ox += (tx - r.ox) * 0.12;
        r.oy += (ty - r.oy) * 0.12;

        const px = bx + r.ox;
        const py = by + r.oy;

        linePos[i * 6] = ox;
        linePos[i * 6 + 1] = -oy;
        linePos[i * 6 + 2] = 0;
        linePos[i * 6 + 3] = px;
        linePos[i * 6 + 4] = -py;
        linePos[i * 6 + 5] = 0;

        dotPos[i * 3] = px;
        dotPos[i * 3 + 1] = -py;
        dotPos[i * 3 + 2] = 0;
      }

      (lineGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (dotGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      lineGeo.dispose();
      lineMat.dispose();
      dotGeo.dispose();
      dotMat.dispose();
      renderer.dispose();
      wrap.removeChild(renderer.domElement);
    };
  }, [rays, hoverRadius, hoverStrength]);

  const next = THEMES[(themeIdx + 1) % THEMES.length];

  return (
    <div
      ref={wrapRef}
      className={`relative h-screen w-full overflow-hidden ${className}`}
    >
      {/* one background layer per theme, crossfaded */}
      {THEMES.map((t, i) => (
        <div
          key={t.name}
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: bgFor(t),
            opacity: i === themeIdx ? 1 : 0,
            transition: "opacity 700ms ease",
          }}
        />
      ))}

      {/* theme switch button */}
      <button
        type="button"
        onClick={() => setThemeIdx((i) => (i + 1) % THEMES.length)}
        title={`Switch to ${next.name}`}
        aria-label={`Switch color theme to ${next.name}`}
        style={{
          position: "absolute",
          top: 28,
          right: 28,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 12px",
          borderRadius: 10,
          cursor: "pointer",
          fontSize: 13,
          fontWeight: 500,
          color: theme.dark ? "#e6ecff" : "#2c4a7c",
          background: theme.dark
            ? "rgba(255,255,255,0.08)"
            : "rgba(255,255,255,0.7)",
          border: theme.dark
            ? "1px solid rgba(255,255,255,0.18)"
            : "1px solid rgba(60,110,200,0.25)",
          backdropFilter: "blur(8px)",
          transition: "all 400ms ease",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="13.5" cy="6.5" r="1" />
          <circle cx="17.5" cy="10.5" r="1" />
          <circle cx="8.5" cy="7.5" r="1" />
          <circle cx="6.5" cy="12.5" r="1" />
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.6-.7 1.6-1.6 0-.4-.2-.8-.5-1.1-.3-.3-.4-.6-.4-1 0-.9.7-1.6 1.6-1.6H16c3.3 0 6-2.7 6-6 0-4.4-4.5-8.7-10-8.7z" />
        </svg>
        <span>{theme.name}</span>
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${theme.light}, ${theme.deep})`,
          }}
        />
      </button>
    </div>
  );
}