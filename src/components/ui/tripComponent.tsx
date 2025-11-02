'use client'

import Image from "next/image";
import { useEffect, useState } from "react"; 
import CardPlaceThumb from "./cardThumb";
import { usePlacePhoto } from "@/hooks/usePlacePhoto";
import Link from "next/link";
import TripInviter from "./collaborators/tripInviter";
import { Button } from "./button";
import Modal from "./collaborators/collaboratorModal";
import InviteModal from "./collaborators/inviteModal";

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
    photoName?: string[] | null;
    phone?: string | null;
    website?: string | null;
    isDestination: boolean;
    tripId: number;
}

export type CollaboratorRole = 'OWNER' | 'EDITOR' | 'VIEWER'

export interface UserSummary {
  id: number;
  name?: string | null;
  email: string;
  profilePicture?: string | null;
}

export interface Collaborator {
    id: number;
    role: CollaboratorRole
    userId: number;
    tripId: number
    user?: UserSummary
}

interface Trip {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    image?: string;
    places: Place[];
    collaborators?: Collaborator[]; 
}

export default function TripComponentPage({ trip }: { trip: Trip }) {

    console.log("========== DEBUG TRIP ==========");
    console.log("Trip Component Page");
    console.dir(trip, { depth: null, colors: true });
    console.log("================================\n");

    const [photoName, setPhotoName] = useState<string | null>(null);

    useEffect(() => {
        const firstPlaceWithPhoto = trip.places.find(
            place => place.photoName && place.photoName.length > 0
        );
        
        const firstPhoto = firstPlaceWithPhoto?.photoName?.[0] || null;
        
        setPhotoName(firstPhoto);
    }, [trip]); 

    const {photoUrl, error: photoError} = usePlacePhoto(photoName); 
    const [open, setOpen] = useState(false)

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return date.toLocaleDateString('pt-BR', options);
    };

    const tripName = trip.name;
    const tripBegin = formatDate(trip.startDate);
    const tripEnds = formatDate(trip.endDate);

    function handleCollaboratorSubmit(){

    }

    return (
        <div className="flex flex-col w-full md:flex-row">
            <div className="md:w-1/2">
                    <Image
                        src={photoUrl || "/mockup/place.png"}
                        alt="foto local"
                        width={1080}
                        height={1080}
                        className="rounded-[8px] object-cover"
                        priority
                    />
            </div>

            <div className="w-full md:w-1/2 mt-4 md:mt-0 md:ml-4">
                <header className="">
                    <h2 className="mb-2">{tripName}</h2>
                    <div className="flex items-center text-xs gap-2">
                        <Image
                            src="/calendar_icon.svg"
                            alt="Ícone calendário"
                            width={16}
                            height={16}
                            className="w-4 h-4"
                        />
                        <p className="text-normal-gray text-xs">{tripBegin}</p>
                        <p className="text-normal-gray text-xs">→</p>
                        <p className="text-normal-gray text-xs">{tripEnds}</p>
                    </div>
                </header>
                
                <section className="invite mt-8">
                    <p className="text-normal-gray">Viajantes:</p>
                    <div className="flex flex-col">
                        {trip.collaborators?.map((collaborator) => (
                            // <TripInviter key={trip.id} collaborator={collaborator}/>
                            <p key={collaborator.id} className="ml-2">
                            {collaborator.user?.name}
                        </p>
                        ))}

                        <div>
                            <button type="button" onClick={() => setOpen(true)} className="text-blue hover:font-bold">
                            Adicionar novos viajantes
                            </button>

                            {/* <Button variant="secondary">convidar viajante</Button> */}

                            <Modal isOpen={open} onClose={() => setOpen(false)}>
                                <InviteModal tripId={trip.id} onClose={() => setOpen(false)} />
                            </Modal>
                        </div>

                    </div>

                </section>
                <section className="places mt-8">
                    <p className="text-normal-gray">Lugares para visitar:</p>
                <div className="flex flex-wrap gap-4 mt-4">
                    {trip.places.length > 1 ? (
                        <div className="">
                            {trip.places.map((place) =>
                                !place.isDestination && (
                                    <CardPlaceThumb
                                        key={place.id}
                                        placeName={place.name}
                                        placeLocation={place.address}
                                        placeRating={place.rating ? place.rating.toFixed(1) : "N/A"}
                                        placePhotoName={place.photoName?.[0]}
                                    />
                                    
                                )
                            )}
                            <Link href={`/trips/createTripPlace/${trip.id}`}><p><span className="text-blue cursor-pointer hover:font-bold">Adicionar outro destino</span></p></Link>
                        </div>
                    ) : (
                        <div className="flex flex-col text-normal-gray">
                            <p>Nenhum lugar adicionado a este roteiro ainda.</p>
                            <Link href={`/trips/createTripPlace/${trip.id}`}><p>Vamos adicionar <span className="text-blue cursor-pointer hover:font-bold">seu primeiro destino?</span></p></Link>
                        </div>
                        
                    )}
                </div>
                </section>
            </div>
        </div>
    );
}