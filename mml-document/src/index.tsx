import * as React from "react";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";

import Dice from "./Dice";
import Labels from "./Labels";
import Light from "./Light";

function App() {
  const [connectedClients, setConnectedClients] = useState(0);
  const [diceClickCount, setDiceClickCount] = useState(0);
  const [totalUptimeSeconds, setTotalUptimeSeconds] = useState(0);

  const onDiceClick = () => {
    setDiceClickCount((n) => n + 1);
  };

  const updateUptimeLabel = () => {
    // Get total document uptime
    // NOTE: document.timeline.currentTime reports uptime in ms
    if (!document.timeline.currentTime) return;
    setTotalUptimeSeconds(
      Math.floor((document.timeline.currentTime as number) / 1000),
    );
  };

  useEffect(() => {
    updateUptimeLabel();
    const intervalId = setInterval(updateUptimeLabel, 1000);

    window.addEventListener("connected", () => {
      setConnectedClients((n) => n + 1);
    });
    window.addEventListener("disconnected", () => {
      setConnectedClients((n) => n - 1);
    });

    return () => {
      clearInterval(intervalId);

      window.removeEventListener("connected", () => {
        setConnectedClients((n) => n + 1);
      });
      window.removeEventListener("disconnected", () => {
        setConnectedClients((n) => n - 1);
      });
    };
  }, []);

  const uptimeMinutes = Math.floor(totalUptimeSeconds / 60);
  const uptimeSeconds = totalUptimeSeconds - uptimeMinutes * 60;
  const uptimeLabelText =
    uptimeMinutes > 0
      ? `${uptimeMinutes}:${String(uptimeSeconds).padStart(2, "0")}`
      : `${uptimeSeconds}s`;

  return (
    <>
      <Light />
      <Labels
        connectedText={`Connected clients: ${connectedClients}`}
        rollsText={`Dice clicks: ${diceClickCount}`}
        uptimeText={`Uptime: ${uptimeLabelText}`}
      />
      <Dice onClick={onDiceClick} />
    </>
  );
}

const container = document.getElementById("root")!;
const root = createRoot(container);
flushSync(() => {
  root.render(<App />);
});
