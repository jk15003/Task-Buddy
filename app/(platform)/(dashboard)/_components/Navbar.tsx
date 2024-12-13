import { AlignCenter, Plus } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { MobileSidebar } from "../organization/[organizationId]/_components/mobile-sidebar";
import { FormPopover } from "@/components/form/form-popover";

export const Navbar=()=>{
    return(
        <nav className="fixed z-50 px-4 top-0 w-full h-14 border-b shadow-sm bg-white flex items-center">
            <MobileSidebar/>
            <div className="flex items-center gap-x-4">
                <div className="hidden md:flex">
                <Logo />
                </div>
                <FormPopover align="start" side="bottom" sideOffset={18}>
                <Button
                    size="sm"
                    variant="primary"
                    className="rounded-sm hidden md:block h-auto px-2 py-1.5">
                    Create
                </Button>
                </FormPopover>
                <FormPopover>
                <Button
                    size="sm"
                    variant="primary"
                    className="rounded block md:hidden">
                    <Plus className="w-5 h-5" />
                </Button>
                </FormPopover>
            </div>
            <div className="ml-auto flex items-center gap-x-2">
                <OrganizationSwitcher
                
                hidePersonal
                afterCreateOrganizationUrl="/organization/:id"
                afterLeaveOrganizationUrl="/select-org"
                afterSelectOrganizationUrl="/organization/:id"
                appearance={{
                    elements:{
                        rootBox:{
                            display:"flex",
                            justifyConten:"center",
                            alignItems:"center",
                        },
                    },
                }}/>
                <UserButton
                afterSignOutUrl="/"
                appearance={{
                    elements:{
                        avatarBox:{
                            height:30,
                            width:30,
                        },
                    },
                }}/>
            </div>
        </nav>
    );
};