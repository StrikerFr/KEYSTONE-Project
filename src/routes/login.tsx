import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/components/keystone/public-pages";
export const Route=createFileRoute("/login")({head:()=>({meta:[{title:"Sign In | KEYSTONE"},{name:"description",content:"Secure enterprise access to KEYSTONE field operations."},{property:"og:title",content:"Sign In | KEYSTONE"},{property:"og:description",content:"Secure enterprise field operations access."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:LoginPage});
