// app/(platform)/(dashboard)/board/[boardId]/layout.tsx

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { BoardNavBar } from "./_components/board-navbar";
import { Board } from "@prisma/client";

// Define the types that Next.js expects
type PageProps = {
  children: React.ReactNode;
  params: {
    boardId: string;
  };
};

// Helper function to get the board
async function getBoardForUser(boardId: string): Promise<Board | null> {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      return null;
    }

    return await db.board.findFirst({
      where: {
        id: boardId,
        orgId
      }
    });
  } catch (error) {
    return null;
  }
}

// Metadata generation
export async function generateMetadata({ params }: { params: { boardId: string }}) {
  const board = await getBoardForUser(params.boardId);

  return {
    title: board?.title ?? "Board"
  };
}

// Layout component
export default async function BoardLayout({ children, params }: PageProps) {
  const { orgId } = await auth();

  if (!orgId) {
    redirect("/select-org");
  }

  const board = await getBoardForUser(params.boardId);

  if (!board) {
    notFound();
  }

  return (
    <div
      className="relative w-full h-full bg-no-repeat bg-center bg-cover"
      style={{ backgroundImage: `url(${board.imageFullUrl})` }}
    >
      <div className="absolute inset-0 bg-black/10" />
      <BoardNavBar data={board} />
      <main className="relative pt-28 h-full">
        {children}
      </main>
    </div>
  );
}