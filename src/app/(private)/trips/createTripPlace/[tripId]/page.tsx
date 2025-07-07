'use client'

import Container from "@/components/container";
import Image from "next/image";
import { CreateTripPlaceForm } from "./form"; 

interface Props {
    params: { tripId: string }; 
}

export default function TripPlacesPage({ params }: Props) { 

    const tripId = Number(params.tripId); 

    return (
        <Container>
            <div className="content w-full">
                <header className="">
                    <h2 className="mb-4">Adicionar Local ao Roteiro</h2> 
                </header>
                <section className="w-full mt-8">
                    <Image
                    src="/sitting_in_something.png"
                    alt="Menininha clicando com uma varinha em botão"
                    width={50}
                    height={50}
                    className="absolute top-1 right-6 z-40"
                    />

                    {!isNaN(tripId) ? (
                    <CreateTripPlaceForm tripId={tripId}/>
                    ) : (
                        <p className="text-red-500 text-center">ID da viagem inválido. Não foi possível adicionar um local.</p>
                    )}
                </section>
            </div>
        </Container>
    )
}