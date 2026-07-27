"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const statusSchema = z.enum(["NEW", "CONFIRMED", "READY_FOR_PICKUP", "COMPLETED", "CANCELLED"]);

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function updateReservationStatus(id: string, status: unknown): Promise<ActionResult> {
  const parsed = statusSchema.safeParse(status);
  if (!parsed.success) {
    return { ok: false, error: "Invalid status" };
  }
  await prisma.reservation.update({ where: { id }, data: { status: parsed.data } });
  revalidatePath("/admin/reservations");
  revalidatePath(`/admin/reservations/${id}`);
  return { ok: true };
}

export async function markMessageHandled(id: string, handled: boolean): Promise<ActionResult> {
  await prisma.contactMessage.update({ where: { id }, data: { handled } });
  revalidatePath("/admin/messages");
  return { ok: true };
}
