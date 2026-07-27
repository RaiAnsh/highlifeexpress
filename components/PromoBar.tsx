export function PromoBar({ messages }: { messages: string[] }) {
  const items = [...messages, ...messages];
  return (
    <div className="promo-bar">
      <div className="promo-inner">
        {items.map((msg, i) => (
          <span key={i} style={{ display: "contents" }}>
            <span>{msg}</span>
            <span className="dot">&bull;</span>
          </span>
        ))}
      </div>
    </div>
  );
}
