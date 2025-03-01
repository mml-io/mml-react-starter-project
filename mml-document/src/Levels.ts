export type LevelConfig = {
  balls: number;
  cubes: {
    x: number;
    y: number;
    z: number;
    rx?: number;
    ry?: number;
    rz?: number;
  }[];
  planks: {
    x: number;
    y: number;
    z: number;
    width: number;
    depth: number;
    height: number;
    rx?: number;
    ry?: number;
    rz?: number;
  }[];
  enemies: {
    x: number;
    y: number;
    z: number;
    rx?: number;
    ry?: number;
    rz?: number;
  }[];
}

export const level1: LevelConfig = {
  balls: 2,
  cubes: [
  ],
  planks: [
    { x: 3, y: 3.6, z: 2, width: 6.5, depth: 1, height: 0.2, ry: 0 },
  ],
  enemies: [
    { x: 1, y: 3.8, z: 2 },
    { x: 3, y: 3.8, z: 2 },
    { x: 5, y: 3.8, z: 2 },
  ],
}
for (let y = 0; y < 3; y++) {
  for (let x = 0; x < 6; x++) {
    for (let z = 2; z < 3; z++) {
      level1.cubes.push({ x: (x * 1) + (y % 2 === 0 ? 1 * 0.5 : 0), y: (y + 0.5) * 1, z: z * 1 });
    }
  }
}

export const level2: LevelConfig = {
  balls: 5,
  cubes: [
    { y: 0.5, x: 1.75 + -4.5, z: -2 },
    { y: 1.5, x: 1.75 + -4.5, z: -2, ry: 45.213 },
    { y: 2.5, x: 1.75 + -4.5, z: -2 },
    { y: 3.7, x: 1.75 + -4.5, z: -2 },
    { y: 4.7, x: 1.75 + -4.5, z: -2, ry: -20.152 },
    { y: 5.7, x: 1.75 + -4.5, z: -2, ry: 44.636 },
    { y: 0.5, x: 1.75 + -0, z: -3.7 },
    { y: 1.5, x: 1.75 + -0, z: -3.7, ry: 50.449 },
    { y: 2.5, x: 1.75 + -0, z: -3.7 },
    { y: 3.7, x: 1.75 + -0, z: -3.7 },
    { y: 4.7, x: 1.75 + -0, z: -3.7, ry: 17.353 },
    { y: 5.7, x: 1.75 + -0, z: -3.7 },
    { y: 0.5, x: 1.75 + 6.5, z: -2 },
    { y: 1.5, x: 1.75 + 6.5, z: -2, ry: 19.742 },
    { y: 2.5, x: 1.75 + 6.5, z: -2, ry: 8.744 },
    { y: 3.7, x: 1.75 + 6.5, z: -2 },
    { y: 4.7, x: 1.75 + 6.5, z: -2, ry: -18.655 },
    { y: 5.7, x: 1.75 + 6.5, z: -2 },
    { y: 0.5, x: 1.75 + 2, z: -3.7, ry: 41.871 },
    { y: 1.5, x: 1.75 + 2, z: -3.7 },
    { y: 2.5, x: 1.75 + 2, z: -3.7, ry: 12.603 },
    { y: 3.7, x: 1.75 + 2, z: -3.7 },
    { y: 4.7, x: 1.75 + 2, z: -3.7, ry: 20.758 },
    { y: 5.7, x: 1.75 + 2, z: -3.7, ry: -10.153 },
    { y: 0.5, x: 1.75 + -4, z: -7 },
    { y: 1.5, x: 1.75 + -4, z: -7, ry: -46.062 },
    { y: 2.5, x: 1.75 + -4, z: -7, ry: 24.805 },
    { y: 3.5, x: 1.75 + -4, z: -7, ry: -36.243 },
    { y: 4.5, x: 1.75 + -4, z: -7, ry: -5.245 },
    { y: 5.5, x: 1.75 + -4, z: -7 },
    { y: 6.5, x: 1.75 + -4, z: -7, ry: -46.062 },
    { y: 7.5, x: 1.75 + -4, z: -7, ry: 2.805 },
    { y: 8.5, x: 1.75 + -4, z: -7, ry: -30.243 },
    { y: 0.5, x: 1.75 + 6, z: -7 },
    { y: 1.5, x: 1.75 + 6, z: -7, ry: -46.062 },
    { y: 2.5, x: 1.75 + 6, z: -7, ry: 24.805 },
    { y: 3.5, x: 1.75 + 6, z: -7, ry: -36.243 },
    { y: 4.5, x: 1.75 + 6, z: -7, ry: -5.245 },
    { y: 5.5, x: 1.75 + 6, z: -7 },
    { y: 6.5, x: 1.75 + 6, z: -7, ry: -46.062 },
    { y: 7.5, x: 1.75 + 6, z: -7, ry: 2.805 },
    { y: 8.5, x: 1.75 + 6, z: -7, ry: -30.243 },

  ],
  planks: [
    { y: 3.1, x: 1.75 + -2.3, z: -2.8, width: 6.5, depth: 1, height: 0.2, ry: 21 },
    { y: 6.3, x: 1.75 + -2.3, z: -2.8, width: 6.5, depth: 1, height: 0.2, ry: 21 },
    { y: 3.1, x: 1.75 + 4.3, z: -2.8, width: 6.5, depth: 1, height: 0.2, ry: -21 },
    { y: 6.3, x: 1.75 + 4.3, z: -2.8, width: 6.5, depth: 1, height: 0.2, ry: -21 },
    { y: 6.5, x: 1.75 + 1, z: -3.2, width: 6.5, depth: 1, height: 0.2 },
  ],
  enemies: [
    { y: 3.1, x: 1.75 + -2.3, z: -2.8, ry: -90 },
    { y: 3.1, x: 1.75 + 4.3, z: -2.8, ry: -90 },
    { y: 6.5, x: 1.75 + 1, z: -3.2, ry: -90 },
    { y: 8.9, x: 1.75 + -4, z: -7, ry: -90 },
    { y: 8.9, x: 1.75 + 6, z: -7, ry: -90 },
  ],
}

export const levels = [
  level1,
  level2,
]