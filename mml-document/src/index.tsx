import * as React from "react";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";

import FishingLake from "./FishingLake";

function App() {
  const [url, setUrl] = useState(window.location.href);

  useEffect(() => {
    // Update URL if it changes
    const handleUrlChange = () => {
      setUrl(window.location.href);
    };

    window.addEventListener("popstate", handleUrlChange);
    return () => {
      window.removeEventListener("popstate", handleUrlChange);
    };
  }, []);

  return (
    <>
      <FishingLake url={url} />
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById("root")!;
const root = createRoot(container);
flushSync(() => {
  root.render(<App />);
});
