<<<<<<< HEAD
'use client' 
=======
'use client'
>>>>>>> b9203d2 (uploading in github to deploy in vercel)

import Container from "@/components/container";
import Image from "next/image";
import { CreateTripPlaceForm } from "./form"; 
<<<<<<< HEAD
// import { use } from 'react'; 
// import { useParams } from 'next/navigation';
=======
>>>>>>> b9203d2 (uploading in github to deploy in vercel)

interface Props {
    params: { tripId: string }; 
}

export default function TripPlacesPage({ params }: Props) { 
<<<<<<< HEAD
    
=======

>>>>>>> b9203d2 (uploading in github to deploy in vercel)
    const tripId = Number(params.tripId); 

    return (
        <Container>
            <div className="content w-full">
                <header className="">
                    <h2 className="text-bold text-xl md:text-3xlmb-4">Adicionar Local ao Roteiro</h2> 
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