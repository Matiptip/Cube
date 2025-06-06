import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedCube({
  position,
  rotationSpeed,
  color = 'orange',
  scaleAnimation = { frequency: 1, amplitude: 0.2 },
  soundUrl
}) {
  const meshRef = useRef();
  const originalScale = useRef(new THREE.Vector3(1, 1, 1));
  const texture = useTexture('https://threejsfundamentals.org/threejs/resources/images/wall.jpg');

  const audioContextRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const gainNodeRef = useRef(null);
  const [isAudioReady, setIsAudioReady] = useState(false);

  useEffect(() => {
    if (!soundUrl) return;

    let localAudioContext;
    let localSourceNode;

    const setupAudio = async () => {
      try {
        localAudioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = localAudioContext;

        gainNodeRef.current = localAudioContext.createGain();
        gainNodeRef.current.gain.value = 0.5; // Default volume
        gainNodeRef.current.connect(localAudioContext.destination);

        const response = await fetch(soundUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch sound: ${response.status} ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await localAudioContext.decodeAudioData(arrayBuffer);

        localSourceNode = localAudioContext.createBufferSource();
        sourceNodeRef.current = localSourceNode;
        localSourceNode.buffer = audioBuffer;
        localSourceNode.loop = true;
        localSourceNode.connect(gainNodeRef.current);

        // Autoplay might be blocked by the browser initially
        // User interaction might be needed to start sounds globally
        try {
          await localAudioContext.resume(); // Try to resume context if suspended
          localSourceNode.start(0);
          setIsAudioReady(true);
        } catch (e) {
          console.warn("Audio autoplay was blocked. User interaction might be required.", e);
          // Fallback: set audio ready, but sound won't play until resumed elsewhere
          setIsAudioReady(true);
        }

      } catch (error) {
        console.error("Error setting up audio:", error);
      }
    };

    setupAudio();

    return () => {
      if (localSourceNode) {
        localSourceNode.stop();
        localSourceNode.disconnect();
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
      }
      if (localAudioContext) {
        // Check if context is already closed before attempting to close it
        if (localAudioContext.state !== 'closed') {
          localAudioContext.close().catch(console.error);
        }
      }
      setIsAudioReady(false);
      audioContextRef.current = null;
      sourceNodeRef.current = null;
      gainNodeRef.current = null;
    };
  }, [soundUrl]);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      // Rotation
      meshRef.current.rotation.x += delta * rotationSpeed.x;
      meshRef.current.rotation.y += delta * rotationSpeed.y;
      meshRef.current.rotation.z += delta * rotationSpeed.z;

      // Scaling
      const baseScale = 1.0;
      const scaleValue = baseScale + Math.sin(time * scaleAnimation.frequency) * scaleAnimation.amplitude;
      meshRef.current.scale.set(
        originalScale.current.x * scaleValue,
        originalScale.current.y * scaleValue,
        originalScale.current.z * scaleValue
      );

      // Pitch modulation based on scale
      if (isAudioReady && sourceNodeRef.current && gainNodeRef.current) {
        // Ensure audio context is running, might be suspended by autoplay policies
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
          // Attempt to resume, ideally this is done via user interaction
          // audioContextRef.current.resume().catch(console.warn);
        }

        const currentScaleMagnitude = meshRef.current.scale.x / originalScale.current.x;
        // Example: Playback rate between 0.5 and 1.5
        // Adjust the mapping based on expected scale variation
        let playbackRate = 0.5 + (currentScaleMagnitude - (baseScale - scaleAnimation.amplitude)) / (2 * scaleAnimation.amplitude);
        playbackRate = Math.max(0.5, Math.min(playbackRate, 2.0)); // Clamp the rate

        if (sourceNodeRef.current.playbackRate) {
           sourceNodeRef.current.playbackRate.value = playbackRate;
        }
      }
    }
  });

  // Set initial scale
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.scale.copy(originalScale.current);
    }
  }, []);


  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} map={texture} />
    </mesh>
  );
}

export default AnimatedCube;
