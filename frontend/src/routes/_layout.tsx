import {
  createFileRoute,
  Outlet,
  redirect,
  useRouterState,
} from "@tanstack/react-router"
import { ChevronDown } from "lucide-react"
import {
  DashboardLocationPicker,
  DashboardMonthSelect,
} from "@/components/Tanilink/dashboard-filter-controls"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useAuth, { isLoggedIn } from "@/hooks/useAuth"
import { DashboardFiltersProvider } from "@/lib/dashboard-filters"

export const Route = createFileRoute("/_layout")({
  component: Layout,
  beforeLoad: async () => {
    if (!isLoggedIn()) {
      throw redirect({ to: "/login" })
    }
  },
})

function LayoutContent() {
  const { logout, user } = useAuth()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const isOnboardingPage = pathname === "/onboarding"
  const userName = user?.full_name || user?.email || "TaniLink"
  const userRole = user?.is_superuser ? "Admin" : "Petani"

  return (
    <div className="app-shell min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(238,232,212,0.85),_transparent_32%),linear-gradient(180deg,_#fffdf7_0%,_#f9f3e8_100%)]">
      {isOnboardingPage ? null : (
        <header className="sticky top-0 z-10 flex shrink-0 items-center border-b border-[#0f261f] bg-[#163127] px-3 py-2 shadow-[0_8px_24px_rgba(22,49,39,0.18)] md:px-5">
          <div className="flex w-full items-center gap-2 sm:gap-3">
            <div className="hidden min-w-[128px] font-[Fraunces] text-2xl font-bold text-[#fffaf1] sm:block">
              TaniLink
            </div>
            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <DashboardLocationPicker />
              <DashboardMonthSelect />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-11 w-11 gap-2 rounded-[24px] border-[#426a5b] bg-[#24473b] px-0! text-left text-[#fffaf1] shadow-[0_1px_2px_rgba(15,38,31,0.24)] hover:bg-[#2e594a] sm:w-auto sm:gap-3 sm:pl-5! sm:pr-4!"
                  >
                    <div className="hidden min-w-0 flex-1 text-left sm:block">
                      <div className="max-w-[180px] truncate text-[0.95rem] font-semibold leading-tight text-[#fffaf1]">
                        {userName}
                      </div>
                      <div className="truncate pt-0.5 text-[0.78rem] leading-tight text-[#dce8df]">
                        {userRole}
                      </div>
                    </div>
                    <ChevronDown className="size-4 text-[#fffaf1]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 rounded-2xl border-[#d8ccb7] bg-[#fffaf2] p-2 text-[#24473b] shadow-[0_16px_40px_rgba(74,98,79,0.18)]"
                >
                  <DropdownMenuItem
                    className="cursor-pointer rounded-xl px-3 py-2 text-sm text-[#24473b] focus:bg-[#e7efe7] focus:text-[#17352b]"
                    onClick={logout}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
      )}
      <main className={isOnboardingPage ? "min-h-screen p-5" : "p-3 md:p-4"}>
        <div
          className={
            isOnboardingPage
              ? "mx-auto max-w-[1520px]"
              : "mx-auto max-w-[1520px]"
          }
        >
          <Outlet />
        </div>
      </main>
    </div>
  )
}

function Layout() {
  return (
    <DashboardFiltersProvider>
      <LayoutContent />
    </DashboardFiltersProvider>
  )
}

export default Layout
