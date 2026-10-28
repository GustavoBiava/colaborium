import { Button } from "@/shared/components/ui/button";
import RoomCreationForm from "./RoomCreationForm";
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

export function RoomDialog({ setOpen, open }: DialogProps) {

  function handleSubmit(data: FormData) {
    console.log(Object.fromEntries(data.entries()));

    setOpen(false);
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
          <Button type="submit" form="room-creation-form">
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
