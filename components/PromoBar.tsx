const MESSAGES = [
  "SAME DAY DELIVERY \u2014 DELIVERY WITHIN 1-3 HRS",
  "SERVING ONTARIO (19+) ONLY",
  "LICENSED ONTARIO DISPENSARY",
  "FREE DELIVERY",
  "PHONE: 647 551-0846 \u00b7 MINIMUM ORDER $60 FOR FREE DELIVERY",
  "PREMIUM QUALITY GUARANTEED",
  "NEW STRAINS DROPPING WEEKLY",
  "RESERVE ONLINE \u2014 PICK UP IN-STORE",
];

export function PromoBar() {
  const items = [...MESSAGES, ...MESSAGES];
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
