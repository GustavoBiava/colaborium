import { PageLayout } from "@/shared/components/layout/PageLayout";
import { Button } from "@/shared/components/ui/button";
import { Plus, FileText } from "lucide-react";
import { useState } from "react";
import { ContractList } from "./components/ContractList";
import { ContractCreationDialog } from "./components/ContractCreationDialog";
import type { Contract } from "./types";

export function Contracts() {
  const [upsertCard, setUpsertCard] = useState<boolean>(false);

    const contracts: Contract[] = [
    {
      id: 1,
      cliente_id: 1,
      sala_id: 1,
      data_inicio: new Date("10/10/2020"),
      data_fim: new Date("12/10/2021"),
      valor_base: 200,
      periodo: "2 dias",
      status: "A",
      ativo: true,
      data_cancelamento: new Date("6/10/2020"),
      motivo_cancelamento: null,
      observacao: "observacao teste",
    },
    {
      id: 2,
      cliente_id: 2,
      sala_id: 2,
      data_inicio: new Date("12/10/2020"),
      data_fim: new Date("5/10/2021"),
      valor_base: 500,
      periodo: "2 dias",
      status: "F",
      ativo: true,
      data_cancelamento: new Date("9/10/2020"),
      motivo_cancelamento: null,
      observacao: "observacao teste 2",
    },
    {
      id: 3,
      cliente_id: 3,
      sala_id: 3,
      data_inicio: new Date("12/11/2020"),
      data_fim: new Date("04/11/2021"),
      valor_base: 500,
      periodo: "12 dias",
      status: "C",
      ativo: true,
      data_cancelamento: new Date("12/11/2020"),
      motivo_cancelamento: "motivo teste 3",
      observacao: "observacao teste 3",
    },
    {
      id: 4,
      cliente_id: 4,
      sala_id: 4,
      data_inicio: new Date("2/11/2020"),
      data_fim: new Date("10/11/2021"),
      valor_base: 1000,
      periodo: "22 dias",
      status: "A",
      ativo: true,
      data_cancelamento: new Date("11/11/2020"),
      motivo_cancelamento: null,
      observacao: null,
    },
    {
      id: 5,
      cliente_id: 1,
      sala_id: 1,
      data_inicio: new Date("10/10/2020"),
      data_fim: new Date("12/10/2021"),
      valor_base: 200,
      periodo: "2 dias",
      status: "A",
      ativo: true,
      data_cancelamento: new Date("6/10/2020"),
      motivo_cancelamento: "motivo teste",
      observacao: "observacao teste",
    },
    {
      id: 6,
      cliente_id: 2,
      sala_id: 2,
      data_inicio: new Date("12/10/2020"),
      data_fim: new Date("5/10/2021"),
      valor_base: 500,
      periodo: "2 dias",
      status: "F",
      ativo: true,
      data_cancelamento: new Date("9/10/2020"),
      motivo_cancelamento: "motivo teste 2",
      observacao: "observacao teste 2",
    },
    {
      id: 7,
      cliente_id: 3,
      sala_id: 3,
      data_inicio: new Date("12/11/2020"),
      data_fim: new Date("04/11/2021"),
      valor_base: 500,
      periodo: "12 dias",
      status: "C",
      ativo: true,
      data_cancelamento: new Date("12/11/2020"),
      motivo_cancelamento: "motivo teste 3",
      observacao: "observacao teste 3",
    },
    {
      id: 8,
      cliente_id: 4,
      sala_id: 4,
      data_inicio: new Date("2/11/2020"),
      data_fim: new Date("10/11/2021"),
      valor_base: 1000,
      periodo: "22 dias",
      status: "A",
      ativo: true,
      data_cancelamento: new Date("11/11/2020"),
      motivo_cancelamento: "motivo teste 4",
      observacao: "observacao teste 4",
    }
  ];

  return (
    <PageLayout
      pageTitle="Contratos"
      Icon={FileText}
      subtitle="Gerencie seus contratos"
    >
      <div className="flex flex-col gap-5 ">
        <div className="flex flex-col gap-5 shrink-0 w-full items-end">
          <Button
            onClick={() => setUpsertCard(true)}
            className="rounded-md w-28"
          >
            <Plus size={18} />
            <p>Contrato</p>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto max-h-[700px]">
        <ContractList contracts={contracts}/>
      </div>

      {upsertCard && <ContractCreationDialog open={upsertCard} setOpen={setUpsertCard} />}
    </PageLayout>
  );
}
