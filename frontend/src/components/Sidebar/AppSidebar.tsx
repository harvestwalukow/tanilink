import {
  BarChart3,
  Database,
  FileText,
  Home,
  Landmark,
  Map as MapIcon,
  Settings,
  Sprout,
} from "lucide-react"

import { Logo } from "@/components/Common/Logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { type Item, Main } from "./Main"

const baseItems: Item[] = [
  { icon: Home, title: "Beranda", path: "/" },
  { icon: Sprout, title: "Kesesuaian Lahan", path: "/" },
  { icon: BarChart3, title: "Prediksi Harga", path: "/" },
  { icon: Landmark, title: "Rekomendasi Tanam", path: "/" },
  { icon: MapIcon, title: "Peta & Wilayah", path: "/" },
  { icon: Database, title: "Data & Sumber", path: "/" },
  { icon: FileText, title: "Laporan", path: "/" },
  { icon: Settings, title: "Pengaturan", path: "/" },
]

export function AppSidebar() {
  const items = baseItems

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="px-4 py-6 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:items-center">
        <Logo variant="responsive" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-3 group-data-[collapsible=icon]:px-1.5">
          <SidebarGroupContent>
            <Main items={items} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-4 pb-5 pt-2 group-data-[collapsible=icon]:hidden">
        <SidebarSeparator className="mx-0 bg-white/10" />
        <Card className="rounded-[20px] border-[#7d967f]/45 bg-[linear-gradient(180deg,rgba(251,247,237,0.96)_0%,rgba(244,239,229,0.92)_100%)] shadow-none">
          <CardContent className="space-y-4 p-4">
            <div className="space-y-1">
              <p className="text-[12px] text-[#556352]">Paket Anda</p>
              <p className="text-lg font-semibold text-[#1f352b]">
                Professional
              </p>
              <p className="text-[12px] text-[#7b7468]">Berakhir 28 Jul 2025</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[12px] text-[#5a5a52]">
                <span>Kredit API</span>
                <span>72.540 / 100.000</span>
              </div>
              <div className="h-2 rounded-full bg-[#d8d3c5]">
                <div className="h-2 w-[72%] rounded-full bg-[#1f5d3c]" />
              </div>
            </div>
            <Button
              variant="outline"
              className="h-9 rounded-xl border-[#d4c8b5] bg-white text-[#23402e] hover:bg-[#f6f2ea]"
            >
              Kelola Paket
            </Button>
          </CardContent>
        </Card>
        <div className="space-y-0.5 px-1 text-[11px] text-[#b9c8b8]">
          <p>© 2025 TaniLink</p>
          <p>V1.2.0</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
