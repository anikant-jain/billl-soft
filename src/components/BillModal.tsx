import React, { useState } from 'react';
import { Order, OrderItem } from '../types';

interface BillModalProps {
  order: Order;
  orderItems: OrderItem[];
  subtotal: number;
  cgst: number;
  sgst: number;
  total: number;
  roundOff?: number;
  grandTotal?: number;
  onClose: () => void;
  onSaveOrder: (order: Order) => void;
}

const BillModal: React.FC<BillModalProps> = ({
  order,
  orderItems,
  subtotal,
  cgst,
  sgst,
  total,
  // roundOff and grandTotal used for display
  onClose,
  onSaveOrder,
}) => {
  // billRef for future print functionality
  const [paymentMode, setPaymentMode] = useState('cash');
  const [customerName, setCustomerName] = useState('');
  const [customerNumber, setCustomerNumber] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [givenAmount, setGivenAmount] = useState('');
  const [tipAmount, setTipAmount] = useState('0');
  const [discount, setDiscount] = useState('0');
  // showBillPreview state for future modal

  const now = new Date();
  const dateStr = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getFullYear()}, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

  const discountAmt = parseFloat(discount) || 0;
  const finalTotal = total - discountAmt;
  const finalGrandTotal = Math.round(finalTotal);
  const finalRoundOff = finalGrandTotal - finalTotal;

  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleCloseBill = () => {
    onSaveOrder({ ...order, status: 'completed', paymentMode, customerName, customerNumber, customerAddress });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#c0392b] text-white px-4 py-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">View / Print Bill</h2>
          <button onClick={onClose} className="hover:bg-white/20 rounded p-1 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left: Order Details */}
          <div className="flex-1 overflow-y-auto p-0">
            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#c0392b] text-white">
                  <tr>
                    <th className="px-3 py-2 text-left">Item Name</th>
                    <th className="px-3 py-2 text-center">Quantity</th>
                    <th className="px-3 py-2 text-right">Unit price</th>
                    <th className="px-3 py-2 text-right">Total price</th>
                    <th className="px-3 py-2 text-center">Dish Discount</th>
                    <th className="px-3 py-2 text-center">–</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-3 py-2 font-medium">{item.menuItem.name}</td>
                      <td className="px-3 py-2 text-center">{item.quantity}</td>
                      <td className="px-3 py-2 text-right">{item.menuItem.price.toFixed(2)}</td>
                      <td className="px-3 py-2 text-right">{(item.menuItem.price * item.quantity).toFixed(2)}</td>
                      <td className="px-3 py-2 text-center">
                        <button className="text-red-500 hover:text-red-700">👁️</button>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button className="text-gray-500 hover:text-gray-700">☰</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bill Summary */}
            <div className="p-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sub-Total :</span>
                    <span className="font-medium">{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">no gst (0%) :</span>
                    <span>0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">CGST (2.5%) :</span>
                    <span>{cgst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">SGST (2.5%) :</span>
                    <span>{sgst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount :</span>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      className="w-20 border border-gray-300 rounded px-1 text-right"
                    />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Charges :</span>
                    <span>0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Round Off :</span>
                    <span className="text-red-500">{finalRoundOff.toFixed(2)}</span>
                  </div>
                </div>
                <div className="space-y-2 text-right">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bill Amount :</span>
                    <span className="font-medium">{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Offer :</span>
                    <span>(No Offer)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total :</span>
                    <span className="text-red-500 font-bold">{finalTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Grand Total :</span>
                    <span className="text-red-500 font-bold">{finalGrandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex gap-2 items-center">
                <span className="text-sm text-gray-600">Given Amount:</span>
                <input
                  type="number"
                  value={givenAmount}
                  onChange={(e) => setGivenAmount(e.target.value)}
                  placeholder="0"
                  className="w-24 border border-gray-300 rounded px-2 py-1 text-sm"
                />
              </div>
              <div className="mt-2 flex gap-2 items-center">
                <span className="text-sm text-gray-600">Tip Amount:</span>
                <input
                  type="number"
                  value={tipAmount}
                  onChange={(e) => setTipAmount(e.target.value)}
                  placeholder="0"
                  className="w-24 border border-gray-300 rounded px-2 py-1 text-sm"
                />
              </div>
            </div>

            {/* Payment Mode */}
            <div className="px-4 pb-4 border-t border-gray-200 pt-3">
              <div className="flex gap-4 flex-wrap text-sm">
                {['cash', 'card', 'paytm', 'multiple', 'G Pay', 'UPI'].map((mode) => (
                  <label key={mode} className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value={mode}
                      checked={paymentMode === mode}
                      onChange={() => setPaymentMode(mode)}
                      className="accent-red-500"
                    />
                    <span>{mode}</span>
                  </label>
                ))}
              </div>
              <input
                type="text"
                placeholder="Payment Remark"
                className="mt-2 w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
              />
            </div>

            {/* Action Buttons */}
            <div className="px-4 pb-4 flex gap-2 flex-wrap">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1 bg-green-500 text-white rounded px-4 py-2 text-sm font-semibold hover:bg-green-600 transition"
              >
                🖨️ PRINT BILL
              </button>
              <button
                onClick={handleCloseBill}
                className="flex items-center gap-1 bg-[#c0392b] text-white rounded px-4 py-2 text-sm font-semibold hover:bg-red-700 transition"
              >
                ✕ CLOSE TABLE
              </button>
              <button
                className="flex items-center gap-1 bg-orange-500 text-white rounded px-4 py-2 text-sm font-semibold hover:bg-orange-600 transition"
              >
                📋 SPLIT BILL
              </button>
            </div>
          </div>

          {/* Right: Customer Details */}
          <div className="w-72 border-l border-gray-200 p-4 overflow-y-auto flex-shrink-0">
            <p className="text-red-500 text-xs mb-3">
              *Note: To Save the Customer Details Contact Number is Mandatory.
            </p>

            <div className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full border-b border-gray-300 pb-1 text-sm focus:outline-none focus:border-red-400"
                />
                <button className="absolute right-0 top-0 text-gray-400">🔍</button>
              </div>

              <div>
                <label className="text-red-500 text-xs font-medium">Customer Number</label>
                <input
                  type="text"
                  placeholder="Customer Number"
                  value={customerNumber}
                  onChange={(e) => setCustomerNumber(e.target.value)}
                  className="w-full border-b border-red-400 pb-1 text-sm focus:outline-none"
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Customer Address"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full border-b border-gray-300 pb-1 text-sm focus:outline-none focus:border-red-400"
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Customer GSTIN"
                  className="w-full border-b border-gray-300 pb-1 text-sm focus:outline-none focus:border-red-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Date Of Birth</label>
                  <input
                    type="date"
                    className="w-full border-b border-gray-300 pb-1 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Date Of Anniversary</label>
                  <input
                    type="date"
                    className="w-full border-b border-gray-300 pb-1 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="discountType" value="discount" className="accent-red-500" />
                  Discount
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="discountType" value="coupon" className="accent-red-500" />
                  Coupon
                </label>
              </div>

              {/* Bill Preview */}
              <div className="mt-4 border border-gray-200 rounded p-3 bg-gray-50">
                <h3 className="text-center font-bold text-sm mb-1">Restaurant Name</h3>
                <p className="text-center text-xs text-gray-500 mb-1">Baner Pune. abcd Opp Lal Mahal</p>
                <p className="text-center text-xs text-gray-500 mb-2">GSTIN.: 27TGAPC6438C1Z5</p>
                <div className="text-xs space-y-0.5 border-t border-dashed border-gray-300 pt-2">
                  <div className="flex justify-between">
                    <span>Invoice No.:</span>
                    <span className="font-medium">{order.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Table No.:</span>
                    <span>{order.tableNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cust Name:</span>
                    <span>{customerName || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cust No.:</span>
                    <span>{customerNumber || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date & Time:</span>
                    <span>{dateStr}</span>
                  </div>
                </div>
                <table className="w-full text-xs mt-2 border-t border-dashed border-gray-300 pt-2">
                  <thead>
                    <tr>
                      <th className="text-left">Name</th>
                      <th className="text-center">Qty</th>
                      <th className="text-right">Rate</th>
                      <th className="text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.map((item) => (
                      <tr key={item.id}>
                        <td className="text-left">{item.menuItem.name}</td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-right">{item.menuItem.price}</td>
                        <td className="text-right">{(item.menuItem.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="border-t border-dashed border-gray-300 mt-2 pt-1 text-xs space-y-0.5">
                  <div className="flex justify-between">
                    <span>Dish Sub-Total:</span>
                    <span>{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>no gst (0%):</span>
                    <span>0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CGST (2.5%):</span>
                    <span>{cgst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SGST (2.5%):</span>
                    <span>{sgst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span>{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Round Off:</span>
                    <span>{finalRoundOff.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm border-t border-gray-300 mt-1 pt-1">
                    <span>Grand Total:</span>
                    <span>{finalGrandTotal.toFixed(2)}</span>
                  </div>
                </div>
                <p className="text-center text-xs text-gray-500 mt-2">Thank You, Visit Again</p>
                <p className="text-center text-xs text-gray-500">www.panel.digirestro.in</p>
                <p className="text-center text-xs text-gray-500">Maharashtra</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillModal;
