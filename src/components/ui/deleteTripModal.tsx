import { Button } from "./button";

interface DeleteTripModalProps {
  tripName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteTripModal({
  tripName,
  onClose,
  onConfirm,
}: DeleteTripModalProps) {
  return (
    <div className="p-4 max-w-sm">
      <h3 className="text-lg font-semibold mb-2">Excluir roteiro</h3>
      <p className="text-sm text-normal-gray mb-4">
        Tem certeza que deseja excluir o roteiro{" "}
        <span className="font-semibold">&quot;{tripName}&quot;</span>?<br />
        Essa ação não pode ser desfeita.
      </p>

      <div className="flex justify-end gap-2">
        <Button onClick={onClose}>
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          className="bg-red text-white hover:opacity-90"
        >
          Excluir roteiro
        </Button>
      </div>
    </div>
  );
}
