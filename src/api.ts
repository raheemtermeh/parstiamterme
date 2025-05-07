import { Product } from "./types/product";

const API_URL = "http://server.linooxel.com:4433";

export interface CustomerInfo {
  name: string;
  phone: string;
  description: string;
  date: string;
}

export interface InvoiceData {
  customerInfo: CustomerInfo;
  products: Product[];
}

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function createProduct(data: Omit<Product, "id">): Promise<Product> {
  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
}

export async function submitInvoice(data: InvoiceData): Promise<void> {
  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to submit invoice");
}