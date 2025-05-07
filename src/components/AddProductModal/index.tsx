import { useForm } from "react-hook-form";
import { createProduct } from "../../api";
import { useState } from "react";
import { Props, FormData, TempProduct } from "./types";
import { styles } from "./styles";
import { FormField } from "./FormField";
import { ProductList } from "./ProductList";
import { ConfirmDialog } from "./ConfirmDialog";

const AddProductModal = ({ isOpen, onClose, onAdded }: Props) => {
    const [tempProducts, setTempProducts] = useState<TempProduct[]>([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<TempProduct | null>(null);
    const [confirmType, setConfirmType] = useState<'add' | 'edit'>('add');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        getValues,
        formState: { errors }
    } = useForm<FormData>();

    const validateForm = (data: FormData): boolean => {
        const validations = [
            { condition: !data.name?.trim(), message: 'لطفا نام محصول را وارد کنید' },
            { condition: !data.quantity || data.quantity <= 0, message: 'لطفا تعداد معتبر وارد کنید' },
            { condition: !data.price || data.price <= 0, message: 'لطفا قیمت معتبر وارد کنید' },
            { condition: !data.description?.trim(), message: 'لطفا توضیحات محصول را وارد کنید' },
        ];

        for (const validation of validations) {
            if (validation.condition) {
                alert(validation.message);
                return false;
            }
        }
        return true;
    };

    const handleFormSubmit = async (data: FormData) => {
        if (!validateForm(data)) return;

        try {
            const newTempProduct: TempProduct = {
                ...data,
                id: Date.now()
            };
            setTempProducts([...tempProducts, newTempProduct]);
            reset();
            setConfirmType('add');
            setShowConfirm(true);
        } catch (e) {
            console.error(e);
        }
    };

    const handleConfirm = async () => {
        try {
            setIsSubmitting(true);

            if (confirmType === 'add') {
                await Promise.all(tempProducts.map(async (product) => {
                    const newProd = await createProduct({
                        name: product.name,
                        quantity: Number(product.quantity),
                        price: Number(product.price),
                        description: product.description
                    });
                    onAdded(newProd);
                }));
                setTempProducts([]);
                alert('محصولات با موفقیت ثبت شدند');
            } else if (confirmType === 'edit' && editingProduct) {
                const currentFormData = getValues();
                if (!validateForm(currentFormData)) {
                    setShowConfirm(false);
                    return;
                }

                const updatedProduct = {
                    name: currentFormData.name,
                    quantity: Number(currentFormData.quantity),
                    price: Number(currentFormData.price),
                    description: currentFormData.description
                };

                const newProd = await createProduct(updatedProduct);
                onAdded(newProd);
                alert('محصول با موفقیت ویرایش شد');

                setTempProducts(tempProducts.map(p =>
                    p.id === editingProduct.id ? { ...updatedProduct, id: p.id } : p
                ));
                setEditingProduct(null);
            }

            setShowConfirm(false);
            onClose();
        } catch (e) {
            console.error(e);
            alert('خطا در ثبت اطلاعات');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (product: TempProduct) => {
        setEditingProduct(product);
        Object.entries(product).forEach(([key, value]) => {
            if (key !== 'id') setValue(key as keyof FormData, value);
        });
    };

    const handleUpdate = (data: FormData) => {
        if (!validateForm(data) || !editingProduct) return;

        setTempProducts(tempProducts.map(p =>
            p.id === editingProduct.id ? { ...data, id: p.id } : p
        ));
        setEditingProduct(null);
        reset();
    };

    const handleDelete = (id: number) => {
        setTempProducts(tempProducts.filter(p => p.id !== id));
    };

    const handleEditConfirm = (product: TempProduct) => {
        setEditingProduct(product);
        setConfirmType('edit');
        setShowConfirm(true);
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modal.overlay}>
            <div className={styles.modal.container}>
                <h3 className={styles.modal.title}>افزودن محصول</h3>

                <form onSubmit={handleSubmit(editingProduct ? handleUpdate : handleFormSubmit)} className={styles.form.container}>
                    <FormField label="نام محصول *" error={errors.name?.message}>
                        <input {...register("name", { required: true })} className={styles.form.input} />
                    </FormField>

                    <FormField label="تعداد *" error={errors.quantity?.message}>
                        <input
                            type="number"
                            {...register("quantity", { required: true, min: 1 })}
                            className={styles.form.input}
                        />
                    </FormField>

                    <FormField label="قیمت *" error={errors.price?.message}>
                        <input
                            type="number"
                            {...register("price", { required: true, min: 0 })}
                            className={styles.form.input}
                        />
                    </FormField>

                    <FormField label="توضیحات محصول *" error={errors.description?.message}>
                        <input {...register("description", { required: true })} className={styles.form.input} />
                    </FormField>

                    <div className="flex justify-between items-center mt-6">
                        <button type="button" onClick={onClose} className={styles.button.secondary}>
                            لغو
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={styles.button.primary}
                        >
                            {isSubmitting ? "می‌فرستم..." : editingProduct ? "ویرایش" : "افزودن"}
                        </button>
                    </div>
                </form>

                <ProductList
                    products={tempProducts}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onEditConfirm={handleEditConfirm}
                />

                <ConfirmDialog
                    isOpen={showConfirm}
                    type={confirmType}
                    productsCount={tempProducts.length}
                    isSubmitting={isSubmitting}
                    onClose={() => {
                        setShowConfirm(false);
                        if (editingProduct) setEditingProduct(null);
                    }}
                    onConfirm={handleConfirm}
                />
            </div>
        </div>
    );
};

export default AddProductModal; 