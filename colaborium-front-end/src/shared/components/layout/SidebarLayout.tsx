import { cn } from "cn";
import { Link } from "react-router";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "@/features/auth/AuthContext";
import { Calendar, Home, Users, DoorClosed, FileText } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "../ui/sidebar";

const mainItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Clientes", url: "/usuarios", icon: Users },
  { title: "Salas", url: "/salas", icon: DoorClosed },
  { title: "Clientes", url: "/clientes", icon: Users },
  { title: "Agenda", url: "/agenda", icon: Calendar },
  { title: "Contratos", url: "/contratos", icon: FileText },
];

export function SidebarLayout() {
  const { open } = useSidebar();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <Sidebar collapsible="icon" className="text-neutral-400 border-neutral-900">
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
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-neutral-900">
        {user && (
          <>
            <span className="truncate text-sm font-medium text-neutral-200">
              {user.nome}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              title="Sair da conta"
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-neutral-400 transition hover:bg-neutral-800 hover:text-white cursor-pointer"
            >
              <LogOut size={16} />
              {open && <span>Sair da conta atual</span>}
            </button>
          </>
        )}
        <span className="px-2 text-xs text-muted-foreground">v1.0.0</span>
      </SidebarFooter>
    </Sidebar>
  );
}
