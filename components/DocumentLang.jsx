"use client";

import { useEffect } from "react";

export function DocumentLang({ lang = "et" }) {
  useEffect(() => {
    const previous = document.documentElement.lang;
    document.documentElement.lang = lang;

    return () => {
      document.documentElement.lang = previous || "et";
    };
  }, [lang]);

  return null;
}
