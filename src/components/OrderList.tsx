import React from 'react';
import { MinusCircleIcon } from 'lucide-react';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface OrderListProps {
  items: OrderItem[];
  onRemoveFromOrder: (itemId: number) => void;
}

export const OrderList: React.FC<OrderListProps> = ({ items, onRemoveFromOrder }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {items.length === 0 ? (
        <p className="text-gray-500">Henüz sipariş verilmedi.</p>
      ) : (
        <>
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between items-center">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <div className="flex items-center">
                  <span className="mr-2">${(item.price * item.quantity).toFixed(2)}</span>
                  <button
                    onClick={() => onRemoveFromOrder(item.id)}
                    className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <MinusCircleIcon size={20} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-2 border-t border-gray-200">
            <p className="font-semibold text-lg">Toplam: ${total.toFixed(2)}</p>
          </div>
        </>
      )}
    </div>
  );
};