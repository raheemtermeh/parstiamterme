import { useState } from 'react';
import { CustomerInfo } from '../api';

interface InvoiceHeaderProps {
  customerInfo: CustomerInfo;
  onCustomerInfoChange: (info: CustomerInfo) => void;
}

const InvoiceHeader = ({ customerInfo, onCustomerInfoChange }: InvoiceHeaderProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onCustomerInfoChange({
      ...customerInfo,
      [name]: value
    });
  };

  return (
    <div className="bg-white shadow-md p-6 rounded-t-2xl border-b border-gray-200">
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">نام خریدار</label>
            <input
              type="text"
              id="name"
              name="name"
              value={customerInfo.name}
              onChange={handleInputChange}
              className="mt-1 text-right block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="نام خریدار را وارد کنید"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">شماره تماس</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={customerInfo.phone}
              onChange={handleInputChange}
              className="mt-1 text-right block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="شماره تماس را وارد کنید"
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">تاریخ</label>
            <input
              type="date"
              id="date"
              name="date"
              value={customerInfo.date}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">توضیحات</label>
            <textarea
              id="description"
              name="description"
              value={customerInfo.description}
              onChange={handleInputChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="توضیحات را وارد کنید"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceHeader;
