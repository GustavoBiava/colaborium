import { PageLayout } from "@/shared/components/layout/PageLayout";
import { Button } from "@/shared/components/ui/button";
import { Plus, DoorClosed } from "lucide-react";
import { useEffect, useState } from "react";
import type { Room } from "./types";
import { RoomCreationDialog } from "./components/RoomCreationDialog";
import { RoomList } from "./components/RoomList";

type ApiRoom = {
  id: number;
  nome: string;
  descricao: string | null;
  capacidade: number;
  valor: string | number;
  ocupada: string;
  localizacao: string | null;
  qtd_arcondicionado: number;
  qtd_cadeira: number;
  qtd_mesa: number;
  ativo: boolean;
};

export function Rooms() {
  const [upsertCard, setUpsertCard] = useState<boolean>(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    async function carregarSalas() {
      try {
        const response = await fetch("http://localhost:3333/salas");

        if (!response.ok) {
          throw new Error("Erro ao carregar salas");
        }

        const data: ApiRoom[] | { value: ApiRoom[]; Count: number } =
          await response.json();

        const salas = Array.isArray(data) ? data : data.value;

        const salasFormatadas: Room[] = salas.map((sala) => ({
          id: sala.id,
          name: sala.nome,
          description: sala.descricao ?? "",
          capacity: sala.capacidade,
          value: Number(sala.valor),
          occupied: sala.ocupada === "S" ? "Ocupado" : "Disponivel",
          location: sala.localizacao ?? "",
          qt_airconditioner: sala.qtd_arcondicionado,
          qt_chair: sala.qtd_cadeira,
          qt_table: sala.qtd_mesa,
          active: sala.ativo,
          imageUrl: "",
        }));

        setRooms(salasFormatadas);
      } catch (error) {
        console.error("Erro ao buscar salas:", error);
      }
    }

    carregarSalas();
  }, [reloadKey]);

  return (
    <PageLayout
      pageTitle="Salas"
      Icon={DoorClosed}
      subtitle="Gerencie suas salas de locação"
    >
      <div className="flex flex-col gap-5 ">
        <div className="flex flex-col gap-5 w-full items-end">
          <Button
            onClick={() => setUpsertCard(true)}
            className="rounded-md w-28"
          >
            <Plus size={18} />
            <p>Sala</p>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto">
        <RoomList rooms={rooms} onRoomUpdated={() => setReloadKey((prev) => prev + 1)}
        />
      </div>

      {upsertCard && (
        <RoomCreationDialog
          open={upsertCard}
          setOpen={setUpsertCard} 
          onCreated={() => setReloadKey((prev) => prev + 1)}
        />
      )}
    </PageLayout>
  );
}
