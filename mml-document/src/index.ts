// @ts-ignore
import { doTheThing } from "physics-scene";
import type RAPIER from "@dimforge/rapier3d"
import { PhysicsObject } from "./PhysicsObject";
import { CannonControls } from "./CannonControls";

let remoteAssets = true;

const arrowGlb = remoteAssets ? "https://mmlstorage.com/1b5d0da343ab91bed0a66a76257cb0753ee0bf4fbae4553480c90e5de0a70c3f" : "/assets/arrow.glb";
const pumpkinGlb = remoteAssets ? "https://mmlstorage.com/e0a39a1394c476c8335a6c40228f14314e9ce1732d6b29cd924f696e133362a6" : "/assets/pumpkin.glb";
const duckGlb = remoteAssets ? "https:/public.mml.io/duck.glb" : "/assets/duck.glb";
const cageGlb = remoteAssets ? "https://mmlstorage.com/12b0f2c85a6afd944cb0b8d3bed5dcd483623fe0c066190c224d9315dc57be00" : "/assets/cage.glb";
const crateGlb = remoteAssets ? "https://mmlstorage.com/74aec3cb7f7ea75b0c03d7cd0a39e618961faf959e8cb49665b073dc83286309" : "/assets/crate.glb";
const cannonGlb = remoteAssets ? "https://mmlstorage.com/3bb758c770ebbde646c8c781a71f1e5f239d1f818004ad329bcd7c0905b7f245" : "/assets/cannon.glb";
const cannonBaseGlb = remoteAssets ? "https://mmlstorage.com/73a667abb51f7f72dc7e74739fe607f7d596d163a892fa22040869cd9694abc8" : "/assets/cannon-base.glb";


type LevelConfig = {
  cubes: {
    x: number;
    y: number;
    z: number;
    rx?: number;
    ry?: number;
    rz?: number;
  }[];
  planks: {
    x: number;
    y: number;
    z: number;
    width: number;
    depth: number;
    height: number;
    rx?: number;
    ry?: number;
    rz?: number;
  }[];
  enemies: {
    x: number;
    y: number;
    z: number;
    rx?: number;
    ry?: number;
    rz?: number;
  }[];
}

const level1: LevelConfig = {
  cubes: [
  ],
  planks: [
    { x: 1, y: 6.6, z: 2, width: 6.5, depth: 1, height: 0.2, ry: 40 },
    { x: 1, y: 3.6, z: 4, width: 6.5, depth: 1, height: 0.2, ry: 20 },
  ],
  enemies: [
    { x: 1, y: 3.6, z: 2 },
    { x: 3, y: 3.6, z: 2 },
    { x: 5, y: 3.6, z: 2 },
  ],
}
for (let y = 0; y < 3; y++) {
  for (let x = 0; x < 6; x++) {
    for (let z = 2; z < 3; z++) {
      level1.cubes.push({ x: (x * 1) + (y % 2 === 0 ? 1 * 0.5 : 0), y: (y + 0.5) * 1, z: z * 1 });
    }
  }
}


const level2: LevelConfig = {
  cubes: [
    { y: 0.5, x: -5.5, z: -2 },
    { y: 1.5, x: -5.5, z: -2, ry: 45.213 },
    { y: 2.5, x: -5.5, z: -2 },
    { y: 3.7, x: -5.5, z: -2 },
    { y: 4.7, x: -5.5, z: -2, ry: -20.152 },
    { y: 5.7, x: -5.5, z: -2, ry: 44.636 },
    { y: 0.5, x: -1, z: -3.7 },
    { y: 1.5, x: -1, z: -3.7, ry: 50.449 },
    { y: 2.5, x: -1, z: -3.7 },
    { y: 3.7, x: -1, z: -3.7 },
    { y: 4.7, x: -1, z: -3.7, ry: 17.353 },
    { y: 5.7, x: -1, z: -3.7 },
    { y: 0.5, x: 5.5, z: -2 },
    { y: 1.5, x: 5.5, z: -2, ry: 19.742 },
    { y: 2.5, x: 5.5, z: -2, ry: 8.744 },
    { y: 3.7, x: 5.5, z: -2 },
    { y: 4.7, x: 5.5, z: -2, ry: -18.655 },
    { y: 5.7, x: 5.5, z: -2 },
    { y: 0.5, x: 1, z: -3.7, ry: 41.871 },
    { y: 1.5, x: 1, z: -3.7 },
    { y: 2.5, x: 1, z: -3.7, ry: 12.603 },
    { y: 3.7, x: 1, z: -3.7 },
    { y: 4.7, x: 1, z: -3.7, ry: 20.758 },
    { y: 5.7, x: 1, z: -3.7, ry: -10.153 },
    { y: 0.5, x: -5, z: -7 },
    { y: 1.5, x: -5, z: -7, ry: -46.062 },
    { y: 2.5, x: -5, z: -7, ry: 24.805 },
    { y: 3.5, x: -5, z: -7, ry: -36.243 },
    { y: 4.5, x: -5, z: -7, ry: -5.245 },
    { y: 5.5, x: -5, z: -7 },
    { y: 6.5, x: -5, z: -7, ry: -46.062 },
    { y: 7.5, x: -5, z: -7, ry: 2.805 },
    { y: 8.5, x: -5, z: -7, ry: -30.243 },
    { y: 0.5, x: 5, z: -7 },
    { y: 1.5, x: 5, z: -7, ry: -46.062 },
    { y: 2.5, x: 5, z: -7, ry: 24.805 },
    { y: 3.5, x: 5, z: -7, ry: -36.243 },
    { y: 4.5, x: 5, z: -7, ry: -5.245 },
    { y: 5.5, x: 5, z: -7 },
    { y: 6.5, x: 5, z: -7, ry: -46.062 },
    { y: 7.5, x: 5, z: -7, ry: 2.805 },
    { y: 8.5, x: 5, z: -7, ry: -30.243 },

  ],
  planks: [
    { y: 3.1, x: -3.3, z: -2.8, width: 6.5, depth: 1, height: 0.2, ry: 21 },
    { y: 6.3, x: -3.3, z: -2.8, width: 6.5, depth: 1, height: 0.2, ry: 21 },
    { y: 3.1, x: 3.3, z: -2.8, width: 6.5, depth: 1, height: 0.2, ry: -21 },
    { y: 6.3, x: 3.3, z: -2.8, width: 6.5, depth: 1, height: 0.2, ry: -21 },
    { y: 6.5, x: 0, z: -3.2, width: 6.5, depth: 1, height: 0.2 },
  ],
  enemies: [
    { y: 3.1, x: -3.3, z: -2.8, ry: -90 },
    { y: 3.1, x: 3.3, z: -2.8, ry: -90 },
    { y: 6.5, x: 0, z: -3.2, ry: -90 },
    { y: 8.9, x: -5, z: -7, ry: -90 },
    { y: 8.9, x: 5, z: -7, ry: -90 },
  ],
}

const currentLevel = level2;


doTheThing().then((rapier: any) => {

  let gravity = { x: 0.0, y: -9.81, z: 0.0 };
  let world: RAPIER.World = new rapier.World(gravity);

  // Create the ground
  const planeWidth = 40;
  const planeHeight = 40;
  let groundColliderDesc = rapier.ColliderDesc.cuboid(planeWidth / 2, 0.1, planeHeight / 2);
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

  let gameCheck: (() => void) | null = null;

  const scoreLabel = document.createElement("m-label");
  scoreLabel.setAttribute("content", "0");
  scoreLabel.setAttribute("alignment", "center");
  scoreLabel.setAttribute("font-size", "60");
  scoreLabel.setAttribute("x", "3");
  scoreLabel.setAttribute("y", "5");
  scoreLabel.setAttribute("z", "0");
  document.body.appendChild(scoreLabel);

  function loadLevel(level: LevelConfig, allPhysicsObjects: PhysicsObject[], enemies: PhysicsObject[], world: RAPIER.World) {
    for (const cube of level.cubes) {
      const cubePhysics = new PhysicsObject(
        rapier,
        world,
        { type: "box", width: 1, height: 1, depth: 1 },
        cube,
        { type: "model", src: Math.random() < 0.5 ? cageGlb : crateGlb, offset: { x: 0, y: -0.5, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.93, y: 0.93, z: 0.93 } }
      )
      allPhysicsObjects.push(cubePhysics);
    }
    for (const plank of level.planks) {
      const plankPhysics = new PhysicsObject(
        rapier,
        world,
        { type: "box", width: plank.width, height: plank.height, depth: plank.depth },
        plank,
        { type: "cube", width: plank.width, height: plank.height, depth: plank.depth, color: "#d27537" }
      )
      allPhysicsObjects.push(plankPhysics);
    }
    for (const enemy of level.enemies) {
      const enemyPhysics = new PhysicsObject(
        rapier,
        world,
        { type: "box", width: 1, height: 1.5, depth: 1 },
        enemy,
        { type: "model", src: duckGlb, offset: { x: 0, y: -0.85, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.93, y: 0.93, z: 0.93 } }
      )
      allPhysicsObjects.push(enemyPhysics);
      enemies.push(enemyPhysics);
    }
  }


  function restart() {
    let score = 0;
    scoreLabel.setAttribute("content", score.toString());
    lastTime = 0;
    lastNetTime = 0;
    for (const physicsObject of allPhysicsObjects) {
      physicsObject.dispose();
    }
    allPhysicsObjects.length = 0;

    const allEnemies: PhysicsObject[] = [];
    loadLevel(currentLevel, allPhysicsObjects, allEnemies, world);

    gameCheck = () => {
      for (const enemy of allEnemies) {
        const position = enemy.rigidBody.translation();
        if (position.y < 1) {
          enemy.dispose();
          allPhysicsObjects.splice(allPhysicsObjects.indexOf(enemy), 1);
          allEnemies.splice(allEnemies.indexOf(enemy), 1);
          score++;
          scoreLabel.setAttribute("content", score.toString());
        }
      }
    }
    spherePhysics = new PhysicsObject(
      rapier,
      world,
      { type: "sphere", radius: 0.5 },
      { x: 3, y: 1, z: 10 },
      { type: "model", src: pumpkinGlb, offset: { x: 0, y: -0.25, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2, y: 2, z: 2 } }
    )
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

  // Create two m-cubes that are to the left and right of the firing position that control the angle of the fire ball
  const firePosition = { x: 3, y: 1.25, z: 10 };
  const arrowPosition = { x: 3, y: 1.5, z: 11 };
  let cannonAngle = 0;
  let cannonPitch = 110;
  let maxAbsAngle = 45;
  let minCannonPitch = 90;
  let maxCannonPitch = 140;

  const cannonControls = new CannonControls({
    arrowGlb,
    maxAbsAngle,
    minCannonPitch,
    maxCannonPitch,
  }, (updatedCannonAngle: number, updatedCannonPitch: number) => {
    cannonAngle = updatedCannonAngle;
    cannonPitch = updatedCannonPitch;
    updateCannon();
  });
  function updateCannon() {
    cannonBarrel.setAttribute("rx", (cannonPitch + 90).toString());
    cannonGroup.setAttribute("ry", (-cannonAngle).toString());
  }
  cannonControls.element.setAttribute("x", arrowPosition.x.toString());
  cannonControls.element.setAttribute("y", arrowPosition.y.toString());
  cannonControls.element.setAttribute("z", arrowPosition.z.toString());
  cannonControls.element.setAttribute("rx", "-50");
  document.body.appendChild(cannonControls.element);

  const cannonGroup = document.createElement("m-group");
  cannonGroup.setAttribute("sx", "0.5");
  cannonGroup.setAttribute("sy", "0.5");
  cannonGroup.setAttribute("sz", "0.5");
  cannonGroup.setAttribute("x", firePosition.x.toString());
  cannonGroup.setAttribute("y", firePosition.y.toString());
  cannonGroup.setAttribute("z", firePosition.z.toString());

  const cannonBarrel = document.createElement("m-model");
  cannonBarrel.setAttribute("src", cannonGlb);
  cannonBarrel.setAttribute("ry", "90");
  cannonBarrel.setAttribute("rx", "50");
  cannonGroup.appendChild(cannonBarrel);

  const cannonBase = document.createElement("m-model");
  cannonBase.setAttribute("src", cannonBaseGlb);
  cannonBase.setAttribute("ry", "90");
  cannonGroup.appendChild(cannonBase);
  document.body.appendChild(cannonGroup);

  updateCannon();

  const fireButton = document.createElement("m-cube");
  fireButton.setAttribute("x", (firePosition.x + 3).toString());
  fireButton.setAttribute("y", (firePosition.y + 0.5).toString());
  fireButton.setAttribute("z", (firePosition.z + 0.5).toString());
  fireButton.setAttribute("width", "1");
  fireButton.setAttribute("height", "1");
  fireButton.setAttribute("depth", "1");
  fireButton.setAttribute("color", "purple");
  document.body.appendChild(fireButton);

  const firepowerMeterHolder = document.createElement("m-cube");
  firepowerMeterHolder.setAttribute("x", (firePosition.x + 4).toString());
  firepowerMeterHolder.setAttribute("y", (firePosition.y + 0).toString());
  firepowerMeterHolder.setAttribute("z", (firePosition.z + 0.5).toString());
  firepowerMeterHolder.setAttribute("width", "0.4");
  firepowerMeterHolder.setAttribute("height", "3");
  firepowerMeterHolder.setAttribute("y", "1.5");
  firepowerMeterHolder.setAttribute("depth", "0.4");
  firepowerMeterHolder.setAttribute("color", "#9e9e9e");
  document.body.appendChild(firepowerMeterHolder);


  const firepowerMeterHeight = 2.9
  const firepowerMeter = document.createElement("m-cube");
  firepowerMeter.setAttribute("x", (firePosition.x + 4).toString());
  firepowerMeter.setAttribute("y", (firePosition.y + 0).toString());
  firepowerMeter.setAttribute("z", (firePosition.z + 1).toString());
  firepowerMeter.setAttribute("width", "0.3");
  firepowerMeter.setAttribute("height", "0");
  firepowerMeter.setAttribute("depth", "0.3");
  firepowerMeter.setAttribute("color", "#58ef06");
  document.body.appendChild(firepowerMeter);

  let firepowerTimer: number | null = null;
  let firepowerMax = 40;
  const firepowerInterval = 1000;

  let firepowerMeterAnimationHeight: HTMLElement | null = null;
  let firepowerMeterAnimationY: HTMLElement | null = null;

  fireButton.addEventListener("click", () => {
    if (firepowerTimer !== null) {
      const timeSinceLastClick = performance.now() - firepowerTimer;
      const firepower = (timeSinceLastClick % firepowerInterval) / firepowerInterval;

      let result;
      if (firepower > 0.5) {
        result = 1 - (firepower - 0.5) * 2;
      } else {
        result = firepower * 2;
      }

      firepowerTimer = null;
      firepowerMeterAnimationHeight?.remove();
      firepowerMeterAnimationY?.remove();
      fireBall(result * firepowerMax);
    } else {
      firepowerTimer = performance.now();
      firepowerMeterAnimationHeight = document.createElement("m-attr-anim");
      firepowerMeterAnimationHeight.setAttribute("attr", "height");
      firepowerMeterAnimationHeight.setAttribute("start", "0");
      firepowerMeterAnimationHeight.setAttribute("end", firepowerMeterHeight.toString());
      firepowerMeterAnimationHeight.setAttribute("ping-pong", "true");
      firepowerMeterAnimationHeight.setAttribute("start-time", document.timeline.currentTime!.toString());
      firepowerMeterAnimationHeight.setAttribute("duration", firepowerInterval.toString());
      firepowerMeterAnimationHeight.setAttribute("loop", "true");
      firepowerMeter.appendChild(firepowerMeterAnimationHeight);
      firepowerMeterAnimationY = document.createElement("m-attr-anim");
      firepowerMeterAnimationY.setAttribute("attr", "y");
      firepowerMeterAnimationY.setAttribute("end", (firePosition.y).toString());
      firepowerMeterAnimationY.setAttribute("start", (firePosition.y + (-firepowerMeterHeight / 2)).toString());
      firepowerMeterAnimationY.setAttribute("start-time", document.timeline.currentTime!.toString());
      firepowerMeterAnimationY.setAttribute("ping-pong", "true");
      firepowerMeterAnimationY.setAttribute("duration", firepowerInterval.toString());
      firepowerMeterAnimationY.setAttribute("loop", "true");
      firepowerMeter.appendChild(firepowerMeterAnimationY);
    }
  });


  function fireBall(velocity: number) {
    console.log("firepower", velocity);
    if (spherePhysics) {
      spherePhysics.setNextUpdateNoLerp();
      spherePhysics.rigidBody.setTranslation({ x: firePosition.x, y: 1, z: firePosition.z }, true);

      const direction = {
        x: Math.sin(cannonAngle * Math.PI / 180) * velocity,
        y: Math.sin((cannonPitch - 90) * Math.PI / 180) * velocity,
        z: -Math.cos(cannonAngle * Math.PI / 180) * velocity
      };
      spherePhysics.rigidBody.setLinvel(direction, true);
    }
  }


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

    world.step();

    if (doNet) {
      for (let i = 0; i < allPhysicsObjects.length; i++) {
        const cubePhysics = allPhysicsObjects[i];
        cubePhysics.tick();
      }
    }

    setTimeout(gameLoop, 16);

    if (gameCheck) {
      gameCheck();
    }
  };

  gameLoop();
});

