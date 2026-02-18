import { useEffect } from "react"
import { useAuth } from "@clerk/clerk-react"
import { setAuthToken } from "@/lib/api"

export function useAuthToken() {
    const { isSignedIn, isLoaded, getToken } = useAuth()

    useEffect(() => {
        const updateToken = async () => {
            if (isSignedIn) {
                const token = await getToken()
                setAuthToken(token)
            } else {
                setAuthToken(null)
            }
        }

        if (isLoaded) {
            updateToken()
        }
    }, [isSignedIn, isLoaded, getToken])
}
