"use client";
import Head from "next/head";
import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import RobotoFont from "typeface-roboto";
import { Text } from "@react-three/drei";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";

const CustomText = ({ position }) => {
  const [textGeometry, setTextGeometry] = useState(null);

  useEffect(() => {
    const loader = new FontLoader();
    loader.load("fonts/helvetiker_regular.typeface.json", (font) => {
      console.log(font);
      const geometry = new TextGeometry("Hello three.js!", {
        font,
        size: 80,
        height: 5,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 10,
        bevelSize: 8,
        bevelOffset: 0,
        bevelSegments: 5,
      });
      setTextGeometry(geometry);
    });
  }, []);

  return textGeometry ? (
    <mesh position={position}>
      <primitive object={textGeometry} attach="geometry" />
      <meshStandardMaterial attachArray={["materials", 0]} color="blue" />
    </mesh>
  ) : null;
};

const Model = ({ position }) => {
  // location of the 3D model
  const modelRef1 = useRef();
  const gltf = useLoader(GLTFLoader, "/astro/scene.gltf");

  useEffect(() => {
    if (modelRef1.current) {
      // Rotate the model about the Y-axis when the component is mounted
      modelRef1.current.rotation.y = Math.PI / -2; // Rotate by 45 degrees (adjust as needed)
    }
  }, [modelRef1]);

  return (
    <>
      {/* Use scale to control the size of the 3D model */}
      <primitive
        object={gltf.scene}
        scale={0.1}
        position={position}
        ref={modelRef1}
      />
    </>
  );
};
const Model2 = ({ position }) => {
  // location of the 3D model
  const gltf = useLoader(GLTFLoader, "/earth/scene.gltf");
  const modelRef = useRef();
  useFrame(() => {
    // Rotate the model about the Y-axis (adjust the speed as needed)
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.005; // Adjust the rotation speed as needed
    }
  });
  return (
    <>
      {/* Use scale to control the size of the 3D model */}
      <primitive
        object={gltf.scene}
        scale={1.2}
        position={position}
        ref={modelRef}
      />
    </>
  );
};

export default function Home() {
  const model2Position = [-1, 0, 0];
  const modelPosition = [1, 0, 0];
  return (
    <div>
      <Head>
        <title>Three.js Example</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="globe">
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 4], fov: 50 }}>
          <ambientLight intensity={0.5} />
          {/* <spotLight
            intensity={0.2}
            angle={0.1}
            penumbra={1}
            position={[10, 15, 10]}
            castShadow
          /> */}
          <Suspense fallback={null}>
            <Model2 position={model2Position} />
            <Model position={modelPosition} />
            <Text
              fontSize={0.1}
              font={RobotoFont}
              anchorX="center"
              anchorY="middle"
              position={[0.8, 1, 0]}
              depth={30}
            >
              HELLO TEAM
            </Text>
            <CustomText position={[0.8, 1, 0]} />
            {/* To add environment effect to the model */}
            {/* <Environment preset="city" /> */}
          </Suspense>
          <OrbitControls autoRotate={false} />
        </Canvas>
      </div>
    </div>
  );
}
