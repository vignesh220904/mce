import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  GraduationCap,
  Trophy,
  Flame,
  TrendingUp,
  Award,
  Brain,
  Zap,
  LogOut,
  Gift,
  Users,
  Target,
  CheckCircle2,
  Loader2,
  BookOpen,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Profile {
  full_name: string;
  points_balance: number;
  current_streak: number;
  total_badges: number;
  avg_score: number;
  global_rank: number | null;
}

interface LearningProgress {
  course_name: string;
  progress_percentage: number;
}

interface UserBadge {
  badges: {
    name: string;
    icon_name: string;
    color: string;
  };
}

interface AISuggestion {
  suggestion_text: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<LearningProgress[]>([]);
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [generatingAI, setGeneratingAI] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUser(user);
      await fetchUserData(user.id);
      setLoading(false);
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (profileError) throw profileError;
      
      // If profile doesn't exist, create it
      if (!profileData) {
        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert({
            id: userId,
            full_name: user?.user_metadata?.full_name || "Learner",
            email: user?.email,
          })
          .select()
          .single();
          
        if (createError) throw createError;
        setProfile(newProfile);
      } else {
        setProfile(profileData);
      }

      // Fetch learning progress
      const { data: progressData, error: progressError } = await supabase
        .from("learning_progress")
        .select("course_name, progress_percentage")
        .eq("user_id", userId)
        .order("progress_percentage", { ascending: false })
        .limit(3);

      if (progressError) throw progressError;
      setProgress(progressData || []);

      // Fetch user badges
      const { data: badgesData, error: badgesError } = await supabase
        .from("user_badges")
        .select("badges(name, icon_name, color)")
        .eq("user_id", userId);

      if (badgesError) throw badgesError;
      setBadges(badgesData || []);

      // Fetch AI suggestions
      const { data: suggestionsData, error: suggestionsError } = await supabase
        .from("ai_suggestions")
        .select("suggestion_text")
        .eq("user_id", userId)
        .order("priority", { ascending: true })
        .limit(3);

      if (suggestionsError) throw suggestionsError;
      setAiSuggestions(suggestionsData || []);
    } catch (error: any) {
      console.error("Error fetching user data:", error);
      toast({
        title: "Error",
        description: "Failed to load user data",
        variant: "destructive",
      });
    }
  };

  const handleGenerateAISuggestions = async () => {
    if (!user) return;

    setGeneratingAI(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { data, error } = await supabase.functions.invoke("generate-learning-suggestions", {
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });

      if (error) throw error;

      toast({
        title: "AI Suggestions Generated! 🤖",
        description: "Your personalized learning tips are ready.",
      });

      // Refresh suggestions
      const { data: suggestionsData } = await supabase
        .from("ai_suggestions")
        .select("suggestion_text")
        .eq("user_id", user.id)
        .order("priority", { ascending: true })
        .limit(3);

      if (suggestionsData) {
        setAiSuggestions(suggestionsData);
      }
    } catch (error: any) {
      console.error("Error generating AI suggestions:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate AI suggestions",
        variant: "destructive",
      });
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Mock data for badges not yet earned
  const allBadges = [
    { name: "Quick Learner", icon: Zap, color: "text-warning", earned: badges.length > 0 },
    { name: "Problem Solver", icon: Brain, color: "text-primary", earned: badges.length > 1 },
    { name: "Streak Master", icon: Flame, color: "text-secondary", earned: badges.length > 2 },
    { name: "Top Performer", icon: Trophy, color: "text-accent", earned: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              MCE
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/rewards")}
              className="flex items-center gap-2"
            >
              <Gift className="h-5 w-5" />
              Rewards
            </Button>
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {profile?.full_name || "Learner"}!
          </h1>
          <p className="text-muted-foreground">
            Keep up the great work. You're on a {profile?.current_streak || 0}-day learning streak! 🔥
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-card hover:shadow-elegant transition-all">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="h-8 w-8 text-warning" />
              <Badge className="bg-warning/10 text-warning">
                {badges.length > 0 ? `+${badges.length}` : "Start"}
              </Badge>
            </div>
            <div className="text-3xl font-bold mb-1">{profile?.total_badges || 0}</div>
            <div className="text-sm text-muted-foreground">Badges Earned</div>
          </Card>

          <Card className="p-6 bg-gradient-card hover:shadow-elegant transition-all">
            <div className="flex items-center justify-between mb-2">
              <Flame className="h-8 w-8 text-secondary" />
              <Badge className="bg-secondary/10 text-secondary">
                {(profile?.current_streak || 0) > 0 ? "Hot!" : "Start"}
              </Badge>
            </div>
            <div className="text-3xl font-bold mb-1">{profile?.current_streak || 0}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </Card>

          <Card className="p-6 bg-gradient-card hover:shadow-elegant transition-all">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-8 w-8 text-accent" />
              <Badge className="bg-accent/10 text-accent">Track</Badge>
            </div>
            <div className="text-3xl font-bold mb-1">{profile?.avg_score?.toFixed(0) || 0}%</div>
            <div className="text-sm text-muted-foreground">Avg. Score</div>
          </Card>

          <Card className="p-6 bg-gradient-card hover:shadow-elegant transition-all">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-8 w-8 text-primary" />
              <Badge className="bg-primary/10 text-primary">Rank</Badge>
            </div>
            <div className="text-3xl font-bold mb-1">
              #{profile?.global_rank || "---"}
            </div>
            <div className="text-sm text-muted-foreground">Global Rank</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Learning Progress */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                Learning Progress
              </h2>
              {progress.length > 0 ? (
                <div className="space-y-4">
                  {progress.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{item.course_name}</span>
                        <span className="text-muted-foreground">{item.progress_percentage}%</span>
                      </div>
                      <Progress value={item.progress_percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    No courses started yet. Begin your learning journey!
                  </p>
                  <Button
                    className="bg-gradient-primary hover:shadow-glow"
                    onClick={() => navigate("/courses")}
                  >
                    <BookOpen className="mr-2 h-5 w-5" />
                    Browse Courses
                  </Button>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Trophy className="h-6 w-6 text-warning" />
                Badge Collection
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {allBadges.map((badge, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border ${
                      badge.earned
                        ? "bg-gradient-card border-primary/20"
                        : "bg-muted/50 border-border opacity-50"
                    } flex flex-col items-center text-center hover:scale-105 transition-transform`}
                  >
                    <badge.icon className={`h-8 w-8 ${badge.color} mb-2`} />
                    <div className="text-xs font-medium">{badge.name}</div>
                    {badge.earned && (
                      <CheckCircle2 className="h-4 w-4 text-success mt-1" />
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-primary">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Brain className="h-6 w-6" />
                AI Coach Insights
              </h3>
              <div className="space-y-3">
                {aiSuggestions.length > 0 ? (
                  aiSuggestions.map((suggestion, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white/10 rounded-lg text-white text-sm backdrop-blur-sm"
                    >
                      {suggestion.suggestion_text}
                    </div>
                  ))
                ) : (
                  <div className="p-3 bg-white/10 rounded-lg text-white text-sm backdrop-blur-sm">
                    Click below to get personalized AI recommendations based on your learning!
                  </div>
                )}
              </div>
              <Button
                className="w-full mt-4 bg-white text-primary hover:bg-white/90"
                onClick={handleGenerateAISuggestions}
                disabled={generatingAI}
              >
                {generatingAI ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate AI Suggestions"
                )}
              </Button>
            </Card>

            <Card className="p-6 bg-accent/10 border-accent/20">
              <Award className="h-12 w-12 text-accent mb-3" />
              <h3 className="text-xl font-bold mb-2">Blockchain Verified</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Your credentials are permanently recorded on the blockchain and can be verified by employers.
              </p>
              <Badge className="bg-success/10 text-success border-success/20">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
