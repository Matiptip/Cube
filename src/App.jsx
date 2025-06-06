import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import AnimatedCube from './AnimatedCube';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => gl.setClearColor('#222222')}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />

        <AnimatedCube
          position={[-2.5, 0, 0]}
          rotationSpeed={{ x: 0.2, y: 0.3, z: 0.1 }}
          color="skyblue"
          scaleAnimation={{ frequency: 0.5, amplitude: 0.3 }}
          soundUrl="https://cdn.jsdelivr.net/gh/kvsrkg/js-codepen-assets@master/audio/coin.wav"
        />
        <AnimatedCube
          position={[0, 0, -2]}
          rotationSpeed={{ x: 0.1, y: 0.2, z: 0.3 }}
          color="lightgreen"
          soundUrl="https://cdn.jsdelivr.net/gh/kvsrkg/js-codepen-assets@master/audio/jump.wav"
        />
        <AnimatedCube
          position={[2.5, 0, 0]}
          rotationSpeed={{ x: 0.3, y: 0.1, z: 0.2 }}
          color="salmon"
          scaleAnimation={{ frequency: 1.5, amplitude: 0.15 }}
          soundUrl="https://cdn.jsdelivr.net/gh/kvsrkg/js-codepen-assets@master/audio/laser.wav"
        />
        <OrbitControls />

        <EffectComposer>
          <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} height={300} intensity={0.7} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}