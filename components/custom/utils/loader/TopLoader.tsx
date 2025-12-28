"use client";

import NextTopLoader from "nextjs-toploader";
import { useTheme } from "next-themes";

export default function TopLoader() {
  const { theme } = useTheme();
  return (
    <NextTopLoader
      color={theme === "dark" ? "#e4e4e7" : "#18181b"}
      height={3}
      showSpinner={false}
      crawl={true}
      crawlSpeed={200}
      speed={200}
      easing="ease"
      shadow={
        theme === "dark" ? "0 0 10px #e4e4e7 / 0.35" : "0 0 10px #e4e4e7 / 0.35"
      }
      zIndex={1600}
    />
  );
}
