import type { RoomResponse } from "../types/RoomResponse";

type RoomCardProps = { room: RoomResponse };

export function RoomCard({ room }: RoomCardProps) {
  return (
    <div className="flex h-[120px] w-full items-center gap-2 rounded-xl border border-[#888888] bg-[transparent] p-1 text-black">
      <img
        src={room.imageUrl}
        alt="Pré-visualização da sala"
        className="bg-[#888888] rounded-lg h-full w-[220px]"
      />

      <div className="flex flex-col justify-left gap-1 text-left">
        <h2 className="text-xl font-medium leading-tight">{room.nome}</h2>

        <p className="text-sm text-gray-600">
          Capacidade:{" "}
          <span className="text-black">{room.capacidade} pessoas</span>
        </p>

        <p className="text-sm text-gray-600">
          Ocupação: <span className="text-black">{room.ocupada} </span>
        </p>

        <p className="text-sm text-gray-600">
          Número: <span className="text-black">{room.id}</span>
        </p>
      </div>
    </div>
  );
}
