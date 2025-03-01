import { Button } from "./Button";

type FireControlsOptions = {
    firepowerInterval: number;
}

export class FireControls {
    public element: HTMLElement;

    constructor(private options: FireControlsOptions, private fire: (strength: number) => void) {

        const controlsGroup = document.createElement("m-group");
        this.element = controlsGroup;

        const meterHeight = 1.4;
        const meterWidth = 0.3;

        const firepowerMeterHolder = document.createElement("m-cube");
        firepowerMeterHolder.setAttribute("x", (3).toString());
        firepowerMeterHolder.setAttribute("y", (0.75).toString());
        firepowerMeterHolder.setAttribute("z", (-0.15).toString());
        firepowerMeterHolder.setAttribute("width", "0.4");
        firepowerMeterHolder.setAttribute("height", "1.5");
        firepowerMeterHolder.setAttribute("depth", "0.4");
        firepowerMeterHolder.setAttribute("color", "#9e9e9e");
        controlsGroup.appendChild(firepowerMeterHolder);

        const yOffset = 0.05;

        const firepowerMeter = document.createElement("m-cube");
        firepowerMeter.setAttribute("x", (3).toString());
        firepowerMeter.setAttribute("y", (yOffset).toString());
        firepowerMeter.setAttribute("z", (0).toString());
        firepowerMeter.setAttribute("width", meterWidth.toString());
        firepowerMeter.setAttribute("height", "0.01");
        firepowerMeter.setAttribute("depth", "0.3");
        firepowerMeter.setAttribute("color", "#58ef06");
        controlsGroup.appendChild(firepowerMeter);

        let firepowerTimer: number | null = null;

        let firepowerMeterAnimationHeight: HTMLElement | null = null;
        let firepowerMeterAnimationY: HTMLElement | null = null;

        const shootButton = new Button({
            text: "SHOOT",
            buttonColor: "#ff2424",
            textColor: "#FFFFFF",
            onClick: () => {
                if (firepowerTimer !== null) {
                    const timeSinceLastClick = performance.now() - firepowerTimer;
                    const firepower = (timeSinceLastClick % this.options.firepowerInterval) / this.options.firepowerInterval;
    
                    let result;
                    if (firepower > 0.5) {
                        result = 1 - (firepower - 0.5) * 2;
                    } else {
                        result = firepower * 2;
                    }
    
                    firepowerTimer = null;
                    firepowerMeterAnimationHeight?.remove();
                    firepowerMeterAnimationY?.remove();
                    fire(result);
                } else {
                    firepowerTimer = performance.now();
                    firepowerMeterAnimationHeight = document.createElement("m-attr-anim");
                    firepowerMeterAnimationHeight.setAttribute("attr", "height");
                    firepowerMeterAnimationHeight.setAttribute("start", "0");
                    firepowerMeterAnimationHeight.setAttribute("end", meterHeight.toString());
                    firepowerMeterAnimationHeight.setAttribute("ping-pong", "true");
                    firepowerMeterAnimationHeight.setAttribute("start-time", document.timeline.currentTime!.toString());
                    firepowerMeterAnimationHeight.setAttribute("duration", this.options.firepowerInterval.toString());
                    firepowerMeterAnimationHeight.setAttribute("loop", "true");
                    firepowerMeter.appendChild(firepowerMeterAnimationHeight);
                    firepowerMeterAnimationY = document.createElement("m-attr-anim");
                    firepowerMeterAnimationY.setAttribute("attr", "y");
                    firepowerMeterAnimationY.setAttribute("end", (yOffset + (meterHeight/2)).toString());
                    firepowerMeterAnimationY.setAttribute("start", (yOffset).toString());
                    firepowerMeterAnimationY.setAttribute("start-time", document.timeline.currentTime!.toString());
                    firepowerMeterAnimationY.setAttribute("ping-pong", "true");
                    firepowerMeterAnimationY.setAttribute("duration", this.options.firepowerInterval.toString());
                    firepowerMeterAnimationY.setAttribute("loop", "true");
                    firepowerMeter.appendChild(firepowerMeterAnimationY);
                }
            }
        });
        shootButton.element.setAttribute("x", (3).toString());
        shootButton.element.setAttribute("z", (1).toString());
        this.element.appendChild(shootButton.element);
    }
}