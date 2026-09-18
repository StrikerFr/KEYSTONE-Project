import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/keystone/app-shell";
import { TechnicianDetail } from "@/components/keystone/workspaces";
export const Route=createFileRoute("/technicians/$id")({head:()=>({meta:[{title:"Technician Profile | KEYSTONE"},{name:"description",content:"Technician skills, assignments, schedule, and performance."},{property:"og:title",content:"Technician Profile | KEYSTONE"},{property:"og:description",content:"Field technician operational profile."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Detail});
function Detail(){const {id}=Route.useParams();return <AppShell><TechnicianDetail id={id}/></AppShell>}
