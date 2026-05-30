"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  ShoppingBag,
  CreditCard,
  UserPlus,
  Package,
  Star,
} from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useRouter } from "next/navigation";
import { useProfile, useLogout } from "@/hooks/useAuth";
import { getInitials } from "@/lib/utils";

interface Notification {
  id: string;
  icon: React.ElementType;
  text: string;
  subtext?: string;
  time: string;
  isRead: boolean;
}

const mockNotifications: Notification[] = [
  { id: "1", icon: ShoppingBag, text: "New order #ORD-7845",                  time: "2 min ago",  isRead: false },
  { id: "2", icon: CreditCard,  text: "Payment received from Esther Howard",  time: "5 min ago",  isRead: false },
  { id: "3", icon: UserPlus,    text: "New customer registered", subtext: "Brooklyn Simmons", time: "10 min ago", isRead: false },
  { id: "4", icon: Package,     text: 'Product "Smart Watch Series 8"', subtext: "low in stock (5 left)", time: "15 min ago", isRead: true },
  { id: "5", icon: Star,        text: "New review for Wireless Headphones", subtext: "★★★★★", time: "25 min ago", isRead: true },
];

const titleMap: Record<string, string> = {
  "/": "Dashboard",
  "/blog": "Blog Posts",
};

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const logout = useLogout();
  const { data: user } = useProfile();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const notifRef    = useRef<HTMLDivElement>(null);
  const notifBtnRef = useRef<HTMLButtonElement>(null);
  const userRef     = useRef<HTMLDivElement>(null);
  const userBtnRef  = useRef<HTMLButtonElement>(null);

  const unreadCount = mockNotifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    function handleOut(e: MouseEvent) {
      if (
        notifRef.current && notifBtnRef.current &&
        !notifRef.current.contains(e.target as Node) &&
        !notifBtnRef.current.contains(e.target as Node)
      ) setShowNotifications(false);
      if (
        userRef.current && userBtnRef.current &&
        !userRef.current.contains(e.target as Node) &&
        !userBtnRef.current.contains(e.target as Node)
      ) setShowUserMenu(false);
    }
    document.addEventListener("mousedown", handleOut);
    return () => document.removeEventListener("mousedown", handleOut);
  }, []);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setShowNotifications(false);
        setShowUserMenu(false);
      }
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim())
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const getPageTitle = () => {
    const clean = pathname.replace(/\/$/, "").split("?")[0].split("#")[0];
    if (titleMap[clean]) return titleMap[clean];
    const seg = clean.replace(/^\//, "").split("/")[0];
    if (!seg) return "Dashboard";
    return seg.charAt(0).toUpperCase() + seg.slice(1);
  };

  return (
    <header className="sa-header" style={{ justifyContent: "space-between" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 className="sa-header-title">{getPageTitle()}</h1>
      </div>

      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <form onSubmit={handleSearch} className="sa-search-wrap" style={{position: "relative", left: "-60px" }}>
          <Search className="sa-search-icon" size={16} />
          <input
            type="text"
            placeholder="Search for products, orders, customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="sa-search-input"
          />
          <div className="sa-search-kbd">
            <kbd className="sa-kbd">⌘</kbd>
            <kbd className="sa-kbd">K</kbd>
          </div>
        </form>
      </div>

      <div style={{ flex: 1, display: "flex", justifyContent: "flex-end", gap: 6 }}>
        <ThemeToggle />

        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <button
            ref={notifBtnRef}
            className="sa-icon-btn"
            aria-label="Notifications"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="sa-notif-dot">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div
              ref={notifRef}
              className="sa-dropdown-menu"
              style={{ right: 0, top: "calc(100% + 8px)", width: 320 }}
            >
              <div
                style={{
                  padding: "14px 16px",
                  borderBottom: "1px solid var(--sa-card-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--sa-text-primary)" }}>
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <span
                    style={{
                      background: "var(--sa-indigo-100)",
                      color: "var(--sa-indigo)",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: 20,
                    }}
                  >
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div style={{ maxHeight: 320, overflowY: "auto" }}>
                {mockNotifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div
                      key={n.id}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        padding: "12px 16px",
                        cursor: "pointer",
                        backgroundColor: !n.isRead
                          ? "rgba(79,70,229,0.04)"
                          : "transparent",
                        transition: "background-color 0.12s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "var(--sa-slate-100)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = !n.isRead
                          ? "rgba(79,70,229,0.04)"
                          : "transparent")
                      }
                    >
                      <div
                        className="sa-activity-icon"
                        style={{
                          backgroundColor: !n.isRead
                            ? "var(--sa-indigo-100)"
                            : "var(--sa-slate-100)",
                          color: !n.isRead
                            ? "var(--sa-indigo)"
                            : "var(--sa-text-secondary)",
                        }}
                      >
                        <Icon size={14} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: "0.8125rem", margin: 0, color: "var(--sa-text-primary)" }}>
                          {n.text}
                        </p>
                        {n.subtext && (
                          <p style={{ fontSize: "0.72rem", margin: "2px 0 0", color: "var(--sa-text-secondary)" }}>
                            {n.subtext}
                          </p>
                        )}
                        <p style={{ fontSize: "0.7rem", color: "var(--sa-text-muted)", margin: "4px 0 0" }}>
                          {n.time}
                        </p>
                      </div>
                      {!n.isRead && (
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor: "var(--sa-indigo)",
                            marginTop: 6,
                            flexShrink: 0,
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              <div
                style={{
                  padding: "12px 16px",
                  borderTop: "1px solid var(--sa-card-border)",
                  textAlign: "center",
                }}
              >
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--sa-indigo)",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={{ position: "relative" }}>
          <button
            ref={userBtnRef}
            className="sa-user-btn"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
          >
            <div className="sa-avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt={user?.name || "User"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                getInitials(user?.name || "Alex Johnson")
              )}
            </div>
            <div className="sa-user-info d-none d-md-block">
              <div className="sa-user-name">{user?.name || "Alex Johnson"}</div>
              <div className="sa-user-role">
                {user?.role === "SUPER_ADMIN" ? "Super Admin" : user?.role || "Super Admin"}
              </div>
            </div>
            <ChevronDown size={15} color="var(--sa-text-muted)" />
          </button>

          {showUserMenu && (
            <div
              ref={userRef}
              className="sa-dropdown-menu"
              style={{ right: 0, top: "calc(100% + 8px)", width: 220 }}
            >
              <div
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid var(--sa-card-border)",
                }}
              >
                <p style={{ fontWeight: 600, fontSize: "0.875rem", margin: 0, color: "var(--sa-text-primary)" }}>
                  {user?.name || "Alex Johnson"}
                </p>
                <p style={{ fontSize: "0.75rem", color: "var(--sa-text-secondary)", margin: "2px 0 0" }}>
                  {user?.email || "alex@example.com"}
                </p>
              </div>
              <div style={{ padding: "4px 0" }}>
                <button
                  className="sa-dropdown-item"
                  onClick={() => { setShowUserMenu(false); router.push("/profile"); }}
                >
                  <User size={15} color="var(--sa-text-muted)" />
                  View Profile
                </button>
                <button
                  className="sa-dropdown-item"
                  onClick={() => { setShowUserMenu(false); router.push("/settings"); }}
                >
                  <Settings size={15} color="var(--sa-text-muted)" />
                  Settings
                </button>
              </div>
              <div className="sa-dropdown-divider" />
              <div style={{ padding: "4px 0" }}>
                <button
                  className="sa-dropdown-item danger"
                  onClick={() => { setShowUserMenu(false); logout(); }}
                >
                  <LogOut size={15} />
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}