import { PageLayout } from "@/shared/components/layout/PageLayout";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import { Plus, DoorClosed } from "lucide-react";
import { useState } from "react";
import { RoomCreationDialog } from "./components/RoomCreationDialog";
import { RoomList } from "./components/RoomList";
import { useRooms } from "./hooks/useRooms";

export function Rooms() {
  const [upsertCard, setUpsertCard] = useState<boolean>(false);
  const [incluirInativos, setIncluirInativos] = useState<boolean>(false);

  const { rooms } = useRooms({ incluirInativos });

  return (
    <PageLayout
      pageTitle="Salas"
      Icon={DoorClosed}
      subtitle="Gerencie suas salas de locação"
      fullHeight
    >
      <div className="flex flex-col gap-3 flex-1 min-h-0">
        <div className="flex flex-row gap-5 shrink-0 w-full items-end justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="incluir-inativos"
              checked={incluirInativos}
              onCheckedChange={(checked) =>
                setIncluirInativos(checked === true)
              }
            />
            <Label htmlFor="incluir-inativos">Mostrar inativas</Label>
          </div>
          <Button onClick={() => setUpsertCard(true)} className="w-28">
            <Plus size={18} />
            <p>Sala</p>
          </Button>
        </div>

        <div className="flex flex-col gap-3 min-h-0 flex-1">
          <RoomList rooms={rooms} />
        </div>
      </div>

      {upsertCard && (
        <RoomCreationDialog open={upsertCard} setOpen={setUpsertCard} />
      )}
    </PageLayout>
  );
}
