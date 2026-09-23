import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/common/app-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppHeader from "@/components/common/app-header";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <main className="flex flex-1 flex-col min-w-0 h-svh overflow-hidden">
        <TooltipProvider>
          <AppHeader />
          <div className="flex-1 min-h-0 overflow-auto p-4">{children}</div>
        </TooltipProvider>
      </main>
    </SidebarProvider>
  );
}
