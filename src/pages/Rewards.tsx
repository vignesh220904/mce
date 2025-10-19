import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Gift,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Profile {
  points_balance: number;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  category: string;
  cost_points: number;
  icon_name: string;
  color: string;
}

interface Transaction {
  title: string;
  points_change: number;
  transaction_type: string;
  status: string;
  created_at: string;
}

const Rewards = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [redeeming, setRedeeming] = useState<string | null>(null);

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
      await fetchData(user.id);
      setLoading(false);
    };

    checkUser();
  }, [navigate]);

  const fetchData = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("points_balance")
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
          .select("points_balance")
          .single();
          
        if (createError) throw createError;
        setProfile(newProfile);
      } else {
        setProfile(profileData);
      }

      // Fetch rewards
      const { data: rewardsData, error: rewardsError } = await supabase
        .from("rewards")
        .select("*")
        .eq("available", true)
        .order("cost_points", { ascending: true });

      if (rewardsError) throw rewardsError;
      setRewards(rewardsData || []);

      // Fetch transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (transactionsError) throw transactionsError;
      setTransactions(transactionsData || []);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load rewards data",
        variant: "destructive",
      });
    }
  };

  const handleRedeem = async (rewardId: string, rewardTitle: string, cost: number) => {
    if (!user || !profile) return;

    if (profile.points_balance < cost) {
      toast({
        title: "Insufficient Points",
        description: "You don't have enough points to redeem this reward.",
        variant: "destructive",
      });
      return;
    }

    setRedeeming(rewardId);

    try {
      // Create transaction
      const { error: transactionError } = await supabase.from("transactions").insert({
        user_id: user.id,
        title: rewardTitle,
        points_change: -cost,
        transaction_type: "redeem",
        status: "completed",
      });

      if (transactionError) throw transactionError;

      // Update profile balance
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          points_balance: profile.points_balance - cost,
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      toast({
        title: "Reward Redeemed! 🎉",
        description: "Check your email for instructions on claiming your reward.",
      });

      // Refresh data
      await fetchData(user.id);
    } catch (error: any) {
      console.error("Error redeeming reward:", error);
      toast({
        title: "Error",
        description: "Failed to redeem reward. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRedeeming(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                MCE
              </span>
            </div>
          </div>
          <Card className="px-6 py-3 bg-gradient-primary">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-white" />
              <div className="text-white">
                <div className="text-sm opacity-90">Your Balance</div>
                <div className="text-2xl font-bold">{profile?.points_balance || 0} Points</div>
              </div>
            </div>
          </Card>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Gift className="h-10 w-10 text-primary" />
            Rewards Marketplace
          </h1>
          <p className="text-muted-foreground text-lg">
            Redeem your earned points for exclusive rewards
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Available Rewards */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Available Rewards</h2>
            {rewards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rewards.map((reward) => (
                  <Card
                    key={reward.id}
                    className="p-6 hover:shadow-glow transition-all group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-${reward.color}/10 group-hover:scale-110 transition-transform`}>
                        <Gift className={`h-8 w-8 text-${reward.color}`} />
                      </div>
                      <Badge className={`bg-${reward.color}/10 text-${reward.color}`}>
                        {reward.category}
                      </Badge>
                    </div>

                    <h3 className="text-xl font-bold mb-2">{reward.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {reward.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Sparkles className={`h-4 w-4 text-${reward.color}`} />
                        <span className="font-bold">{reward.cost_points} Points</span>
                      </div>
                      <Button
                        className="bg-gradient-primary hover:shadow-glow"
                        disabled={
                          (profile?.points_balance || 0) < reward.cost_points ||
                          redeeming === reward.id
                        }
                        onClick={() => handleRedeem(reward.id, reward.title, reward.cost_points)}
                      >
                        {redeeming === reward.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Redeeming...
                          </>
                        ) : (
                          "Redeem"
                        )}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No rewards available at the moment.</p>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Transaction History */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Transaction History</h3>
              {transactions.length > 0 ? (
                <div className="space-y-3">
                  {transactions.map((transaction, idx) => (
                    <div key={idx} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-start justify-between mb-1">
                        <div className="font-medium text-sm">{transaction.title}</div>
                        <div
                          className={`font-bold ${
                            transaction.transaction_type === "earn"
                              ? "text-success"
                              : "text-muted-foreground"
                          }`}
                        >
                          {transaction.points_change > 0 ? "+" : ""}
                          {transaction.points_change}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          {formatDate(transaction.created_at)}
                        </div>
                        {transaction.status === "completed" && (
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No transactions yet.</p>
              )}
            </Card>

            {/* Earn More Points */}
            <Card className="p-6 bg-primary/10 border-primary/20">
              <h3 className="text-xl font-bold mb-4">Earn More Points</h3>
              <div className="space-y-3">
                <div className="p-3 bg-background rounded-lg">
                  <div className="font-medium mb-1">Complete Courses</div>
                  <div className="text-sm text-muted-foreground">+100 points each</div>
                </div>
                <div className="p-3 bg-background rounded-lg">
                  <div className="font-medium mb-1">Earn Badges</div>
                  <div className="text-sm text-muted-foreground">+50-200 points each</div>
                </div>
                <div className="p-3 bg-background rounded-lg">
                  <div className="font-medium mb-1">Daily Streaks</div>
                  <div className="text-sm text-muted-foreground">+20 points/day</div>
                </div>
              </div>
              <Button className="w-full mt-4 bg-gradient-primary" onClick={() => navigate("/dashboard")}>
                Back to Learning
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rewards;
