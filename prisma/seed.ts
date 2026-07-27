import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { CATEGORIES, PRODUCTS, SITE_SETTINGS } from "./seed-data";

async function seedAdmin() {
  const username = process.env.ADMIN_INITIAL_USERNAME;
  const password = process.env.ADMIN_INITIAL_PASSWORD;
  if (!username || !password) {
    throw new Error("ADMIN_INITIAL_USERNAME / ADMIN_INITIAL_PASSWORD must be set in .env");
  }

  const existing = await prisma.adminUser.findUnique({ where: { username } });
  if (existing) {
    console.log(`AdminUser "${username}" already exists — skipping.`);
  } else {
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.adminUser.create({ data: { username, passwordHash } });
    console.log(`Created AdminUser "${username}".`);
  }
}

async function seedCategories() {
  const bySlug = new Map<string, string>();
  for (const cat of CATEGORIES) {
    const row = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, iconKey: cat.iconKey, sortOrder: cat.sortOrder },
      create: cat,
    });
    bySlug.set(cat.slug, row.id);
  }
  console.log(`Seeded ${CATEGORIES.length} categories.`);
  return bySlug;
}

async function seedProducts(categoryIdBySlug: Map<string, string>) {
  for (const p of PRODUCTS) {
    const categoryId = categoryIdBySlug.get(p.categorySlug);
    if (!categoryId) {
      throw new Error(`Unknown category slug "${p.categorySlug}" for product "${p.slug}"`);
    }

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        categoryId,
        strainType: p.strainType,
        thcPercent: p.thcPercent ?? null,
        effects: p.effects,
        description: p.description,
        tags: p.tags,
        featuredSection: p.featuredSection,
        sortOrder: p.sortOrder,
      },
      create: {
        name: p.name,
        slug: p.slug,
        categoryId,
        strainType: p.strainType,
        thcPercent: p.thcPercent ?? null,
        effects: p.effects,
        description: p.description,
        tags: p.tags,
        featuredSection: p.featuredSection,
        sortOrder: p.sortOrder,
      },
    });

    await prisma.priceOption.deleteMany({ where: { productId: product.id } });
    await prisma.priceOption.createMany({
      data: p.priceOptions.map((po, i) => ({
        productId: product.id,
        label: po.label,
        priceCents: po.priceCents,
        compareAtPriceCents: po.compareAtPriceCents ?? null,
        sortOrder: i,
      })),
    });

    if (p.photoFile) {
      const existingPhoto = await prisma.productPhoto.findFirst({ where: { productId: product.id } });
      if (!existingPhoto) {
        await prisma.productPhoto.create({
          data: {
            productId: product.id,
            url: `/photos/${p.photoFile}`,
            publicId: p.photoFile,
            altText: p.name,
            isPrimary: true,
            sortOrder: 0,
          },
        });
      }
    }
  }
  console.log(`Seeded ${PRODUCTS.length} products.`);
}

async function seedSiteSettings() {
  for (const [key, value] of Object.entries(SITE_SETTINGS)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: {},
      create: { key, value },
    });
  }
  console.log(`Seeded ${Object.keys(SITE_SETTINGS).length} site settings.`);
}

async function main() {
  await seedAdmin();
  const categoryIdBySlug = await seedCategories();
  await seedProducts(categoryIdBySlug);
  await seedSiteSettings();
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
