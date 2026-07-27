"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/app/actions/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const data = new FormData(e.currentTarget);
    const input = {
      username: String(data.get("username") ?? ""),
      password: String(data.get("password") ?? ""),
    };

    startTransition(async () => {
      const result = await login(input);
      if (result.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <h1>High Life Express</h1>
        <p className="subtitle">Admin sign in</p>
        <form onSubmit={handleSubmit}>
          <input type="text" name="username" placeholder="Username" required autoFocus />
          <input type="password" name="password" placeholder="Password" required />
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" disabled={isPending}>
            {isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
