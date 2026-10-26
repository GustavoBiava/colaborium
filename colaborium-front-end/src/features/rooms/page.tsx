import { DataTable } from "@/shared/components/DataTable";
import { PageLayout } from "@/shared/components/layout/PageLayout";
import { Button } from "@/shared/components/ui/button";
import { Plus, DoorClosed } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { RoomDialog } from "./components/RoomCreationDialog";
import { RoomCard } from "./components/RoomCard";

export function Rooms() {
  const [upsertCard, setUpsertCard] = useState<boolean>(false);
  const [params, setParams] = useSearchParams();

  const rooms = [
    {
      id: 1,
      name: "Room1",
      description: "descrição 1.",
      capacity: 5,
      occupied: "Ocupado",
      active: true,
      imageUrl: "awfasfawd",
    },
    {
      id: 2,
      name: "Room2",
      description: "descrição 2.",
      capacity: 5,
      occupied: "Disponivel",
      active: true,
      imageUrl: "awfasfawd",
    },
    {
      id: 3,
      name: "Room3",
      description: "descrição 3.",
      capacity: 5,
      occupied: "Ocupado",
      active: true,
      imageUrl: "awfasfawd",
    },
    {
      id: 4,
      name: "Room3",
      description: "descrição 3.",
      capacity: 5,
      occupied: "Ocupado",
      active: true,
      imageUrl: "awfasfawd",
    },
  ];

  useEffect(() => {
    console.log(upsertCard);
  }, [upsertCard]);

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
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>

      {upsertCard && <RoomDialog open={upsertCard} setOpen={setUpsertCard} />}
    </PageLayout>
  );
}
