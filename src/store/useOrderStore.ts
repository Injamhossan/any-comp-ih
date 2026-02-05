import { create } from "zustand";

interface Order {
    id: string;
    specialist_id: string;
    user_id?: string | null;
    amount: number;
    status: string;
    created_at: string;
    createdAt?: string; // Handle both cases if needed, but preferably standardize
    specialist?: {
        title: string;
        secretary_company: string;
        avatar_url?: string;
        slug?: string;
    };
    user?: {
        name: string;
        email: string;
    };
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    customer_name?: string | null;
    customer_email?: string | null;
    customer_phone?: string | null;
    requirements?: string | null;
}

interface OrderStore {
    purchases: Order[];
    sales: Order[];
    loading: boolean;
    error: string | null;

    // Actions
    fetchPurchases: (userId: string) => Promise<void>;
    fetchSales: (specialistId: string) => Promise<void>;
    updateSaleStatus: (orderId: string, status: string) => Promise<boolean>;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
    purchases: [],
    sales: [],
    loading: false,
    error: null,

    fetchPurchases: async (userId: string) => {
        set({ loading: true });
        try {
            const res = await fetch(`/api/orders?userId=${userId}`);
            const data = await res.json();
            if (data.success) {
                set({ purchases: data.data, loading: false });
            } else {
                set({ error: "Failed to fetch purchases", loading: false });
            }
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    fetchSales: async (specialistId: string) => {
        set({ loading: true });
        try {
            const res = await fetch(`/api/orders?specialistId=${specialistId}`);
            const data = await res.json();
            if (data.success) {
                set({ sales: data.data, loading: false });
            } else {
                set({ error: "Failed to fetch sales", loading: false });
            }
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    updateSaleStatus: async (orderId: string, status: string) => {
        try {
            const res = await fetch(`/api/orders/${orderId}`, { // We might need to implement this route if not exists
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            
            if (res.ok) {
                // Optimistic update
                set((state) => ({
                    sales: state.sales.map(o => o.id === orderId ? { ...o, status } : o)
                }));
                return true;
            }
            return false;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}));
