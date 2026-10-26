import Logo from "@/assets/logo-placeholder.png";
import PlaceholderOffice from "@/assets/placeholder-office.jpg";
import LoginForm from "./components/LoginForm";

export function Login() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-[#191919] p-2">
      <div className="h-full w-full rounded-md bg-[#1B1B1B] grid grid-cols-1 overflow-hidden md:grid-cols-[65%_35%]">

        <section className="relative hidden h-full overflow-hidden md:block">
          <img src={PlaceholderOffice} className="w-full h-full" />
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
