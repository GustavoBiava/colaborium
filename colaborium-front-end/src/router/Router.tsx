import { Login } from "@/features/login/page";
import { CustomersPage } from "@/features/customers/page";
import { Rooms } from "@/features/rooms/page";
import { Contracts } from "@/features/contracts/page";

import { Layout } from "@/shared/components/layout/Layout";
import { AuthProvider } from "@/features/auth/AuthContext";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import { BrowserRouter, Route, Routes } from "react-router";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute";
import { CalendarPage } from "@/features/appointments/page";

export const Router = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/usuarios" element={<CustomersPage />} />
                <Route path="/salas" element={<Rooms />} />
                <Route path="/clientes" element={<CustomersPage />} />
                <Route path="/contratos" element={<Contracts />} />
                <Route path="/*" element={<CalendarPage />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};
