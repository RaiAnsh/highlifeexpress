"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const reservationItemSchema = z.object({
  productId: z.string(),
  name: z.string().min(1),
  priceLabel: z.string().min(1),
  unitPriceCents: z.number().int().nonnegative(),
  qty: z.number().int().positive(),
});

const reservationSchema = z.object({
  customerName: z.string().trim().min(1, "Name is required").max(200),
  phone: z.string().trim().min(7, "A valid phone number is required").max(30),
  email: z.string().trim().email().optional().or(z.literal("")),
  preferredContact: z.string().trim().max(50).optional(),
  notes: z.string().trim().max(2000).optional(),
  ageAttested: z.literal(true, { message: "You must confirm you are 19+" }),
  items: z.array(reservationItemSchema).min(1, "Your cart is empty"),
});

export type ReservationInput = z.infer<typeof reservationSchema>;

export type ReservationResult =
  | { ok: true; reservationId: string }
  | { ok: false; error: string };

export async function createReservation(input: unknown): Promise<ReservationResult> {
  const parsed = reservationSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid reservation details" };
  }
  const data = parsed.data;

  const headerList = await headers();
  const ipAddress = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

  const subtotalCents = data.items.reduce((sum, i) => sum + i.unitPriceCents * i.qty, 0);

  const reservation = await prisma.reservation.create({
    data: {
      customerName: data.customerName,
      phone: data.phone,
      email: data.email || null,
      preferredContact: data.preferredContact || null,
      notes: data.notes || null,
      subtotalCents,
      ageAttested: true,
      ipAddress,
      items: {
        create: data.items.map((item) => ({
          productId: item.productId,
          productNameSnap: item.name,
          priceLabelSnap: item.priceLabel,
          unitPriceCentsSnap: item.unitPriceCents,
          qty: item.qty,
        })),
      },
    },
  });

  return { ok: true, reservationId: reservation.id };
}
