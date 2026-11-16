import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { useState } from "react";
import type { Contract } from "../types";
import { ContractSearch } from "./ContractSearch";

const OBSERVATION_LIMIT = 500;

type ContractFormProps = {
    onSubmit: (data: FormData) => void;
    contract?: Contract;
};

type Client = {
  id: number;
  nome: string;
};

type Room = {
  id: number;
  nome: string;
};

export default function ContractCreationForm({ onSubmit, contract }: ContractFormProps) {
    const [observation, setObservation] = useState(contract?.observacao ?? "");
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [clientError, setClientError] = useState(false);
    const [roomError, setRoomError] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const now = new Date();

    const today = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0"),
    ].join("-");


    function handleStartDateChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        setStartDate(value);

        if (endDate && value && endDate < value) setEndDate("");
    }

    function handleEndDateChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;

        if (startDate && value && value < startDate) {
            setEndDate(startDate);
            return;
        }
        setEndDate(value);
    }


    function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        const hasClient = selectedClient !== null; 
        const hasRoom = selectedRoom !== null; 

        setClientError(!hasClient);
        setRoomError(!hasRoom);

        if (!hasClient || !hasRoom) {
            return;
        }

        const formData = new FormData(event.currentTarget);
        onSubmit(formData);
    }

    const clients = [
    {
      id: 1,
      nome: "cliente 1",
    },
    {
      id: 2,
      nome: "cliente 2",
    },
    {
      id: 3,
      nome: "cliente 3",
    },
    {
      id: 4,
      nome: "cliente 4",
    },
    {
      id: 1,
      nome: "cliente 1",
    },
    {
      id: 2,
      nome: "cliente 2",
    },
    {
      id: 3,
      nome: "cliente 3",
    },
    {
      id: 4,
      nome: "cliente 4",
    },
    {
      id: 1,
      nome: "cliente 1",
    },
    {
      id: 2,
      nome: "cliente 2",
    },
    {
      id: 3,
      nome: "cliente 3",
    },
    {
      id: 4,
      nome: "cliente 4",
    },
  ];

      const rooms = [
    {
      id: 1,
      nome: "sala 1",
    },
    {
      id: 2,
      nome: "sala 2",
    },
    {
      id: 3,
      nome: "sala 3",
    },
    {
      id: 4,
      nome: "sala 4",
    },
  ];

    return (
        <form onSubmit={handleSubmit} id="contract-creation-form">
            <div className="flex flex-col gap-2 content-start items-start w-full">
                <div className="gap-2 w-full">
                    <Label htmlFor="nome" className="mt-2">
                        Nome do Cliente:
                    </Label>
                    <ContractSearch
                        items={clients}
                        name="cliente_id"
                        getLabel={(client) => client.nome}
                        onSelect={(client) => { setSelectedClient(client); setClientError(false); }}
                        getValue={(client) => client.id}
                        placeholder="Pesquisar por Cliente..."
                    />
                </div>
                <div className="min-h-5">
                    {clientError ? (
                        <p className="text-sm text-red-500">
                            Selecione um cliente.
                        </p>
                    ) : selectedClient ? (
                        <p className="text-sm text-green-500">
                            Cliente selecionado: {selectedClient.nome}
                        </p>
                    ) : null}
                </div>

                <div className="gap-2 w-full">
                    <Label htmlFor="sala" className="mt-2">
                        Nome da Sala:
                    </Label>
                    <ContractSearch
                        items={rooms}
                        name="sala_id"
                        getLabel={(room) => room.nome}
                        onSelect={(room)   => { setSelectedRoom(room);     setRoomError(false);   }}
                        getValue={(room) => room.id}
                        placeholder="Pesquisar por Sala..."
                    />
                </div>
                <div className="min-h-5">
                    {roomError ? (
                        <p className="text-sm text-red-500">
                            Selecione uma sala.
                        </p>
                    ) : selectedRoom ? (
                        <p className="text-sm text-green-500">
                            Sala selecionada: {selectedRoom.nome}
                        </p>
                    ) : null}
                </div>

                <div className="flex w-full flex-row justify-between gap-4">
                    <div className="gap-2 w-full gap-2">
                        <Label htmlFor="valor_base" className="mt-3">
                            Valor:
                        </Label>
                        <Input
                            id="valor_base"
                            name="valor_base"
                            type="number"
                            placeholder="0"
                            required
                            min={0}
                            step="0.01"
                            className="bg-[transparent] text-black placeholder:text-gray-500 p-1"
                        />
                    </div>

                    <div className="gap-2 w-full gap-2">
                        <Label htmlFor="data_inicio" className="mt-3">
                            Data de início:
                        </Label>
                        <Input
                            id="data_inicio"
                            name="data_inicio"
                            type="date"
                            lang="pt-BR"
                            min={today}
                            max={endDate}
                            value={startDate}
                            onChange={handleStartDateChange}
                            required
                            className="bg-[transparent] text-black placeholder:text-gray-500 p-1"
                        />
                    </div>

                    <div className="gap-2 w-full gap-2">
                        <Label htmlFor="data_fim" className="mt-3">
                            Data de fim:
                        </Label>
                        <Input
                            id="data_fim"
                            name="data_fim"
                            type="date"
                            lang="pt-BR"
                            min={startDate || today}
                            value={endDate}
                            onChange={handleEndDateChange}
                            required
                            className="bg-[transparent] text-black placeholder:text-gray-500 p-1"
                        />
                    </div>
                </div>

                <div className="w-full flex flex-col gap-2">
                    <Label htmlFor="observacao" className="mt-3">
                        Observação:
                    </Label>
                    <Textarea
                        id="observacao"
                        name="observacao"
                        maxLength={OBSERVATION_LIMIT}
                        onChange={(event) => setObservation(event.target.value)}
                        className="mt-2 break-words resize-none w-full h-32" />
                    <span
                        className={`self-end text-xs ${observation.length >= OBSERVATION_LIMIT ? "text-red-500" : "text-muted-foreground"}`}
                    >
                        {observation.length} / {OBSERVATION_LIMIT}
                    </span>
                </div>
            </div>
        </form>
    )
}