import { useEffect } from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import { Outlet } from "react-router-dom"
import { useAppDispatch } from "@/app/hooks"
import { fetchTrips } from "@/features/trips/tripsSlice"
import { useAuth } from "@clerk/clerk-react"
import { setAuthToken } from "@/lib/api"

export function AppLayout() {
  const dispatch = useAppDispatch()
  const { isSignedIn, isLoaded, getToken } = useAuth()

  // Wait for Clerk to load and set token before fetching
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return
    const init = async () => {
      const token = await getToken()
      setAuthToken(token)
      dispatch(fetchTrips())
    }
    init()
  }, [dispatch, isSignedIn, isLoaded, getToken])

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070807] text-white font-sans">
      {/* Sidebar (desktop + mobile trigger handled inside) */}
      <Sidebar />

      {/* Main content area */}
      <main className="relative flex min-h-screen flex-col md:ml-[260px] px-8 py-10">
        {/* Cinematic radial gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(60,71,65,0.55),_transparent_65%)] opacity-80" />

        {/* Subtle vertical gradient base */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#070807] via-[#070807] to-black" />

        <div className="relative z-10 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl animate-in fade-in duration-500">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}

