"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ── Animated Liquid Orb ─────────────────────────────── */
// function LiquidOrb({ color }: { color: string }) {
//   const meshRef = useRef<THREE.Mesh>(null);
//   const materialRef = useRef<THREE.ShaderMaterial>(null);

//   const uniforms = useMemo(
//     () => ({
//       uTime: { value: 0 },
//       uColor: { value: new THREE.Color(color) },
//       uMouse: { value: new THREE.Vector2(0.5, 0.5) },
//     }),
//     []
//   );

//   // Update color on slide change
//   useEffect(() => {
//     if (materialRef.current) {
//       materialRef.current.uniforms.uColor.value.set(color);
//     }
//   }, [color]);

//   useFrame(({ clock, mouse }) => {
//     if (materialRef.current) {
//       materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
//       materialRef.current.uniforms.uMouse.value.set(
//         (mouse.x + 1) / 2,
//         (mouse.y + 1) / 2
//       );
//     }
//     if (meshRef.current) {
//       meshRef.current.rotation.y = clock.getElapsedTime() * 0.08;
//       meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.05) * 0.1;
//     }
//   });

//   const vertexShader = `
//     uniform float uTime;
//     uniform vec2 uMouse;
//     varying vec3 vNormal;
//     varying vec3 vPosition;

//     // Simplex-style noise
//     vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
//     vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
//     vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
//     vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
//     float snoise(vec3 v) {
//       const vec2 C = vec2(1.0/6.0, 1.0/3.0);
//       const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
//       vec3 i  = floor(v + dot(v, C.yyy));
//       vec3 x0 = v - i + dot(i, C.xxx);
//       vec3 g = step(x0.yzx, x0.xyz);
//       vec3 l = 1.0 - g;
//       vec3 i1 = min(g.xyz, l.zxy);
//       vec3 i2 = max(g.xyz, l.zxy);
//       vec3 x1 = x0 - i1 + C.xxx;
//       vec3 x2 = x0 - i2 + C.yyy;
//       vec3 x3 = x0 - D.yyy;
//       i = mod289(i);
//       vec4 p = permute(permute(permute(
//         i.z + vec4(0.0, i1.z, i2.z, 1.0))
//         + i.y + vec4(0.0, i1.y, i2.y, 1.0))
//         + i.x + vec4(0.0, i1.x, i2.x, 1.0));
//       float n_ = 0.142857142857;
//       vec3 ns = n_ * D.wyz - D.xzx;
//       vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
//       vec4 x_ = floor(j * ns.z);
//       vec4 y_ = floor(j - 7.0 * x_);
//       vec4 x = x_ *ns.x + ns.yyyy;
//       vec4 y = y_ *ns.x + ns.yyyy;
//       vec4 h = 1.0 - abs(x) - abs(y);
//       vec4 b0 = vec4(x.xy, y.xy);
//       vec4 b1 = vec4(x.zw, y.zw);
//       vec4 s0 = floor(b0)*2.0 + 1.0;
//       vec4 s1 = floor(b1)*2.0 + 1.0;
//       vec4 sh = -step(h, vec4(0.0));
//       vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
//       vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
//       vec3 p0 = vec3(a0.xy, h.x);
//       vec3 p1 = vec3(a0.zw, h.y);
//       vec3 p2 = vec3(a1.xy, h.z);
//       vec3 p3 = vec3(a1.zw, h.w);
//       vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
//       p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
//       vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
//       m = m * m;
//       return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
//     }

//     void main() {
//       vNormal = normal;
//       vPosition = position;
//       float t = uTime * 0.3;
//       float noise = snoise(vec3(position * 1.5 + t));
//       float noise2 = snoise(vec3(position * 2.5 - t * 0.5));
//       float displacement = (noise * 0.35 + noise2 * 0.15);
//       vec3 newPosition = position + normal * displacement;
//       gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
//     }
//   `;

//   const fragmentShader = `
//     uniform vec3 uColor;
//     uniform float uTime;
//     uniform vec2 uMouse;
//     varying vec3 vNormal;
//     varying vec3 vPosition;

//     void main() {
//       vec3 lightDir = normalize(vec3(uMouse.x * 2.0 - 1.0, uMouse.y * 2.0 - 1.0, 1.5));
//       float diffuse = max(dot(vNormal, lightDir), 0.0);
//       float rimLight = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
//       rimLight = pow(rimLight, 3.0) * 0.6;
//       vec3 baseColor = uColor;
//       vec3 highlightColor = baseColor + 0.4;
//       vec3 finalColor = mix(baseColor * 0.4, highlightColor, diffuse) + rimLight * 0.8;
//       float fresnel = pow(1.0 - max(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 0.0), 4.0);
//       finalColor += fresnel * 0.5;
//       gl_FragColor = vec4(finalColor, 0.85);
//     }
//   `;

//   return (
//     <mesh ref={meshRef} position={[3.5, 0, -2]} scale={2.4}>
//       <sphereGeometry args={[1, 128, 128]} />
//       <shaderMaterial
//         ref={materialRef}
//         uniforms={uniforms}
//         vertexShader={vertexShader}
//         fragmentShader={fragmentShader}
//         transparent
//         side={THREE.FrontSide}
//       />
//     </mesh>
//   );
// }

/* ── Floating Particles ──────────────────────────────── */
function FloatingParticles({ color }: { color: string }) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, sizes } = useMemo(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 4;
      sizes[i] = Math.random() * 0.04 + 0.01;
    }
    return { positions, sizes };
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.02;
      const posArr = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < posArr.length / 3; i++) {
        posArr[i * 3 + 1] += Math.sin(clock.getElapsedTime() * 0.5 + i) * 0.001;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.03}
        sizeAttenuation
        transparent
        opacity={0.5}
        depthWrite={false}
      />
    </points>
  );
}

/* ── Grid Lines ──────────────────────────────────────── */
function GridLines() {
  const linesRef = useRef<THREE.LineSegments>(null);
  useFrame(({ clock }) => {
    if (linesRef.current) {
      linesRef.current.rotation.x = clock.getElapsedTime() * 0.01;
    }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const verts: number[] = [];
    const size = 20;
    const step = 2;
    for (let i = -size; i <= size; i += step) {
      verts.push(i, -10, -10, i, -10, 10);
      verts.push(-size, -10, i, size, -10, i);
    }
    geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
    return geo;
  }, []);

  return (
    <lineSegments ref={linesRef} geometry={geometry} position={[0, -4, 0]}>
      <lineBasicMaterial color="#ffffff" transparent opacity={0.04} />
    </lineSegments>
  );
}

/* ── Scene ───────────────────────────────────────────── */
function Scene({ color }: { color: string }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[-8, 6, 4]} intensity={1.5} color={color} />
      <pointLight position={[8, -6, 2]} intensity={0.6} color="#ffffff" />
      <GridLines />
      <FloatingParticles color={color} />
      {/* <LiquidOrb color={color} /> */}
    </>
  );
}

/* ── Export ──────────────────────────────────────────── */
export default function Hero3DBackground({ color = "#84572F" }: { color?: string }) {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden" style={{ background: "#020608" }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 1.5]}
      >
        <Scene color={color} />
      </Canvas>
      {/* Dark vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 20%, rgba(2,6,8,0.7) 100%)",
        }}
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/70 via-black/10 to-transparent" />
    </div>
  );
}
