import { Button } from "@/shared/components/ui/button";
import { type ContractResponse } from "../types/ContractResponse";
import { ContractCancelAlertDialog } from "./ContractCancelAlertDialog";
import { useState } from "react";
import { useCustomers } from "@/features/customers/hooks/useCustomers";
import { useRooms } from "@/features/rooms/hooks/useRooms";
import { useChangeContractStatus } from "../hooks/useChangeContractStatus";
import { cn } from "cn";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Field, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { generateContract } from "../services/generateContract";

const CONTRACT_STATUS_LABEL: Record<ContractResponse["status"], string> = {
  F: "Finalizado",
  C: "Cancelado",
  A: "Ativo",
};

const CONTRACT_STATUS_BADGE_CLASS: Record<ContractResponse["status"], string> = {
  F: "bg-gray-100 text-gray-700",
  C: "bg-red-100 text-red-700",
  A: "bg-green-100 text-green-700",
};

interface DialogProps {
  contract: ContractResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContractDetailsDialog({
  contract,
  open,
  onOpenChange,
}: DialogProps) {
  const [confirmCancel, setConfirmCancel] = useState(false);
  const { customers } = useCustomers({ limit: "all" });
  const { rooms } = useRooms();
  const { changeContractStatus } = useChangeContractStatus();

  if (!contract) return null;

  const cliente = customers.find(
    (customer) => customer.id === contract.cliente_id,
  );
  const salasDetalhadas = contract.salas.map((sala) => {
    const room = rooms.find((r) => r.id === sala.sala_id);
    return {
      ...sala,
      capacidade: room?.capacidade,
      localizacao: room?.localizacao,
    };
  });

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);
  }

  async function handleCancelConfirm(motivo: string) {
    await changeContractStatus({
      id: contract!.id,
      status: "C",
      motivo_cancelamento: motivo,
    });
    setConfirmCancel(false);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[55vw] max-h-[85vh] overflow-hidden grid grid-rows-[auto_minmax(0,1fr)_auto]">
        <DialogHeader>
          <DialogTitle>Número do contrato: {contract.id}</DialogTitle>

          <DialogDescription>Informações do contrato</DialogDescription>
        </DialogHeader>

        <ScrollArea className="min-h-0">
          <div className="flex flex-col gap-4 pr-4 mt-2">
            <div className="flex flex-col gap-3 w-full min-w-0">
              <h2 className="font-semibold">Cliente:</h2>
              <hr />
              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel>Nome</FieldLabel>
                  <Input readOnly value={cliente?.nome_empresa ?? "-"} />
                </Field>
                <Field>
                  <FieldLabel>CPF/CNPJ</FieldLabel>
                  <Input readOnly value={cliente?.cpf_cnpj_empresa ?? "-"} />
                </Field>
                <Field>
                  <FieldLabel>E-mail</FieldLabel>
                  <Input readOnly value={cliente?.email ?? "-"} />
                </Field>
                <Field>
                  <FieldLabel>Cidade</FieldLabel>
                  <Input readOnly value={cliente?.cidade_empresa ?? "-"} />
                </Field>
              </div>
            </div>

            <hr />

            <div className="flex flex-col gap-3 w-full min-w-0">
              <h2 className="font-semibold">Salas:</h2>
              <div className="grid grid-cols-2 gap-3">
                {salasDetalhadas.map((sala) => (
                  <div
                    key={sala.sala_id}
                    className="flex flex-col gap-3 border rounded-sm p-3"
                  >
                    <Field>
                      <FieldLabel>Nome</FieldLabel>
                      <Input readOnly value={sala.nome} />
                    </Field>
                    <Field>
                      <FieldLabel>Capacidade</FieldLabel>
                      <Input
                        readOnly
                        value={`${sala.capacidade ?? "-"} pessoas`}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Localização</FieldLabel>
                      <Input readOnly value={sala.localizacao ?? "-"} />
                    </Field>
                  </div>
                ))}
              </div>
            </div>

            <hr />

            {contract.observacao ? (
              <>
                <Field>
                  <FieldLabel>Observações</FieldLabel>
                  <p className="w-full wrap-break-word whitespace-normal">
                    {contract.observacao}
                  </p>
                </Field>
                <hr />
              </>
            ) : null}

            {contract.motivo_cancelamento !== null &&
            contract.status === "C" ? (
              <>
                <Field>
                  <FieldLabel>Motivo de cancelamento</FieldLabel>
                  <p className="w-full wrap-break-word whitespace-normal">
                    {contract.motivo_cancelamento}
                  </p>
                </Field>
                <hr />
              </>
            ) : null}

            <div className="flex flex-row gap-10">
              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel>Data de início</FieldLabel>
                  <Input
                    readOnly
                    value={new Date(
                      contract.data_inicio,
                    ).toLocaleDateString()}
                  />
                </Field>
                <Field>
                  <FieldLabel>Data de fim</FieldLabel>
                  <Input
                    readOnly
                    value={new Date(contract.data_fim).toLocaleDateString()}
                  />
                </Field>
                <Field>
                  <FieldLabel>Valor</FieldLabel>
                  <Input readOnly value={contract.valor_base} />
                </Field>
              </div>

              <div className="ml-auto flex flex-col items-end gap-2">
                <FieldLabel>Status do contrato</FieldLabel>
                <span
                  className={cn(
                    "px-2.5 py-2 text-xs font-semibold rounded-xs",
                    CONTRACT_STATUS_BADGE_CLASS[contract.status],
                  )}
                >
                  {CONTRACT_STATUS_LABEL[contract.status]}
                </span>
                {contract.status === "C" && contract.data_cancelamento ? (
                  <p className="text-end text-sm">
                    {`dia ${new Date(contract.data_cancelamento).toLocaleDateString()}`}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button
            key="download"
            type="button"
            variant="outline"
            className="mr-auto"
            onClick={() => generateContract(contract)}
          >
            Baixar PDF
          </Button>

          {contract.status === "A" ? (
            <Button
              key="cancel"
              type="button"
              onClick={() => setConfirmCancel(true)}
            >
              Cancelar contrato
            </Button>
          ) : null}

          <Button
            key="close"
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>

      <ContractCancelAlertDialog
        open={confirmCancel}
        onOpenChange={setConfirmCancel}
        onConfirm={handleCancelConfirm}
      />
    </Dialog>
  );
}
