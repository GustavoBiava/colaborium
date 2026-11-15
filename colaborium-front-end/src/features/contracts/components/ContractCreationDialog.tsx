import { Button } from "@/shared/components/ui/button";
// import RoomCreationForm from "./RoomEditForm";
import { type Dispatch, type SetStateAction } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import ContractCreationForm from "./ContractCreationForm";

interface DialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function ContractCreationDialog({ setOpen, open }: DialogProps) {

  function handleSubmit(data: FormData) {
    console.log(Object.fromEntries(data.entries()));

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[1000px] max-w-[40vw] h-[700px] max-h-[155vh]">
        <DialogHeader>
          <DialogTitle>Cadastro de contrato</DialogTitle>
          <DialogDescription>Crie um novo contrato</DialogDescription>
        </DialogHeader>

        <ContractCreationForm onSubmit={handleSubmit} />

        <DialogFooter>
          <Button type="submit" form="contract-creation-form">
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
