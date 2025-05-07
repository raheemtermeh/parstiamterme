import { useForm } from "react-hook-form";
import { createProduct } from "../api";
import { Product } from "../types/product";
import { useState } from "react";

// Types
interface Props {
  isOpen: boolean;
  onClose(): void;
  onAdded(p: Product): void;
}

interface FormData {
  name: string;
  quantity: number;
  price: number;
  description: string;
}

interface TempProduct extends FormData {
  id: number;
}

// Style Factory
const styles = {
  modal: {
    overlay: "fixed inset-0 bg-black/40 flex items-center justify-center z-50",
    container: "bg-white p-6 rounded-xl w-full max-w-2xl",
    title: "text-2xl font-bold mb-4",
  },
  form: {
    container: "space-y-4",
    field: "mb-4",
    label: "block mb-1",
    input: "w-full border rounded px-3 py-2",
    error: "text-red-500 text-sm",
  },
  button: {
    primary: "bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50",
    secondary: "text-gray-600 hover:text-gray-800",
    success: "bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50",
    danger: "text-red-600 hover:text-red-800",
    edit: "text-blue-600 hover:text-blue-800",
  },
  productList: {
    container: "mt-8",
    title: "text-lg font-semibold mb-4",
    item: "border p-4 rounded-lg flex justify-between items-center",
    itemContent: "space-y-1",
    itemText: "text-sm text-gray-600",
  },
  confirmDialog: {
    overlay: "fixed inset-0 bg-black/40 flex items-center justify-center z-50",
    container: "bg-white p-6 rounded-xl w-full max-w-sm",
    title: "text-xl font-bold mb-4",
    message: "mb-6",
    actions: "flex justify-end gap-4",
  },
};

// Form Field Component
const FormField = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <div className={styles.form.field}>
    <label className={styles.form.label}>{label}</label>
    {children}
    {error && <p className={styles.form.error}>{error}</p>}
  </div>
);

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

        {tempProducts.length > 0 && (
          <div className={styles.productList.container}>
            <h4 className={styles.productList.title}>محصولات در انتظار ثبت:</h4>
            <div className="space-y-4">
              {tempProducts.map(product => (
                <div key={product.id} className={styles.productList.item}>
                  <div className={styles.productList.itemContent}>
                    <h5 className="font-medium">{product.name}</h5>
                    <p className={styles.productList.itemText}>
                      تعداد: {product.quantity} | قیمت: {product.price}
                    </p>
                    <p className={styles.productList.itemText}>{product.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(product)} className={styles.button.edit}>
                      ویرایش
                    </button>
                    <button onClick={() => handleDelete(product.id)} className={styles.button.danger}>
                      حذف
                    </button>
                    <button onClick={() => handleEditConfirm(product)} className={styles.button.success}>
                      تأیید ویرایش
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showConfirm && (
          <div className={styles.confirmDialog.overlay}>
            <div className={styles.confirmDialog.container}>
              <h3 className={styles.confirmDialog.title}>
                {confirmType === 'edit' ? "تأیید ویرایش محصول" : "تأیید ثبت محصولات"}
              </h3>
              <p className={styles.confirmDialog.message}>
                {confirmType === 'edit'
                  ? "آیا از ویرایش این محصول اطمینان دارید؟"
                  : `آیا از ثبت ${tempProducts.length} محصول اطمینان دارید؟`
                }
              </p>
              <div className={styles.confirmDialog.actions}>
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    if (editingProduct) setEditingProduct(null);
                  }}
                  className={styles.button.secondary}
                >
                  انصراف
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                  className={styles.button.success}
                >
                  {isSubmitting ? "در حال ثبت..." : confirmType === 'edit' ? "تأیید ویرایش" : "تأیید و ثبت"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProductModal;