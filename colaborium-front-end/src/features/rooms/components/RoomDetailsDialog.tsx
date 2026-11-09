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
}

export function RoomDetailsDialog({ room, open, onOpenChange }: DialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  if (!room) return null;

  function handleSubmit(data: FormData) {
    console.log(Object.fromEntries(data.entries()));

    setIsEditing(false);
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
          ? <RoomEditForm key={room.id} room={room} onSubmit={handleSubmit}/>
          : <RoomStatus key={room.id} room={room}/>}

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
