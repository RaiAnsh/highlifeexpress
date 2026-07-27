"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export type ActionResult = { ok: true } | { ok: false; error: string };

const promoMessagesSchema = z
  .array(z.string().trim().min(1, "Message can't be empty").max(140, "Keep each message under 140 characters"))
  .min(1, "Add at least one promo message");

export async function updatePromoMessages(input: unknown): Promise<ActionResult> {
  const parsed = promoMessagesSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  await prisma.siteSetting.upsert({
    where: { key: "promo_messages" },
    update: { value: JSON.stringify(parsed.data) },
    create: { key: "promo_messages", value: JSON.stringify(parsed.data) },
  });
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/admin/marketing");
  return { ok: true };
}

const dealBannerSchema = z.object({
  eyebrow: z.string().trim().max(60).default("Limited Deal"),
  titleLine1: z.string().trim().max(60),
  titleLine2: z.string().trim().max(60),
  description: z.string().trim().max(300).default(""),
  strainLines: z.array(z.string().trim().max(300)).default([]),
  limitText: z.string().trim().max(100).default(""),
  badges: z.array(z.string().trim().max(60)).default([]),
  buttonLabel: z.string().trim().max(40).default("Shop Now"),
  dealTag: z
    .string()
    .trim()
    .toLowerCase()
    .max(60)
    .regex(/^[a-z0-9]*$/, "Deal tag must be lowercase letters/numbers only, no spaces")
    .default(""),
});

const dealBannersSchema = z.array(dealBannerSchema).max(8, "Keep it to 8 banners or fewer");

export async function updateDealBanners(input: unknown): Promise<ActionResult> {
  const parsed = dealBannersSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  await prisma.siteSetting.upsert({
    where: { key: "deal_banners" },
    update: { value: JSON.stringify(parsed.data) },
    create: { key: "deal_banners", value: JSON.stringify(parsed.data) },
  });
  revalidatePath("/");
  revalidatePath("/admin/marketing");
  return { ok: true };
}
