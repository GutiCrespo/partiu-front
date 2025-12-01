import { useState, useEffect } from 'react';

interface UsePlacePhotoResult {
  photoUrl: string;
  error: string | null;
}


export function usePlacePhoto(
  placePhotoName: string | null | undefined,
  fallbackPhoto: string = "/mockup/place.png"
): UsePlacePhotoResult {
  const [photoUrl, setPhotoUrl] = useState<string>(fallbackPhoto);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    
    
    if (!placePhotoName || !placePhotoName.startsWith("places/")) {
      
      setPhotoUrl(fallbackPhoto);
      return;
    }

    const fetchPhoto = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (!backendUrl) throw new Error("NEXT_PUBLIC_API_BASE_URL não definido.");

        
        
        
        
        
        
        
      const url = `${backendUrl}/tripPlaces/photo?photoName=${encodeURIComponent(placePhotoName ?? "")}`;

        const response = await fetch(url, { cache: "no-store", method: "GET" });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erro ao buscar a imagem: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        if (!data?.photoUri) throw new Error("photoUri ausente na resposta");
        setPhotoUrl(data.photoUri);
      } catch (err) {
        console.error("Erro no hook usePlacePhoto:", err);
        setError((err as Error).message || "Falha ao carregar a imagem.");
        setPhotoUrl(fallbackPhoto);
      }
    };

    // Chamando photos diretamente pelo front
    // Impossível, pois o CORS não permite.. maldito cors.
    // const fetchPhoto = async () => {
    //   try {
    //     const url = new URL(`https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=1200&key=${googleApiKey}`);

    //     const response = await fetch(url.toString(), {
    //       method: "GET",
    //       headers: {
    //         "Content-Type": "application/json",
    //         "X-Goog-Api-Key": googleApiKey
    //       },
    //     });
    //   } catch (error) {
    //       console.error("Erro no proxy de fotos:", error);
    //   }
    // }

    fetchPhoto();
  }, [fallbackPhoto, placePhotoName]);

  return { photoUrl, error };
}
