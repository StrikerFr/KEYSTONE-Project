import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/keystone/app-shell";
import { CustomersPage } from "@/components/keystone/workspaces";
export const Route = createFileRoute("/customers")({ head:()=>({meta:[{title:"Customers | KEYSTONE"},{name:"description",content:"Customer service relationships, locations, and work history."},{property:"og:title",content:"Customers | KEYSTONE"},{property:"og:description",content:"Customer service relationships, locations, and work history."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}), component:()=> <AppShell><CustomersPage/></AppShell> });
