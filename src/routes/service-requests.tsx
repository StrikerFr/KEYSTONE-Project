import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/keystone/app-shell";
import { ServiceRequestsPage } from "@/components/keystone/workspaces";
export const Route = createFileRoute("/service-requests")({ head:()=>({meta:[{title:"Service Requests | KEYSTONE"},{name:"description",content:"Review and convert customer service requests."},{property:"og:title",content:"Service Requests | KEYSTONE"},{property:"og:description",content:"Review and convert customer service requests."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}), component:()=> <AppShell><ServiceRequestsPage/></AppShell> });
