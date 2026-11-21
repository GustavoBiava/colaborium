
import { Login } from "@/features/login/page";
import { ClientsPage } from "@/features/clients/page";
import { Rooms } from "@/features/rooms/page";
import { Contracts } from "@/features/contracts/page";

import { Layout } from "@/shared/components/layout/Layout";

// import { CardBlurBoilerplateExample } from "../../boilerplate/card-blur-boilerplate-example";
//import { FullCalendarBoilerplateExample } from "../../boilerplate/fullcalendar-boilerplate-example";

import { BrowserRouter, Route, Routes } from "react-router";
import { CalendarPage } from "@/features/calendar/page";
import { AuthProvider } from "@/features/auth/AuthContext";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute";

export const Router = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<ClientsPage />} />
              <Route path="/usuarios" element={<ClientsPage />} />
              <Route path="/salas" element={<Rooms />} />
              {/* <Route path="/exemplo-card-blur" element={<CardBlurBoilerplateExample />} /> */}
              <Route path="/clientes" element={<ClientsPage />} />
              <Route path="/agenda" element={<CalendarPage />} />
              <Route path="/contratos" element={<Contracts />} />

              {/* 
              <Route
                path="/exemplo-fullcalendar"
                element={<FullCalendarBoilerplateExample />}
              /> 
              */}
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};
