import { useState, useEffect } from "react";
import InvoiceHeader from "./components/InvoiceHeader";
import ProductList from "./components/ProductList";
import AddProductModal from "./components/AddProductModal";
import { getProducts, submitInvoice, CustomerInfo } from "./api";
import { Product } from "./types/product";

const App = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    phone: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    getProducts().then(setProducts).catch(console.error);
  }, []);

  const handleAdded = (p: Product) => {
    setProducts((prev) => [p, ...prev]);
  };

  const handleSubmit = async () => {
    try {
      await submitInvoice({
        customerInfo,
        products,
      });
      alert("فاکتور با موفقیت ثبت شد");
    } catch (error) {
      console.error("Error submitting invoice:", error);
      alert("خطا در ثبت فاکتور");
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-10 px-4 flex justify-center"
    >
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
        <InvoiceHeader
          customerInfo={customerInfo}
          onCustomerInfoChange={setCustomerInfo}
        />

        <div className="px-6 py-4">
          <ProductList products={products} />
        </div>

        <div className="px-6 py-5 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between gap-3">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition font-semibold w-full sm:w-auto"
          >
            ثبت فاکتور
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition font-semibold w-full sm:w-auto"
          >
            + افزودن محصول
          </button>
        </div>

        <AddProductModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onAdded={handleAdded}
        />
      </div>
    </div>
  );
};

export default App;
