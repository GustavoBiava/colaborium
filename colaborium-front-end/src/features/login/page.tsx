import Logo from "@/assets/logo-placeholder.png";
import { LoginCarousel } from "./components/LoginCarousel";
import LoginForm from "./components/LoginForm";

import Sync1 from "@/assets/sync1.jpeg";
import Sync2 from "@/assets/sync2.jpeg";
import Sync3 from "@/assets/sync3.jpeg";
import Sync4 from "@/assets/sync4.jpeg";
import Sync5 from "@/assets/sync5.jpeg";
import Sync6 from "@/assets/sync6.jpeg";
import Sync7 from "@/assets/sync7.jpeg";

const carouselImages = [Sync1, Sync2, Sync3, Sync4, Sync5, Sync6, Sync7]

export function Login() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-[#191919] p-2">
      <div className="h-full w-full rounded-md bg-[#1B1B1B] grid grid-cols-1 overflow-hidden md:grid-cols-[65%_35%]">

        <section className="relative hidden h-full overflow-hidden md:block">
          <LoginCarousel images={carouselImages} interval={15000} />
        </section>

        <section className="flex items-center p-5">
          <LoginForm />
        </section>

        <img src={Logo} className="h-12 w-12 fixed bottom-4 right-4" />
      </div>
    </main>
  );
}

export default Login;
