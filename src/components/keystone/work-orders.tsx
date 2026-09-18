import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Filter,
  MapPin,
  MoreHorizontal,
  PackagePlus,
  Paperclip,
  Plus,
  Search,
  UserRound,
  Wrench,
} from "lucide-react";
import { store, useCustomers, useInventory, useTechnicians, useWorkOrders } from "@/lib/store";
import type { Priority, WorkOrderStatus } from "@/types/domain";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { PageHeader, Panel } from "./shared";
import { StatusPill } from "./status";

export function WorkOrdersPage() {
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  const workOrders = useWorkOrders();

  const filtered = useMemo(() => {
    return workOrders.filter((w) => {
      const matchesSearch = (w.id + w.issue + w.customer + w.technician + w.location)
        .toLowerCase()
        .includes(q.toLowerCase());
      const matchesStatus = statusFilter === "All" || w.status === statusFilter;
      const matchesPriority = priorityFilter === "All" || w.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [workOrders, q, statusFilter, priorityFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Operations"
        title="Work Orders"
        description="Manage, assign and monitor field operations."
        actions={<CreateWorkOrder />}
      />

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9"
            placeholder="Search work orders..."
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-surface-1 px-3 text-xs"
        >
          <option value="All">All Statuses</option>
          <option value="New">New</option>
          <option value="Assigned">Assigned</option>
          <option value="Scheduled">Scheduled</option>
          <option value="In Progress">In Progress</option>
          <option value="On Hold">On Hold</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-surface-1 px-3 text-xs"
        >
          <option value="All">All Priorities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        {(statusFilter !== "All" || priorityFilter !== "All" || q) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQ("");
              setStatusFilter("All");
              setPriorityFilter("All");
            }}
          >
            Reset filters
          </Button>
        )}
      </div>

      <Panel>
        <div className="hidden lg:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Work order</TableHead>
                <TableHead>Customer / location</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>SLA</TableHead>
                <TableHead>Created</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-sm text-muted-foreground">
                    No work orders match the selected filters.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((w) => (
                  <TableRow key={w.id} className="h-[68px]">
                    <TableCell>
                      <Link to="/work-orders/$id" params={{ id: w.id }} className="font-mono text-xs text-primary hover:underline">
                        {w.id}
                      </Link>
                      <p className="mt-1 text-xs font-medium">{w.issue}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-xs">{w.customer}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground">{w.location}</p>
                    </TableCell>
                    <TableCell>
                      <StatusPill value={w.priority} />
                    </TableCell>
                    <TableCell className="text-xs">{w.technician}</TableCell>
                    <TableCell>
                      <StatusPill value={w.status} />
                    </TableCell>
                    <TableCell className="font-mono text-[11px]">{w.sla}</TableCell>
                    <TableCell className="text-[11px] text-muted-foreground">{w.created}</TableCell>
                    <TableCell>
                      <Button asChild variant="ghost" size="icon">
                        <Link to="/work-orders/$id" params={{ id: w.id }}>
                          <ChevronRight />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="divide-y divide-border lg:hidden">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No work orders match the selected filters.
            </div>
          ) : (
            filtered.map((w) => (
              <Link key={w.id} to="/work-orders/$id" params={{ id: w.id }} className="block p-4 hover:bg-accent/40">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-primary">{w.id}</span>
                  <StatusPill value={w.status} />
                </div>
                <p className="mt-3 text-sm font-medium">{w.issue}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {w.customer} | {w.location}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <StatusPill value={w.priority} />
                  <span className="font-mono text-[10px]">{w.sla}</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </Panel>
    </div>
  );
}

export function CreateWorkOrder() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [customer, setCustomer] = useState("XYZ Mall");
  const [location, setLocation] = useState("Building A | Floor 3");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [technician, setTechnician] = useState("Unassigned");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const technicians = useTechnicians();
  const customers = useCustomers();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please provide an issue title");
      return;
    }
    setLoading(true);

    try {
      const created = store.createWorkOrder({
        issue: title.trim(),
        customer: customer || "XYZ Mall",
        location: location || "MIDC Industrial Area, Mumbai",
        priority,
        technician: technician === "Unassigned" ? "" : technician,
        description: description.trim() || "Operational service diagnostics requested.",
      });

      toast.success("Work Order created successfully", {
        description: `${created.id}: ${title}`,
      });

      setOpen(false);
      setTitle("");
      setDescription("");
    } catch (err: any) {
      toast.error("Failed to create work order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus />
          Create Work Order
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full border-border bg-popover sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Create work order</SheetTitle>
          <SheetDescription>Capture the issue and assign the first response.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <label className="block text-xs">
            Issue
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2"
              placeholder="Describe the service issue"
              required
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block text-xs">
              Customer
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

            <label className="block text-xs">
              Location
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-2"
                placeholder="Building, Floor, or Bay"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs">
              Priority
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="mt-2 h-9 w-full rounded-md border border-input bg-surface-1 px-3 text-xs"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </label>
            <label className="text-xs">
              Technician
              <select
                value={technician}
                onChange={(e) => setTechnician(e.target.value)}
                className="mt-2 h-9 w-full rounded-md border border-input bg-surface-1 px-3 text-xs"
              >
                <option value="Unassigned">Unassigned</option>
                {technicians.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name} ({t.specialization})
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="block text-xs">
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 min-h-28 w-full rounded-md border border-input bg-transparent p-3 text-sm"
              placeholder="Add diagnostic context..."
            />
          </label>
          <SheetFooter className="mt-6">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create work order"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export function WorkOrderDetail({ id }: { id: string }) {
  const workOrders = useWorkOrders();
  const technicians = useTechnicians();
  const inventory = useInventory();

  const w = workOrders.find((x) => x.id === id) ?? workOrders[0];

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<WorkOrderStatus>(w?.status ?? "In Progress");
  const [statusNote, setStatusNote] = useState("");

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedTech, setSelectedTech] = useState(w?.technician ?? "Rahul Sharma");

  const [partModalOpen, setPartModalOpen] = useState(false);
  const [selectedPartId, setSelectedPartId] = useState(inventory[0]?.id ?? "");
  const [partQty, setPartQty] = useState(1);

  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [newNote, setNewNote] = useState("");

  if (!w) return null;

  const handleUpdateStatus = () => {
    store.updateWorkOrderStatus(w.id, selectedStatus, statusNote);
    toast.success(`Work order status updated to ${selectedStatus}`);
    setStatusModalOpen(false);
    setStatusNote("");
  };

  const handleAssignTech = () => {
    store.assignTechnician(w.id, selectedTech);
    toast.success(`Assigned ${w.id} to ${selectedTech}`);
    setAssignModalOpen(false);
  };

  const handleAddPart = () => {
    const part = inventory.find((p) => p.id === selectedPartId);
    if (!part) return;
    store.addPartToWorkOrder(w.id, part.name, Number(partQty) || 1, part.unitCost);
    toast.success(`Logged ${partQty}x ${part.name} to work order`);
    setPartModalOpen(false);
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    store.updateWorkOrderStatus(w.id, w.status, newNote.trim());
    toast.success("Technician note recorded");
    setNoteModalOpen(false);
    setNewNote("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`${w.id} | Active work order`}
        title={w.issue}
        description={`${w.customer} | ${w.location}`}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="quiet" onClick={() => setAssignModalOpen(true)}>
              <UserRound />
              Assign
            </Button>
            <Button variant="quiet" onClick={() => setPartModalOpen(true)}>
              <PackagePlus />
              Add Part
            </Button>
            <Button onClick={() => setStatusModalOpen(true)}>
              <CheckCircle2 />
              Change status
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setNoteModalOpen(true)} title="Add note">
              <MoreHorizontal />
            </Button>
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <StatusPill value={w.status} />
        <StatusPill value={w.priority} />
        <span className="text-xs text-muted-foreground">Created {w.created}</span>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,.65fr)]">
        <div className="space-y-5">
          <Panel title="Work order overview">
            <div className="p-5">
              <p className="text-sm leading-6 text-muted-foreground">{w.description}</p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Fact label="Customer" value={w.customer} />
                <Fact label="Location" value={w.location} />
                <Fact label="Asset" value={`${w.asset} | Commercial equipment`} />
                <Fact label="SLA deadline" value="Today, 11:18 AM" />
              </div>
            </div>
          </Panel>

          <Panel title="Work order timeline">
            <div className="p-5">
              {(w.timeline && w.timeline.length > 0
                ? w.timeline
                : [
                    { text: `Request received: ${w.created}`, time: w.created, done: true },
                    { text: `Assigned to ${w.technician}`, time: "Today", done: true },
                    { text: "Scheduled on dispatch board", time: "Today", done: true },
                    { text: "Technician arrived on site", time: "In Progress", done: w.status === "In Progress" || w.status === "Completed" },
                    { text: "Resolution & close-out", time: "Pending", done: w.status === "Completed" },
                  ]
              ).map((x, i, arr) => (
                <div key={x.text + i} className="grid grid-cols-[20px_1fr] gap-3 pb-5 last:pb-0">
                  <div className="relative">
                    <span
                      className={`block h-2.5 w-2.5 rounded-full ${
                        x.done ? "bg-primary" : "border border-border bg-background"
                      }`}
                    />
                    {i < arr.length - 1 && (
                      <span className="absolute left-[4px] top-3 h-[calc(100%+8px)] w-px bg-border" />
                    )}
                  </div>
                  <div>
                    <p className={x.done ? "text-xs font-medium" : "text-xs text-muted-foreground"}>{x.text}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">{x.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <div className="grid gap-5 md:grid-cols-2">
            <Panel
              title="Parts used"
              action={
                <Button variant="ghost" size="sm" onClick={() => setPartModalOpen(true)}>
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </Button>
              }
            >
              <div className="divide-y divide-border text-xs">
                {w.parts && w.parts.length > 0 ? (
                  w.parts.map((p, idx) => (
                    <div key={idx} className="grid grid-cols-[1fr_auto] p-4">
                      <span>
                        {p.name} | x{p.qty}
                      </span>
                      <span className="font-mono">₹{(p.cost * p.qty).toLocaleString("en-IN")}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="grid grid-cols-[1fr_auto] p-4">
                      <span>Contactor 32A 3P | x1</span>
                      <span className="font-mono">₹3,250</span>
                    </div>
                    <div className="grid grid-cols-[1fr_auto] p-4">
                      <span>Control fuse 10A | x2</span>
                      <span className="font-mono">₹480</span>
                    </div>
                  </>
                )}
              </div>
            </Panel>

            <Panel title="Time tracking">
              <div className="grid grid-cols-3 gap-4 p-4 text-xs">
                <Fact label="Start" value="09:51" />
                <Fact label="Elapsed" value="01:09:24" />
                <Fact label="Billable" value="01:00" />
              </div>
            </Panel>
          </div>

          <Panel
            title="Technician notes"
            action={
              <Button variant="ghost" size="sm" onClick={() => setNoteModalOpen(true)}>
                Edit
              </Button>
            }
          >
            <div className="p-5 text-sm leading-6 text-muted-foreground">
              {w.notes ||
                "Supply fan contactor shows heat damage. Replaced contactor and verified amperage across all phases. Monitoring discharge temperature before close-out."}
            </div>
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel title="SLA status">
            <div className="p-5">
              <p className="font-mono text-3xl text-warning">{w.sla}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {w.status === "Completed" ? "Resolved within SLA commitment" : "Target resolution commitment"}
              </p>
              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full ${w.status === "Completed" ? "bg-success" : "bg-warning"}`}
                  style={{ width: `${w.progress}%` }}
                />
              </div>
              <div className="mt-3 flex justify-between text-[10px] text-muted-foreground">
                <span>Created {w.created}</span>
                <span>Target 11:18 AM</span>
              </div>
            </div>
          </Panel>

          <Panel
            title="Assigned technician"
            action={
              <Button variant="ghost" size="sm" onClick={() => setAssignModalOpen(true)}>
                Reassign
              </Button>
            }
          >
            <div className="flex items-center gap-3 p-4">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-primary/15 text-xs text-primary">
                {w.technician
                  ? w.technician
                      .split(" ")
                      .map((p) => p[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()
                  : "UN"}
              </span>
              <div>
                <p className="text-sm font-medium">{w.technician || "Unassigned"}</p>
                <p className="text-xs text-muted-foreground">Field Specialist | On site</p>
              </div>
            </div>
          </Panel>

          <Panel title="Attachments">
            <div className="divide-y divide-border">
              {["compressor-panel.jpg", "temperature-log.pdf"].map((x) => (
                <div key={x} className="flex items-center gap-3 p-4 text-xs">
                  <Paperclip className="h-4 w-4 text-muted-foreground" />
                  <span>{x}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      {/* Change Status Dialog */}
      <Dialog open={statusModalOpen} onOpenChange={setStatusModalOpen}>
        <DialogContent className="border-border bg-popover sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update status: {w.id}</DialogTitle>
            <DialogDescription>Modify operational status and append resolution logs.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <label className="block text-xs">
              Status
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as WorkOrderStatus)}
                className="mt-2 h-9 w-full rounded-md border border-input bg-surface-1 px-3 text-xs"
              >
                <option value="New">New</option>
                <option value="Assigned">Assigned</option>
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
                <option value="Closed">Closed</option>
              </select>
            </label>
            <label className="block text-xs">
              Status log note
              <textarea
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                className="mt-2 min-h-20 w-full rounded-md border border-input bg-transparent p-3 text-xs"
                placeholder="Optional notes regarding this transition..."
              />
            </label>
          </div>
          <DialogFooter>
            <Button variant="quiet" onClick={() => setStatusModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus}>Save status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Technician Dialog */}
      <Dialog open={assignModalOpen} onOpenChange={setAssignModalOpen}>
        <DialogContent className="border-border bg-popover sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign technician: {w.id}</DialogTitle>
            <DialogDescription>Select an available field technician for this assignment.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="block text-xs">
              Technician
              <select
                value={selectedTech}
                onChange={(e) => setSelectedTech(e.target.value)}
                className="mt-2 h-9 w-full rounded-md border border-input bg-surface-1 px-3 text-xs"
              >
                {technicians.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name} ({t.specialization}) | {t.activeJobs} active
                  </option>
                ))}
              </select>
            </label>
          </div>
          <DialogFooter>
            <Button variant="quiet" onClick={() => setAssignModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignTech}>Confirm assignment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Part Dialog */}
      <Dialog open={partModalOpen} onOpenChange={setPartModalOpen}>
        <DialogContent className="border-border bg-popover sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Log part usage: {w.id}</DialogTitle>
            <DialogDescription>Deduct from inventory stock and attach to work order cost.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <label className="block text-xs">
              Select inventory item
              <select
                value={selectedPartId}
                onChange={(e) => setSelectedPartId(e.target.value)}
                className="mt-2 h-9 w-full rounded-md border border-input bg-surface-1 px-3 text-xs"
              >
                {inventory.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.name} ({inv.sku}) | Stock: {inv.stock} | ₹{inv.unitCost.toLocaleString("en-IN")}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs">
              Quantity used
              <Input
                type="number"
                min="1"
                value={partQty}
                onChange={(e) => setPartQty(Number(e.target.value) || 1)}
                className="mt-2"
              />
            </label>
          </div>
          <DialogFooter>
            <Button variant="quiet" onClick={() => setPartModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddPart}>Add part</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add / Edit Note Dialog */}
      <Dialog open={noteModalOpen} onOpenChange={setNoteModalOpen}>
        <DialogContent className="border-border bg-popover sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Technician notes: {w.id}</DialogTitle>
            <DialogDescription>Record field observations and diagnostic findings.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="min-h-28 w-full rounded-md border border-input bg-transparent p-3 text-xs"
              placeholder="Enter technician diagnostic observations..."
            />
          </div>
          <DialogFooter>
            <Button variant="quiet" onClick={() => setNoteModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNote}>Save note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[.12em] text-muted-foreground">{label}</p>
      <p className="mt-1.5 text-xs font-medium">{value}</p>
    </div>
  );
}
