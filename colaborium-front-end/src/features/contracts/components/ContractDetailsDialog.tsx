import { Button } from "@/shared/components/ui/button";
import { type Contract } from "../types";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
// import RoomEditForm from "./RoomEditForm";
// import RoomStatus from "./RoomStatus";

interface DialogProps {
  contract: Contract | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContractDetailsDialog({ contract, open, onOpenChange }: DialogProps) {
  if (!contract) return null;

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[1000px] max-w-[55vw] h-[540px] max-h-[155vh]">
        <DialogHeader>
          <DialogTitle>
            Número do contrato: {contract.id}
          </DialogTitle>

          <DialogDescription>
            Informações do contrato
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-row gap-6 mt-3">
          <div className="flex flex-col gap-1 w-full min-w-0 truncate">
            <h2>
                Cliente:
            </h2>
            <hr className="mb-3 mr-5"/>
            <p>Nome: {contract.cliente_id}</p>
            <p>CPF/CNPJ: {contract.cliente_id}</p>
            <p>E-Mail: {contract.cliente_id}</p>
            <p>Cidade: {contract.cliente_id}</p>
          </div>

          <div className="flex flex-col gap-1 w-full min-w-0 truncate">
            <h2>
                Sala:
            </h2>
            <hr className="mb-3 mr-5"/>
            <p>Nome: {contract.sala_id}</p>
            <p>Valor: {contract.sala_id}</p>
            <p>Capacidade: {contract.sala_id} pessoas</p>
            <p>Localização: {contract.sala_id}</p>
          </div>
        </div>

        <hr className="mt-3"/>

        <div className="flex flex-row gap-10">
          <div>
            <p>
              Data de início: {contract.data_inicio.toLocaleDateString()}
            </p>
            <p>
              Data de fim: {contract.data_fim.toLocaleDateString()}
            </p>
          </div>

          <div className="ml-auto">
            <p>
              Status do contrato:
            </p>
            <div className="h-8">
            {contract.status === "F" ? (
                <div className="flex bg-[#59a123] w-30 h-6 mt-1 rounded-lg text-white justify-center ml-auto">
                    Finalizado
                </div>
            ) : contract.status === "C" ? (
                <div className="flex bg-[#9F3C3C] w-30 h-6 mt-1 rounded-lg text-white justify-center ml-auto">
                    Cancelado
                </div>
            ) : contract.status === "A" ? (
                <div className="flex bg-[#bd8c2a] w-30 h-6 mt-1 rounded-lg text-white justify-center ml-auto">
                    Ativo
                </div>
            ) : null}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button key="close" type="button" variant="outline" className="mr-auto" onClick={() => onOpenChange(false)}>
            Baixar PDF
          </Button>

          {contract.status === "A" ? (
            <Button key="close" type="button" onClick={() => onOpenChange(false)}>
              Cancelar contrato
            </Button>
          ) : null}

          <Button key="close" type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
