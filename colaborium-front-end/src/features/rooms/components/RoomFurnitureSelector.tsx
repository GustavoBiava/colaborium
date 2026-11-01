import { useState } from "react";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import type { Room } from "../types";

type FurnitureItem = {
    id: string;
    name: string;
};

type FurnitureSelection = {
  selected: boolean;
  quantity: number;
};

const furnitureItems: FurnitureItem[] = [
  { id: "tables", name: "Mesas" },
  { id: "chairs", name: "Cadeiras" },
  { id: "air-conditioners", name: "Ares-condicionados" },
];

interface RoomFurnitureSelectorProps {
    room?: Room;
}

export function RoomFurnitureSelector({room}: RoomFurnitureSelectorProps) {
  const [selections, setSelections] = useState<
    Record<string, FurnitureSelection>
  >({
    tables: { selected: (room?.qt_table ?? 0) > 0, quantity: room?.qt_table ?? 0 },
    chairs: { selected: (room?.qt_chair ?? 0) > 0, quantity: room?.qt_chair ?? 0 },
    "air-conditioners": { selected: (room?.qt_airconditioner ?? 0) > 0, quantity: room?.qt_airconditioner ?? 0 }
  });

  function handleCheckboxChange(id: string, checked: boolean) {
    setSelections((previous) => ({
      ...previous,
      [id]: {
        ...previous[id],
        selected: checked,
        quantity: checked ? Math.max(1, previous[id].quantity) : 0,
      },
    }));
  }

  function handleQuantityChange(id: string, value: string) {
    const quantity = value === "" ? 0 : Number(value);

    if (!Number.isInteger(quantity) || quantity < 0) {
      return;
    }

    setSelections((previous) => ({
      ...previous,
      [id]: {
        ...previous[id],
        quantity,
        selected: quantity > 0,
      },
    }));
  }

  return (
    <div className="mt-4">

        <input
            type="hidden"
            name="furniture"
            value={JSON.stringify(
                Object.entries(selections)
                .filter(([, selection]) => selection.selected)
                .map(([id, selection]) => ({
                    id,
                    quantity: selection.quantity,
                }))
            )}
        />

      <Label className="font-semibold mb-3">
        Lista de móveis disponíveis
      </Label>

      <div className="space-y-2">
        {furnitureItems.map((item) => {
          const selection = selections[item.id];

          return (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 rounded-md border pl-1"
            >
              <label
                htmlFor={`checkbox-${item.id}`}
                className="flex min-w-0 flex-1 cursor-pointer items-center gap-2"
              >
                <Checkbox
                  id={`checkbox-${item.id}`}
                  checked={selection.selected}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(item.id, checked === true)
                  }
                />

                <span className="truncate font-medium">
                  {item.name}
                </span>
              </label>

              <Input
                type="number"
                min={0}
                step={1}
                value={selection.quantity}
                onChange={(event) =>
                  handleQuantityChange(item.id, event.target.value)
                }
                disabled={!selection.selected}
                aria-label={`Quantidade de ${item.name}`}
                className="w-20"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}