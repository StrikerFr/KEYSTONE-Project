import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/keystone/app-shell";
import { InventoryPage } from "@/components/keystone/workspaces";
export const Route = createFileRoute("/inventory")({ head:()=>({meta:[{title:"Inventory | KEYSTONE"},{name:"description",content:"Monitor field service parts, stock, and value."},{property:"og:title",content:"Inventory | KEYSTONE"},{property:"og:description",content:"Monitor field service parts, stock, and value."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}), component:()=> <AppShell><InventoryPage/></AppShell> });
