type ButtonOptions = {
    text: string;
    buttonColor: string;
    textColor: string;
    onClick: () => void;
    fontSize?: number;
}

export class Button {
    public element: HTMLElement;

    constructor(options: ButtonOptions) {
        const group = document.createElement("m-group");
        this.element = group;

        const baseCylinder = document.createElement("m-cylinder");
        baseCylinder.setAttribute("color", "#9e9e9e");
        baseCylinder.setAttribute("height", "0.2");
        group.appendChild(baseCylinder);
        
        const topCylinder = document.createElement("m-cylinder");
        topCylinder.setAttribute("color", options.buttonColor);
        topCylinder.setAttribute("height", "0.2");
        topCylinder.setAttribute("radius", "0.45");
        const buttonUpY = 0.1;
        const buttonDepressedY = 0.05;
        topCylinder.setAttribute("y", buttonUpY.toString());

        const label = document.createElement("m-label");
        label.setAttribute("rx", "-90");
        label.setAttribute("content", options.text);
        label.setAttribute("font-color", options.textColor);
        label.setAttribute("color", "rgba(0,0,0,0)");
        label.setAttribute("y", "0.11");
        label.setAttribute("height", "0.3");
        label.setAttribute("alignment", "center");
        label.setAttribute("width", "0.7");
        label.setAttribute("font-size", options.fontSize?.toString() || "18");
        topCylinder.appendChild(label);
        group.appendChild(topCylinder);

        const topCylinderLerp = document.createElement("m-attr-lerp");
        topCylinderLerp.setAttribute("attr", "y");
        topCylinderLerp.setAttribute("duration", "200");
        topCylinder.appendChild(topCylinderLerp);

        group.addEventListener("click", () => {
            topCylinder.setAttribute("y", buttonDepressedY.toString());
            setTimeout(() => {
                topCylinder.setAttribute("y", buttonUpY.toString());
            }, 200);

            options.onClick();
        })
    }
}