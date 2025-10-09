import Container from "@/components/container";
import TripComponentPage from "@/components/ui/tripComponent";
import { cookies } from 'next/headers'; 
import { permanentRedirect } from "next/navigation"; 

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

interface TripData { 
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    image?: string;
    places: Place[];
}

type Props = Promise<{ id: string }>

export default async function TripPlace({params}: {params: Props}) {
    const { id } : {id: string} = await params
    const apiToken = process.env.NEXT_PUBLIC_API_BASE_URL;

    const cookieStore = cookies();
    const authToken = (await cookieStore).get("authToken")?.value;

    if (!authToken) {
        permanentRedirect("/login?error=auth_required");
    }

    let currentTrip: TripData | null = null;
    let error: string | null = null;

    try {
        const response = await fetch(`${apiToken}/trips/${id}`, {
            cache: 'no-store',
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Erro ao buscar viagem: ${response.statusText}`);
        }

        const data: TripData = await response.json();
        currentTrip = data;
    } catch (err) {
        console.error("Erro ao buscar dados da viagem (Server Component):", err);
        error = (err as Error).message || "Ocorreu um erro desconhecido ao carregar a viagem.";
    }

    if (error || !currentTrip) {
        return (
            <Container>
                <p className="text-red-500 text-center mt-8">
                    Ops, parece que tivemos um problema ao carregar sua viagem:
                    <br />
                    {error || "Dados da viagem não encontrados."}
                </p>
            </Container>
        );
    }

    return (
        <Container>
            <TripComponentPage trip={currentTrip} />
        </Container>
    );
}