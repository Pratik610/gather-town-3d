import * as THREE from "three";
import React, { useState } from "react";
import { useLoader, useThree, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useEffect, useMemo, useRef } from "react";

const TeammateAvatar = React.memo(({ player }) => {
  const avatar = useLoader(GLTFLoader, `./avatar.glb?${player.id}`);

  const [currentAnimation, setcurrentAnimation] = useState<any>();

  const mixerRef = useRef<any | null>(null); // Persistent AnimationMixer
  const clockRef = useRef(new THREE.Clock()); // Persistent clock for delta time
  const currentAnimationRef = useRef<any| null>(null); // Track current animation



  useEffect(() => {
    if (avatar) {
      mixerRef.current = new THREE.AnimationMixer(avatar.scene);

      // Define animation actions
      const animations = {
        idle: mixerRef.current.clipAction(avatar.animations[0]),
        walk: mixerRef.current.clipAction(avatar.animations[3]),
        run: mixerRef.current.clipAction(avatar.animations[1]),
      };

      // Play idle animation initially
      animations.idle.play();
      currentAnimationRef.current = animations.idle;

      // Cleanup mixer on unmount
      return () => mixerRef.current?.stopAllAction();
    }
  }, [avatar]);

  useFrame(() => {
    if (avatar) {
      // Smooth position updates
      const currentPosition = avatar.scene.position;
      const targetPosition = new THREE.Vector3(player.x, player.y, player.z);
      currentPosition.lerp(targetPosition, 0.1);

      // Handle animations based on movement
      if (mixerRef.current) {
        const animations = {
          idle: mixerRef.current.clipAction(avatar.animations[0]),
          walk: mixerRef.current.clipAction(avatar.animations[3]),
          run: mixerRef.current.clipAction(avatar.animations[1]),
        };

        if (
          !player.movingForward &&
          !player.movingBackward &&
          !player.movingLeft &&
          !player.movingRight
        ) {
          // Play idle if not moving
          if (currentAnimationRef.current !== animations.idle) {
            currentAnimationRef.current?.fadeOut(0.2);
            animations.idle.reset().fadeIn(0.2).play();
            currentAnimationRef.current = animations.idle;
          }
        } else {
          // Determine if running or walking
          const isRunning = player.running;
          const animationToPlay = isRunning ? animations.run : animations.walk;

          if (currentAnimationRef.current !== animationToPlay) {
            currentAnimationRef.current?.fadeOut(0.2);
            animationToPlay.reset().fadeIn(0.2).play();
            currentAnimationRef.current = animationToPlay;
          }

          // Update rotation
          if (player.movingForward) avatar.scene.rotation.set(0, 0, 0);
          if (player.movingBackward) avatar.scene.rotation.set(0, Math.PI, 0);
          if (player.movingLeft) avatar.scene.rotation.set(0, Math.PI / 2, 0);
          if (player.movingRight) avatar.scene.rotation.set(0, -Math.PI / 2, 0);
        }
      }

      // Update mixer with delta time
      const delta = clockRef.current.getDelta();
      mixerRef.current?.update(delta);
    }
  });


  return avatar && <primitive object={avatar.scene} scale={[0.1, 0.1, 0.1]} />;
});
export default TeammateAvatar;
