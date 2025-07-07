'use client'

import Container from "@/components/container";
import Image from "next/image";
import { CreateTripForm } from "./form";

export default function TripsPage() {

    return (
        <Container>
            <div className="content w-full">
                <header className="">
                    <h2 className="mb-4">Meus Roteiros</h2>
                </header>
                <section className="w-full mt-8">
                    <Image
                        src="/sitting_in_something.png"
                        alt="Menininha clicando com uma varinha em botão"
                        width={50}
                        height={50}
                        className="absolute top-1 right-6 z-40"
                    />
                    <CreateTripForm/>
                </section>
            </div>
        </Container>
    )
}
