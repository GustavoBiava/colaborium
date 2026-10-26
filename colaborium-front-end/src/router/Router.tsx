import Login from "@/features/login/page";
import { ClientsPage } from "@/features/clients/page";

import { Layout } from "@/shared/components/layout/Layout";

import { FullCalendarBoilerplateExample } from "../../boilerplate/fullcalendar-boilerplate-example";

import { BrowserRouter, Route, Routes } from "react-router";
import { CalendarPage } from "@/features/calendar/page";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/" element={<ClientsPage />} />
          <Route path="/clientes" element={<ClientsPage />} />
          <Route path="/agenda" element={<CalendarPage />} />

          <Route
            path="/exemplo-fullcalendar"
            element={<FullCalendarBoilerplateExample />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
