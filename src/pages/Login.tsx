import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import logoImg from '../assets/download.png';
import { SignIn } from "@clerk/react";

const Login = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="p-6 border-b flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <img src={logoImg} alt="Logo" className="h-7 w-7 object-contain" />
                    <span className="text-xl font-bold text-[#FF385C] tracking-tighter hidden sm:inline">airbnb</span>
                </Link>
                <Link to="/">
                    <Button variant="ghost" size="sm" className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to home
                    </Button>
                </Link>
            </header>

            <main className="flex-1 flex items-center justify-center p-4">
                <SignIn path="/login" routing="path" signUpUrl="/signup" />
            </main>
        </div>
    );
};

export default Login;
