import { styles } from './styles';

interface FormFieldProps {
    label: string;
    error?: string;
    children: React.ReactNode;
}

export const FormField = ({ label, error, children }: FormFieldProps) => (
    <div className={styles.form.field}>
        <label className={styles.form.label}>{label}</label>
        {children}
        {error && <p className={styles.form.error}>{error}</p>}
    </div>
); 