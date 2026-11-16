import { type Contract } from "../types";

type ContractCardProps = { contract: Contract; };

export function ContractCard({ contract }: ContractCardProps) {
  return (
    <div className="flex h-[80px] w-full items-center gap-2 rounded-xl border border-[#888888] bg-[transparent] p-2 text-black min-w-0">

      <div className="flex w-[40%]">
        <div className="flex flex-col justify-start gap-1 text-left">
          <h2 className="font-medium leading-tight">
            Número do contrato: {contract.id}
          </h2>

          <div className="flex gap-3">
            <p className="max-w-80 text-sm text-gray-600 truncate">
              Cliente: <span className="text-black">{contract.cliente_id} </span>
            </p>

            <p className="max-w-80 text-sm text-gray-600 truncate">
              Sala: <span className="text-black">{contract.sala_id} </span>
            </p>
          </div>
        </div>
      </div>
      
      <div className=" flex flex-col w-full gap-2 ml-auto">

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

        <div className="flex gap-5 w-full justify-end">
          <p>
            Data de início: {contract.data_inicio.toLocaleDateString()}
          </p>
          <p>
            Data de fim: {contract.data_fim.toLocaleDateString()}
          </p>
        </div>
      </div>

    </div>
  );
}
