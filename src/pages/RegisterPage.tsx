import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Mail, Lock, User, ArrowRight, Check, 
  AlertCircle, Loader2, Eye, EyeOff 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-fitness.jpg";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const passwordValidation = {
    minLength: formData.password.length >= 8,
    hasUpperCase: /[A-Z]/.test(formData.password),
    hasLowerCase: /[a-z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
    hasSpecial: /[!@#$%^&*]/.test(formData.password),
    matches: formData.password === formData.confirmPassword && formData.password.length > 0,
  };

  const strengthCount = Object.values(passwordValidation).filter(Boolean).length;
  const isPasswordValid = Object.values(passwordValidation).every((val) => val);
  const canSubmit = formData.firstName && formData.lastName && formData.email && isPasswordValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsLoading(true);
    try {
      await register({
        email: formData.email,
        password: formData.password,
        password2: formData.confirmPassword,
        first_name: formData.firstName,
        last_name: formData.lastName,
      });
      toast({ title: "Account Ready!", description: "Start your assessment now." });
      navigate("/assessment");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create account.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-zinc-950">
      <main className="flex flex-1 flex-col justify-center px-8 py-12 lg:px-24">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <img
                src="/logo.png"
                alt="Fortify Fitness"
                className="h-10 w-10 rounded-md object-contain"
              />
              <span className="font-heading text-2xl font-bold tracking-tight">Fortify Fitness</span>
            </Link>
            <h1 className="mt-8 text-3xl font-bold tracking-tight">Create Account</h1>
            <p className="mt-2 text-zinc-500">Join the community of performance-driven athletes.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-xs font-bold uppercase tracking-widest text-zinc-500">First Name</Label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                  <Input id="firstName" placeholder="John" value={formData.firstName} onChange={handleChange} disabled={isLoading} className="h-11 pl-10 bg-zinc-50/50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-xs font-bold uppercase tracking-widest text-zinc-500">Last Name</Label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                  <Input id="lastName" placeholder="Doe" value={formData.lastName} onChange={handleChange} disabled={isLoading} className="h-11 pl-10 bg-zinc-50/50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-zinc-500">Email</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                <Input id="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} disabled={isLoading} className="h-11 pl-10 bg-zinc-50/50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-zinc-500">Password</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={formData.password} 
                  onChange={handleChange} 
                  disabled={isLoading} 
                  className="h-11 pl-10 pr-10 bg-zinc-50/50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              {formData.password && (
                <div className="pt-2 animate-in fade-in duration-300">
                  <div className="flex gap-1.5 h-1">
                    {[1, 2, 3, 4, 5].map((step) => (
                      <div key={step} className={`h-full flex-1 rounded-full transition-all duration-500 ${strengthCount >= step ? 'bg-primary' : 'bg-zinc-100 dark:bg-zinc-800'}`} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2 pb-4">
              <Label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-widest text-zinc-500">Confirm</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                <Input id="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} disabled={isLoading} className="h-11 pl-10 bg-zinc-50/50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" />
                {formData.confirmPassword && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {passwordValidation.matches ? <Check className="h-4 w-4 text-emerald-500" /> : <AlertCircle className="h-4 w-4 text-rose-500" />}
                  </div>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full h-12 font-bold shadow-xl shadow-primary/20" disabled={isLoading || !canSubmit}>
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create Account"}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-500">
            Already registered?{" "}
            <Link to="/login" className="font-bold text-primary hover:underline underline-offset-4">Sign in</Link>
          </p>
        </div>
      </main>

      <aside className="hidden lg:relative lg:block lg:flex-1 bg-zinc-950">
        <img src={heroImage} alt="Fitness" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center p-12 text-center">
          <div className="max-w-md">
            <h2 className="text-3xl font-extrabold text-white">Join the Elite.</h2>
            <p className="mt-4 text-zinc-400">Unlock advanced scoring systems used by professional coaches to track progress and prevent injury.</p>
          </div>
        </div>
      </aside>
    </div>
  );
}