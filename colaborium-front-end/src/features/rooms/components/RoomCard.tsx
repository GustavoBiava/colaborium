type Room = {
  id: number;
  name: string;
  description: string;
  capacity: number;
  occupied: string;
  active: boolean;
  imageUrl: string;
};

type RoomCardProps = { room: Room; };

export function RoomCard({ room }: RoomCardProps) {
  return (
    <div className="flex h-[120px] w-full items-center gap-2 rounded-xl border border-[#888888] bg-[transparent] p-1 text-black">

      <div className="bg-[#888888] rounded-lg object-cover h-full w-[220px]"/>

      <div className="flex flex-col justify-left gap-1 text-left">
        <h2 className="text-xl font-medium leading-tight">
          {room.name}
        </h2>

        <p className="text-sm text-gray-600">
          Capacidade: <span className="text-black">{room.capacity} pessoas</span>
        </p>

        <p className="text-sm text-gray-600">
          Ocupação: <span className="text-black">{room.occupied} </span>
        </p>

        <p className="text-sm text-gray-600">
          Número: <span className="text-black">{room.id}</span>
        </p>
      </div>

    </div>
  );
}
