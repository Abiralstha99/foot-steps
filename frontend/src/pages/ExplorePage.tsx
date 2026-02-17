import { useRef, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchAllPhotos } from "@/features/photos/photosSlice";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.markercluster";
import pinIconUrl from "@/assets/pin.png";

function ExplorePage() {
  const mapContainer = useRef(null);
  const map = useRef<L.Map | null>(null);
  const markerClusterGroup = useRef<L.MarkerClusterGroup | null>(null);
  const center = { lng: 13.338414, lat: 52.507932 };
  const [zoom] = useState(3);

  // Redux hooks
  const dispatch = useAppDispatch();
  const photos = useAppSelector((state) => state.photos.photos);
  const loading = useAppSelector((state) => state.photos.loading);

  // Fetch photos on mount
  useEffect(() => {
    dispatch(fetchAllPhotos());
  }, [dispatch]);

  // Initialize map once
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new L.Map(mapContainer.current as HTMLElement, {
      center: L.latLng(center.lat, center.lng),
      zoom: zoom,
      maxZoom: 18,
      minZoom: 2,
    });

    // MapTiler raster tiles require {z}/{x}/{y} in the URL for Leaflet to fetch tiles.
    const apiKey = "DGBO1Q5omkr26b6cUWFg";
    L.tileLayer(
      `https://api.maptiler.com/maps/satellite-v4/{z}/{x}/{y}.jpg?key=${apiKey}`,
      {
        tileSize: 512,
        zoomOffset: -1,
        minZoom: 1,
        attribution:
          '&copy; <a href="https://www.maptiler.com/copyright/" target="_blank" rel="noreferrer">MapTiler</a> ' +
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>',
      },
    ).addTo(map.current);

    // Initialize marker cluster group
    markerClusterGroup.current = L.markerClusterGroup({
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      disableClusteringAtZoom: 13,
      iconCreateFunction: function () {
        return L.divIcon({
          html: `<img src="${pinIconUrl}" style="width: 32px; height: 32px;" alt="" />`,
          className: "custom-cluster-wrapper",
          iconSize: L.point(32, 32),
          iconAnchor: [16, 32],
        });
      },
    });

    markerClusterGroup.current.addTo(map.current);

    return () => {
      markerClusterGroup.current?.clearLayers();
      markerClusterGroup.current = null;
      map.current?.remove();
      map.current = null;
    };
  }, [center.lng, center.lat, zoom]);

  // Update markers when photos change
  useEffect(() => {
    if (!markerClusterGroup.current || loading) return;

    // Clear existing markers
    markerClusterGroup.current.clearLayers();

    // Add markers for photos with coordinates
    photos.forEach((photo) => {
      if (photo.latitude != null && photo.longitude != null) {
        const customIcon = L.icon({
          iconUrl: pinIconUrl,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        });

        const displayUrl = photo.viewUrl ?? photo.url ?? "";
        const marker = L.marker([photo.latitude, photo.longitude], {
          icon: customIcon,
        });

        const imageHtml = displayUrl
          ? `<img src="${displayUrl}" style="width: 100%; max-width: 200px; max-height: 200px; object-fit: cover; display: block; border-radius: 4px;" alt="Trip photo" crossorigin="anonymous" />`
          : '<div style="width: 200px; height: 150px; background: #333; color: #999; display: flex; align-items: center; justify-content: center; font-size: 12px;">No image</div>';

        marker.bindPopup(
          `<div style="max-width: 220px; padding: 0; line-height: 0; overflow: hidden;">${imageHtml}</div>`,
          { minWidth: 220, className: "leaflet-popup-photo" }
        );

        marker.bindTooltip(
          `<div class="leaflet-tooltip-photo-inner" style="max-width: 220px; padding: 0; line-height: 0; min-width: 200px; min-height: 150px;">${imageHtml}</div>`,
          {
            permanent: false,
            direction: "top",
            offset: [0, -32],
            opacity: 1,
            className: "leaflet-tooltip-photo",
            interactive: true,
            sticky: true,
          }
        );

        markerClusterGroup.current!.addLayer(marker);
      }
    });
  }, [photos, loading]);

  return (
    <div className="fixed inset-0 md:left-[260px]">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}

export default ExplorePage;
