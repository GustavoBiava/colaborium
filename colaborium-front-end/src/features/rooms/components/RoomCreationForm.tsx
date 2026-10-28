import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";

import { useState } from "react";

import { RoomFurnitureSelector } from "./RoomFurnitureSelector";

const DESCRIPTION_LIMIT = 500;

type RoomCreationFormProps = {
    onSubmit: (data: FormData) => void;
};

export default function RoomCreationForm({ onSubmit }: RoomCreationFormProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [description, setDescription] = useState("");

    function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        if (file) {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
            setImagePreview(URL.createObjectURL(file));
        }
    }

    function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        onSubmit(formData);
    }

    return (
        <form onSubmit={handleSubmit} id="room-creation-form" className="grid grid-cols-[2fr_2fr] gap-10">
            <div className="grid grid-cols-2 gap-4 content-start items-start">
                <div className="col-span-2 flex flex-col gap-2">
                    <Label htmlFor="nome" className="mt-2">
                        Nome:
                    </Label>
                    <Input
                        id="nome"
                        name="nome"
                        type="text"
                        placeholder="Nome da sala"
                        autoComplete="name"
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
                        type="text"
                        placeholder="Localização"
                        required
                        className="bg-[transparent] text-black placeholder:text-gray-600 p-1"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="capacidade" className="mt-3">
                        Capacidade:
                    </Label>
                    <Input
                        id="capacidade"
                        name="capacidade"
                        type="number"
                        placeholder="0"
                        required
                        min={0}
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
                        type="number"
                        placeholder="0"
                        required
                        min={0}
                        step="0.01"
                        className="bg-[transparent] text-black placeholder:text-gray-500 p-1"
                    />
                </div>

                <div className="col-span-2 flex flex-col gap-2">
                    <Label htmlFor="descricao" className="mt-3">
                        Descrição:
                    </Label>
                    <Textarea
                        id="descricao"
                        name="descricao"
                        required
                        maxLength={DESCRIPTION_LIMIT}
                        onChange={(event) => setDescription(event.target.value)}
                        className="mt-2 break-words resize-none w-full h-32" />
                    <span
                        className={`self-end text-xs ${description.length >= DESCRIPTION_LIMIT
                                ? "text-red-500"
                                : "text-muted-foreground"
                            }`}
                    >
                        {description.length} / {DESCRIPTION_LIMIT}
                    </span>
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
                    name="roomImage"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                />

                <RoomFurnitureSelector />
            </div>
        </form>
    )
}