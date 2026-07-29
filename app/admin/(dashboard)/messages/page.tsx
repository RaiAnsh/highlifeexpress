import { prisma } from "@/lib/prisma";
import { MessageRow } from "@/components/admin/MessageRow";
import { formatTorontoDateTime } from "@/lib/format-date";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Contact Messages</h1>
          <p>{messages.length} message{messages.length === 1 ? "" : "s"} received.</p>
        </div>
      </div>

      <div className="admin-card">
        {messages.length === 0 ? (
          <p className="admin-empty">No messages yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Received</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m) => (
                <MessageRow
                  key={m.id}
                  id={m.id}
                  name={m.name}
                  email={m.email}
                  message={m.message}
                  createdAt={formatTorontoDateTime(m.createdAt)}
                  handled={m.handled}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
