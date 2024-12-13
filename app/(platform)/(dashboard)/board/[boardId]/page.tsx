import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ListContainer } from "./_components/list-container";

export const runtime="edge";

interface BoardIdPageProps {
    params: {
        boardId: string;
    };
};

const BoardIdPage = async ({
    params,
}: BoardIdPageProps) => {
    const { orgId } = await auth();
    const { boardId } = await params;

    if (!orgId) {
        redirect("/select-org");
    }

    const lists = await db.list.findMany({
        where: {
            boardId: boardId, // Use boardId instead of params.boardId
            board: {
                orgId,
            },
        },
        include: {
            cards: {
                orderBy: {
                    order: "asc",
                },
            },
        },
        orderBy: {
            order: "asc",
        },
    });

    return (
        <div className="p-4 h-full overflow-x-auto">
            <ListContainer
                boardId={boardId}
                data={lists}
            />
        </div>
    );
}

export default BoardIdPage;