import * as fs from "fs";
import path from "path";

import * as chokidar from "chokidar";
import express, { static as expressStatic, Request } from "express";
import enableWs from "express-ws";
import {
  EditableNetworkedDOM,
  LocalObservableDomFactory,
} from "networked-dom-server";



const document = new EditableNetworkedDOM(
  "file://document",
  LocalObservableDomFactory
);

function reload() {

  const contents = fs.readFileSync(filePath, "utf8");
  const htmlContents = `<m-group id="root"></m-group><script>${contents}</script>`;

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


const { app } = enableWs(express());
























  expressStatic(




app.ws("/", (ws) => {
  document.addWebSocket(ws as unknown as WebSocket);
  ws.addEventListener("close", () => {
    document.removeWebSocket(ws as unknown as WebSocket);
  });
});




