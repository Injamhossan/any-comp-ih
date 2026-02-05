"use client";

import { toast } from "sonner";
import React, { useState, Suspense } from "react";
import Image from "next/image";
import { Upload, ChevronRight, X, Plus, Trash2, Check, User, Building, Zap, MapPin, CalendarCheck, Award, Truck, Headphones } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { ImageUploadBox } from "@/components/ui/image-upload-box";
import uploadIcon from "@/assets/image/upload.png";
import stcImage from "@/assets/image/STC.png";
import maicsaImage from "@/assets/certification/Maicsa.png";
import ssmImage from "@/assets/certification/SSM.png";
import image6 from "@/assets/certification/image 6.png";
import { useServiceStore } from "@/store/useServiceStore";

const ASSETS = [
    { name: "Default", src: stcImage },
    { name: "Maicsa", src: maicsaImage },
    { name: "SSM", src: ssmImage },
    { name: "Image 6", src: image6 },
];

function CreateSpecialistContent() {
    interface UploadedImage {
        url: string;
        file_name: string;
        mime_type: string;
        file_size: number;
    }

    interface Offering {
        masterId: string;
        title: string;
        price: number | string;
    }

    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('id');

    // Form State from Zustand Store
    const {
        title, setTitle,
        description, setDescription,
        basePrice, setBasePrice,
        duration, setDuration,
        secretaryName, setSecretaryName,
        secretaryEmail, setSecretaryEmail,
        secretaryPhone, setSecretaryPhone,
        secretaryBio, setSecretaryBio,
        secretaryCompany, setSecretaryCompany,
        avatar, setAvatar,
        companyLogo, setCompanyLogo,
        certifications, setCertifications,
        images, setImages,
        offerings, setOfferings,
        isSubmitting, setIsSubmitting,
        reset, // We will use this to reset on unmount
        updateImage, toggleCertification, addOffering, removeOffering
    } = useServiceStore();

    // Local UI State (Upload loading, Modals, Drag & Drop)
    const [isAvatarUploading, setIsAvatarUploading] = useState(false);
    const [isLogoUploading, setIsLogoUploading] = useState(false);

    interface MasterOffering {
        id: string;
        title: string;
        description: string;
        s3_key: string | null;
    }
    const [masterOfferings, setMasterOfferings] = useState<MasterOffering[]>([]);
    const [showOfferingDropdown, setShowOfferingDropdown] = useState(false);

    // ... (calculations remain same)
    const processingFee = typeof basePrice === 'number' ? basePrice * 0.3 : 0;
    const offeringsTotal = offerings.reduce((sum, off) => sum + (Number(off.price) || 0), 0);
    const total = typeof basePrice === 'number' ? basePrice + processingFee + offeringsTotal : offeringsTotal;

    const [uploading, setUploading] = useState<boolean[]>([false, false, false]);
    const [dragActive, setDragActive] = useState<number | null>(null);

    const [showAssetModal, setShowAssetModal] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);



    const CERTIFICATION_OPTIONS = ["MAICSA", "SSM", "LS", "MIA"];

    // ... (getIcon remains same)
    const getIcon = (key: string | null) => {
        switch (key) {
            case 'user-check': return <User className="h-5 w-5 text-gray-600" />;
            case 'landmark': return <Building className="h-5 w-5 text-gray-600" />;
            case 'files': return <div className="h-5 w-5 text-gray-600 font-bold border rounded flex items-center justify-center text-[10px]">DOC</div>; // Placeholder
            case 'zap': return <Zap className="h-5 w-5 text-gray-600" />;
            case 'map-pin': return <MapPin className="h-5 w-5 text-gray-600" />;
            case 'calendar-check': return <CalendarCheck className="h-5 w-5 text-gray-600" />;
            case 'award': return <Award className="h-5 w-5 text-gray-600" />;
            case 'truck': return <Truck className="h-5 w-5 text-gray-600" />;
            case 'headphones': return <Headphones className="h-5 w-5 text-gray-600" />;
            default: return <Check className="h-5 w-5 text-gray-600" />;
        }
    };

    // Reset store on unmount
    React.useEffect(() => {
        return () => reset();
    }, [reset]);

    // Fetch Master Offerings
    React.useEffect(() => {
        fetch('/api/service-offerings')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setMasterOfferings(data.data);
                }
            })
            .catch(err => console.error("Failed to fetch master offerings", err));
    }, []);

    // Load data for edit OR pre-fill for new
    React.useEffect(() => {
        if (editId) {
            fetch(`/api/specialists/${editId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        const s = data.data;
                        setTitle(s.title || "");
                        setDescription(s.description || "");
                        setBasePrice(Number(s.base_price) || 0);
                        setDuration(s.duration_days || 1);
                        setSecretaryName(s.secretary_name || "");
                        setSecretaryEmail(s.secretary_email || "");
                        setSecretaryPhone(s.secretary_phone || "");
                        setSecretaryBio(s.secretary_bio || "");
                        setSecretaryCompany(s.secretary_company || "");
                        setCertifications(s.certifications || []);

                        if (s.avatar_url) {
                            setAvatar({ url: s.avatar_url, file_name: "avatar", mime_type: "image/jpeg", file_size: 0 });
                        }
                        if (s.secretary_company_logo) {
                            setCompanyLogo({ url: s.secretary_company_logo, file_name: "logo", mime_type: "image/png", file_size: 0 });
                        }

                        // Map existing media
                        if (s.media && s.media.length > 0) {
                            const existingImages = [null, null, null] as (UploadedImage | null)[];
                            s.media.forEach((m: any) => {
                                if (m.display_order < 3) {
                                    existingImages[m.display_order] = {
                                        url: m.url,
                                        file_name: m.file_name,
                                        mime_type: m.mime_type || "image/jpeg",
                                        file_size: m.file_size || 0
                                    };
                                }
                            });
                            setImages(existingImages);
                        }

                        // Map Service Offerings (New Schema)
                        if (s.service_offerings && s.service_offerings.length > 0) {
                            setOfferings(s.service_offerings.map((so: any) => ({
                                masterId: so.service_offerings_master_list_id,
                                title: so.master_list_item?.title || "Unknown Offering",
                                price: Number(so.price) || 0
                            })));
                        }
                    } else {
                        console.error("Framework Error:", data);
                        toast.error("Failed to load specialist data.");
                    }
                })
                .catch(err => {
                    console.error("Failed to fetch specialist", err);
                });
        } else {
            // Pre-fill for NEW service using Admin profile
            // Try to fetch session to get email? For now, we try to guess or use a standard endpoint if available.
            // Since this is client component, we should really use useSession, but we can also just fetch /api/auth/session or assume backend handler.
            // Let's try fetching the profile if we can.
            fetch('/api/auth/session').then(res => res.json()).then(session => {
                if (session && session.user && session.user.email) {
                     fetch(`/api/user/profile?email=${session.user.email}`)
                        .then(res => res.json())
                        .then(profile => {
                            if (profile.success && profile.data) {
                                const p = profile.data;
                                setSecretaryName(p.name || "");
                                setSecretaryEmail(p.email || "");
                                setSecretaryPhone(p.phone || "");
                                setSecretaryBio(p.description || "");
                                setSecretaryCompany(p.company_name || "");
                                if (p.image) {
                                    setAvatar({ url: p.image, file_name: "profile", mime_type: "image/jpeg", file_size: 0 });
                                }
                                if (p.company_logo_url) {
                                     setCompanyLogo({ url: p.company_logo_url, file_name: "logo", mime_type: "image/png", file_size: 0 });
                                }
                            }
                        });
                }
            }).catch(() => {});
        }
    }, [editId]);

    // File Upload Logic
    const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(prev => {
            const newUploading = [...prev];
            newUploading[index] = true;
            return newUploading;
        });

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();

            if (data.success) {
                updateImage(index, {
                    url: data.url,
                    file_name: data.filename,
                    mime_type: data.mimeType,
                    file_size: data.size
                });
            } else {
                toast.error("Upload failed: " + (data.error || "Unknown error"));
            }
        } catch (error) {
            console.error("Upload Error:", error);
            toast.error("Upload failed due to network or server error.");
        } finally {
            setUploading(prev => {
                const newUploading = [...prev];
                newUploading[index] = false;
                return newUploading;
            });
        }
    };

    const handleDrag = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(index);
        } else if (e.type === "dragleave") {
            setDragActive(null);
        }
    };

    const handleDrop = async (e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(null);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];

            setUploading(prev => {
                const newUploading = [...prev];
                newUploading[index] = true;
                return newUploading;
            });

            const formData = new FormData();
            formData.append("file", file);

            try {
                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });
                const data = await res.json();

                if (data.success) {
                    updateImage(index, {
                        url: data.url,
                        file_name: data.filename,
                        mime_type: data.mimeType,
                        file_size: data.size
                    });
                }
            } catch (error) {
                console.error("Drop Upload Error:", error);
            } finally {
                setUploading(prev => {
                    const newUploading = [...prev];
                    newUploading[index] = false;
                    return newUploading;
                });
            }
        }
    };

    const openAssetSelector = (index: number) => {
        setActiveImageIndex(index);
        setShowAssetModal(true);
    };

    const selectAsset = (asset: { name: string, src: any }) => {
        // Handle Next.js StaticImageData or string
        const url = typeof asset.src === 'string' ? asset.src : asset.src.src;

        const newImage: UploadedImage = {
            url: url,
            file_name: asset.name,
            mime_type: "image/png",
            file_size: 0
        };

        if (activeImageIndex !== null) {
            if (activeImageIndex === 3) {
                // Avatar
                setAvatar(newImage);
            } else if (activeImageIndex === 4) {
                // Company Logo
                setCompanyLogo(newImage);
            } else {
                // Main Images
                updateImage(activeImageIndex, newImage);
            }
        }
        setShowAssetModal(false);
    };



    const submitToBackend = async (isDraft: boolean) => {
        setIsSubmitting(true);
        try {
            const getMimeTypeEnum = (mime: string) => {
                if (mime === 'image/jpeg' || mime === 'image/jpg') return 'IMAGE_JPEG';
                if (mime === 'image/png') return 'IMAGE_PNG';
                if (mime === 'image/webp') return 'IMAGE_WEBP';
                return 'IMAGE_JPEG';
            };

            const mediaData = images
                .filter((img): img is UploadedImage => img !== null)
                .map((img, index) => ({
                    file_name: img.file_name,
                    file_size: img.file_size,
                    mime_type: getMimeTypeEnum(img.mime_type),
                    media_type: 'IMAGE',
                    url: img.url,
                    display_order: index
                }));

            // Ensure numbers are numbers and not NaN
            const cleanBasePrice = typeof basePrice === 'number' && !isNaN(basePrice) ? basePrice : 0;
            const cleanProcessingFee = typeof processingFee === 'number' && !isNaN(processingFee) ? processingFee : 0;
            const cleanTotal = typeof total === 'number' && !isNaN(total) ? total : 0;
            const cleanDuration = Number(duration) || 1;

            const serviceOfferingsPayload = offerings.map(o => ({
                service_offerings_master_list_id: o.masterId,
                price: Number(o.price) || 0
            }));

            const payload: any = {
                title: title || "Untitled Service",
                description,
                base_price: cleanBasePrice,
                platform_fee: cleanProcessingFee,
                final_price: cleanTotal,
                is_draft: isDraft,
                duration_days: cleanDuration,
                slug: (title || "service").toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
                secretary_name: secretaryName,
                secretary_email: secretaryEmail,
                secretary_phone: secretaryPhone,
                secretary_bio: secretaryBio,
                secretary_company: secretaryCompany,
                avatar_url: avatar?.url || "",
                secretary_company_logo: companyLogo?.url || "",
                certifications: certifications,
                media: mediaData,
                service_offerings: serviceOfferingsPayload
            };


            console.log("Submitting Payload to Backend [EditMode=" + !!editId + "]:", JSON.stringify(payload, null, 2));

            const url = editId ? `/api/specialists/${editId}` : '/api/specialists';
            const method = editId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to save');
            }

            await res.json();
            toast.success("Specialist saved successfully!");
            router.push('/admin/specialists');
            router.refresh();
        } catch (error: any) {
            console.error(error);
            toast.error(`Error saving specialist: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const commonUploadClasses = (index: number) => `
    relative rounded-lg overflow-hidden border-2 border-dashed transition-colors flex flex-col items-center justify-center group cursor-pointer bg-gray-50
    ${dragActive === index ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:bg-white hover:border-blue-500"}
  `;

    return (
        <div className="min-h-screen bg-[#F3F4F6] flex">
            {/* ASSET SELECTION MODAL */}
            {showAssetModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-900">Select Image</h3>
                            <button onClick={() => setShowAssetModal(false)}><X className="h-5 w-5 text-gray-500 hover:text-gray-700" /></button>
                        </div>
                        <div className="p-4 grid grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
                            {/* Option to Upload New */}
                            <div
                                onClick={() => {
                                    if (activeImageIndex !== null) {
                                        if (activeImageIndex === 3) document.getElementById('avatar-upload')?.click();
                                        else if (activeImageIndex === 4) document.getElementById('logo-upload')?.click();
                                        else document.getElementById(`file-upload-${activeImageIndex}`)?.click();
                                    }
                                    setShowAssetModal(false);
                                }}
                                className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-blue-500 transition-colors"
                            >
                                <Upload className="h-6 w-6 text-gray-400 mb-2" />
                                <span className="text-xs font-semibold text-gray-600">Upload New</span>
                            </div>

                            {/* Pre-defined Assets */}
                            {ASSETS.map((asset, i) => (
                                <div
                                    key={i}
                                    onClick={() => selectAsset(asset)}
                                    className="aspect-square rounded-lg border border-gray-200 relative overflow-hidden cursor-pointer hover:ring-2 ring-blue-500 transition-all group"
                                >
                                    <Image src={asset.src} alt={asset.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                                    <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1 text-[10px] text-center text-white truncate">{asset.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* LEFT SIDE: PREVIEW */}
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-4xl mx-auto space-y-12 pb-20">

                    {/* Title Preview */}
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-900 leading-tight">
                            {title || "Register a new company | Private Limited - Sdn Bhd"}
                        </h1>
                    </div>

                    {/* Images Grid (Functional) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-96">
                        {/* Main Large Upload Area (Index 0) */}
                        <div
                            onClick={() => openAssetSelector(0)}
                            onDragEnter={(e) => handleDrag(e, 0)}
                            onDragLeave={(e) => handleDrag(e, 0)}
                            onDragOver={(e) => handleDrag(e, 0)}
                            onDrop={(e) => handleDrop(e, 0)}
                            className={`md:col-span-1 h-full ${commonUploadClasses(0)}`}
                        >
                            <input type="file" id="file-upload-0" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(0, e)} />
                            {uploading[0] && <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80"><span className="text-sm text-blue-600 font-medium">Uploading...</span></div>}

                            {images[0] ? (
                                <Image src={images[0].url} alt="Main Preview" fill className="object-cover" />
                            ) : (
                                <div className="flex flex-col items-center gap-4 text-center p-6">
                                    <Upload className="h-10 w-10 text-gray-400" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-600">Click to Select Image</p>
                                        <p className="text-xs text-gray-400">or drag and drop</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Side Stacked Images (Indices 1 & 2) */}
                        <div className="md:col-span-1 grid grid-rows-2 gap-4 h-full">
                            {[1, 2].map((idx) => (
                                <div
                                    key={idx}
                                    onClick={() => openAssetSelector(idx)}
                                    onDragEnter={(e) => handleDrag(e, idx)}
                                    onDragLeave={(e) => handleDrag(e, idx)}
                                    onDragOver={(e) => handleDrag(e, idx)}
                                    onDrop={(e) => handleDrop(e, idx)}
                                    className={commonUploadClasses(idx)}
                                >
                                    <input type="file" id={`file-upload-${idx}`} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(idx, e)} />
                                    {uploading[idx] && <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80"><span className="text-xs text-blue-600 font-medium">Uploading...</span></div>}
                                    {images[idx] ? (
                                        <Image src={images[idx].url} alt="Preview" fill className="object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <Upload className="h-6 w-6 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Description Preview */}
                    <div className="space-y-2">
                        <h3 className="text-lg font-bold text-gray-900">Description</h3>
                        <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                            {description || "Describe your service here..."}
                        </div>
                    </div>

                    {/* Additional Offerings Preview */}
                    <div className="space-y-2">
                        <h3 className="text-lg font-bold text-gray-900">Additional Offerings</h3>
                        <p className="text-sm text-gray-500">Enhance your service by adding additional offerings</p>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Static examples or dynamic offerings would go here, currently using placeholder or basic list */}
                            {offerings.length > 0 ? offerings.map((off, i) => (
                                <div key={i} className="flex justify-between p-3 bg-white border border-gray-200 rounded-lg">
                                    <span className="text-sm text-gray-700">{off.title}</span>
                                    <span className="text-sm font-medium">RM {off.price}</span>
                                </div>
                            )) : (
                                <div className="text-gray-400 text-sm italic">No additional offerings added.</div>
                            )}
                        </div>
                    </div>

                    {/* Company Secretary Profile Preview */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-900">Company Secretary</h3>
                        <div className="flex items-center gap-4">
                            <div 
                                onClick={() => openAssetSelector(3)}
                                className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-200 cursor-pointer group hover:ring-2 ring-blue-500 transition-all"
                            >
                                {avatar ? (
                                    <Image src={avatar.url} alt="Avatar" fill className="object-cover group-hover:scale-105 transition-transform" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-gray-400"><User className="h-6 w-6" /></div>
                                )}
                                <div className="absolute inset-0 bg-black/20 hidden group-hover:flex items-center justify-center">
                                    <Plus className="h-4 w-4 text-white" />
                                </div>
                            </div>
                            <input type="file" id="avatar-upload" className="hidden" accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setIsAvatarUploading(true);
                                        const formData = new FormData();
                                        formData.append("file", file);
                                        try {
                                            const res = await fetch('/api/upload', { method: 'POST', body: formData });
                                            const data = await res.json();
                                            if (data.success) {
                                                setAvatar({ url: data.url, file_name: data.filename, mime_type: data.mimeType, file_size: data.size });
                                            }
                                        } finally { setIsAvatarUploading(false); }
                                    }
                                }}
                            />
                            <div>
                                <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-gray-900 text-sm">{secretaryName || "Secretary Name"}</h4>
                                    <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-medium">Active</span>
                                </div>
                                <div className="text-xs text-gray-500">{secretaryEmail || "secretary@example.com"}</div>
                                <div className="text-xs text-gray-500">{secretaryCompany || "Company Name"}</div>
                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                    <span>250 Clients</span>
                                    <span>•</span>
                                    <div className="flex items-center text-yellow-500">
                                        <span>★</span> <span className="text-gray-600 ml-0.5">4.9</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 text-xs text-gray-500">
                            <div className="space-y-4">
                                <p className="whitespace-pre-wrap">
                                    {secretaryBio || "A company secretary service founded by experts, providing clarity and care in your compliance journey."}
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <h5 className="font-bold text-gray-900 mb-2">Firm</h5>
                                    <div className="flex items-center gap-3">
                                        <div 
                                            onClick={() => openAssetSelector(4)}
                                            className="h-8 w-8 rounded bg-gray-100 border border-gray-200 flex items-center justify-center cursor-pointer overflow-hidden relative group hover:ring-2 ring-blue-500 transition-all"
                                            title="Click to change Company Logo"
                                        >
                                            {companyLogo ? (
                                                <Image src={companyLogo.url} alt="logo" fill className="object-cover" />
                                            ) : (
                                                <Building className="h-4 w-4 text-gray-400" />
                                            )}
                                        </div>
                                        <input type="file" id="logo-upload" className="hidden" accept="image/*"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setIsLogoUploading(true);
                                                    const formData = new FormData();
                                                    formData.append("file", file);
                                                    try {
                                                        const res = await fetch('/api/upload', { method: 'POST', body: formData });
                                                        const data = await res.json();
                                                        if (data.success) {
                                                            setCompanyLogo({ url: data.url, file_name: data.filename, mime_type: data.mimeType, file_size: data.size });
                                                        }
                                                    } finally { setIsLogoUploading(false); }
                                                }
                                            }}
                                        />
                                        <div>
                                            <div className="font-medium text-gray-900">{secretaryCompany || "Corpsec Services Sdn Bhd"}</div>
                                            <p className="text-[10px] text-gray-500">2 Years providing Company Secretarial services</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h5 className="font-bold text-gray-900 mb-1">Certifications</h5>
                                    <div className="flex gap-2 flex-wrap">
                                        {certifications.length > 0 ? certifications.map(cert => (
                                            <div key={cert} className={`px-2 py-1 text-[10px] font-semibold rounded border ${cert === 'MAICSA' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                                    cert === 'SSM' ? 'bg-green-100 text-green-800 border-green-200' :
                                                        'bg-gray-100 text-gray-800 border-gray-200'
                                                }`}>
                                                {cert}
                                            </div>
                                        )) : <span className="text-gray-400 italic">No certifications selected</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* RIGHT SIDE: EDIT PANEL */}
            <div className="w-[400px] bg-white border-l border-gray-200 h-screen overflow-y-auto sticky top-0 flex flex-col shadow-xl">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Edit Service</h2>
                    <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6 flex-1">
                    {/* Title Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-700">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full text-sm text-black placeholder:text-gray-400 border-gray-200 rounded-md focus:border-black focus:ring-0 transition-colors"
                            placeholder="Enter service title"
                        />
                    </div>

                    {/* Description Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-700">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={6}
                            className="w-full text-sm text-black placeholder:text-gray-400 border-gray-200 rounded-md focus:border-black focus:ring-0 transition-colors resize-none"
                            placeholder="Describe your service..."
                        />
                        <div className="text-right text-[10px] text-gray-400">0/500 words</div>
                    </div>

                    {/* Duration Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-700">Estimated Completion Time (Days)</label>
                        <select
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full text-sm text-black bg-white border-gray-200 rounded-md focus:border-black focus:ring-0 transition-colors appearance-none cursor-pointer"
                        >
                            {[...Array(14)].map((_, i) => {
                                const val = i + 1;
                                return (
                                    <option key={val} value={val}>{val} day{val > 1 ? 's' : ''}</option>
                                );
                            })}
                        </select>
                    </div>

                    {/* Certification Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-700">Certifications</label>
                        <div className="grid grid-cols-2 gap-2">
                            {CERTIFICATION_OPTIONS.map(cert => (
                                <div
                                    key={cert}
                                    onClick={() => toggleCertification(cert)}
                                    className={`flex items-center gap-2 p-2 rounded-md border text-xs cursor-pointer select-none transition-colors ${certifications.includes(cert)
                                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${certifications.includes(cert) ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'
                                        }`}>
                                        {certifications.includes(cert) && <Check className="h-3 w-3 text-white" />}
                                    </div>
                                    <span>{cert}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Price Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-700">Price</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 text-sm flex items-center gap-1">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/66/Flag_of_Malaysia.svg" className="w-4 h-3 object-cover shadow-sm" alt="MY" />
                                    MYR
                                </span>
                            </div>
                            <input
                                type="number"
                                value={basePrice}
                                onChange={(e) => setBasePrice(e.target.value === "" ? "" : parseFloat(e.target.value))}
                                className="w-full pl-16 text-sm text-black placeholder:text-gray-400 border-gray-200 rounded-md focus:border-black focus:ring-0 transition-colors"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    {/* Secretary Profile Inputs (Added for completeness within the panel) */}
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <h3 className="text-sm font-bold text-gray-900">Secretary Info</h3>
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <label className="text-[10px] font-semibold text-gray-500 uppercase">Secretary Name</label>
                                <input
                                    type="text"
                                    value={secretaryName}
                                    onChange={(e) => setSecretaryName(e.target.value)}
                                    placeholder="Full Name"
                                    className="w-full text-xs text-black placeholder:text-gray-400 border-gray-200 rounded-md focus:border-black focus:ring-0"
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-gray-500 uppercase">Email</label>
                                    <input
                                        type="email"
                                        value={secretaryEmail}
                                        onChange={(e) => setSecretaryEmail(e.target.value)}
                                        placeholder="Email Address"
                                        className="w-full text-xs text-black placeholder:text-gray-400 border-gray-200 rounded-md focus:border-black focus:ring-0"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-gray-500 uppercase">Phone</label>
                                    <input
                                        type="text"
                                        value={secretaryPhone}
                                        onChange={(e) => setSecretaryPhone(e.target.value)}
                                        placeholder="Phone Number"
                                        className="w-full text-xs text-black placeholder:text-gray-400 border-gray-200 rounded-md focus:border-black focus:ring-0"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-semibold text-gray-500 uppercase">Company Name</label>
                                <input
                                    type="text"
                                    value={secretaryCompany}
                                    onChange={(e) => setSecretaryCompany(e.target.value)}
                                    placeholder="Company Name"
                                    className="w-full text-xs text-black placeholder:text-gray-400 border-gray-200 rounded-md focus:border-black focus:ring-0"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-semibold text-gray-500 uppercase">Secretary Bio</label>
                                <textarea
                                    value={secretaryBio}
                                    onChange={(e) => setSecretaryBio(e.target.value)}
                                    placeholder="Brief bio or about section..."
                                    rows={4}
                                    className="w-full text-xs text-black placeholder:text-gray-400 border-gray-200 rounded-md focus:border-black focus:ring-0 resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Additional Offerings Selection */}
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-700">Additional Offerings (Select)</label>
                            <div className="relative">
                                {/* Multi-Select Input Box */}
                                <div
                                    onClick={() => setShowOfferingDropdown(!showOfferingDropdown)}
                                    className="w-full min-h-[42px] border border-gray-200 rounded-md px-2 py-1.5 cursor-pointer bg-white flex flex-wrap gap-2 items-center hover:border-gray-300 transition-colors"
                                >
                                    {offerings.length > 0 ? (
                                        offerings.map((off, i) => (
                                            <div key={i} className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded text-[11px] font-medium text-blue-700 border border-blue-100">
                                                <span>{off.title}</span>
                                                <div
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (typeof off.masterId === 'string') removeOffering(off.masterId);
                                                    }}
                                                    className="p-0.5 rounded-full hover:bg-blue-100 text-blue-500 hover:text-red-500 cursor-pointer"
                                                >
                                                    <X className="h-3 w-3" />
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <span className="text-gray-400 text-xs px-1">Select offerings...</span>
                                    )}
                                    <div className="flex-1"></div>
                                    <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${showOfferingDropdown ? "rotate-90" : "rotate-0"}`} />
                                </div>

                                {/* Dropdown Menu */}
                                {showOfferingDropdown && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto z-[60]">
                                        {masterOfferings.length > 0 ? (
                                            masterOfferings.map((item) => {
                                                const isSelected = offerings.some(o => String(o.masterId) === String(item.id));
                                                return (
                                                    <div
                                                        key={item.id}
                                                        onClick={() => {
                                                            if (isSelected) {
                                                                removeOffering(item.id);
                                                            } else {
                                                                addOffering({ masterId: item.id, title: item.title, price: 0 });
                                                            }
                                                        }}
                                                        className={`flex items-start gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 transition-colors ${isSelected ? "bg-blue-50/50" : ""}`}
                                                    >
                                                        <div className={`mt-0.5 ${isSelected ? "text-blue-600" : "text-gray-400"}`}>
                                                            {getIcon(item.s3_key)}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className={`text-xs font-semibold ${isSelected ? "text-blue-900" : "text-gray-900"}`}>{item.title}</div>
                                                            <div className="text-[10px] text-gray-500 line-clamp-1">{item.description}</div>
                                                        </div>
                                                        {isSelected && <Check className="h-4 w-4 text-blue-600" />}
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="p-3 text-xs text-gray-400 text-center">No offerings available.</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Pricing Inputs for Selected Offerings */}
                        {offerings.length > 0 && (
                            <div className="space-y-3 bg-gray-50 p-3 rounded-lg border border-gray-200 mt-4">
                                <label className="text-xs font-semibold text-gray-700">Set Prices for Selected Offerings</label>
                                <div className="space-y-2">
                                    {offerings.map((off, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className="flex-1 text-xs text-gray-600 truncate" title={off.title}>{off.title}</div>
                                            <div className="relative w-24">
                                                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                                    <span className="text-gray-400 text-[10px]">RM</span>
                                                </div>
                                                <input
                                                    type="number"
                                                    value={off.price}
                                                    onChange={(e) => {
                                                        const newPrice = e.target.value;
                                                        const newOfferings = [...offerings];
                                                        newOfferings[i] = { ...newOfferings[i], price: newPrice };
                                                        setOfferings(newOfferings);
                                                    }}
                                                    className="w-full pl-8 py-1 text-xs text-right text-black placeholder:text-gray-400 border-gray-200 rounded-md focus:border-blue-500 focus:ring-0"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3 sticky bottom-0 z-10">
                    <button
                        onClick={() => submitToBackend(true)}
                        disabled={isSubmitting || uploading.some(u => u)}
                        className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 disabled:opacity-50"
                    >
                        {isSubmitting ? "Saving..." : "Save Draft"}
                    </button>
                    <button
                        onClick={() => submitToBackend(false)}
                        disabled={isSubmitting || uploading.some(u => u)}
                        className="flex-1 px-4 py-2 bg-[#0e2a6d] text-white text-sm font-medium rounded-md hover:bg-[#002f70] disabled:opacity-50"
                    >
                        {isSubmitting ? "Publishing..." : "Publish"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function CreateSpecialistPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CreateSpecialistContent />
        </Suspense>
    );
}
