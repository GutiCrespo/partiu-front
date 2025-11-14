/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Image from "next/image";
import { useEffect, useState } from "react"; 
import CardPlaceThumb from "./cardThumb";
import { usePlacePhoto } from "@/hooks/usePlacePhoto";
import Link from "next/link";
import { Button } from "./button";
import Modal from "./collaborators/collaboratorModal";
import InviteModal from "./collaborators/inviteModal";
import DeleteCollaboratorModal from "./collaborators/deleteCollaboratorModal";
import DeleteTripModal from "./deleteTripModal";
import { getCookie } from "@/helpers/cookies";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input"; 
import { useRouter } from "next/navigation";

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

    const router = useRouter();
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
    const [inSetting, setInSetting] = useState(false)

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [collabToDelete, setCollabToDelete] = useState<Collaborator | null>(null);

    // 👇 NOVO: modal de deletar roteiro
    const [deleteTripOpen, setDeleteTripOpen] = useState(false);

    const [places, setPlaces] = useState<Place[]>(trip.places);
    useEffect(() => { setPlaces(trip.places); }, [trip]);

    const [tripName, setTripName] = useState<string>(trip.name);
    useEffect(() => { setTripName(trip.name); }, [trip]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return date.toLocaleDateString('pt-BR', options);
    };

    async function handleSave(){

        const newName = (tripName || "").trim();
        if (!inSetting) return;
        if (!newName) {
            toast.error("O nome do roteiro não pode ficar vazio.");
            return;
        }

        try {
            const linkApi = process.env.NEXT_PUBLIC_API_BASE_URL;
            const token = getCookie("authToken");

            const res = await fetch(`${linkApi}/trips/${trip.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: newName }),
            });

            const data = await res.json().catch(() => ({} as Partial<Trip>));

            if (!res.ok) {
                throw new Error((data as any)?.error || "Falha ao atualizar o nome do roteiro.");
            }

            if (typeof data?.name === "string") setTripName(data.name);
            if (Array.isArray(data?.places)) setPlaces(data.places as Place[]);

            toast.success("Seu roteiro foi atualizado.");
            setInSetting(false);
        } catch (e) {
            console.error(e);
            toast.error(e instanceof Error ? e.message : "Erro ao atualizar o nome do roteiro.");
        }
    }

    function openDeleteModal(collaborator: Collaborator){
        setCollabToDelete(collaborator)
        setDeleteOpen(true)
    }

    function closeDeleteModal() {
        setDeleteOpen(false)
        setCollabToDelete(null)
    }

    async function handleConfirmDelete() {
        if (!collabToDelete) return;
        try {
            const linkApi = process.env.NEXT_PUBLIC_API_BASE_URL;
            const token = getCookie("authToken");
            const res = await fetch(
                `${linkApi}/trips/${trip.id}/collaborators/${collabToDelete.id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data?.error || "Falha ao remover colaborador.");
            }

            closeDeleteModal();
            toast.success("Colaborador removido.");
        } catch (e) {
            console.error(e);
            toast.error(e instanceof Error ? e.message : "Erro ao remover colaborador.");
        }
    }

    const tripBegin = formatDate(trip.startDate);
    const tripEnds  = formatDate(trip.endDate);

    async function handleDelete() {
        try {
            const linkApi = process.env.NEXT_PUBLIC_API_BASE_URL;
            const token = getCookie("authToken");

            if (!linkApi) {
                throw new Error("URL da API não configurada.");
            }

            const res = await fetch(`${linkApi}/trips/${trip.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json().catch(() => ({} as any));

            if (!res.ok) {
                throw new Error(data?.error || "Falha ao excluir o roteiro.");
            }

            toast.success("Roteiro excluído com sucesso.");
            setDeleteTripOpen(false); // fecha modal

            // Ajusta a rota de destino se tua listagem de viagens estiver em outro path
            router.push("/trips");
        } catch (e) {
            console.error(e);
            toast.error(
                e instanceof Error
                    ? e.message
                    : "Erro inesperado ao excluir o roteiro."
            );
        }
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
                    <div className="flex justify-between">
                        <div className="mb-2">
                            {inSetting ? (
                                <Input
                                    value={tripName}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTripName(e.target.value)}
                                    placeholder="Nome do roteiro"
                                    aria-label="Editar nome do roteiro"
                                    className="w-full max-w-[320px]"
                                />
                            ) : (
                                <h2 className="mb-2">{tripName}</h2>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <button onClick={() => setInSetting(!inSetting)} className="cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 text-normal-gray inline-block transform transition-transform duration-300 ease-in-out hover:rotate-90" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M10.825 22q-.675 0-1.162-.45t-.588-1.1L8.85 18.8q-.325-.125-.612-.3t-.563-.375l-1.55.65q-.625.275-1.25.05t-.975-.8l-1.175-2.05q-.35-.575-.2-1.225t.675-1.075l1.325-1Q4.5 12.5 4.5 12.337v-.675q0-.162.025-.337l-1.325-1Q2.675 9.9 2.525 9.25t.2-1.225L3.9 5.975q.35-.575.975-.8t1.25.05l1.55.65q.275-.2.575-.375t.6-.3l.225-1.65q.1-.65.588-1.1T10.825 2h2.35q.675 0 1.163.45t.587 1.1l.225 1.65q.325.125.613.3t.562.375l1.55-.65q.625-.275 1.25-.05t.975.8l1.175 2.05q.35.575.2 1.225t-.675 1.075l-1.325 1q.025.175.025.338v.674q0 .163-.05.338l1.325 1q.525.425.675 1.075t-.2 1.225l-1.2 2.05q-.35.575-.975.8t-1.25-.05l-1.5-.65q-.275.2-.575.375t-.6.3l-.225 1.65q-.1.65-.587 1.1t-1.163.45zm1.225-6.5q1.45 0 2.475-1.025T15.55 12t-1.025-2.475T12.05 8.5q-1.475 0-2.488 1.025T8.55 12t1.013 2.475T12.05 15.5"/></svg>
                            </button>  
                            <div className={`overflow-hidden transition-all duration-300 ease-out
                                ${inSetting ? "opacity-100 translate-y-0 scale-100 max-w-[200px]" : "opacity-0 -translate-y-1 scale-95 max-w-0 pointer-events-none"}`}
                            >
                                <Button onClick={handleSave}>Salvar</Button>
                                <a
                                    className="mx-2 cursor-pointer text-red"
                                    onClick={() => setDeleteTripOpen(true)}
                                >
                                    Excluir
                                </a>
                            </div>
                        </div>
                    </div>

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
                    <div className="flex flex-col ml-4 justify-center">
                        {trip.collaborators?.map((collaborator) => (
                        <div key={collaborator.id} className="flex items-center gap-2">
                            <div
                                className={`overflow-hidden transition-all duration-300 ease-out
                                ${inSetting ? "opacity-100 translate-y-0 scale-100 max-w-[200px]" : "opacity-0 -translate-y-1 scale-95 max-w-0 pointer-events-none"}`}
                            >
                                <button
                                    type="button"
                                    onClick={() => openDeleteModal(collaborator)}
                                    className="p-1 rounded hover:bg-gray-100"
                                    aria-label="Remover viajante"
                                    title="Remover viajante"
                                >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                    viewBox="0 0 24 24">
                                    <path fill="currentColor"
                                    d="m12 13.4l-2.9 2.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l2.9-2.9l-2.9-2.875q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l2.9 2.9l2.875-2.9q.275-.275.7-.275t.7.275q.3.3.3.713t-.3.687L13.375 12l2.9 2.9q.275.275.275.7t-.275.7q-.3.3-.712.3t-.688-.3z"/>
                                </svg>
                                </button>
                            </div>

                            <p>{collaborator.user?.name}</p>
                        </div>
                        ))}

                        <div>
                            <button type="button" onClick={() => setOpen(true)} className="text-blue hover:font-bold">
                            Adicionar novos viajantes
                            </button>

                            <Modal isOpen={open} onClose={() => setOpen(false)}>
                                <InviteModal tripId={trip.id} onClose={() => setOpen(false)} />
                            </Modal>

                            <Modal isOpen={deleteOpen} onClose={closeDeleteModal}>
                                <DeleteCollaboratorModal
                                    tripName={trip.name}
                                    collaboratorName={collabToDelete?.user?.name ?? "este usuário"}
                                    onClose={closeDeleteModal}
                                    onConfirm={handleConfirmDelete}
                                />
                            </Modal>
                        </div>
                    </div>
                </section>

                <section className="places mt-8">
                    <p className="text-normal-gray">Lugares para visitar:</p>
                    <div className="flex flex-wrap gap-4 mt-4">
                        {places.length > 1 ? (
                            <div className="">
                                {places.map((place) =>
                                    !place.isDestination && (
                                        <CardPlaceThumb
                                            key={place.id}
                                            tripId={trip.id}
                                            tripPlaceId={place.id}
                                            onDeleted={(deletedId) =>
                                                setPlaces(prev => prev.filter(p => p.id !== deletedId))
                                            }
                                            placeName={place.name}
                                            placeLocation={place.address}
                                            placeRating={place.rating ? place.rating.toFixed(1) : "N/A"}
                                            placePhotoName={place.photoName?.[0]}
                                        />
                                    )
                                )}
                                <Link href={`/trips/createTripPlace/${trip.id}`}>
                                    <p><span className="text-blue cursor-pointer hover:font-bold">Adicionar outro destino</span></p>
                                </Link>
                            </div>
                        ) : (
                            <div className="flex flex-col text-normal-gray">
                                <p>Nenhum lugar adicionado a este roteiro ainda.</p>
                                <Link href={`/trips/createTripPlace/${trip.id}`}>
                                    <p>Vamos adicionar <span className="text-blue cursor-pointer hover:font-bold">seu primeiro destino?</span></p>
                                </Link>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            <Modal isOpen={deleteTripOpen} onClose={() => setDeleteTripOpen(false)}>
                <DeleteTripModal
                    tripName={tripName}
                    onClose={() => setDeleteTripOpen(false)}
                    onConfirm={handleDelete}
                />
            </Modal>
        </div>
    );
}
