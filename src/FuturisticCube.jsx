import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

export default function FuturisticCube({ rotationSpeed = 0.01 }) {
  const meshRef = useRef();
  const texture = useLoader(TextureLoader, '/sci-fi-panel.png');

  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Rotation
      meshRef.current.rotation.x += rotationSpeed;
      meshRef.current.rotation.y += rotationSpeed;

      // Pulsating scale
      const scale = 1 + 0.1 * Math.sin(clock.getElapsedTime() * 2);
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        map={texture}
        metalness={0.8}
        roughness={0.2}
        emissive="#003333"
        emissiveIntensity={1}
      />
    </mesh>
  );
}
