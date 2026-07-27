"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { markMessageHandled } from "@/app/actions/admin-reservations";

export function MessageRow({
  id,
  name,
  email,
  message,
  createdAt,
  handled,
}: {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  handled: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      await markMessageHandled(id, !handled);
      router.refresh();
    });
  }

  return (
    <tr>
      <td>{name}</td>
      <td>{email}</td>
      <td style={{ maxWidth: 320 }}>{message}</td>
      <td>{createdAt}</td>
      <td>
        <span className={`admin-badge ${handled ? "on" : "off"}`}>{handled ? "Handled" : "New"}</span>
      </td>
      <td className="actions">
        <button className="admin-btn secondary" disabled={isPending} onClick={toggle}>
          Mark {handled ? "Unhandled" : "Handled"}
        </button>
      </td>
    </tr>
  );
}
