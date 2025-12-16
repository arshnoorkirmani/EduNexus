"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/custom/utils/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AppData } from "@/config/appConfig";
import { useSession } from "next-auth/react";
import { UserType } from "@/types/api/helper/next-auth";
import { useAuth } from "@/hooks/useAuth";

// Navigation links
const details = AppData.header.landing;

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  // ================================
  const { role } = useAuth();
  // =================================
  // Add scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-border/60 shadow-sm"
          : "bg-background/60 backdrop-blur-sm border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex h-16 items-center justify-between">
        {/* === Left: Logo === */}
        <LogoLink name={AppData.app.name} iconUrl={AppData.app.icon} />

        {/* === Right: Navigation === */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="flex gap-5">
              {details.links.map((link, i) => (
                <NavigationMenuItem key={i}>
                  <NavigationMenuLink
                    href={
                      link.title == "Home" && role
                        ? `${role}/dashboard`
                        : link.href
                    }
                    className="font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.title == "Home" && role ? "Dashboard" : link.title}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Theme Toggle */}
          <ThemeToggle variant="ghost" />

          {/* CTA Button */}
          <Link href={details.actions[0].href}>
            <Button className="hidden sm:inline-flex shadow-sm hover:shadow-md text-sm px-4">
              {details.actions[0].title}
            </Button>
          </Link>

          {/* Mobile Menu */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

/* ======================= Mobile Menu ======================= */
function MobileMenu() {
  const { role } = useAuth();

  return (
    <Popover>
      {/* ===== Trigger ===== */}
      <PopoverTrigger asChild>
        <Button
          aria-label="Open menu"
          variant="ghost"
          size="icon"
          className="
            md:hidden
            w-9 h-9
            rounded-lg
            text-muted-foreground
            hover:bg-muted/60
            active:scale-95
            transition-all
          "
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </Button>
      </PopoverTrigger>

      {/* ===== Content ===== */}
      <PopoverContent
        align="end"
        sideOffset={10}
        className="
          w-60
          p-3
          rounded-2xl
          border border-border/50
          bg-background/95
          backdrop-blur-xl
          shadow-[0_20px_40px_rgba(0,0,0,0.12)]
          animate-in
          fade-in
          zoom-in-95
        "
      >
        <NavigationMenu className="w-full max-w-none">
          <NavigationMenuList className="flex flex-col gap-1">
            {/* ===== Links ===== */}
            {details.links.map((link, index) => {
              const href =
                link.title === "Home" && role
                  ? `/${role}/dashboard`
                  : link.href;

              const isPrimary = link.title === "Home" && role;

              return (
                <NavigationMenuItem key={index} className="w-full">
                  <NavigationMenuLink
                    href={href}
                    className={cn(
                      "flex items-center justify-center w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                      isPrimary
                        ? "bg-muted/60 text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    )}
                  >
                    {isPrimary ? "Dashboard" : link.title}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}

            {/* ===== Divider ===== */}
            <div className="my-2 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* ===== CTA ===== */}
            <Link
              href={AppData.routes.frontend.auth.register.institute}
              className="w-full"
            >
              <Button
                size="sm"
                className="
                  w-full
                  rounded-lg
                  font-medium
                  shadow-sm
                  hover:shadow-md
                  transition-all
                "
              >
                Get Started
              </Button>
            </Link>
          </NavigationMenuList>
        </NavigationMenu>
      </PopoverContent>
    </Popover>
  );
}

/* ======================= Logo Component ======================= */
export function LogoLink({ name, iconUrl }: { name: string; iconUrl: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center justify-center gap-1 group transition-all duration-200  rounded-md"
      )}
    >
      <Avatar className="">
        <AvatarImage
          src={iconUrl || "/icon.png"} // replace with your EduNexus logo icon
          alt={`${name} Icon`}
          className="object-contain"
        />
        <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
          {name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <span
        className={cn(
          "font-semibold text-base md:text-xl text-foreground leading-none tracking-tight",
          "group-hover:text-primary transition-colors"
        )}
      >
        {name}
      </span>
    </Link>
  );
}
