import { Home, Inbox, Settings, Square, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "../ui/sidebar";
import { cn } from "cn";

const mainItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Users", url: "/usuarios", icon: Users },
];

const settingsItems = [{ title: "Settings", url: "/settings", icon: Settings }];

export function SidebarLayout() {
  const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon" className="text-neutral-400">
      <SidebarHeader className="bg-neutral-900 h-2/12 ">
        <div className="flex flex-row w-full justify-end">
          <SidebarTrigger />
        </div>
        <span className="text-center font-bold text-white text-4xl truncate">
          SYNC
        </span>
      </SidebarHeader>
      <SidebarContent className="bg-neutral-900 ">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="place-items-center w-full">
              {mainItems.map((item) => (
                <SidebarMenuItem
                  className={cn(
                    " py-1.5 border-b border-neutral-600 ",
                    open && " w-[80%] ",
                  )}
                  key={item.title}
                >
                  <SidebarMenuButton
                    className={cn(open && "flex flex-row justify-center")}
                    asChild
                  >
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-neutral-900">
        <span className="px-2 text-xs text-muted-foreground">v1.0.0</span>
      </SidebarFooter>
    </Sidebar>
  );
}
