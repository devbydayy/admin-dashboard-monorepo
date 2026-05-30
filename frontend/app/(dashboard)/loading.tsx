import { Skeleton } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="p-4">
      <Skeleton style={{ height: 32, width: 180 }} className="rounded mb-4" />

      <div className="row g-4 mb-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="col-12 col-sm-6 col-xl-3">
            <div className="card shadow-sm h-100 rounded-4">
              <div className="card-body">
                <div className="d-flex justify-content-between mb-3">
                  <Skeleton style={{ height: 16, width: 100 }} className="rounded" />
                  <Skeleton style={{ width: 40, height: 40, borderRadius: "var(--sa-card-radius)" }} />
                </div>
                <Skeleton style={{ height: 28, width: 140 }} className="rounded mb-2" />
                <Skeleton style={{ height: 14, width: 160 }} className="rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-12 col-xl-5">
          <div className="card shadow-sm h-100 rounded-4">
            <div className="card-body">
              <Skeleton style={{ height: 20, width: 160 }} className="rounded mb-3" />
              <Skeleton style={{ height: 260 }} className="rounded" />
            </div>
          </div>
        </div>
        <div className="col-12 col-xl-4">
          <div className="card shadow-sm h-100 rounded-4">
            <div className="card-body">
              <Skeleton style={{ height: 20, width: 140 }} className="rounded mb-3" />
              <Skeleton style={{ height: 260 }} className="rounded" />
            </div>
          </div>
        </div>
        <div className="col-12 col-xl-3">
          <div className="card shadow-sm h-100 rounded-4">
            <div className="card-body">
              <Skeleton style={{ height: 20, width: 120 }} className="rounded mb-3" />
              {[...Array(5)].map((_, i) => (
                <div key={i} className="d-flex align-items-center gap-3 mb-3">
                  <Skeleton style={{ width: 40, height: 40, borderRadius: "var(--sa-card-radius)" }} />
                  <div className="flex-grow-1">
                    <Skeleton style={{ height: 14, width: "80%" }} className="rounded mb-2" />
                    <Skeleton style={{ height: 12, width: "60%" }} className="rounded" />
                  </div>
                  <Skeleton style={{ height: 14, width: 50 }} className="rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}