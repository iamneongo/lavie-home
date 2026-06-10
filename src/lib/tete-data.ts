import branchesJson from "@/data/branches.json";
import roomsJson from "@/data/rooms.json";

export type Branch = {
  id: number;
  name: string;
  active: number;
  hotline: string;
  google_maps_link: string;
  classic_booking_enabled: number;
};

export type Room = {
  id: number;
  branch_id: number;
  card_name: string;
  branch_name: string;
  room_amenities: string[];
  price_from: number;
  price_to: number;
  full_day_price: number;
  main_image: string;
  is_classic: number;
  images: string[];
};

export const branches = branchesJson as Branch[];
export const rooms = roomsJson as Room[];

export const activeBranches = branches.filter((branch) => branch.active === 1);

export function money(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value);
}

export function roomsByBranch(branchId: number) {
  return rooms.filter((room) => room.branch_id === branchId && room.is_classic === 0);
}

export function compactPhone(phone: string) {
  return phone.replace(/[.\s]/g, "");
}
