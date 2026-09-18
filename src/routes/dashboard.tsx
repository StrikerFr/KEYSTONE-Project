import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/keystone/app-shell";
import { OperationsDashboard } from "@/components/keystone/dashboard";
export const Route = createFileRoute("/dashboard")({ head:()=>({meta:[{title:"Operations Dashboard | KEYSTONE"},{name:"description",content:"Live field service operations, SLA health, and work-order activity."},{property:"og:title",content:"Operations Dashboard | KEYSTONE"},{property:"og:description",content:"Live field service operations, SLA health, and work-order activity."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}), component:()=> <AppShell><OperationsDashboard/></AppShell> });
