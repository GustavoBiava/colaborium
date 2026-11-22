import { Button } from "@/shared/components/ui/button";
import { useUpdateRoom } from "../hooks/useUpdateRoom";
import { useDeleteRoom } from "../hooks/useDeleteRoom";
import { isAxiosError } from "axios";

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
import { DeleteAlertDialog } from "@/shared/components/DeleteAlertDialog";
import type { RoomResponse } from "../types/RoomResponse";

interface DialogProps {
  room: RoomResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RoomDetailsDialog({ room, open, onOpenChange }: DialogProps) {
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { updateRoom } = useUpdateRoom();
  const { deleteRoom } = useDeleteRoom();
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

      await updateRoom({ id: room.id, data: sala });

      setIsEditing(false);
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao atualizar sala:", error);
      alert("Não foi possível atualizar a sala.");
    }
  }

  async function handleDelete() {
    if (!room) return;

    try {
      await deleteRoom(room.id);

      setConfirmCancel(false);
      setIsEditing(false);
      onOpenChange(false);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 409) {
        alert(error.response.data.message);
      } else {
        alert("Não foi possível excluir a sala.");
      }
    }
  }

  function handleCancel() {
    setIsEditing(false);
    setConfirmCancel(false);
  }

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      setIsEditing(false);
      setConfirmCancel(false);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="w-[1000px] max-w-[95vw] h-[700px] max-h-[155vh]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar sala" : room.nome}</DialogTitle>

            <DialogDescription>
              {isEditing
                ? "Altere as informações da sala."
                : "Informações da sala"}
            </DialogDescription>
          </DialogHeader>

          {isEditing ? (
            <RoomEditForm key={room.id} room={room} onSubmit={handleSubmit} />
          ) : (
            <RoomStatus key={room.id} room={room} />
          )}

          <DialogFooter>
            {isEditing ? (
              <>
                <Button
                  key="delete"
                  type="button"
                  form="room-edit-form"
                  className="bg-[#9F3C3C] hover:bg-[#7F3030]"
                  onClick={() => setConfirmCancel(true)}
                >
                  Excluir
                </Button>
                <Button key="save" type="submit" form="room-edit-form">
                  Salvar
                </Button>
                <Button
                  key="cancel"
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                >
                  Cancelar
                </Button>
              </>
            ) : (
              <>
                <Button
                  key="edit"
                  type="button"
                  onClick={() => setIsEditing(true)}
                >
                  Editar
                </Button>
                <Button
                  key="close"
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Fechar
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <DeleteAlertDialog
        open={confirmCancel}
        title={"Excluir sala"}
        description={
          "Tem certeza de que deseja excluir esta sala? Essa ação não poderá ser desfeita."
        }
        onOpenChange={setConfirmCancel}
        onConfirm={handleDelete}
      />
    </>
  );
}
