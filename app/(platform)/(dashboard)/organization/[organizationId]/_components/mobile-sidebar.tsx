"use client"

import { Button } from "@/components/ui/button";
import { Sheet , SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useMobileSidebar } from "@/hooks/use-mobile-sidebar";
import { Menu} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "./sidebar";

export const MobileSidebar=()=> {
    const pathname= usePathname();
    const [isMounted, setIsMounted]=useState(false);

    const onOpen=useMobileSidebar((state)=>state.onOpen);
    const onClose=useMobileSidebar((state)=>state.onClose);
    const isOpen=useMobileSidebar((state)=>state.isOpen);

    useEffect(()=>{
        setIsMounted(true);
    },[]);

    useEffect(()=>{
        onClose();
    }, [pathname,onClose]);

    if(!isMounted){
        return null;
    }

    return (
        <>
            <Button
                onClick={onOpen}
                    className="block md:hidden mr-2"
                    variant="ghost"
                    size="sm">
                <Menu className="H-4 W-4"/>
            </Button>
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent side="left" className="p-2 pt-10">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="h-[calc(100vh-40px)] overflow-y-auto 
                        scrollbar-thin 
                        scrollbar-thumb-slate-300 
                        dark:scrollbar-thumb-slate-700 
                        scrollbar-thumb-rounded-full
                        hover:scrollbar-thumb-slate-400
                        dark:hover:scrollbar-thumb-slate-600
                        scrollbar-track-slate-100 
                        dark:scrollbar-track-slate-800
                        scrollbar-track-rounded-full
                        pr-2
                        transition-all">
                        <Sidebar
                            storageKey="t-sidebar-mobile-state"/>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
}