import * as React from "react";
import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // This is sample data.
  const data = {
    navMain: [
      {
        title: "Getting Started",
        url: "#",
        items: [
          {
            title: "Dashboard",
            url: "/",
            isActive: props.active === "Dashboard" && true,
          },
          {
            title: "All Users",
            url: "/users",
            isActive: props.active === "Users" && true,
          },
          {
            title: "Avatars",
            url: "/avatars",
            isActive: props.active === "Avatars" && true,
          },
        ],
      },
    ],
  };
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenuButton size="lg" asChild>
          <a href="#">
            <div className="flex aspect-video size-8 p-1 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
              <img src="./logo/White-Logo-Face.png" alt="" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">VerseSage</span>
              <span className="truncate text-xs">
                A Better Way of Communication
              </span>
            </div>
          </a>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                     
                      <Link to={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
