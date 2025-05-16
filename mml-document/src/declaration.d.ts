import "@mml-io/mml-react-types";
import { MButtonAttributes, MLabelAttributes } from "@mml-io/mml-react-types";

// Optionally, if you want to add 'style' to all MML elements:
declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      style?: string;
    }
    interface IntrinsicElements {
      "m-button": MButtonAttributes;
      "m-label": MLabelAttributes;
    }
  }
}

// Augment MML element types to include missing attributes
declare module "@mml-io/mml-react-types" {
  interface MButtonAttributes {
    x?: number;
    y?: number;
    z?: number;
    content?: string;
    onClick?: () => void;
  }
}

export {};
