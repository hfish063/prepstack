import { Layers, LayoutDashboard, MessageSquare } from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import Link from "next/link";

const SIDEBAR_LINKS = [
  { icon: LayoutDashboard, link: "/dashboard", label: "Dashboard" },
  { icon: MessageSquare, link: "/interviews", label: "Interviews" },
];

export default function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Layers />
              <span className="font-bold text-lg">PrepStack</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarMenu className="p-2">
        {SIDEBAR_LINKS.map((item, index) => (
          <SidebarMenuItem key={index}>
            <Link href={item.link}>
              <SidebarMenuButton>
                <item.icon />
                <span className="font-semibold">{item.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </Sidebar>
  );
}
