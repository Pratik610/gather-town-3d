import * as THREE from "three";
import { useParams } from "react-router-dom";
import { useLoader, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three-stdlib";
import { useEffect } from "react";
import { Html } from "@react-three/drei";
import { useState } from "react";

const Avatar: React.FC<any> = ({ socket, details }) => {
  const avatar = useLoader(GLTFLoader, `../avatar.glb`);

  const [nameTagPosition, setNameTagPosition] = useState<[number, number, number]>([0, 0, 0])

  const { id } = useParams();

  useFrame((state) => {
    const avatarPosition = avatar.scene.position; // Assuming `avatar.scene` is a loaded 3D model
    const offset = { x: 2, y: 1, z: 2 }; // Adjust the offset as needed for the desired camera position

    // Move the camera to follow the model
    state.camera.position.set(
      avatarPosition.x + offset.x,
      avatarPosition.y + offset.y,
      avatarPosition.z + offset.z
    );
    state.camera.lookAt(avatar.scene.position);

    setNameTagPosition([
      avatarPosition.x - 0.05,
      0.22,
      avatarPosition.z,
    ]);
  });



  useEffect(() => {
    if (!avatar || !avatar.scene || !avatar.animations) return;

    const mixer1 = new THREE.AnimationMixer(avatar.scene);
    const idleAction = mixer1.clipAction(avatar.animations[0]);
    idleAction.play();
    function animate() {
      requestAnimationFrame(animate);
      // Update animation mixer
      mixer1.update(1);
    }
    animate();
  }, [avatar]);

  useEffect(() => {
    if (!avatar || !avatar.scene || !avatar.animations) return;

    // Create a single AnimationMixer
    const mixer = new THREE.AnimationMixer(avatar.scene);

    // Animation actions
    const walkAction = mixer.clipAction(avatar.animations[3]); // Walking animation
    const runAction = mixer.clipAction(avatar.animations[1]); // Walking animation
    const idleAction = mixer.clipAction(avatar.animations[0]); // Idle animation

    let movingForward = false;
    let movingBackward = false;
    let movingLeft = false;
    let movingRight = false;

    let running = false;

    let activeAction = idleAction; // Track the currently active action

    // Start idle animation by default
    idleAction.play();
    let keysPressed: any = {};

    const handleKeyDown = (e: any) => {
      keysPressed[String(e.key).toLowerCase()] = true;

      //  Forward
      if (
        keysPressed["w"] &&
        !keysPressed["shift"] &&
        activeAction !== walkAction
      ) {
        movingRight = false;
        activeAction.stop();
        activeAction = walkAction;
        avatar.scene.rotation.set(0, 0, 0);
        walkAction.play();
        movingForward = true;
      }

      if (
        keysPressed["w"] &&
        keysPressed["shift"] &&
        activeAction !== runAction
      ) {
        activeAction.stop();
        activeAction = runAction;
        avatar.scene.rotation.set(0, 0, 0);
        movingForward = true;
        runAction.play();
        running = true;
      }

      // ..........................

      //  BackWard
      if (
        keysPressed["s"] &&
        !keysPressed["shift"] &&
        activeAction !== walkAction
      ) {
        movingRight = false;

        activeAction.stop();
        activeAction = walkAction;
        avatar.scene.rotation.set(0, Math.PI / 1, 0);
        walkAction.play();
        movingBackward = true;
      }

      if (
        keysPressed["s"] &&
        keysPressed["shift"] &&
        activeAction !== runAction
      ) {
        activeAction.stop();
        activeAction = runAction;
        avatar.scene.rotation.set(0, Math.PI / 1, 0);
        movingBackward = true;
        runAction.play();
        running = true;
      }

      // .......................................

      // Left

      if (
        keysPressed["a"] &&
        !keysPressed["shift"] &&
        activeAction !== walkAction
      ) {
        movingRight = false;

        activeAction.stop();
        activeAction = walkAction;
        avatar.scene.rotation.set(0, Math.PI / 2, 0);
        walkAction.play();
        movingLeft = true;
      }

      if (
        keysPressed["a"] &&
        keysPressed["shift"] &&
        activeAction !== runAction
      ) {
        activeAction.stop();
        activeAction = runAction;
        avatar.scene.rotation.set(0, Math.PI / 2, 0);
        runAction.play();
        movingLeft = true;
        running = true;
      }

      // ...................

      // Right

      if (
        keysPressed["d"] &&
        !keysPressed["shift"] &&
        activeAction !== walkAction
      ) {
        movingRight = false;

        activeAction.stop();
        activeAction = walkAction;
        avatar.scene.rotation.set(0, Math.PI / -2, 0);
        walkAction.play();
        movingRight = true;
      }

      if (
        keysPressed["d"] &&
        keysPressed["shift"] &&
        activeAction !== runAction
      ) {
        activeAction.stop();
        activeAction = runAction;
        avatar.scene.rotation.set(0, Math.PI / -2, 0);
        runAction.play();
        movingRight = true;
        running = true;
      }
    };

    const handleKeyUp = (e: any) => {
      delete keysPressed[String(e.key).toLowerCase()];
      if (activeAction !== idleAction) {
        if (Object.keys(keysPressed).length === 0) {
          running = false;
          activeAction.stop();
          activeAction = idleAction;
          idleAction.play();
          movingForward = false;
          movingBackward = false;
          movingLeft = false;
          movingRight = false;

          return;
        }

        if (Object.keys(keysPressed).length === 1 && keysPressed["shift"]) {
          activeAction.stop();
          activeAction = idleAction;
          idleAction.play();
          running = false;
          movingForward = false;

          movingBackward = false;

          movingLeft = false;

          movingRight = false;
        }

        if (!keysPressed["w"] && !keysPressed["shift"]) {
          movingForward = false;
        }

        if (keysPressed["w"] && !keysPressed["shift"]) {
          if (activeAction !== walkAction) {
            running = false;

            activeAction.stop();
            activeAction = walkAction;
            avatar.scene.rotation.set(0, 0, 0);

            walkAction.play();
            movingForward = true;
          }
        }

        // ............

        if (!keysPressed["s"] && !keysPressed["shift"]) {
          movingBackward = false;
        }

        if (keysPressed["s"] && !keysPressed["shift"]) {
          if (activeAction !== walkAction) {
            running = false;
            activeAction.stop();
            activeAction = walkAction;
            avatar.scene.rotation.set(0, Math.PI / 1, 0);
            walkAction.play();

            movingBackward = true;
          }
        }

        // ...........

        if (!keysPressed["a"] && !keysPressed["shift"]) {
          movingLeft = false;
        }

        if (keysPressed["a"] && !keysPressed["shift"]) {
          if (activeAction !== walkAction) {
            movingLeft = true;
            activeAction.stop();
            activeAction = walkAction;
            avatar.scene.rotation.set(0, Math.PI / 2, 0);
            walkAction.play();
            running = false;
          }
        }

        if (!keysPressed["d"] && !keysPressed["shift"]) {
          movingRight = false;
        }

        if (keysPressed["d"] && !keysPressed["shift"]) {
          if (activeAction !== walkAction) {
            movingRight = true;
            activeAction.stop();
            activeAction = walkAction;
            avatar.scene.rotation.set(0, Math.PI / -2, 0);
            walkAction.play();
            running = false;
          }
        }
      }
    };

    // Event listeners"keyup", handleKeyUp);
    // Event listeners
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    // Animation update loop
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta(); // Time since last frame
      mixer.update(delta); // Update mixer with delta time
      // Move the model if walking

      const walkingSpeed: number = 0.15;
      const runningSpeed: number = 0.4;

      const speed = running ? runningSpeed : walkingSpeed;

      if (movingForward) {
        avatar.scene.position.z -= speed * delta; // Move forward along the Z-axis
      }
      if (movingBackward) {
        avatar.scene.position.z += speed * delta; // Move forward along the Z-axis
      }

      if (movingLeft) {
        avatar.scene.position.x -= speed * delta; // Move forward along the Z-axis
      }

      if (movingRight) {
        avatar.scene.position.x += speed * delta; // Move forward along the Z-axis
      }
      const avatarPosition = avatar.scene.position;
      const data = {
        workspaceId: id,
        type: "update-movements",
        x: avatarPosition.x,
        y: avatarPosition.y,
        z: avatarPosition.z,
        movingForward,
        movingBackward,
        movingLeft,
        movingRight,
        running,
      };
      socket.send(JSON.stringify(data));
    };
    animate();

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      mixer.stopAllAction();
    };
  }, [avatar, socket]);

  return (
    avatar && (
      <group>
        <Html position={nameTagPosition} style={{ pointerEvents: "none" }}>
          <div className="w-28  " >
            <p className="text-center whitespace-nowrap overflow-hidden  text-ellipsis" >{details.name}</p>
          </div>
        </Html>

        <primitive object={avatar.scene} scale={[0.1, 0.1, 0.1]} />
      </group>
    )
  );
};

export default Avatar;
