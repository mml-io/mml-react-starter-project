// @ts-ignore
import { doTheThing } from "physics-scene";
import { Quat } from "./math";
import { EulXYZ } from "./math";

function radToDeg(rad: number) {
  return rad * (180 / Math.PI);
}



doTheThing().then((RAPIER: any) => {

  const light = document.createElement("m-light");
  light.setAttribute("type", "point");
  light.setAttribute("intensity", "100");
  light.setAttribute("x", "5");
  light.setAttribute("y", "10");
  light.setAttribute("z", "5");
  document.body.appendChild(light);



  
  const playersByConnectionId = new Map<number, {
    player: HTMLElement;
    rigidBody: any;
    collider: any;
  }>();

function createPlayer(connectionId: number) {
  const player = document.createElement("m-cylinder");
  player.setAttribute("connection-id", connectionId.toString());
  player.setAttribute("width", "0.5");
  player.setAttribute("height", "1");
  player.setAttribute("depth", "0.5");
  player.setAttribute("collide", "false");
  player.setAttribute("x", "0");
  player.setAttribute("y", "0");
  player.setAttribute("z", "0");
  document.body.appendChild(player);

  const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
  .setTranslation(0, 0, 0);
  const rigidBody = world.createRigidBody(rigidBodyDesc);

  const colliderDesc = RAPIER.ColliderDesc.cylinder(0.5, 1);  
  const collider = world.createCollider(colliderDesc, rigidBody);

  playersByConnectionId.set(connectionId, { player, rigidBody, collider });
}

function updatePlayer(connectionId: number, position: { x: number, y: number, z: number }) {
  const player = playersByConnectionId.get(connectionId);
  if (player) {
    player.player.setAttribute("x", position.x.toString());
    player.player.setAttribute("y", position.y.toString());
    player.player.setAttribute("z", position.z.toString());

    player.rigidBody.setTranslation(position.x, position.y, position.z);
  }
}

function removePlayer(connectionId: number) {
  const player = playersByConnectionId.get(connectionId)?.player;
  if (player) {
    player.remove();
    playersByConnectionId.delete(connectionId);
  }
}



window.addEventListener("disconnected", (event) => {
  removePlayer(event.detail.connectionId);
});

  const positionProbe = document.createElement("m-position-probe");
  positionProbe.setAttribute("radius", "100");
  positionProbe.setAttribute("interval", "100");
  positionProbe.setAttribute("debug", "true");
  document.body.appendChild(positionProbe);

  positionProbe.addEventListener("positionenter", (event: any) => {
    createPlayer(event.detail.connectionId);
  });
  positionProbe.addEventListener("positionmove", (event: any) => {
    updatePlayer(event.detail.connectionId, event.detail.documentRelative.position);
  });
  positionProbe.addEventListener("positionleave", (event: any) => {
    removePlayer(event.detail.connectionId);
  });
 
// console.log("TextDecoder", TextDecoder);

  
let gravity = { x: 0.0, y: -9.81, z: 0.0 };
console.log("RAPIER.World", RAPIER.World);
let world = new RAPIER.World(gravity);

// Create the ground
const planeWidth = 20;
const planeHeight = 20;
let groundColliderDesc = RAPIER.ColliderDesc.cuboid(planeWidth, 0.1, planeHeight);
world.createCollider(groundColliderDesc);

const plane = document.createElement("m-plane");
plane.setAttribute("width", planeWidth.toString());
plane.setAttribute("height", planeHeight.toString());
plane.setAttribute("x", "5");
plane.setAttribute("y", "0");
plane.setAttribute("z", "5");
plane.setAttribute("rx", "-90");
document.body.appendChild(plane);


const cubeWidth = 0.6;
const cubeSpawnDistance = 5;

const cubesWithPhysics = [];
for (let i = 0; i < 32; i++) {
  const cube = document.createElement("m-cube");
  cube.setAttribute("color", "red");
  cube.setAttribute("width", cubeWidth.toString());
  cube.setAttribute("height", cubeWidth.toString());
  cube.setAttribute("depth", cubeWidth.toString());
  cube.setAttribute("x", "0");
  cube.setAttribute("y", "1");
  cube.setAttribute("z", "0");
  document.body.appendChild(cube);

  // Create a dynamic rigid-body.
let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
.setTranslation(Math.random() * cubeSpawnDistance, 5 + Math.random() * 5, Math.random() * cubeSpawnDistance);
let rigidBody = world.createRigidBody(rigidBodyDesc);

// Create a cuboid collider attached to the dynamic rigidBody.
let colliderDesc1 = RAPIER.ColliderDesc.cuboid(cubeWidth/2, cubeWidth/2, cubeWidth/2);
let collider = world.createCollider(colliderDesc1, rigidBody);

  cubesWithPhysics.push({cube, rigidBody, collider});
}

world.step();


// Game loop. Replace by your own game loop system.
let gameLoop = () => {
    // Step the simulation forward.  
    world.step();

    for (let i = 0; i < cubesWithPhysics.length; i++) {
      const {cube, rigidBody, collider} = cubesWithPhysics[i];

      // Get and print the rigid-body's position.
      let position = rigidBody.translation();
      const r = rigidBody.rotation();
      const quat = new Quat(r.x, r.y, r.z, r.w);
      let rotation = new EulXYZ().setFromQuaternion(quat);
      // console.log("Rigid-body position: ", position.x, position.y, position.z);
    
      cube.setAttribute("x", position.x.toString());
      cube.setAttribute("y", position.y.toString());
      cube.setAttribute("z", position.z.toString());

      cube.setAttribute("rx", radToDeg(rotation.x).toString());
      cube.setAttribute("ry", radToDeg(rotation.y).toString());
      cube.setAttribute("rz", radToDeg(rotation.z).toString());
    }


    setTimeout(gameLoop, 16);
};

setTimeout(() => {
  gameLoop();
}, 3000);
});

