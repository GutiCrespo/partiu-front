'use client'

import Container from "@/components/container";
import { SignInForm } from "./form";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Signin() {
  const search = useSearchParams();
  const next = search.get("next");

  const loginHref = next
    ? { pathname: "/login", query: { next } } 
    : { pathname: "/login" };

  return (
    <Container>
      <div className="content w-full">
        <header className="">
          <h2>Crie sua Conta</h2>
          <p className="">Comece sua viagem por aqui.</p>
        </header>

        <section className="flex flex-col mt-4 max-w-lg">
          <SignInForm />
        </section>

        <div className="goToLogin text- md:text-sm flex items-center flex-col max-w-lg mt-4">
          <p className="text-center">
            Já possui cadastro?{" "}
            <Link href={loginHref} prefetch={false}>
              <span className="text-yellow">Clique aqui</span>
            </Link>{" "}
            e faça seu login.
          </p>
        </div>
      </div>

      <div className="md:w-[33%]">
        <Image
          width={360}
          height={325}
          src="/coctails.svg"
          alt="Globe Image"
          className="max-w-3xs"
        />
      </div>
    </Container>
  );
}
