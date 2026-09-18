import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  Bell,
  Boxes,
  Building2,
  CalendarDays,
  ChartNoAxesCombined,
  CheckCheck,
  ChevronsLeft,
  CircleHelp,
  ClipboardList,
  Gauge,
  HardHat,
  Hexagon,
  Menu,
  Package,
  Search,
  Settings,
  ShieldAlert,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { store, useCustomers, useNotifications, useTechnicians, useWorkOrders } from "@/lib/store";
import { ThemeToggle } from "./theme";
import { cn } from "@/lib/utils";

const nav = [
  ["Overview", "/dashboard", Gauge],
  ["Work Orders", "/work-orders", ClipboardList],
  ["Service Requests", "/service-requests", Wrench],
  ["Schedule", "/schedule", CalendarDays],
  ["Technicians", "/technicians", HardHat],
  ["Customers", "/customers", Users],
  ["Assets", "/assets", Boxes],
  ["Inventory", "/inventory", Package],
  ["SLA and Alerts", "/sla", ShieldAlert],
  ["Reports", "/reports", ChartNoAxesCombined],
] as const;

function Mark({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-primary/30 bg-primary/10 text-primary">
        <Hexagon className="h-4 w-4" />
      </span>
      {!collapsed && (
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold tracking-[.16em]">KEYSTONE</p>
          <p className="truncate text-[9px] text-muted-foreground">FIELD OPERATIONS</p>
        </div>
      )}
    </div>
  );
}

function CommandPalette({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const workOrders = useWorkOrders();
  const customers = useCustomers();
  const technicians = useTechnicians();

  const results = [
    ...workOrders.map((x) => ({ label: `${x.id} | ${x.issue} (${x.customer})`, path: `/work-orders/${x.id}` })),
    ...customers.map((x) => ({ label: `${x.name} (Customer)`, path: `/customers/${x.id}` })),
    ...technicians.map((x) => ({ label: `${x.name} (${x.specialization})`, path: `/technicians/${x.id}` })),
    { label: "Create Work Order", path: "/work-orders" },
    { label: "Open Schedule", path: "/schedule" },
    { label: "Open Reports", path: "/reports" },
  ]
    .filter((x) => x.label.toLowerCase().includes(q.toLowerCase()))
    .slice(0, 8);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="top-[18%] translate-y-0 gap-0 overflow-hidden border-border bg-popover p-0 sm:max-w-xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Global search</DialogTitle>
          <DialogDescription>Search and navigate KEYSTONE</DialogDescription>
        </DialogHeader>
        <div className="flex items-center border-b border-border px-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search work orders, customers, technicians..."
            className="h-14 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="text-[10px] text-muted-foreground">ESC</kbd>
        </div>
        <div className="max-h-80 overflow-auto p-2">
          {results.length === 0 ? (
            <div className="p-4 text-center text-xs text-muted-foreground">No matching operational records found.</div>
          ) : (
            results.map((r) => (
              <Button
                key={r.label}
                variant="ghost"
                className="h-10 w-full justify-start text-sm"
                onClick={() => {
                  setOpen(false);
                  void router.navigate({ to: r.path });
                }}
              >
                <Search className="text-muted-foreground" />
                {r.label}
              </Button>
            ))
          )}
        </div>
        <div className="border-t border-border px-4 py-2 text-[10px] text-muted-foreground">
          Use search query to filter | Press Enter to open
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Notifications({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const notifications = useNotifications();
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-full border-border bg-popover p-0 sm:max-w-md">
        <SheetHeader className="flex flex-row items-center justify-between border-b border-border px-5 py-4 text-left">
          <SheetTitle className="text-sm">Notification center</SheetTitle>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-7 text-[10px]" onClick={() => store.markAllNotificationsRead()}>
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </Button>
          )}
        </SheetHeader>
        <div className="max-h-[calc(100vh-80px)] divide-y divide-border overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground">No notifications at this time.</div>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className={cn("grid grid-cols-[auto_minmax(0,1fr)] gap-3 p-4 hover:bg-accent/50", n.unread && "bg-accent/20")}>
                <span
                  className={cn(
                    "mt-1.5 h-2 w-2 rounded-full",
                    n.kind === "critical"
                      ? "bg-critical"
                      : n.kind === "warning"
                      ? "bg-warning"
                      : n.kind === "success"
                      ? "bg-success"
                      : "bg-info"
                  )}
                />
                <div>
                  <p className="text-xs font-medium">{n.title}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{n.body}</p>
                  <p className="mt-2 text-[10px] text-muted-foreground">{n.time}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Sidebar({
  collapsed,
  setCollapsed,
  mobile = false,
  onNavigate,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-border bg-surface-1 transition-[width] duration-200",
        mobile ? "w-full" : collapsed ? "w-[72px]" : "w-[236px]"
      )}
    >
      <div className={cn("flex h-16 items-center border-b border-border", collapsed && !mobile ? "justify-center px-2" : "justify-between px-5")}>
        {collapsed && !mobile ? (
          <button
            onClick={() => setCollapsed(false)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-primary/30 bg-primary/10 text-primary transition-all hover:border-primary/50 hover:bg-primary/20 focus:outline-none"
            title="Expand sidebar"
            aria-label="Expand sidebar"
          >
            <Hexagon className="h-5 w-5" />
          </button>
        ) : (
          <>
            <div>
              <Mark collapsed={false} />
            </div>
            {!mobile && (
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => setCollapsed(true)}
                aria-label="Collapse sidebar"
                title="Collapse sidebar"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
            )}
          </>
        )}
      </div>
      <div className={cn("py-4", collapsed && !mobile ? "px-2" : "px-3")}>
        {(!collapsed || mobile) && (
          <button className="mb-4 flex w-full items-center justify-between rounded-md border border-border bg-surface-2 px-3 py-2 text-left">
            <span>
              <span className="block text-[10px] text-muted-foreground">WORKSPACE</span>
              <span className="block text-xs font-medium">Northstar Operations</span>
            </span>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
        <nav className="space-y-1">
          {nav.map(([label, to, Icon]) => {
            const active = path === to || (to !== "/dashboard" && path.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                onClick={onNavigate}
                title={collapsed && !mobile ? label : undefined}
                className={cn(
                  "flex h-9 items-center rounded-md text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                  collapsed && !mobile ? "mx-auto w-9 justify-center px-0" : "gap-3 px-3",
                  active && "bg-primary/10 font-medium text-primary"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {(!collapsed || mobile) && <span className="truncate">{label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className={cn("mt-auto space-y-1 border-t border-border", collapsed && !mobile ? "p-2" : "p-3")}>
        <Link
          to="/settings"
          title={collapsed && !mobile ? "Settings" : undefined}
          className={cn(
            "flex h-9 items-center rounded-md text-xs text-muted-foreground hover:bg-accent hover:text-foreground",
            collapsed && !mobile ? "mx-auto w-9 justify-center px-0" : "gap-3 px-3"
          )}
        >
          <Settings className="h-4 w-4 shrink-0" />
          {(!collapsed || mobile) && "Settings"}
        </Link>
        <button
          title={collapsed && !mobile ? "Help" : undefined}
          className={cn(
            "flex h-9 w-full items-center rounded-md text-xs text-muted-foreground hover:bg-accent hover:text-foreground",
            collapsed && !mobile ? "mx-auto w-9 justify-center px-0" : "gap-3 px-3"
          )}
        >
          <CircleHelp className="h-4 w-4 shrink-0" />
          {(!collapsed || mobile) && "Help"}
        </button>
        <div className={cn("mt-2 flex items-center rounded-md bg-surface-2", collapsed && !mobile ? "justify-center p-1" : "gap-3 p-2")}>
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary/15 text-[10px] font-semibold text-primary">
            AK
          </span>
          {(!collapsed || mobile) && (
            <div className="min-w-0">
              <p className="truncate text-xs font-medium">Admin Kapoor</p>
              <p className="truncate text-[10px] text-muted-foreground">Operations lead</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [command, setCommand] = useState(false);
  const [notice, setNotice] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const notifications = useNotifications();
  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommand(true);
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  const current = nav.find(([, to]) => path === to || (to !== "/dashboard" && path.startsWith(to)))?.[0] ?? "Workspace";

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>
      <div className={cn("min-h-screen transition-[padding] duration-200", collapsed ? "lg:pl-[72px]" : "lg:pl-[236px]")}>
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-xl sm:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobile(true)}>
            <Menu />
          </Button>
          <div className="min-w-0">
            <p className="text-[10px] text-muted-foreground">Northstar Operations</p>
            <p className="truncate text-xs font-medium">{current}</p>
          </div>
          <button
            onClick={() => setCommand(true)}
            className="mx-auto hidden h-9 w-full max-w-md items-center gap-2 rounded-md border border-border bg-surface-1 px-3 text-left text-xs text-muted-foreground transition-colors hover:border-primary/30 md:flex"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="truncate">Search work orders, customers, technicians...</span>
            <kbd className="ml-auto rounded border border-border bg-surface-2 px-1.5 py-0.5 text-[9px]">⌘ K</kbd>
          </button>
          <div className="ml-auto flex items-center gap-1">
            <Button size="icon" variant="ghost" className="md:hidden" onClick={() => setCommand(true)}>
              <Search />
            </Button>
            <ThemeToggle />
            <Button size="icon" variant="ghost" className="relative" onClick={() => setNotice(true)}>
              <Bell />
              {unreadCount > 0 && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-critical ring-2 ring-background" />
              )}
            </Button>
            <span className="ml-1 grid h-8 w-8 place-items-center rounded-md bg-primary/15 text-[10px] font-semibold text-primary">
              AK
            </span>
          </div>
        </header>
        <main className="mx-auto max-w-[1600px] p-4 pb-24 sm:p-6 lg:p-8">{children}</main>
      </div>
      <Sheet open={mobile} onOpenChange={setMobile}>
        <SheetContent side="left" className="w-[280px] border-0 bg-surface-1 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <Sidebar collapsed={false} setCollapsed={() => {}} mobile onNavigate={() => setMobile(false)} />
        </SheetContent>
      </Sheet>
      <nav className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-5 rounded-lg border border-border bg-popover/95 p-1 shadow-xl backdrop-blur-xl lg:hidden">
        {nav.slice(0, 5).map(([label, to, Icon]) => (
          <Link
            key={to}
            to={to}
            className="grid h-12 place-items-center rounded-md text-[9px] text-muted-foreground [&.active]:bg-primary/10 [&.active]:text-primary"
          >
            <Icon className="h-4 w-4" />
            <span>{label.split(" ")[0]}</span>
          </Link>
        ))}
      </nav>
      <CommandPalette open={command} setOpen={setCommand} />
      <Notifications open={notice} setOpen={setNotice} />
    </div>
  );
}
