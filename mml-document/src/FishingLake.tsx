import * as React from "react";
import { useState } from "react";
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

interface FishingLakeProps {
  url: string;
}

interface LakeState {
  seed: number;
  lakeColor: string;
  lakeColorBits: string;
  sideColor: string;
  sideColorBits: string;
  fishTypes: string[];
  fishTypeBits: string;
  fishSizes: string;
  fishSizeBits: string;
  fishRarity: string;
  fishRarityBits: string;
  weather: string;
  weatherBits: string;
}

const LAKE_COLORS = [
  "#4A90E2", // Clear blue
  "#5D9CEC", // Light blue
  "#48CFAD", // Turquoise
  "#37BC9B", // Green-blue
  "#3BAFDA", // Sky blue
  "#4FC1E9", // Light turquoise
  "#5D9CEC", // Ocean blue
  "#4A89DC", // Royal blue
  "#967ADC", // Purple
  "#DA4453", // Pink
];

const SIDE_COLORS = [
  "#8B7355", // Brown
  "#556B2F", // Dark olive
  "#6B8E23", // Olive drab
  "#808080", // Gray
  "#A9A9A9", // Dark gray
  "#696969", // Dim gray
  "#2F4F4F", // Dark slate
  "#708090", // Slate gray
];

const FISH_TYPES = [
  "Bass",
  "Trout",
  "Salmon",
  "Catfish",
  "Pike",
  "Carp",
  "Perch",
  "Tilapia",
  "Goldfish",
  "Koi",
  "Sturgeon",
  "Eel",
  "Sunfish",
  "Crappie",
  "Bluegill",
  "Walleye",
];

const WEATHER_TYPES = [
  "Clear",
  "Cloudy",
  "Rainy",
  "Stormy",
];

// Helper to get bits as a string
function getBits(num: number, start: number, length: number) {
  return ((num >>> start) & ((1 << length) - 1)).toString(2).padStart(length, "0");
}

// DebugLabel helper
const DebugLabel: React.FC<{
  label: string;
  value: string;
  bits?: string;
  color?: string;
  y: number;
  highlight?: boolean;
}> = ({ label, value, bits, color = "white", y, highlight }) => (
  <>
    <m-label
      x={0}
      y={y + 0.18}
      z={0}
      content={label + (bits ? ` [${bits}]` : "")}
      color="#cccccc"
      sx={0.3}
      sy={0.3}
      sz={0.3}
      width={4}
      height={0.4}
      alignment="center"
    />
    <m-label
      x={0}
      y={y}
      z={0}
      content={value}
      color={color}
      sx={highlight ? 0.6 : 0.5}
      sy={highlight ? 0.6 : 0.5}
      sz={highlight ? 0.6 : 0.5}
      width={4}
      height={0.4}
      alignment="center"
    />
  </>
);

const FishingLake: React.FC<FishingLakeProps> = ({ url }) => {
  const [lakeState, setLakeState] = useState<LakeState>(() => {
    const seed = generateSeedFromUrl(url);
    return generateLakeState(seed);
  });

  // Add a state for the generated lake model URL
  const [lakeModelUrl, setLakeModelUrl] = useState<string | null>(null);

  // Generate the lake model whenever the seed or lake color changes
  React.useEffect(() => {
    // 1. Create a Three.js scene and mesh
    const scene = new THREE.Scene();
    const points = 32;
    const baseRadius = 6 + (lakeState.seed % 3); // Example: vary radius by seed
    const shape = new THREE.Shape();
    for (let i = 0; i < points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const noise = (Math.sin(lakeState.seed + i) + 1) * 0.5;
      const r = baseRadius + noise;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();

    const extrudeSettings = { depth: 1, bevelEnabled: false };
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const material = new THREE.MeshStandardMaterial({ color: lakeState.lakeColor });
    const lake = new THREE.Mesh(geometry, material);
    lake.rotateX(-Math.PI / 2);
    lake.position.y = -0.5;
    scene.add(lake);

    // 2. Export to glTF and set as data URL
    const exporter = new GLTFExporter();
    exporter.parse(
      scene,
      (gltf) => {
        const blob = new Blob([JSON.stringify(gltf)], { type: 'application/json' });
        const reader = new FileReader();
        reader.onload = () => setLakeModelUrl(reader.result as string);
        reader.readAsDataURL(blob);
      },
      { binary: false }
    );
    // Cleanup: revoke previous URL if needed
    return () => {
      setLakeModelUrl(null);
    };
  }, [lakeState.seed, lakeState.lakeColor]);

  function generateSeedFromUrl(url: string): number {
    let hash = 0;
    for (let i = 0; i < url.length; i++) {
      const char = url.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  function generateLakeState(seed: number): LakeState {
    // Extract bits for different properties
    const lakeColorBits = (seed >> 3) & 0x1F; // 5 bits
    const sideColorBits = (seed >> 8) & 0x07; // 3 bits
    const fishSizeBits = (seed >> 11) & 0x0F; // 4 bits
    const fishTypeBits = (seed >> 15) & 0xFF; // 8 bits
    const fishRarityBits = (seed >> 23) & 0x03; // 2 bits
    const weatherBits = (seed >> 25) & 0x03; // 2 bits

    // Generate fish types based on bits
    const fishTypes: string[] = [];
    for (let i = 0; i < 4; i++) {
      const typeIndex = (fishTypeBits >> (i * 2)) & 0x03;
      if (typeIndex > 0) {
        fishTypes.push(FISH_TYPES[typeIndex - 1]);
      }
    }

    return {
      seed,
      lakeColor: LAKE_COLORS[lakeColorBits % LAKE_COLORS.length],
      lakeColorBits: getBits(seed, 3, 5),
      sideColor: SIDE_COLORS[sideColorBits % SIDE_COLORS.length],
      sideColorBits: getBits(seed, 8, 3),
      fishTypes,
      fishTypeBits: getBits(seed, 15, 8),
      fishSizes: `${fishSizeBits + 1}`,
      fishSizeBits: getBits(seed, 11, 4),
      fishRarity: fishRarityBits === 0 ? "Common" : fishRarityBits === 1 ? "Uncommon" : "Rare",
      fishRarityBits: getBits(seed, 23, 2),
      weather: WEATHER_TYPES[weatherBits % WEATHER_TYPES.length],
      weatherBits: getBits(seed, 25, 2),
    };
  }

  const regenerateSeed = () => {
    const newSeed = Math.floor(Math.random() * 0xFFFFFFFF);
    setLakeState(generateLakeState(newSeed));
  };

  const resetToUrlSeed = () => {
    const urlSeed = generateSeedFromUrl(url);
    setLakeState(generateLakeState(urlSeed));
  };

  // For fish type highlighting
  const selectedFishIndexes = lakeState.fishTypes.map(type => FISH_TYPES.indexOf(type));

  const DEBUG_LABEL_Y_OFFSET = 1.5;
  const FISH_LABEL_Y_OFFSET = 2.5;

  return (
    <>
      {/* Lighting */}
      <m-light
        type="point"
        intensity="500"
        x="0"
        y="10"
        z="0"
      />
      <m-light
        type="point"
        intensity="500"
        x="10"
        y="10"
        z="10"
        rx="-45"
        ry="45"
      />

      {/* Lake geometry (procedural glTF) */}
      {lakeModelUrl && (
        <m-model src={lakeModelUrl} x={0} y={0} z={0} />
      )}

      {/* Debug labels */}
      <DebugLabel label="URL" value={url} y={2.2 + DEBUG_LABEL_Y_OFFSET} />
      <DebugLabel label="Seed" value={lakeState.seed.toString()} y={1.8 + DEBUG_LABEL_Y_OFFSET} />
      <DebugLabel label="Lake Color" value={lakeState.lakeColor} bits={lakeState.lakeColorBits} color={lakeState.lakeColor} y={1.4 + DEBUG_LABEL_Y_OFFSET} />
      <DebugLabel label="Side Color" value={lakeState.sideColor} bits={lakeState.sideColorBits} color={lakeState.sideColor} y={1.0 + DEBUG_LABEL_Y_OFFSET} />
      <DebugLabel label="Fish Size Range" value={lakeState.fishSizes} bits={lakeState.fishSizeBits} y={0.6 + DEBUG_LABEL_Y_OFFSET} />
      <DebugLabel label="Fish Rarity" value={lakeState.fishRarity} bits={lakeState.fishRarityBits} y={0.2 + DEBUG_LABEL_Y_OFFSET} />
      <DebugLabel label="Weather" value={lakeState.weather} bits={lakeState.weatherBits} y={-0.2 + DEBUG_LABEL_Y_OFFSET} />

      {/* Fish types with highlight */}
      <m-label
        x={0}
        y={-0.6 + FISH_LABEL_Y_OFFSET}
        z={0}
        content="Fish Types [bits]"
        color="#cccccc"
        sx={0.3}
        sy={0.3}
        sz={0.3}
        width={4}
        height={0.4}
        alignment="center"
      />
      <m-label
        x={0}
        y={-0.8 + FISH_LABEL_Y_OFFSET}
        z={0}
        content={lakeState.fishTypes.join(", ") + ` [${lakeState.fishTypeBits}]`}
        color="white"
        sx={0.5}
        sy={0.5}
        sz={0.5}
        width={4}
        height={0.4}
        alignment="center"
      />
      {/* Fish type lookup table */}
      {FISH_TYPES.map((type, i) => (
        <m-label
          key={type}
          x={-2}
          y={0.8 - i * 0.15 + FISH_LABEL_Y_OFFSET}
          z={0}
          content={type}
          color={selectedFishIndexes.includes(i) ? "#FFD700" : "#888"}
          sx={selectedFishIndexes.includes(i) ? 0.4 : 0.3}
          sy={selectedFishIndexes.includes(i) ? 0.4 : 0.3}
          sz={selectedFishIndexes.includes(i) ? 0.4 : 0.3}
          width={4}
          height={0.4}
          alignment="center"
        />
      ))}

      {/* Buttons */}
      <m-button
        x={2}
        y={2}
        z={0}
        content="New Seed"
        onClick={regenerateSeed}
      />
      <m-button
        x={-2}
        y={2}
        z={0}
        content="Reset to URL"
        onClick={resetToUrlSeed}
      />
    </>
  );
};

export default FishingLake; 