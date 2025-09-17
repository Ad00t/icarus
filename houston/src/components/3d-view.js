'use client'

import { useRef, useEffect } from "react";
import ComponentBox from "@/components/component-box";
import * as THREE from "three";

export default function ThreeDView({ posesRef, setChartData, posx, posy, width, height }) { 
  const mountRef = useRef(null);
  const rocketRef = useRef(null);
  const cameraRef = useRef(null);

  const cameraOff = new THREE.Vector3(5, 5, 5);

  const alignToZpos = new THREE.Quaternion();
  alignToZpos.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.copy(cameraOff);
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
    gridHelper.material.linewidth = 1;
    gridHelper.material.color.set(0xEEEEEE);
    scene.add(gridHelper);

    const axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);

    function createRocket(scene, color=0x800080) {
      const geometry = new THREE.BoxGeometry(0.1, 0.1, 1); 
      geometry.translate(0, 0, 0.5);
      const material = new THREE.MeshBasicMaterial({ color }); 
      const rocket = new THREE.Mesh(geometry, material);
      const position = new THREE.Vector3(0, 0, 0);
      rocket.position.copy(position);
      const quaternion = new THREE.Quaternion(0, 0.7, 0, 0.7);
      rocket.quaternion.copy(quaternion).multiply(alignToZpos);
      scene.add(rocket);
      return rocket;
    }
    rocketRef.current = createRocket(scene);

    let distance = camera.position.distanceTo(rocketRef.current.position);
    const handleScroll = (event) => {
        event.preventDefault();
        const target = rocketRef.current.position;
        distance += event.deltaY * 0.01;
        distance = Math.max(1, Math.min(50, distance));
        const direction = new THREE.Vector3().subVectors(camera.position, target).normalize();
        cameraOff.copy(direction.multiplyScalar(distance));
    };
    mountRef.current.addEventListener("wheel", handleScroll);

    const animate = () => {
      requestAnimationFrame(animate);
      if (rocketRef.current && posesRef.current.length > 0) {
        const currPose = posesRef.current[posesRef.current.length - 1];
        rocketRef.current.position.lerp(currPose.pos, 0.1);
        rocketRef.current.quaternion.slerp(currPose.quat, 0.1);
        const camPos = rocketRef.current.position.clone().add(cameraOff);
        cameraRef.current.position.copy(camPos);
        cameraRef.current.lookAt(rocketRef.current.position);
      }
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (mountRef.current) {
        renderer.dispose();
        mountRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("wheel", handleScroll);
    };
  }, []);

  return (
    <ComponentBox
      posx={posx} posy={posy}
      width={width} height={height}
    >
      <div ref={mountRef} style={{ width: "100%", height: "100%" }}></div>
    </ComponentBox>
  );
}