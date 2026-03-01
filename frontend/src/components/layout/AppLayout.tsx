import { useEffect, useState } from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import { Outlet } from "react-router-dom"
import { useAuth } from "@clerk/clerk-react"
import { setAuthToken } from "@/lib/api"
import { useGetTripsQuery } from "@/features/trips/tripsApi"

export function AppLayout() {
  const { isSignedIn, isLoaded, getToken } = useAuth()
  const [tokenReady, setTokenReady] = useState(false)

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return
    const init = async () => {
      const token = await getToken()
      setAuthToken(token)
      setTokenReady(true)
    }
    void init()
  }, [isSignedIn, isLoaded, getToken])

  // Warm the trips cache once auth token is ready
  useGetTripsQuery(undefined, { skip: !tokenReady })

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

