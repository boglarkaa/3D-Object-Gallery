import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

//create scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

//add background music
const listener = new THREE.AudioListener();
camera.add(listener);

const audioLoader = new THREE.AudioLoader();
const bgMusic = new THREE.Audio(listener);
audioLoader.load("music.mp3", function (buffer) {
	bgMusic.setBuffer(buffer);
	bgMusic.setLoop(true);
	bgMusic.setVolume(0.5);
	bgMusic.play();
});

//create cube
const cubeGeometry = new THREE.BoxGeometry();
const cubeMaterial = new THREE.MeshStandardMaterial({
	color: 0xec9118,
	metalness: 0.35,
	roughness: 0.15,
	emissive: 0xff5900,
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.castShadow = true;
cube.receiveShadow = true;
scene.add(cube);

//create cone
const coneGeometry = new THREE.ConeGeometry(0.5, 1, 32);
const coneMaterial = new THREE.MeshStandardMaterial({
	color: 0xec9118,
	metalness: 0.35,
	roughness: 0.15,
	emissive: 0xff5900,
});
const cone = new THREE.Mesh(coneGeometry, coneMaterial);
cone.castShadow = true;
cone.receiveShadow = true;
cone.position.set(-3, 0, 0);
scene.add(cone);

//creaee sphere
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({
	color: 0xec9118,
	metalness: 0.35,
	roughness: 0.15,
	emissive: 0xff5900,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(3, 0, 0);
sphere.castShadow = true;
sphere.receiveShadow = true;
scene.add(sphere);

//create ground plane
const planeGeometry = new THREE.PlaneGeometry(
	window.innerWidth,
	window.innerHeight
);
const planeMaterial = new THREE.MeshPhongMaterial({
	color: 0xffdab9,
	side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.y = -0.9;
plane.receiveShadow = true;
plane.rotation.set(Math.PI / 2, 0, 0);
scene.add(plane);

//add directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 1, 1);
directionalLight.castShadow = true;
scene.add(directionalLight);

//add ambient light
const ambientLight = new THREE.AmbientLight(0xffc869);
scene.add(ambientLight);

//add point light
//light source for visualization
const lightSource = new THREE.SphereGeometry(0.02, 16, 8);

const pointLight = new THREE.PointLight(0xff7300, 15, 100);
pointLight.position.set(0, 2, 0);
pointLight.castShadow = true;
pointLight.add(
	new THREE.Mesh(lightSource, new THREE.MeshBasicMaterial({ color: 0xff7300 }))
);
scene.add(pointLight);

//function to move point light in a circle
let t = 0;
function moveLight() {
	requestAnimationFrame(moveLight);

	t += 0.03;
	pointLight.position.x = Math.cos(t);
	pointLight.position.z = Math.sin(t);

	renderer.render(scene, camera);
}

// Set up raycaster and mouse coordinates
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

//add functionality to the cube
//rotate it on click
document.addEventListener("click", onMouseClick);
let isRotating = false;

//add functionality to cone
//scale it on button click
let isScaling = false;
let coneScalingDirection = 1; // 1 for scaling up, -1 for scaling down

//add sound to object click
let clickSound;
audioLoader.load("click.mp3", function (buffer) {
	clickSound = new THREE.Audio(listener);
	clickSound.setBuffer(buffer);
	clickSound.setVolume(1);
});

//function to handle mouse click
function onMouseClick(event) {
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

	raycaster.setFromCamera(mouse, camera);
	const intersects = raycaster.intersectObjects(scene.children);

	//play sound on any object click
	for (let i = 0; i < intersects.length; i++) {
		//rotate cube on click
		if (intersects[i].object === cube) {
			isRotating = !isRotating;
			rotateCube();
			if (clickSound) {
				clickSound.play();
			}
			break;
			//scale cone on click
		} else if (intersects[i].object === cone) {
			isScaling = !isScaling;
			if (isScaling) {
				scaleCone();
				if (clickSound) {
					clickSound.play();
				}
			}
			break;
		} else if (intersects[i].object === sphere) {
			if (clickSound) {
				clickSound.play();
			}
		}
	}
}

//function to rotate the cube
function rotateCube() {
	if (isRotating) {
		requestAnimationFrame(rotateCube);
		cube.rotation.x += 0.05;
		cube.rotation.y += 0.05;

		renderer.render(scene, camera);
	}
}

//function to scale the cone
function scaleCone() {
	cone.scale.x += 0.01 * coneScalingDirection;
	cone.scale.y += 0.01 * coneScalingDirection;
	cone.scale.z += 0.01 * coneScalingDirection;

	renderer.render(scene, camera);

	//if it's scaling up and reacher upper limit
	//start scaling dowm
	if (coneScalingDirection === 1 && cone.scale.y >= 1.8) {
		coneScalingDirection = -1;
	}
	//if it's scaling down and reacher lower limit
	//start scaling up
	else if (coneScalingDirection === -1 && cone.scale.y <= 0.7) {
		coneScalingDirection = 1;
	}
	if (isScaling) {
		requestAnimationFrame(scaleCone);
	}
}

//add functionality to sphere
//move it with arrow keys
document.addEventListener("keydown", function (event) {
	if (event.key == "ArrowUp") {
		sphere.position.z -= 0.1;
		sphere.rotation.x -= 0.1;
	} else if (event.key == "ArrowDown") {
		sphere.position.z += 0.1;
		sphere.rotation.x += 0.1;
	} else if (event.key == "ArrowRight") {
		sphere.position.x += 0.1;
		sphere.rotation.x += 0.1;
	} else if (event.key == "ArrowLeft") {
		sphere.position.x -= 0.1;
		sphere.rotation.x -= 0.1;
	}
	renderer.render(scene, camera);
});

//move camera view with touchpad/mouse
let controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;

function animate() {
	requestAnimationFrame(animate);
	controls.update();

	renderer.render(scene, camera);
}

//stop all animations on space pressed
document.addEventListener("keydown", function (event) {
	if (event.code == "Space") {
		isRotating = false;
		isScaling = false;
	}
});

//call functions for camera and light movement
animate();
moveLight();
renderer.render(scene, camera);
