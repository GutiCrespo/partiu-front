"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getCookie } from "@/helpers/cookies";

type AcceptResponse = {
  message: string;
  tripId: number;
  role: "VIEWER" | "EDITOR";
};
type ErrorResponse = { error: string };

function isAcceptResponse(x: unknown): x is AcceptResponse {
  if (typeof x !== "object" || x === null) return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.message === "string" &&
    typeof o.tripId === "number" &&
    (o.role === "VIEWER" || o.role === "EDITOR")
  );
}
function isErrorResponse(x: unknown): x is ErrorResponse {
  if (typeof x !== "object" || x === null) return false;
  return typeof (x as Record<string, unknown>).error === "string";
}

export default function InviteAcceptPage() {
  const router = useRouter();
  const params = useParams<{ token: string }>();
  const token = params?.token; 

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function acceptInvite() {
    if (!token) {
      setErrorMsg("Token ausente na URL.");
      setStatus("error");
      return;
    }

    const auth = typeof window !== "undefined" ? getCookie?.("authToken") : null;
    if (!auth) {
      router.replace(`/signin?next=${encodeURIComponent(`/trips/invite/${token}`)}`);
      return;
    }


    setStatus("loading");
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL
      const res = await fetch(`${base}/trips/links/${encodeURIComponent(token)}/accept`, {
        method: "POST",
        headers: { Authorization: `Bearer ${auth}` },
      });

      const data: unknown = await res.json();

      if (!res.ok) {
        setErrorMsg(isErrorResponse(data) ? data.error : "Falha ao aceitar convite.");
        setStatus("error");
        return;
      }
      if (!isAcceptResponse(data)) {
        setErrorMsg("Resposta inesperada do servidor.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setTimeout(() => router.push(`/trips/${data.tripId}`), 500);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Erro ao aceitar convite.");
      setStatus("error");
    }
  }

  useEffect(() => { void acceptInvite(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (status === "loading") {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-2">
        <p className="text-lg">Aceitando convite…</p>
        <p className="text-sm text-gray-500">Só um instante.</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <p className="text-lg font-semibold text-red-600">Não foi possível aceitar o convite</p>
        <p className="text-sm text-gray-600">{errorMsg}</p>
        <button
          onClick={() => void acceptInvite()}
          className="px-4 py-2 rounded bg-blue text-white hover:bg-blue/90"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-2">
      <p className="text-lg">Convite aceito com sucesso!</p>
      <p className="text-sm text-gray-500">Redirecionando…</p>
    </div>
  );
}
