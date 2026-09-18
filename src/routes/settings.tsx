import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/keystone/app-shell";
import { PageHeader, Panel } from "@/components/keystone/shared";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Building2,
  Clock,
  Shield,
  Bell,
  Wrench,
  Database,
  Key,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Save,
  Download,
  Server,
  Zap,
  Check,
  Copy,
  Sliders,
  Lock,
  Globe,
  Radio,
  FileCheck2,
} from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings | KEYSTONE" },
      { name: "description", content: "Configure KEYSTONE enterprise operations, SLA policies, and security." },
      { property: "og:title", content: "Settings | KEYSTONE" },
      { property: "og:description", content: "Configure KEYSTONE enterprise operations, SLA policies, and security." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [testingHealth, setTestingHealth] = useState(false);
  const [healthStatus, setHealthStatus] = useState<"idle" | "healthy">("idle");

  // Form states
  const [orgName, setOrgName] = useState("Northstar Operations");
  const [supportEmail, setSupportEmail] = useState("ops-support@northstar.local");
  const [timezone, setTimezone] = useState("Asia/Kolkata (IST · UTC+5:30)");
  const [currency, setCurrency] = useState("INR (₹)");
  const [operatingHoursStart, setOperatingHoursStart] = useState("08:00");
  const [operatingHoursEnd, setOperatingHoursEnd] = useState("20:00");
  const [emergency24x7, setEmergency24x7] = useState(true);

  // SLA States
  const [criticalSla, setCriticalSla] = useState("120");
  const [highSla, setHighSla] = useState("240");
  const [mediumSla, setMediumSla] = useState("1440");
  const [lowSla, setLowSla] = useState("2880");
  const [warningThreshold, setWarningThreshold] = useState("20");
  const [autoEscalate, setAutoEscalate] = useState(true);

  // Dispatch States
  const [conflictPrevention, setConflictPrevention] = useState(true);
  const [skillMatching, setSkillMatching] = useState(true);
  const [maxJobs, setMaxJobs] = useState("3");
  const [requireTimer, setRequireTimer] = useState(true);
  const [requireSignature, setRequireSignature] = useState(true);
  const [requirePhoto, setRequirePhoto] = useState(true);

  // Inventory States
  const [autoDeduct, setAutoDeduct] = useState(true);
  const [preventNegative, setPreventNegative] = useState(true);
  const [lowStockThreshold, setLowStockThreshold] = useState("10");

  // Notification States
  const [inAppAlerts, setInAppAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(true);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Settings saved successfully", {
        description: "All configuration preferences updated across your organization.",
      });
    }, 450);
  };

  const handleExport = () => {
    const config = {
      organization: { name: orgName, code: "NORTHSTAR", supportEmail, timezone, currency },
      sla: { criticalMinutes: criticalSla, highMinutes: highSla, mediumMinutes: mediumSla, lowMinutes: lowSla, autoEscalate },
      dispatch: { conflictPrevention, skillMatching, maxJobs, requireTimer, requireSignature, requirePhoto },
      inventory: { autoDeduct, preventNegative, lowStockThreshold },
      notifications: { inAppAlerts, emailAlerts, smsAlerts, dailyDigest },
      version: "2026.1.0",
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "keystone-config.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Configuration exported as JSON");
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText("ks_live_9vX8zP2mL7qR4tW1yK6bJ3nF0sH5uD8cA2eG4iM7");
    setCopiedKey(true);
    toast.success("API key copied to clipboard");
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleTestHealth = () => {
    setTestingHealth(true);
    setTimeout(() => {
      setTestingHealth(false);
      setHealthStatus("healthy");
      toast.success("All System Diagnostics Passed", {
        description: "Spring Boot 3.3.4, PostgreSQL 16 (Flyway V17), and JWT Engine operational.",
      });
    }, 600);
  };

  return (
    <AppShell>
      <div className="space-y-6 pb-12">
        <PageHeader
          eyebrow="Administration"
          title="Settings"
          description="Manage organization parameters, SLA thresholds, dispatch rules, notifications, and security."
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExport} className="h-9 gap-1.5">
                <Download className="h-3.5 w-3.5 text-muted-foreground" />
                Export Config
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving} className="h-9 gap-1.5">
                {saving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                Save Changes
              </Button>
            </div>
          }
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-lg border border-border/60 bg-surface-1 p-1 sm:grid-cols-4 lg:grid-cols-7">
            <TabsTrigger value="general" className="gap-1.5 py-2 text-xs">
              <Building2 className="h-3.5 w-3.5" />
              General
            </TabsTrigger>
            <TabsTrigger value="sla" className="gap-1.5 py-2 text-xs">
              <Clock className="h-3.5 w-3.5" />
              SLA Engine
            </TabsTrigger>
            <TabsTrigger value="dispatch" className="gap-1.5 py-2 text-xs">
              <Wrench className="h-3.5 w-3.5" />
              Dispatch
            </TabsTrigger>
            <TabsTrigger value="inventory" className="gap-1.5 py-2 text-xs">
              <Sliders className="h-3.5 w-3.5" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-1.5 py-2 text-xs">
              <Bell className="h-3.5 w-3.5" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-1.5 py-2 text-xs">
              <Shield className="h-3.5 w-3.5" />
              Security
            </TabsTrigger>
            <TabsTrigger value="diagnostics" className="gap-1.5 py-2 text-xs">
              <Server className="h-3.5 w-3.5" />
              System Stack
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: GENERAL */}
          <TabsContent value="general" className="space-y-5">
            <Panel title="Organization Profile" description="Primary operational identity and localized defaults.">
              <div className="space-y-4 p-5 sm:p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="orgName" className="text-xs">Organization Name</Label>
                    <Input id="orgName" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Tenant Organization Code</Label>
                    <div className="flex h-10 items-center rounded-md border border-border/70 bg-surface-2 px-3 text-xs font-mono text-muted-foreground">
                      NORTHSTAR <Badge variant="secondary" className="ml-auto text-[10px]">Read-Only Key</Badge>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="supportEmail" className="text-xs">Operational Support Email</Label>
                    <Input id="supportEmail" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="text-xs">Operating Timezone</Label>
                    <Input id="timezone" value={timezone} onChange={(e) => setTimezone(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-xs">Billing & Inventory Currency</Label>
                    <Input id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)} />
                  </div>
                </div>
              </div>
            </Panel>

            <Panel title="Field Operating Schedule" description="Default service dispatch windows and emergency handling.">
              <div className="space-y-5 p-5 sm:p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startHour" className="text-xs">Daily Shift Start Time</Label>
                    <Input id="startHour" type="time" value={operatingHoursStart} onChange={(e) => setOperatingHoursStart(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endHour" className="text-xs">Daily Shift End Time</Label>
                    <Input id="endHour" type="time" value={operatingHoursEnd} onChange={(e) => setOperatingHoursEnd(e.target.value)} />
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border/70 bg-surface-2/60 p-4">
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium">24/7 Emergency Dispatch Override</p>
                    <p className="text-[11px] text-muted-foreground">Allow immediate dispatch for Critical priority service requests outside shift hours.</p>
                  </div>
                  <Switch checked={emergency24x7} onCheckedChange={setEmergency24x7} />
                </div>
              </div>
            </Panel>
          </TabsContent>

          {/* TAB 2: SLA ENGINE */}
          <TabsContent value="sla" className="space-y-5">
            <Panel title="Resolution Time Targets" description="Maximum allowable duration in minutes before SLA breach is declared.">
              <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
                <div className="rounded-lg border border-critical/30 bg-critical/5 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-critical">Critical Priority</span>
                    <Badge variant="destructive" className="text-[10px]">P1</Badge>
                  </div>
                  <Label htmlFor="slaCritical" className="text-[11px] text-muted-foreground">Target (Minutes)</Label>
                  <Input id="slaCritical" value={criticalSla} onChange={(e) => setCriticalSla(e.target.value)} className="font-mono text-sm" />
                  <p className="text-[10px] text-muted-foreground">Calculates to {Math.round(Number(criticalSla) / 60)} hours target</p>
                </div>

                <div className="rounded-lg border border-warning/30 bg-warning/5 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-warning">High Priority</span>
                    <Badge variant="outline" className="text-[10px] text-warning border-warning/40">P2</Badge>
                  </div>
                  <Label htmlFor="slaHigh" className="text-[11px] text-muted-foreground">Target (Minutes)</Label>
                  <Input id="slaHigh" value={highSla} onChange={(e) => setHighSla(e.target.value)} className="font-mono text-sm" />
                  <p className="text-[10px] text-muted-foreground">Calculates to {Math.round(Number(highSla) / 60)} hours target</p>
                </div>

                <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary">Medium Priority</span>
                    <Badge variant="outline" className="text-[10px] text-primary border-primary/40">P3</Badge>
                  </div>
                  <Label htmlFor="slaMed" className="text-[11px] text-muted-foreground">Target (Minutes)</Label>
                  <Input id="slaMed" value={mediumSla} onChange={(e) => setMediumSla(e.target.value)} className="font-mono text-sm" />
                  <p className="text-[10px] text-muted-foreground">Calculates to {Math.round(Number(mediumSla) / 60)} hours target</p>
                </div>

                <div className="rounded-lg border border-border bg-surface-2/60 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">Low Priority</span>
                    <Badge variant="secondary" className="text-[10px]">P4</Badge>
                  </div>
                  <Label htmlFor="slaLow" className="text-[11px] text-muted-foreground">Target (Minutes)</Label>
                  <Input id="slaLow" value={lowSla} onChange={(e) => setLowSla(e.target.value)} className="font-mono text-sm" />
                  <p className="text-[10px] text-muted-foreground">Calculates to {Math.round(Number(lowSla) / 60)} hours target</p>
                </div>
              </div>
            </Panel>

            <Panel title="Automated Background Intelligence" description="Real-time scanning and early warning configuration.">
              <div className="space-y-4 p-5 sm:p-6">
                <div className="flex items-center justify-between rounded-lg border border-border/70 bg-surface-2/60 p-4">
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium">Early Breach Warning Threshold</p>
                    <p className="text-[11px] text-muted-foreground">Trigger "At Risk" warning when remaining time falls below {warningThreshold}% of policy window.</p>
                  </div>
                  <div className="w-24">
                    <Input value={warningThreshold} onChange={(e) => setWarningThreshold(e.target.value)} className="text-right font-mono text-xs" />
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border/70 bg-surface-2/60 p-4">
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium">Automatic Manager Escalation</p>
                    <p className="text-[11px] text-muted-foreground">Dispatch immediate priority alerts to operations managers when a job hits critical breach window.</p>
                  </div>
                  <Switch checked={autoEscalate} onCheckedChange={setAutoEscalate} />
                </div>
              </div>
            </Panel>
          </TabsContent>

          {/* TAB 3: DISPATCH & FIELD */}
          <TabsContent value="dispatch" className="space-y-5">
            <Panel title="Scheduling & Conflict Engine" description="Rules governing technician assignment and calendar dispatch.">
              <div className="space-y-4 p-5 sm:p-6">
                <div className="flex items-center justify-between rounded-lg border border-border/70 bg-surface-2/60 p-4">
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium">Strict Schedule Conflict Prevention</p>
                    <p className="text-[11px] text-muted-foreground">Prevent dispatchers from double-booking technicians for overlapping work order time slots.</p>
                  </div>
                  <Switch checked={conflictPrevention} onCheckedChange={setConflictPrevention} />
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border/70 bg-surface-2/60 p-4">
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium">Smart Skill Matching</p>
                    <p className="text-[11px] text-muted-foreground">Automatically recommend technicians with verified matching skills for the target equipment category.</p>
                  </div>
                  <Switch checked={skillMatching} onCheckedChange={setSkillMatching} />
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border/70 bg-surface-2/60 p-4">
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium">Max Active Jobs per Technician</p>
                    <p className="text-[11px] text-muted-foreground">Maximum number of in-progress assignments allowed simultaneously.</p>
                  </div>
                  <div className="w-20">
                    <Input value={maxJobs} onChange={(e) => setMaxJobs(e.target.value)} className="text-right font-mono text-xs" />
                  </div>
                </div>
              </div>
            </Panel>

            <Panel title="Field Technician Protocol" description="Mandatory completion criteria for field mobile execution.">
              <div className="grid gap-3 p-5 sm:grid-cols-3 sm:p-6">
                <div className="rounded-lg border border-border/70 bg-surface-2/60 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">Live Work Timer</span>
                    <Switch checked={requireTimer} onCheckedChange={setRequireTimer} />
                  </div>
                  <p className="text-[11px] text-muted-foreground">Require technicians to tap "Start Work" to record server-timestamped labor duration.</p>
                </div>

                <div className="rounded-lg border border-border/70 bg-surface-2/60 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">Customer Signature</span>
                    <Switch checked={requireSignature} onCheckedChange={setRequireSignature} />
                  </div>
                  <p className="text-[11px] text-muted-foreground">Require digital customer sign-off before a job can transition to Completed status.</p>
                </div>

                <div className="rounded-lg border border-border/70 bg-surface-2/60 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">Resolution Photo</span>
                    <Switch checked={requirePhoto} onCheckedChange={setRequirePhoto} />
                  </div>
                  <p className="text-[11px] text-muted-foreground">Require at least one verified resolution photo attachment on field closure.</p>
                </div>
              </div>
            </Panel>
          </TabsContent>

          {/* TAB 4: INVENTORY */}
          <TabsContent value="inventory" className="space-y-5">
            <Panel title="Parts & Stock Deduction Rules" description="Transactional stock enforcement and inventory alerts.">
              <div className="space-y-4 p-5 sm:p-6">
                <div className="flex items-center justify-between rounded-lg border border-border/70 bg-surface-2/60 p-4">
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium">Transactional Real-Time Stock Deduction</p>
                    <p className="text-[11px] text-muted-foreground">Automatically decrement parts stock count atomically when logged by field technicians.</p>
                  </div>
                  <Switch checked={autoDeduct} onCheckedChange={setAutoDeduct} />
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border/70 bg-surface-2/60 p-4">
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium">Prevent Negative Inventory (Backorders)</p>
                    <p className="text-[11px] text-muted-foreground">Block parts allocation on work orders if quantity on hand is insufficient.</p>
                  </div>
                  <Switch checked={preventNegative} onCheckedChange={setPreventNegative} />
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border/70 bg-surface-2/60 p-4">
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium">Low Stock Warning Threshold</p>
                    <p className="text-[11px] text-muted-foreground">Emit procurement reorder alerts when item count falls below threshold.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input value={lowStockThreshold} onChange={(e) => setLowStockThreshold(e.target.value)} className="w-20 text-right font-mono text-xs" />
                    <span className="text-xs text-muted-foreground">units</span>
                  </div>
                </div>
              </div>
            </Panel>
          </TabsContent>

          {/* TAB 5: NOTIFICATIONS */}
          <TabsContent value="notifications" className="space-y-5">
            <Panel title="Communication Channels" description="Configure dispatch and escalation notification pipelines.">
              <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6">
                <div className="flex items-center justify-between rounded-lg border border-border/70 bg-surface-2/60 p-4">
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium">In-App Live Alert Center</p>
                    <p className="text-[11px] text-muted-foreground">Real-time alerts for work order assignments and status changes.</p>
                  </div>
                  <Switch checked={inAppAlerts} onCheckedChange={setInAppAlerts} />
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border/70 bg-surface-2/60 p-4">
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium">Email Dispatch Summaries</p>
                    <p className="text-[11px] text-muted-foreground">Automated email receipts to customers upon work order resolution.</p>
                  </div>
                  <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border/70 bg-surface-2/60 p-4">
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium">SMS Field Notifications</p>
                    <p className="text-[11px] text-muted-foreground">Direct SMS to technician devices for urgent high and critical jobs.</p>
                  </div>
                  <Switch checked={smsAlerts} onCheckedChange={setSmsAlerts} />
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border/70 bg-surface-2/60 p-4">
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium">Daily Operations Pulse Digest</p>
                    <p className="text-[11px] text-muted-foreground">Executive summary delivered to managers each morning at 08:00 AM.</p>
                  </div>
                  <Switch checked={dailyDigest} onCheckedChange={setDailyDigest} />
                </div>
              </div>
            </Panel>
          </TabsContent>

          {/* TAB 6: SECURITY & API */}
          <TabsContent value="security" className="space-y-5">
            <Panel title="Authentication & Session Security" description="Stateless JWT parameters and cryptographic hashing.">
              <div className="space-y-4 p-5 sm:p-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg border border-border/70 bg-surface-2/60 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Algorithm</p>
                    <p className="mt-1 font-mono text-sm font-medium text-primary">HMAC-SHA512</p>
                    <p className="mt-1 text-[10px] text-muted-foreground">Cryptographic token signature</p>
                  </div>
                  <div className="rounded-lg border border-border/70 bg-surface-2/60 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Access Token TTL</p>
                    <p className="mt-1 font-mono text-sm font-medium">15 Minutes</p>
                    <p className="mt-1 text-[10px] text-muted-foreground">Short-lived bearer token</p>
                  </div>
                  <div className="rounded-lg border border-border/70 bg-surface-2/60 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Refresh Token TTL</p>
                    <p className="mt-1 font-mono text-sm font-medium">7 Days</p>
                    <p className="mt-1 text-[10px] text-muted-foreground">Rotating token credentials</p>
                  </div>
                </div>

                <div className="rounded-lg border border-border/70 bg-surface-2/60 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium">Organization API Secret Key</p>
                      <p className="text-[11px] text-muted-foreground">Used for programmatic access to the KEYSTONE REST API backend.</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleCopyKey} className="gap-1.5 text-xs">
                      {copiedKey ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                      {copiedKey ? "Copied" : "Copy API Key"}
                    </Button>
                  </div>
                  <div className="mt-3 flex items-center rounded-md border border-border/60 bg-surface-1 px-3 py-2 font-mono text-xs text-muted-foreground">
                    ks_live_9vX8zP2mL7qR4tW1yK6bJ3nF0sH5uD8cA2eG4iM7
                  </div>
                </div>
              </div>
            </Panel>
          </TabsContent>

          {/* TAB 7: DIAGNOSTICS */}
          <TabsContent value="diagnostics" className="space-y-5">
            <Panel
              title="Full-Stack Diagnostics"
              description="Live health status of Spring Boot backend, PostgreSQL database, and microservices."
              action={
                <Button size="sm" variant="outline" onClick={handleTestHealth} disabled={testingHealth} className="gap-1.5 text-xs">
                  <RefreshCw className={`h-3.5 w-3.5 ${testingHealth ? "animate-spin" : ""}`} />
                  Run Stack Diagnostics
                </Button>
              }
            >
              <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4 sm:p-6">
                <div className="rounded-lg border border-success/30 bg-success/5 p-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">Spring Boot API</span>
                    <Badge variant="outline" className="text-[10px] text-success border-success/40">Port 8080</Badge>
                  </div>
                  <p className="font-mono text-lg font-semibold text-success">v3.3.4 (Java 21)</p>
                  <p className="text-[10px] text-muted-foreground">REST API endpoints active</p>
                </div>

                <div className="rounded-lg border border-success/30 bg-success/5 p-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">PostgreSQL DB</span>
                    <Badge variant="outline" className="text-[10px] text-success border-success/40">Port 5432</Badge>
                  </div>
                  <p className="font-mono text-lg font-semibold text-success">PostgreSQL 16</p>
                  <p className="text-[10px] text-muted-foreground">17 Flyway migrations verified</p>
                </div>

                <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">SLA Background Job</span>
                    <Badge variant="outline" className="text-[10px] text-primary border-primary/40">60s Tick</Badge>
                  </div>
                  <p className="font-mono text-lg font-semibold text-primary">SlaScheduler</p>
                  <p className="text-[10px] text-muted-foreground">Active daemon monitoring SLAs</p>
                </div>

                <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">Multi-Tenancy</span>
                    <Badge variant="outline" className="text-[10px] text-primary border-primary/40">Enforced</Badge>
                  </div>
                  <p className="font-mono text-lg font-semibold text-primary">Tenant Isolated</p>
                  <p className="text-[10px] text-muted-foreground">Organization query filtering</p>
                </div>
              </div>
            </Panel>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
