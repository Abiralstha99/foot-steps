import L from "leaflet";

import type { Photo } from "@/app/types";

const LIGHT_TILE = import.meta.env.VITE_MAP_TILE_LIGHT_URL;
const DARK_TILE = import.meta.env.VITE_MAP_TILE_DARK_URL;
const ATTRIBUTION =
  '&copy; <a href="https://stadiamaps.com/" target="_blank" rel="noreferrer">Stadia Maps</a> ' +
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>';

export function getLightTileUrl(): string {
  return LIGHT_TILE;
}

export function getDarkTileUrl(): string {
  return DARK_TILE;
}

export function getCurrentTileUrl(): string {
  return document.documentElement.classList.contains("light")
    ? LIGHT_TILE
    : DARK_TILE;
}

export function getTileAttribution(): string {
  return ATTRIBUTION;
}

export function createPhotoPin(photo: Photo): L.DivIcon {
  const src = photo.url ?? "";
  const html = src
    ? `<img src="${src}" crossorigin="anonymous" alt="" style="width:32px;height:32px;object-fit:cover;border-radius:4px;border:2px solid var(--accent);box-shadow:0 2px 8px rgba(0,0,0,0.4);display:block;" />`
    : `<div style="width:32px;height:32px;background:var(--bg-raised);border-radius:4px;border:2px solid var(--accent);"></div>`;

  return L.divIcon({
    html,
    className: "",
    iconSize: L.point(32, 32),
    iconAnchor: [16, 32],
    popupAnchor: [0, -36],
  });
}

export function getClusterIconFactory() {
  return function (cluster: { getChildCount(): number }): L.DivIcon {
    const count = cluster.getChildCount();
    return L.divIcon({
      html: `<div style="width:36px;height:36px;border-radius:50%;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;box-shadow:0 2px 8px rgba(0,0,0,0.35);">${count}</div>`,
      className: "",
      iconSize: L.point(36, 36),
      iconAnchor: [18, 18],
    });
  };
}
