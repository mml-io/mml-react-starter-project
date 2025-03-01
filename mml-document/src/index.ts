// @ts-ignore
import { doTheThing } from "physics-scene";
import type RAPIER from "@dimforge/rapier3d"
import { PhysicsObject } from "./PhysicsObject";
import { CannonControls } from "./CannonControls";
import { FireControls } from "./FireControls";
import { Button } from "./Button";
import { level2, LevelConfig } from "./Levels";

let remoteAssets = false;

const arrowGlb = remoteAssets ? "https://mmlstorage.com/1b5d0da343ab91bed0a66a76257cb0753ee0bf4fbae4553480c90e5de0a70c3f" : "/assets/arrow.glb";
const pumpkinGlb = remoteAssets ? "https://mmlstorage.com/e0a39a1394c476c8335a6c40228f14314e9ce1732d6b29cd924f696e133362a6" : "/assets/pumpkin.glb";
const boardGlb = remoteAssets ? "https://mmlstorage.com/954f7f332ac5ec2f8fa4e74601ad8c1fcc58a3ae522737ed8f1d1ad963434ba8" : "/assets/board.glb";
const duckGlb = remoteAssets ? "https:/public.mml.io/duck.glb" : "/assets/duck.glb";
const cageGlb = remoteAssets ? "https://mmlstorage.com/12b0f2c85a6afd944cb0b8d3bed5dcd483623fe0c066190c224d9315dc57be00" : "/assets/cage.glb";
const crateGlb = remoteAssets ? "https://mmlstorage.com/74aec3cb7f7ea75b0c03d7cd0a39e618961faf959e8cb49665b073dc83286309" : "/assets/crate.glb";
const cannonGlb = remoteAssets ? "https://mmlstorage.com/3bb758c770ebbde646c8c781a71f1e5f239d1f818004ad329bcd7c0905b7f245" : "/assets/cannon.glb";
const cannonBaseGlb = remoteAssets ? "https://mmlstorage.com/73a667abb51f7f72dc7e74739fe607f7d596d163a892fa22040869cd9694abc8" : "/assets/cannon-base.glb";


const currentLevel = level2;

function addLerpElementToElement(element: HTMLElement, duration: number) {
  const lerp = document.createElement("m-attr-lerp");
  lerp.setAttribute("attr", "all");
  lerp.setAttribute("duration", duration.toString());
  element.appendChild(lerp);
}

doTheThing().then((rapier: any) => {

  let gravity = { x: 0.0, y: -9.81, z: 0.0 };
  let world: RAPIER.World | null = null;

  // Create the ground
  const planeWidth = 40;
  const planeHeight = 40;

  const allPhysicsObjects: PhysicsObject[] = [];

  let spherePhysics: PhysicsObject | null = null;
  let lastTime = performance.now();
  let lastNetTime = performance.now();

  let gameCheck: (() => void) | null = null;

  const scoreLabel = document.createElement("m-label");
  scoreLabel.setAttribute("content", "0");
  scoreLabel.setAttribute("color", "rgba(0,0,0,0)");
  scoreLabel.setAttribute("alignment", "center");
  scoreLabel.setAttribute("font-size", "100");
  scoreLabel.setAttribute("font-color", "#00FF00");
  scoreLabel.setAttribute("x", "0");
  scoreLabel.setAttribute("width", "2");
  scoreLabel.setAttribute("height", "2");
  scoreLabel.setAttribute("y", "1");
  scoreLabel.setAttribute("z", "0.05");

  const boardModel = document.createElement("m-model");
  boardModel.setAttribute("src", boardGlb);
  boardModel.setAttribute("z", "10");
  boardModel.setAttribute("x", "-1");
  document.body.appendChild(boardModel);

  boardModel.appendChild(scoreLabel);

  const restartButton = new Button({
    text: "RESTART",
    buttonColor: "#2424ff",
    textColor: "#FFFFFF",
    fontSize: 15,
    onClick: () => {
      restart();
    }
  });
  restartButton.element.setAttribute("z", "0.5")
  boardModel.appendChild(restartButton.element);

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

  let doPhysicsStep = false;

  function restart() {
    doPhysicsStep = false;
    let score = 0;
    scoreLabel.setAttribute("content", score.toString());
    lastTime = 0;
    lastNetTime = 0;
    for (const physicsObject of allPhysicsObjects) {
      physicsObject.dispose();
    }
    allPhysicsObjects.length = 0;
    gameCheck = null;
    if (world) {
      world.free();
    }

    world = new rapier.World(gravity) as RAPIER.World;

    const groundColliderDesc: RAPIER.ColliderDesc = rapier.ColliderDesc.cuboid(planeWidth / 2, 1, planeHeight / 2);
    groundColliderDesc.setTranslation(0, -1, 0);
    world.createCollider(groundColliderDesc);

    const allEnemies: PhysicsObject[] = [];
    loadLevel(currentLevel, allPhysicsObjects, allEnemies, world!);

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
      world!,
      { type: "sphere", radius: 0.5, mass: 2 },
      { x: 3, y: 1, z: 10 },
      { type: "model", src: pumpkinGlb, offset: { x: 0, y: -0.25, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2, y: 2, z: 2 } }
    )
    allPhysicsObjects.push(spherePhysics);
    doPhysicsStep = true;
  }

  restart();

  // Create two m-cubes that are to the left and right of the firing position that control the angle of the fire ball
  const firePosition = { x: 3, y: 0, z: 10 };
  const arrowPosition = { x: 3, y: 1.5, z: 11.5 };
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
  cannonGroup.setAttribute("y", (1.25 + firePosition.y).toString());
  cannonGroup.setAttribute("z", firePosition.z.toString());
  addLerpElementToElement(cannonGroup, 100);

  const cannonBarrel = document.createElement("m-model");
  cannonBarrel.setAttribute("src", cannonGlb);
  cannonBarrel.setAttribute("ry", "90");
  cannonBarrel.setAttribute("rx", "50");
  cannonGroup.appendChild(cannonBarrel);
  addLerpElementToElement(cannonBarrel, 100);

  const cannonBase = document.createElement("m-model");
  cannonBase.setAttribute("src", cannonBaseGlb);
  cannonBase.setAttribute("ry", "90");
  cannonGroup.appendChild(cannonBase);
  document.body.appendChild(cannonGroup);

  updateCannon();

  let firepowerMax = 40;
  const fireControls = new FireControls({
    firepowerInterval: 1000
  }, (strength) => {
    fireBall(strength * firepowerMax);
  })
  fireControls.element.setAttribute("x", firePosition.x.toString());
  fireControls.element.setAttribute("y", firePosition.y.toString());
  fireControls.element.setAttribute("z", firePosition.z.toString());
  document.body.appendChild(fireControls.element);


  function fireBall(velocity: number) {
    if (spherePhysics) {
      spherePhysics.setNextUpdateNoLerp();
      spherePhysics.rigidBody.setTranslation({ x: firePosition.x, y: 1.5, z: firePosition.z }, true);
      spherePhysics.rigidBody.setRotation({ x: 0, y: 0, z: 0, w: 1}, true);

      const direction = {
        x: Math.sin(cannonAngle * Math.PI / 180) * velocity,
        y: Math.sin((cannonPitch - 90) * Math.PI / 180) * velocity,
        z: -Math.cos(cannonAngle * Math.PI / 180) * velocity
      };
      spherePhysics.rigidBody.setLinvel(direction, true);
      spherePhysics.rigidBody.setAngvel({x: 0, y: 0, z: 0}, true);
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

    if (world) {
      world.step();
    }

    if (doNet) {
      for (let i = 0; i < allPhysicsObjects.length; i++) {
        const cubePhysics = allPhysicsObjects[i];
        cubePhysics.tick();
      }
    }

    if (gameCheck) {
      gameCheck();
    }

    setTimeout(gameLoop, 16);
  };

  gameLoop();
});

