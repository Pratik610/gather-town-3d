import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import Scene from "./Scene";

function App() {
  return (
    <div style={{ height: "100dvh" }}>
      <Canvas
        shadows={{ type: THREE.PCFSoftShadowMap }}
        style={{ minHeight: "100%", zIndex: "9" }}
        camera={{ fov: 21, position: [0, 0, 3.4] }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}

export default App;
