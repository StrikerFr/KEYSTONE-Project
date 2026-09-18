import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/keystone/app-shell";
import { AssetsPage } from "@/components/keystone/workspaces";
export const Route = createFileRoute("/assets")({ head:()=>({meta:[{title:"Assets | KEYSTONE"},{name:"description",content:"Track facility assets, condition, and maintenance."},{property:"og:title",content:"Assets | KEYSTONE"},{property:"og:description",content:"Track facility assets, condition, and maintenance."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}), component:()=> <AppShell><AssetsPage/></AppShell> });
