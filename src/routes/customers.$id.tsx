import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/keystone/app-shell";
import { CustomerDetail } from "@/components/keystone/workspaces";
export const Route=createFileRoute("/customers/$id")({head:()=>({meta:[{title:"Customer Workspace | KEYSTONE"},{name:"description",content:"Customer locations, assets, service history, and active work."},{property:"og:title",content:"Customer Workspace | KEYSTONE"},{property:"og:description",content:"Enterprise customer service workspace."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Detail});
function Detail(){const {id}=Route.useParams();return <AppShell><CustomerDetail id={id}/></AppShell>}
