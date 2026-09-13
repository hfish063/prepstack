import { LayoutDashboard, MessageSquare } from "lucide-react";
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
    <Sidebar>
      <SidebarHeader>
        <span className="font-semibold">PrepStack</span>
      </SidebarHeader>
      <SidebarMenu>
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
