import { ChevronRight } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import {
  Collapsible,
  CollapsibleContent,
} from "../ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../ui/sidebar"
import { useState } from "react"

export function NavMain({ items }) {
  const location = useLocation()
  const currentPath = location.pathname

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const hasSubItems = item.items && item.items.length > 0
          const isTopLevelActive =
            currentPath === item.url ||
            (hasSubItems && item.items.some(sub => sub.url === currentPath))

          const [open, setOpen] = useState(isTopLevelActive)

          return (
            <SidebarMenuItem key={item.title}>
              <Collapsible
                open={open}
                onOpenChange={setOpen}
                className="group/collapsible"
              >
                {/* Top-level button */}
                <NavLink to={item.url} className="flex items-center w-full">
                  <SidebarMenuButton
                    tooltip={item.title}
                    className="flex items-center w-full"
                    data-active={isTopLevelActive}
                  >
                    {item.icon && <item.icon />}
                    <span className="ml-2">{item.title}</span>
                    <ChevronRight
                      className={`ml-auto transition-transform duration-200 ${
                        hasSubItems && open ? "rotate-90" : ""
                      }`}
                    />
                  </SidebarMenuButton>
                </NavLink>

                {/* Subitems */}
                {hasSubItems && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => {
                        const isSubActive = currentPath === subItem.url
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              data-active={isSubActive}
                            >
                              <NavLink
                                to={subItem.url}
                                className={`flex items-center w-full ml-3 transition-colors ${
                                  isSubActive
                                    ? "font-semibold text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                              >
                                <span>{subItem.title}</span>
                                <ChevronRight className="ml-auto" />
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </Collapsible>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
