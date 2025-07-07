"use client";

import { useEffect, useState } from "react"; 
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";

interface MapsProps {
  latitude?: number
  longitude?: number
}

export default function Maps({ latitude, longitude }: MapsProps) {
  
  const [mapCenter, setMapCenter] = useState({ lat: -31.77, lng: -52.34 });
  const [mapZoom, setMapZoom] = useState(7);
  const [open, setOpen] = useState(false);

  const apiToken = process.env.NEXT_PUBLIC_MAPS_API_KEY!;
  const mapId = process.env.NEXT_PUBLIC_MAP_ID!;

  useEffect(() => {
    if (latitude !== undefined && longitude !== undefined && (latitude !== 0 || longitude !== 0)) {
      setMapCenter({ lat: latitude, lng: longitude })
      setMapZoom(14)
    }
  }, [latitude, longitude])


  if (!apiToken || !mapId) {
    console.error("As variáveis de ambiente NEXT_PUBLIC_MAPS_API_KEY e/ou NEXT_PUBLIC_MAP_ID não estão definidas.");
    return <div>Erro ao carregar o mapa: Chaves de API ou Map ID ausentes.</div>;
  }

  return (
    <APIProvider apiKey={apiToken}>
      <div className="w-full h-[400px]">
        <Map
          zoom={mapZoom}
          center={mapCenter}
          mapId={mapId}
          onCameraChanged={(ev) => {
            setMapCenter(ev.detail.center);
            setMapZoom(ev.detail.zoom);
          }}
        >
          {latitude !== undefined && longitude !== undefined && (
            <AdvancedMarker position={{lat: latitude, lng: longitude}} onClick={() => setOpen(true)}>
              <Pin/>
            </AdvancedMarker>
          )}

          {open && latitude !== undefined && longitude !== undefined && (
            <InfoWindow position={{lat: latitude, lng: longitude}} onCloseClick={() => setOpen(false)}>
              <p>Latitude: {latitude.toFixed(2)}, Longitude: {longitude.toFixed(2)}</p>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
}