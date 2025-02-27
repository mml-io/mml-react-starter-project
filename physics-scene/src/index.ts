// @ts-ignore
import * as RAPIER from "./RAPIER";

export async function doTheThing() {
  return new Promise((resolve, reject) => {
    RAPIER.init().then(() => {
      resolve(RAPIER);
    });
  });
}
