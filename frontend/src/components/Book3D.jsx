import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const SpinningBook = () => {
  const meshRef = useRef();
  
  // Create a spinning animation
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef} scale={2}>
      <boxGeometry args={[1, 1.5, 0.2]} />
      
      {/* THIS IS THE FIX:
        Instead of loading image textures, we're just applying
        simple colors to the 6 sides of the box. This
        prevents the "Could not load" crash.
      */}
      <meshStandardMaterial attach="material-0" color="white" />
      <meshStandardMaterial attach="material-1" color="white" />
      <meshStandardMaterial attach="material-2" color="white" />
      <meshStandardMaterial attach="material-3" color="white" />
      <meshStandardMaterial attach="material-4" color="#4a4a8f" />
      <meshStandardMaterial attach="material-5" color="#2a2a5f" />
    </mesh>
  );
};

export default function Book3D() {
  return (
    <Canvas style={{ height: '300px', width: '100%' }}>
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <SpinningBook />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}