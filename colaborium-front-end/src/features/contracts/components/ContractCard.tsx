import { type ContractResponse } from "../types/ContractResponse";
import { useCustomers } from "@/features/customers/hooks/useCustomers";

type ContractCardProps = { contract: ContractResponse };

export function ContractCard({ contract }: ContractCardProps) {
  const { customers } = useCustomers({ limit: "all" });
  const cliente = customers.find(
    (customer) => customer.id === contract.cliente_id,
  );
  const salasNomes = contract.salas.map((sala) => sala.nome).join(", ");

  return (
    <div className="flex w-full items-center gap-2 rounded-xs border border-b-gray-200 border-t-0 border-l-0 border-r-0 p-3 text-black min-w-0">
      <div className="flex w-[40%]">
        <div className="flex flex-col justify-start gap-1 text-left">
          <h2 className="font-medium leading-tight">
            Número do contrato: {contract.id}
          </h2>

          <div className="flex flex-col gap-1 text-xs">
            <p className="max-w-80 text-gray-600 truncate">
              Cliente:{" "}
              <span className="text-black">
                {cliente?.nome_empresa ?? contract.cliente_id}{" "}
              </span>
            </p>

            <p className="max-w-80 text-gray-600 truncate">
              Sala: <span className="text-black">{salasNomes} </span>
            </p>
          </div>
        </div>
      </div>

      <div className=" flex flex-col w-full gap-2 ml-auto items-end justify-end">
        <div className="h-8">
          {contract.status === "F" ? (
            <div className="flex bg-[#59a123] justify-center w-30 h-6 ml-auto mb-auto mt-2 rounded-lg text-white">
              Finalizado
            </div>
          ) : contract.status === "C" ? (
            <div className="flex bg-[#9F3C3C] justify-center w-30 h-6 ml-auto mb-auto mt-2 rounded-lg text-white">
              Cancelado
            </div>
          ) : null}
        </div>

        <div className="flex text-xs gap-5 w-full justify-end items-end text-gray-600">
          <p>Início: {new Date(contract.data_inicio).toLocaleDateString()}</p>
          <p>Fim: {new Date(contract.data_fim).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
