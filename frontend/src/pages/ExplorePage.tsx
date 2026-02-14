import { useRef, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchAllPhotos } from "@/features/photos/photosSlice";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import 'leaflet.markercluster';

function ExplorePage() {
    const mapContainer = useRef(null);
    const map = useRef<L.Map | null>(null);
    const markerClusterGroup = useRef<L.MarkerClusterGroup | null>(null);
    const center = { lng: 13.338414, lat: 52.507932 };
    const [zoom] = useState(1);

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
            minZoom: 2
        });

        // Use raster tiles directly to avoid MapTiler SDK runtime map lifecycle issues.
        L.tileLayer("https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=BrgTwPNH7EN2oggvAkLG", {
            tileSize: 512,
            zoomOffset: -1,
            attribution:
                '&copy; <a href="https://www.maptiler.com/copyright/" target="_blank" rel="noreferrer">MapTiler</a> ' +
                '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>',
        }).addTo(map.current);

        // Initialize marker cluster group
        markerClusterGroup.current = L.markerClusterGroup({
            maxClusterRadius: 50,
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true,
            disableClusteringAtZoom: 13,
            iconCreateFunction: function () {
                return L.divIcon({
                    html: `<img src="/src/assets/pin.png" style="width: 32px; height: 32px;" />`,
                    className: 'custom-cluster-wrapper',
                    iconSize: L.point(32, 32),
                    iconAnchor: [16, 32]
                });
            }
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
        photos.forEach(photo => {
            if (photo.latitude != null && photo.longitude != null) {
                const customIcon = L.icon({
                    iconUrl: '/src/assets/pin.png',
                    iconSize: [32, 32],       // Size of the icon
                    iconAnchor: [16, 32],     // Point that corresponds to marker's location
                    popupAnchor: [0, -32],    // Point from which popup opens
                });

                const displayUrl = photo.viewUrl ?? photo.url ?? "";
                const marker = L.marker([photo.latitude, photo.longitude], {
                    icon: customIcon
                });
                marker.bindPopup(`
                    <div style="max-width: 220px;">
                        <img 
                            src="${displayUrl}" 
                            style="width: 100%; max-width: 200px; max-height: 200px; object-fit: cover; display: block; margin-bottom: 8px;" 
                            alt="${photo.caption || 'Trip photo'}"
                        />
                        <p style="margin: 0 0 4px 0;">${photo.caption || 'No caption'}</p>
                        <small style="word-break: break-all;">${displayUrl}</small>
                    </div>
                `);

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
