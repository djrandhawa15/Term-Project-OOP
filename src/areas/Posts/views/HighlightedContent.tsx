"use client";

import { useLayoutEffect } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

export const HighlightedContent = ({ children }: { children: React.ReactNode }) => {
  if (typeof window !== "undefined") {
    // Run highlight only in the browser
    useLayoutEffect(() => {
      hljs.highlightAll();
    }, []);
  }

  return <>{children}</>;
};
