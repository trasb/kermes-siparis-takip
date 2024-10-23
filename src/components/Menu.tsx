import React from 'react';
import { PlusCircleIcon } from 'lucide-react';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface MenuProps {
  items: MenuItem[];
  onAddToOrder: (item: MenuItem) => void;
}

export const Menu: React.FC<MenuProps> = ({ items, onAddToOrder }) => {
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {Object.entries(groupedItems).map(([category, categoryItems]) => (
        <div key={category} className="mb-6">
          <h3 className="text-lg font-semibold mb-2">{category}</h3>
          <ul className="space-y-2">
            {categoryItems.map((item) => (
              <li key={item.id} className="flex justify-between items-center">
                <span>{item.name}</span>
                <div className="flex items-center">
                  <span className="mr-2">${item.price.toFixed(2)}</span>
                  <button
                    onClick={() => onAddToOrder(item)}
                    className="bg-green-500 text-white p-1 rounded-full hover:bg-green-600 transition-colors"
                  >
                    <PlusCircleIcon size={20} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};