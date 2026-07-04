import {
  BarChart3,
  Landmark,
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
  { icon: Landmark, title: "Rekomendasi Tanam", path: "/rekomendasi-tanam" },
  { icon: Sprout, title: "Kecocokan Lahan", path: "/kesesuaian-lahan" },
  { icon: BarChart3, title: "Prediksi Harga", path: "/prediksi-harga" },
]

export function AppSidebar() {
  const items = baseItems

  return (
    <Sidebar
      collapsible="icon"
      className="border-r-0 shadow-[inset_-1px_0_0_rgba(255,255,255,0.04)]"
    >
      <SidebarHeader className="px-4 py-6 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:items-center">
        <Logo variant="responsive" to="/app" />
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
