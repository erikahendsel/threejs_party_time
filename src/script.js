import "./style.css";
import * as THREE from "three";
import * as lilGui from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

//Debug
const gui = new lilGui.GUI();

//Canvas
const canvas = document.querySelector("canvas.webgl");

//Scene
const scene = new THREE.Scene();

//Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//Camera
var camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.z = 4;
scene.add(camera);

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//Axes helper
// const axesHelper = new THREE.AxesHelper(3);
// scene.add(axesHelper);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

//Texture
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/textures/matcaps/3.png");

//Material
const textMaterial = new THREE.MeshNormalMaterial();

const discoBallMaterial = new THREE.MeshMatcapMaterial({
  matcap: matcapTexture,
});
discoBallMaterial.flatShading = true;

//Font with text
const fontLoader = new FontLoader();

fontLoader.load("/fonts/Zen_Dots_Regular.json", (font) => {
  const textGeometry = new TextGeometry("Party time \\(o,o)/", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });
  textGeometry.center();
  const text = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(text);
});

const discoBall = new THREE.SphereGeometry(0.3, 20, 10);
// material.wireframe = true;
// gui.add(discoBall.parameters, "widthSegments").min(1).max(100);

for (let i = 0; i < 100; i++) {
  const donut = new THREE.Mesh(discoBall, discoBallMaterial);

  donut.position.x = (Math.random() - 0.5) * 10;
  donut.position.y = (Math.random() - 0.5) * 10;
  donut.position.z = (Math.random() - 0.5) * 10;

  donut.rotation.x = Math.random() * Math.PI;
  donut.rotation.y = Math.random() * Math.PI;

  const scale = Math.random();
  donut.scale.set(scale, scale, scale);

  scene.add(donut);
}

//Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);

const tick = () => {
  // Update controls
  controls.update();

  //Animate the disco balls
  discoBall.rotateX(0.004);
  discoBall.rotateY(0.004);

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
