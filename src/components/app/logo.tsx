import { BrainCircuit } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/dashboard"
      className={cn(
        'flex items-center gap-2 group-data-[collapsible=icon]:justify-center',
        className
      )}
    >
      <BrainCircuit className="h-6 w-6 text-primary" />
      <h1 className="font-headline text-lg font-bold group-data-[collapsible=icon]:hidden">
        ABLE 4 ALL
      </h1>
    </Link>
  );
}
