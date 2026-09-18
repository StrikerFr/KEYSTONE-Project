import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/keystone/app-shell";
import { WorkOrderDetail } from "@/components/keystone/work-orders";
export const Route=createFileRoute("/work-orders/$id")({head:({params})=>({meta:[{title:`${params.id} | KEYSTONE`},{name:"description",content:"Detailed work order execution, SLA, parts, time, and activity."},{property:"og:title",content:`${params.id} Work Order | KEYSTONE`},{property:"og:description",content:"Detailed field service work order workspace."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Detail});
function Detail(){const {id}=Route.useParams();return <AppShell><WorkOrderDetail id={id}/></AppShell>}
