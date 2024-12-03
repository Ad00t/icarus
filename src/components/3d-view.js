'use client'

import { useRef, useEffect } from "react";
import ComponentBox from "@/components/component-box";
import Button from "@mui/material/Button";
import * as THREE from "three";

export default function ThreeDView({ attitudesRef, posx, posy, width, height }) {
  function onReset() {
    attitudesRef.current.push({
      "ts": Date.now(),
      "qr": 0, "qi": 0, "qj": 0, "qk": 0,
      "ax": 0, "ay": 0, "az": 0,
      "vx": 0, "vy": 0, "vz": 0,
      "x": 0, "y": 0, "z": 0,
    });
  }
  
  return (
    <ComponentBox
      posx={posx} posy={posy}
      width={width} height={height}
    >
      <Button
        sx={{ width: '10px', margin: 'auto', marginTop: '10px', marginRight: '10px' }}
        variant="contained"
        onClick={onReset}
      >
        RESET
      </Button>
      <ThreeDGraph attitudesRef={attitudesRef}/>
    </ComponentBox>
  );
}

function ThreeDGraph({ attitudesRef }) {
  const mountRef = useRef(null);
  const rocketRef = useRef(null);
  const cameraRef = useRef(null);

  const cameraOff = new THREE.Vector3(10, 10, 10);

  const alignToZpos = new THREE.Quaternion();
  alignToZpos.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);

  const alignToZneg = new THREE.Quaternion();
  alignToZneg.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2);

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

    const animate = () => {
      requestAnimationFrame(animate);

      if (rocketRef.current) {
        const currAtt = attitudesRef.current[attitudesRef.current.length - 1];
        const rocketPosition = new THREE.Vector3(currAtt.x, currAtt.y, currAtt.z);
        const quaternion = new THREE.Quaternion(currAtt.qi, currAtt.qj, currAtt.qk, currAtt.qr);
        quaternion.multiply(alignToZneg);
        rocketRef.current.position.copy(rocketPosition);
        rocketRef.current.quaternion.copy(quaternion);
        const camPosition = new THREE.Vector3(currAtt.x, currAtt.y, currAtt.z).add(cameraOff);
        cameraRef.current.position.copy(camPosition);
        cameraRef.current.lookAt(rocketPosition);
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
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }}></div>;
}