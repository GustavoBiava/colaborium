import { useState } from "react";
import { type Contract } from "../types";
import { ContractCard } from "./ContractCard";
import { ContractDetailsDialog } from "./ContractDetailsDialog";

export function ContractList({contracts}: {contracts: Contract[]}) {
    const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

    return(
        <>
            <div className="flex flex-col gap-3">
                {contracts.map((contract) => (
                    <button
                        key={contract.id}
                        type="button"
                        onClick={() => setSelectedContract(contract)}
                        className="w-full cursor-pointer rounded-lg text-left
                        transition-all duration-200 ease-in-out
                        hover:shadow-lg
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                    >
                        <ContractCard contract={contract} />
                    </button>
                ))}
            </div>

            <ContractDetailsDialog
                contract={selectedContract}
                open={selectedContract !== null}
                onOpenChange={(open) => {
                    if (!open) setSelectedContract(null);
                }}
            />
        </>
    )
}