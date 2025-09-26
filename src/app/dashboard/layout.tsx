import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/app/logo';
import { SidebarNav } from '@/components/app/sidebar-nav';
import { Header } from '@/components/app/header';
import { Separator } from '@/components/ui/separator';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter>
          <Separator className="mb-2" />
          <p className="p-2 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
            &copy; {new Date().getFullYear()} Abily Learn
          </p>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
