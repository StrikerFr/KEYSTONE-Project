import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  BriefcaseBusiness,
  Camera,
  Check,
  Clock3,
  MapPin,
  PackagePlus,
  Pause,
  Play,
  Plus,
  Timer,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { store, useServiceRequests, useWorkOrders } from "@/lib/store";
import { toast } from "sonner";
import { Metric, PageHeader, Panel } from "./shared";
import { StatusPill } from "./status";

export function CustomerPortal({ page = "dashboard" }: { page?: "dashboard" | "requests" | "work-orders" }) {
  const workOrders = useWorkOrders();
  const requests = useServiceRequests();

  const customerOrders = workOrders.filter((w) => w.customer === "XYZ Mall" || w.customer.toLowerCase().includes("xyz"));
  const openRequestsCount = requests.filter((r) => r.customer === "XYZ Mall" && r.status !== "Converted").length;
  const activeOrdersCount = customerOrders.filter((w) => w.status !== "Completed" && w.status !== "Closed").length;

  return (
    <div className="min-h-screen bg-background">
      <PortalHeader
        role="Customer portal"
        name="XYZ Mall"
        links={[
          ["Dashboard", "/customer/dashboard"],
          ["Requests", "/customer/requests"],
          ["Work Orders", "/customer/work-orders"],
        ]}
      />
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        {page === "dashboard" ? (
          <>
            <PageHeader
              eyebrow="Customer workspace"
              title="Good afternoon, XYZ Mall."
              description="Your service activity and facility status, in one place."
              actions={
                <Button onClick={() => toast.success("Service request portal open")}>
                  <Plus />
                  Report an Issue
                </Button>
              }
            />
            <div className="grid grid-cols-1 gap-y-5 border-y border-border py-5 sm:grid-cols-3">
              <Metric value={String(openRequestsCount || 3)} label="Open Requests" context="Under active review" />
              <Metric value={String(activeOrdersCount || 2)} label="Active Work Orders" context="Technicians assigned" />
              <Metric value="18" label="Completed Jobs" context="This quarter" />
            </div>
            <Panel title="Recent service activity">
              <OrderList orders={customerOrders.length > 0 ? customerOrders : workOrders.slice(0, 3)} />
            </Panel>
          </>
        ) : (
          <>
            <PageHeader
              eyebrow="Customer workspace"
              title={page === "requests" ? "Service Requests" : "Work Orders"}
              description="Track progress without operational complexity."
              actions={
                <Button onClick={() => toast.success("Service request portal open")}>
                  <Plus />
                  Report an Issue
                </Button>
              }
            />
            <Panel>
              <OrderList orders={customerOrders.length > 0 ? customerOrders : workOrders} />
            </Panel>
          </>
        )}
      </main>
    </div>
  );
}

export function TechnicianPortal({ detail = false }: { detail?: boolean }) {
  const workOrders = useWorkOrders();
  const techJobs = workOrders.filter((w) => w.technician === "Rahul Sharma" || w.status === "In Progress" || w.status === "Assigned");
  const w = techJobs[0] || workOrders[0];
  const [started, setStarted] = useState(detail || (w && w.status === "In Progress"));

  if (!w) return null;

  const handleStartWork = () => {
    setStarted(true);
    store.updateWorkOrderStatus(w.id, "In Progress", "Technician started timer on site.");
    toast.success("Work timer started on site");
  };

  const handleCompleteWork = () => {
    store.updateWorkOrderStatus(w.id, "Completed", "Technician marked job as completed.");
    toast.success(`${w.id} marked as completed`);
  };

  return (
    <div className="min-h-screen bg-background">
      <PortalHeader
        role="Technician workspace"
        name="Rahul Sharma"
        links={[
          ["Today", "/technician/dashboard"],
          ["My Jobs", "/technician/jobs"],
        ]}
      />
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
        {!detail && (
          <PageHeader
            eyebrow="Friday | Sep 18"
            title="Good morning, Rahul."
            description={`You have ${techJobs.length || 3} assigned jobs in your active queue.`}
          />
        )}
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,.8fr)]">
          <Panel title="Current job" description={`SLA: ${w.sla}`}>
            <div className="p-5">
              <div className="flex min-w-0 flex-col items-start gap-3 sm:flex-row sm:justify-between">
                <div className="min-w-0">
                  <Link to="/technician/jobs/$id" params={{ id: w.id }} className="font-mono text-xs text-primary">
                    {w.id}
                  </Link>
                  <h2 className="mt-2 text-xl font-semibold">{w.issue}</h2>
                  <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {w.customer} | {w.location}
                  </p>
                </div>
                <StatusPill value={w.status} />
              </div>
              {!started && w.status !== "In Progress" && w.status !== "Completed" ? (
                <Button className="mt-8 w-full" size="lg" onClick={handleStartWork}>
                  <Play />
                  Start Work
                </Button>
              ) : (
                <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  <Action icon={<Pause />} label="Pause" onClick={() => store.updateWorkOrderStatus(w.id, "On Hold")} />
                  <Action icon={<Wrench />} label="Add Note" onClick={() => toast.success("Diagnostic notes recorded")} />
                  <Action icon={<PackagePlus />} label="Add Part" onClick={() => toast.success("Part requisition submitted")} />
                  <Action icon={<Timer />} label="Log Time" onClick={() => toast.success("Time tracked: 1 hr 15 mins")} />
                  <Action icon={<Camera />} label="Upload Photo" onClick={() => toast.success("Diagnostic photo attached")} />
                  <Action icon={<Check />} label="Complete Work" primary onClick={handleCompleteWork} />
                </div>
              )}
            </div>
          </Panel>
          <div className="space-y-5">
            <Panel title="Today's progress">
              <div className="grid grid-cols-1 gap-y-5 p-4 text-center sm:grid-cols-3">
                <Metric value={String(techJobs.length || 3)} label="Scheduled" context="Today" />
                <Metric value="1" label="Completed" context="On time" />
                <Metric value="96%" label="SLA" context="30 days" />
              </div>
            </Panel>
            <Panel title="Next job">
              <div className="p-4">
                <span className="font-mono text-xs text-primary">WO-1047</span>
                <p className="mt-2 text-sm font-medium">Air quality sensor calibration</p>
                <p className="mt-2 text-xs text-muted-foreground">Metro Plaza | 1:30 PM</p>
              </div>
            </Panel>
          </div>
        </div>
        {!detail && (
          <Panel title="Today's schedule">
            <OrderList orders={techJobs} />
          </Panel>
        )}
      </main>
    </div>
  );
}

function Action({
  icon,
  label,
  primary = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  primary?: boolean;
  onClick?: () => void;
}) {
  return (
    <Button
      variant={primary ? "default" : "quiet"}
      onClick={() => {
        if (onClick) onClick();
        else toast.success(`${label} action recorded`);
      }}
    >
      {icon}
      {label}
    </Button>
  );
}

function PortalHeader({ role, name, links }: { role: string; name: string; links: readonly (readonly [string, string])[] }) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
            <BriefcaseBusiness className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold tracking-[.12em]">KEYSTONE</p>
            <p className="truncate text-[9px] text-muted-foreground">{role}</p>
          </div>
        </Link>
        <nav className="hidden gap-1 sm:flex">
          {links.map(([label, path]) => (
            <Link
              key={path}
              to={path}
              className="rounded-md px-3 py-2 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              {label}
            </Link>
          ))}
        </nav>
        <span className="hidden text-xs md:block">{name}</span>
      </div>
    </header>
  );
}

function OrderList({ orders }: { orders?: any[] }) {
  const workOrders = useWorkOrders();
  const list = orders && orders.length > 0 ? orders : workOrders.slice(0, 3);

  return (
    <div className="divide-y divide-border">
      {list.map((w) => (
        <div key={w.id} className="grid gap-3 p-4 sm:grid-cols-[100px_1fr_auto] sm:items-center">
          <Link to="/work-orders/$id" params={{ id: w.id }} className="font-mono text-xs text-primary hover:underline">
            {w.id}
          </Link>
          <div>
            <p className="text-sm font-medium">{w.issue}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {w.customer} | {w.location}
            </p>
          </div>
          <StatusPill value={w.status} />
        </div>
      ))}
    </div>
  );
}
