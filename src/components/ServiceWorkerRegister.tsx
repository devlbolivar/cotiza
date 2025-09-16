"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister(): null {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((error) => console.error("SW registration failed", error));
    }
  }, []);

  return null;
}
