import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuIcon, ShoppingCartIcon, ChefHatIcon, BarChartIcon, SettingsIcon } from 'lucide-react';
import { UserProfile } from '../utils/supabase';

interface NavigationProps {
  userProfile: UserProfile | null;
  onLogout: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ userProfile, onLogout }) => {
  const location = useLocation();
  const canAccessAdmin = userProfile?.role === 'admin';
  const canAccessKitchen = ['admin', 'kitchen'].includes(userProfile?.role || '');
  const canAccessAccounting = ['admin', 'accounting'].includes(userProfile?.role || '');

  const navItems = [
    {
      path: '/waiter',
      icon: <ShoppingCartIcon size={20} />,
      label: 'Sipariş',
      show: true,
    },
    {
      path: '/kitchen',
      icon: <ChefHatIcon size={20} />,
      label: 'Mutfak',
      show: canAccessKitchen,
    },
    {
      path: '/accounting',
      icon: <BarChartIcon size={20} />,
      label: 'Muhasebe',
      show: canAccessAccounting,
    },
    {
      path: '/management',
      icon: <SettingsIcon size={20} />,
      label: 'Yönetim',
      show: canAccessAdmin,
    },
  ];

  return (
    <header className="bg-blue-600 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <MenuIcon className="h-8 w-8" />
            <h1 className="text-xl font-bold">Restoran Yönetimi</h1>
          </div>
          
          <nav className="hidden md:flex space-x-4">
            {navItems.map((item) => 
              item.show && (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === item.path
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-100 hover:bg-blue-500'
                  }`}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <span className="text-sm">{userProfile?.name}</span>
            <button
              onClick={onLogout}
              className="bg-blue-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition-colors"
            >
              Çıkış
            </button>
          </div>
        </div>

        {/* Mobil menü */}
        <nav className="md:hidden pb-4">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) =>
              item.show && (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === item.path
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-100 hover:bg-blue-500'
                  }`}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </Link>
              )
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};