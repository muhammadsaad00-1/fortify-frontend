import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Mail, Lock, ArrowRight, Loader2, 
  Eye, EyeOff 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-fitness.jpg";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password } = formData;
    
    if (!email || !password) {
      toast({ title: "Fields required", description: "Please enter your email and password.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast({ title: "Success", description: "Welcome back to Fortify Fitness." });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-zinc-950 font-sans">
      <main className="flex flex-1 flex-col justify-center px-8 py-12 lg:px-24 xl:px-32">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-10">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <img
                src="/logo.png"
                alt="Fortify Fitness"
                className="h-10 w-10 rounded-md object-contain"
              />
              <span className="font-heading text-2xl font-bold tracking-tight">Fortify Fitness</span>
            </Link>
            <h1 className="mt-8 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Sign In
            </h1>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              Access your personalized fitness dashboard and performance metrics.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-zinc-500">Email Address</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="h-12 pl-10 border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900 focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-zinc-500">Password</Label>
                <Link to="/forgot-password" className="text-xs font-semibold text-primary hover:underline">Forgot?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="h-12 pl-10 pr-10 border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900 focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98]" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In"}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          <p className="mt-10 text-center text-sm text-zinc-500">
            Don't have an account?{" "}
            <Link to="/register" className="font-bold text-primary hover:underline underline-offset-4">Create account</Link>
          </p>
        </div>
      </main>

      <aside className="hidden lg:relative lg:block lg:flex-1 bg-zinc-900">
        <img 
          src={heroImage} 
          alt="Performance" 
          className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-luminosity" 
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-zinc-950/90" />
        <div className="absolute inset-0 flex items-center justify-center p-16">
          <div className="max-w-md text-center">
            <h2 className="text-4xl font-extrabold tracking-tight text-white">Focus on the Goal</h2>
            <p className="mt-4 text-lg text-zinc-300 font-light">Precision tracking for the modern athlete. One dashboard, infinite possibilities.</p>
          </div>
        </div>
      </aside>
    </div>
  );
}