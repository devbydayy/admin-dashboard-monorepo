import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { DateRangeProvider } from "@/contexts/DateRangeContext";
import { SidebarProvider } from "@/contexts/SidebarContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DateRangeProvider>
        <div className="sa-shell">
          <Sidebar />
          <div className="sa-main-col">
            <Header />
            <main className="sa-content">{children}</main>
          </div>
        </div>
      </DateRangeProvider>
    </SidebarProvider>
  );
}