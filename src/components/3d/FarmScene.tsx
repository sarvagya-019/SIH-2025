import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Text3D, Center } from '@react-three/drei';
import { Suspense } from 'react';

function Farm3D() {
  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#4ade80" />
      </mesh>
      
      {/* Farm Buildings */}
      <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
        <mesh position={[-3, 0, 0]}>
          <boxGeometry args={[2, 2, 3]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
      </Float>
      
      <Float speed={0.7} rotationIntensity={0.1} floatIntensity={0.3}>
        <mesh position={[3, 0, 0]}>
          <boxGeometry args={[1.5, 1.5, 2]} />
          <meshStandardMaterial color="#059669" />
        </mesh>
      </Float>
      
      {/* Animals (simplified) */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.4}>
        <group position={[0, -1, 2]}>
          <mesh>
            <sphereGeometry args={[0.3]} />
            <meshStandardMaterial color="#fbbf24" />
          </mesh>
          <mesh position={[0.8, 0, 0]}>
            <sphereGeometry args={[0.25]} />
            <meshStandardMaterial color="#f59e0b" />
          </mesh>
        </group>
      </Float>
      
      {/* 3D Text */}
      <Center position={[0, 3, 0]}>
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={0.5}
          height={0.1}
          curveSegments={12}
        >
          VetTrace
          <meshStandardMaterial color="#059669" />
        </Text3D>
      </Center>
    </group>
  );
}

export const FarmScene = () => {
  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Farm3D />
          <Environment preset="sunset" />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 4}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};