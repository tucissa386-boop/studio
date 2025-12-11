import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  BrainCircuit,
  FlaskConical,
  Keyboard,
  Lightbulb,
  Sparkles,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-visual');

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-start pt-8 pb-16 px-4 md:px-10">
        <div className="w-full max-w-5xl flex flex-col gap-12 lg:gap-20">
          <HeroSection heroImage={heroImage} />
          <HowItWorksSection />
          <MethodologySection />
        </div>
      </main>
    </div>
  );
}

function HeroSection({ heroImage }: { heroImage: any }) {
  return (
    <section className="@container">
      <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-12 items-center">
        <div className="flex flex-col gap-6 flex-1 text-center lg:text-left items-center lg:items-start">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black !leading-[1.1] tracking-tight text-balance">
              Don't Think.
              <br />
              <span className="text-primary">Just Type.</span>
            </h1>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground max-w-[480px]">
              Bypass your mental filters. Spend 10 seconds typing your raw
              thoughts to unlock deep psychological insights.
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full max-w-[400px]">
            <Button
              asChild
              size="lg"
              className="h-12 md:h-14 text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300"
            >
              <Link href="/sprint">
                <Zap className="mr-2 h-5 w-5" />
                Start 10-Second Sprint
                <span className="hidden sm:inline-block text-xs font-normal opacity-70 border border-white/30 rounded px-1.5 py-0.5 ml-2">
                  Enter ↵
                </span>
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground/80 text-center">
              No signup required for first session.
            </p>
          </div>
        </div>
        <div className="w-full flex-1 max-w-[500px] aspect-square relative rounded-xl overflow-hidden shadow-2xl bg-card group">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover opacity-80 mix-blend-screen"
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6 p-4 rounded-lg bg-background/80 backdrop-blur-md border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-mono text-muted-foreground">
                ANALYZING INPUT STREAM...
              </span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[70%]"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      icon: Sparkles,
      title: '1. Prepare',
      description:
        "Focus on a single emotion or thought that's been lingering on your mind recently.",
    },
    {
      icon: Keyboard,
      title: '2. Type',
      description:
        'Write continuously for 10 seconds. Do not stop. Do not edit. Let it flow.',
    },
    {
      icon: Lightbulb,
      title: '3. Discover',
      description:
        'Our AI analyzes your syntax and word choice to reveal hidden sentiment patterns.',
    },
  ];

  return (
    <section className="flex flex-col gap-8 py-8 border-t">
      <div className="flex flex-col gap-2 items-center text-center mb-4">
        <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
          How It Works
        </h3>
        <p className="text-muted-foreground">
          Three simple steps to uncover your subconscious mind.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <Card
            key={index}
            className="flex flex-col gap-4 p-6 hover:border-primary/50 transition-colors group bg-card"
          >
            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <step.icon className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-lg font-bold">{step.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

function MethodologySection() {
  return (
    <section className="flex flex-col items-center justify-center py-8 px-4 rounded-2xl bg-card border text-center gap-4">
      <div className="flex items-center gap-2 text-primary opacity-80">
        <FlaskConical className="w-5 h-5" />
        <span className="text-xs font-bold uppercase tracking-widest">
          The Methodology
        </span>
      </div>
      <h3 className="text-xl font-bold">Rooted in Free Association</h3>
      <p className="text-muted-foreground max-w-2xl text-sm md:text-base leading-relaxed text-balance">
        Based on Freudian Free Association techniques, our approach helps you
        bypass the ego's editing mechanism. By forcing speed, we overload your
        conscious filter, allowing authentic thoughts and subconscious feelings
        to surface.
      </p>
    </section>
  );
}
