import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/keystone/app-shell";
import { SchedulePage } from "@/components/keystone/workspaces";
export const Route = createFileRoute("/schedule")({ head:()=>({meta:[{title:"Dispatch Schedule | KEYSTONE"},{name:"description",content:"Coordinate technicians and scheduled field work."},{property:"og:title",content:"Dispatch Schedule | KEYSTONE"},{property:"og:description",content:"Coordinate technicians and scheduled field work."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}), component:()=> <AppShell><SchedulePage/></AppShell> });
