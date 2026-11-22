export type Room = {
  id: number;
  name: string;
  description: string;
  capacity: number;
  value: number;
  occupied: string;
  location: string;
  qt_airconditioner: number;
  qt_chair: number;
  qt_table: number;
  active: boolean;
  imageUrl: string;
};