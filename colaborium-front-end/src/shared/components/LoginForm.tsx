import { useState } from "react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);

    function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault()

        console.log("Login form submitted");
    }

    return (
        <div className="w-full max-w-sm space-y-6 p-2 text-left">
            
            {/* Header */}
            <div className="space-y-2">
                <h2 className="text-4xl"> LOGIN </h2>
                <p className="text-gray-500"> Bem-vindo de volta. </p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-5">

                {/* E-mail */}
                <div>
                    <Label htmlFor="email" className="text-gray-200 mb-2"> Email: </Label>

                    <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="exemplo@gmail.com"
                    autoComplete="email"
                    required
                    className="border-[#383838] bg-[#222222] text-white placeholder:text-gray-500 p-1"
                    />
                </div>

                {/* Senha */}
                <div>
                    <Label htmlFor="email" className="text-gray-200 mb-2"> Senha: </Label>
                    
                    <div className="flex gap-2 relative">
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Digite sua senha"
                            autoComplete="current-password"
                            required
                            className="border-[#383838] bg-[#222222] text-white placeholder:text-gray-500 p-1"
                        />

                        {/* Esconder senha */}
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 transition hover:text-white cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                        </button>
                    </div>
                </div>

                {/* Submit */}
                <Button
                    type="submit"
                    className="group relative w-full bg-white text-black overflow-hidden hover:bg-gray-200 mt-5 cursor-pointer"
                >
                    <span
                        className="absolute inset-y-0 left-0 w-0 bg-neutral-700 transition-all duration-500 ease-out group-hover:w-full motion-reduce:transition-none"
                    />

                    <span className="relative z-10 transition-colors duration-500 group-hover:text-white">
                        ENTRAR
                    </span>
                    
                </Button>
            </form>

        </div>
    )
}