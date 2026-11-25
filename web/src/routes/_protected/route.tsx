import AppHeader from "@/components/layout/app-header"
import AppSidebar from "@/components/layout/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toast"
import { TooltipProvider } from "@/components/ui/tooltip"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_protected")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isSignedIn) {
      throw redirect({
        to: "/auth/sign-in",
        search: { redirect_url: location.href },
      })
    }
  },
  component: ProtectedLayout,
})

function ProtectedLayout() {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <main className="flex h-svh min-w-0 flex-1 flex-col overflow-hidden">
        <TooltipProvider>
          <AppHeader />
          <div className="min-h-0 flex-1 overflow-auto p-4">
            <Outlet />
          </div>
        </TooltipProvider>
      </main>
      <Toaster />
    </SidebarProvider>
  )
}
