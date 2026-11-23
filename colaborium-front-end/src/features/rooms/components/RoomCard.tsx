import { cn } from "cn";
import type { RoomResponse } from "../types/RoomResponse";
import Placeholder from "@/assets/sync2.jpeg";

type RoomCardProps = { room: RoomResponse };

export function RoomCard({ room }: RoomCardProps) {
  return (
    <div className="flex h-20 w-full items-center gap-2 rounded-xs border border-b-gray-200 border-t-0 border-l-0 border-r-0 p-2 text-black min-w-0">
      <img
        src={Placeholder}
        alt="Pré-visualização da sala"
        onError={(e) => {
          e.currentTarget.src = Placeholder;
        }}
        className="bg-[#888888] rounded-xs h-full w-16 object-cover shrink-0"
      />

      <div className="flex w-full min-w-0">
        <div className="flex flex-col justify-start gap-1 text-left min-w-0">
          <h2 className="font-medium leading-tight truncate">{room.nome}</h2>

          <div className="flex gap-3">
            <p className="text-sm text-gray-600 truncate">
              Capacidade: <span className="text-black">{room.capacidade}</span>
            </p>

            <p className="text-sm text-gray-600 truncate">
              Número: <span className="text-black">{room.id}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-fit gap-2 ml-auto">
        <div className="h-8 w-fit">
          {room.ocupada && (
            <span
              className={cn(
                "flex justify-center ml-auto px-2.5 py-2 text-xs font-semibold rounded-xs bg-red-600/20 text-red-600",
              )}
            >
              OCUPADO
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
