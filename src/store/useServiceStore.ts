import { create } from 'zustand';

export interface UploadedImage {
    url: string;
    file_name: string;
    mime_type: string;
    file_size: number;
}

export interface Offering {
    masterId: string;
    title: string;
    price: number | string;
}

interface ServiceState {
    title: string;
    description: string;
    basePrice: number | "";
    duration: number | string;
    secretaryName: string;
    secretaryCompany: string;
    avatar: UploadedImage | null;
    companyLogo: UploadedImage | null;
    certifications: string[];
    images: (UploadedImage | null)[];
    offerings: Offering[];
    isSubmitting: boolean;

    setTitle: (title: string) => void;
    setDescription: (description: string) => void;
    setBasePrice: (price: number | "") => void;
    setDuration: (duration: number | string) => void;
    setSecretaryName: (name: string) => void;
    setSecretaryCompany: (company: string) => void;
    setAvatar: (avatar: UploadedImage | null) => void;
    setCompanyLogo: (logo: UploadedImage | null) => void;
    setCertifications: (certifications: string[]) => void;
    setImages: (images: (UploadedImage | null)[]) => void;
    setOfferings: (offerings: Offering[]) => void;
    setIsSubmitting: (isSubmitting: boolean) => void;
    reset: () => void;
    updateImage: (index: number, image: UploadedImage | null) => void;
    toggleCertification: (cert: string) => void;
    addOffering: (offering: Offering) => void;
    removeOffering: (masterId: string) => void;
}

const initialState = {
    title: "",
    description: "",
    basePrice: "" as const,
    duration: 1,
    secretaryName: "",
    secretaryCompany: "",
    avatar: null,
    companyLogo: null,
    certifications: [],
    images: [null, null, null],
    offerings: [],
    isSubmitting: false,
};

export const useServiceStore = create<ServiceState>((set) => ({
    ...initialState,

    setTitle: (title) => set({ title }),
    setDescription: (description) => set({ description }),
    setBasePrice: (basePrice) => set({ basePrice }),
    setDuration: (duration) => set({ duration }),
    setSecretaryName: (secretaryName) => set({ secretaryName }),
    setSecretaryCompany: (secretaryCompany) => set({ secretaryCompany }),
    setAvatar: (avatar) => set({ avatar }),
    setCompanyLogo: (companyLogo) => set({ companyLogo }),
    setCertifications: (certifications) => set({ certifications }),
    setImages: (images) => set({ images }),
    setOfferings: (offerings) => set({ offerings }),
    setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
    
    reset: () => set(initialState),
    
    updateImage: (index, image) => set((state) => {
        const newImages = [...state.images];
        newImages[index] = image;
        return { images: newImages };
    }),
    
    toggleCertification: (cert) => set((state) => ({
        certifications: state.certifications.includes(cert)
            ? state.certifications.filter(c => c !== cert)
            : [...state.certifications, cert]
    })),
    
    addOffering: (offering) => set((state) => ({
        offerings: [...state.offerings, offering]
    })),
    
    removeOffering: (masterId) => set((state) => ({
        offerings: state.offerings.filter(o => o.masterId !== masterId)
    })),
}));
