import { Product } from "../../types/product";

export interface Props {
  isOpen: boolean;
  onClose(): void;
  onAdded(p: Product): void;
}

export interface FormData {
  name: string;
  quantity: number;
  price: number;
  description: string;
}

export interface TempProduct extends FormData {
  id: number;
} 