import { createFileRoute, Outlet } from "@tanstack/react-router"
import { Bell, ChevronDown, CircleHelp, Search } from "lucide-react"

import { Footer } from "@/components/Common/Footer"
import AppSidebar from "@/components/Sidebar/AppSidebar"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export const Route = createFileRoute("/_layout")({
  component: Layout,
})

function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[radial-gradient(circle_at_top_left,_rgba(238,232,212,0.85),_transparent_32%),linear-gradient(180deg,_#fffdf7_0%,_#f9f3e8_100%)]">
        <header className="sticky top-0 z-10 flex shrink-0 items-center border-b border-[#d7ccb9]/70 bg-[#fffaf1]/90 px-3 py-2 backdrop-blur-sm md:px-4">
          <div className="flex w-full items-center gap-3">
            <SidebarTrigger className="-ml-1 rounded-full border border-[#e4d8c5] bg-white text-[#6c655a] hover:bg-[#efe3cd] hover:text-[#163127]" />
            <div className="relative hidden max-w-[420px] flex-1 md:block">
              <Search className="text-muted-foreground absolute top-1/2 left-4 size-4 -translate-y-1/2" />
              <Input
                value="Cari komoditas, lokasi, atau data..."
                readOnly
                className="h-9 rounded-2xl border-[#e3d7c6] bg-white pl-11 text-sm text-[#6c655a] shadow-none"
              />
            </div>
            <Select defaultValue="jombang">
              <SelectTrigger className="h-9 min-w-[180px] rounded-2xl border-[#e3d7c6] bg-white shadow-none">
                <SelectValue placeholder="Pilih wilayah" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="jombang">
                    Jawa Timur · Kab. Jombang
                  </SelectItem>
                  <SelectItem value="madiun">
                    Jawa Timur · Kab. Madiun
                  </SelectItem>
                  <SelectItem value="ngawi">Jawa Timur · Kab. Ngawi</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="ml-auto flex items-center gap-2.5">
              <Button
                variant="outline"
                size="icon"
                className="size-10 rounded-full border-[#e3d7c6] bg-white shadow-[0_1px_2px_rgba(117,92,48,0.05)]"
              >
                <CircleHelp />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-10 rounded-full border-[#e3d7c6] bg-white shadow-[0_1px_2px_rgba(117,92,48,0.05)]"
              >
                <Bell />
              </Button>
              <Button
                variant="outline"
                className="h-11 gap-3 rounded-[24px] border-[#e3d7c6] bg-white pl-5! pr-4! text-left shadow-[0_1px_2px_rgba(117,92,48,0.05)] hover:bg-[#fffdf8]"
              >
                <div className="min-w-0 flex-1 text-left">
                  <div className="truncate text-[0.95rem] font-semibold leading-tight text-[#2c3c2d]">
                    Andi Setiawan
                  </div>
                  <div className="truncate pt-0.5 text-[0.78rem] leading-tight text-[#7b7468]">
                    Petani
                  </div>
                </div>
                <ChevronDown className="size-4 text-[#8a806f]" />
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-1 p-2.5 md:p-3">
          <div className="mx-auto max-w-[1520px]">
            <Outlet />
          </div>
        </main>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Layout
