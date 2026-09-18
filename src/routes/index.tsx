import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/keystone/public-pages";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KEYSTONE | Field Operations, Engineered for Clarity" },
      { name: "description", content: "Coordinate service requests, dispatch technicians, monitor SLAs, and manage every field operation from one intelligent command center." },
      { property: "og:title", content: "KEYSTONE | Field Operations, Engineered for Clarity" },
      { property: "og:description", content: "One intelligent command center for every field operation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});