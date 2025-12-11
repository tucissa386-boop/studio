'use client';

import { useEffect, useState, useMemo } from 'react';
import Header from '@/components/Header';
import useSessionStorage from '@/hooks/use-session-storage';
import type { SessionData } from '@/lib/types';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertCircle,
  BarChart,
  Brain,
  CheckCircle,
  Download,
  FileText,
  Lightbulb,
  Lock,
  Meh,
  Quote,
  Share2,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
  ChartStyle,
} from '@/components/ui/chart';
import { Bar, XAxis, YAxis, CartesianGrid, BarChart as RechartsBarChart } from 'recharts';
import { Progress } from '@/components/ui/progress';

export default function AnalysisPage() {
  const [sessionData] = useSessionStorage<SessionData | null>('mindtype-session', null);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!sessionData) {
      // Redirect to home if no session data is found after a short delay
      const timer = setTimeout(() => router.push('/'), 1000);
      return () => clearTimeout(timer);
    }
  }, [sessionData, router]);

  if (!isClient || !sessionData) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading analysis...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header variant="analysis" />
      <main className="w-full max-w-7xl mx-auto px-4 lg:px-10 py-6 lg:py-8">
        <PageHeader sessionData={sessionData} />
        <KpiGrid kpis={sessionData.kpis} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          <div className="lg:col-span-5 flex flex-col gap-4">
            <h2 className="text-foreground text-[22px] font-bold leading-tight tracking-tight">The Raw Stream</h2>
            <RawStreamCard rawText={sessionData.rawText} highlights={sessionData.highlights} />
            <RecommendationCard recommendation={sessionData.analysis.recommendation} />
          </div>
          <div className="lg:col-span-7 flex flex-col gap-4">
            <h2 className="text-foreground text-[22px] font-bold leading-tight tracking-tight">Psychological Patterns</h2>
            <PatternsChart patterns={sessionData.analysis.patterns} />
            <MicroThoughtBreakdown highlights={sessionData.highlights} />
          </div>
        </div>
      </main>
    </div>
  );
}

function PageHeader({ sessionData }: { sessionData: SessionData }) {
  return (
    <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
          <Lock className="h-4 w-4" />
          Private Session
        </div>
        <h1 className="text-foreground text-3xl lg:text-4xl font-black !leading-tight tracking-tight">
          Session Analysis
        </h1>
        <p className="text-muted-foreground text-base font-normal">
          {new Date(sessionData.date).toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          })}
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="secondary"><Download className="mr-2 h-4 w-4" /> Export PDF</Button>
        <Button variant="secondary"><Share2 className="mr-2 h-4 w-4" /> Share</Button>
      </div>
    </div>
  );
}

function KpiGrid({ kpis }: { kpis: SessionData['kpis'] }) {
  const kpiData = [
    { title: 'Cognitive Load', value: kpis.cognitiveLoad, icon: Brain, change: '+12% vs avg', changeColor: 'text-orange-500' },
    { title: 'Sentiment Score', value: kpis.sentimentScore, icon: Meh, change: 'Stable', changeColor: 'text-muted-foreground' },
    { title: 'Word Count', value: kpis.wordCount, icon: FileText, change: '-5% vs avg', changeColor: 'text-orange-500' },
    { title: 'Focus Level', value: `${kpis.focusLevel}%`, icon: CheckCircle, change: '+10% vs avg', changeColor: 'text-green-500' },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {kpiData.map(kpi => (
        <Card key={kpi.title} className="bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
            <kpi.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
            <p className={`text-xs ${kpi.changeColor}`}>{kpi.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function RawStreamCard({ rawText, highlights }: { rawText: string; highlights: SessionData['highlights'] }) {
  const highlightedText = useMemo(() => {
    let parts: (string | JSX.Element)[] = [rawText];
    if (!highlights?.patterns) return [rawText];
    
    const colors = ["bg-red-500/20 text-red-300 border-red-500/50", "bg-blue-500/20 text-blue-300 border-blue-500/50", "bg-purple-500/20 text-purple-300 border-purple-500/50"];

    highlights.patterns.forEach((p, i) => {
      const newParts: (string | JSX.Element)[] = [];
      parts.forEach(part => {
        if (typeof part === 'string') {
          const splitText = part.split(p.example);
          splitText.forEach((textPart, index) => {
            newParts.push(textPart);
            if (index < splitText.length - 1) {
              newParts.push(
                <span key={`${p.pattern}-${i}`} className={`${colors[i % colors.length]} px-1 rounded cursor-help border-b`}>{p.example}</span>
              );
            }
          });
        } else {
          newParts.push(part);
        }
      });
      parts = newParts.flat();
    });

    return parts;
  }, [rawText, highlights]);
  
  return (
    <Card className="flex-1 p-6 shadow-sm relative overflow-hidden">
      <Quote className="absolute top-4 right-4 h-16 w-16 text-border/50" />
      <div className="relative z-10 font-mono text-lg leading-relaxed text-muted-foreground">
        {highlightedText}
      </div>
      <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground/80 uppercase tracking-widest font-bold">
        <FileText className="h-4 w-4" />
        Original Input
      </div>
    </Card>
  );
}

function RecommendationCard({ recommendation }: { recommendation: string }) {
  return (
    <Card className="border-primary/30 bg-primary/10 p-6 flex gap-4 items-start">
      <div className="bg-primary/20 p-2 rounded-lg text-primary shrink-0">
        <Lightbulb />
      </div>
      <div>
        <h3 className="font-bold text-lg mb-1">Recommendation</h3>
        <p className="text-primary/90 text-sm leading-relaxed">{recommendation}</p>
      </div>
    </Card>
  );
}

const chartConfig = {
  intensity: { label: 'Intensity' },
  anxiety: { label: 'Anxiety', color: 'hsl(var(--chart-1))' },
  worth: { label: 'Worth', color: 'hsl(var(--chart-2))' },
  hope: { label: 'Hope', color: 'hsl(var(--chart-3))' },
  criticism: { label: 'Criticism', color: 'hsl(var(--chart-4))' },
  logic: { label: 'Logic', color: 'hsl(var(--chart-5))' },
} satisfies ChartConfig;

function PatternsChart({ patterns }: { patterns: string[] }) {
  const chartData = useMemo(() => {
    const basePatterns = { anxiety: 0, worth: 0, hope: 0, criticism: 0, logic: 0 };
    patterns.forEach(p => {
      const key = p.toLowerCase().replace(/ /g, '');
      if (key.includes('anxi')) basePatterns.anxiety = Math.max(basePatterns.anxiety, Math.random() * 40 + 50);
      else if (key.includes('worth') || key.includes('insecur')) basePatterns.worth = Math.max(basePatterns.worth, Math.random() * 30 + 20);
      else if (key.includes('hope')) basePatterns.hope = Math.max(basePatterns.hope, Math.random() * 30 + 30);
      else if (key.includes('criticis') || key.includes('negativ')) basePatterns.criticism = Math.max(basePatterns.criticism, Math.random() * 50 + 40);
      else if (key.includes('solv') || key.includes('logic')) basePatterns.logic = Math.max(basePatterns.logic, Math.random() * 20 + 40);
    });
    return [
      { name: 'Anxiety', intensity: basePatterns.anxiety || Math.random() * 70, fill: 'var(--color-anxiety)' },
      { name: 'Worth', intensity: basePatterns.worth || Math.random() * 40, fill: 'var(--color-worth)' },
      { name: 'Hope', intensity: basePatterns.hope || Math.random() * 30, fill: 'var(--color-hope)' },
      { name: 'Criticism', intensity: basePatterns.criticism || Math.random() * 85, fill: 'var(--color-criticism)' },
      { name: 'Logic', intensity: basePatterns.logic || Math.random() * 50, fill: 'var(--color-logic)' },
    ].sort((a,b) => b.intensity - a.intensity);
  }, [patterns]);
  
  const dominantPattern = chartData[0];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wider font-bold mb-1">Dominant Pattern</p>
            <p className="text-foreground text-2xl font-bold">{dominantPattern.name}</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground text-xs">Session Intensity</p>
            <p className="text-primary font-bold text-lg">{dominantPattern.intensity > 70 ? "High" : "Medium"}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-40 w-full">
          <RechartsBarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: -10 }}>
             <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
            <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => chartConfig[value.toLowerCase() as keyof typeof chartConfig]?.label} />
             <YAxis hide={true} domain={[0, 100]} />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="intensity" radius={4} />
          </RechartsBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function MicroThoughtBreakdown({ highlights }: { highlights: SessionData['highlights'] }) {
  const badgeColors: Record<string, string> = {
    insecurity: 'bg-red-500/10 text-red-400 border-red-500/20',
    'imposter syndrome': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    'problem solving': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    hope: 'bg-green-500/10 text-green-400 border-green-500/20',
    'victim mindset': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    'self-criticism': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    default: 'bg-muted text-muted-foreground',
  };

  return (
    <Card className="shadow-sm flex flex-col overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center bg-muted/50">
        <h3 className="font-bold text-sm uppercase tracking-wide">Micro-Thought Breakdown</h3>
        <Button variant="link" size="sm" className="text-primary text-xs">View All</Button>
      </div>
      <div className="flex flex-col divide-y">
        {highlights.patterns.map((item, index) => (
          <div key={index} className="p-4 hover:bg-muted/50 transition-colors group">
            <div className="flex justify-between items-start gap-4 mb-2">
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColors[item.pattern.toLowerCase()] || badgeColors.default}`}>
                  {item.pattern}
                </span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-2">"{item.example}"</p>
            <p className="text-xs text-muted-foreground/80">{item.explanation}</p>
          </div>
        ))}
        {highlights.patterns.length === 0 && <p className="p-4 text-muted-foreground text-sm">No specific patterns were highlighted in this sprint.</p>}
      </div>
    </Card>
  );
}
