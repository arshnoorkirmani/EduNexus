"use client";

import React from "react";
import Link from "next/link";
import {
  BarChart3,
  School,
  ShieldCheck,
  UniversityIcon,
  Upload,
  User,
  UserPlus,
  Users,
  UserCheck,
  CheckCircle2,
  Workflow,
  Database,
  CloudOff,
  ArrowRight,
  TrendingUp,
  Lock,
  LayoutDashboard,
  LucideIcon
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AppData } from "@/config/appConfig";

/* -------------------------------------------------------------------------- */
/* Main Export Header                                                         */
/* -------------------------------------------------------------------------- */

export default function Section() {
  return (
    <div className="mx-2 md:mx-6 lg:mx-12 xl:mx-auto max-w-[1400px] pb-24 space-y-16 md:space-y-24 antialiased">
      <HeroSection />

      <Separator className="bg-border/40" />

      <KeyCapabilitiesSection />
      <HowItWorksSection />
      <FeaturesSection />
      <RoleBasedAccessSection />

      <Separator className="bg-border/40" />

      <SecuritySection />
      <CTASection />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Sub-components & Sections                                                  */
/* -------------------------------------------------------------------------- */

function HeroSection() {
  return (
    <section className="relative overflow-visible pt-2 md:pt-4">
      {/* Subtle Background Glow Elements */}
      <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-in fade-in duration-1000" />

      <Card className="overflow-hidden border border-border/40 shadow-sm hover:shadow-xl transition-all duration-500 rounded-3xl bg-gradient-to-br from-background/90 via-background/60 to-muted/30 backdrop-blur-md">
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] items-stretch gap-0">

          {/* Left: Hero Content */}
          <div className="p-6 md:p-8 lg:p-12 flex flex-col justify-center space-y-6">
            <div className="space-y-3 max-w-xl">
              <Badge variant="outline" className="px-4 py-1 rounded-full text-xs font-semibold tracking-wide border-primary/20 text-primary bg-primary/5 mb-1 hover:bg-primary/10 transition-colors">
                Next-Generation Administration
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight md:leading-[1.15] tracking-tight text-foreground">
                Manage your institute <span className="text-muted-foreground/40">—</span> <br />
                <span className="bg-gradient-to-r from-primary via-blue-500 to-indigo-400 bg-clip-text text-transparent drop-shadow-sm">
                  smarter, faster, securely.
                </span>
              </h1>

              <p className="text-muted-foreground text-base md:text-lg max-w-2xl leading-relaxed pt-1">
                Set up your institute in minutes. <b className="text-foreground font-semibold">{AppData.app.name}</b> empowers administrators, teachers, and students through an integrated platform—simplifying admissions, attendance, and communication with enterprise-grade cloud tools.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href={AppData.routes.frontend.auth.register.institute} className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto rounded-full px-8 shadow-md hover:shadow-lg transition-all duration-300">
                  Create Institute Account
                </Button>
              </Link>
              <Link href={AppData.routes.frontend.auth.login.institute} className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 border-border/60 hover:bg-muted/50 shadow-sm hover:shadow-md transition-all duration-300">
                  Institute Login
                </Button>
              </Link>
            </div>

            {/* Key Highlights Row */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-border/40 mt-2">
              <HeroHighlight icon={<ShieldCheck className="w-5 h-5 text-emerald-500" />} title="Secure by Design" subtitle="Encryption & 2FA" />
              <HeroHighlight icon={<UserCheck className="w-5 h-5 text-blue-500" />} title="Role-Based Access" subtitle="Strict Layout Gates" />
              <HeroHighlight icon={<Upload className="w-5 h-5 text-indigo-500" />} title="Zero Orphan Bloat" subtitle="Clean Media Sync" />
            </div>
          </div>

          {/* Right: Quick Start Guide Panel */}
          <div className="border-t rounded-2xl mr-3 lg:border-t-0 lg:border-l border-border/30 h-full p-6 md:p-10 flex flex-col justify-center items-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-muted/20 to-transparent pointer-events-none" />

            <Card className="w-full rounded-2xl border border-border/40 bg-card shadow-2xl shadow-black/5 p-6 lg:p-8 hover:-translate-y-1 transition-all duration-500 relative z-10">
              <div className="text-xs uppercase font-bold tracking-widest text-muted-foreground mb-6">
                ⚡ Quick Start Guide
              </div>

              <div className="space-y-6">
                <QuickStep
                  number="1"
                  color="bg-primary/10 text-primary border-primary/20"
                  title="Create Institute"
                  desc="Generate your mathematical unique institute code and preferences."
                />
                <QuickStep
                  number="2"
                  color="bg-blue-500/10 text-blue-500 border-blue-500/20"
                  title="Add Admins & Teachers"
                  desc="Invite staff securely and assign their strict module permissions."
                />
                <QuickStep
                  number="3"
                  color="bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
                  title="Register Students"
                  desc="Process deep admission schemas with 100% Zod validated accuracy."
                />
              </div>

              <div className="mt-8">
                <Link href={AppData.routes.frontend.auth.register.institute}>
                  <Button variant="secondary" className="w-full rounded-xl shadow-md hover:shadow-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 group">
                    Start Setup <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

        </div>
      </Card>
    </section>
  );
}

function HeroHighlight({ icon, title, subtitle }: { icon: React.ReactNode, title: string, subtitle: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-semibold text-sm text-foreground">{title}</span>
      </div>
      <span className="text-xs text-muted-foreground ml-7">{subtitle}</span>
    </div>
  );
}

function QuickStep({ number, title, desc, color }: { number: string, title: string, desc: string, color: string }) {
  return (
    <div className="flex items-start gap-4 group">
      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-sm shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-110 ${color}`}>
        {number}
      </div>
      <div className="flex flex-col pt-0.5">
        <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{title}</span>
        <span className="text-sm text-muted-foreground leading-relaxed mt-1">{desc}</span>
      </div>
    </div>
  );
}

function KeyCapabilitiesSection() {
  const stats = [
    { metric: "100%", label: "MongoDB Data Isolation", desc: "Absolute multi-tenant strict separation." },
    { metric: "< 1s", label: "Media Lifecycle Sync", desc: "Instantaneous ImageKit webhook reconciliations." },
    { metric: "Zero", label: "Orphaned Files", desc: "Aggressive aggressive garbage collection layers." },
    { metric: "Live", label: "ID Card Generation", desc: "Client-side DOM-to-Image visual rendering." },
  ];

  return (
    <section>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl bg-muted/20 border border-border/40 hover:bg-muted/40 transition-colors duration-300">
            <span className="text-3xl md:text-4xl font-black text-primary mb-2 tracking-tighter">{stat.metric}</span>
            <span className="font-semibold text-foreground text-sm uppercase tracking-wider">{stat.label}</span>
            <span className="text-xs text-muted-foreground mt-2">{stat.desc}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const workflows = [
    {
      icon: <Database className="w-8 h-8" />,
      title: "Multi-Tenant Initialization",
      desc: "Each registration generates an immutable `institute_code` schema, securely locking all underlying Mongo data fragments into partitioned scopes.",
      color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
    },
    {
      icon: <Workflow className="w-8 h-8" />,
      title: "Asynchronous Workflows",
      desc: "Background lifecycle hooks manage sequence ID generation (Roll Numbers) bypassing race-conditions without blocking the main UI loops.",
      color: "bg-blue-500/10 border-blue-500/20 text-blue-500"
    },
    {
      icon: <CloudOff className="w-8 h-8" />,
      title: "Orphan File Prevention",
      desc: "ImageKit payloads enter a `temporary` holding footprint. Validated Zod pushes trigger strict database synchronizations closing the final link.",
      color: "bg-indigo-500/10 border-indigo-500/20 text-indigo-500"
    }
  ];

  return (
    <section className="space-y-12 relative">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Enterprise Architecture, Simplified.</h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          {AppData.app.name} replaces outdated operations with modern, mathematically sound design patterns ensuring unbreakable stability from database to DOM.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {workflows.map((flow, idx) => (
          <Card key={idx} className="relative group border-border/40 bg-card/60 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5 overflow-hidden">
             <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
             <div className="relative z-10">
              <CardHeader className="text-center pb-4">
                <div className={`mx-auto w-16 h-16 rounded-2xl border flex items-center justify-center mb-4 transition-transform group-hover:-translate-y-1 group-hover:scale-110 duration-500 shadow-inner ${flow.color}`}>
                  {flow.icon}
                </div>
                <CardTitle className="text-xl">{flow.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground text-sm leading-relaxed">{flow.desc}</p>
              </CardContent>
             </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="space-y-10">
      <div className="flex flex-col items-center text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Powerful Tools for Every Role
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Complete end-to-end oversight. From automated fee engines to granular permission modules, everything operates inside one highly responsive unified system.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard
          icon={Users}
          title="Student Registration Engine"
          desc="Massive multi-step flows backed entirely by 300+ line Zod schemas ensuring flawless data parity on the front-end before touching the backend."
          accent="from-blue-500/20 to-blue-500/5 text-blue-500"
        />
        <FeatureCard
          icon={LayoutDashboard}
          title="Dynamic ID Generation"
          desc="Real-time absolute scaled DOM-to-Image cards rendering beautifully natively in browsers for immediate print-ready exports."
          accent="from-emerald-500/20 to-emerald-500/5 text-emerald-500"
        />
        <FeatureCard
          icon={TrendingUp}
          title="Synchronous Fee Calculations"
          desc="Instantly compute remaining and paid totals directly mapped structurally to active course curricula base figures."
          accent="from-indigo-500/20 to-indigo-500/5 text-indigo-500"
        />
      </div>
    </section>
  );
}

function FeatureCard({ icon: Icon, title, desc, accent }: { icon: LucideIcon, title: string, desc: string, accent: string }) {
  return (
    <Card className="border-border/40 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 bg-gradient-to-br from-background/50 to-muted/20 group overflow-hidden relative">
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <CardContent className="p-6 md:p-8 space-y-4 relative z-10">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br shadow-sm transition-all duration-500 group-hover:-translate-y-1 group-hover:scale-110 ${accent}`}>
          <Icon className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
      </CardContent>
    </Card>
  );
}

function RoleBasedAccessSection() {
  return (
    <section>
      <Card className="overflow-hidden border border-border/50 bg-card/60 backdrop-blur-md shadow-lg rounded-3xl">
        <CardHeader className="border-b border-border/40 p-8 md:p-10 bg-muted/10 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Choose Your Portal</h2>
              <p className="text-muted-foreground">Access your customized dashboard tailored securely to your institutional clearance level.</p>
            </div>
            <Badge variant="secondary" className="text-xs px-3 py-1 font-medium bg-background border-border">
              Secured via NextAuth
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border/40">
            <RoleLoginCard
              icon={<UniversityIcon className="w-6 h-6 text-primary" />}
              title="Institute Admin"
              desc="Full architectural control over records, preferences, and data logic."
              color="bg-primary/10 border-primary/20"
              href={AppData.routes.frontend.auth.login.institute}
            />
            <RoleLoginCard
              icon={<UserCheck className="w-6 h-6 text-emerald-500" />}
              title="Institute User"
              desc="Manage internal modules with limited gated permissions."
              color="bg-emerald-500/10 border-emerald-500/20"
              href={AppData.routes.frontend.auth.login.user}
            />
            <RoleLoginCard
              icon={<School className="w-6 h-6 text-indigo-500" />}
              title="Teacher Portal"
              desc="Oversee classrooms, track assignments, and modify reporting."
              color="bg-indigo-500/10 border-indigo-500/20"
              href={AppData.routes.frontend.auth.login.teacher}
            />
            <RoleLoginCard
              icon={<User className="w-6 h-6 text-blue-500" />}
              title="Student Portal"
              desc="Check attendance, upload verification documents securely."
              color="bg-blue-500/10 border-blue-500/20"
              href={AppData.routes.frontend.auth.login.student}
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function RoleLoginCard({ icon, title, desc, color, href }: { icon: React.ReactNode, title: string, desc: string, color: string, href: string }) {
  return (
    <div className="group p-8 flex flex-col justify-between hover:bg-primary/5 transition-all duration-500 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
      <div className="space-y-4 text-center flex flex-col items-center relative z-10">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm transition-all duration-500 group-hover:-translate-y-1 group-hover:scale-110 ${color}`}>
          {icon}
        </div>
        <h3 className="font-semibold text-lg text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed px-2 pb-4">{desc}</p>
      </div>
      <Link href={href} className="w-full mt-auto block">
        <Button variant="outline" className="w-full bg-background border-border/60 hover:bg-muted transition-colors rounded-xl shadow-sm">
          Login Portal
        </Button>
      </Link>
    </div>
  );
}

function SecuritySection() {
  return (
    <section className="grid lg:grid-cols-[1fr_1fr] gap-12 items-center">
      <div className="space-y-6">
        <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 bg-emerald-500/5 px-4 py-1 rounded-full">
          Mission Critical Reliability
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Built for Scale.<br /> Secured for Reality.
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Education data requires absolute precision. Our unified backend controllers sit behind highly optimized singleton repository classes blocking invalid iterations and stopping external intrusion at the Mongo schema layer.
        </p>
        <ul className="space-y-4 pt-2">
          <li className="flex items-center gap-3 text-sm text-foreground font-medium">
            <CheckCircle2 className="text-primary w-5 h-5 shrink-0" /> End-to-end Redux State Injection
          </li>
          <li className="flex items-center gap-3 text-sm text-foreground font-medium">
            <CheckCircle2 className="text-primary w-5 h-5 shrink-0" /> NextAuth Dual-Token Interceptors
          </li>
          <li className="flex items-center gap-3 text-sm text-foreground font-medium">
            <CheckCircle2 className="text-primary w-5 h-5 shrink-0" /> Zero-Trust Document Processing
          </li>
        </ul>
      </div>
      <div className="bg-muted/20 border border-border/40 rounded-3xl p-8 relative overflow-hidden flex items-center justify-center min-h-[350px] shadow-lg">
        {/* Soft Background Blurs */}
        <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/20 to-transparent opacity-40 blur-[100px] pointer-events-none" />
        
        <Lock className="w-48 h-48 text-primary/10 absolute animate-pulse duration-[3000ms]" />

        <div className="relative z-10 w-full space-y-4 max-w-sm">
          <div className="bg-background border border-border/50 shadow-md rounded-xl p-4 flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">MONGODB_CONNECTION</span>
            <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 rounded border-none">SECURE</Badge>
          </div>
          <div className="bg-background border border-border/50 shadow-md rounded-xl p-4 flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">IMAGEKIT_LIFECYCLE</span>
            <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 rounded border-none">SYNCED</Badge>
          </div>
          <div className="bg-background border border-border/50 shadow-md rounded-xl p-4 flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">ZOD_API_VALIDATION</span>
            <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 rounded border-none">ACTIVE</Badge>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="relative mt-24 lg:mt-32">
      <Card className="border border-primary/20 bg-gradient-to-br from-primary/10 via-background/80 to-muted overflow-hidden rounded-3xl shadow-2xl shadow-primary/5 group relative">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none opacity-60" />
        <CardContent className="p-12 md:p-20 text-center flex flex-col items-center justify-center space-y-8 relative z-10">
          
          <div className="w-20 h-20 bg-background/80 backdrop-blur-md border border-primary/30 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform duration-500 group-hover:-translate-y-2 mb-2">
            <School className="w-10 h-10 text-primary drop-shadow-sm" />
          </div>

          <div className="space-y-4 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Ready to elevate your institute?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Stop fighting outdated administrative spreadsheets. Transition your workflow to {AppData.app.name} and secure your operations in under 5 minutes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href={AppData.routes.frontend.auth.register.institute}>
              <Button size="lg" className="rounded-full px-10 h-14 text-base shadow-xl shadow-primary/20 hover:scale-105 transition-transform duration-300">
                Setup Institute Free
              </Button>
            </Link>
            <Link href={AppData.routes.frontend.auth.login.institute}>
              <Button size="lg" variant="outline" className="rounded-full px-10 h-14 text-base border-border/60 bg-background hover:bg-muted/50 transition-colors duration-300">
                Existing Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
