import { createFileRoute } from "@tanstack/react-router"

import { TaniLinkDashboard } from "@/components/Tanilink/tanilink-dashboard"

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
  head: () => ({
    meta: [
      {
        title: "TaniLink",
      },
    ],
  }),
})

function Dashboard() {
  return <TaniLinkDashboard />
}
