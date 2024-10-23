import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Auth } from './components/Auth';
import { Navigation } from './components/Navigation';
import { Menu } from './components/Menu';
import { OrderList } from './components/OrderList';
import { KitchenView } from './components/KitchenView';
import { AccountingView } from './components/AccountingView';
import { ManagementView } from './components/ManagementView';
import { supabase, UserProfile, checkAuth, getUserProfile } from './utils/supabase';

function App() {
  const [session, setSession] = useState(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth().then(async (session) => {
      setSession(session);
      if (session?.user) {
        const profile = await getUserProfile(session.user.id);
        setUserProfile(profile);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (session?.user) {
        const profile = await getUserProfile(session.user.id);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <>
        <Toaster position="top-right" />
        <Auth />
      </>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Toaster position="top-right" />
        <Navigation userProfile={userProfile} onLogout={handleLogout} />
        
        <main className="flex-1 container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Navigate to="/waiter" />} />
            <Route
              path="/waiter"
              element={
                <div className="grid md:grid-cols-2 gap-6">
                  <Menu />
                  <OrderList />
                </div>
              }
            />
            {['admin', 'kitchen'].includes(userProfile?.role || '') && (
              <Route path="/kitchen" element={<KitchenView />} />
            )}
            {['admin', 'accounting'].includes(userProfile?.role || '') && (
              <Route path="/accounting" element={<AccountingView />} />
            )}
            {userProfile?.role === 'admin' && (
              <Route path="/management" element={<ManagementView />} />
            )}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;