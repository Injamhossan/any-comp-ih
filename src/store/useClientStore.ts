import { create } from 'zustand';

export interface Client {
  id: string;
  companyName: string;
  companyLogoUrl?: string | null;
  user?: {
    name: string | null;
    email: string;
    image?: string | null;
  };
  companyType: string;
  status: string;
  createdAt: string | Date;
}

interface ClientState {
  clients: Client[];
  loading: boolean;
  searchTerm: string;
  selectedClient: Client | null;
  isModalOpen: boolean;

  setClients: (clients: Client[]) => void;
  setLoading: (loading: boolean) => void;
  setSearchTerm: (term: string) => void;
  setSelectedClient: (client: Client | null) => void;
  openModal: (client: Client) => void;
  closeModal: () => void;
  updateClientStatus: (id: string, status: string) => void;
}

export const useClientStore = create<ClientState>((set) => ({
  clients: [],
  loading: true,
  searchTerm: '',
  selectedClient: null,
  isModalOpen: false,

  setClients: (clients) => set({ clients }),
  setLoading: (loading) => set({ loading }),
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setSelectedClient: (selectedClient) => set({ selectedClient }),
  
  openModal: (client) => set({ selectedClient: client, isModalOpen: true }),
  closeModal: () => set({ selectedClient: null, isModalOpen: false }),
  
  updateClientStatus: (id, status) => set((state) => ({
    clients: state.clients.map(client => 
      client.id === id ? { ...client, status } : client
    ),
    selectedClient: state.selectedClient?.id === id 
      ? { ...state.selectedClient, status } 
      : state.selectedClient
  })),
}));
