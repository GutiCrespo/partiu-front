"use client";
import { Button } from "../button";

interface DeleteCollaboratorModalProps {
  tripName: string;
  collaboratorName: string;
  onClose: () => void;
  onConfirm: () => void; // será conectado ao backend depois
}

export default function DeleteCollaboratorModal({
  tripName,
  collaboratorName,
  onClose,
  onConfirm,
}: DeleteCollaboratorModalProps) {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-3">Remover viajante</h2>

      <p className="text-sm text-gray-700 mb-6">
        Você deseja excluir <span className="font-semibold">{collaboratorName}</span> da viagem{" "}
        <span className="font-semibold">{tripName}</span>?
      </p>

      <div className="flex gap-3 justify-end">
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={onConfirm}>
          Excluir
        </Button>
      </div>
    </div>
  );
}
