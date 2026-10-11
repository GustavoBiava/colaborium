import { Outlet } from "react-router";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { SidebarLayout } from "./SidebarLayout";

/**
 * Layout
 *
 * `SidebarInset`:  from waht I undertand this is the component that is going to manage the space between my sidebar and the rest of my pages, they are like sisters, when sidebar opens, sidebar insets adjusts it self.
 *
 * `Outlet`: its like a children execpt that it is a placeholder for the content of the page, so when I go to /usuarios, the content of the page will be rendered here.
 */

export function Layout() {
  return (
    <SidebarProvider>
      <SidebarLayout />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
