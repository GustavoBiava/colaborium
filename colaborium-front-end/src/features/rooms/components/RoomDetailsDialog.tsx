import { Button } from "@/shared/components/ui/button";
import { type Room } from "../types";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import RoomEditForm from "./RoomEditForm";
import RoomStatus from "./RoomStatus";
import { useState } from "react";

interface DialogProps {
  room: Room | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

export function RoomDetailsDialog({ room, open, onOpenChange,  onSaved }: DialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  if (!room) return null;


  async function handleSubmit(data: FormData) {
    if (!room) return;

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

      const response = await fetch(
        `http://localhost:3333/salas/${room.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sala),
        }
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }
      
      onSaved();
      setIsEditing(false);
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao atualizar sala:", error);
      alert("Não foi possível atualizar a sala.");
    }
  }


  function handleCancel() {
    setIsEditing(false);
  }

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      setIsEditing(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[1000px] max-w-[95vw] h-[700px] max-h-[155vh]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar sala" : room.name}
          </DialogTitle>

          <DialogDescription>
            {isEditing
              ? "Altere as informações da sala."
              : "Informações da sala"}
          </DialogDescription>

        </DialogHeader>

        {isEditing
          ? <RoomEditForm key={room.id} room={room} onSubmit={handleSubmit} />
          : <RoomStatus key={room.id} room={room} />}

        <DialogFooter>
          {isEditing ? (
            <>
              <Button key="save" type="submit" form="room-edit-form">
                Salvar
              </Button>
              <Button key="cancel" type="button" variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
            </>
          ) : (
            <>
              <Button key="edit" type="button" onClick={() => setIsEditing(true)}>
                Editar
              </Button>
              <Button key="close" type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
