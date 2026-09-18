import { createFileRoute } from "@tanstack/react-router";
import { TechnicianPortal } from "@/components/keystone/portals";
export const Route=createFileRoute("/technician/jobs")({head:()=>({meta:[{title:"My Jobs | KEYSTONE"},{name:"description",content:"Technician job queue and daily field schedule."},{property:"og:title",content:"My Jobs | KEYSTONE"},{property:"og:description",content:"Technician job queue and daily field schedule."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:()=><TechnicianPortal/>});
