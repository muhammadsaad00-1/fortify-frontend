import { motion } from "framer-motion";
import { Target, BarChart3, TrendingUp, AlertTriangle, ChevronRight, FileText, Zap, Award, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLatestAssessment } from "@/hooks/useApi";
import Navbar from "@/components/Navbar";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: assessmentData, isLoading: assessmentLoading } = useLatestAssessment();

  const assessment = assessmentData?.assessment;
  const results = assessmentData?.results;

  const isLoading = assessmentLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Use actual assessment results from backend
  const competencyLevel = results?.competency_level || 1;
  const competencyLabel = results?.competency_label || 'Rebuild';
  const compositeScore = Math.round(results?.composite_score || 0);
  const assessmentScore = results?.assessment_score || 0;
  const questionnaireScore = results?.questionnaire_score || 0;
  const recoveryScore = results?.recovery_score || 0;

  // Color based on competency level
  const levelColors = {
    1: { bg: "bg-red-100", text: "text-red-900", badge: "bg-red-600" },
    2: { bg: "bg-orange-100", text: "text-orange-900", badge: "bg-orange-600" },
    3: { bg: "bg-blue-100", text: "text-blue-900", badge: "bg-blue-600" },
    4: { bg: "bg-green-100", text: "text-green-900", badge: "bg-green-600" },
  };

  const colorConfig = levelColors[competencyLevel as 1 | 2 | 3 | 4];
  const assessmentPercent = (assessmentScore / 21) * 100;
  const questionnairePercent = (questionnaireScore / 40) * 100;
  const recoveryPercent = (recoveryScore / 12) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section with Premium Styling */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/30 via-primary/10 to-background/50 border-b border-border/50">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, hsl(var(--primary)) 0%, transparent 50%), radial-gradient(circle at 80% 80%, hsl(var(--primary)) 0%, transparent 50%)"
        }} />
        
        <div className="relative container mx-auto px-4 py-12 md:py-16">
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <p className="text-sm font-semibold text-primary flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              March 19, 2026
            </p>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tight">
              Welcome back, <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">{user?.first_name}</span>
            </h1>
            <p className="text-lg text-muted-foreground font-light">Your complete fitness performance dashboard</p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 md:py-16">

        {!assessment && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="rounded-3xl border border-warning/30 bg-gradient-to-br from-warning/10 to-warning/5 p-8 md:p-10 shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-warning/20 p-3 mt-1">
                <AlertTriangle className="h-6 w-6 text-warning" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-xl font-bold text-foreground">Get Your Personalized Assessment</h3>
                <p className="text-base text-muted-foreground mt-2 leading-relaxed">
                  Complete your fitness assessment to unlock personalized insights, custom workout programs, and detailed performance metrics tailored to your fitness level.
                </p>
                <Button 
                  onClick={() => navigate("/assessment")} 
                  size="lg"
                  className="mt-6 h-12 px-8 text-base font-bold shadow-lg shadow-primary/30 gap-2"
                >
                  Start Your Assessment <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {assessment && (
          <>
            {/* Primary Score Card - Premium Style */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.05 }}
              className="mb-8 rounded-3xl border border-border bg-gradient-to-br from-card via-card to-muted/20 p-8 md:p-10 shadow-elevated hover:shadow-2xl transition-shadow overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                {/* Left side - Main Competency */}
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.15em] text-muted-foreground mb-4">Your Current Level</p>
                  <div className="flex items-start gap-6">
                    <div>
                      <div className="font-heading text-6xl md:text-7xl font-black bg-gradient-to-br from-primary to-blue-600 bg-clip-text text-transparent leading-none">
                        {competencyLevel}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 font-medium">/ 4 Competency Levels</p>
                    </div>
                    <div className={`px-6 py-3 rounded-2xl font-bold text-white ${colorConfig.badge} shadow-lg`}>
                      {competencyLabel}
                    </div>
                  </div>
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-semibold text-card-foreground">Composite Score</span>
                      <span className="font-heading text-2xl font-bold text-primary">{compositeScore}<span className="text-sm text-muted-foreground ml-1">/ 100</span></span>
                    </div>
                    <Progress value={compositeScore} className="h-3" />
                    <p className="text-xs text-muted-foreground mt-4">
                      Weighted average across movements, training background, and recovery status.
                    </p>
                  </div>
                </div>

                {/* Right side - Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="rounded-2xl bg-white dark:bg-zinc-900 p-5 border border-zinc-200 dark:border-zinc-800 text-center"
                  >
                    <Target className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{assessmentScore}</p>
                    <p className="text-xs text-muted-foreground mt-1">Movement</p>
                    <p className="text-xs text-muted-foreground">/ 21</p>
                  </motion.div>

                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="rounded-2xl bg-white dark:bg-zinc-900 p-5 border border-zinc-200 dark:border-zinc-800 text-center"
                  >
                    <Zap className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{questionnaireScore}</p>
                    <p className="text-xs text-muted-foreground mt-1">Training</p>
                    <p className="text-xs text-muted-foreground">/ 40</p>
                  </motion.div>

                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="rounded-2xl bg-white dark:bg-zinc-900 p-5 border border-zinc-200 dark:border-zinc-800 text-center"
                  >
                    <Award className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{recoveryScore}</p>
                    <p className="text-xs text-muted-foreground mt-1">Recovery</p>
                    <p className="text-xs text-muted-foreground">/ 12</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Detailed Breakdown and Actions */}
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Assessment Breakdown - Full Width on Mobile */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.15 }}
                className="lg:col-span-2 rounded-3xl border border-border bg-card p-8 shadow-elevated hover:shadow-2xl transition-shadow"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-foreground">Assessment Breakdown</h3>
                    <p className="text-sm text-muted-foreground mt-1">Detailed view of your three assessment domains</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-primary opacity-20" />
                </div>

                <div className="space-y-6">
                  {[
                    { 
                      label: "Movement Assessment", 
                      val: assessmentScore, 
                      max: 21, 
                      percent: assessmentPercent,
                      description: "Physical movement capability and exercise performance" 
                    },
                    { 
                      label: "Training Background", 
                      val: questionnaireScore, 
                      max: 40, 
                      percent: questionnairePercent,
                      description: "Experience level, training history, and fitness goals" 
                    },
                    { 
                      label: "Recovery Status", 
                      val: recoveryScore, 
                      max: 12, 
                      percent: recoveryPercent,
                      description: "Sleep quality, stress levels, and overall recovery" 
                    },
                  ].map((s, idx) => (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + idx * 0.1 }}
                      className="group rounded-xl border border-border/50 bg-muted/30 p-4 hover:border-primary/30 hover:bg-muted/50 transition-all"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <p className="font-semibold text-foreground text-base">{s.label}</p>
                          <p className="text-xs text-muted-foreground mt-1">{s.description}</p>
                        </div>
                        <span className="font-heading text-lg font-bold text-primary ml-4 whitespace-nowrap">{s.val}/{s.max}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={s.percent} className="h-2.5 flex-1" />
                        <span className="text-xs font-semibold text-muted-foreground w-12 text-right">{Math.round(s.percent)}%</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Call-to-Actions Sidebar */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.25 }}
                className="rounded-3xl border border-border bg-gradient-to-br from-primary/10 to-primary/5 p-6 h-fit shadow-soft"
              >
                <h3 className="font-heading text-xl font-bold text-foreground mb-5 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Quick Actions
                </h3>

                <div className="space-y-3 flex flex-col">
                  {/* View Results - Primary CTA */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      size="lg"
                      className="w-full h-12 font-bold shadow-lg shadow-primary/30 text-base gap-2"
                      onClick={() => navigate("/results")}
                    >
                      <FileText className="h-5 w-5" />
                      View Full Results
                    </Button>
                  </motion.div>

                  {/* Secondary CTAs */}


                  <Button 
                    variant="outline" 
                    className="w-full h-11 font-medium border-border hover:border-primary/50 hover:bg-primary/5 gap-2" 
                    onClick={() => navigate("/assessment")}
                  >
                    <Target className="h-4 w-4" /> 
                    Retake Assessment
                  </Button>


                </div>

                {/* Info Box */}
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className="font-semibold text-foreground">Pro Tip:</span> View your full results to see detailed insights, injury flags, and personalized recommendations.
                  </p>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
