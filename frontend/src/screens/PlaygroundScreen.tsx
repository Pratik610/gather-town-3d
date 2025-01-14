import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import Scene from "../components/Scene";
import { useState } from "react";

const PlaygroundScreen = () => {
  const [users, setUsers] = useState<any>(null);
  return (
    <div style={{ height: "100dvh" }} className=" grid grid-cols-10">
      <div className="col-span-8 bg-slate-800">
        {" "}
        <Canvas
          shadows={{ type: THREE.PCFSoftShadowMap }}
          style={{ minHeight: "100%", zIndex: "9" }}
          camera={{ fov: 21, position: [0, 0, 3.4] }}
        >
          <Scene users={users} setUsers={setUsers} />
        </Canvas>
      </div>
      <div className="col-span-2 bg-gradient-to-r from-zinc-900 to-zinc-800">
        <div></div>
      </div>
    </div>
  );
};

export default PlaygroundScreen;
