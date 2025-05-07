import { TempProduct } from './types';
import { styles } from './styles';

interface ProductListProps {
    products: TempProduct[];
    onEdit: (product: TempProduct) => void;
    onDelete: (id: number) => void;
    onEditConfirm: (product: TempProduct) => void;
}

export const ProductList = ({ products, onEdit, onDelete, onEditConfirm }: ProductListProps) => {
    if (products.length === 0) return null;

    return (
        <div className={styles.productList.container}>
            <h4 className={styles.productList.title}>محصولات در انتظار ثبت:</h4>
            <div className="space-y-4">
                {products.map(product => (
                    <div key={product.id} className={styles.productList.item}>
                        <div className={styles.productList.itemContent}>
                            <h5 className="font-medium">{product.name}</h5>
                            <p className={styles.productList.itemText}>
                                تعداد: {product.quantity} | قیمت: {product.price}
                            </p>
                            <p className={styles.productList.itemText}>{product.description}</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => onEdit(product)} className={styles.button.edit}>
                                ویرایش
                            </button>
                            <button onClick={() => onDelete(product.id)} className={styles.button.danger}>
                                حذف
                            </button>
                            <button onClick={() => onEditConfirm(product)} className={styles.button.success}>
                                تأیید ویرایش
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}; 