"use client";

import { useState, useTransition } from "react";
import { submitContactMessage } from "@/app/actions/contact";

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const input = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
    };

    startTransition(async () => {
      const result = await submitContactMessage(input);
      if (result.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
        setError(result.error);
      }
    });
  }

  if (status === "success") {
    return <p className="reservation-success">Thanks for reaching out — we&apos;ll get back to you soon.</p>;
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Your Name" required />
      <input type="email" name="email" placeholder="Your Email" required />
      <textarea name="message" placeholder="How can we help?" required />
      {status === "error" && <p className="reservation-error">{error}</p>}
      <button type="submit" disabled={isPending}>
        {isPending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
