import { FormPopover } from "@/components/form/form-popover";
import { Hint } from "@/components/hint";
import { HelpCircle, User2 } from "lucide-react";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export const BoardList = async () => {
    const { orgId } = await auth();

    if (!orgId) {
        return redirect("/select-org");
    }

    const boards = await db.board.findMany({
        where: {
            orgId,
        },
        orderBy: {
            createdAt: "desc"
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-x-3 text-lg text-neutral-700">
                <User2 className="h-6 w-6 text-neutral-600"/>
                <h2 className="font-semibold">Your boards</h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {boards.map((board) => (
                    <Link 
                        key={board.id} 
                        href={`/board/${board.id}`}
                        style={{ backgroundImage: `url(${board.imageThumbUrl})` }}
                        className="group relative aspect-video bg-no-repeat bg-center bg-cover 
                        rounded-lg hover:shadow-md transition-all duration-200 
                        overflow-hidden ring-1 ring-black/10"
                    >
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 
                        transition-all duration-200"/>
                        <p className="relative p-2 font-semibold text-white text-sm 
                        group-hover:text-white/90 transition-colors">
                            {board.title}
                        </p>
                    </Link>
                ))}
                
                <FormPopover sideOffset={10} side="right">
                    <div 
                        role="button" 
                        className="aspect-video relative h-full w-full 
                        bg-neutral-100 hover:bg-neutral-200
                        rounded-lg border-2 border-dashed border-neutral-300
                        flex flex-col gap-y-1 items-center justify-center
                        transition-colors duration-200 group
                        hover:shadow-sm"
                    >
                        <p className="text-sm font-medium text-neutral-600 group-hover:text-neutral-700">
                            Create new board
                        </p>

                        <Hint
                            sideOffset={40}
                            description="Free WorkSpaces. Hopefully you are enjoying our product :))."
                        >
                            <HelpCircle 
                                className="absolute bottom-2 right-2 h-4 w-4 
                                text-neutral-400 group-hover:text-neutral-500
                                transition-colors"
                            />
                        </Hint>
                    </div>
                </FormPopover>
            </div>
        </div>
    );
};

BoardList.Skeleton=function SkeletonBoardList(){
    return(
        <div className="grid grid-col-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <Skeleton className="aspect-video h-full w-full p-2"/>
            <Skeleton className="aspect-video h-full w-full p-2"/>
            <Skeleton className="aspect-video h-full w-full p-2"/>
            <Skeleton className="aspect-video h-full w-full p-2"/>
            <Skeleton className="aspect-video h-full w-full p-2"/>
            <Skeleton className="aspect-video h-full w-full p-2"/>
            <Skeleton className="aspect-video h-full w-full p-2"/>
            <Skeleton className="aspect-video h-full w-full p-2"/>
            <Skeleton className="aspect-video h-full w-full p-2"/>
            <Skeleton className="aspect-video h-full w-full p-2"/>
            <Skeleton className="aspect-video h-full w-full p-2"/>
            <Skeleton className="aspect-video h-full w-full p-2"/>
        </div>
    )
}