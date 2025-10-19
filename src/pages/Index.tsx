import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Trophy, 
  Zap, 
  Shield, 
  Users, 
  TrendingUp,
  GraduationCap,
  Rocket,
  Award,
  Brain,
  Lock,
  Globe
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">MCE</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#about" className="text-foreground/70 hover:text-primary transition-colors">About</a>
            <a href="#features" className="text-foreground/70 hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-foreground/70 hover:text-primary transition-colors">How It Works</a>
            <a href="#testimonials" className="text-foreground/70 hover:text-primary transition-colors">Testimonials</a>
          </div>
          <Link to="/auth">
            <Button className="bg-gradient-primary hover:shadow-glow transition-all">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 animate-fade-in">
            <Sparkles className="h-3 w-3 mr-1" />
            Powered by AI & Blockchain
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up bg-gradient-hero bg-clip-text text-transparent">
            Learn Smarter,
            <br />
            Earn Credentials That Matter
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up">
            MCE revolutionizes education with AI-powered personalized learning, blockchain-backed micro-credentials, and a rewarding gamified experience.
          </p>
          <div className="flex gap-4 justify-center animate-fade-in-up">
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-primary hover:shadow-glow transition-all">
                <Rocket className="mr-2 h-5 w-5" />
                Start Learning Free
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
            <Card className="p-6 bg-gradient-card border-primary/20 shadow-elegant animate-scale-in">
              <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-muted-foreground">Active Learners</div>
            </Card>
            <Card className="p-6 bg-gradient-card border-secondary/20 shadow-elegant animate-scale-in" style={{ animationDelay: "0.1s" }}>
              <div className="text-3xl font-bold text-secondary mb-2">5,000+</div>
              <div className="text-muted-foreground">Credentials Issued</div>
            </Card>
            <Card className="p-6 bg-gradient-card border-accent/20 shadow-elegant animate-scale-in" style={{ animationDelay: "0.2s" }}>
              <div className="text-3xl font-bold text-accent mb-2">98%</div>
              <div className="text-muted-foreground">Success Rate</div>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What is MCE?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Micro-Credential Exchange is a next-generation learning platform that combines cutting-edge AI, blockchain technology, and gamification to create the ultimate personalized education experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-glow transition-all group">
              <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">AI-Powered Learning</h3>
              <p className="text-muted-foreground">
                Our AI coach analyzes your learning patterns, identifies weak concepts, and provides personalized recommendations to optimize your study path.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-glow transition-all group">
              <div className="bg-secondary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Lock className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Blockchain Credentials</h3>
              <p className="text-muted-foreground">
                Earn verifiable micro-credentials stored on the blockchain. Your achievements are permanent, portable, and universally recognized.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-glow transition-all group">
              <div className="bg-accent/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Trophy className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Reward System</h3>
              <p className="text-muted-foreground">
                Exchange your earned badges for real rewards: course discounts, mentorship sessions, partner offers, and exclusive opportunities.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Start your learning journey in four simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Users, title: "Sign Up", desc: "Create your free account in seconds", color: "primary" },
              { icon: Brain, title: "Learn", desc: "AI personalizes content to your needs", color: "secondary" },
              { icon: Award, title: "Earn Badges", desc: "Complete modules, earn verified credentials", color: "accent" },
              { icon: Zap, title: "Redeem Rewards", desc: "Exchange badges for real-world benefits", color: "success" }
            ].map((step, idx) => (
              <Card key={idx} className="p-6 text-center hover:shadow-elegant transition-all relative">
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-${step.color} text-${step.color}-foreground flex items-center justify-center font-bold`}>
                  {idx + 1}
                </div>
                <div className={`bg-${step.color}/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 mt-4`}>
                  <step.icon className={`h-8 w-8 text-${step.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Platform Features</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need for a modern learning experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: TrendingUp, title: "Progress Tracking", desc: "Monitor your learning journey with detailed analytics" },
              { icon: Users, title: "Peer Comparison", desc: "See how you rank against fellow learners" },
              { icon: Trophy, title: "Leaderboards", desc: "Compete and climb the global rankings" },
              { icon: Sparkles, title: "Streak System", desc: "Build momentum with daily learning streaks" },
              { icon: Shield, title: "Verified Badges", desc: "Blockchain-backed achievement verification" },
              { icon: Globe, title: "Offline Support", desc: "Learn anywhere, even without internet" }
            ].map((feature, idx) => (
              <Card key={idx} className="p-6 hover:shadow-glow transition-all group">
                <feature.icon className="h-10 w-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What Learners Say</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join thousands of successful learners worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Chen", role: "Software Engineer", quote: "MCE's AI coach helped me master React in half the time. The blockchain credentials landed me my dream job!" },
              { name: "Marcus Rodriguez", role: "Data Scientist", quote: "The gamification kept me motivated every day. I've earned 50+ verified badges and redeemed them for advanced courses." },
              { name: "Aisha Patel", role: "UX Designer", quote: "Finally, a platform that adapts to MY learning style. The personalized recommendations are spot-on!" }
            ].map((testimonial, idx) => (
              <Card key={idx} className="p-8 hover:shadow-elegant transition-all">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Sparkles key={i} className="h-4 w-4 text-warning fill-warning" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-primary" />
                  <div>
                    <div className="font-bold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-hero">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Join MCE today and start earning verifiable credentials while learning at your own pace.
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all">
              <Rocket className="mr-2 h-5 w-5" />
              Start Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">MCE</span>
              </div>
              <p className="text-muted-foreground">
                Revolutionizing education with AI and blockchain technology.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <div className="space-y-2">
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Dashboard</a>
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Courses</a>
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Rewards</a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <div className="space-y-2">
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">About</a>
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Blog</a>
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Careers</a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <div className="space-y-2">
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Help Center</a>
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Contact</a>
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Privacy</a>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-muted-foreground">
            <p>© 2025 MCE Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
