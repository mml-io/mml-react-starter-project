import { LevelConfig, levels } from "./Levels";

export class LevelPicker {
    public element: HTMLElement;

    constructor(private onLevelSelect: (levelConfig: LevelConfig) => void) {
        this.element = document.createElement("m-cube");

        this.element.setAttribute("height", levels.length.toString());
        this.element.setAttribute("depth", "0.5");
        this.element.setAttribute("color", "#333333");
        this.element.setAttribute("y", (levels.length / 2).toString());

        for (let i = 0; i < levels.length; i++) {
            this.addLevelButton(i);
        }
    }

    private addLevelButton(i: number) {
        const levelButton = document.createElement("m-cube");
        levelButton.setAttribute("color", "#999999");
        levelButton.setAttribute("width", "0.9");
        levelButton.setAttribute("depth", "0.4");
        levelButton.setAttribute("height", "0.9");
        levelButton.setAttribute("y", (i - (levels.length / 2) + 0.5).toString());
        levelButton.setAttribute("z", "0.2");

        const buttonUpZ = 0.2;
        const buttonDepressedZ = 0.1;
        this.element.appendChild(levelButton);
        levelButton.addEventListener("click", () => {
            levelButton.setAttribute("z", buttonDepressedZ.toString());
            setTimeout(() => {
                levelButton.setAttribute("z", buttonUpZ.toString());
            }, 200);

            
            this.onLevelSelect(levels[i]);
        });

        const buttonLerp = document.createElement("m-attr-lerp");
        buttonLerp.setAttribute("attr", "z");
        buttonLerp.setAttribute("duration", "200");
        levelButton.appendChild(buttonLerp);

        const label = document.createElement("m-label");
        label.setAttribute("content", (i+1).toString());
        label.setAttribute("font-color", "#FFFFFF");
        label.setAttribute("color", "rgba(0,0,0,0)");
        label.setAttribute("z", "0.21");
        label.setAttribute("width", "0.9");
        label.setAttribute("height", "0.75");
        label.setAttribute("font-size", "50");
        label.setAttribute("alignment", "center");
        levelButton.appendChild(label);
    }
}