import { getSiteSettings } from "@/lib/queries";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { PasswordChangeForm } from "@/components/admin/PasswordChangeForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Settings</h1>
          <p>Site contact info, hours, and storefront behavior.</p>
        </div>
      </div>

      <div className="admin-card">
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: "var(--purple)", marginBottom: 14 }}>Site Info</h2>
        <SettingsForm settings={settings} />
      </div>

      <div className="admin-card">
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: "var(--purple)", marginBottom: 14 }}>Change Password</h2>
        <PasswordChangeForm />
      </div>
    </>
  );
}
