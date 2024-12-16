"use client"

import { useEffect, useState } from "react";
import { unsplash } from "@/lib/unsplash";
import { Check, Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { defaultImages } from "@/constants/images";
import Link from "next/link";

interface UnsplashImage {
    id: string;
    urls: {
        thumb: string;
        full: string;
    };
    links: {
        html: string;
    };
    user: {
        name: string;
    };
}

interface UnsplashResponse {
    response?: UnsplashImage[];
    errors?: string[];
}

interface FormPickerProps {
    id: string;
    errors?: Record<string, string[] | undefined>;
}

export const FormPicker = ({
    id,
    errors,
}: FormPickerProps) => {
    const { pending } = useFormStatus();

    const [images, setImages] = useState<UnsplashImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const result = await unsplash.photos.getRandom({
                    collectionIds: ["1065396"],
                    count: 9,
                }) as UnsplashResponse;

                if (result && result.response) {
                    setImages(result.response);
                } else {
                    console.error("Failed to get images from Unsplash");
                }
            } catch {
                setImages(defaultImages);
            } finally {
                setIsLoading(false);
            }
        }
        fetchImages();
    }, []);

    if (isLoading) {
        return (
            <div className="p-6 flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-sky-700 animate-spin" />
            </div>
        );
    }

    return (
        <div className="relative">
            <div className="grid grid-cols-3 gap-2 mb-2">
                {images.map((image) => (
                    <div
                        key={image.id}
                        className={cn(
                            "relative cursor-pointer aspect-video group hover:opacity-75 transition bg-muted",
                            pending && "opacity-50 hover:opacity-50 cursor-auto"
                        )}
                        onClick={() => {
                            if (pending) return;
                            setSelectedImageId(image.id);
                        }}>
                        <input
                            type="radio"
                            id={id}
                            name={id}
                            className="hidden"
                            checked={selectedImageId === image.id}
                            onChange={() => setSelectedImageId(image.id)}
                            disabled={pending}
                            value={`${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`}
                        />
                        
                        <Image
                            src={image.urls.thumb}
                            alt="Unsplash Image"
                            className="object-cover rounded-sm"
                            fill
                        />
                        {selectedImageId === image.id && (
                            <div className="absolute inset-y-0 h-full w-full bg-black/30 flex items-center justify-center">
                                <Check className="h-4 w-4 text-white"/>
                            </div>
                        )}
                        <Link 
                            href={image.links.html} 
                            target="_blank" 
                            className="hidden md:block opacity-0 group-hover:opacity-100 absolute inset-x-0 bottom-0 text-xs truncate text-white hover:underline py-1 px-2 bg-black/60 transition-opacity duration-200"
                        >
                            {image.user.name}
                        </Link>
                    </div>
                ))}
            </div>
            {errors?.[id] && (
                <div className="text-rose-500 text-sm mt-2">
                    {errors[id]?.join(", ")}
                </div>
            )}
        </div>
    );
};