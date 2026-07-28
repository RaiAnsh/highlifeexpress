"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendNotificationEmail } from "@/lib/email";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  email: z.string().trim().email("A valid email is required"),
  message: z.string().trim().min(1, "Message is required").max(4000),
});

export type ContactResult = { ok: true } | { ok: false; error: string };

export async function submitContactMessage(input: unknown): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid message" };
  }
  await prisma.contactMessage.create({ data: parsed.data });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  await sendNotificationEmail(
    `New contact message \u2014 ${parsed.data.name}`,
    `<p><strong>${parsed.data.name}</strong> (${parsed.data.email}) sent a message:</p>
     <p>${parsed.data.message.replace(/\n/g, "<br>")}</p>
     <p><a href="${siteUrl}/admin/messages">View in admin panel</a></p>`
  );

  return { ok: true };
}
