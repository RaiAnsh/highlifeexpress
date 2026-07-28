"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendNotificationEmail } from "@/lib/email";

const reservationItemSchema = z.object({
  productId: z.string(),
  name: z.string().min(1),
  priceLabel: z.string().min(1),
  unitPriceCents: z.number().int().nonnegative(),
  qty: z.number().int().positive(),
});

const reservationSchema = z.object({
  customerName: z.string().trim().min(1, "Name is required").max(200),
  deliveryAddress: z.string().trim().min(5, "A delivery address is required").max(300),
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
      deliveryAddress: data.deliveryAddress,
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

  const itemsHtml = data.items
    .map((i) => `<li>${i.qty} &times; ${i.name} (${i.priceLabel}) &mdash; $${((i.unitPriceCents * i.qty) / 100).toFixed(2)}</li>`)
    .join("");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  await sendNotificationEmail(
    `New pickup request \u2014 ${data.customerName}`,
    `<p><strong>${data.customerName}</strong> (${data.phone}${data.email ? `, ${data.email}` : ""}) submitted a pickup request.</p>
     <ul>${itemsHtml}</ul>
     <p><strong>Subtotal:</strong> $${(subtotalCents / 100).toFixed(2)}</p>
     ${data.deliveryAddress ? `<p><strong>Address:</strong> ${data.deliveryAddress}</p>` : ""}
     ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ""}
     <p><a href="${siteUrl}/admin/reservations/${reservation.id}">View in admin panel</a></p>`
  );

  return { ok: true, reservationId: reservation.id };
}
