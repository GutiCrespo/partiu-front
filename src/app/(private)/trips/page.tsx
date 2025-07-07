'use client'

import Container from "@/components/container";
import { Button } from "@/components/ui/button/index";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react"; 
import { getCookie } from "@/helpers/cookies";
import CardTripThumb from "@/components/ui/cardTripThumb";

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

interface Trip {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    image?: string;
    places: Place[];
}

export default function TripsPage() {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL; 
    const [tripData, setTripData] = useState<Trip[] | null>(null);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState<string | null>(null); 
    const [showAllTrips, setShowAllTrips] = useState(false);

    useEffect(() => {
        const fetchTripData = async () => {
            const authToken = getCookie("authToken");

            if (!authToken) {
                setError("Token de autenticação não encontrado. Faça login novamente.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${apiUrl}/trips/myTrips`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${authToken}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Erro ao buscar viagens.");
                }

                const data: Trip[] = await response.json();
                setTripData(data);
                console.log("Dados recebidos:", data);
            } catch (err) {
                console.error("Erro ao buscar dados:", err);
                setError((err as Error).message || "Ocorreu um erro ao carregar as viagens.");
            } finally {
                setLoading(false);
            }
        };

        fetchTripData();
    }, [apiUrl]);

    function toggleCards() {
        setShowAllTrips(!showAllTrips);
    }

    if (loading) {
        return (
            <Container>
                <p>Carregando seus roteiros...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <p className="text-red-500">Ops, tivemos um erro: {error}</p> 
            </Container>
        );
    }

    if (!tripData || tripData.length === 0) {
        return (
            <Container>
                <div className="content w-full">
                    <header className="">
                        <h2 className="mb-4">Meus Roteiros</h2>
                        <Image
                            src="/trips-magic--wand.png"
                            alt="Menininha clicando com uma varinha em botão"
                            width={85}
                            height={85}
                            className="absolute top-0 md:top-1.5 right-6 z-40"
                        />
                        <Button variant="secondary" className="w-full">
                            <Link href={'/trips/createTrip'}>Começar nova viagem</Link>
                        </Button>
                    </header>
                    <section className="w-full mt-4">
                        <p>Você ainda não tem nenhuma viagem planejada. Que tal começar uma nova aventura?</p>
                    </section>
                </div>
            </Container>
        );
    }

    const renderedCards = tripData.map((trip) => (
        <CardTripThumb key={trip.id} trip={trip} />
    ));

    return (
        <Container>
            <div className="content w-full">
                <header className="">
                    <h2 className="mb-4">Meus Roteiros</h2>
                    <Image
                        src="/trips-magic--wand.png"
                        alt="Menininha clicando com uma varinha em botão"
                        width={85}
                        height={85}
                        className="absolute top-0 md:top-1.5 right-6 z-40"
                    />
                    <Button variant="secondary" className="w-full">
                        <Link href={'/trips/createTrip'}>Começar nova viagem</Link>
                    </Button>
                </header>
                <section className="w-full">
                    <div className="sections mt-4">
                        <div className="cards flex gap-2 flex-col w-full md:grid md:grid-cols-2 ">
                            {showAllTrips ? renderedCards : renderedCards.slice(0, 2)}
                        </div>
                        {renderedCards.length > 2 && (
                            <div className="w-full flex mt-2 justify-center md:gap-4 md:items-center hover:underline hover:cursor-pointer" onClick={toggleCards}>
                                <Button onClick={toggleCards}>
                                    {showAllTrips ? 'ver menos' : 'ver mais'}
                                </Button>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </Container>
    );
}