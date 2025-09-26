'use client';

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  Bot,
  Feather,
  Hand,
  LayoutDashboard,
  Lightbulb,
  BookText,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const links = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard />,
  },
  {
    href: '/dashboard/assistant',
    label: 'AI Assistant',
    icon: <Bot />,
  },
  {
    href: '/dashboard/isl-translator',
    label: 'ISL Translator',
    icon: <Hand />,
  },
  {
    href: '/dashboard/gesture-control',
    label: 'Gesture Control',
    icon: <Feather />,
  },
  {
    href: '/dashboard/quiz-generator',
    label: 'Quiz Generator',
    icon: <Lightbulb />,
  },
  {
    href: '/dashboard/summarizer',
    label: 'Summarizer',
    icon: <BookText />,
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {links.map((link) => (
        <SidebarMenuItem key={link.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === link.href}
            tooltip={link.label}
          >
            <Link href={link.href}>
              {link.icon}
              <span>{link.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
