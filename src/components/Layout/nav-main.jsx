import { ChevronRight } from "lucide-react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { useState } from "react"
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

  // Track which items are open using their titles as keys
  const [openItems, setOpenItems] = useState(() => {
    // Initialize with items that have active subitems
    const initialOpen = {}
    items.forEach((item) => {
      const hasSubItems = item.items && item.items.length > 0
      const hasActiveSubItem = hasSubItems && item.items.some(sub => sub.url === currentPath)
      if (currentPath === item.url || hasActiveSubItem) {
        initialOpen[item.title] = true
      }
    })
    return initialOpen
  })

  const toggleItem = (title, url, hasSubItems) => {
    const wasOpen = openItems[title]
    
    // If clicking on an already open item with subitems, navigate to its URL
    if (wasOpen && hasSubItems && url) {
      navigate(url)
    } else {
      // Toggle the item
      setOpenItems(prev => ({
        ...prev,
        [title]: !prev[title]
      }))
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
          const isOpen = openItems[item.title] || false

          return (
            <SidebarMenuItem key={item.title}>
              <Collapsible
                open={isOpen}
                onOpenChange={() => toggleItem(item.title, item.url, hasSubItems)}
                className="group/collapsible"
              >
                {/* Top-level button */}
                <div className="flex items-center w-full">
                  {hasSubItems ? (
                    // If has subitems, make it a collapsible trigger
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className="flex items-center w-full"
                     data-active={isTopLevelActive && isCollapsed}
                      >
                        {item.icon && <item.icon />}
                        <span className="ml-2">{item.title}</span>
                        <ChevronRight
                          className={`ml-auto transition-transform duration-200 ${
                            isOpen ? "rotate-90" : ""
                          }`}
                        />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
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
                        <ChevronRight className="ml-auto" />
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