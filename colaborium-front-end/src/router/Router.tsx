import Login from "@/features/login/page";
import { Clients } from "@/features/clients/page";

import { Layout } from "@/shared/components/layout/Layout";

import { CardBlurBoilerplateExample } from "../../boilerplate/card-blur-boilerplate-example";

import { BrowserRouter, Route, Routes } from "react-router";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Clients />} />
          <Route path="/usuarios" element={<Clients />} />
          <Route path="/exemplo-card-blur" element={<CardBlurBoilerplateExample />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
