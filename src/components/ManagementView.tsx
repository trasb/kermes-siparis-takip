import React, { useState } from 'react';
import { PlusCircleIcon, MinusCircleIcon } from 'lucide-react';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface ManagementViewProps {
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  waiters: string[];
  setWaiters: React.Dispatch<React.SetStateAction<string[]>>;
  tableCount: number;
  setTableCount: React.Dispatch<React.SetStateAction<number>>;
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

export const ManagementView: React.FC<ManagementViewProps> = ({
  menuItems,
  setMenuItems,
  waiters,
  setWaiters,
  tableCount,
  setTableCount,
  categories,
  setCategories,
}) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState(categories[0]);
  const [newWaiterName, setNewWaiterName] = useState('');
  const [newCategory, setNewCategory] = useState('');

  const addMenuItem = () => {
    if (newItemName && newItemPrice && newItemCategory) {
      const newItem: MenuItem = {
        id: Date.now(),
        name: newItemName,
        price: parseFloat(newItemPrice),
        category: newItemCategory,
      };
      setMenuItems([...menuItems, newItem]);
      setNewItemName('');
      setNewItemPrice('');
      setNewItemCategory(categories[0]);
    }
  };

  const removeMenuItem = (id: number) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  const addWaiter = () => {
    if (newWaiterName && !waiters.includes(newWaiterName)) {
      setWaiters([...waiters, newWaiterName]);
      setNewWaiterName('');
    }
  };

  const removeWaiter = (name: string) => {
    setWaiters(waiters.filter(waiter => waiter !== name));
  };

  const addCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
    }
  };

  const removeCategory = (category: string) => {
    setCategories(categories.filter(c => c !== category));
    setMenuItems(menuItems.filter(item => item.category !== category));
  };

  const incrementTableCount = () => {
    setTableCount(prevCount => prevCount + 1);
  };

  const decrementTableCount = () => {
    setTableCount(prevCount => Math.max(1, prevCount - 1));
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Yönetim Paneli</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">Menü Yönetimi</h3>
          <div className="mb-4">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Ürün Adı"
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="number"
              value={newItemPrice}
              onChange={(e) => setNewItemPrice(e.target.value)}
              placeholder="Fiyat"
              className="w-full p-2 mb-2 border rounded"
            />
            <select
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value)}
              className="w-full p-2 mb-2 border rounded"
            >
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <button
              onClick={addMenuItem}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              Ürün Ekle
            </button>
          </div>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id} className="flex justify-between items-center">
                <span>{item.name} - {item.price.toFixed(2)} TL ({item.category})</span>
                <button
                  onClick={() => removeMenuItem(item.id)}
                  className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                >
                  <MinusCircleIcon size={20} />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">Kategori Yönetimi</h3>
          <div className="mb-4">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Yeni Kategori"
              className="w-full p-2 mb-2 border rounded"
            />
            <button
              onClick={addCategory}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              Kategori Ekle
            </button>
          </div>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category} className="flex justify-between items-center">
                <span>{category}</span>
                <button
                  onClick={() => removeCategory(category)}
                  className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                >
                  <MinusCircleIcon size={20} />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">Garson Yönetimi</h3>
          <div className="mb-4">
            <input
              type="text"
              value={newWaiterName}
              onChange={(e) => setNewWaiterName(e.target.value)}
              placeholder="Garson Adı"
              className="w-full p-2 mb-2 border rounded"
            />
            <button
              onClick={addWaiter}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              Garson Ekle
            </button>
          </div>
          <ul className="space-y-2">
            {waiters.map((waiter) => (
              <li key={waiter} className="flex justify-between items-center">
                <span>{waiter}</span>
                <button
                  onClick={() => removeWaiter(waiter)}
                  className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                >
                  <MinusCircleIcon size={20} />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">Masa Yönetimi</h3>
          <div className="flex items-center justify-between">
            <span className="text-lg">Toplam Masa Sayısı: {tableCount}</span>
            <div>
              <button
                onClick={incrementTableCount}
                className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600 transition-colors"
              >
                <PlusCircleIcon size={20} />
              </button>
              <button
                onClick={decrementTableCount}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                disabled={tableCount <= 1}
              >
                <MinusCircleIcon size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};