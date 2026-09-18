import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/keystone/app-shell";
import { TechniciansPage } from "@/components/keystone/workspaces";
export const Route = createFileRoute("/technicians")({ head:()=>({meta:[{title:"Technicians | KEYSTONE"},{name:"description",content:"Manage field technicians, skills, workload, and performance."},{property:"og:title",content:"Technicians | KEYSTONE"},{property:"og:description",content:"Manage field technicians, skills, workload, and performance."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}), component:()=> <AppShell><TechniciansPage/></AppShell> });
