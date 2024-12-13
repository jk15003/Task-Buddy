import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { BoardNavBar } from "./_components/board-navbar";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  params: {
    boardId: string;
  };
}

// Utility function to get orgId
async function getOrgId() {
  const { orgId } = await auth();
  return orgId;
}

export async function generateMetadata({ params }: LayoutProps) {
  const orgId = await getOrgId();

  if (!orgId) {
    return {
      title: "Board",
    };
  }
  const board = await db.board.findUnique({
    where: {
      id: params.boardId,
      orgId,
    },
  });

  return {
    title: board?.title || "Board",
  };
}

const BoardIdLayout = async ({ children, params }: LayoutProps) => {
  const orgId = await getOrgId();

  if (!orgId) {
    redirect("/select-org");
  }

  const board = await db.board.findFirst({
    where: {
      id: params.boardId,
      orgId,
    },
  });

  if (!board) {
    notFound();
  }

  return (
    <div
      className="relative w-full h-full bg-no-repeat bg-center bg-cover"
      style={{ backgroundImage: `url(${board.imageFullUrl})` }}>
      <div className="absolute inset-0 bg-black/10" />
      <BoardNavBar data={board} />
      <main className="relative pt-28 h-full">{children}</main>
    </div>
  );
};

export default BoardIdLayout;
