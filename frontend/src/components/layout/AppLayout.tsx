import { Outlet } from "react-router-dom"
import { MainLayout } from "@/components/layout/MainLayout"

/**
 * Wraps the app shell (sidebar + main area) and renders the matched route
 * via Outlet. Only the main content changes per route.
 */
export function AppLayout() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  )
}
