import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { BoardNavBar } from "./_components/board-navbar";

interface LayoutParams {
    params: { boardId: string };
}

export async function generateMetadata({
    params,
}: LayoutParams): Promise<{ title: string }> {
    const { orgId } = await auth();
    const boardId = params.boardId;

    if (!orgId) {
        return {
            title: "Board",
        };
    }

    const board = await db.board.findUnique({
        where: {
            id: boardId,
            orgId,
        },
    });

    return {
        title: board?.title || "Board",
    };
}

export default async function BoardIdLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: LayoutParams["params"];
}) {
    const { orgId } = await auth();
    const boardId = params.boardId;

    if (!orgId) {
        redirect("/select-org");
    }

    const board = await db.board.findUnique({
        where: {
            id: boardId,
            orgId,
        },
    });

    if (!board) {
        notFound();
    }

    return (
        <div
            className="relative h-full bg-no-repeat bg-cover bg-center"
            style={{ backgroundImage: `url(${board.imageFullUrl})` }}
        >
            <BoardNavBar data={board} />
            <div className="absolute inset-0 bg-black/10" />
            <main className="relative pt-28 h-full">{children}</main>
        </div>
    );
}
