import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export function Caustics({ 
  position = [0, -0.5, 0], 
  scale = 20,
  intensity = 1.0,
  speed = 0.3,
  color = 0xffd700 
}) {
  const meshRef = useRef();
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta * speed;
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = timeRef.current;
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      position={position} 
      rotation={[-Math.PI / 2, 0, 0]}
      scale={scale}
    >
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec3 uColor;
          uniform float uIntensity;
          varying vec2 vUv;
          
          // Simplex 2D noise
          vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
          
          float snoise(vec2 v) {
            const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
            vec2 i  = floor(v + dot(v, C.yy));
            vec2 x0 = v - i + dot(i, C.xx);
            vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod289(i);
            vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
            vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
            m = m*m; m = m*m;
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
            m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
            vec3 g = vec3(a0.x*x0.x + h.x*x0.y, a0.y*x12.x + h.y*x12.y, a0.z*x12.z + h.z*x12.w);
            return 130.0 * dot(m, g);
          }
          
          // FBM noise for caustics
          float fbm(vec2 p) {
            float value = 0.0;
            float amplitude = 0.5;
            float frequency = 1.0;
            for (int i = 0; i < 5; i++) {
              value += amplitude * snoise(p * frequency);
              frequency *= 2.0;
              amplitude *= 0.5;
            }
            return value;
          }
          
          void main() {
            vec2 uv = vUv * 8.0;
            
            // Animated caustics pattern
            float caustics = 0.0;
            caustics += fbm(uv + uTime * 0.15) * 0.5;
            caustics += fbm(uv * 2.0 - uTime * 0.1) * 0.25;
            caustics += fbm(uv * 4.0 + uTime * 0.05) * 0.125;
            
            // Sharp caustic lines
            caustics = pow(caustics, 3.0);
            caustics = smoothstep(0.3, 1.0, caustics);
            
            // Radial falloff
            float dist = length(vUv - 0.5) * 2.0;
            float vignette = 1.0 - smoothstep(0.3, 1.0, dist);
            
            vec3 finalColor = uColor * caustics * vignette * uIntensity;
            float alpha = caustics * vignette * 0.6;
            
            gl_FragColor = vec4(finalColor, alpha);
          }
        `}
        uniforms={{
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(color) },
          uIntensity: { value: intensity },
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export function CausticsSpotlight({
  position = [0, -0.5, 0],
  scale = 15,
  intensity = 1.2,
  color = 0xffd700,
}) {
  const meshRef = useRef();
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta * 0.4;
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = timeRef.current;
      meshRef.current.rotation.z = timeRef.current * 0.02;
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      position={position} 
      rotation={[-Math.PI / 2, 0, 0]}
      scale={scale}
    >
      <circleGeometry args={[1, 64]} />
      <shaderMaterial
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec3 uColor;
          uniform float uIntensity;
          varying vec2 vUv;
          
          float noise(vec2 p) {
            return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
          }
          
          float fbm(vec2 p) {
            float v = 0.0;
            float a = 0.5;
            float f = 1.0;
            for (int i = 0; i < 6; i++) {
              v += a * noise(p * f);
              f *= 2.0;
              a *= 0.5;
            }
            return v;
          }
          
          void main() {
            vec2 uv = (vUv - 0.5) * 10.0;
            float dist = length(uv);
            
            // Moving caustic rings
            float rings = sin(dist * 3.0 - uTime * 2.0) * 0.5 + 0.5;
            
            // Organic distortion
            float organic = fbm(uv * 0.5 + uTime * 0.1);
            rings = rings * (0.5 + organic * 0.5);
            
            // Sharp caustic edges
            rings = pow(rings, 4.0);
            rings = smoothstep(0.2, 1.0, rings);
            
            // Vignette
            float vignette = 1.0 - smoothstep(0.0, 1.0, dist * 0.5);
            
            vec3 color = uColor * rings * vignette * uIntensity;
            float alpha = rings * vignette * 0.8;
            
            gl_FragColor = vec4(color, alpha);
          }
        `}
        uniforms={{
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(color) },
          uIntensity: { value: intensity },
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}