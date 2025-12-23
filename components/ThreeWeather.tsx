import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Cloud, Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { X, CloudSun, Sun, Cloud as CloudIcon } from 'lucide-react';

// Augment JSX.IntrinsicElements
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      pointLight: any;
      mesh: any;
      sphereGeometry: any;
      meshStandardMaterial: any;
      group: any;
    }
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      pointLight: any;
      mesh: any;
      sphereGeometry: any;
      meshStandardMaterial: any;
      group: any;
    }
  }
}

interface Props {
  onClose: () => void;
  day: string;
}

const Sun3D = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.2;
  });
  return (
    <mesh ref={meshRef} position={[2, 2, -2]}>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshStandardMaterial color="#FDB813" emissive="#FDB813" emissiveIntensity={2} toneMapped={false} />
      <pointLight intensity={2} distance={10} decay={2} color="#FDB813" />
    </mesh>
  );
};

const FloatingCloud = ({ position, speed }: { position: [number, number, number], speed: number }) => {
    const ref = useRef<THREE.Group>(null);
    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.position.x += delta * speed;
            if (ref.current.position.x > 8) ref.current.position.x = -8;
        }
    });
    return (
        <group ref={ref} position={position}>
            <Cloud opacity={0.8} speed={0.4} width={3} depth={0.5} segments={10} color="white" />
        </group>
    );
};

const WeatherScene = () => (
    <>
      <ambientLight intensity={0.5} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Sun3D />
      <FloatingCloud position={[-3, 1, 0]} speed={0.2} />
      <FloatingCloud position={[3, -1, 1]} speed={0.3} />
      <FloatingCloud position={[0, 2, -1]} speed={0.15} />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} enablePan={false} />
    </>
);

const WEATHER_DATA = [
    { day: '1/1', icon: Sun, temp: '18°', label: '晴朗' },
    { day: '1/2', icon: CloudSun, temp: '20°', label: '多雲' },
    { day: '1/3', icon: Sun, temp: '22°', label: '暖陽' },
    { day: '1/4', icon: CloudIcon, temp: '19°', label: '陰天' },
];

export const ThreeWeather: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
       {/* Close Button */}
       <button 
         onClick={onClose}
         className="absolute top-6 right-6 text-white bg-white/10 p-2 rounded-full z-50 hover:bg-white/20 transition-all backdrop-blur-md"
       >
         <X size={24} />
       </button>
       
       {/* 3D Background */}
       <div className="absolute inset-0 z-0">
         <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
            <WeatherScene />
         </Canvas>
       </div>

       {/* Top Info with Shadow for Readability */}
       <div className="relative z-10 pt-16 px-6 text-center pointer-events-none">
            <h2 className="text-4xl font-black text-white tracking-tighter drop-shadow-2xl shadow-black">
                TAICHUNG
            </h2>
            <div className="text-sm font-bold text-yellow-300 tracking-[0.2em] mt-2 uppercase opacity-100 drop-shadow-md">
                Weather Forecast
            </div>
       </div>

       {/* Bottom Overlay Card with Darker Glass */}
       <div className="mt-auto relative z-10 p-6 pb-12">
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-2xl">
                <div className="flex justify-between items-center">
                    {WEATHER_DATA.map((item, index) => (
                        <div key={index} className="flex flex-col items-center gap-2 flex-1">
                            <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">
                                {item.day}
                            </span>
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shadow-inner ring-1 ring-white/10">
                                <item.icon size={20} className="text-white" />
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-bold text-white leading-none">{item.temp}</div>
                                <div className="text-[10px] text-white/90 mt-1 font-medium">{item.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <p className="text-center text-white/40 text-[10px] mt-6 tracking-widest uppercase font-medium">
                Swipe to rotate view
            </p>
       </div>
    </div>
  );
};