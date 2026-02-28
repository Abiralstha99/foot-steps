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
    <div className="relative min-h-screen bg-bg-base text-text-primary">
      <Sidebar />
      {/* Content area — sidebar always 52px collapsed, expands as overlay */}
      <main className="ml-[52px] min-h-screen px-6 py-8">
        <div className="mx-auto max-w-screen-xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
