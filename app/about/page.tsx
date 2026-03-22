"use client";

import React from "react";
import Link from "next/link";
import { 
  Building2, ShieldCheck, Zap, Users, Code2, Lock, 
  Workflow, CheckCircle2, Cloud, FileText, ArrowRight,
  Database, UserCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Layout Dependencies
import Header from "@/components/custom/utils/header/Header";
import Footer from "@/components/custom/utils/footer/Footer";
import { AppData } from "@/config/appConfig";

/* -------------------------------------------------------------------------- */
/* Main Page Component                                                        */
/* -------------------------------------------------------------------------- */

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-background">
      {/* Fixed Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 pt-24 md:pt-14 pb-20 space-y-24">
        
        {/* Background Visual Enhancements */}
        <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-primary/5 via-primary/5 to-transparent pointer-events-none -z-10" />
        <div className="absolute top-40 right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" />

        <div className="mx-4 md:mx-8 lg:mx-auto max-w-7xl pt-12 space-y-24">
          <HeroSection />
          <MissionSection />
          
          <div className="space-y-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center tracking-tight">
              Why EduNexus Exists
            </h2>
            <ProblemsSolvedSection />
          </div>

          <Separator className="bg-border/50" />

          <HowItWorksSection />
          <FeaturesSection />
          
          <Separator className="bg-border/50" />

          <TechHighlightsSection />
          <CTASection />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Sections                                                                   */
/* -------------------------------------------------------------------------- */

function HeroSection() {
  return (
    <section className="text-center space-y-6 max-w-4xl mx-auto flex flex-col items-center">
      <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4 transition-colors hover:bg-primary/20">
        Empowering Modern Education
      </div>
      
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-tight">
        Building the Core of <br className="hidden md:block" />
        <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-500 bg-clip-text text-transparent">
          Institutional Management
        </span>
      </h1>
      
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        {AppData.app.name} is a comprehensive, deeply scalable multi-tenant SaaS application specifically engineered to eradicate internal administrative friction for worldwide educational institutions.
      </p>
    </section>
  );
}

function MissionSection() {
  return (
    <Card className="border border-border/40 bg-gradient-to-br from-background/80 to-muted/30 shadow-lg rounded-2xl backdrop-blur-sm overflow-hidden text-center md:text-left">
      <div className="grid md:grid-cols-2 gap-8 items-center p-8 md:p-12">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Our Mission & Vision</h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            We believe running an educational institute should be as streamlined and modern as the education itself. Our mission is to democratize enterprise-grade administration architecture, bringing seamless cloud tooling, robust security, and intelligent workflow automation to institutes of all sizes.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <StatBox metric="100%" label="Data Isolation" icon={<ShieldCheck />} />
          <StatBox metric="0" label="Orphaned Files" icon={<Cloud />} />
          <StatBox metric="24/7" label="Secure Access" icon={<Lock />} />
          <StatBox metric="Real-time" label="Data Sync" icon={<Zap />} />
        </div>
      </div>
    </Card>
  );
}

function StatBox({ metric, label, icon }: { metric: string; label: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/50 bg-background/50 text-center hover:bg-muted/50 transition-colors">
      <div className="text-primary mb-2 opacity-80">{icon}</div>
      <div className="text-2xl font-bold tracking-tight">{metric}</div>
      <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">{label}</div>
    </div>
  );
}

function ProblemsSolvedSection() {
  const problems = [
    {
      title: "Scattered Administrative Data",
      description: "Institutes often struggle with fragmented spreadsheets spanning thousands of students.",
      solution: "Centralized dual-sync MongoDB metadata linking instantly ties academic flows to active student profiles.",
    },
    {
      title: "Cloud Storage Bloat",
      description: "Abandoned web forms historically leave terabytes of orphaned image files on cloud storage buckets.",
      solution: "Our zero-orphan architecture natively assigns temporal states, aggressively auto-deleting unlinked ImageKit fragments.",
    },
    {
      title: "Inefficient Document Creation",
      description: "Manually processing student badges, hall tickets, or ID cards wastes hundreds of staff hours.",
      solution: "100% Client-side DOM-to-Image rendering extracts dynamic UI nodes into pixel-perfect scalable cards in milliseconds.",
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {problems.map((p, idx) => (
        <Card key={idx} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                <XCircleIcon className="w-4 h-4" />
              </div>
              {p.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{p.description}</p>
            <div className="p-3 bg-primary/5 border border-primary/10 rounded-lg">
              <p className="text-sm font-medium text-foreground flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                {p.solution}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Simple internal icon for the problems section
function XCircleIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>
    </svg>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      icon: <Building2 className="w-6 h-6" />,
      title: "1. Institute Creation",
      desc: "Administrators initialize a dedicated mathematical partition generating a strict `institute_code` schema globally across the database.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "2. Secure Onboarding",
      desc: "The multi-step Zod-validated engine handles massive admission payloads without mutating the server database with dirty data.",
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "3. Smart Metadata Mapping",
      desc: "Background sync hooks orchestrate transient states into finalized entities (e.g., locking temporary uploads securely).",
    },
  ];

  return (
    <section className="space-y-10">
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Intelligent Workflow Engine</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Built around the realities of dynamic educational environments, the {AppData.app.name} flow eliminates friction at the architectural level.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((st, i) => (
          <div key={i} className="flex flex-col items-center text-center space-y-4 relative">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
              {st.icon}
            </div>
            <h3 className="text-xl font-bold">{st.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">{st.desc}</p>
            
            {i !== steps.length - 1 && (
              <div className="hidden md:block absolute top-8 -right-8 text-border">
                <ArrowRight className="w-6 h-6" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: <Users />,
      title: "Lifecycle Enrollment Tracking",
      desc: "Robust sequence ID algorithms managing Roll Numbers intuitively using auto-increment mechanisms protected natively in the controller layer.",
    },
    {
      icon: <FileText />,
      title: "Comprehensive Documentation",
      desc: "Manage Aadhaar, marksheets, and signatures mapped inherently to multi-tenant entity stores ensuring zero cross-pollination leaks.",
    },
    {
      icon: <ShieldCheck />,
      title: "Strict Role Modularity",
      desc: "Deeply granular entitlement gates parsing `teacher`, `student`, and `admin` permissions efficiently across React Hook portals.",
    },
  ];

  return (
    <section className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight text-center">Core Operational Features</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feat, i) => (
          <Card key={i} className="group border-border/40 hover:border-primary/50 bg-card/50 transition-all hover:bg-card hover:shadow-xl hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors mb-4">
                {feat.icon}
              </div>
              <CardTitle className="text-lg">{feat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm leading-relaxed">
                {feat.desc}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function TechHighlightsSection() {
  return (
    <Card className="border border-border/50 bg-muted/10 shadow-sm overflow-hidden">
      <div className="grid md:grid-cols-[40%_60%]">
        <div className="p-8 md:p-12 bg-muted/30 flex flex-col justify-center border-r border-border/20">
          <Code2 className="w-10 h-10 text-primary mb-6" />
          <h2 className="text-2xl font-bold mb-4">Engineering Excellence</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            The {AppData.app.name} platform is designed not just to function, but to scale beautifully. The entire architecture embraces server-first colocation merged seamlessly with interactive client experiences.
          </p>
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <Badge variant="outline">Next.js App Router</Badge>
            <Badge variant="outline">Mongoose Interceptors</Badge>
            <Badge variant="outline">Zod Parsing</Badge>
            <Badge variant="outline">Shadcn GUI Components</Badge>
            <Badge variant="outline">ImageKit Cloud Streams</Badge>
          </div>
        </div>
        
        <div className="p-8 md:p-12 grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
          <HighlightCard 
            title="Multi-Tenant Routing"
            desc="Absolute data isolation utilizing strict MongoDB mappings locking down all requests via context injections."
          />
          <HighlightCard 
            title="Repository Services"
            desc="Decoupled domain logic extracted tightly into explicit singleton service classes."
          />
          <HighlightCard 
            title="Hybrid Global State"
            desc="Redux Toolkit handles complex multi-session auth states while React Hook Form drives transient UI."
          />
          <HighlightCard 
            title="Pixel-Perfect Scaler"
            desc="Custom HTML-to-Image transformations mapped mathematically without server processing costs."
          />
        </div>
      </div>
    </Card>
  );
}

function HighlightCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-foreground flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-primary" />
        {title}
      </h4>
      <p className="text-xs text-muted-foreground leading-relaxed pl-6">
        {desc}
      </p>
    </div>
  );
}

function CTASection() {
  return (
    <section className="py-12 flex flex-col items-center text-center space-y-6">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
        <Workflow className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-4xl font-extrabold tracking-tight">Ready to Transform Your Institute?</h2>
      <p className="text-lg text-muted-foreground max-w-2xl">
        Stop fighting outdated spreadsheets. Deploy {AppData.app.name} and streamline your entire administrative pipeline in seconds.
      </p>
      <div className="flex gap-4 pt-6">
        <Link href={AppData.routes.frontend.auth.register.institute}>
          <Button size="lg" className="rounded-full px-8 shadow-xl shadow-primary/20 hover:scale-105 transition-all">
            Get Started Now
          </Button>
        </Link>
      </div>
    </section>
  );
}
