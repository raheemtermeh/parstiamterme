import { styles } from './styles';

interface ConfirmDialogProps {
    isOpen: boolean;
    type: 'add' | 'edit';
    productsCount: number;
    isSubmitting: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const ConfirmDialog = ({
    isOpen,
    type,
    productsCount,
    isSubmitting,
    onClose,
    onConfirm
}: ConfirmDialogProps) => {
    if (!isOpen) return null;

    return (
        <div className={styles.confirmDialog.overlay}>
            <div className={styles.confirmDialog.container}>
                <h3 className={styles.confirmDialog.title}>
                    {type === 'edit' ? "تأیید ویرایش محصول" : "تأیید ثبت محصولات"}
                </h3>
                <p className={styles.confirmDialog.message}>
                    {type === 'edit'
                        ? "آیا از ویرایش این محصول اطمینان دارید؟"
                        : `آیا از ثبت ${productsCount} محصول اطمینان دارید؟`
                    }
                </p>
                <div className={styles.confirmDialog.actions}>
                    <button onClick={onClose} className={styles.button.secondary}>
                        انصراف
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isSubmitting}
                        className={styles.button.success}
                    >
                        {isSubmitting ? "در حال ثبت..." : type === 'edit' ? "تأیید ویرایش" : "تأیید و ثبت"}
                    </button>
                </div>
            </div>
        </div>
    );
}; 