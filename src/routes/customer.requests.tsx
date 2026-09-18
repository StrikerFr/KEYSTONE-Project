import { createFileRoute } from "@tanstack/react-router";
import { CustomerPortal } from "@/components/keystone/portals";
export const Route=createFileRoute("/customer/requests")({head:()=>({meta:[{title:"Customer Requests | KEYSTONE"},{name:"description",content:"Track and submit customer service requests."},{property:"og:title",content:"Customer Requests | KEYSTONE"},{property:"og:description",content:"Track and submit customer service requests."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:()=><CustomerPortal page="requests"/>});
