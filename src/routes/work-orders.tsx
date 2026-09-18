import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/keystone/app-shell";
import { WorkOrdersPage } from "@/components/keystone/work-orders";
export const Route = createFileRoute("/work-orders")({ head:()=>({meta:[{title:"Work Orders | KEYSTONE"},{name:"description",content:"Manage, assign, and monitor field service work orders."},{property:"og:title",content:"Work Orders | KEYSTONE"},{property:"og:description",content:"Manage, assign, and monitor field service work orders."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}), component:()=> <AppShell><WorkOrdersPage/></AppShell> });
