import { Label } from "@/shared/components/ui/label";
import type { Room } from "../types";

type RoomFormProps = {
    room: Room;
};

export default function RoomStatus({ room }: RoomFormProps) {
    return (
        <div className="grid grid-cols-[2fr_2fr] gap-10">
            <div className="grid grid-cols-2 gap-4 content-start items-start">
                <div className="col-span-2 flex flex-col gap-2">
                    <Label htmlFor="nome" className="mt-2 mb-3.5">
                        Nome:
                    </Label>
                    <h2 className="text-black mt-2"> {room.name} </h2>
                </div>

                <div className="col-span-2 flex flex-col gap-2">
                    <Label htmlFor="localizacao" className="mt-2 mb-3.5">
                        Localização:
                    </Label>
                    <h2 className="text-black mt-2"> {room.location} </h2>
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="capacidade" className="mt-3 mb-3.5">
                        Capacidade:
                    </Label>
                    <h2 className="text-black mt-2"> {room.capacity} </h2>
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="valor" className="mt-3 mb-3.5">
                        Valor:
                    </Label>
                    <h2 className="text-black mt-2"> {room.value} </h2>
                </div>

                <div className="col-span-2 flex flex-col gap-2">
                    <Label htmlFor="descricao" className="mt-3 mb-3.5">
                        Descrição:
                    </Label>
                    <h2 className="text-black mt-2"> {room.description} </h2>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="roomImage" className="mt-2 mb-2">Imagem da sala:</Label>

                <label
                    htmlFor="roomImage"
                    className="relative flex aspect-[4/2] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#222222]"
                >
                    {room.imageUrl ? (
                        <img
                            src={room.imageUrl}
                            alt="Pré-visualização da sala"
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <span className="px-2 text-center text-sm text-gray-400">
                            Clique para enviar uma imagem
                        </span>
                    )}
                </label>

                <Label className="font-semibold mb-3 mt-4">
                    Lista de móveis disponíveis
                </Label>
                <div className="flex flex-col items-center justify-between gap-4 rounded-md border pl-1 gap-5 mb-6">
                    <label className="font-medium p-1">
                        Mesas: {room.qt_table}
                    </label>
                    <label className="font-medium p-1">
                        Cadeiras: {room.qt_chair}
                    </label>
                    <label className="font-medium p-1">
                        Ares-condicionados: {room.qt_airconditioner}
                    </label>
                </div>
            </div>
        </div>
    )
}