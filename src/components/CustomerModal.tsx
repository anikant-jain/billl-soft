import React, { useState } from 'react';

interface CustomerModalProps {
  onClose: () => void;
}

const CustomerModal: React.FC<CustomerModalProps> = ({ onClose }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerNumber, setCustomerNumber] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [numberError, setNumberError] = useState('');

  const validateNumber = (val: string) => {
    setCustomerNumber(val);
    if (val && isNaN(Number(val))) {
      setNumberError('Input is not a number!');
    } else {
      setNumberError('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-96 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Customer Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <p className="text-red-500 text-xs mb-4">
          *Note: To Save the Customer Details Contact Number is Mandatory.
        </p>
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full border-b border-gray-300 pb-1 focus:outline-none focus:border-red-400"
            />
            <button className="absolute right-0 text-gray-400">🔍</button>
          </div>
          <div>
            <label className="text-red-500 text-sm font-medium">Customer Number</label>
            <input
              type="text"
              value={customerNumber}
              onChange={(e) => validateNumber(e.target.value)}
              className="w-full border-b border-red-400 pb-1 focus:outline-none"
            />
            {numberError && <p className="text-red-500 text-xs mt-1">{numberError}</p>}
          </div>
          <input
            type="text"
            placeholder="Customer Address"
            value={customerAddress}
            onChange={(e) => setCustomerAddress(e.target.value)}
            className="w-full border-b border-gray-300 pb-1 focus:outline-none focus:border-red-400"
          />
          <input
            type="text"
            placeholder="Customer GSTIN"
            className="w-full border-b border-gray-300 pb-1 focus:outline-none focus:border-red-400"
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Date Of Birth</label>
              <input type="date" className="w-full border-b border-gray-300 pb-1 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Date Of Anniversary</label>
              <input type="date" className="w-full border-b border-gray-300 pb-1 focus:outline-none text-sm" />
            </div>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="type" value="discount" className="accent-red-500" />
              Discount
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="type" value="coupon" className="accent-red-500" />
              Coupon
            </label>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            className="flex-1 bg-[#c0392b] text-white rounded py-2 font-semibold hover:bg-red-700 transition"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 rounded py-2 font-semibold hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerModal;
