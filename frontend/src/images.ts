export interface ItemImage {
  file: string;
  label: string;
}

export const ITEM_IMAGES: ItemImage[] = [
  { file: "chair.svg", label: "Chair" },
  { file: "desk.svg", label: "Table or desk" },
  { file: "drafting-board.svg", label: "Drafting board" },
  { file: "book.svg", label: "Textbooks" },
  { file: "manual.svg", label: "Manual" },
  { file: "notes.svg", label: "Notes" },
  { file: "calculator.svg", label: "Calculator" },
  { file: "lamp.svg", label: "Lamp" },
  { file: "headphones.svg", label: "Headphones" },
  { file: "soldering-iron.svg", label: "Tools" },
  { file: "lab-coat.svg", label: "Lab coat" },
  { file: "goggles.svg", label: "Goggles" },
  { file: "placeholder.svg", label: "Something else" },
];

export function imageUrl(file: string): string {
  return "/images/" + (file || "placeholder.svg");
}
