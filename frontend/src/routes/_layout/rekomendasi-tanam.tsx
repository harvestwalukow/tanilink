import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/rekomendasi-tanam")({
  beforeLoad: () => {
    throw redirect({ to: "/app" })
  },
})
