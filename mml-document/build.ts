import * as esbuild from "esbuild";
import { mml, MMLPluginOptions } from "@mml-io/esbuild-plugin-mml";

const buildMode = "--build";
const watchMode = "--watch";

const helpString = `Mode must be provided as one of ${buildMode} or ${watchMode}`;

const buildOptions: esbuild.BuildOptions = {
  entryPoints: {
    index: "mml:src/index.tsx",
  },
  bundle: true,
  sourceRoot: "./src",
  external: ["node:crypto"],
  write: true,
  sourcemap: true,
  outdir: "build",
  loader: {
    ".svg": "file",
    ".png": "file",
    ".jpg": "file",
    ".jpeg": "file",
    ".glb": "file",
    ".hdr": "file",
    ".mp3": "file",
    ".mp4": "file",
    ".wav": "file",
  },
  plugins: [
    mml({
      assetPrefix: "/assets/",
      assetDir: "assets",
    } satisfies MMLPluginOptions),
  ],
};

const args = process.argv.splice(2);

if (args.length !== 1) {
  console.error(helpString);
  process.exit(1);
}

const mode = args[0];

switch (mode) {
  case buildMode:
    esbuild.build(buildOptions).catch(() => process.exit(1));
    break;
  case watchMode:
    esbuild
        .context({ ...buildOptions })
        .then((context) => context.watch())
        .catch(() => process.exit(1));
    break;
  default:
    console.error(helpString);
}
