import Image from "next/image";
import Link from 'next/link'

import { Button } from "./button";
import { usePlacePhoto } from "@/hooks/usePlacePhoto";
import { useEffect, useState } from "react";

interface Place {
    id: number;
    placeId: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    type?: string | null;
    rating?: number | null;
    openingHours?: string | null;
    photoName?: string | string[] | null;
    phone?: string | null;
    website?: string | null;
    isDestination: boolean;
    tripId: number;
}

interface Trip {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    image?: string;
    places: Place[];
}


export default function CardTripThumb({ trip }: { trip: Trip }) {

    const [photoName, setPhotoName] = useState<string | null>(null);

    
    
    console.dir(trip, { depth: null, colors: true });
    
    useEffect(() => {
    const firstPlaceWithPhoto = trip.places.find(
        place => place.photoName && (Array.isArray(place.photoName) ? place.photoName.length > 0 : place.photoName.trim().length > 0)
    );

    let firstPhoto: string | null = null;
    const pn = firstPlaceWithPhoto?.photoName;

    if (Array.isArray(pn)) {
        firstPhoto = pn[0] ?? null;
    } else if (typeof pn === "string") {
        firstPhoto = pn || null;
    }

    
    setPhotoName(firstPhoto);
    }, [trip]);
        
    const {photoUrl, error: photoError} = usePlacePhoto(photoName); 
    
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return date.toLocaleDateString('pt-BR', options);
    };
    
    const tripName = trip.name;
    const tripBegin = formatDate(trip.startDate);
    const tripEnds = formatDate(trip.endDate);    
    
    
    return (
        <div className="bg-white border border-gray w-full flex p-2 gap-2 rounded-lg h-fit md:h-fit lg:h-fit overflow-hidden">
            <div className="relative aspect-square w-1/3 shrink-0 mr-2">
                    <Image
                        src={photoUrl}
                        alt="foto local"
                        fill
                        sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
                        priority
                        className="rounded-[8px] shadow-md hover:shadow-lg
                                hover:scale-[103%] hover:cursor-pointer transition duration-150 ease-in-out
                                object-cover"
                    />
            </div>
            <div className="flex flex-col justify-between w-full">
                <p className="font-black text-lg line-clamp-2">{tripName}</p>
                <div className="Rating flex text-xs flex-col">
                    <p className="text-black">data de início</p>
                    <p className="text-normal-gray text-xs">{tripBegin}</p>
                </div>
                <div className="Rating flex text-xs flex-col">
                    <p className="text-black">fim da viagem</p>
                    <p className="text-normal-gray text-xs">{tripEnds}</p>
                </div>
                <Link href={`/trips/${trip.id}`}>
                    <Button variant="secondary" className="w-full">ver roteiro</Button>
                </Link>
            </div>
        </div>
    );
}
