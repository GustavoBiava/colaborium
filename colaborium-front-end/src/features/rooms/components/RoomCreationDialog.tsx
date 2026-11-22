import { Button } from "@/shared/components/ui/button";
import RoomCreationForm from "./RoomEditForm";
import { useCreateRoom } from "../hooks/useCreateRoom";
import { type Dispatch, type SetStateAction } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

interface DialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function RoomCreationDialog({ setOpen, open }: DialogProps) {
  const { createRoom } = useCreateRoom();
  async function handleSubmit(data: FormData) {

    try {
      const furniture = JSON.parse(
        String(data.get("furniture") ?? "[]")
      ) as { id: string; quantity: number }[];

      const getQuantity = (id: string) =>
        furniture.find((item) => item.id === id)?.quantity ?? 0;

      const sala = {
        nome: String(data.get("nome") ?? "").trim(),
        descricao: String(data.get("descricao") ?? "").trim() || null,
        capacidade: Number(data.get("capacidade")),
        valor: Number(data.get("valor")),
        localizacao: String(data.get("localizacao") ?? "").trim() || null,
        qtd_arcondicionado: getQuantity("air-conditioners"),
        qtd_cadeira: getQuantity("chairs"),
        qtd_mesa: getQuantity("tables"),
      };
      await createRoom(sala);
      setOpen(false);

      setOpen(false);
    } catch (error) {
      console.error("Erro ao cadastrar sala:", error);
      alert("Não foi possível cadastrar a sala.");
    }
  }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[1000px] max-w-[95vw] h-[700px] max-h-[155vh]">
        <DialogHeader>
          <DialogTitle>Cadastro de sala</DialogTitle>
          <DialogDescription>Crie uma nova sala</DialogDescription>
        </DialogHeader>

        <RoomCreationForm onSubmit={handleSubmit} />

        <DialogFooter>
          <Button type="submit" form="room-edit-form">
            Criar
          </Button>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
