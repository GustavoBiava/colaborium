import { Users } from "@/features/users/page";
import { User } from "lucide-react";
import { BrowserRouter, Route, Routes } from "react-router";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<User />} />
        {/*fix this to login page comentted by me Mariaaa not mf claude */}
        <Route path="/usuarios" element={<Users />} />
      </Routes>
    </BrowserRouter>
  );
};
