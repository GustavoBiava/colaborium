import { Button } from "@/shared/components/ui/button";
import RoomCreationForm from "./RoomCreationForm";

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
  setOpen: (value: React.SetStateAction<boolean>) => void;
}

export function RoomDialog({ setOpen, open }: DialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[1000px] max-w-[95vw] h-[700px] max-h-[75vw]">
        <DialogHeader>
          <DialogTitle>Cadastro de sala</DialogTitle>
          <DialogDescription>Crie uma nova sala</DialogDescription>
        </DialogHeader>

        <RoomCreationForm />

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
      <p>asdmklasdksakdj</p>
    </Dialog>
  );
}
