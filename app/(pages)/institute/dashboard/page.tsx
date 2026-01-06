"use client";

import React from "react";
import HeaderContainer from "@/components/custom/user-pages/header/HeaderContainer";
import {
  Rocket,
  Construction,
  LayoutTemplate,
  BarChart3,
  Users,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  return (
    <HeaderContainer
      title="Dashboard"
      description="Overview of your institute's performance and activities."
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex"
            disabled
          >
            <Clock className="w-4 h-4 mr-2" />
            Coming Soon
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <div className="max-w-2xl w-full text-center relative z-10 space-y-8">
          {/* Main Icon Group */}
          <div className="relative mx-auto w-24 h-24 sm:w-32 sm:h-32">
            <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-25" />
            <div className="relative flex items-center justify-center w-full h-full bg-gradient-to-br from-background to-muted rounded-full border border-border shadow-xl">
              <Rocket className="w-10 h-10 sm:w-14 sm:h-14 text-primary animate-bounce-slow" />

              {/* Floating Orbiting Icons */}
              <div className="absolute -top-2 -right-2 p-2 bg-background rounded-full border border-border shadow-sm animate-bounce delay-100">
                <BarChart3 className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="absolute -bottom-1 -left-1 p-2 bg-background rounded-full border border-border shadow-sm animate-bounce delay-300">
                <Users className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 tracking-tight">
              Something Amazing is Coming
            </h2>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
              We're building a powerful dashboard to help you manage your
              institute effortlessly. Get ready for real-time insights and
              advanced analytics.
            </p>
          </div>

          {/* Feature Teasers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            {[
              {
                icon: BarChart3,
                label: "Advanced Analytics",
                desc: "Track growth & performance",
              },
              {
                icon: LayoutTemplate,
                label: "Custom Widgets",
                desc: "Personalize your view",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-background/50",
                  "backdrop-blur-sm transition-all hover:bg-muted/50 hover:border-border"
                )}
              >
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-sm">{feature.label}</h3>
                  <p className="text-xs text-muted-foreground">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="pt-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border text-xs font-medium text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Priority access tailored for your institute</span>
            </div>
          </div>
        </div>
      </div>
    </HeaderContainer>
  );
}
