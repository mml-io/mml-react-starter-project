import { Assets } from "./Assets";
import { LevelConfig } from "./Levels";
import { PhysicsObject } from "./PhysicsObject";
import type RAPIER from "@dimforge/rapier3d"


export type LevelInstanceOptions = {
  timeLabel: HTMLElement;
  scoreLabel: HTMLElement;
  mmlHolder: HTMLElement;
  firePosition: { x: number, y: number, z: number }
  levelConfig: LevelConfig;
}

const gravity = { x: 0.0, y: -9.81, z: 0.0 };

export class LevelInstance {
  private score = 0;
  private targetCount = 0;
  private lastNetTime = 0;
  private firstFireTime: number | null = null;
  private completedTime: number | null = null;
  private allPhysicsObjects: PhysicsObject[] = [];
  private balls: PhysicsObject[] = [];
  private enemies: PhysicsObject[] = [];
  private world: RAPIER.World;
  private tickTimer: number | null = null;
  private ballIndex: number;

  constructor(private rapier: typeof RAPIER, private options: LevelInstanceOptions) {

    options.timeLabel.setAttribute("content", "Use the shoot button to fire the cannon and knock all of the ducks off")

    this.world = new rapier.World(gravity) as RAPIER.World;

    const planeWidth = 40;
    const planeHeight = 40;
    const groundColliderDesc: RAPIER.ColliderDesc = rapier.ColliderDesc.cuboid(planeWidth / 2, 1, planeHeight / 2);
    groundColliderDesc.setTranslation(0, -1, 0);
    this.world.createCollider(groundColliderDesc);

    this.loadFromConfig(this.options.levelConfig);
    this.targetCount = this.enemies.length;

    this.updateScore();

    const ballCount = this.options.levelConfig.balls;
    this.ballIndex = 0;
    for (let i = 0; i < ballCount; i++) {
      const spherePhysics = new PhysicsObject(
        rapier,
        this.world!,
        { type: "sphere", radius: 0.5, mass: 2 },
        { x: 6, y: 0.5 + (ballCount - i - 1) * 0.8, z: 9 },
        { type: "model", src: Assets.pumpkinGlb, offset: { x: 0, y: -0.25, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2, y: 2, z: 2 } },
        this.options.mmlHolder,
      )
      spherePhysics.rigidBody.setEnabled(false);
      this.allPhysicsObjects.push(spherePhysics);
      this.balls.push(spherePhysics);
    }
  }

  loadFromConfig(level: LevelConfig) {
    for (const cube of level.cubes) {
      const cubePhysics = new PhysicsObject(
        this.rapier,
        this.world,
        { type: "box", width: 1, height: 1, depth: 1 },
        cube,
        { type: "model", src: Math.random() < 0.5 ? Assets.cageGlb : Assets.crateGlb, offset: { x: 0, y: -0.53, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.93, y: 0.93, z: 0.93 } },
        this.options.mmlHolder,
      )
      this.allPhysicsObjects.push(cubePhysics);
    }
    for (const plank of level.planks) {
      const plankPhysics = new PhysicsObject(
        this.rapier,
        this.world,
        { type: "box", width: plank.width, height: plank.height, depth: plank.depth },
        plank,
        { type: "cube", width: plank.width, height: plank.height, depth: plank.depth, color: "#d27537" },
        this.options.mmlHolder,
      )
      this.allPhysicsObjects.push(plankPhysics);
    }
    for (const enemy of level.enemies) {
      const enemyPhysics = new PhysicsObject(
        this.rapier,
        this.world,
        { type: "box", width: 1, height: 1.5, depth: 1 },
        enemy,
        { type: "model", src: Assets.duckGlb, offset: { x: 0, y: -0.9, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.93, y: 0.93, z: 0.93 } },
        this.options.mmlHolder,
      )
      this.allPhysicsObjects.push(enemyPhysics);
      this.enemies.push(enemyPhysics);
    }
  }

  private updateScore() {
    this.options.scoreLabel.setAttribute("content", `${this.score} / ${this.targetCount}`);
  }

  public fireBall({ velocity, cannonAngle, cannonPitch }: { velocity: number; cannonAngle: number; cannonPitch: number; }) {
    const spherePhysics = this.balls[this.ballIndex];
    this.ballIndex++;
    if (spherePhysics) {
      spherePhysics.setNextUpdateNoLerp();
      spherePhysics.rigidBody.setTranslation({ x: this.options.firePosition.x, y: 1.5, z: this.options.firePosition.z }, true);
      spherePhysics.rigidBody.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
      spherePhysics.rigidBody.setEnabled(true);
      spherePhysics.rigidBody.setLinvel({
        x: Math.sin(cannonAngle * Math.PI / 180) * velocity,
        y: Math.sin((cannonPitch - 90) * Math.PI / 180) * velocity,
        z: -Math.cos(cannonAngle * Math.PI / 180) * velocity
      }, true);
      spherePhysics.rigidBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }

    if (this.firstFireTime === null) {
      this.firstFireTime = performance.now();
    }
  }

  public start() {
    this.tick();
  }

  private tick() {
    const now = performance.now();

    let doNet = false;
    const sinceLastNetTime = (now - this.lastNetTime) / 1000;
    if (sinceLastNetTime > 0.1) {
      this.lastNetTime = now;
      doNet = true;
    }

    this.world.step();

    if (doNet) {
      for (let i = 0; i < this.allPhysicsObjects.length; i++) {
        const cubePhysics = this.allPhysicsObjects[i];
        cubePhysics.tick();
      }
    }

    for (const enemy of this.enemies) {
      const position = enemy.rigidBody.translation();
      if (position.y < 1) {
        enemy.dispose();
        this.allPhysicsObjects.splice(this.allPhysicsObjects.indexOf(enemy), 1);
        this.enemies.splice(this.enemies.indexOf(enemy), 1);
        this.score++;
        if (this.score >= this.targetCount) {
          this.completedTime = now;
          const timeTaken = (this.completedTime - this.firstFireTime!) / 1000;
          this.options.timeLabel.setAttribute("content", `Win in ${timeTaken.toFixed(2)}s`);
        }
        this.updateScore();
      }
    }


    if (this.firstFireTime !== null && this.completedTime === null) {
      const timeSinceStart = (now - this.firstFireTime) / 1000;
      this.options.timeLabel.setAttribute("content", timeSinceStart.toFixed(2));
    }

    this.tickTimer = setTimeout(() => { this.tick() }, 16);
  }

  dispose() {
    if (this.tickTimer !== null) {
      clearTimeout(this.tickTimer);
      this.tickTimer = null;
    }
    for (const physicsObject of this.allPhysicsObjects) {
      physicsObject.dispose();
    }
    this.world.free();
  }
}