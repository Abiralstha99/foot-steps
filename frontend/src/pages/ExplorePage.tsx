import { useRef, useEffect, useState } from 'react';
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";

function ExplorePage() {
    const mapContainer = useRef(null);
    const map = useRef<L.Map | null>(null);
    const center = { lng: 13.338414, lat: 52.507932 };
    const [zoom] = useState(12);

    useEffect(() => {
        if (map.current) return; // stops map from initializing more than once

        if (mapContainer.current) {
            map.current = new L.Map(mapContainer.current as HTMLElement, {
                center: L.latLng(center.lat, center.lng),
                zoom: zoom
            });
        }

        // Create a MapTiler Layer inside Leaflet
        if (map.current) {
            new MaptilerLayer({
                apiKey: "BrgTwPNH7EN2oggvAkLG",
                style: "019c53d2-08a9-76b8-8b10-9a29401e626b", // Satellite Plain style
            }).addTo(map.current);
        }

    }, [center.lng, center.lat, zoom]);

    return (
        <div className="fixed inset-0 md:left-[260px]">
            <div ref={mapContainer} className="w-full h-full" />
        </div>
    );
}

export default ExplorePage;