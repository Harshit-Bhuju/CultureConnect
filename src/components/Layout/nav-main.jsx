import { ChevronRight } from "lucide-react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
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
  useSidebar,
} from "../ui/sidebar"

export function NavMain({ items }) {
  const location = useLocation()
  const navigate = useNavigate()
  const currentPath = location.pathname
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const handleTopLevelClick = (url, hasSubItems) => {
    // If clicking on an item with subitems, navigate to its URL
    if (hasSubItems && url) {
      navigate(url)
    }
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const hasSubItems = item.items && item.items.length > 0
          const isTopLevelActive =
            currentPath === item.url ||
            (hasSubItems && item.items.some(sub => sub.url === currentPath))

          return (
            <SidebarMenuItem key={item.title}>
              <Collapsible
                open={true}
                className="group/collapsible"
              >
                {/* Top-level button */}
                <div className="flex items-center w-full">
                  {hasSubItems ? (
                    // If has subitems, make it clickable but not a collapsible trigger
                    <SidebarMenuButton
                      tooltip={item.title}
                      className="flex items-center w-full"
                      data-active={isTopLevelActive && isCollapsed}
                      onClick={() => handleTopLevelClick(item.url, hasSubItems)}
                    >
                      {item.icon && <item.icon />}
                      <span className="ml-2">{item.title}</span>
                    </SidebarMenuButton>
                  ) : (
                    // If no subitems, make it a regular link
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className="flex items-center w-full"
                      data-active={isTopLevelActive}
                    >
                      <NavLink to={item.url} className="flex items-center w-full">
                        {item.icon && <item.icon />}
                        <span className="ml-2">{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  )}
                </div>

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