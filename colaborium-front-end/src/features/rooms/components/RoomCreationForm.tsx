import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";

import { useState } from "react";

export default function RoomCreationForm() {
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    }


    return (
        <div className="grid grid-cols-[2fr_2fr] gap-10">
            <div className="grid grid-cols-2 gap-4 content-start items-start">
                <div className="col-span-2 flex flex-col gap-2">
                    <Label htmlFor="nome" className="mt-2">
                        Nome:
                    </Label>
                    <Input
                        id="nome"
                        name="nome"
                        type="nome"
                        placeholder="Nome da sala"
                        autoComplete="nome"
                        required
                        className="bg-[transparent] text-black placeholder:text-gray-600 p-1"
                    />
                </div>

                <div className="col-span-2 flex flex-col gap-2">
                    <Label htmlFor="localizacao" className="mt-2">
                        Localização:
                    </Label>
                    <Input
                        id="localizacao"
                        name="localizacao"
                        type="localizacao"
                        placeholder="Localização"
                        autoComplete="localizacao"
                        required
                        className="bg-[transparent] text-black placeholder:text-gray-600 p-1"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="capacidade" className="mt-2">
                        Capacidade:
                    </Label>
                    <Input
                        id="capacidade"
                        name="capacidade"
                        type="capacidade"
                        placeholder="0"
                        autoComplete="capacidade"
                        required
                        className="bg-[transparent] text-black placeholder:text-gray-500 p-1"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="valor" className="mt-3">
                        Valor:
                    </Label>
                    <Input
                        id="valor"
                        name="valor"
                        type="valor"
                        placeholder="0"
                        autoComplete="valor"
                        required
                        className="bg-[transparent] text-black placeholder:text-gray-500 p-1"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="roomImage" className="mt-2 mb-2">Imagem da sala:</Label>

                <label
                    htmlFor="roomImage"
                    className="relative flex aspect-[4/2] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#222222]"
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
    )
}