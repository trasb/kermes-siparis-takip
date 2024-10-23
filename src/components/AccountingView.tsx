import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DownloadIcon } from 'lucide-react';

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
  timestamp: number;
}

interface AccountingViewProps {
  orders: Order[];
}

export const AccountingView: React.FC<AccountingViewProps> = ({ orders }) => {
  const stats = useMemo(() => {
    const waiterStats: { [key: string]: { orders: number; total: number } } = {};
    const itemStats: { [key: string]: { quantity: number; total: number } } = {};
    let totalRevenue = 0;
    let totalOrders = orders.length;

    orders.forEach((order) => {
      // Waiter stats
      if (!waiterStats[order.waiter]) {
        waiterStats[order.waiter] = { orders: 0, total: 0 };
      }
      waiterStats[order.waiter].orders += 1;

      // Item stats and total calculation
      order.items.forEach((item) => {
        if (!itemStats[item.name]) {
          itemStats[item.name] = { quantity: 0, total: 0 };
        }
        itemStats[item.name].quantity += item.quantity;
        itemStats[item.name].total += item.price * item.quantity;
        waiterStats[order.waiter].total += item.price * item.quantity;
        totalRevenue += item.price * item.quantity;
      });
    });

    return { waiterStats, itemStats, totalRevenue, totalOrders };
  }, [orders]);

  const waiterData = Object.entries(stats.waiterStats).map(([name, data]) => ({
    name,
    orders: data.orders,
    total: parseFloat(data.total.toFixed(2)),
  }));

  const itemData = Object.entries(stats.itemStats).map(([name, data]) => ({
    name,
    quantity: data.quantity,
    total: parseFloat(data.total.toFixed(2)),
  }));

  const exportToCSV = () => {
    const waiterCSV = [
      ['Garson', 'Sipariş Sayısı', 'Toplam Gelir (TL)'],
      ...waiterData.map(({ name, orders, total }) => [name, orders, total]),
    ];

    const itemCSV = [
      ['Ürün', 'Satış Adedi', 'Toplam Gelir (TL)'],
      ...itemData.map(({ name, quantity, total }) => [name, quantity, total]),
    ];

    const generalStats = [
      ['İstatistik', 'Değer'],
      ['Toplam Sipariş', stats.totalOrders],
      ['Toplam Gelir (TL)', stats.totalRevenue.toFixed(2)],
    ];

    const csvContent = [
      'Genel İstatistikler',
      ...generalStats.map(row => row.join(',')),
      '',
      'Garson Performansı',
      ...waiterCSV.map(row => row.join(',')),
      '',
      'Ürün İstatistikleri',
      ...itemCSV.map(row => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'muhasebe_raporu.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Muhasebe Görünümü</h2>
        <button
          onClick={exportToCSV}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors flex items-center"
        >
          <DownloadIcon className="mr-2" size={18} />
          CSV Olarak İndir
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">Genel İstatistikler</h3>
          <p>Toplam Sipariş: {stats.totalOrders}</p>
          <p>Toplam Gelir: {stats.totalRevenue.toFixed(2)} TL</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">Garson Performansı</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={waiterData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="orders" fill="#8884d8" name="Sipariş Sayısı" />
              <Bar yAxisId="right" dataKey="total" fill="#82ca9d" name="Toplam Gelir (TL)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
          <h3 className="text-xl font-semibold mb-2">Ürün İstatistikleri</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={itemData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="quantity" fill="#8884d8" name="Satış Adedi" />
              <Bar yAxisId="right" dataKey="total" fill="#82ca9d" name="Toplam Gelir (TL)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};