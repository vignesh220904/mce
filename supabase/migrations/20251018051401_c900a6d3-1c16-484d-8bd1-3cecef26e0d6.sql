-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  points_balance INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  total_badges INTEGER DEFAULT 0,
  avg_score DECIMAL(5,2) DEFAULT 0,
  global_rank INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create badges table
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon_name TEXT NOT NULL,
  category TEXT NOT NULL,
  points_reward INTEGER DEFAULT 50,
  color TEXT DEFAULT 'primary',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_badges table (junction table)
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Create learning_progress table
CREATE TABLE public.learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_name TEXT NOT NULL,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  time_spent_minutes INTEGER DEFAULT 0,
  last_accessed TIMESTAMPTZ DEFAULT NOW(),
  weak_concepts TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_name)
);

-- Create rewards table
CREATE TABLE public.rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  cost_points INTEGER NOT NULL,
  icon_name TEXT DEFAULT 'Gift',
  color TEXT DEFAULT 'primary',
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  points_change INTEGER NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earn', 'redeem')),
  status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create ai_suggestions table
CREATE TABLE public.ai_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  suggestion_text TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('focus_area', 'learning_tip', 'course_recommendation')),
  priority INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_suggestions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for badges (public read, admin write)
CREATE POLICY "Anyone can view badges"
  ON public.badges FOR SELECT
  USING (true);

-- RLS Policies for user_badges
CREATE POLICY "Users can view their own earned badges"
  ON public.user_badges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can earn badges"
  ON public.user_badges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for learning_progress
CREATE POLICY "Users can view their own progress"
  ON public.learning_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.learning_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON public.learning_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for rewards
CREATE POLICY "Anyone can view available rewards"
  ON public.rewards FOR SELECT
  USING (available = true);

-- RLS Policies for transactions
CREATE POLICY "Users can view their own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for ai_suggestions
CREATE POLICY "Users can view their own AI suggestions"
  ON public.ai_suggestions FOR SELECT
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, points_balance, current_streak)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Learner'),
    NEW.email,
    0,
    0
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert default badges
INSERT INTO public.badges (name, description, icon_name, category, points_reward, color) VALUES
  ('Quick Learner', 'Complete your first course module in record time', 'Zap', 'learning', 50, 'warning'),
  ('Problem Solver', 'Master complex concepts and ace challenging tests', 'Brain', 'achievement', 100, 'primary'),
  ('Streak Master', 'Maintain a 7-day learning streak', 'Flame', 'consistency', 150, 'secondary'),
  ('Top Performer', 'Rank in the top 10% of all learners', 'Trophy', 'excellence', 200, 'accent'),
  ('Course Completer', 'Successfully complete an entire course', 'Award', 'milestone', 100, 'success'),
  ('Early Bird', 'Start learning before 8 AM for 5 consecutive days', 'Sunrise', 'discipline', 75, 'warning');

-- Insert default rewards
INSERT INTO public.rewards (title, description, category, cost_points, icon_name, color) VALUES
  ('20% Off Advanced React Course', 'Unlock advanced React patterns and best practices', 'Course Discount', 150, 'Book', 'primary'),
  ('1-on-1 Mentorship Session', '60-minute session with an industry expert', 'Mentorship', 300, 'Users', 'secondary'),
  ('Premium Features (1 Month)', 'Access to all premium learning content', 'Subscription', 200, 'Star', 'accent'),
  ('Fast-Track Certification', 'Skip the waiting period for your next certification', 'Certification', 250, 'Clock', 'warning'),
  ('Data Pack Top-Up (2GB)', 'Stay connected while learning on the go', 'Data', 100, 'Wifi', 'accent'),
  ('Personal Learning Mentor', '30-day access to a dedicated learning coach', 'Mentorship', 500, 'UserCheck', 'primary');

-- Insert sample learning progress courses
INSERT INTO public.learning_progress (user_id, course_name, progress_percentage, time_spent_minutes, weak_concepts)
SELECT 
  auth.uid(),
  course,
  0,
  0,
  ARRAY[]::TEXT[]
FROM (
  VALUES 
    ('React Fundamentals'),
    ('JavaScript Advanced'),
    ('TypeScript Basics'),
    ('Data Structures & Algorithms'),
    ('System Design'),
    ('Web Development Complete')
) AS courses(course)
WHERE auth.uid() IS NOT NULL;