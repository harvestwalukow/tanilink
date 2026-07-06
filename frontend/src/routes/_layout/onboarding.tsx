import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { Loader2, Sprout } from "lucide-react"
import { useState } from "react"
import {
  DashboardLocationPicker,
  DashboardMonthSelect,
} from "@/components/Tanilink/dashboard-filter-controls"
import { Button } from "@/components/ui/button"
import { APP_HOME_PATH } from "@/hooks/useAuth"
import {
  markOnboardingComplete,
  useDashboardFilters,
} from "@/lib/dashboard-filters"

export const Route = createFileRoute("/_layout/onboarding")({
  component: OnboardingPage,
  head: () => ({
    meta: [
      {
        title: "TaniLink | Atur Preferensi",
      },
    ],
  }),
})

function OnboardingPage() {
  const navigate = useNavigate()
  const { hasPickedLocation } = useDashboardFilters()
  const [isLoading, setIsLoading] = useState(false)
  const [isFading, setIsFading] = useState(false)

  const handleContinue = () => {
    if (isLoading) return
    setIsLoading(true)
    markOnboardingComplete()

    // Show spinner for 2 seconds, then fade out and navigate
    setTimeout(() => {
      setIsFading(true)
      setTimeout(() => {
        navigate({ to: APP_HOME_PATH })
      }, 450)
    }, 2000)
  }

  return (
    <div
      className="flex min-h-[calc(100vh-2.5rem)] items-center justify-center"
      style={{
        opacity: isFading ? 0 : 1,
        transition: "opacity 450ms ease-in-out",
      }}
    >
      <div className="mx-auto flex w-full max-w-[360px] flex-col gap-7">
        <div className="text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[#e8f0e8] text-[#24473b]">
            <Sprout className="size-7" />
          </div>
          <h1 className="font-[Fraunces] text-4xl text-[#163127]">
            Atur Lokasi & Waktu Tanam
          </h1>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium text-[#3d433c]">
            Pilih lokasi
          </div>
          <DashboardLocationPicker
            variant="neutral"
            inline
          />
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium text-[#3d433c]">
            Rencana bulan tanam
          </div>
          <DashboardMonthSelect
            triggerClassName="h-11 w-full sm:w-full"
            variant="neutral"
          />
        </div>

        <Button
          type="button"
          className="h-12 rounded-2xl bg-[#24473b] text-base text-[#fffaf1] hover:bg-[#17352b]"
          onClick={handleContinue}
          disabled={!hasPickedLocation || isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Memuat dashboard...
            </span>
          ) : (
            "Lihat rekomendasi"
          )}
        </Button>
      </div>
    </div>
  )
}
