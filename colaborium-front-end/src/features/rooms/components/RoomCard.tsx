import type { RoomResponse } from "../types/RoomResponse";
import Placeholder from "@/assets/sync2.jpeg";

type RoomCardProps = { room: RoomResponse };

export function RoomCard({ room }: RoomCardProps) {
  return (
    <div className="flex h-[120px] w-full items-center gap-2 rounded-xl border border-[#888888] bg-[transparent] p-1 text-black">
      <img
        src={Placeholder}
        alt="Pré-visualização da sala"
        onError={(e) => {
          e.currentTarget.src = Placeholder;
        }}
        className="bg-[#888888] rounded-lg h-full w-[220px] object-cover"
      />

      <div className="flex flex-col justify-left gap-1 text-left">
        <h2 className="text-xl font-medium leading-tight">{room.nome}</h2>

        <p className="text-sm text-gray-600">
          Capacidade:{" "}
          <span className="text-black">{room.capacidade} pessoas</span>
        </p>

        <p className="text-sm text-gray-600">
          Ocupação: <span className="text-black">{room.ocupada ? "Ocupado" : "Livre"}</span>
        </p>

        <p className="text-sm text-gray-600">
          Número: <span className="text-black">{room.id}</span>
        </p>
      </div>

      {room.ocupada && (
        <div className="flex bg-[#9F3C3C] justify-center w-30 h-6 ml-auto mb-auto m-2 rounded-lg text-white">
          OCUPADO
        </div>
      )}
    </div>
  );
}
