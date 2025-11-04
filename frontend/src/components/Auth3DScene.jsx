import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// This component is a single rotating shape
function Shape({ geometry, material, position, rotationSpeed }) {
  const meshRef = useRef();
  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta * rotationSpeed.x;
    meshRef.current.rotation.y += delta * rotationSpeed.y;
  });
  return <mesh ref={meshRef} position={position} geometry={geometry} material={material} />;
}

// This component creates the whole scene
export default function Auth3DScene() {
  // We create the geometries and materials once to be more performant
  const shapes = useMemo(() => {
    const geometries = [
      new THREE.BoxGeometry(1.5, 1.5, 1.5),
      new THREE.IcosahedronGeometry(1, 0),
      new THREE.TorusGeometry(1, 0.3, 16, 100),
    ];
    const material = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: 0.1,
      metalness: 0.9,
    });
    
    return [
      {
        geometry: geometries[0],
        material: material,
        position: [-3, 1, -2],
        rotationSpeed: { x: 0.1, y: 0.1 },
      },
      {
        geometry: geometries[1],
        material: material,
        position: [2, -1, -1],
        rotationSpeed: { x: 0.2, y: -0.1 },
      },
      {
        geometry: geometries[2],
        material: material,
        position: [0, 2, 2],
        rotationSpeed: { x: -0.1, y: 0.2 },
      },
    ];
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 35 }}
      style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}
    >
      <ambientLight intensity={0.5} />
      {/* This light uses your CSS primary color! */}
      <pointLight 
        position={[-10, -10, -10]} 
        color={getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#8B5CF6'} 
        intensity={1000} 
      />
      <pointLight position={[10, 10, 10]} intensity={150} />

      {shapes.map((props, i) => (
        <Shape key={i} {...props} />
      ))}
    </Canvas>
  );
}