import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/keystone/app-shell";
import { AssetDetail } from "@/components/keystone/workspaces";
export const Route=createFileRoute("/assets/$id")({head:()=>({meta:[{title:"Asset Workspace | KEYSTONE"},{name:"description",content:"Asset information, maintenance, parts, and service history."},{property:"og:title",content:"Asset Workspace | KEYSTONE"},{property:"og:description",content:"Field service asset workspace."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Detail});
function Detail(){const {id}=Route.useParams();return <AppShell><AssetDetail id={id}/></AppShell>}
