import { Assets } from "./Assets";

type CannonControlsOptions = {
    maxAbsAngle: number;
    minCannonPitch: number;
    maxCannonPitch: number;
}

const leftFirePosition = { x: - 1, y: 0, z: 0 };
const rightFirePosition = { x: + 1, y: 0, z: 0 };
const upFirePosition = { x: 0, y: + 1, z: 0 };
const downFirePosition = { x: 0, y: - 1, z: 0 };

export class CannonControls {
    public element: HTMLElement;

    constructor(private options: CannonControlsOptions, private onUpdate: (cannonAngle: number, cannonPitch: number) => void) {

        const controlsGroup = document.createElement("m-group");
        this.element = controlsGroup;

        let cannonAngle = 0;
        let cannonPitch = 110;

        const leftFire = document.createElement("m-model");
        leftFire.setAttribute("src", Assets.arrowGlb);
        leftFire.setAttribute("x", leftFirePosition.x.toString());
        leftFire.setAttribute("y", leftFirePosition.y.toString());
        leftFire.setAttribute("z", leftFirePosition.z.toString());
        leftFire.setAttribute("sx", "2");
        leftFire.setAttribute("rz", "180");
        leftFire.setAttribute("sy", "2");
        leftFire.setAttribute("sz", "2");
        leftFire.setAttribute("color", "red");
        leftFire.addEventListener("click", () => {
            cannonAngle -= 2.5;
            if (cannonAngle < -this.options.maxAbsAngle) {
                cannonAngle = -this.options.maxAbsAngle;
            }
            this.onUpdate(cannonAngle, cannonPitch);
        });
        controlsGroup.appendChild(leftFire);

        const rightFire = document.createElement("m-model");
        rightFire.setAttribute("src", Assets.arrowGlb);
        rightFire.setAttribute("x", rightFirePosition.x.toString());
        rightFire.setAttribute("y", rightFirePosition.y.toString());
        rightFire.setAttribute("z", rightFirePosition.z.toString());
        rightFire.setAttribute("sx", "2");
        rightFire.setAttribute("sy", "2");
        rightFire.setAttribute("sz", "2");
        rightFire.setAttribute("color", "blue");
        rightFire.addEventListener("click", () => {
            cannonAngle += 2.5;
            if (cannonAngle > this.options.maxAbsAngle) {
                cannonAngle = this.options.maxAbsAngle;
            }
            this.onUpdate(cannonAngle, cannonPitch);
        });
        controlsGroup.appendChild(rightFire);

        const upFire = document.createElement("m-model");
        upFire.setAttribute("src", Assets.arrowGlb);
        upFire.setAttribute("x", upFirePosition.x.toString());
        upFire.setAttribute("y", upFirePosition.y.toString());
        upFire.setAttribute("z", upFirePosition.z.toString());
        upFire.setAttribute("sx", "2");
        upFire.setAttribute("sy", "2");
        upFire.setAttribute("sz", "2");
        upFire.setAttribute("color", "red");
        upFire.setAttribute("rz", "90");
        upFire.addEventListener("click", () => {
            cannonPitch += 2.5;
            if (cannonPitch > this.options.maxCannonPitch) {
                cannonPitch = this.options.maxCannonPitch;
            }
            this.onUpdate(cannonAngle, cannonPitch);
        });
        controlsGroup.appendChild(upFire);
        const downFire = document.createElement("m-model");
        downFire.setAttribute("src", Assets.arrowGlb);
        downFire.setAttribute("x", downFirePosition.x.toString());
        downFire.setAttribute("y", downFirePosition.y.toString());
        downFire.setAttribute("z", downFirePosition.z.toString());
        downFire.setAttribute("sx", "2");
        downFire.setAttribute("sy", "2");
        downFire.setAttribute("sz", "2");
        downFire.setAttribute("color", "blue");
        downFire.setAttribute("rz", "-90");
        downFire.addEventListener("click", () => {
            cannonPitch -= 2.5;
            if (cannonPitch < this.options.minCannonPitch) {
                cannonPitch = this.options.minCannonPitch;
            }
            this.onUpdate(cannonAngle, cannonPitch);
        });
        controlsGroup.appendChild(downFire);
    }
}