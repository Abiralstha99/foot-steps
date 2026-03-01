import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { MapPin } from "lucide-react"

import type { Photo } from "@/app/types"
import { EmptyState } from "@/components/ui/EmptyState"
import { createPhotoMarker } from "@/features/maps/PhotoMapPin"
import {
  getCurrentTileUrl,
  getDarkTileUrl,
  getLightTileUrl,
  getTileAttribution,
} from "@/features/maps/mapUtils"

type TripMapViewProps = {
  photos: Photo[]
}

export function TripMapView({ photos }: TripMapViewProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const map = useRef<L.Map | null>(null)
  const tileLayer = useRef<L.TileLayer | null>(null)
  const markersRef = useRef<L.Marker[]>([])

  const geoPhotos = photos.filter(
    (p) => p.latitude != null && p.longitude != null
  )

  // Initialize map once on mount (skips when container is absent — i.e. empty state)
  useEffect(() => {
    if (map.current || !mapContainer.current) return

    map.current = new L.Map(mapContainer.current, {
      maxZoom: 18,
      minZoom: 2,
    })

    tileLayer.current = L.tileLayer(getCurrentTileUrl(), {
      maxZoom: 18,
      attribution: getTileAttribution(),
    })
    tileLayer.current.addTo(map.current)

    return () => {
      markersRef.current.forEach((m) => m.remove())
      markersRef.current = []
      tileLayer.current = null
      map.current?.remove()
      map.current = null
    }
  }, [])

  // Rebuild markers and re-fit bounds whenever photos change
  useEffect(() => {
    if (!map.current) return

    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    if (geoPhotos.length === 0) return

    const newMarkers: L.Marker[] = []
    geoPhotos.forEach((photo) => {
      const marker = createPhotoMarker(photo)
      marker.addTo(map.current!)
      newMarkers.push(marker)
    })
    markersRef.current = newMarkers

    const bounds = L.latLngBounds(
      geoPhotos.map((p) => [p.latitude!, p.longitude!] as [number, number])
    )
    map.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 })
  }, [photos]) // eslint-disable-line react-hooks/exhaustive-deps

  // Watch theme class changes and swap tile URL
  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (!tileLayer.current) return
      const isLight = document.documentElement.classList.contains("light")
      tileLayer.current.setUrl(isLight ? getLightTileUrl() : getDarkTileUrl())
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  if (geoPhotos.length === 0) {
    return (
      <EmptyState
        illustration={<MapPin className="size-12" />}
        headline="No location data"
        subline="Photos with GPS will appear here automatically."
      />
    )
  }

  return (
    <div className="h-[60vh] w-full overflow-hidden rounded-lg border border-border-token">
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  )
}
