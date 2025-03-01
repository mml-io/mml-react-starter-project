// @ts-ignore
import { doTheThing } from "physics-scene";
import { CannonControls } from "./CannonControls";
import { FireControls } from "./FireControls";
import { Button } from "./Button";
import { level1, level2 } from "./Levels";
import { LevelInstance } from "./LevelInstance";
import { Assets } from "./Assets";


const currentLevel = level2;

function addLerpElementToElement(element: HTMLElement, duration: number) {
  const lerp = document.createElement("m-attr-lerp");
  lerp.setAttribute("attr", "all");
  lerp.setAttribute("duration", duration.toString());
  element.appendChild(lerp);
}

doTheThing().then((rapier: any) => {
  const gameElement = document.createElement("m-group");
  document.body.appendChild(gameElement);

  const scoreLabel = document.createElement("m-label");
  scoreLabel.setAttribute("content", "0");
  scoreLabel.setAttribute("color", "rgba(0,0,0,0)");
  scoreLabel.setAttribute("alignment", "center");
  scoreLabel.setAttribute("font-size", "50");
  scoreLabel.setAttribute("font-color", "#00FF00");
  scoreLabel.setAttribute("x", "0");
  scoreLabel.setAttribute("width", "2");
  scoreLabel.setAttribute("height", "0.7");
  scoreLabel.setAttribute("y", "1");
  scoreLabel.setAttribute("z", "0.05");

  const timeLabel = document.createElement("m-label");
  timeLabel.setAttribute("content", "0");
  timeLabel.setAttribute("color", "rgba(0,0,0,0)");
  timeLabel.setAttribute("alignment", "center");
  timeLabel.setAttribute("font-size", "15");
  timeLabel.setAttribute("font-color", "white");
  timeLabel.setAttribute("x", "0");
  timeLabel.setAttribute("width", "2.5");
  timeLabel.setAttribute("height", "0.55");
  timeLabel.setAttribute("y", "1.6");
  timeLabel.setAttribute("z", "0.05");

  const boardModel = document.createElement("m-model");
  boardModel.setAttribute("src", Assets.boardGlb);
  boardModel.setAttribute("z", "10");
  boardModel.setAttribute("x", "-1");
  boardModel.appendChild(timeLabel);
  boardModel.appendChild(scoreLabel);
  gameElement.appendChild(boardModel);

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

  let firstFireTime: number | null = null;
  let completedTime: number | null = null;

  let levelInstance: LevelInstance | null = null;
  function restart() {
    if (levelInstance) {
      levelInstance.dispose();
      levelInstance = null;
    }

    levelInstance = new LevelInstance(rapier, {
      timeLabel,
      scoreLabel,
      firePosition,
      levelConfig: currentLevel,
    })
    levelInstance.start();
  }

  const firePosition = { x: 3, y: 0, z: 10 };
  const arrowPosition = { x: 3, y: 1.5, z: 11.5 };
  let cannonAngle = 0;
  let cannonPitch = 110;
  let maxAbsAngle = 45;
  let minCannonPitch = 90;
  let maxCannonPitch = 140;

  const cannonControls = new CannonControls({
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
  gameElement.appendChild(cannonControls.element);

  const cannonGroup = document.createElement("m-group");
  cannonGroup.setAttribute("sx", "0.5");
  cannonGroup.setAttribute("sy", "0.5");
  cannonGroup.setAttribute("sz", "0.5");
  cannonGroup.setAttribute("x", firePosition.x.toString());
  cannonGroup.setAttribute("y", (1.25 + firePosition.y).toString());
  cannonGroup.setAttribute("z", firePosition.z.toString());
  addLerpElementToElement(cannonGroup, 100);

  const cannonBarrel = document.createElement("m-model");
  cannonBarrel.setAttribute("src", Assets.cannonGlb);
  cannonBarrel.setAttribute("ry", "90");
  cannonBarrel.setAttribute("rx", "50");
  cannonGroup.appendChild(cannonBarrel);
  addLerpElementToElement(cannonBarrel, 100);

  const cannonBase = document.createElement("m-model");
  cannonBase.setAttribute("src", Assets.cannonBaseGlb);
  cannonBase.setAttribute("ry", "90");
  cannonGroup.appendChild(cannonBase);
  gameElement.appendChild(cannonGroup);

  updateCannon();

  let firepowerMax = 40;
  const fireControls = new FireControls({
    firepowerInterval: 1000
  }, (strength) => {
    const velocity = strength * firepowerMax;

    levelInstance!.fireBall({velocity, cannonAngle, cannonPitch});
  })
  fireControls.element.setAttribute("x", firePosition.x.toString());
  fireControls.element.setAttribute("y", firePosition.y.toString());
  fireControls.element.setAttribute("z", firePosition.z.toString());
  gameElement.appendChild(fireControls.element);

  restart();
});

