import * as fs from "fs";
import path from "path";
import url from "url";

import * as chokidar from "chokidar";
import cors from "cors";
import express, { static as expressStatic, Request } from "express";
import enableWs from "express-ws";
import {
  EditableNetworkedDOM,
  LocalObservableDOMFactory,
} from "networked-dom-server";

const dirname = url.fileURLToPath(new URL(".", import.meta.url));
const filePath = "./mml-document/build/index.js";

const document = new EditableNetworkedDOM(
  "file://document",
  LocalObservableDOMFactory,
);

function reload() {
  console.log("Reloading", filePath);
  const contents = fs.readFileSync(filePath, "utf8");
  const htmlContents = `<m-group id="root"></m-group><script>${contents}</script>`;
  document.load(htmlContents);
}
const watcher = chokidar.watch(filePath, { persistent: true });
watcher
  .on("add", () => {
    reload();
  })
  .on("change", () => {
    reload();
  })
  .on("unlink", () => {
    reload();
  })
  .on("error", (error) => {
    console.error("Error happened", error);
  });

const webPort = process.env.PORT || "27272";
const { app } = enableWs(express());

app.enable("trust proxy");

const getWebsocketUrl = (req: Request) =>
  `${req.secure ? "wss" : "ws"}://${
    req.headers["x-forwarded-host"] && req.headers["x-forwarded-port"]
      ? `${req.headers["x-forwarded-host"]}:${
          (req.headers["x-forwarded-port"] as string).split(",")[0]
        }` // In case of Glitch hosting. See comment below.
      : req.headers.host
  }`;

app.get("/", (req, res) => {
  res.send(`
    <html>
      <script src="/client/index.js?websocketUrl=${getWebsocketUrl(
        req,
      )}"></script>
    </html>
`);
});

app.use(
  "/client/",
  expressStatic(path.resolve(dirname, "../node_modules/mml-web-client/build/")),
);

// Serve assets with CORS allowing all origins
app.use("/assets/", cors(), expressStatic(path.resolve(dirname, "../assets/")));

app.ws("/", (ws) => {
  document.addWebSocket(ws as unknown as WebSocket);
  ws.addEventListener("close", () => {
    document.removeWebSocket(ws as unknown as WebSocket);
  });
});

// Start listening on specified port
console.log("Listening on port", webPort);
app.listen(webPort);
