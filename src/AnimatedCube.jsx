import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedCube({ position, rotationSpeed, color = 'orange', scaleAnimation = { frequency: 1, amplitude: 0.2 } }) {
  const meshRef = useRef();
  const originalScale = useRef(new THREE.Vector3(1, 1, 1)); // Store original scale
  const texture = useTexture('https://threejsfundamentals.org/threejs/resources/images/wall.jpg');

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      // Rotation
      meshRef.current.rotation.x += delta * rotationSpeed.x;
      meshRef.current.rotation.y += delta * rotationSpeed.y;
      meshRef.current.rotation.z += delta * rotationSpeed.z;

      // Scaling
      const scaleValue = 1 + Math.sin(time * scaleAnimation.frequency) * scaleAnimation.amplitude;
      meshRef.current.scale.set(
        originalScale.current.x * scaleValue,
        originalScale.current.y * scaleValue,
        originalScale.current.z * scaleValue
      );
    }
  });

  // Set initial scale
  if (meshRef.current) {
    meshRef.current.scale.copy(originalScale.current);
  }

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} map={texture} />
    </mesh>
  );
}

export default AnimatedCube;
