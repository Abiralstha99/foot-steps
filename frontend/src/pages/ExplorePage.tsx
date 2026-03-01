import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet.markercluster"
import "leaflet/dist/leaflet.css"

import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { fetchAllPhotos } from "@/features/photos/photosSlice"
import { createPhotoMarker } from "@/features/maps/PhotoMapPin"
import {
  getCurrentTileUrl,
  getDarkTileUrl,
  getLightTileUrl,
  getTileAttribution,
  getClusterIconFactory,
} from "@/features/maps/mapUtils"

function ExplorePage() {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const map = useRef<L.Map | null>(null)
  const tileLayer = useRef<L.TileLayer | null>(null)
  const clusterGroup = useRef<L.MarkerClusterGroup | null>(null)

  const dispatch = useAppDispatch()
  const photos = useAppSelector((state) => state.photos.photos)
  const loading = useAppSelector((state) => state.photos.loading)

  // Fetch all photos on mount
  useEffect(() => {
    dispatch(fetchAllPhotos())
  }, [dispatch])

  // Initialize map once
  useEffect(() => {
    if (map.current || !mapContainer.current) return

    map.current = new L.Map(mapContainer.current, {
      center: L.latLng(20, 0),
      zoom: 2,
      maxZoom: 18,
      minZoom: 2,
    })

    tileLayer.current = L.tileLayer(getCurrentTileUrl(), {
      maxZoom: 18,
      attribution: getTileAttribution(),
    })
    tileLayer.current.addTo(map.current)

    // @ts-expect-error — iconCreateFunction type mismatch between leaflet and markercluster types
    clusterGroup.current = L.markerClusterGroup({
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      disableClusteringAtZoom: 13,
      iconCreateFunction: getClusterIconFactory(),
    })
    clusterGroup.current.addTo(map.current)

    return () => {
      clusterGroup.current?.clearLayers()
      clusterGroup.current = null
      tileLayer.current = null
      map.current?.remove()
      map.current = null
    }
  }, [])

  // Watch html class mutations to swap tile layer on theme change
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

  // Rebuild markers when photos change
  useEffect(() => {
    if (!clusterGroup.current || loading) return

    clusterGroup.current.clearLayers()

    photos.forEach((photo) => {
      if (photo.latitude != null && photo.longitude != null) {
        const marker = createPhotoMarker(photo)
        clusterGroup.current!.addLayer(marker)
      }
    })
  }, [photos, loading])

  return (
    <div className="fixed inset-0 ml-[52px]">
      {/* Page title overlay */}
      <div className="absolute left-4 top-4 z-[1000] rounded-lg bg-bg-surface/80 px-4 py-2 backdrop-blur-sm">
        <h1 className="font-display text-heading text-text-primary">Explore</h1>
      </div>

      <div ref={mapContainer} className="h-full w-full" />
    </div>
  )
}

export default ExplorePage
