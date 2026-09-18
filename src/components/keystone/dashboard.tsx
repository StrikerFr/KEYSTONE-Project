import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { CalendarDays, ChevronRight, Radio, ShieldCheck } from "lucide-react";
import { useDashboardMetrics, useWorkOrders } from "@/lib/store";
import { Metric, PageHeader, Panel, SectionTabs } from "./shared";
import { StatusPill } from "./status";

export function OperationsDashboard() {
  const [period, setPeriod] = useState("7D");
  const metrics = useDashboardMetrics();
  const workOrders = useWorkOrders();

  // Dynamic SLA Health calculation
  const healthyCount = workOrders.filter((w) => w.status === "Completed" || w.priority === "Low" || w.priority === "Medium").length;
  const atRiskCount = workOrders.filter((w) => w.priority === "High" && w.status !== "Completed").length;
  const breachedCount = workOrders.filter((w) => w.priority === "Critical" && w.status !== "Completed").length;

  const totalEvaluated = healthyCount + atRiskCount + breachedCount || 1;
  const healthyPercent = Math.round((healthyCount / totalEvaluated) * 100);
  const atRiskPercent = Math.round((atRiskCount / totalEvaluated) * 100);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Operations pulse"
        title="Good morning, Admin."
        description="Here is what is happening across your field operations."
        actions={
          <Button variant="quiet">
            <CalendarDays />
            Today | Sep 18, 2026
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-y-6 border-y border-border py-5 md:grid-cols-5">
        <Metric
          value={String(metrics.openOrders)}
          label="Open Work Orders"
          context="Active in pipeline"
        />
        <Metric
          value={String(metrics.inProgress)}
          label="In Progress"
          context="Dispatched technicians"
        />
        <Metric
          value={String(metrics.atRisk)}
          label="SLA At Risk"
          context="Urgent attention required"
          tone={metrics.atRisk > 0 ? "warning" : "default"}
        />
        <Metric
          value={metrics.complianceRate}
          label="SLA Compliance"
          context="Calculated average"
        />
        <Metric
          value={String(metrics.completedToday)}
          label="Completed Today"
          context="Closed out successfully"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,.7fr)]">
        <Panel
          title="Work order activity"
          description="Created and completed volume"
          action={<SectionTabs items={["7D", "30D", "90D"]} active={period} onChange={setPeriod} />}
        >
          <div className="p-4">
            <ChartContainer
              className="h-[290px] w-full aspect-auto"
              config={{
                created: { label: "Created", color: "var(--primary)" },
                completed: { label: "Completed", color: "var(--success)" },
              }}
            >
              <AreaChart data={metrics.activityData} margin={{ left: 0, right: 8, top: 16, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillCreated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="d" tickLine={false} axisLine={false} tickMargin={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  isAnimationActive={false}
                  type="monotone"
                  dataKey="created"
                  stroke="var(--primary)"
                  fill="url(#fillCreated)"
                  strokeWidth={2}
                />
                <Area
                  isAnimationActive={false}
                  type="monotone"
                  dataKey="completed"
                  stroke="var(--success)"
                  fill="transparent"
                  strokeWidth={1.5}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </Panel>

        <Panel
          title="SLA health"
          description="Current active portfolio"
          action={<ShieldCheck className="h-4 w-4 text-primary" />}
        >
          <div className="p-5">
            <div
              className="relative mx-auto grid h-40 w-40 place-items-center rounded-full"
              style={{
                background: `conic-gradient(var(--success) 0 ${healthyPercent}%, var(--warning) ${healthyPercent}% ${
                  healthyPercent + atRiskPercent
                }%, var(--critical) ${healthyPercent + atRiskPercent}% 100%)`,
              }}
            >
              <div className="grid h-28 w-28 place-items-center rounded-full bg-surface-1 text-center">
                <div>
                  <p className="font-mono text-3xl tabular-nums">{metrics.complianceRate}</p>
                  <p className="text-[10px] text-muted-foreground">COMPLIANCE</p>
                </div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="font-mono text-lg text-success">{healthyCount}</p>
                <p className="text-[10px] text-muted-foreground">Healthy</p>
              </div>
              <div>
                <p className="font-mono text-lg text-warning">{atRiskCount}</p>
                <p className="text-[10px] text-muted-foreground">At risk</p>
              </div>
              <div>
                <p className="font-mono text-lg text-critical">{breachedCount}</p>
                <p className="text-[10px] text-muted-foreground">Breached</p>
              </div>
            </div>
          </div>
        </Panel>
      </div>

      <Panel
        title="Live operations"
        description="Active work orders, sorted by urgency"
        action={
          <span className="flex items-center gap-2 text-[10px] text-success">
            <Radio className="h-3 w-3 animate-pulse" />
            LIVE
          </span>
        }
      >
        <div className="divide-y divide-border">
          {workOrders.slice(0, 5).map((w, i) => (
            <Link
              key={w.id}
              to="/work-orders/$id"
              params={{ id: w.id }}
              className="grid gap-3 px-4 py-4 transition-colors hover:bg-accent/40 md:grid-cols-[100px_minmax(180px,1.3fr)_minmax(150px,1fr)_minmax(140px,.8fr)_auto_36px] md:items-center"
            >
              <div>
                <p className="font-mono text-xs text-primary">{w.id}</p>
                <p className="mt-1 text-[10px] text-muted-foreground">0{i + 1}</p>
              </div>
              <div>
                <p className="text-sm font-medium">{w.issue}</p>
                <p className="mt-1 text-xs text-muted-foreground">{w.customer}</p>
              </div>
              <p className="text-xs text-muted-foreground">{w.location}</p>
              <p className="text-xs">{w.technician || "Unassigned"}</p>
              <div className="flex flex-col items-start gap-1.5">
                <StatusPill value={w.status} />
                <span
                  className={
                    w.priority === "Critical"
                      ? "text-[10px] text-critical font-medium"
                      : w.priority === "High"
                      ? "text-[10px] text-warning"
                      : "text-[10px] text-muted-foreground"
                  }
                >
                  {w.sla}
                </span>
              </div>
              <ChevronRight className="hidden h-4 w-4 text-muted-foreground md:block" />
            </Link>
          ))}
        </div>
      </Panel>
    </div>
  );
}
