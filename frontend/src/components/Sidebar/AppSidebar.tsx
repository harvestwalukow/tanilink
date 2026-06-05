import {
  BarChart3,
  Home,
  Landmark,
  Map as MapIcon,
  Settings,
  Sprout,
} from "lucide-react"

import { Logo } from "@/components/Common/Logo"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { type Item, Main } from "./Main"

const baseItems: Item[] = [
  { icon: Home, title: "Beranda", path: "/" },
  { icon: Sprout, title: "Kesesuaian Lahan", path: "/" },
  { icon: BarChart3, title: "Prediksi Harga", path: "/" },
  { icon: Landmark, title: "Rekomendasi Tanam", path: "/" },
  { icon: MapIcon, title: "Peta & Wilayah", path: "/" },
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
    </Sidebar>
  )
}

export default AppSidebar
