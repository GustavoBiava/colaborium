import { Login } from "@/features/login/page";
import { CustomersPage } from "@/features/customers/page";
import { Rooms } from "@/features/rooms/page";

import { Layout } from "@/shared/components/layout/Layout";

import { BrowserRouter, Route, Routes } from "react-router";
import { CalendarPage } from "@/features/appointments/page";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

export const Router = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/usuarios" element={<CustomersPage />} />
            <Route path="/salas" element={<Rooms />} />
            <Route path="/clientes" element={<CustomersPage />} />
            <Route path="/*" element={<CalendarPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};
