'use client'

import Image from "next/image";
import { LoginForm } from "./form";
import Container from "@/components/container";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Login() {
  const search = useSearchParams();
  const next = search.get("next");

  const signupHref = next
    ? { pathname: "/signin", query: { next } }
    : { pathname: "/signin" };

  return (
    <Container>
      <div className="content w-full">
        <header className="">
          <h2>Acesse sua conta</h2>
          <p className="">Boas vindas novamente.</p>
        </header>

        <section className="flex flex-col mt-4 max-w-lg">
          <LoginForm />
        </section>

        <div className="goToLogin text- md:text-sm flex items-center flex-col max-w-lg mt-4">
          <p className="text-center">
            Novo por aqui?{" "}
            <Link href={signupHref} prefetch={false}>
              <span className="text-blue">Clique aqui</span>
            </Link>{" "}
            e crie sua conta.
          </p>
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
