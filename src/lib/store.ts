import { useSyncExternalStore } from "react";
import type {
  Asset,
  Customer,
  InventoryItem,
  Notification,
  Priority,
  ServiceRequest,
  Technician,
  WorkOrder,
  WorkOrderStatus,
} from "@/types/domain";
import {
  assets as initialAssets,
  customers as initialCustomers,
  inventory as initialInventory,
  notifications as initialNotifications,
  requests as initialRequests,
  technicians as initialTechnicians,
  workOrders as initialWorkOrders,
  activityData as initialActivityData,
} from "@/data/mock";

export interface ExtendedWorkOrder extends WorkOrder {
  notes?: string;
  parts?: { name: string; qty: number; cost: number }[];
  timeline?: { text: string; time: string; done: boolean }[];
}

export interface StoreState {
  workOrders: ExtendedWorkOrder[];
  technicians: Technician[];
  requests: ServiceRequest[];
  customers: Customer[];
  assets: Asset[];
  inventory: InventoryItem[];
  notifications: Notification[];
  activityData: { d: string; created: number; completed: number }[];
}

const STORAGE_KEY = "keystone_ops_store_v1";

function loadInitialState(): StoreState {
  if (typeof window === "undefined") {
    return {
      workOrders: initialWorkOrders,
      technicians: initialTechnicians,
      requests: initialRequests,
      customers: initialCustomers,
      assets: initialAssets,
      inventory: initialInventory,
      notifications: initialNotifications,
      activityData: initialActivityData,
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.workOrders) && parsed.workOrders.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed to parse store from localStorage", e);
  }

  return {
    workOrders: initialWorkOrders,
    technicians: initialTechnicians,
    requests: initialRequests,
    customers: initialCustomers,
    assets: initialAssets,
    inventory: initialInventory,
    notifications: initialNotifications,
    activityData: initialActivityData,
  };
}

let currentState: StoreState = loadInitialState();
const listeners = new Set<() => void>();

function notify() {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));
    } catch (e) {
      console.error("Failed to save store to localStorage", e);
    }
  }
  listeners.forEach((listener) => listener());
}

export const store = {
  getSnapshot(): StoreState {
    return currentState;
  },

  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  reset() {
    currentState = {
      workOrders: initialWorkOrders,
      technicians: initialTechnicians,
      requests: initialRequests,
      customers: initialCustomers,
      assets: initialAssets,
      inventory: initialInventory,
      notifications: initialNotifications,
      activityData: initialActivityData,
    };
    notify();
  },

  createWorkOrder(input: {
    issue: string;
    customer?: string;
    location?: string;
    priority?: Priority;
    technician?: string;
    description?: string;
    asset?: string;
  }): ExtendedWorkOrder {
    const nextNum = 1042 + currentState.workOrders.length;
    const id = `WO-${nextNum}`;
    const priority = input.priority || "Medium";
    const customer = input.customer || "XYZ Mall";
    const location = input.location || "Building A · Floor 1";
    const technician = input.technician || "Unassigned";
    const status: WorkOrderStatus = technician && technician !== "Unassigned" ? "Assigned" : "New";

    let sla = "3h remaining";
    let progress = 10;
    if (priority === "Critical") {
      sla = "18m remaining";
      progress = 20;
    } else if (priority === "High") {
      sla = "45m remaining";
      progress = 15;
    } else if (priority === "Low") {
      sla = "8h remaining";
      progress = 5;
    }

    const now = new Date();
    const timeStr = `Today, ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const newWO: ExtendedWorkOrder = {
      id,
      issue: input.issue,
      customer,
      location,
      priority,
      technician,
      status,
      sla,
      created: timeStr,
      progress,
      asset: input.asset || "AHU-04",
      description: input.description || "Diagnostics initiated for operational service call.",
      timeline: [
        { text: `Work order logged: ${input.issue}`, time: timeStr, done: true },
        ...(technician !== "Unassigned" ? [{ text: `Assigned to ${technician}`, time: timeStr, done: true }] : []),
        { text: "On site diagnostic arrival pending", time: "Pending", done: false },
        { text: "Resolution & close-out", time: "Pending", done: false },
      ],
      parts: [],
    };

    // Update technician workload
    const updatedTechnicians = currentState.technicians.map((t) => {
      if (t.name === technician) {
        return { ...t, activeJobs: t.activeJobs + 1, status: "On Job" as const };
      }
      return t;
    });

    // Update customer open orders
    const updatedCustomers = currentState.customers.map((c) => {
      if (c.name.toLowerCase() === customer.toLowerCase()) {
        return { ...c, openOrders: c.openOrders + 1 };
      }
      return c;
    });

    // Create notification
    const newNotif: Notification = {
      id: `n-${Date.now()}`,
      title: `New work order ${id}`,
      body: `${input.issue} logged for ${customer}.`,
      time: "Just now",
      kind: priority === "Critical" ? "critical" : priority === "High" ? "warning" : "info",
      unread: true,
    };

    // Update activity data for today
    const updatedActivity = currentState.activityData.map((a, i) => {
      if (i === currentState.activityData.length - 1) {
        return { ...a, created: a.created + 1 };
      }
      return a;
    });

    currentState = {
      ...currentState,
      workOrders: [newWO, ...currentState.workOrders],
      technicians: updatedTechnicians,
      customers: updatedCustomers,
      notifications: [newNotif, ...currentState.notifications],
      activityData: updatedActivity,
    };

    notify();
    return newWO;
  },

  updateWorkOrderStatus(id: string, newStatus: WorkOrderStatus, note?: string) {
    let resolved = false;
    let assignedTech = "";

    const updatedWorkOrders = currentState.workOrders.map((w) => {
      if (w.id === id) {
        assignedTech = w.technician;
        const isComp = newStatus === "Completed" || newStatus === "Closed";
        if (isComp && w.status !== "Completed" && w.status !== "Closed") {
          resolved = true;
        }

        let newSla = w.sla;
        let newProg = w.progress;
        if (isComp) {
          newSla = "Resolved on time";
          newProg = 100;
        } else if (newStatus === "In Progress") {
          newProg = Math.max(w.progress, 65);
        } else if (newStatus === "On Hold") {
          newSla = "Paused (Awaiting parts)";
        }

        const updatedTimeline = w.timeline ? [...w.timeline] : [];
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        updatedTimeline.push({
          text: `Status updated to ${newStatus}${note ? `: ${note}` : ""}`,
          time: timeStr,
          done: true,
        });

        return {
          ...w,
          status: newStatus,
          sla: newSla,
          progress: newProg,
          notes: note ? (w.notes ? `${w.notes}\n${note}` : note) : w.notes,
          timeline: updatedTimeline,
        };
      }
      return w;
    });

    let updatedTechnicians = currentState.technicians;
    if (resolved && assignedTech && assignedTech !== "Unassigned") {
      updatedTechnicians = currentState.technicians.map((t) => {
        if (t.name === assignedTech) {
          return {
            ...t,
            activeJobs: Math.max(0, t.activeJobs - 1),
            completedJobs: t.completedJobs + 1,
            status: t.activeJobs - 1 <= 0 ? ("Available" as const) : ("On Job" as const),
          };
        }
        return t;
      });
    }

    const newNotif: Notification = {
      id: `n-${Date.now()}`,
      title: `${id} updated`,
      body: `Status is now ${newStatus}.`,
      time: "Just now",
      kind: newStatus === "Completed" ? "success" : "info",
      unread: true,
    };

    const updatedActivity = currentState.activityData.map((a, i) => {
      if (i === currentState.activityData.length - 1 && resolved) {
        return { ...a, completed: a.completed + 1 };
      }
      return a;
    });

    currentState = {
      ...currentState,
      workOrders: updatedWorkOrders,
      technicians: updatedTechnicians,
      notifications: [newNotif, ...currentState.notifications],
      activityData: updatedActivity,
    };

    notify();
  },

  assignTechnician(id: string, technicianName: string) {
    const updatedWorkOrders = currentState.workOrders.map((w) => {
      if (w.id === id) {
        return {
          ...w,
          technician: technicianName,
          status: w.status === "New" ? ("Assigned" as const) : w.status,
        };
      }
      return w;
    });

    const updatedTechnicians = currentState.technicians.map((t) => {
      if (t.name === technicianName) {
        return { ...t, activeJobs: t.activeJobs + 1, status: "On Job" as const };
      }
      return t;
    });

    currentState = {
      ...currentState,
      workOrders: updatedWorkOrders,
      technicians: updatedTechnicians,
      notifications: [
        {
          id: `n-${Date.now()}`,
          title: `Technician assigned`,
          body: `${id} assigned to ${technicianName}.`,
          time: "Just now",
          kind: "info",
          unread: true,
        },
        ...currentState.notifications,
      ],
    };

    notify();
  },

  addPartToWorkOrder(woId: string, partName: string, qty: number, cost: number) {
    const updatedWorkOrders = currentState.workOrders.map((w) => {
      if (w.id === woId) {
        const parts = w.parts ? [...w.parts] : [];
        parts.push({ name: partName, qty, cost });
        return { ...w, parts };
      }
      return w;
    });

    // Deduct stock if matching inventory item exists
    const updatedInventory = currentState.inventory.map((inv) => {
      if (inv.name.toLowerCase().includes(partName.toLowerCase()) || partName.toLowerCase().includes(inv.name.toLowerCase())) {
        const newStock = Math.max(0, inv.stock - qty);
        const status = newStock === 0 ? ("Out of Stock" as const) : newStock < inv.minimum ? ("Low Stock" as const) : ("In Stock" as const);
        return { ...inv, stock: newStock, status };
      }
      return inv;
    });

    currentState = {
      ...currentState,
      workOrders: updatedWorkOrders,
      inventory: updatedInventory,
    };

    notify();
  },

  createServiceRequest(input: {
    issue: string;
    customer?: string;
    location?: string;
    priority?: Priority;
  }): ServiceRequest {
    const nextId = `SR-${2082 + currentState.requests.length}`;
    const newReq: ServiceRequest = {
      id: nextId,
      issue: input.issue,
      customer: input.customer || "XYZ Mall",
      location: input.location || "Building A · Level 2",
      priority: input.priority || "Medium",
      submitted: "Just now",
      status: "New",
    };

    currentState = {
      ...currentState,
      requests: [newReq, ...currentState.requests],
      notifications: [
        {
          id: `n-${Date.now()}`,
          title: `New service request ${nextId}`,
          body: `${input.issue} submitted by ${input.customer || "customer"}.`,
          time: "Just now",
          kind: "info",
          unread: true,
        },
        ...currentState.notifications,
      ],
    };

    notify();
    return newReq;
  },

  convertRequestToWorkOrder(requestId: string): ExtendedWorkOrder | null {
    const req = currentState.requests.find((r) => r.id === requestId);
    if (!req) return null;

    const updatedRequests = currentState.requests.map((r) => {
      if (r.id === requestId) {
        return { ...r, status: "Converted" as const };
      }
      return r;
    });

    currentState = {
      ...currentState,
      requests: updatedRequests,
    };

    return store.createWorkOrder({
      issue: req.issue,
      customer: req.customer,
      location: req.location,
      priority: req.priority,
      description: `Converted from Service Request ${req.id}.`,
    });
  },

  updateInventoryStock(id: string, newStock: number) {
    const updated = currentState.inventory.map((item) => {
      if (item.id === id) {
        const status = newStock === 0 ? ("Out of Stock" as const) : newStock < item.minimum ? ("Low Stock" as const) : ("In Stock" as const);
        return { ...item, stock: newStock, status };
      }
      return item;
    });

    currentState = {
      ...currentState,
      inventory: updated,
    };

    notify();
  },

  addInventoryItem(item: Omit<InventoryItem, "id" | "status">) {
    const id = `P-${305 + currentState.inventory.length}`;
    const status = item.stock === 0 ? ("Out of Stock" as const) : item.stock < item.minimum ? ("Low Stock" as const) : ("In Stock" as const);
    const newItem: InventoryItem = {
      ...item,
      id,
      status,
    };

    currentState = {
      ...currentState,
      inventory: [...currentState.inventory, newItem],
    };

    notify();
  },

  addCustomer(customer: Omit<Customer, "id" | "openOrders" | "lastService">) {
    const id = customer.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const newCust: Customer = {
      ...customer,
      id,
      openOrders: 0,
      lastService: "Today, Just now",
    };

    currentState = {
      ...currentState,
      customers: [...currentState.customers, newCust],
    };

    notify();
  },

  addTechnician(tech: Omit<Technician, "id" | "initials" | "activeJobs" | "completedJobs" | "slaScore">) {
    const id = tech.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const initials = tech.name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const newTech: Technician = {
      ...tech,
      id,
      initials,
      activeJobs: 0,
      completedJobs: 0,
      slaScore: 100,
    };

    currentState = {
      ...currentState,
      technicians: [...currentState.technicians, newTech],
    };

    notify();
  },

  addAsset(asset: Omit<Asset, "lastService" | "nextMaintenance">) {
    const newAsset: Asset = {
      ...asset,
      lastService: "Today",
      nextMaintenance: "In 90 days",
    };

    currentState = {
      ...currentState,
      assets: [...currentState.assets, newAsset],
    };

    notify();
  },

  markAllNotificationsRead() {
    currentState = {
      ...currentState,
      notifications: currentState.notifications.map((n) => ({ ...n, unread: false })),
    };
    notify();
  },
};

// React Hooks
export function useStore(): StoreState {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
}

export function useWorkOrders(): ExtendedWorkOrder[] {
  const s = useStore();
  return s.workOrders;
}

export function useTechnicians(): Technician[] {
  const s = useStore();
  return s.technicians;
}

export function useServiceRequests(): ServiceRequest[] {
  const s = useStore();
  return s.requests;
}

export function useCustomers(): Customer[] {
  const s = useStore();
  return s.customers;
}

export function useAssets(): Asset[] {
  const s = useStore();
  return s.assets;
}

export function useInventory(): InventoryItem[] {
  const s = useStore();
  return s.inventory;
}

export function useNotifications(): Notification[] {
  const s = useStore();
  return s.notifications;
}

export function useDashboardMetrics() {
  const s = useStore();
  const openOrders = s.workOrders.filter((w) => w.status !== "Completed" && w.status !== "Closed").length;
  const inProgress = s.workOrders.filter((w) => w.status === "In Progress").length;
  const atRisk = s.workOrders.filter((w) => w.priority === "Critical" || (w.priority === "High" && w.status !== "Completed")).length;
  const completedToday = s.workOrders.filter((w) => w.status === "Completed" || w.status === "Closed").length;
  
  // Calculate dynamic SLA compliance %
  const totalClosed = s.technicians.reduce((acc, t) => acc + t.completedJobs, 0) + completedToday;
  const avgSla = s.technicians.length > 0
    ? (s.technicians.reduce((acc, t) => acc + t.slaScore, 0) / s.technicians.length).toFixed(1)
    : "95.4";

  return {
    openOrders,
    inProgress,
    atRisk,
    completedToday,
    complianceRate: `${avgSla}%`,
    recentOrders: s.workOrders.slice(0, 5),
    activityData: s.activityData,
  };
}
