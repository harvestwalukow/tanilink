import { createFileRoute } from "@tanstack/react-router"

import { TaniLinkDashboard } from "@/components/Tanilink/tanilink-dashboard"

export const Route = createFileRoute("/_layout/app")({
  component: Dashboard,
  head: () => ({
    meta: [
      {
        title: "Dashboard - TaniLink",
      },
    ],
  }),
})

function Dashboard() {
  return <TaniLinkDashboard />
}
