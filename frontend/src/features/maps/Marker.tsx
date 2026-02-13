import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchAllPhotos } from "../photos/photosSlice";
import L from "leaflet";
import 'leaflet.markercluster';
import type { Photo } from "@/app/types";

export function Markers() {
    const dispatch = useAppDispatch();
    const photos = useAppSelector((state) => state.photos.photos);

    useEffect(() => {
        dispatch(fetchAllPhotos());
    }, [dispatch]);

    //function ffrom the plugin  that cluster markers together
    const markers = L.markerClusterGroup({
        maxClusterRadius: 80,
        spiderfyOnMaxZoom: true, // Spread out markers at max zoom
        showCoverageOnHover: true, // Show cluster area on hover
        zoomToBoundsOnClick: true // Zoom when clicking cluster
    });

    // Use photos here - only if they have coordinates
    photos.forEach((photo: Photo) => {
        if (photo.latitude && photo.longitude) {
            const marker = L.marker([photo.latitude, photo.longitude]);


            marker.bindPopup(`
                <img src="${photo.url}" style="max-width: 200px;" />
                <p>${photo.caption || 'No caption'}</p>
              `);

            markers.addLayer(marker);
        }
    });

    return markers;
}
