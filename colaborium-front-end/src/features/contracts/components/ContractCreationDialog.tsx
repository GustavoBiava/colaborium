import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { type Dispatch, type SetStateAction } from "react";
import { cn } from "cn";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import ContractCreationForm from "./ContractCreationForm";
import { useCreateContract } from "../hooks/useCreateContract";
import type { ContractFormData } from "../schema/contractSchema";

interface DialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function ContractCreationDialog({ setOpen, open }: DialogProps) {
  const { createContract } = useCreateContract();

  async function handleSubmit(data: ContractFormData) {
    await createContract(data);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={cn(
          "rounded-xs min-w-[60%] max-h-[90%] overflow-hidden grid grid-rows-[auto_minmax(0,1fr)_auto]",
        )}
      >
        <DialogHeader>
          <DialogTitle>Cadastro de contrato</DialogTitle>
          <DialogDescription>Crie um novo contrato</DialogDescription>
        </DialogHeader>

        <ScrollArea className="min-h-0">
          <div className="pr-4 mt-2 ml-1 mb-4">
            <ContractCreationForm onSubmit={handleSubmit} />
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button type="submit" form="contract-creation-form" variant="outline">
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
