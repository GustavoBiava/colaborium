import { PageLayout } from "@/shared/components/layout/PageLayout";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import { Plus, FileText } from "lucide-react";
import { useState } from "react";
import { ContractList } from "./components/ContractList";
import { ContractCreationDialog } from "./components/ContractCreationDialog";
import { useContracts } from "./hooks/useContracts";

export function Contracts() {
  const [upsertCard, setUpsertCard] = useState<boolean>(false);
  const [mostrarTodos, setMostrarTodos] = useState<boolean>(false);
  const { contracts, isLoading, isError } = useContracts(
    mostrarTodos ? {} : { status: "A" },
  );

  return (
    <PageLayout
      pageTitle="Contratos"
      Icon={FileText}
      subtitle="Gerencie seus contratos"
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-row gap-5 shrink-0 w-full items-end justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="mostrar-todos"
              checked={mostrarTodos}
              onCheckedChange={(checked) => setMostrarTodos(checked === true)}
            />
            <Label htmlFor="mostrar-todos">Mostrar inativos</Label>
          </div>
          <Button onClick={() => setUpsertCard(true)} className="w-28">
            <Plus size={18} />
            <p>Contrato</p>
          </Button>
        </div>
        <div className="flex flex-col gap-3 overflow-y-auto max-h-[700px]">
          {isLoading ? (
            <p>Carregando contratos...</p>
          ) : isError ? (
            <p className="text-red-500">Erro ao carregar contratos.</p>
          ) : (
            <ContractList contracts={contracts} />
          )}
        </div>
      </div>
      {upsertCard && (
        <ContractCreationDialog open={upsertCard} setOpen={setUpsertCard} />
      )}
    </PageLayout>
  );
}
