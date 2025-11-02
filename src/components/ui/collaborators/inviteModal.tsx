"use client";
import { getCookie } from "@/helpers/cookies";
import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../button";


interface InviteModalProps {
  tripId: number;
  onClose: () => void;
}

export default function InviteModal({ tripId, onClose }: InviteModalProps) {
  const [loading, setLoading] = useState(false);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [role, setRole] = useState<"VIEWER" | "EDITOR">("VIEWER");

  async function handleGenerateLink() {
    setLoading(true);
    try {
      const token = getCookie("authToken"); 
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/trips/${tripId}/link/${role}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao gerar link.");
      setInviteUrl(data.inviteUrl);
    } catch (err) {
      console.error(err);
      alert("Erro ao gerar link de convite.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Convidar viajantes</h2>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setRole("VIEWER")}
          className={`px-3  text-black py-1 rounded-lg  border ${role === "VIEWER" ? " border-blue" : "bg-white  border-gray"}`}
        >
            Viewer
        </button>
        <button
          onClick={() => setRole("EDITOR")}
          className={`px-3  text-black py-1 rounded-lg border ${role === "EDITOR" ? " border-blue" : "bg-white  border-gray"}`}
        >
          Editor
        </button>
      </div>

      <button
        onClick={handleGenerateLink}
        disabled={loading}
        className="bg-dark-bg text-white px-4 py-2 rounded w-full hover:bg-hover-primary"
      >
        {loading ? "Gerando link..." : "Gerar link"}
      </button>

      {inviteUrl && (
        <div className="mt-4">
          <p className="text-sm mb-2">Link gerado:</p>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={inviteUrl}
              className="flex-1 border px-2 py-1 rounded text-sm"
            />
            <button
            onClick={() => {
                navigator.clipboard.writeText(inviteUrl);
                toast.success("Link copiado com sucesso!");
            }}
            className="text-blue hover:font-semibold text-sm"
            >
            Copiar
            </button>

          </div>
        </div>
      )}

      <button
        onClick={onClose}
        className="mt-6 w-full text-gray-600 hover:text-gray-800 text-sm"
      >
        Fechar
      </button>
    </div>
  );
}
