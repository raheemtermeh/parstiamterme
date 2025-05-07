export const styles = {
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