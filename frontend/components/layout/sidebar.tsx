"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart2,
  ShoppingCart,
  Package,
  Users,
  Layers,
  FileText,
  Tags,
  Tag,
  Megaphone,
  ShieldCheck,
  Settings,
  LogOut,
  AlignJustify,
  ChevronRight,
} from "lucide-react";
import { useLogout } from "@/hooks/useAuth";
import { useSidebar } from "@/contexts/SidebarContext";

const mainRoutes = [
  { name: "Overview",   href: "/",          icon: LayoutDashboard },
  { name: "Analytics",  href: "/analytics", icon: BarChart2 },
  { name: "Orders",     href: "/orders",    icon: ShoppingCart, badge: 25 },
  { name: "Products",   href: "/products",  icon: Package },
  { name: "Customers",  href: "/customers", icon: Users },
  { name: "Inventory",  href: "/inventory", icon: Layers },
];
const contentRoutes = [
  { name: "Blog Posts", href: "/blog",       icon: FileText },
  { name: "Categories", href: "/categories", icon: Tags },
];
const marketingRoutes = [
  { name: "Coupons",   href: "/coupons",   icon: Tag },
  { name: "Campaigns", href: "/campaigns", icon: Megaphone },
];

type RouteItem = {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
};

function NavGroup({
  label,
  routes,
  logout,
  isCollapsed,
}: {
  label: string;
  routes: RouteItem[];
  logout?: () => void;
  isCollapsed: boolean;
}) {
  const pathname = usePathname();

  return (
    <div>
      {!isCollapsed && <p className="sa-nav-section-label">{label}</p>}
      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {routes.map((route) => {
          const Icon = route.icon;
          const isActive =
            pathname === route.href ||
            (route.href !== "/" && pathname?.startsWith(`${route.href}/`));

          if (route.name === "Log Out") {
            return (
              <button
                key="logout"
                onClick={logout}
                className="sa-nav-link"
                title={isCollapsed ? "Log Out" : undefined}
                style={
                  isCollapsed
                    ? { justifyContent: "center", padding: "10px 0" }
                    : {}
                }
              >
                <Icon size={17} style={{ flexShrink: 0 }} />
                {!isCollapsed && <span>Log Out</span>}
              </button>
            );
          }

          return (
            <Link
              key={route.href}
              href={route.href}
              className={`sa-nav-link${isActive ? " active" : ""}`}
              title={isCollapsed ? route.name : undefined}
              style={
                isCollapsed
                  ? { justifyContent: "center", padding: "10px 0" }
                  : {}
              }
            >
              <Icon size={17} style={{ flexShrink: 0 }} />
              {!isCollapsed && (
                <>
                  <span style={{ flex: 1 }}>{route.name}</span>
                  {route.badge != null && (
                    <span className="sa-nav-badge">{route.badge}</span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default function Sidebar() {
  const logout = useLogout();
  const { isCollapsed, toggle } = useSidebar();

  const settingsRoutes: RouteItem[] = [
    { name: "Users & Roles", href: "/users-roles", icon: ShieldCheck },
    { name: "Settings",      href: "/settings",    icon: Settings },
    { name: "Log Out",       href: "#",            icon: LogOut },
  ];

  return (
    <aside
      style={{
        width: isCollapsed
          ? "var(--sidebar-collapsed-width)"
          : "var(--sidebar-expanded-width)",
        flexShrink: 0,
        backgroundColor: "var(--sa-sidebar-bg)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderRight: "1px solid var(--sa-sidebar-border)",
        overflow: "hidden",
        transition: "width 0.25s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: 70,
          padding: isCollapsed ? "0 10px" : "0 18px",
          borderBottom: "1px solid var(--sa-sidebar-border)",
          gap: 8,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flex: 1,
            minWidth: 0,
            justifyContent: isCollapsed ? "center" : "flex-start",
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              backgroundColor: "var(--sa-indigo)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            <img
              src="/images/logo-icon.png"
              alt="Admin Panel"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
          {!isCollapsed && (
            <span
              style={{
                color: "#fff",
                fontWeight: 700,
                fontSize: "1.0625rem",
                whiteSpace: "nowrap",
              }}
            >
              ADMIN PANEL
            </span>
          )}
        </div>

        {!isCollapsed && (
          <button
            onClick={toggle}
            title="Collapse sidebar"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#6B7280",
              padding: 4,
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#D1D5DB")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
          >
            <AlignJustify size={19} />
          </button>
        )}
      </div>

      <div
        style={{
          flex: 1,
          padding: isCollapsed ? "16px 8px" : "10px 10px",
          display: "flex",
          flexDirection: "column",
          gap: isCollapsed ? 8 : 24,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <NavGroup label="Main"      routes={mainRoutes}      logout={logout} isCollapsed={isCollapsed} />
        <NavGroup label="Content"   routes={contentRoutes}   logout={logout} isCollapsed={isCollapsed} />
        <NavGroup label="Marketing" routes={marketingRoutes} logout={logout} isCollapsed={isCollapsed} />
        <NavGroup label="Settings"  routes={settingsRoutes}  logout={logout} isCollapsed={isCollapsed} />
      </div>

      <div
        style={{
          padding: 16,
          borderTop: "1px solid var(--sa-sidebar-border)",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {isCollapsed && (
          <button
            onClick={toggle}
            title="Expand sidebar"
            style={{
              background: "rgba(255, 255, 255, 0.12)",
              border: "none",
              cursor: "pointer",
              color: "#D1D5DB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: "50%",
              margin: "0 auto",
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
              e.currentTarget.style.color = "#FFFFFF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)";
              e.currentTarget.style.color = "#D1D5DB";
            }}
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </aside>
  );
}