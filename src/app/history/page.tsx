'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { HistoryEntry } from '@/lib/types';
import {
  Plus,
  History,
  TrendingUp,
  Smile,
  Zap,
  Search,
  Filter,
  ArrowRight,
  ChevronDown,
  FileText,
} from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const mockHistory: HistoryEntry[] = [
    { id: '1', date: 'Oct 24, 2023', time: '10:42 PM', snippet: "I feel like I'm running out of time but I know that's just a perception...", emotion: 'Anxious', color: 'anxious' },
    { id: '2', date: 'Oct 23, 2023', time: '08:15 AM', snippet: "The morning light is hitting the desk and suddenly everything feels possible again...", emotion: 'Energetic', color: 'energetic' },
    { id: '3', date: 'Oct 21, 2023', time: '11:30 PM', snippet: "Why did I say that? It keeps replaying in my head over and over...", emotion: 'Reflective', color: 'reflective' },
    { id: '4', date: 'Oct 19, 2023', time: '02:45 PM', snippet: "Stuck on this problem. Can't seem to find a way around the...", emotion: 'Confused', color: 'confused' },
];

const emotionColors: Record<HistoryEntry['color'], string> = {
  anxious: 'bg-red-500/10 text-red-400 border-red-500/20',
  energetic: 'bg-green-500/10 text-green-400 border-green-500/20',
  reflective: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  confused: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  calm: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

const emotionDotColors: Record<HistoryEntry['color'], string> = {
  anxious: 'bg-red-500',
  energetic: 'bg-green-500',
  reflective: 'bg-purple-500',
  confused: 'bg-yellow-500',
  calm: 'bg-blue-500',
};


const chartData = [
  { month: "Week 1", desktop: 109, mobile: 80 },
  { month: "Week 2", desktop: 21, mobile: 200 },
  { month: "Week 3", desktop: 93, mobile: 120 },
  { month: "Week 4", desktop: 33, mobile: 190 },
  { month: "Week 5", desktop: 101, mobile: 130 },
  { month: "Week 6", desktop: 45, mobile: 80 },
  { month: "Week 7", desktop: 149, mobile: 170 },
];

const chartConfig = {
  desktop: { label: "Sentiment", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState('30 Days');

  return (
    <div className="flex min-h-screen flex-col">
      <Header variant="history" />
      <main className="flex-1 flex justify-center py-8 px-4 sm:px-6 lg:px-10">
        <div className="w-full max-w-5xl flex flex-col gap-8">
          <div className="flex flex-wrap justify-between items-end gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl md:text-4xl font-black !leading-tight tracking-tight">Historical Insights</h1>
              <p className="text-muted-foreground text-base font-medium max-w-xl">
                Review your past typing sprints and track the evolution of your subconscious patterns.
              </p>
            </div>
             <Button asChild className="shadow-[0_0_15px_hsl(var(--primary)/0.4)] font-bold">
               <Link href="/sprint">
                 <Plus className="mr-2 h-5 w-5" /> New Sprint
               </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard icon={History} title="Total Sessions" value="42" change="+12%" changeColor="text-green-500" />
            <StatCard icon={Smile} title="Avg. Sentiment" value="Positive" change="+5%" changeColor="text-green-500" />
            <StatCard icon={Zap} title="Top Emotion" value="Anxious" change="High Focus" changeColor="text-primary" />
          </div>

          <Card className="p-6 flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold">Evolution of Thought Patterns</h3>
                <p className="text-muted-foreground text-sm">Sentiment Score vs. Typing Speed</p>
              </div>
              <div className="flex bg-background rounded-lg p-1 gap-1">
                {['30 Days', '3 Months', 'All Time'].map(tab => (
                  <Button
                    key={tab}
                    size="sm"
                    variant={activeTab === tab ? 'secondary' : 'ghost'}
                    onClick={() => setActiveTab(tab)}
                    className={cn("text-xs transition-colors", activeTab === tab ? 'text-foreground' : 'text-muted-foreground')}
                  >
                    {tab}
                  </Button>
                ))}
              </div>
            </div>
            <ChartContainer config={chartConfig} className="h-48 w-full">
              <AreaChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12, top: 5, bottom: 5 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)"/>
                <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="" tickMargin={8} tickFormatter={(value) => value.slice(0, 6)} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel indicator="line" />} />
                <Area dataKey="desktop" type="natural" fill="hsl(var(--primary) / 0.3)" fillOpacity={0.4} stroke="hsl(var(--primary))" stackId="a" />
              </AreaChart>
            </ChartContainer>
          </Card>

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-4 px-1">
              <h3 className="text-xl font-bold tracking-tight">Session History</h3>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input className="bg-card border-none rounded-lg pl-10 pr-4 py-2 text-sm placeholder-muted-foreground w-48 md:w-64" placeholder="Search content..." />
                </div>
                <Button variant="secondary" size="icon"><Filter className="h-5 w-5" /></Button>
              </div>
            </div>
            <div className="flex flex-col gap-3">
                {mockHistory.map(item => <HistoryCard key={item.id} item={item} />)}
            </div>
            <Button variant="ghost" className="self-center mt-4 text-muted-foreground hover:text-foreground">
                Show More History <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, title, value, change, changeColor }: { icon: React.ElementType, title: string, value: string, change: string, changeColor: string }) {
  return (
    <Card className="p-6 relative overflow-hidden group">
        <Icon className="absolute right-4 top-4 h-10 w-10 text-muted-foreground/10 group-hover:text-muted-foreground/20 transition-colors" />
        <p className="text-muted-foreground text-sm font-medium">{title}</p>
        <div className="flex items-end gap-3">
            <p className="text-3xl font-bold">{value}</p>
            <p className={`text-sm font-bold mb-1 flex items-center ${changeColor}`}>
                {change.startsWith('+') && <TrendingUp className="h-4 w-4" />}
                {change}
            </p>
        </div>
    </Card>
  )
}

function HistoryCard({item}: {item: HistoryEntry}) {
    return (
        <Card className="group hover:bg-accent/50 transition-all p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-center cursor-pointer border hover:border-primary/30">
            <div className="flex items-center gap-4 sm:w-48 shrink-0">
                <div className="bg-primary/10 text-primary p-2.5 rounded-lg">
                    <FileText />
                </div>
                <div className="flex flex-col">
                    <span className="text-foreground font-bold text-sm">{item.date}</span>
                    <span className="text-muted-foreground text-xs">{item.time}</span>
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-muted-foreground text-sm truncate group-hover:text-foreground transition-colors">
                    "{item.snippet}"
                </p>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto shrink-0">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${emotionColors[item.color]}`}>
                    <span className={`size-1.5 rounded-full ${emotionDotColors[item.color]}`}></span>
                    {item.emotion}
                </span>
                <Button variant="ghost" size="icon" className="text-primary opacity-0 group-hover:opacity-100">
                    <ArrowRight />
                </Button>
            </div>
        </Card>
    )
}
