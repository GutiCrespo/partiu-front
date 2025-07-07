'use client';

import { Button } from "@/components/ui/button/index";
import { Input } from "@/components/ui/input";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import Autocomplete from "../../../../../components/ui/autocomplete-places";
import { useAuthContext } from "@/contexts/auth";
import { getCookie } from "@/helpers/cookies"; 

interface CreateTripPlaceFormProps {
    tripId: number; 
}

type CreateTripPlaceFormData = {
  tripPlaceName: string; 
  destination: string; 
  latitude?: number;
  longitude?: number;
  placeId?: string; 
};

export const CreateTripPlaceForm = ({ tripId }: CreateTripPlaceFormProps) => { 
    const { userInfo } = useAuthContext();
    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const { register, handleSubmit, control, setValue, watch } = useForm<CreateTripPlaceFormData>({
        defaultValues: {
            placeId: undefined,
            destination: '',
        },
    });

    const handleCoordinates = (address: string, lat: number, lng: number, placeID: string) => {
        setValue('destination', address);
        setValue('latitude', lat);
        setValue('longitude', lng);
        setValue('placeId', placeID);
        console.log("Dados recebidos do Autocomplete (CreateTripPlaceForm):", { address, lat, lng, placeID });
    };

    async function onSubmit(data: CreateTripPlaceFormData) {
        console.log("Dados do formulário (createTripPlace):", data);

        if (!data.placeId) {
            console.log("Place ID não encontrado.");
            return;
        }

        const token = getCookie("authToken");

        if (!token) {
            console.error("Token de autenticação não encontrado. Redirecionando para login.");
            router.push('/login');
            return;
        }

        try {
            console.log(`Chamando o método "Post" em: ${apiUrl}/tripPlaces`);
            const res = await fetch(`${apiUrl}/tripPlaces`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    placeId: data.placeId, 
                    tripId: tripId,       
                })
            });

            const result = await res.json();

            if (!res.ok) {
                console.error(`Erro na resposta da API: ${JSON.stringify(result)}`);
                console.error(`Status HTTP: ${res.status}`);
                console.log(`Owner ID (from context for debug): ${userInfo?.id}`);
                return;
            }

            console.log(`Destino registrado com sucesso:`, result);
            console.log(`Registrado na trip:`, tripId);
            router.push(`/trips/tripPlace/${tripId}`);
        } catch (error) {
            console.error(`Erro ao chamar o método "Post" em: ${apiUrl}/tripPlaces`, error); // Corrigido o log para tripPlaces
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center gap-6">
            <div className="input-data flex flex-col gap-2 w-full">
               
                {/* <Input
                    {...register("tripPlaceName", { required: true })}
                    labelText="Nome do Local (opcional)"
                    type="text"
                    name="tripPlaceName"
                    placeholder="Ex.: Parque Ibirapuera"
                /> */}
                <Autocomplete label="Local:" placeholder="Insira o local:" handleCoordinates={handleCoordinates} />
            </div>
            <Button variant="default" type="submit">Adicionar Local</Button>
        </form>
    );
};