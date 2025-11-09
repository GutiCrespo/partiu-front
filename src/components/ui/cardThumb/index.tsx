import { usePlacePhoto } from "@/hooks/usePlacePhoto";
import Image from "next/image";
import { getCookie } from "@/helpers/cookies";  
import { toast } from "react-toastify";         

interface CardPlaceProps {
  tripId: number;   
  tripPlaceId: number; 
  placeName: string;
  placeLocation: string;
  placeRating: string;
  placePhotoName?: string;
  onDeleted?: (tripPlaceId: number) => void;
}

export default function CardPlaceThumb({
  tripId,
  tripPlaceId,
  placeName,
  placeLocation,
  placeRating,
  placePhotoName,
  onDeleted,
}: CardPlaceProps) {
  const { photoUrl } = usePlacePhoto(placePhotoName);

  async function handleDeletePlace() {
    try {
      const linkApi = process.env.NEXT_PUBLIC_API_BASE_URL;
      const token = getCookie("authToken");

      const res = await fetch(`${linkApi}/trips/${tripId}/places/${tripPlaceId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Falha ao remover lugar.");
      }

      toast.success("Lugar removido.");
      onDeleted?.(tripPlaceId);
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Erro ao remover lugar.");
    }
  }

  return (
    <div className="bg-white w-fit flex flex-col p-4 gap-2 rounded-lg">
      <div className="w-full flex justify-between">
        <div className="relative w-[200px] h-[120px]">
          <Image
            fill
            sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
            alt="foto local"
            src={photoUrl || "/mockup/place.png"}
            className="rounded-lg shadow-md hover:shadow-lg hover:scale-[103%] hover:cursor-pointer transition duration-150 ease-in-out"
          />
        </div>

        <button
          type="button"
          onClick={handleDeletePlace}
          className="p-1 rounded hover:bg-gray-100"
          aria-label="Remover lugar"
          title="Remover lugar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
               viewBox="0 0 24 24">
            <path fill="currentColor"
              d="m12 13.4l-2.9 2.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l2.9-2.9l-2.9-2.875q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l2.9 2.9l2.875-2.9q.275-.275.7-.275t.7.275q.3.3.3.713t-.3.687L13.375 12l2.9 2.9q.275.275.275.7t-.275.7q-.3.3-.712.3t-.688-.3z"/>
          </svg>
        </button>
      </div>

      <div className="flex justify-between">
        <p className="font-bold">{placeName}</p>
        <div className="Rating flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
            <path fill="#866969" d="m12 1[...]5-.15z"/>
          </svg>
          <p className="text-normal-gray">{placeRating}</p>
        </div>
      </div>

      <div className="Location flex">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
          <rect width="24" height="24" fill="none"/>
          <path fill="#866969" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7m0 9.5a2.5 2.5 0 0 1 0-5a2.5 2.5 0 0 1 0 5"/>
        </svg>
        <p className="small text-normal-gray">{placeLocation}</p>
      </div>
    </div>
  );
}
