"use client"

import { ChevronRight } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar"

export function NavProjects({ projects }) {
  const { isMobile } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Get Involved</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => {
          const isActive = currentPath === item.url

          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                data-active={isActive}
                className="flex items-center w-full transition-colors"
              >
                <NavLink
                  to={item.url}
                  className={({ isActive }) =>
                    `flex items-center w-full ${
                      isActive ? "text-primary font-medium" : "text-muted-foreground"
                    }`
                  }
                >
                  <item.icon className="mr-2" />
                  <span>{item.name}</span>
                  <ChevronRight
                    className={`ml-auto transition-transform duration-200 ${
                      isActive ? "rotate-90 text-primary" : ""
                    }`}
                  />
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
