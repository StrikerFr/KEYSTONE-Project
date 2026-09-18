import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/keystone/app-shell";
import { ReportsPage } from "@/components/keystone/workspaces";
export const Route = createFileRoute("/reports")({ head:()=>({meta:[{title:"Reports | KEYSTONE"},{name:"description",content:"Operational analytics for work, teams, SLAs, and costs."},{property:"og:title",content:"Reports | KEYSTONE"},{property:"og:description",content:"Operational analytics for work, teams, SLAs, and costs."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}), component:()=> <AppShell><ReportsPage/></AppShell> });
