import { PageLayout } from "@/shared/components/layout/PageLayout";
import { Button } from "@/shared/components/ui/button";
import { Plus, DoorClosed } from "lucide-react";
import { useState } from "react";
import { RoomCreationDialog } from "./components/RoomCreationDialog";
import { RoomList } from "./components/RoomList";
import { useRooms } from "./hooks/useRooms";

export function Rooms() {
  const [upsertCard, setUpsertCard] = useState<boolean>(false);

  const { rooms } = useRooms();

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
        <RoomList rooms={rooms} />
      </div>

      {upsertCard && (
        <RoomCreationDialog open={upsertCard} setOpen={setUpsertCard} />
      )}
    </PageLayout>
  );
}
