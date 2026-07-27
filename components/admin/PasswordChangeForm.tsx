"use client";

import { useState, useTransition } from "react";
import { changeAdminPassword } from "@/app/actions/settings";

export function PasswordChangeForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    const data = new FormData(e.currentTarget);
    const input = {
      currentPassword: String(data.get("currentPassword") ?? ""),
      newPassword: String(data.get("newPassword") ?? ""),
    };
    startTransition(async () => {
      const result = await changeAdminPassword(input);
      if (result.ok) {
        setSuccess(true);
        (document.getElementById("password-form") as HTMLFormElement)?.reset();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <form id="password-form" className="admin-form" onSubmit={handleSubmit}>
      {error && <p className="admin-error-banner">{error}</p>}
      {success && <p className="admin-success-banner">Password updated.</p>}
      <div>
        <label>Current Password</label>
        <input type="password" name="currentPassword" required />
      </div>
      <div>
        <label>New Password</label>
        <input type="password" name="newPassword" required minLength={8} />
      </div>
      <div className="admin-form-actions">
        <button type="submit" className="admin-btn" disabled={isPending}>
          {isPending ? "Updating..." : "Change Password"}
        </button>
      </div>
    </form>
  );
}
