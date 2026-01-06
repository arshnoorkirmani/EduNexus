"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function GoToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const scrollContainer = document.querySelector(
      "#app-scroll-area [data-radix-scroll-area-viewport]"
    ) as HTMLElement | null;

    if (!scrollContainer) return;

    const onScroll = () => {
      setVisible(scrollContainer.scrollTop > 300);
    };

    scrollContainer.addEventListener("scroll", onScroll);
    return () => scrollContainer.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    const scrollContainer = document.querySelector(
      "#app-scroll-area [data-radix-scroll-area-viewport]"
    ) as HTMLElement | null;

    scrollContainer?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={scrollToTop}
            size="icon"
            variant="secondary"
            aria-label="Scroll back to top"
            className={cn(
              "fixed bottom-6 right-6 z-50 h-11 w-11 rounded-full cursor-pointer",
              "shadow-lg transition-all duration-300 ease-out",
              "hover:scale-105 hover:shadow-xl",
              visible
                ? "opacity-100 translate-y-0"
                : "pointer-events-none opacity-0 translate-y-4"
            )}
          >
            <ChevronUp className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">Back to top</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
