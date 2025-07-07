'use client'

import Image from "next/image";
import { LoginForm } from "./form";
import Container from "@/components/container";
import Link from "next/link";

export default function login() {
    return (
        // <main className="flex flex-col md:flex-row gap-6 items-center">
        <Container>
                <div className="content w-full">
                    <header className="">
                        <h2>Acesse sua conta</h2>
                        <p className="">Boas vindas novamente.</p>
                    </header>
                    <section className="flex flex-col mt-4 max-w-lg">
                        <LoginForm/>
                    </section>
                    <div className="goToLogin text- md:text-sm flex items-center flex-col max-w-lg mt-4">
                        <p className="text-center">Novo por aqui? <Link href={`/signin`}><span className="text-blue">Clique aqui</span></Link> e crie sua conta.</p>
                    </div>
                </div>
                <div className="md:w-[33%]">
                    <Image 
                        width={360} 
                        height={325} 
                        src="/fruits.svg" 
                        alt="Globe Image" 
                        className="max-w-3xs"
                    />
                </div>
        </Container>
    );
}