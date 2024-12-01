'use client'

import { useRef, useEffect } from "react";
import ComponentBox from "@/components/component-box";
import * as THREE from "three";

export default function ThreeDView({ attitudes, posx, posy, width, height }) {
  return (
    <ComponentBox
      posx={posx} posy={posy}
      width={width} height={height}
    >
      <ThreeDGraph attitudes={attitudes} />
    </ComponentBox>
  );
}

function ThreeDGraph({ attitudes }) {
  const mountRef = useRef(null);
  const arrowRef = useRef(null); // Ref to store the arrow
  const cameraRef = useRef(null);

  useEffect(() => {
    // Create Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(5, 5, 5);
    camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    mountRef.current.appendChild(renderer.domElement);

    // Resize to fit container
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

    // Grid Helper (XY Plane)
    const gridHelper = new THREE.GridHelper(10, 10);
    gridHelper.rotation.x = Math.PI / 2; // Rotate to align with XY plane
    scene.add(gridHelper);

    // Axes Helper
    const axesHelper = new THREE.AxesHelper(5); // Length of axes
    scene.add(axesHelper);

    // Add Axis Labels
    const createLabel = (text, position) => {
      const loader = new THREE.TextureLoader();
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      context.font = "Bold 48px Arial";
      context.fillStyle = "black";
      context.fillText(text, 0, 50);

      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(1, 0.5, 1);
      sprite.position.copy(position);
      scene.add(sprite);
    };

    createLabel("X", new THREE.Vector3(6, 0, 0));
    createLabel("Y", new THREE.Vector3(0, 6, 0));
    createLabel("Z", new THREE.Vector3(0, 0, 6));

    // Function to generate an arrow
    function createArrow(scene, position, yaw, pitch, roll, length=1, color=0x800080) {
      const direction = new THREE.Vector3(0, 0, 1);
      const rotation = new THREE.Euler(
        THREE.MathUtils.degToRad(pitch),
        THREE.MathUtils.degToRad(yaw),
        THREE.MathUtils.degToRad(roll)
      );
      direction.applyEuler(rotation);

      const arrow = new THREE.ArrowHelper(direction, position, length, color, 0.5*length, 0.25*length);
      scene.add(arrow);
      return arrow; // Return the created arrow
    }

    arrowRef.current = createArrow(scene, new THREE.Vector3(0, 0, 0), 0, 0, 0);

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      if (mountRef.current) {
        // Dispose of the renderer and remove the DOM element safely
        renderer.dispose();
        mountRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    // Function to update arrow's position and orientation
    function updateArrow(arrow, position, yaw, pitch, roll) {
      const direction = new THREE.Vector3(0, 0, 1);
      const rotation = new THREE.Euler(
        THREE.MathUtils.degToRad(pitch),
        THREE.MathUtils.degToRad(yaw),
        THREE.MathUtils.degToRad(roll)
      );
      direction.applyEuler(rotation);

      arrow.position.copy(position); // Update position
      arrow.setDirection(direction); // Update direction
      cameraRef.current.lookAt(0, 0, 0);
    }

    if (attitudes.length > 0 && arrowRef.current) {
      const curr_att = attitudes[attitudes.length - 1];
      // Update the arrow based on the last attitude in the array
      updateArrow(
        arrowRef.current,
        new THREE.Vector3(curr_att.x, curr_att.y, curr_att.z),
        curr_att.yaw,
        curr_att.pitch,
        curr_att.roll
      );
    }
  }, [attitudes]); // Runs whenever attitudes prop changes

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }}></div>;
}