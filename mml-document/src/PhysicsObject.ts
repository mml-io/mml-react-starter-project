import type RAPIER from "@dimforge/rapier3d"
import { Quat } from "./math/Quat";
import { EulXYZ } from "./math/EulXYZ";
import { radToDeg } from "./math/radToDeg";

type PhysicsObjectDesc = {
    type: "sphere",
    radius: number;
} | {
    type: "box",
    width: number;
    height: number;
    depth: number;
} | {
    type: "cylinder",
    radius: number;
    height: number;
}

type DisplayMML = {
    type: "sphere",
    radius: number;
} | {
    type: "cube",
    width: number;
    height: number;
    depth: number;
} | {
    type: "cylinder",
    radius: number;
    height: number;
}

export class PhysicsObject {

    public rigidBody: RAPIER.RigidBody;
    private collider: RAPIER.Collider;
    public mmlElementWithLerp: {
      element: HTMLElement;
      lerp: HTMLElement;
    } | null = null;

    private lastPosition: { x: number, y: number, z: number } = { x: Infinity, y: Infinity, z: Infinity };
    private lastRotation: { x: number, y: number, z: number } = { x: Infinity, y: Infinity, z: Infinity };

  constructor(
    private rapier: typeof RAPIER, 
    private world: RAPIER.World,
    private desc: PhysicsObjectDesc,
    position: { x: number, y: number, z: number },
    private display?: DisplayMML,
  ) {
    if (this.display) {
      let mmlElement: HTMLElement;
        if (this.display.type === "cube") {
            mmlElement = document.createElement("m-cube");
            mmlElement.setAttribute("color", "red");
            mmlElement.setAttribute("width", this.display.width.toString());
            mmlElement.setAttribute("height", this.display.height.toString());
            mmlElement.setAttribute("depth", this.display.depth.toString());
        } else if (this.display.type === "sphere") {
          mmlElement = document.createElement("m-sphere");
            mmlElement.setAttribute("radius", this.display.radius.toString());
        } else if (this.display.type === "cylinder") {
          mmlElement = document.createElement("m-cylinder");
            mmlElement.setAttribute("radius", this.display.radius.toString());
            mmlElement.setAttribute("height", this.display.height.toString());
        }
        mmlElement.setAttribute("x", position.x.toFixed(2));
        mmlElement.setAttribute("y", position.y.toFixed(2));
        mmlElement.setAttribute("z", position.z.toFixed(2));
        this.mmlElementWithLerp = {
          element: mmlElement,
          lerp: document.createElement("m-attr-lerp"),
        }
        this.mmlElementWithLerp.lerp.setAttribute("duration", "100");
        this.mmlElementWithLerp.lerp.setAttribute("attr", "x,y,z,rx,ry,rz");
        this.mmlElementWithLerp.element.appendChild(this.mmlElementWithLerp.lerp);
        document.body.appendChild(this.mmlElementWithLerp.element);
    }
    this.lastPosition.x = position.x;
    this.lastPosition.y = position.y;
    this.lastPosition.z = position.z;

    let rigidBodyDesc = this.rapier.RigidBodyDesc.dynamic().setTranslation(position.x, position.y, position.z);
    this.rigidBody = this.world.createRigidBody(rigidBodyDesc);

    if (this.desc.type === "box") {
        // Create a cuboid collider attached to the dynamic rigidBody.
        let colliderDesc1 = this.rapier.ColliderDesc.cuboid(this.desc.width/2, this.desc.height/2, this.desc.depth/2);
        this.collider = this.world.createCollider(colliderDesc1, this.rigidBody);
    } else if (this.desc.type === "sphere") {
        // Create a sphere collider attached to the dynamic rigidBody.
        let colliderDesc1 = this.rapier.ColliderDesc.ball(this.desc.radius);
        this.collider = this.world.createCollider(colliderDesc1, this.rigidBody);
    } else if (this.desc.type === "cylinder") {
        // Create a cylinder collider attached to the dynamic rigidBody.
        let colliderDesc1 = this.rapier.ColliderDesc.cylinder(this.desc.radius, this.desc.height);
        this.collider = this.world.createCollider(colliderDesc1, this.rigidBody);
    }
    
  }

  tick() {
    if (this.mmlElementWithLerp) {
      const { element, lerp } = this.mmlElementWithLerp;
      // Get and print the rigid-body's position.
      let position = this.rigidBody.translation();
      const r = this.rigidBody.rotation();
      const quat = new Quat(r.x, r.y, r.z, r.w);
      let rotation = new EulXYZ().setFromQuaternion(quat);

      const deltaPosition = {
        x: position.x - this.lastPosition.x,
        y: position.y - this.lastPosition.y,
        z: position.z - this.lastPosition.z,
      }
      const distance = Math.sqrt(deltaPosition.x * deltaPosition.x + deltaPosition.y * deltaPosition.y + deltaPosition.z * deltaPosition.z);
      if (distance > 0.01) {
        element.setAttribute("x", position.x.toFixed(2));
        element.setAttribute("y", position.y.toFixed(2));
        element.setAttribute("z", position.z.toFixed(2));
        this.lastPosition = {
          x: position.x,
          y: position.y,
          z: position.z,
        };
      }

      const deltaRotation = (Math.abs(rotation.x - this.lastRotation.x) + Math.abs(rotation.y - this.lastRotation.y) + Math.abs(rotation.z - this.lastRotation.z));
      if (deltaRotation > 0.01) {
        element.setAttribute("rx", radToDeg(rotation.x).toFixed(0));
        element.setAttribute("ry", radToDeg(rotation.y).toFixed(0));
        element.setAttribute("rz", radToDeg(rotation.z).toFixed(0));
        this.lastRotation = {
          x: rotation.x,
          y: rotation.y,
          z: rotation.z,
        };
      }
    }
  }

  dispose() {
    this.world.removeCollider(this.collider, false);
    this.world.removeRigidBody(this.rigidBody);
    if (this.mmlElementWithLerp) {
      this.mmlElementWithLerp.element.remove();
    }
  }
}