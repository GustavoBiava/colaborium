import { Login } from "@/features/login/page";
import { ClientsPage } from "@/features/clients/page";
import { Rooms } from "@/features/rooms/page";

import { Layout } from "@/shared/components/layout/Layout";

// import { CardBlurBoilerplateExample } from "../../boilerplate/card-blur-boilerplate-example";
//import { FullCalendarBoilerplateExample } from "../../boilerplate/fullcalendar-boilerplate-example";

import { BrowserRouter, Route, Routes } from "react-router";
import { CalendarPage } from "@/features/calendar/page";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

export const Router = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/" element={<ClientsPage />} />
            <Route path="/usuarios" element={<ClientsPage />} />
            <Route path="/salas" element={<Rooms />} />
            {/* <Route path="/exemplo-card-blur" element={<CardBlurBoilerplateExample />} /> */}
            <Route path="/clientes" element={<ClientsPage />} />
            <Route path="/agenda" element={<CalendarPage />} />

            {/* 
          <Route
            path="/exemplo-fullcalendar"
            element={<FullCalendarBoilerplateExample />}
          /> 
          */}
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};
