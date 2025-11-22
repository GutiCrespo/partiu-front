"use client";

import { useEffect, useState, useCallback } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  type MapMouseEvent,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { getCookie } from "@/helpers/cookies";

interface MapsProps {
  latitude?: number;
  longitude?: number;
}

type SelectedPlace = {
  placeId: string;
  name?: string;
  address?: string;
  rating?: number;
  photoUrl?: string;
  url?: string;
  position: {
    lat: number;
    lng: number;
  };
};

type SimpleTrip = {
  id: number;
  name: string;
};

function PlacesDetailsLoader({
  selectedPlace,
  setSelectedPlace,
}: {
  selectedPlace: SelectedPlace | null;
  setSelectedPlace: (place: SelectedPlace | null) => void;
}) {
  const map = useMap();
  const placesLibrary = useMapsLibrary("places");
  const [placesService, setPlacesService] =
    useState<google.maps.places.PlacesService | null>(null);

  useEffect(() => {
    if (!map || !placesLibrary) return;

    const service = new placesLibrary.PlacesService(map);
    setPlacesService(service);
  }, [map, placesLibrary]);

  useEffect(() => {
    if (!placesService) return;
    if (!selectedPlace) return;
    if (selectedPlace.name) return;

    const request: google.maps.places.PlaceDetailsRequest = {
      placeId: selectedPlace.placeId,
      fields: [
        "name",
        "formatted_address",
        "rating",
        "photos",
        "url",
        "geometry",
      ],
    };

    placesService.getDetails(request, (place, status) => {
      if (
        status !== google.maps.places.PlacesServiceStatus.OK ||
        !place ||
        !place.geometry ||
        !place.geometry.location
      ) {
        console.warn("Erro ao buscar detalhes do lugar:", status, place);
        return;
      }

      const location = place.geometry.location;

      const photoUrl =
        place.photos && place.photos.length > 0
          ? place.photos[0].getUrl({ maxWidth: 300, maxHeight: 200 })
          : undefined;

      const updated: SelectedPlace = {
        ...selectedPlace,
        name: place.name ?? selectedPlace.name,
        address: place.formatted_address ?? selectedPlace.address,
        rating: place.rating ?? selectedPlace.rating,
        photoUrl,
        url: place.url ?? selectedPlace.url,
        position: {
          lat: location.lat(),
          lng: location.lng(),
        },
      };

      console.log("Detalhes carregados via PlacesService:", updated);
      setSelectedPlace(updated);
    });
  }, [placesService, selectedPlace, setSelectedPlace]);

  return null;
}

export default function Maps({ latitude, longitude }: MapsProps) {
  const [mapCenter, setMapCenter] = useState({ lat: -31.77, lng: -52.34 });
  const [mapZoom, setMapZoom] = useState(7);

  const [selectedPlace, setSelectedPlace] = useState<SelectedPlace | null>(
    null
  );

  const [trips, setTrips] = useState<SimpleTrip[]>([]);
  const [tripsLoading, setTripsLoading] = useState(false);
  const [tripsError, setTripsError] = useState<string | null>(null);
  const [showTripMenu, setShowTripMenu] = useState(false);

  const apiToken = process.env.NEXT_PUBLIC_MAPS_API_KEY!;
  const mapId = process.env.NEXT_PUBLIC_MAP_ID!;
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (
      latitude !== undefined &&
      longitude !== undefined &&
      (latitude !== 0 || longitude !== 0)
    ) {
      setMapCenter({ lat: latitude, lng: longitude });
      setMapZoom(14);
    }
  }, [latitude, longitude]);

  const handleMapClick = useCallback((event: MapMouseEvent) => {
    const { detail } = event;
    const { latLng, placeId } = detail;

    if (!placeId) {
      setSelectedPlace(null);
      setShowTripMenu(false);
      return;
    }

    if (!latLng) {
      console.warn("Clique com placeId mas sem latLng:", event);
      setSelectedPlace(null);
      setShowTripMenu(false);
      return;
    }

    const nextSelected: SelectedPlace = {
      placeId,
      position: {
        lat: latLng.lat,
        lng: latLng.lng,
      },
    };

    console.log("POI clicado no mapa (antes dos detalhes):", nextSelected);
    setSelectedPlace(nextSelected);
    setShowTripMenu(false);
  }, []);

  const fetchTrips = useCallback(async () => {
    if (!apiBaseUrl) {
      setTripsError("API base URL não configurada.");
      return;
    }

    const authToken = getCookie("authToken");

    if (!authToken) {
      setTripsError(
        "Token de autenticação não encontrado. Faça login novamente."
      );
      return;
    }

    try {
      setTripsLoading(true);
      setTripsError(null);

      const response = await fetch(`${apiBaseUrl}/trips/myTrips`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Erro ao buscar viagens.");
      }

      const data: { id: number; name: string }[] = await response.json();

      const normalizedTrips: SimpleTrip[] = data.map((trip) => ({
        id: trip.id,
        name: trip.name,
      }));

      setTrips(normalizedTrips);
    } catch (err) {
      setTripsError(
        (err as Error).message || "Ocorreu um erro ao carregar as viagens."
      );
    } finally {
      setTripsLoading(false);
    }
  }, [apiBaseUrl]);

  const handleAddToTripClick = async () => {
    const willOpen = !showTripMenu;
    setShowTripMenu(willOpen);

    if (willOpen && trips.length === 0 && !tripsLoading) {
      await fetchTrips();
    }
  };

  const handleSelectTrip = (tripId: number) => {
    console.log("Roteiro selecionado:", tripId, "Lugar:", selectedPlace);
    setShowTripMenu(false);
    setSelectedPlace(null);
  };

  if (!apiToken || !mapId) {
    console.error(
      "As variáveis de ambiente NEXT_PUBLIC_MAPS_API_KEY, NEXT_PUBLIC_MAP_ID ou NEXT_PUBLIC_API_BASE_URL não estão definidas."
    );
    return (
      <div>Erro ao carregar o mapa: Chaves de API ou Map ID ausentes.</div>
    );
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
          onClick={handleMapClick}
        >
          {latitude !== undefined && longitude !== undefined && (
            <AdvancedMarker position={{ lat: latitude, lng: longitude }}>
              <Pin />
            </AdvancedMarker>
          )}

          {selectedPlace && (
            <InfoWindow
              position={selectedPlace.position}
              onCloseClick={() => {
                setSelectedPlace(null);
                setShowTripMenu(false);
              }}
            >
              <div style={{ maxWidth: 260 }}>
                {selectedPlace.photoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedPlace.photoUrl}
                    alt={selectedPlace.name ?? "Foto do local"}
                    style={{
                      width: "100%",
                      borderRadius: 4,
                      marginBottom: 8,
                      display: "block",
                    }}
                  />
                )}

                {selectedPlace.name && (
                  <h3
                    style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}
                  >
                    {selectedPlace.name}
                  </h3>
                )}

                {selectedPlace.address && (
                  <p style={{ fontSize: 12, marginBottom: 6 }}>
                    {selectedPlace.address}
                  </p>
                )}

                {typeof selectedPlace.rating === "number" && (
                  <p style={{ fontSize: 12, marginBottom: 8 }}>
                    ⭐ {selectedPlace.rating.toFixed(1)}
                  </p>
                )}

                <button
                  style={{
                    width: "100%",
                    padding: "6px 10px",
                    fontSize: 13,
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    cursor: "pointer",
                    marginBottom: 8,
                    background: "#fff",
                  }}
                  onClick={handleAddToTripClick}
                >
                  ➕ Adicionar ao roteiro
                </button>

                {showTripMenu && (
                  <div
                    style={{
                      border: "1px solid #eee",
                      borderRadius: 6,
                      padding: 4,
                      marginBottom: 8,
                      maxHeight: 150,
                      overflowY: "auto",
                      background: "#fff",
                    }}
                  >
                    {tripsLoading && (
                      <p style={{ fontSize: 12 }}>
                        Carregando seus roteiros...
                      </p>
                    )}

                    {tripsError && (
                      <p style={{ fontSize: 12, color: "red" }}>
                        Ops, erro ao carregar roteiros.
                      </p>
                    )}

                    {!tripsLoading &&
                      !tripsError &&
                      trips.length === 0 && (
                        <p style={{ fontSize: 12 }}>
                          Você ainda não tem nenhum roteiro cadastrado.
                        </p>
                      )}

                    {!tripsLoading &&
                      !tripsError &&
                      trips.length > 0 &&
                      trips.map((trip) => (
                        <button
                          key={trip.id}
                          style={{
                            display: "block",
                            width: "100%",
                            textAlign: "left",
                            padding: "4px 6px",
                            fontSize: 12,
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            borderRadius: 4,
                          }}
                          onClick={() => handleSelectTrip(trip.id)}
                        >
                          {trip.name}
                        </button>
                      ))}
                  </div>
                )}

                {selectedPlace.url && (
                  <a
                    href={selectedPlace.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: 12,
                      textDecoration: "underline",
                    }}
                  >
                    Ver no Google Maps
                  </a>
                )}
              </div>
            </InfoWindow>
          )}
        </Map>

        <PlacesDetailsLoader
          selectedPlace={selectedPlace}
          setSelectedPlace={setSelectedPlace}
        />
      </div>
    </APIProvider>
  );
}
