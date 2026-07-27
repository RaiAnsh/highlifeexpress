"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSite } from "@/lib/site-context";

export function SiteNav({ showSearch = false }: { showSearch?: boolean }) {
  const pathname = usePathname();
  const { cartCount, openCart, searchTerm, setSearchTerm } = useSite();
  const [searchOpen, setSearchOpen] = useState(false);

  function scrollLink(targetId: string) {
    return (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (pathname !== "/") return; // let Link navigate normally to /#id
      e.preventDefault();
      if (targetId === "top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
  }

  function toggleSearch() {
    setSearchOpen((open) => {
      const next = !open;
      if (!next) setSearchTerm("");
      return next;
    });
  }

  return (
    <nav>
      <div className="nav-logo">
        <Link href="/">
          <img src="/assets/logo.png" alt="High Life Express" style={{ height: 88, width: "auto", display: "block" }} />
        </Link>
      </div>
      <ul className="nav-links">
        <li>
          <Link href="/" onClick={scrollLink("top")}>Home</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
        <li>
          <Link href="/#new-arrivals" onClick={scrollLink("new-arrivals")}>Shop</Link>
        </li>
        <li>
          <Link href="/contact">Contact</Link>
        </li>
      </ul>
      <div className="nav-right">
        {showSearch && (
          <>
            <button className="search-icon-btn" onClick={toggleSearch} aria-label="Search">
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            </button>
            <input
              type="text"
              className={`search-input${searchOpen ? " open" : ""}`}
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </>
        )}
        <div className="cart-wrap" onClick={openCart}>
          <svg viewBox="0 0 24 24"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
          <span className="cart-badge">{cartCount}</span>
        </div>
      </div>
    </nav>
  );
}
