import { Users } from "@/features/users/page";
import { Layout } from "@/shared/components/layout/Layout";

import { BrowserRouter, Route, Routes } from "react-router";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Users />} />
          <Route path="/usuarios" element={<Users />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
