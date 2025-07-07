import { useState, useEffect } from 'react';

interface UsePlacePhotoResult {
  photoUrl: string;
  // loading: boolean;
  error: string | null;
}

export function usePlacePhoto(placePhotoName: string | null | undefined, fallbackPhoto: string = "/mockup/place.png"): UsePlacePhotoResult {
  const [photoUrl, setPhotoUrl] = useState<string>(fallbackPhoto);
  // const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!placePhotoName || !placePhotoName.startsWith("places/")) {
      setPhotoUrl(fallbackPhoto);
      // setLoading(false);
      return;
    }

    const fetchPhoto = async () => {
      // setLoading(true);
      setError(null);
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL
        
        const response = await fetch(`${backendUrl}/tripPlaces/photo?photoName=${placePhotoName}`, {
          cache: 'no-store',
          method: "GET",
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erro ao buscar a imagem: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        setPhotoUrl(data.url)

      } catch (err) {
        console.error("Erro no hook usePlacePhoto:", err);
        setError((err as Error).message || "Falha ao carregar a imagem.");
        setPhotoUrl(fallbackPhoto);
      } finally {
        // setLoading(false);
      }
    };

    fetchPhoto();
  }, [placePhotoName, fallbackPhoto]);

  return { photoUrl, 
          //  loading,
           error };
}