import { useState } from "react";
import type { Room } from "../types";
import { RoomCard } from "./RoomCard";
import { RoomDetailsDialog } from "./RoomDetailsDialog";

export function RoomList({rooms}: {rooms: Room[]}) {
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    return(
        <>
            <div className="flex flex-col gap-3 overflow-y-auto">
                {rooms.map((room) => (
                    <button
                        key={room.id}
                        type="button"
                        onClick={() => setSelectedRoom(room)}
                        className="w-full cursor-pointer rounded-lg text-left
                        transition-all duration-200 ease-in-out
                        hover:shadow-lg
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                    >
                        <RoomCard room={room} />
                    </button>
                ))}
            </div>

            <RoomDetailsDialog
                room={selectedRoom}
                open={selectedRoom !== null}
                onOpenChange={(open) => {
                    if (!open) setSelectedRoom(null);
                }}
            />
        </>
    )
}