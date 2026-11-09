import { PageLayout } from "@/shared/components/layout/PageLayout";
import { Button } from "@/shared/components/ui/button";
import { Plus, DoorClosed } from "lucide-react";
import { useState } from "react";
import { RoomCreationDialog } from "./components/RoomCreationDialog";
import { RoomList } from "./components/RoomList";

export function Rooms() {
  const [upsertCard, setUpsertCard] = useState<boolean>(false);

  const rooms = [
    {
      id: 1,
      name: "Room1",
      description: "descrição 1",
      capacity: 10,
      value: 100,
      occupied: "Ocupado",
      location: "teste",
      qt_airconditioner: 0,
      qt_chair: 2,
      qt_table: 5,
      active: true,
      imageUrl: "awfasfawd",
    },
    {
      id: 2,
      name: "Room2",
      description: "descrição 2",
      capacity: 14,
      value: 122,
      occupied: "Disponivel",
      location: "teste",
      qt_airconditioner: 4,
      qt_chair: 3,
      qt_table: 1,
      active: true,
      imageUrl: "awfasfawd",
    },
    {
      id: 3,
      name: "Room3",
      description: "descrição 3",
      capacity: 1234,
      value: 345,
      occupied: "Ocupado",
      location: "teste",
      qt_airconditioner: 3,
      qt_chair: 5,
      qt_table: 7,
      active: true,
      imageUrl: "awfasfawd",
    },
    {
      id: 4,
      name: "Room4",
      description: "descrição 4",
      capacity: 5,
      value: 10,
      occupied: "Disponivel",
      location: "teste",
      qt_airconditioner: 12,
      qt_chair: 34,
      qt_table: 12,
      active: true,
      imageUrl: "awfasfawd",
    },
  ];

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
        <RoomList rooms={rooms}/>
      </div>

      {upsertCard && <RoomCreationDialog open={upsertCard} setOpen={setUpsertCard} />}
    </PageLayout>
  );
}
