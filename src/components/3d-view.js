'use client'

import { useRef, useEffect } from "react";
import ComponentBox from "@/components/component-box";
import * as THREE from "three";

export default function ThreeDView({ attitudesRef, attitudesLength, posx, posy, width, height }) {
  return (
    <ComponentBox
      posx={posx} posy={posy}
      width={width} height={height}
    >
      <ThreeDGraph attitudesRef={attitudesRef} attitudesLength={attitudesLength} />
    </ComponentBox>
  );
}

function ThreeDGraph({ attitudesRef, attitudesLength }) {
  const mountRef = useRef(null);
  const arrowRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(10, 10, 10);
    camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    mountRef.current.appendChild(renderer.domElement);

    const handleResize = () => {
      renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      );
      camera.aspect =
        mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    const gridHelper = new THREE.GridHelper(500, 500);
    gridHelper.rotation.x = Math.PI / 2;
    scene.add(gridHelper);

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    function createArrow(scene, position, rotation, length=1, color=0x800080) {
      const direction = new THREE.Vector3(0, 0, 0);
      direction.applyQuaternion(rotation)
      const arrow = new THREE.ArrowHelper(direction, position, length, color, 0.5*length, 0.25*length);
      scene.add(arrow);
      return arrow;
    }
    arrowRef.current = createArrow(scene, new THREE.Vector3(0, 0, 0), new THREE.Quaternion(0, 0, 0, 0));

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (mountRef.current) {
        renderer.dispose();
        mountRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    function updateArrow(arrow, position, rotation) {
      const direction = new THREE.Vector3(0, 0, 0);
      direction.applyQuaternion(rotation);
      arrow.position.copy(position);
      arrow.setDirection(direction);
      cameraRef.current.lookAt(position);
    }

    if (attitudesLength > 0 && arrowRef.current) {
      const curr_att = attitudesRef.current[attitudesRef.current.length - 1];
      updateArrow(
        arrowRef.current,
        new THREE.Vector3(curr_att.x, curr_att.y, curr_att.z),
        new THREE.Quaternion(curr_att.qi, curr_att.qj, curr_att.qk, curr_att.qr)
      );
    }
  }, [attitudesLength]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }}></div>;
}