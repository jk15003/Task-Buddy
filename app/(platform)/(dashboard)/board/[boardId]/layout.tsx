import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { BoardNavBar } from "./_components/board-navbar";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  params: { boardId: string };
}

async function getOrgId() {
  const { orgId } = await auth();
  return orgId;
}

export async function generateMetadata({ params }: LayoutProps) {
  const { boardId } = params;
  const orgId = await getOrgId();

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

// Change this line - remove "BoardIdLayout" name
export default async function Layout({ children, params }: LayoutProps) {
  const { boardId } = params;
  const orgId = await getOrgId();

  if (!orgId) {
    redirect("/select-org");
  }

  const board = await db.board.findFirst({
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
      className="relative w-full h-full bg-no-repeat bg-center bg-cover"
      style={{ backgroundImage: `url(${board.imageFullUrl})` }}>
      <div className="absolute inset-0 bg-black/10" />
      <BoardNavBar data={board} />
      <main className="relative pt-28 h-full">{children}</main>
    </div>
  );
}