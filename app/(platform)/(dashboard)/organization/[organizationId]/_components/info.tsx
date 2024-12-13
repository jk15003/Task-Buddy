"use client"

import { Skeleton } from "@/components/ui/skeleton";
import { useOrganization, useUser } from "@clerk/nextjs";
import { HandMetal } from "lucide-react";
import Image from "next/image";

export const Info = () => {
    const { organization, isLoaded } = useOrganization();
    const {user} = useUser();

    if (!isLoaded) {
        return (
            <Info.Skeleton />
        );
    }

    // Return early if no organization data
    if (!organization || !user) {
        return null;
    }

    return (
        <div className="flex items-center gap-x-4">
            <div className="w-[60px] h-[60px] relative">
                <Image
                    fill
                    src={organization.imageUrl || "/fallback-image.png"} // Add a fallback image
                    alt="Organization"
                    className="rounded-md object-cover" />
            </div>
            <div className="space-y-1">
                <p className="font-semibold text-xl">
                    {organization.name}
                </p>
                <div className="flex items-center text-xs text-muted-foreground">
                    <HandMetal className="h-3 w-3 mr-1" />
                    {`User: ${user?.firstName}`}
                </div>
            </div>
        </div>
    );
};

Info.Skeleton = function SkeletonInfo() {
    return (
        <div className="flex items-center gap-x-4">
            <div className="w-[60px] h-[60px] relative">
                <Skeleton className="w-full h-full absolute" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-10 w-[200px]" />
                <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2" />
                    <Skeleton className="h-4 w-[100px]" />
                </div>
            </div>
        </div>
    );
};