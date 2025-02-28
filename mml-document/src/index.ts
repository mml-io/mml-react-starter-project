// @ts-ignore
import { doTheThing } from "physics-scene";
import { Quat } from "./math";
import { EulXYZ } from "./math";
import { PhysicsObject } from "./PhysicsObject";

function radToDeg(rad: number) {
  return rad * (180 / Math.PI);
}



doTheThing().then((RAPIER: any) => {

  const playersByConnectionId = new Map<number, {
    player: HTMLElement;
    rigidBody: any;
    collider: any;
  }>();

function createPlayer(connectionId: number, position: { x: number, y: number, z: number }) {
  const player = document.createElement("m-cylinder");
  player.setAttribute("width", "0.5");
  player.setAttribute("height", "1");
  player.setAttribute("radius", "1");
  player.setAttribute("depth", "0.5");
  player.setAttribute("collide", "false");
  player.setAttribute("x", position.x.toString());
  player.setAttribute("y", position.y.toString());
  player.setAttribute("z", position.z.toString());
  const lerp = document.createElement("m-attr-lerp");
  lerp.setAttribute("duration", "100");
  player.appendChild(lerp);
  // document.body.appendChild(player);

  // Create a kinematic rigid body instead of dynamic
  const rigidBodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased()
  .setTranslation(0, 0, 0);
  const rigidBody = world.createRigidBody(rigidBodyDesc);

  const colliderDesc = RAPIER.ColliderDesc.cylinder(1, 1);  
  const collider = world.createCollider(colliderDesc, rigidBody);

  playersByConnectionId.set(connectionId, { player, rigidBody, collider });
}

function updatePlayer(connectionId: number, position: { x: number, y: number, z: number }) {
  const player = playersByConnectionId.get(connectionId);
  if (player) {
    player.player.setAttribute("x", position.x.toString());
    player.player.setAttribute("y", position.y.toString());
    player.player.setAttribute("z", position.z.toString());

    player.rigidBody.setTranslation(position.x, position.y + 2, position.z);
  }
}

function removePlayer(connectionId: number) {
  const playerData = playersByConnectionId.get(connectionId);
  if (playerData) {
    // Remove the player element from the DOM
    playerData.player.remove();
    
    // Remove the rigid body from the physics world
    world.removeRigidBody(playerData.rigidBody);
    
    // Remove from our tracking map
    playersByConnectionId.delete(connectionId);
  }
}

window.addEventListener("disconnected", (event) => {
  removePlayer(event.detail.connectionId);
});

  const positionProbe = document.createElement("m-position-probe");
  positionProbe.setAttribute("range", "1000");
  positionProbe.setAttribute("interval", "100");
  positionProbe.setAttribute("debug", "true");
  document.body.appendChild(positionProbe);

  positionProbe.addEventListener("positionenter", (event: any) => {
    createPlayer(event.detail.connectionId, event.detail.documentRelative.position);
  });
  positionProbe.addEventListener("positionmove", (event: any) => {
    updatePlayer(event.detail.connectionId, event.detail.documentRelative.position);
  });
  positionProbe.addEventListener("positionleave", (event: any) => {
    removePlayer(event.detail.connectionId);
  });
 
  
let gravity = { x: 0.0, y: -9.81, z: 0.0 };
let world = new RAPIER.World(gravity);

// Create the ground
const planeWidth = 40;
const planeHeight = 40;
let groundColliderDesc = RAPIER.ColliderDesc.cuboid(planeWidth/2, 0.1, planeHeight/2);
world.createCollider(groundColliderDesc);

const plane = document.createElement("m-plane");
plane.setAttribute("width", planeWidth.toString());
plane.setAttribute("height", planeHeight.toString());
plane.setAttribute("x", "5");
plane.setAttribute("y", "0.1");
plane.setAttribute("z", "5");
plane.setAttribute("rx", "-90");
document.body.appendChild(plane);


const allPhysicsObjects: PhysicsObject[] = [];

world.step();

let spherePhysics: PhysicsObject | null = null;
let lastTime = performance.now();
let lastNetTime = performance.now();
function restart() {
  lastTime = 0;
  lastNetTime = 0;
  for (const physicsObject of allPhysicsObjects) {
    physicsObject.dispose();
  }
  allPhysicsObjects.length = 0;

  // const cubeWidth = 1.25;
  // for (let i = 0; i < 32; i++) {
  //   const cubePhysics = new PhysicsObject(
  //     RAPIER,
  //     world,
  //     { type: "box", width: cubeWidth, height: cubeWidth, depth: cubeWidth },
  //     { x: Math.random() * cubeSpawnDistance, y: 5 + Math.random() * 5, z: Math.random() * cubeSpawnDistance },
  //     { type: "cube", width: cubeWidth, height: cubeWidth, depth: cubeWidth }
  //   )
  //   cubePhysics.mmlElementWithLerp!.element.setAttribute("color", "red");
  //   allPhysicsObjects.push(cubePhysics);
  // }

  const brickWidth = 1.25;
  const brickHeight = 0.5;
  const brickDepth = 0.75;
  for (let y = 0; y < 6; y++) {
    for (let x = 0; x < 6; x++) {
    for (let z = 3; z < 4; z++) {
      const cubePhysics = new PhysicsObject(
        RAPIER,
        world,
        { type: "box", width: brickWidth, height: brickHeight, depth: brickDepth },
        { x: (x * brickWidth) + (y % 2 === 0 ? brickWidth * 0.5 : 0), y: (y + 0.5) * brickHeight, z: z * brickDepth },
        { type: "cube", width: brickWidth, height: brickHeight, depth: brickDepth }
      )
      allPhysicsObjects.push(cubePhysics);
      if (Math.random() < 0.5) {
        cubePhysics.mmlElementWithLerp?.element.setAttribute("color", "#AA0000");
      }
      cubePhysics.mmlElementWithLerp?.element.addEventListener("click", () => {

        const colorAnimation = document.createElement("m-attr-anim");
        colorAnimation.setAttribute("attr", "color");
        colorAnimation.setAttribute("start", "#AA0000");
        colorAnimation.setAttribute("end", "#000000");
        colorAnimation.setAttribute("duration", "1000");
        colorAnimation.setAttribute("ping-pong", "true");
        colorAnimation.setAttribute("loop", "true");
        cubePhysics.mmlElementWithLerp?.element.appendChild(colorAnimation);

        setTimeout(() => {
          if (cubePhysics.mmlElementWithLerp?.element.isConnected) {
          const position = cubePhysics.rigidBody.translation();
          const x = position.x;
          const y = position.y;
          const z = position.z;
          cubePhysics.dispose();
          allPhysicsObjects.splice(allPhysicsObjects.indexOf(cubePhysics), 1);
          explodeAtPoint(x, y, z);
          }
        }, 2000);

      });
    }
  }
  }

  spherePhysics = new PhysicsObject(
    RAPIER,
    world,
    { type: "sphere", radius: 1 },
    { x: 3, y: 1, z: 10 },
    { type: "sphere", radius: 1 }
  )
  // spherePhysics.rigidBody.setLinvel({ x: 0, y: 0, z: -15 }, true);
  allPhysicsObjects.push(spherePhysics);
  world.step();
}

restart();

{
  const restartLabel = document.createElement("m-label");
  restartLabel.setAttribute("content", "Restart");
  restartLabel.setAttribute("x", "0");
  restartLabel.setAttribute("y", "5");
  restartLabel.setAttribute("z", "0");
  document.body.appendChild(restartLabel);
  restartLabel.addEventListener("click", () => {
    restart();
  });
}

function fireBall() {
  if (spherePhysics) {
    spherePhysics.rigidBody.setTranslation({ x: Math.random() * 10, y: 1, z: 10 }, true);
    spherePhysics.rigidBody.setLinvel({ x: 0, y: 0, z:-15 }, true);
  }
}
{
  const fireButton = document.createElement("m-label");
  fireButton.setAttribute("content", "Fire");
  fireButton.setAttribute("x", "3");
  fireButton.setAttribute("y", "5");
  fireButton.setAttribute("z", "0");
  document.body.appendChild(fireButton);
  fireButton.addEventListener("click", () => {
    fireBall();
  });
}



function explodeAtPoint(x: number, y: number, z: number) {
  const maxImpulseForce = 2; // Maximum force at the center of explosion
  const explosionRadius = 8; // How far the explosion reaches
  
  for (const physicsObject of allPhysicsObjects) {
    const position = physicsObject.rigidBody.translation();
    const delta = { 
      x: position.x - x, 
      y: position.y - y, 
      z: position.z - z 
    };
    
    const distance = Math.sqrt(delta.x * delta.x + delta.y * delta.y + delta.z * delta.z);
    
    // Skip if the object is too far away to be affected
    if (distance > explosionRadius) continue;
    
    // Prevent division by zero and handle very close objects
    const effectiveDistance = Math.max(0.1, distance);
    
    // Calculate force based on inverse square law (1/r²)
    // Objects closer to explosion receive more force
    const forceMagnitude = maxImpulseForce * (1 - distance / explosionRadius);
    
    // Normalize direction vector
    const impulseXYZ = { 
      x: delta.x / effectiveDistance, 
      y: delta.y / effectiveDistance, 
      z: delta.z / effectiveDistance 
    };
    
    // Apply impulse at the object's position
    physicsObject.rigidBody.applyImpulseAtPoint(
      { 
        x: impulseXYZ.x * forceMagnitude, 
        y: impulseXYZ.y * forceMagnitude, 
        z: impulseXYZ.z * forceMagnitude 
      }, 
      position, 
      true
    );
  }
}
{
  const explodeButton = document.createElement("m-label");
  explodeButton.setAttribute("content", "Explode");
  explodeButton.setAttribute("x", "6");
  explodeButton.setAttribute("y", "5");
  explodeButton.setAttribute("z", "0");
  document.body.appendChild(explodeButton);
  explodeButton.addEventListener("click", () => {
    explodeAtPoint(Math.random() * 10, 1, 0);
  });
}


// Game loop. Replace by your own game loop system.
let gameLoop = () => {
  const now = performance.now();
  const deltaTime = (now - lastTime) / 1000;
  lastTime = now;
  
  let doNet = false;
  const sinceLastNetTime = (now - lastNetTime) / 1000;
  if (sinceLastNetTime > 0.1) {
    lastNetTime = now;
    doNet = true;
  }

    // Update player physics bodies with their current positions
    playersByConnectionId.forEach((playerData) => {
      const x = parseFloat(playerData.player.getAttribute("x") || "0");
      const y = parseFloat(playerData.player.getAttribute("y") || "0");
      const z = parseFloat(playerData.player.getAttribute("z") || "0");
      
      // Update the kinematic body position
      playerData.rigidBody.setTranslation({ x, y: y + 1, z }, true);
    });
    
    // Step the simulation forward.  
    world.step();

    if (true) {
      for (let i = 0; i < allPhysicsObjects.length; i++) {
        const cubePhysics = allPhysicsObjects[i];
        cubePhysics.tick();
      }
    }

    setTimeout(gameLoop, 16);
};

gameLoop();
});

