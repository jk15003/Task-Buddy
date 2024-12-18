"use client"

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Activity, Bot, Layout, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export type Organization = {
    id: string;
    slug: string;
    name: string;
    imageUrl: string;
};

interface NavItemsProps {
    isExpanded: boolean;
    isActive: boolean;
    organization: Organization;
    onExpand: (id: string) => void;
}

export const NavItem = ({
    isExpanded,
    isActive,
    organization,
    onExpand,
}: NavItemsProps) => {
    const router = useRouter();
    const pathname = usePathname();

    const routes = [
        {
            label: "Boards",
            icon: <Layout className="h-4 w-4 mr-2" />,
            href: `/organization/${organization.id}`,
        },
        {
            label: "Activity",
            icon: <Activity className="h-4 w-4 mr-2" />,
            href: `/organization/${organization.id}/activity`,
        },
        {
            label: "Settings",
            icon: <Settings className="h-4 w-4 mr-2" />,
            href: `/organization/${organization.id}/settings`,
        },
        {
            label: "Chat with AI",
            icon: <Bot className="h-4 w-4 mr-2" />,
            href: `/organization/${organization.id}/chatbox`,
        },
    ];

    const onClick = (href: string) => {
        router.push(href);
    };

    // If no organization data, return null or a loading state
    if (!organization) {
        return <NavItem.Skeleton />;
    }

    return (
        <AccordionItem
            value={organization.id}
            className="border-none">
            <AccordionTrigger
                onClick={() => onExpand(organization.id)}
                className={cn(
                    "flex items-center gap-x-2 p-1.5 text-neutral-700 rounded-md hover:bg-neutral-500/10 transition text-start no-underline hover:no-underline",
                    isActive && !isExpanded && "bg-sky-500/10 text-sky-700"
                )}>
                <div className="flex items-center gap-x-2">
                    <div className="w-7 h-7 relative">
                        <Image
                            fill
                            src={organization.imageUrl || "/fallback-image.png"}
                            alt="Organization"
                            className="rounded-sm object-cover" />
                    </div>
                </div>
                <span className="font-bold text-sm">
                    {organization.name}
                </span>
            </AccordionTrigger>
            <AccordionContent className="pt-1 text-neutral-700">
                {routes.map((route) => (
                    <Button
                        key={route.href}
                        size="sm"
                        onClick={() => onClick(route.href)}
                        className={cn(
                            "w-full font-medium justify-start pl-10 mb-1",
                            pathname === route.href && "bg-sky-500/10 text-sky-700"
                        )}
                        variant="ghost">
                        {route.icon}
                        {route.label}
                    </Button>
                ))}
            </AccordionContent>
        </AccordionItem>
    );
};

NavItem.Skeleton = function SkeletonNavItem() {
    return (
        <div className="flex items-center gap-x-2">
            <div className="w-10 h-10 relative shrink-0">
                <Skeleton className="h-full w-full absolute" />
            </div>
            <Skeleton className="h-10 w-full" />
        </div>
    );
};