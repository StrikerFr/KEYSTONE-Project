import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/keystone/app-shell";
import { SlaPage } from "@/components/keystone/workspaces";
export const Route = createFileRoute("/sla")({ head:()=>({meta:[{title:"SLA & Alerts | KEYSTONE"},{name:"description",content:"Monitor service commitments, risk, and breach alerts."},{property:"og:title",content:"SLA & Alerts | KEYSTONE"},{property:"og:description",content:"Monitor service commitments, risk, and breach alerts."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}), component:()=> <AppShell><SlaPage/></AppShell> });
