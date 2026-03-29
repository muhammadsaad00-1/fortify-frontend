import { motion } from "framer-motion";
import { 
  ArrowRight, Activity, Target, Dumbbell, ChevronRight, 
  Shield, Zap, BarChart3, Smartphone, Users, Flame, 
  CheckCircle2, PlayCircle, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";

const steps = [
  { icon: Activity, title: "Take Assessment", description: "Complete a comprehensive evaluation covering safety, history, and movement in 10 minutes." },
  { icon: Target, title: "Get Fitness Level", description: "Our engine analyzes 4 key domains to determine your readiness level (1–4) with precision." },
  { icon: Dumbbell, title: "Receive Program", description: "Get a personalized workout plan filtered by your goals, equipment, and current ability." },
];

const features = [
  { icon: Shield, title: "Safety First", desc: "Automated contraindication screening ensures every movement is safe for your body.", size: "lg" },
  { icon: Zap, title: "Instant Programs", desc: "AI-driven engine generates your program in seconds.", size: "sm" },
  { icon: BarChart3, title: "Track Progress", desc: "Monitor improvements and unlock advanced programming.", size: "sm" },
  { icon: Users, title: "Expert Designed", desc: "Built by movement specialists for maximum effectiveness.", size: "sm" },
  { icon: Flame, title: "Science Backed", desc: "Based on proven assessment methodologies and research.", size: "sm" },
  { icon: Smartphone, title: "Digital First", desc: "Access your dashboard anywhere with our mobile-optimized platform.", size: "lg" },
];

export default function LandingPage() {
  const navigate = useNavigate();

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 selection:bg-primary/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl">
        <div className="container mx-auto flex h-20 items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5 transition-transform hover:scale-[1.02]">
            <img
              src="/logo.png"
              alt="Fortify Fitness"
              className="h-10 w-10 rounded-md object-contain"
            />
            <span className="font-heading text-2xl font-bold tracking-tight text-foreground">Fortify Fitness</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground mr-8">
            <button className="hover:text-primary transition-colors">Features</button>
            <button className="hover:text-primary transition-colors">Methodology</button>
            <button className="hover:text-primary transition-colors">Pricing</button>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="font-semibold" onClick={() => navigate("/login")}>Login</Button>
            <Button className="font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105" onClick={() => navigate("/register")}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        {/* Animated Mesh Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] -z-10 opacity-30 dark:opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/40 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-blue-400/30 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary mb-8"
          >
            <Star className="h-3.5 w-3.5 fill-primary" /> Trusted by 5,000+ Athletes
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-foreground leading-[0.95] mb-8"
          >
            Elite Performance <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-blue-600">Built on Science</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground font-light leading-relaxed mb-12"
          >
            Stop guessing your fitness level. Get a professional 4-domain assessment and a custom-engineered workout program in under 15 minutes.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button size="xl" className="h-14 px-8 text-lg font-bold shadow-2xl shadow-primary/30 gap-2" onClick={() => navigate("/register")}>
              Start Free Assessment <ArrowRight className="h-5 w-5" />
            </Button>
            <Button size="xl" variant="outline" className="h-14 px-8 text-lg font-bold border-zinc-200 dark:border-zinc-800 gap-2">
              <PlayCircle className="h-5 w-5" /> Watch Demo
            </Button>
          </motion.div>

          {/* Social Proof Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-zinc-200/50 dark:border-zinc-800/50"
          >
            {[
              { label: "Active Users", val: "12k+" },
              { label: "Programs Generated", val: "450k" },
              { label: "Expert Coaches", val: "85+" },
              { label: "Safety Rating", val: "100%" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-bold text-foreground">{s.val}</div>
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works - The Process */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">The Methodology</h2>
              <h3 className="text-4xl md:text-5xl font-bold tracking-tight">Your roadmap to peak performance.</h3>
            </div>
            <p className="max-w-sm text-muted-foreground text-lg">We've simplified the complex world of sports science into three actionable steps.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="group relative p-10 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:-translate-y-2 hover:shadow-2xl">
                <div className="text-6xl font-black text-zinc-100 dark:text-zinc-900 absolute top-6 right-8 leading-none transition-colors group-hover:text-primary/10">
                  0{i + 1}
                </div>
                <div className="bg-primary/10 p-4 rounded-2xl w-fit mb-8 group-hover:bg-primary transition-colors">
                  <step.icon className="h-8 w-8 text-primary group-hover:text-primary-foreground" />
                </div>
                <h4 className="text-2xl font-bold mb-4 tracking-tight">{step.title}</h4>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">Engineered for Results</h2>
            <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">Every tool you need to eliminate guesswork and train with surgical precision.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[240px]">
            {features.map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className={`group relative overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 flex flex-col justify-end transition-all ${
                  f.size === 'lg' ? 'md:col-span-2' : 'col-span-1'
                }`}
              >
                <div className="absolute top-8 left-8 p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h5 className="text-xl font-bold mb-2 tracking-tight">{f.title}</h5>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="container mx-auto rounded-[3rem] bg-zinc-950 dark:bg-primary p-12 md:p-24 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-8 leading-[0.95]">
              Stop training blind. <br /> Start training smart.
            </h2>
            <p className="text-zinc-400 dark:text-primary-foreground/80 text-lg mb-12 max-w-lg">
              Unlock your full physical potential with the platform trusted by athletes and professionals worldwide.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="xl" className="bg-white text-black hover:bg-zinc-100 h-14 px-8 font-bold text-lg rounded-2xl shadow-2xl">
                Get Started Free
              </Button>
              <div className="flex items-center gap-2 text-white/60 font-medium px-4">
                <CheckCircle2 className="h-5 w-5 text-primary dark:text-white" /> No credit card required
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-20 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2.5 mb-6">
                <img
                  src="/logo.png"
                  alt="Fortify Fitness"
                  className="h-8 w-8 rounded-md object-contain"
                />
                <span className="text-xl font-bold tracking-tight">Fortify Fitness</span>
              </div>
              <p className="text-muted-foreground max-w-xs leading-relaxed">
                Empowering individuals through science-backed fitness assessments and intelligent programming.
              </p>
            </div>
            <div>
              <h6 className="font-bold uppercase tracking-widest text-[10px] text-zinc-400 mb-6">Platform</h6>
              <ul className="space-y-4 text-sm font-medium text-muted-foreground">
                <li className="hover:text-primary cursor-pointer transition">Assessment</li>
                <li className="hover:text-primary cursor-pointer transition">Custom Programs</li>
                <li className="hover:text-primary cursor-pointer transition">Integrations</li>
              </ul>
            </div>
            <div>
              <h6 className="font-bold uppercase tracking-widest text-[10px] text-zinc-400 mb-6">Company</h6>
              <ul className="space-y-4 text-sm font-medium text-muted-foreground">
                <li className="hover:text-primary cursor-pointer transition">About Us</li>
                <li className="hover:text-primary cursor-pointer transition">Privacy Policy</li>
                <li className="hover:text-primary cursor-pointer transition">Terms</li>
              </ul>
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-widest text-zinc-400">
            <div>© 2026 Fortify Fitness Performance Labs</div>
            <div className="flex gap-8">
              <span className="hover:text-primary transition cursor-pointer">Twitter</span>
              <span className="hover:text-primary transition cursor-pointer">Instagram</span>
              <span className="hover:text-primary transition cursor-pointer">LinkedIn</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}