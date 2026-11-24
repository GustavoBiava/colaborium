import { Button } from "@/shared/components/ui/button";
import { type Contract } from "../types";
import { ContractCancelAlertDialog } from "./ContractCancelAlertDialog";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { generateContract, getPdfErrorMessage } from "../services/generateContract";

interface DialogProps {
  contract: Contract | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContractDetailsDialog({ contract, open, onOpenChange }: DialogProps) {
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  if (!contract) return null;

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);
  }

  async function handleDownload() {
    if (!contract) return;
    setIsGenerating(true);
    setPdfError(null);

    try {
      await generateContract(contract.id);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      setPdfError(await getPdfErrorMessage(error));
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[55vw] max-h-[85vh] overflow-y-auto">
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

        {contract.observacao !== null ? (
          <>
            <div className="flex flex-col gap-1 w-full min-w-0 truncate">
              <h2>
                  Observações:
              </h2>
              <p className="w-full max-h-17 break-words whitespace-normal line-clamp-3">{contract.observacao}</p>
            </div>
            <hr className="mb-3"/>
          </>
        ) : null}

        {contract.motivo_cancelamento !== null && contract.status === "C" ? (
          <>
            <div className="flex flex-col gap-1 w-full min-w-0 truncate">
              <h2>
                  Motivo de cancelamento:
              </h2>
              <p className="w-full max-h-17 break-words whitespace-normal line-clamp-3">{contract.observacao}</p>
            </div>
            <hr className="mb-3"/>
          </>
        ) : null}

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
            <div className="h-8 mb-5">
            {contract.status === "F" ? (
                <div className="flex bg-[#59a123] w-30 h-6 mt-1 rounded-lg text-white justify-center ml-auto">
                    Finalizado
                </div>
            ) : contract.status === "C" ? (
              <>
                <div className="flex bg-[#9F3C3C] w-30 h-6 mt-1 rounded-lg text-white justify-center ml-auto">
                    Cancelado
                </div>
                <p className="text-end">dia {contract.data_cancelamento?.toLocaleDateString()}</p>
              </>
            ) : contract.status === "A" ? (
                <div className="flex bg-[#bd8c2a] w-30 h-6 mt-1 rounded-lg text-white justify-center ml-auto">
                    Ativo
                </div>
            ) : null}
            </div>
          </div>
        </div>

        {pdfError ? (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {pdfError}
          </p>
        ) : null}

        <DialogFooter>
          <Button key="download" type="button" variant="outline" className="mr-auto" disabled={isGenerating} onClick={handleDownload}>
            {isGenerating ? "Gerando PDF..." :  "Baixar PDF"}
          </Button>

          {contract.status === "A" ? (
            <Button key="cancel" type="button" onClick={() => setConfirmCancel(true)}>
              Cancelar contrato
            </Button>
          ) : null}

          <Button key="close" type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>

        </DialogFooter>
      </DialogContent>

      <ContractCancelAlertDialog
          open={confirmCancel}
          onOpenChange={setConfirmCancel}
          onConfirm={() => {
              setConfirmCancel(false);
          }}
      />
    </Dialog>
  );
}
