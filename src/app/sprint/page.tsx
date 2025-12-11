'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { performAnalysis } from '@/lib/actions';
import { SkipForward, Timer, X, Zap } from 'lucide-react';
import Link from 'next/link';
import useSessionStorage from '@/hooks/use-session-storage';
import type { SessionData } from '@/lib/types';
import { cn } from '@/lib/utils';

const SPRINT_DURATION = 10;

type SprintStatus = 'idle' | 'typing' | 'finished' | 'analyzing' | 'error';

export default function SprintPage() {
  const [text, setText] = useState('');
  const [status, setStatus] = useState<SprintStatus>('idle');
  const [timeLeft, setTimeLeft] = useState(SPRINT_DURATION);
  const router = useRouter();
  const { toast } = useToast();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [_, setSessionData] = useSessionStorage<SessionData | null>('mindtype-session', null);

  const handleFinish = useCallback(async () => {
    if (status === 'analyzing' || status === 'finished') return;

    setStatus('analyzing');
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    try {
      const currentText = textareaRef.current?.value || '';
      const result = await performAnalysis(currentText);
      const newSession: SessionData = {
        id: new Date().toISOString(),
        date: new Date().toISOString(),
        rawText: result.rawText,
        analysis: result.analysis,
        highlights: result.highlights,
        kpis: {
          cognitiveLoad: 'High',
          sentimentScore: 'Neutral',
          wordCount: currentText.split(/\s+/).filter(Boolean).length,
          focusLevel: 85,
        },
      };
      setSessionData(newSession);
      router.push('/analysis');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: errorMessage,
      });
      setStatus('error');
    }
  }, [router, toast, setSessionData, status]);

  const startSprint = useCallback(() => {
    if (status === 'idle' && timerRef.current === null) {
      setStatus('typing');
      textareaRef.current?.focus();
      
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            timerRef.current = null;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [status]);


  useEffect(() => {
    if (timeLeft <= 0 && status === 'typing') {
      handleFinish();
    }
  }, [timeLeft, status, handleFinish]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if ((textareaRef.current?.value.length || 0) > 10) {
            handleFinish();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [handleFinish]);


  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (status === 'idle' && newText.length > 0) {
      startSprint();
    }
    if (status !== 'finished' && status !== 'analyzing') {
      setText(newText);
    }
  };

  const progress = (timeLeft / SPRINT_DURATION) * 100;
  const circularProgress = 100 - progress;


  return (
    <div className="bg-background min-h-screen flex flex-col font-display selection:bg-primary selection:text-white overflow-hidden">
      <header className="w-full px-6 py-4 flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
            <Zap className="h-5 w-5" />
          </div>
          <h1 className="text-white text-lg font-bold tracking-tight opacity-80">
            MindSprint
          </h1>
        </Link>
        <Button variant="ghost" asChild className="group">
          <Link href="/">
            <span className="text-sm font-medium">Exit Session</span>
            <X className="ml-2 h-5 w-5 group-hover:rotate-90 transition-transform" />
          </Link>
        </Button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 max-w-4xl mx-auto w-full relative z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="w-full flex flex-col gap-8 md:gap-12 animate-in fade-in zoom-in-95 duration-700">
          <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-b pb-6 px-2">
            <div className="flex flex-col gap-2 max-w-lg">
              <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider mb-1">
                <Timer className="h-5 w-5 animate-pulse" />
                <span>Rapid Thought Capture</span>
              </div>
              <h2 className="text-white text-3xl md:text-4xl font-bold !leading-tight">
                Don't think. Just type.
              </h2>
              <p className="text-muted-foreground text-base md:text-lg">
                Keep typing for 10 seconds. Let your thoughts flow freely.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-card/50 p-4 rounded-xl border backdrop-blur-sm">
              <div className="flex flex-col items-center">
                <span className="text-4xl font-bold text-white font-mono leading-none tracking-tight">
                  00:{timeLeft > 9 ? timeLeft : `0${timeLeft}`}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                  Remaining
                </span>
              </div>
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                  <path
                    className="text-border"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  ></path>
                  <path
                    className="text-primary drop-shadow-[0_0_10px_hsl(var(--primary)/0.6)]"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray={`${circularProgress}, 100`}
                    strokeWidth="3"
                    style={{ transition: 'stroke-dasharray 1s linear' }}
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="w-full group">
            <div className="w-full h-1 bg-border rounded-t-lg overflow-hidden relative">
              <div
                className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_15px_hsl(var(--primary)/0.8)] origin-left"
                style={{
                    transform: `scaleX(${status === 'typing' ? 1 - (timeLeft/SPRINT_DURATION) : (status === 'idle' ? 0 : 1)})`,
                    transition: status === 'typing' ? `transform 1s linear` : 'none',
                }}
              ></div>
            </div>
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={text}
                onChange={handleTextChange}
                autoFocus
                className="bg-card border-x border-b text-white placeholder:text-muted-foreground text-xl md:text-2xl leading-relaxed p-6 md:p-8 min-h-[320px] rounded-b-xl focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 resize-none transition-all duration-300 glow-effect"
                placeholder="Start typing whatever is in your mind right now..."
                disabled={status === 'finished' || status === 'analyzing'}
              />
              <div className={cn("absolute bottom-4 right-4 items-center gap-2 pointer-events-none", status === 'typing' || status === 'analyzing' ? "flex": "hidden")}>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full bounce-1"></div>
                  <div className="w-1.5 h-1.5 bg-primary rounded-full bounce-2"></div>
                  <div className="w-1.5 h-1.5 bg-primary rounded-full bounce-3"></div>
                </div>
                <span className="text-xs font-medium text-primary uppercase tracking-wider">
                  {status === 'analyzing' ? 'Analyzing' : 'Recording'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center px-2 pt-2">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <kbd className="font-sans px-1.5 py-0.5 bg-border rounded text-xs text-white border border-border">Enter</kbd>
              <span> to complete</span>
            </div>
            <Button variant="secondary" asChild>
              <Link href="/">
                Skip Exercise
                <SkipForward className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
