/* eslint-disable react/no-unknown-property */
import { useRef, useEffect } from 'react';
import { Canvas, useThree } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment } from "@react-three/drei";

// Original platform model
function PlatformModel(props) {
  const { scene } = useGLTF("/round_platform.glb");
  const modelRef = useRef();
  
  return <primitive ref={modelRef} object={scene} {...props} />;
}

// New model to be placed above the platform
// eslint-disable-next-line react/prop-types
function SecondModel({ modelPath, ...props }) {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef();
  
  return <primitive ref={modelRef} object={scene} {...props} />;
}

// Camera controller to set initial position
function CameraController() {
  const { camera } = useThree();
  
  useEffect(() => {
    // Set camera to look directly at the models
    camera.position.set(0, -5, 10); // Position camera at same height as models but moved back
    camera.lookAt(0, -9, 0); // Look directly at the model center
  }, [camera]);
  
  return null;
}

const AvatarPage = () => {
  return (
    <Canvas
      dpr={[1, 2]}
      shadows
      camera={{ fov: 45, position: [0, -6, -5] }} // Initial position before controller takes over
      style={{ position: "absolute", width: "100%", height: "100%" }}
    >
      <CameraController />
      
      <color attach="background" args={["#101010"]} />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      
      <Environment preset="city" />
      
      {/* Ground plane */}
      <mesh 
        position={[0, -10, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[10, 10]} />
        <shadowMaterial opacity={0.3} />
      </mesh>
      
      {/* Platform Model */}
      <PlatformModel 
        scale={0.6}
        position={[0, -9, 0]}
        rotation={[0, 0, 0]} 
      />
      
      {/* Second Model placed above the platform */}
      <SecondModel 
        modelPath="/mt.glb"
        scale={1}
        position={[0, -9, 0]} // Raised slightly above platform
        rotation={[0, 0, 0]}
      />
      
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        autoRotate={false}
        rotateSpeed={0.5}
        minPolarAngle={Math.PI / 12}
        maxPolarAngle={Math.PI / 2}
        target={[0, -9, 0]}
        minDistance={1}
        maxDistance={10}
      />
    </Canvas>
  );
};

export default AvatarPage;