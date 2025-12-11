'use client';

import Link from 'next/link';
import { BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type HeaderProps = {
  variant?: 'landing' | 'analysis' | 'sprint' | 'history';
};

export default function Header({ variant: propVariant }: HeaderProps) {
  const pathname = usePathname();
  const avatarImage = PlaceHolderImages.find((img) => img.id === 'user-avatar');

  const getVariant = (): HeaderProps['variant'] => {
    if (propVariant) return propVariant;
    if (pathname === '/') return 'landing';
    if (pathname === '/sprint') return 'sprint';
    if (pathname.startsWith('/analysis')) return 'analysis';
    if (pathname.startsWith('/history')) return 'history';
    return 'landing';
  };

  const variant = getVariant();

  const navLinks = [
    { href: '#', label: 'Methodology' },
    { href: '#', label: 'Pricing' },
    { href: '#', label: 'About' },
  ];
  
  const dashboardLinks = [
    { href: '/analysis', label: 'Dashboard' },
    { href: '/history', label: 'History' },
    { href: '#', label: 'Settings' },
  ];

  return (
    <header className="w-full border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="px-4 md:px-10 flex justify-center py-3">
        <div className="flex max-w-7xl flex-1 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-foreground">
            <div className="size-8 flex items-center justify-center text-primary">
              <BrainCircuit className="h-7 w-7" />
            </div>
            <h2 className="text-lg font-bold leading-tight tracking-tight">
              MindType
            </h2>
          </Link>

          {variant === 'landing' && (
            <nav className="hidden md:flex items-center gap-9">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {variant === 'analysis' && (
            <div className="hidden md:flex items-center gap-9">
              {dashboardLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium hover:text-primary transition-colors",
                    pathname.startsWith(link.href) ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {variant === 'landing' && (
            <Button className="font-bold">Login</Button>
          )}
          
          {variant === 'analysis' && (
            <div className="flex items-center gap-4">
              <Button asChild className="font-bold">
                  <Link href="/sprint">New Session</Link>
              </Button>
              {avatarImage && (
                <Image
                  src={avatarImage.imageUrl}
                  alt={avatarImage.description}
                  width={40}
                  height={40}
                  className="rounded-full border-2"
                  data-ai-hint={avatarImage.imageHint}
                />
              )}
            </div>
          )}

           {variant === 'history' && (
            <div className="flex items-center gap-4">
               <Button asChild className="font-bold">
                  <Link href="/sprint">New Sprint</Link>
              </Button>
              {avatarImage && (
                <Image
                  src={avatarImage.imageUrl}
                  alt={avatarImage.description}
                  width={40}
                  height={40}
                  className="rounded-full border-2"
                  data-ai-hint={avatarImage.imageHint}
                />
              )}
            </div>
          )}

        </div>
      </div>
    </header>
  );
}
