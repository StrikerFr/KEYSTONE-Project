import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  store,
  useAssets,
  useCustomers,
  useDashboardMetrics,
  useInventory,
  useServiceRequests,
  useTechnicians,
  useWorkOrders,
} from "@/lib/store";
import type { Priority } from "@/types/domain";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  AlertTriangle,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Download,
  FileText,
  GripVertical,
  PackagePlus,
  Plus,
  Search,
  ShieldAlert,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import { Metric, PageHeader, Panel, SectionTabs } from "./shared";
import { StatusPill } from "./status";

export function ServiceRequestsPage() {
  const [tab, setTab] = useState("All");
  const requests = useServiceRequests();

  const handleConvert = (id: string, issue: string) => {
    const created = store.convertRequestToWorkOrder(id);
    if (created) {
      toast.success(`Request ${id} converted to ${created.id}`, {
        description: `Created active work order for ${issue}`,
      });
    }
  };

  const filtered = requests.filter((r) => tab === "All" || r.status === tab);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Intake"
        title="Service Requests"
        description="Review customer issues and convert qualified requests into operational work."
        actions={<RequestFlow />}
      />
      <SectionTabs items={["All", "New", "Under Review", "Converted", "Rejected"]} active={tab} onChange={setTab} />
      <Panel>
        <div className="divide-y divide-border">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">No service requests in this category.</div>
          ) : (
            filtered.map((r) => (
              <div
                key={r.id}
                className="grid gap-3 p-4 hover:bg-accent/40 md:grid-cols-[90px_minmax(200px,1.5fr)_minmax(140px,1fr)_auto_auto_auto] md:items-center"
              >
                <span className="font-mono text-xs text-primary">{r.id}</span>
                <div>
                  <p className="text-sm font-medium">{r.issue}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{r.customer}</p>
                </div>
                <p className="text-xs text-muted-foreground">{r.location}</p>
                <StatusPill value={r.priority} />
                <div className="text-left md:text-right">
                  <StatusPill value={r.status} />
                  <p className="mt-1 text-[10px] text-muted-foreground">{r.submitted}</p>
                </div>
                <div>
                  {r.status !== "Converted" ? (
                    <Button size="sm" variant="quiet" onClick={() => handleConvert(r.id, r.issue)}>
                      Convert to WO
                    </Button>
                  ) : (
                    <span className="text-[10px] text-success font-medium">WO Created</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Panel>
    </div>
  );
}

function RequestFlow() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [issue, setIssue] = useState("");
  const [customer, setCustomer] = useState("XYZ Mall");
  const [location, setLocation] = useState("Building A | Floor 2");
  const [priority, setPriority] = useState<Priority>("High");

  const customers = useCustomers();
  const names = ["Problem", "Location", "Priority", "Attachments", "Review"];

  const handleSubmit = () => {
    if (!issue.trim()) {
      toast.error("Please describe the problem");
      setStep(1);
      return;
    }

    const newReq = store.createServiceRequest({
      issue: issue.trim(),
      customer,
      location,
      priority,
    });

    toast.success("Service request submitted successfully", {
      description: `${newReq.id}: ${newReq.issue}`,
    });

    setOpen(false);
    setStep(1);
    setIssue("");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus />
          Create Request
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full border-border bg-popover sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>New service request</SheetTitle>
          <SheetDescription>
            Step {step} of 5: {names[step - 1]}
          </SheetDescription>
        </SheetHeader>
        <div className="my-6 flex gap-1">
          {names.map((n, i) => (
            <div key={n} className={`h-1 flex-1 rounded-full ${i < step ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>
        <div className="min-h-60">
          {step === 1 && (
            <div className="space-y-4">
              <label className="block text-xs">
                What needs attention?
                <textarea
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  className="mt-2 min-h-32 w-full rounded-md border border-input bg-transparent p-3 text-xs"
                  placeholder="Describe the problem and its operational impact..."
                />
              </label>
              <label className="block text-xs">
                Customer account
                <select
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  className="mt-2 h-9 w-full rounded-md border border-input bg-surface-1 px-3 text-xs"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}
          {step === 2 && (
            <label className="text-xs">
              Location
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-2"
                placeholder="Site, building, floor, or room"
              />
            </label>
          )}
          {step === 3 && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">Select priority urgency</p>
              <div className="grid grid-cols-2 gap-3">
                {(["Low", "Medium", "High", "Critical"] as Priority[]).map((p) => (
                  <Button
                    key={p}
                    variant={priority === p ? "default" : "quiet"}
                    className="h-16 flex-col gap-1"
                    onClick={() => setPriority(p)}
                  >
                    <span className="font-semibold">{p}</span>
                    <span className="text-[10px] opacity-80">
                      {p === "Critical" ? "15m SLA" : p === "High" ? "45m SLA" : "Standard SLA"}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="grid min-h-40 place-items-center rounded-md border border-dashed border-border text-xs text-muted-foreground">
              Drop diagnostic photos or equipment documents here
            </div>
          )}
          {step === 5 && (
            <div className="panel rounded-md p-4 text-sm">
              <p className="font-medium">Request ready for submission</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Issue: {issue || "Diagnostic check"} | {customer} | {location} | Priority: {priority}
              </p>
            </div>
          )}
        </div>
        <SheetFooter className="gap-2">
          <Button variant="quiet" disabled={step === 1} onClick={() => setStep((s) => s - 1)}>
            Back
          </Button>
          <Button onClick={() => (step < 5 ? setStep((s) => s + 1) : handleSubmit())}>
            {step === 5 ? "Submit Request" : "Continue"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export function SchedulePage() {
  const [view, setView] = useState("Day");
  const technicians = useTechnicians();
  const workOrders = useWorkOrders();

  const unassignedOrders = workOrders.filter((w) => !w.technician || w.technician === "Unassigned" || w.status === "New");

  const handleAssignToTech = (woId: string, techName: string) => {
    store.assignTechnician(woId, techName);
    toast.success(`${woId} assigned to ${techName}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Dispatch"
        title="Schedule"
        description="Coordinate technicians, capacity, and time-sensitive assignments."
        actions={<SectionTabs items={["Day", "Week", "Month"]} active={view} onChange={setView} />}
      />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
        <Panel title={`${view} dispatch board`} description="Friday, Sep 18 | India Standard Time">
          <div className="overflow-x-auto">
            <div className="min-w-[880px]">
              <div className="grid grid-cols-[180px_repeat(9,1fr)] border-b border-border px-3 py-3 text-[10px] text-muted-foreground">
                <span>Technician</span>
                {[8, 9, 10, 11, 12, 13, 14, 15, 16].map((t) => (
                  <span key={t}>{String(t).padStart(2, "0")}:00</span>
                ))}
              </div>
              {technicians.slice(0, 5).map((t, row) => (
                <div
                  key={t.id}
                  className="relative grid h-24 grid-cols-[180px_repeat(9,1fr)] border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3 border-r border-border px-4">
                    <span className="grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-[10px] text-primary">
                      {t.initials}
                    </span>
                    <div>
                      <p className="text-xs font-medium">{t.name}</p>
                      <p className="text-[10px] text-muted-foreground">{t.specialization}</p>
                    </div>
                  </div>
                  {Array.from({length: 9}).map((_, i) => (
                    <div key={i} className="border-r border-border/60" />
                  ))}
                  {row < workOrders.length && (
                    <Link
                      to="/work-orders/$id"
                      params={{ id: workOrders[row]?.id ?? "WO-1042" }}
                      className={`absolute top-5 h-14 rounded-md border px-3 text-left shadow-lg ${
                        workOrders[row]?.priority === "Critical"
                          ? "border-critical/30 bg-critical/10"
                          : "border-primary/30 bg-primary/10"
                      }`}
                      style={{
                        left: `calc(180px + ${(row + 1) * 8.2}%)`,
                        width: row === 1 ? "25%" : "19%",
                      }}
                    >
                      <GripVertical className="absolute right-1 top-2 h-3 w-3 text-muted-foreground" />
                      <p className="font-mono text-[10px] text-primary">{workOrders[row]?.id}</p>
                      <p className="mt-1 truncate text-[11px] font-medium">{workOrders[row]?.issue}</p>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel
          title="Unassigned work"
          description={`${unassignedOrders.length} jobs available for dispatch`}
        >
          <div className="divide-y divide-border">
            {unassignedOrders.length === 0 ? (
              <div className="p-4 text-xs text-muted-foreground">All active work orders are currently assigned.</div>
            ) : (
              unassignedOrders.map((w) => (
                <div key={w.id} className="p-4 hover:bg-accent/40">
                  <div className="flex justify-between">
                    <Link to="/work-orders/$id" params={{ id: w.id }} className="font-mono text-xs text-primary hover:underline">
                      {w.id}
                    </Link>
                    <StatusPill value={w.priority} />
                  </div>
                  <p className="mt-2 text-xs font-medium">{w.issue}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">{w.customer}</p>
                  <div className="mt-3 flex gap-2">
                    <Button
                      size="sm"
                      variant="quiet"
                      className="w-full text-xs"
                      onClick={() => handleAssignToTech(w.id, technicians[0]?.name ?? "Rahul Sharma")}
                    >
                      Dispatch to {technicians[0]?.name ?? "Rahul"}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}

export function TechniciansPage() {
  const technicians = useTechnicians();
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("HVAC Specialist");

  const handleAddTech = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    store.addTechnician({ name: name.trim(), specialization, status: "Available" });
    toast.success(`Technician ${name} added to roster`);
    setName("");
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Field teams"
        title="Technicians"
        description="Balance skills, availability, workload, and service performance."
        actions={
          <Button onClick={() => setModalOpen(true)}>
            <Plus />
            Add Technician
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {technicians.map((t) => (
          <Link
            key={t.id}
            to="/technicians/$id"
            params={{ id: t.id }}
            className="panel group rounded-lg p-5 transition-transform hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-md bg-primary/10 text-xs font-semibold text-primary">
                {t.initials}
              </span>
              <StatusPill value={t.status} />
            </div>
            <h2 className="mt-5 text-base font-medium">{t.name}</h2>
            <p className="mt-1 text-xs text-muted-foreground">{t.specialization}</p>
            <div className="mt-5 grid grid-cols-3 border-t border-border pt-4 text-center">
              <Mini value={`${t.activeJobs}`} label="Active" />
              <Mini value={`${t.completedJobs}`} label="Completed" />
              <Mini value={`${t.slaScore}%`} label="SLA score" />
            </div>
            <div className="mt-4 h-1 rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${Math.min(t.activeJobs * 24, 100)}%` }}
              />
            </div>
          </Link>
        ))}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="border-border bg-popover sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add technician</DialogTitle>
            <DialogDescription>Register a certified field technician to your operations network.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddTech} className="space-y-4 py-4">
            <label className="block text-xs">
              Full name
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vikram Batra"
                className="mt-2"
                required
              />
            </label>
            <label className="block text-xs">
              Specialization
              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="mt-2 h-9 w-full rounded-md border border-input bg-surface-1 px-3 text-xs"
              >
                <option value="HVAC Specialist">HVAC Specialist</option>
                <option value="Power Systems">Power Systems</option>
                <option value="Electrical Systems">Electrical Systems</option>
                <option value="Vertical Transport">Vertical Transport</option>
                <option value="Industrial Cooling">Industrial Cooling</option>
              </select>
            </label>
            <DialogFooter className="mt-6">
              <Button type="submit">Add to roster</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function TechnicianDetail({ id }: { id: string }) {
  const technicians = useTechnicians();
  const workOrders = useWorkOrders();
  const t = technicians.find((x) => x.id === id) ?? technicians[0];
  if (!t) return null;

  const assignedWork = workOrders.filter((w) => w.technician === t.name);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Technician profile"
        title={t.name}
        description={t.specialization}
        actions={<Button variant="quiet">Edit profile</Button>}
      />
      <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
        <Panel>
          <div className="p-5 text-center">
            <span className="mx-auto grid h-20 w-20 place-items-center rounded-lg bg-primary/10 text-xl text-primary">
              {t.initials}
            </span>
            <div className="mt-4">
              <StatusPill value={t.status} />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Mini value={`${t.completedJobs}`} label="Jobs completed" />
              <Mini value={`${t.slaScore}%`} label="SLA performance" />
            </div>
          </div>
        </Panel>
        <div className="space-y-5">
          <Panel title="Current assignments">
            <div className="divide-y divide-border">
              {assignedWork.length === 0 ? (
                <div className="p-4 text-xs text-muted-foreground">No active work orders currently assigned.</div>
              ) : (
                assignedWork.map((w) => (
                  <Link
                    key={w.id}
                    to="/work-orders/$id"
                    params={{ id: w.id }}
                    className="flex items-center justify-between p-4 hover:bg-accent/40"
                  >
                    <div>
                      <span className="font-mono text-xs text-primary">{w.id}</span>
                      <p className="mt-1 text-xs">
                        {w.issue} | {w.customer}
                      </p>
                    </div>
                    <StatusPill value={w.status} />
                  </Link>
                ))
              )}
            </div>
          </Panel>
          <div className="grid gap-5 md:grid-cols-2">
            <Panel title="Skills and certifications">
              <div className="flex flex-wrap gap-2 p-4">
                {["HVAC Level III", "Electrical Safety", "Refrigerant Handling", "Working at Height"].map((x) => (
                  <span key={x} className="rounded-md border border-border bg-surface-2 px-2 py-1 text-[10px]">
                    {x}
                  </span>
                ))}
              </div>
            </Panel>
            <Panel title="Performance trend">
              <div className="p-4">
                <ChartContainer
                  className="h-32 w-full aspect-auto"
                  config={{ score: { label: "SLA", color: "var(--primary)" } }}
                >
                  <AreaChart data={[91, 94, 93, 96, 95, 98, 96].map((score, i) => ({ i, score }))}>
                    <Area dataKey="score" stroke="var(--primary)" fill="var(--primary-glow)" />
                    <XAxis hide />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </AreaChart>
                </ChartContainer>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CustomersPage() {
  const customers = useCustomers();
  const workOrders = useWorkOrders();
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [locations, setLocations] = useState(2);

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    store.addCustomer({
      name: name.trim(),
      organization: org.trim() || `${name} Holdings`,
      locations: Number(locations) || 1,
      status: "Active",
    });
    toast.success(`Customer ${name} added`);
    setName("");
    setOrg("");
    setModalOpen(false);
  };

  const rows = customers.map((c) => {
    const liveOrders = workOrders.filter(
      (w) => w.customer.toLowerCase() === c.name.toLowerCase() && w.status !== "Completed" && w.status !== "Closed"
    ).length;
    return {
      id: c.id,
      cells: [c.name, c.organization, String(c.locations), String(liveOrders || c.openOrders), c.lastService, <StatusPill key={c.id} value={c.status} />],
    };
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Registry"
        title="Customers"
        description="Service relationships, locations, assets, and operational history."
        actions={
          <Button onClick={() => setModalOpen(true)}>
            <Plus />
            Add Customer
          </Button>
        }
      />
      <Panel>
        <Table>
          <TableHeader>
            <TableRow>
              {["Customer", "Organization", "Locations", "Active Work Orders", "Last Service", "Status"].map((x) => (
                <TableHead key={x}>{x}</TableHead>
              ))}
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                {r.cells.map((c, i) => (
                  <TableCell key={i} className="text-xs">
                    {i === 0 ? (
                      <Link to="/customers/$id" params={{ id: r.id }} className="font-medium text-primary hover:underline">
                        {c}
                      </Link>
                    ) : (
                      c
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  <Button asChild size="icon" variant="ghost">
                    <Link to="/customers/$id" params={{ id: r.id }}>
                      <ChevronRight />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Panel>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="border-border bg-popover sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add customer</DialogTitle>
            <DialogDescription>Register a new facility account and operational portfolio.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddCustomer} className="space-y-4 py-4">
            <label className="block text-xs">
              Facility / Site name
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Phoenix Infocity" className="mt-2" required />
            </label>
            <label className="block text-xs">
              Parent organization
              <Input value={org} onChange={(e) => setOrg(e.target.value)} placeholder="e.g. Phoenix Real Estate Group" className="mt-2" />
            </label>
            <label className="block text-xs">
              Number of sites / locations
              <Input type="number" min="1" value={locations} onChange={(e) => setLocations(Number(e.target.value))} className="mt-2" />
            </label>
            <DialogFooter className="mt-6">
              <Button type="submit">Create account</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function CustomerDetail({ id }: { id: string }) {
  const customers = useCustomers();
  const c = customers.find((x) => x.id === id) ?? customers[0];
  if (!c) return null;
  return (
    <DetailWorkspace
      eyebrow="Customer workspace"
      title={c.name}
      description={c.organization}
      metrics={[
        ["Locations", String(c.locations)],
        ["Open Work", String(c.openOrders)],
        ["Assets", "18"],
        ["SLA", "96.2%"],
      ]}
      sections={["Contacts", "Locations", "Assets", "Service History", "Open Work Orders", "Invoices and Costs", "Activity"]}
    />
  );
}

export function AssetsPage() {
  const assets = useAssets();
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("HVAC Unit");
  const [customer, setCustomer] = useState("XYZ Mall");
  const [location, setLocation] = useState("Roof Level");

  const customers = useCustomers();

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const id = `AST-${100 + assets.length}`;
    store.addAsset({
      id,
      name: name.trim(),
      type,
      customer,
      location,
      status: "Operational",
    });
    toast.success(`Asset ${id} registered`);
    setName("");
    setModalOpen(false);
  };

  const rows = assets.map((a) => ({
    id: a.id,
    cells: [a.id, a.name, a.type, a.customer, a.location, <StatusPill key={a.id} value={a.status} />, a.nextMaintenance],
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Registry"
        title="Assets"
        description="Track serviceable equipment, condition, and maintenance windows."
        actions={
          <Button onClick={() => setModalOpen(true)}>
            <Plus />
            Add Asset
          </Button>
        }
      />
      <Panel>
        <Table>
          <TableHeader>
            <TableRow>
              {["Asset ID", "Name", "Type", "Customer", "Location", "Status", "Next Maintenance"].map((x) => (
                <TableHead key={x}>{x}</TableHead>
              ))}
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                {r.cells.map((c, i) => (
                  <TableCell key={i} className="text-xs">
                    {i === 0 ? (
                      <Link to="/assets/$id" params={{ id: r.id }} className="font-medium text-primary hover:underline">
                        {c}
                      </Link>
                    ) : (
                      c
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  <Button asChild size="icon" variant="ghost">
                    <Link to="/assets/$id" params={{ id: r.id }}>
                      <ChevronRight />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Panel>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="border-border bg-popover sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Register equipment asset</DialogTitle>
            <DialogDescription>Add critical equipment to preventative maintenance schedules.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddAsset} className="space-y-4 py-4">
            <label className="block text-xs">
              Asset name
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Centrifugal Chiller 04" className="mt-2" required />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs">
                Asset type
                <select value={type} onChange={(e) => setType(e.target.value)} className="mt-2 h-9 w-full rounded-md border border-input bg-surface-1 px-3 text-xs">
                  <option value="HVAC Unit">HVAC Unit</option>
                  <option value="Generator">Generator</option>
                  <option value="Elevator">Elevator</option>
                  <option value="Chiller">Chiller</option>
                  <option value="Transformer">Transformer</option>
                </select>
              </label>
              <label className="block text-xs">
                Customer
                <select value={customer} onChange={(e) => setCustomer(e.target.value)} className="mt-2 h-9 w-full rounded-md border border-input bg-surface-1 px-3 text-xs">
                  {customers.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="block text-xs">
              Location details
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Plant 02 | Utility Bay" className="mt-2" />
            </label>
            <DialogFooter className="mt-6">
              <Button type="submit">Register asset</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function AssetDetail({ id }: { id: string }) {
  const assets = useAssets();
  const a = assets.find((x) => x.id === id) ?? assets[0];
  if (!a) return null;
  return (
    <DetailWorkspace
      eyebrow={a.id}
      title={a.name}
      description={`${a.type} | ${a.customer} | ${a.location}`}
      metrics={[
        ["Status", a.status],
        ["Last Service", a.lastService],
        ["Next Maintenance", a.nextMaintenance],
        ["Related Orders", "12"],
      ]}
      sections={["Asset Information", "Service History", "Maintenance Schedule", "Related Work Orders", "Parts History", "Technician Activity"]}
    />
  );
}

function DetailWorkspace({
  eyebrow,
  title,
  description,
  metrics,
  sections,
}: {
  eyebrow: string;
  title: string;
  description: string;
  metrics: string[][];
  sections: string[];
}) {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={
          <Button variant="quiet">
            <ArrowUpRight />
            Open activity
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-5 border-y border-border py-5 md:grid-cols-4">
        {metrics.map(([label, value]) => (
          <Metric key={label} label={label ?? "Metric"} value={value ?? "N/A"} context="Current portfolio" />
        ))}
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {sections.map((s, i) => (
          <Panel key={s} title={s}>
            <div className="p-5 text-xs leading-5 text-muted-foreground">
              {i % 2 === 0
                ? "Recent operational records and upcoming actions are synchronized across this workspace."
                : "Activity and maintenance history are preserved in the operational log."}
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}

export function InventoryPage() {
  const inventory = useInventory();
  const [selected, setSelected] = useState<(typeof inventory)[number] | null>(null);
  const [adjStock, setAdjStock] = useState<number>(1);
  const [addPartModal, setAddPartModal] = useState(false);

  const [partName, setPartName] = useState("");
  const [partSku, setPartSku] = useState("");
  const [partCategory, setPartCategory] = useState("HVAC");
  const [partStock, setPartStock] = useState(10);
  const [partMin, setPartMin] = useState(5);
  const [partCost, setPartCost] = useState(1500);

  const totalStockCount = inventory.reduce((acc, i) => acc + i.stock, 0);
  const lowStockCount = inventory.filter((i) => i.status === "Low Stock").length;
  const outOfStockCount = inventory.filter((i) => i.status === "Out of Stock").length;
  const totalValue = inventory.reduce((acc, i) => acc + i.stock * i.unitCost, 0);

  const handleUpdateStock = () => {
    if (!selected) return;
    store.updateInventoryStock(selected.id, Number(adjStock) || 0);
    toast.success(`Updated stock for ${selected.name} to ${adjStock}`);
    setSelected(null);
  };

  const handleAddPart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partName.trim()) return;
    store.addInventoryItem({
      name: partName.trim(),
      sku: partSku.trim() || `SKU-${Date.now().toString().slice(-4)}`,
      category: partCategory,
      stock: Number(partStock) || 0,
      minimum: Number(partMin) || 0,
      unitCost: Number(partCost) || 0,
    });
    toast.success(`Part ${partName} added to inventory`);
    setAddPartModal(false);
    setPartName("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Parts and supply"
        title="Inventory"
        description="Maintain parts availability across field operations."
        actions={
          <Button onClick={() => setAddPartModal(true)}>
            <PackagePlus />
            Add Part
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-y-5 border-y border-border py-5 md:grid-cols-4">
        <Metric label="Total Units" value={totalStockCount.toLocaleString("en-IN")} context={`${inventory.length} active SKUs`} />
        <Metric label="Low Stock" value={String(lowStockCount)} context="Items need reorder" tone="warning" />
        <Metric label="Out of Stock" value={String(outOfStockCount)} context="Critical supply gaps" tone="critical" />
        <Metric label="Inventory Value" value={`₹${(totalValue / 100000).toFixed(1)}L`} context="Live calculated cost" />
      </div>

      <Panel>
        <Table>
          <TableHeader>
            <TableRow>
              {["Part", "SKU", "Category", "Stock", "Minimum", "Unit Cost", "Status"].map((x) => (
                <TableHead key={x}>{x}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((i) => (
              <TableRow
                key={i.id}
                onClick={() => {
                  setSelected(i);
                  setAdjStock(i.stock);
                }}
                className="cursor-pointer hover:bg-accent/40"
              >
                <TableCell className="text-xs font-medium">{i.name}</TableCell>
                <TableCell className="font-mono text-[11px]">{i.sku}</TableCell>
                <TableCell className="text-xs">{i.category}</TableCell>
                <TableCell className="font-mono text-xs">{i.stock}</TableCell>
                <TableCell className="font-mono text-xs">{i.minimum}</TableCell>
                <TableCell className="font-mono text-xs">₹{i.unitCost.toLocaleString("en-IN")}</TableCell>
                <TableCell>
                  <StatusPill value={i.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Panel>

      {/* Adjust Stock Sheet */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="border-border bg-popover">
          <SheetHeader>
            <SheetTitle>{selected?.name}</SheetTitle>
            <SheetDescription>
              {selected?.sku} | {selected?.category}
            </SheetDescription>
          </SheetHeader>
          <div className="my-8 grid grid-cols-2 gap-4">
            <Mini label="Current stock" value={String(selected?.stock ?? 0)} />
            <Mini label="Minimum threshold" value={String(selected?.minimum ?? 0)} />
          </div>
          <label className="text-xs">
            Adjust total quantity on hand
            <Input
              type="number"
              min="0"
              className="mt-2"
              value={adjStock}
              onChange={(e) => setAdjStock(Number(e.target.value))}
            />
          </label>
          <SheetFooter className="mt-6">
            <Button onClick={handleUpdateStock}>Update stock level</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Add Part Dialog */}
      <Dialog open={addPartModal} onOpenChange={setAddPartModal}>
        <DialogContent className="border-border bg-popover sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add inventory item</DialogTitle>
            <DialogDescription>Register a new replacement part or consumable item.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddPart} className="space-y-4 py-4">
            <label className="block text-xs">
              Part name
              <Input value={partName} onChange={(e) => setPartName(e.target.value)} placeholder="e.g. Expansion Valve TXV" className="mt-2" required />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs">
                SKU
                <Input value={partSku} onChange={(e) => setPartSku(e.target.value)} placeholder="HV-TXV-02" className="mt-2" />
              </label>
              <label className="block text-xs">
                Category
                <select value={partCategory} onChange={(e) => setPartCategory(e.target.value)} className="mt-2 h-9 w-full rounded-md border border-input bg-surface-1 px-3 text-xs">
                  <option value="HVAC">HVAC</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Filtration">Filtration</option>
                  <option value="Plumbing">Plumbing</option>
                </select>
              </label>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <label className="block text-xs">
                Stock
                <Input type="number" min="0" value={partStock} onChange={(e) => setPartStock(Number(e.target.value))} className="mt-2" />
              </label>
              <label className="block text-xs">
                Min threshold
                <Input type="number" min="0" value={partMin} onChange={(e) => setPartMin(Number(e.target.value))} className="mt-2" />
              </label>
              <label className="block text-xs">
                Unit cost (₹)
                <Input type="number" min="0" value={partCost} onChange={(e) => setPartCost(Number(e.target.value))} className="mt-2" />
              </label>
            </div>
            <DialogFooter className="mt-6">
              <Button type="submit">Add to catalog</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function SlaPage() {
  const workOrders = useWorkOrders();
  const metrics = useDashboardMetrics();
  const atRiskList = workOrders.filter((w) => w.priority === "Critical" || (w.priority === "High" && w.status !== "Completed"));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Control tower"
        title="SLA and Alerts"
        description="Prioritize service commitments before they become breaches."
        actions={
          <Button variant="quiet">
            <CalendarDays />
            Last 30 days
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-y-5 border-y border-border py-5 md:grid-cols-5">
        <Metric value={metrics.complianceRate} label="SLA Compliance" context="Calculated portfolio" />
        <Metric value={String(metrics.atRisk)} label="At Risk" context="Immediate attention" tone={metrics.atRisk > 0 ? "warning" : "default"} />
        <Metric value="2" label="Breached" context="Historical audit" tone="critical" />
        <Metric value="18m" label="Avg Response" context="Under target" />
        <Metric value="3h 12m" label="Avg Resolution" context="Within target" />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Priority and at risk work orders">
          <div className="divide-y divide-border">
            {atRiskList.length === 0 ? (
              <div className="p-5 text-xs text-muted-foreground">All active work orders are within healthy SLA margins.</div>
            ) : (
              atRiskList.map((w) => (
                <Link
                  key={w.id}
                  to="/work-orders/$id"
                  params={{ id: w.id }}
                  className="flex items-center justify-between p-4 hover:bg-accent/40"
                >
                  <div>
                    <span className="font-mono text-xs text-primary">{w.id}</span>
                    <p className="mt-1 text-xs">
                      {w.issue} | {w.customer}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-warning">{w.sla}</span>
                </Link>
              ))
            )}
          </div>
        </Panel>
        <Panel title="Alert timeline">
          <div className="space-y-5 p-5">
            {[
              "WO-1044 entered critical SLA window",
              "WO-1042 forecast moved to at risk",
              "Northstar response target recovered",
              "WO-1038 breached resolution SLA",
            ].map((x, i) => (
              <div key={x} className="flex gap-3">
                <AlertTriangle className={`h-4 w-4 ${i === 3 ? "text-critical" : "text-warning"}`} />
                <div>
                  <p className="text-xs">{x}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">{8 + i * 13} minutes ago</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

export function ReportsPage() {
  const [range, setRange] = useState("30 Days");
  const metrics = useDashboardMetrics();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Intelligence"
        title="Reports"
        description="Understand performance across service, teams, customers, and cost."
        actions={
          <div className="flex gap-2">
            <Button variant="quiet" onClick={() => toast.success("CSV export prepared and downloaded")}>
              <Download />
              CSV
            </Button>
            <Button variant="quiet" onClick={() => toast.success("PDF executive summary compiled")}>
              <FileText />
              PDF
            </Button>
          </div>
        }
      />
      <SectionTabs items={["Today", "7 Days", "30 Days", "90 Days", "Custom"]} active={range} onChange={setRange} />
      <div className="grid gap-5 xl:grid-cols-2">
        <ReportChart title="Work Order Performance" dataKey="created" data={metrics.activityData} />
        <ReportChart title="SLA Compliance" dataKey="completed" data={metrics.activityData} />
        <ReportChart title="Technician Performance" dataKey="created" data={metrics.activityData} />
        <ReportChart title="Resolution Time" dataKey="completed" data={metrics.activityData} />
      </div>
    </div>
  );
}

function ReportChart({ title, dataKey, data }: { title: string; dataKey: string; data: any[] }) {
  return (
    <Panel title={title} action={<ArrowUpRight className="h-4 w-4 text-muted-foreground" />}>
      <div className="p-4">
        <ChartContainer className="h-56 w-full aspect-auto" config={{ [dataKey]: { label: title, color: "var(--primary)" } }}>
          <BarChart data={data}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis dataKey="d" tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey={dataKey} fill="var(--primary)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </div>
    </Panel>
  );
}

function Mini({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-mono text-lg tabular-nums">{value}</p>
      <p className="mt-1 text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}
