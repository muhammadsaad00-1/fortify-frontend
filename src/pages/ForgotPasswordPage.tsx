import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Fortify Fitness"
              className="h-8 w-8 rounded-sm object-contain"
            />
            <span className="font-heading text-xl font-bold text-foreground">Fortify Fitness</span>
          </Link>
          <h1 className="mt-8 font-heading text-3xl font-bold text-foreground">Reset password</h1>
          <p className="mt-2 text-muted-foreground">Enter your email to receive a reset link</p>
        </div>

        {sent ? (
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <Mail className="mx-auto h-12 w-12 text-primary" />
            <h3 className="mt-4 font-heading text-lg font-semibold text-card-foreground">Check your email</h3>
            <p className="mt-2 text-sm text-muted-foreground">We've sent a password reset link to {email}</p>
            <Link to="/login">
              <Button variant="outline" className="mt-6"><ArrowLeft className="mr-2 h-4 w-4" /> Back to login</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg">Send Reset Link</Button>
            <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
