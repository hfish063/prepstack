import { StrictMode, useEffect } from "react"
import { createRoot } from "react-dom/client"
import { ClerkProvider, useAuth } from "@clerk/react"
import { shadcn } from "@clerk/ui/themes"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createRouter, RouterProvider } from "@tanstack/react-router"

import "./index.css"
import { routeTree } from "./routeTree.gen"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { Spinner } from "./components/ui/spinner"
import { setAuthTokenGetter } from "@/lib/api-client"
import NotFound from "./components/errors/not-fround"

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in .env.local")
}

const queryClient = new QueryClient()

const router = createRouter({
  routeTree,
  context: { queryClient, auth: undefined! },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  defaultNotFoundComponent: () => <NotFound />,
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

function InnerApp() {
  const auth = useAuth()

  // Re-run route guards when the user signs in or out
  useEffect(() => {
    if (auth.isLoaded) {
      router.invalidate()
    }
  }, [auth.isLoaded, auth.isSignedIn])

  // Route guards need auth state, so hold rendering until Clerk has loaded
  if (!auth.isLoaded) {
    return (
      <div className="flex h-svh items-center justify-center">
        <Spinner />
      </div>
    )
  }

  // Registered before the router renders so the first API requests are authenticated
  setAuthTokenGetter(auth.getToken)

  return <RouterProvider router={router} context={{ auth }} />
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <ClerkProvider
        appearance={{ theme: shadcn }}
        publishableKey={CLERK_PUBLISHABLE_KEY}
        signInUrl="/sign-in"
        signUpUrl="/sign-up"
        afterSignOutUrl="/"
      >
        <QueryClientProvider client={queryClient}>
          <InnerApp />
        </QueryClientProvider>
      </ClerkProvider>
    </ThemeProvider>
  </StrictMode>
)
