import { createFileRoute, redirect } from "@tanstack/react-router"

import { TaniLinkDashboard } from "@/components/Tanilink/tanilink-dashboard"
import { isOnboardingComplete } from "@/lib/dashboard-filters"

export const Route = createFileRoute("/_layout/app")({
  component: Dashboard,
  beforeLoad: async () => {
    if (!isOnboardingComplete()) {
      throw redirect({ to: "/onboarding" })
    }
  },
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
