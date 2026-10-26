import { useState } from "react";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

export default function RoomCreationForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  }

  return (
    <div className="grid grid-cols-3 gap-4">

      <div className="col-span-2 grid grid-cols-2 gap-4">

        <div className="col-span-2 flex flex-col gap-2">
          <Label htmlFor="name">Nome da sala</Label>
          <Input id="name" placeholder="Nome da sala" />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="capacity">Capacidade</Label>
          <Input id="capacity" type="number" placeholder="Capacidade" />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="tables">Quantidade de mesas</Label>
          <Input id="tables" type="number" placeholder="Mesas" />
        </div>

      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="roomImage" className="p-10">Imagem da sala:</Label>

        <label
          htmlFor="roomImage"
          className="relative flex aspect-square w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-[#383838] bg-[#222222] transition-colors hover:border-[#aa3bff]"
        >
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Pré-visualização da sala"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="px-2 text-center text-sm text-gray-400">
              Clique para enviar uma imagem
            </span>
          )}
        </label>

        <Input
          id="roomImage"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

    </div>
  );
}