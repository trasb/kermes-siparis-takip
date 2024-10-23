import { supabase } from './supabase';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category_id: string;
  active: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export interface Order {
  id: string;
  table_number: number;
  waiter_id: string;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  total_amount: number;
  created_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  notes?: string;
  menu_item?: MenuItem;
}

export const db = {
  // Menü İşlemleri
  async getMenuItems(): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select(`
        *,
        category:categories(name)
      `)
      .eq('active', true)
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async updateMenuItem(item: MenuItem): Promise<void> {
    const { error } = await supabase
      .from('menu_items')
      .upsert({
        ...item,
        updated_at: new Date().toISOString()
      });
    
    if (error) throw error;
  },

  async deleteMenuItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('menu_items')
      .update({ active: false, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) throw error;
  },

  // Kategori İşlemleri
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async updateCategory(category: Category): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .upsert(category);
    
    if (error) throw error;
  },

  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Sipariş İşlemleri
  async getOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(
          *,
          menu_item:menu_items(*)
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async createOrder(order: Omit<Order, 'id' | 'created_at'>, items: Omit<OrderItem, 'id'>[]): Promise<string> {
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();
    
    if (orderError) throw orderError;

    const orderItems = items.map(item => ({
      ...item,
      order_id: orderData.id
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    
    if (itemsError) throw itemsError;

    return orderData.id;
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) throw error;
  },

  // Ayarlar
  async getSettings<T>(key: string): Promise<T | null> {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', key)
      .single();
    
    if (error) throw error;
    return data?.value || null;
  },

  async updateSettings(key: string, value: any): Promise<void> {
    const { error } = await supabase
      .from('settings')
      .upsert({
        key,
        value,
        updated_at: new Date().toISOString()
      });
    
    if (error) throw error;
  },

  // Realtime Subscriptions
  subscribeToOrders(callback: (order: Order) => void) {
    return supabase
      .channel('orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        async (payload) => {
          const { data: order } = await supabase
            .from('orders')
            .select(`
              *,
              items:order_items(
                *,
                menu_item:menu_items(*)
              )
            `)
            .eq('id', payload.new.id)
            .single();
          
          if (order) {
            callback(order);
          }
        }
      )
      .subscribe();
  }
};