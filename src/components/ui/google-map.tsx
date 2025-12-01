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
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Button } from "./button";

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

      
      setSelectedPlace(updated);
    });
  }, [placesService, selectedPlace, setSelectedPlace]);

  return null;
}

export default function Maps({ latitude, longitude }: MapsProps) {
  const router = useRouter();

  const [mapCenter, setMapCenter] = useState({ lat: -31.77, lng: -52.34 });
  const [mapZoom, setMapZoom] = useState(7);

  const [selectedPlace, setSelectedPlace] = useState<SelectedPlace | null>(
    null
  );

  const [trips, setTrips] = useState<SimpleTrip[]>([]);
  const [tripsLoading, setTripsLoading] = useState(false);
  const [tripsError, setTripsError] = useState<string | null>(null);
  const [showTripMenu, setShowTripMenu] = useState(false);
  const [authRequired, setAuthRequired] = useState(false);

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
      setAuthRequired(true);
      setTripsError(null);
      return;
    }

    try {
      setTripsLoading(true);
      setTripsError(null);
      setAuthRequired(false);

      const response = await fetch(`${apiBaseUrl}/trips/myTrips`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          setAuthRequired(true);
          setTripsError(null);
          return;
        }

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

  const checkPlaceAlreadyInTrip = useCallback(
    async (tripId: number, placeId: string): Promise<boolean> => {
      if (!apiBaseUrl) return false;

      try {
        const res = await fetch(`${apiBaseUrl}/tripPlaces/${tripId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          console.warn(
            "Erro ao verificar lugares do roteiro antes de adicionar:",
            res.status
          );
          return false;
        }

        const trip = await res.json();
        const places = trip?.places ?? [];

        const exists = places.some(
          (p: { placeId: string }) => p.placeId === placeId
        );

        return exists;
      } catch (error) {
        console.error("Erro ao checar duplicidade de lugar no roteiro:", error);
        return false;
      }
    },
    [apiBaseUrl]
  );

  const handleSelectTrip = async (tripId: number) => {
    

    if (!apiBaseUrl) {
      console.error("NEXT_PUBLIC_API_BASE_URL não configurada.");
      toast.error("Erro de configuração. API não encontrada.");
      return;
    }

    if (!selectedPlace || !selectedPlace.placeId) {
      console.error("Nenhum lugar selecionado ou placeId ausente.");
      toast.error("Não foi possível identificar o destino selecionado.");
      return;
    }

    const token = getCookie("authToken");

    if (!token) {
      console.error("Token de autenticação não encontrado. Indo para login.");
      setShowTripMenu(false);
      setSelectedPlace(null);
      toast.info("Faça login para adicionar destinos ao seu roteiro.");
      router.push("/login");
      return;
    }

    const alreadyInTrip = await checkPlaceAlreadyInTrip(
      tripId,
      selectedPlace.placeId
    );

    if (alreadyInTrip) {
      toast.info("Esse destino já está nesse roteiro.");
      setShowTripMenu(false);
      return;
    }

    try {
      console.log(`Chamando POST ${apiBaseUrl}/tripPlaces`, {
        placeId: selectedPlace.placeId,
        tripId,
      });

      const res = await fetch(`${apiBaseUrl}/tripPlaces`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          placeId: selectedPlace.placeId,
          tripId: tripId,
        }),
      });

      const result = await res.json().catch(() => null);

      if (!res.ok) {
        console.error(
          "Erro na resposta da API ao adicionar local ao roteiro:",
          result || res.status
        );
        toast.error(
          result?.error ||
            "Não foi possível adicionar o destino a esse roteiro."
        );
        return;
      }

      
      

      toast.success("Destino adicionado ao roteiro! ✈️");

      setShowTripMenu(false);
      setSelectedPlace(null);

      router.push(`/trips/tripPlace/${tripId}`);
    } catch (error) {
      console.error(
        `Erro ao chamar o POST em: ${apiBaseUrl}/tripPlaces`,
        error
      );
      toast.error("Erro inesperado ao adicionar o destino ao roteiro.");
    }
  };

  const handleCreateNewTrip = () => {
    setShowTripMenu(false);
    setSelectedPlace(null);
    router.push("/trips/createTrip");
  };

  const handleGoToLogin = () => {
    setShowTripMenu(false);
    setSelectedPlace(null);
    router.push("/login");
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
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      marginBottom: 4,
                    }}
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

                {/* Botão para abrir/fechar o menu de roteiros */}
                <Button onClick={handleAddToTripClick}>
                  Adicionar ao roteiro
                </Button>

                {/* Menu suspenso com roteiros + criar novo / login */}
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
                    {authRequired ? (
                      <p style={{ fontSize: 12 }}>
                        Você precisa fazer login para adicionar destinos ao seu
                        roteiro.{" "}
                        <button
                          style={{
                            padding: 0,
                            border: "none",
                            background: "none",
                            color: "#0070f3",
                            textDecoration: "underline",
                            cursor: "pointer",
                            fontSize: 12,
                          }}
                          onClick={handleGoToLogin}
                        >
                          Clique aqui e faça seu login.
                        </button>
                      </p>
                    ) : (
                      <>
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

                        {!tripsLoading && !tripsError && (
                          <button
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
                              marginTop: 4,
                              fontWeight: 600,
                            }}
                            onClick={handleCreateNewTrip}
                          >
                            Criar novo roteiro
                          </button>
                        )}
                      </>
                    )}
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
                      display: "block",   // <- força ficar embaixo
                      marginTop: 8,       // <- espaço entre o botão/menu e o link
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
