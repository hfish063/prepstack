"use client";

import { Layers, LayoutDashboard, MessageSquare } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "../ui/separator";

const SIDEBAR_LINKS = [
  { icon: LayoutDashboard, link: "/dashboard", label: "Dashboard" },
  { icon: MessageSquare, link: "/interviews", label: "Interviews" },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link href={"/"} className="flex items-center gap-2">
          <div
            className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-primary 
  text-primary-foreground"
          >
            <Layers className="size-4" />
          </div>
          <span className="truncate font-semibold group-data-[collapsible=icon]:hidden">
            PrepStack
          </span>
        </Link>
      </SidebarHeader>
      <Separator />
      <SidebarContent className="p-2">
        <SidebarMenu>
          {SIDEBAR_LINKS.map((item, index) => {
            const isActive = pathname.startsWith(item.link);

            return (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip={item.label}
                  render={
                    <Link href={item.link}>
                      <item.icon />
                      <span className="font-semibold group-data-[collapsible=icon]:hidden">
                        {item.label}
                      </span>
                    </Link>
                  }
                />
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
