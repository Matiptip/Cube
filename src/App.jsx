import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import FuturisticCube from './FuturisticCube.jsx'

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas>
        <EffectComposer>
          <ambientLight intensity={0.2} />
          <pointLight position={[5, 5, 5]} intensity={1.5} color="#6000ff" />
          <FuturisticCube />
          <OrbitControls />
          <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} height={300} intensity={1} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}