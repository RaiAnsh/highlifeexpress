"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const priceOptionSchema = z.object({
  label: z.string().trim().min(1, "Price label is required").max(50),
  priceCents: z.coerce.number().int().positive("Price must be greater than 0"),
  compareAtPriceCents: z
    .union([z.coerce.number().int().positive(), z.literal(""), z.null(), z.undefined()])
    .transform((v) => (v === "" || v == null ? null : v)),
});

const productSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  categoryId: z.string().trim().min(1, "Category is required"),
  strainType: z.enum(["INDICA", "SATIVA", "HYBRID", "NA"]),
  thcPercent: z.union([z.coerce.number().min(0).max(100), z.literal(""), z.null(), z.undefined()]).transform((v) =>
    v === "" || v == null ? null : v
  ),
  effects: z
    .string()
    .transform((v) => v.split(",").map((s) => s.trim()).filter(Boolean)),
  description: z.string().trim().min(1, "Description is required"),
  tags: z
    .array(
      z
        .string()
        .trim()
        .toUpperCase()
        .max(30)
        .regex(/^[A-Z0-9]+$/, "Tags must be letters/numbers only, no spaces")
    )
    .default([]),
  featuredSection: z.enum(["NEW_ARRIVALS", "BEST_SELLERS", "NONE"]).default("NONE"),
  active: z.coerce.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
  priceOptions: z.array(priceOptionSchema).min(1, "At least one price option is required"),
});

export type ActionResult = { ok: true; id?: string } | { ok: false; error: string };

export async function createProduct(input: unknown): Promise<ActionResult> {
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const existing = await prisma.product.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return { ok: false, error: "A product with that slug already exists" };
  }

  const { priceOptions, ...data } = parsed.data;
  const product = await prisma.product.create({
    data: {
      ...data,
      priceOptions: {
        create: priceOptions.map((po, i) => ({ ...po, sortOrder: i })),
      },
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
  return { ok: true, id: product.id };
}

export async function updateProduct(id: string, input: unknown): Promise<ActionResult> {
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const existing = await prisma.product.findUnique({ where: { slug: parsed.data.slug } });
  if (existing && existing.id !== id) {
    return { ok: false, error: "A product with that slug already exists" };
  }

  const { priceOptions, ...data } = parsed.data;
  await prisma.$transaction([
    prisma.product.update({ where: { id }, data }),
    prisma.priceOption.deleteMany({ where: { productId: id } }),
    prisma.priceOption.createMany({
      data: priceOptions.map((po, i) => ({ ...po, productId: id, sortOrder: i })),
    }),
  ]);

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}/edit`);
  revalidatePath("/");
  return { ok: true, id };
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/");
  return { ok: true };
}

export async function toggleProductActive(id: string, active: boolean): Promise<ActionResult> {
  await prisma.product.update({ where: { id }, data: { active } });
  revalidatePath("/admin/products");
  revalidatePath("/");
  return { ok: true };
}

const quickPriceSchema = z.object({
  prices: z
    .array(
      z.object({
        id: z.string().trim().min(1),
        priceCents: z.coerce.number().int().positive("Price must be greater than 0"),
      })
    )
    .min(1),
});

export async function updateProductQuickPrices(productId: string, input: unknown): Promise<ActionResult> {
  const parsed = quickPriceSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const owned = await prisma.priceOption.findMany({
    where: { id: { in: parsed.data.prices.map((p) => p.id) }, productId },
    select: { id: true },
  });
  const ownedIds = new Set(owned.map((o) => o.id));
  const updates = parsed.data.prices.filter((p) => ownedIds.has(p.id));
  if (updates.length !== parsed.data.prices.length) {
    return { ok: false, error: "One or more prices don't belong to this product" };
  }

  await prisma.$transaction(
    updates.map((p) => prisma.priceOption.update({ where: { id: p.id }, data: { priceCents: p.priceCents } }))
  );

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}/edit`);
  revalidatePath("/");
  return { ok: true, id: productId };
}

const photoSchema = z.object({
  url: z.string().trim().url("Enter a valid image URL"),
  altText: z.string().trim().max(200).optional(),
});

export async function addProductPhoto(productId: string, input: unknown): Promise<ActionResult> {
  const parsed = photoSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const existingCount = await prisma.productPhoto.count({ where: { productId } });
  await prisma.productPhoto.create({
    data: {
      productId,
      url: parsed.data.url,
      publicId: parsed.data.url,
      altText: parsed.data.altText ?? null,
      isPrimary: existingCount === 0,
      sortOrder: existingCount,
    },
  });
  revalidatePath(`/admin/products/${productId}/edit`);
  revalidatePath("/");
  return { ok: true };
}

export async function deleteProductPhoto(photoId: string, productId: string): Promise<ActionResult> {
  await prisma.productPhoto.delete({ where: { id: photoId } });
  revalidatePath(`/admin/products/${productId}/edit`);
  revalidatePath("/");
  return { ok: true };
}

export async function setPrimaryPhoto(photoId: string, productId: string): Promise<ActionResult> {
  await prisma.$transaction([
    prisma.productPhoto.updateMany({ where: { productId }, data: { isPrimary: false } }),
    prisma.productPhoto.update({ where: { id: photoId }, data: { isPrimary: true } }),
  ]);
  revalidatePath(`/admin/products/${productId}/edit`);
  revalidatePath("/");
  return { ok: true };
}
