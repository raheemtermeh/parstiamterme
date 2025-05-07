import { Product } from "../types/product";

interface Props { products: Product[]; }

const ProductList = ({ products }: Props) => (
    <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">محصولات سفارش داده‌شده</h2>
        {products.length === 0 ? (
            <p className="text-gray-500">محصولی یافت نشد.</p>
        ) : (
            <ul className="space-y-3">
                {products.map(p => (
                    <li key={p.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="font-medium">{p.name}</p>
                            <p className="text-sm text-gray-500">تعداد: {p.quantity}</p>
                        </div>
                        <span className="font-semibold">{p.price.toLocaleString()} تومان</span>
                    </li>
                ))}
            </ul>
        )}
    </div>
);

export default ProductList;