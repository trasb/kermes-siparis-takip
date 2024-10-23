import React, { useState } from 'react';
import { ClockIcon, CheckCircleIcon, PrinterIcon } from 'lucide-react';

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'ready';
  tableNumber: number;
  waiter: string;
}

interface KitchenViewProps {
  orders: Order[];
  updateOrderStatus: (orderId: number, newStatus: 'preparing' | 'ready') => void;
}

export const KitchenView: React.FC<KitchenViewProps> = ({ orders, updateOrderStatus }) => {
  const pendingOrders = orders.filter((order) => order.status === 'pending');
  const preparingOrders = orders.filter((order) => order.status === 'preparing');

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Mutfak Görünümü</h2>
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[300px]">
          <h3 className="text-xl font-semibold mb-2">Bekleyen Siparişler</h3>
          {pendingOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusUpdate={() => updateOrderStatus(order.id, 'preparing')}
              actionText="Hazırlamaya Başla"
              actionIcon={<ClockIcon className="mr-1" size={18} />}
            />
          ))}
        </div>
        <div className="flex-1 min-w-[300px]">
          <h3 className="text-xl font-semibold mb-2">Hazırlanan Siparişler</h3>
          {preparingOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusUpdate={() => updateOrderStatus(order.id, 'ready')}
              actionText="Hazır"
              actionIcon={<CheckCircleIcon className="mr-1" size={18} />}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface OrderCardProps {
  order: Order;
  onStatusUpdate: () => void;
  actionText: string;
  actionIcon: React.ReactNode;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onStatusUpdate, actionText, actionIcon }) => {
  const [thermalPrintOutput, setThermalPrintOutput] = useState<string | null>(null);

  const generateThermalPrintOutput = () => {
    const output = `
SIPARIS #${order.id}
------------------------
Masa: ${order.tableNumber}
Garson: ${order.waiter}
Tarih: ${new Date().toLocaleString()}
------------------------
${order.items.map(item => `${item.name} x ${item.quantity} - ${(item.price * item.quantity).toFixed(2)} TL`).join('\n')}
------------------------
TOPLAM: ${order.items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)} TL
------------------------
    `;
    setThermalPrintOutput(output.trim());
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h4 className="font-semibold text-lg mb-2">Masa {order.tableNumber} - {order.waiter}</h4>
      <ul className="mb-4">
        {order.items.map((item) => (
          <li key={item.id}>
            {item.name} x {item.quantity}
          </li>
        ))}
      </ul>
      <div className="flex space-x-2">
        <button
          onClick={onStatusUpdate}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center"
        >
          {actionIcon}
          {actionText}
        </button>
        <button
          onClick={generateThermalPrintOutput}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors flex items-center"
        >
          <PrinterIcon className="mr-1" size={18} />
          Termal Yazdır
        </button>
      </div>
      {thermalPrintOutput && (
        <div className="mt-4">
          <h5 className="font-semibold mb-2">Termal Yazıcı Çıktısı:</h5>
          <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">{thermalPrintOutput}</pre>
          <button
            onClick={() => navigator.clipboard.writeText(thermalPrintOutput)}
            className="mt-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
          >
            Kopyala
          </button>
        </div>
      )}
    </div>
  );
};