-- Create courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  is_free BOOLEAN DEFAULT TRUE,
  price_points INTEGER DEFAULT 0,
  duration_hours INTEGER DEFAULT 0,
  thumbnail_url TEXT,
  total_lessons INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create lessons table
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  lesson_order INTEGER NOT NULL,
  duration_minutes INTEGER DEFAULT 10,
  quiz_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, lesson_order)
);

-- Create user_course_enrollments table
CREATE TABLE public.user_course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  current_lesson_order INTEGER DEFAULT 1,
  UNIQUE(user_id, course_id)
);

-- Create user_lesson_completions table
CREATE TABLE public.user_lesson_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  quiz_score INTEGER,
  time_spent_minutes INTEGER DEFAULT 0,
  UNIQUE(user_id, lesson_id)
);

-- Enable RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lesson_completions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for courses
CREATE POLICY "Anyone can view courses"
  ON public.courses FOR SELECT
  USING (true);

-- RLS Policies for lessons
CREATE POLICY "Anyone can view lessons of courses"
  ON public.lessons FOR SELECT
  USING (true);

-- RLS Policies for enrollments
CREATE POLICY "Users can view their own enrollments"
  ON public.user_course_enrollments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll in courses"
  ON public.user_course_enrollments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their enrollments"
  ON public.user_course_enrollments FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for lesson completions
CREATE POLICY "Users can view their own lesson completions"
  ON public.user_lesson_completions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can mark lessons complete"
  ON public.user_lesson_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Insert free courses
INSERT INTO public.courses (title, description, category, difficulty_level, is_free, total_lessons, duration_hours) VALUES
  ('JavaScript Fundamentals', 'Master the basics of JavaScript programming from scratch', 'Programming', 'beginner', true, 8, 6),
  ('HTML & CSS Basics', 'Learn to build beautiful websites with HTML and CSS', 'Web Development', 'beginner', true, 6, 4),
  ('Python for Beginners', 'Start your programming journey with Python', 'Programming', 'beginner', true, 10, 8),
  ('Data Structures 101', 'Understanding fundamental data structures', 'Computer Science', 'intermediate', true, 12, 10),
  ('Git & GitHub Essentials', 'Version control and collaboration basics', 'Tools', 'beginner', true, 5, 3);

-- Insert paid courses
INSERT INTO public.courses (title, description, category, difficulty_level, is_free, price_points, total_lessons, duration_hours) VALUES
  ('React Advanced Patterns', 'Master advanced React concepts and best practices', 'Web Development', 'advanced', false, 500, 15, 20),
  ('Full-Stack Development', 'Build complete web applications from frontend to backend', 'Web Development', 'advanced', false, 800, 25, 40),
  ('Machine Learning Fundamentals', 'Introduction to ML algorithms and applications', 'AI/ML', 'intermediate', false, 600, 20, 30),
  ('System Design Masterclass', 'Design scalable distributed systems', 'System Design', 'advanced', false, 700, 18, 25),
  ('TypeScript Complete Guide', 'From basics to advanced TypeScript patterns', 'Programming', 'intermediate', false, 400, 12, 15);

-- Insert lessons for JavaScript Fundamentals course
INSERT INTO public.lessons (course_id, title, content, lesson_order, duration_minutes, quiz_data)
SELECT 
  c.id,
  lesson.title,
  lesson.content,
  lesson.lesson_order,
  lesson.duration_minutes,
  lesson.quiz_data::jsonb
FROM public.courses c
CROSS JOIN (
  VALUES
    ('Introduction to JavaScript', 'JavaScript is a versatile programming language used for web development. In this lesson, you''ll learn about variables, data types, and basic syntax.', 1, 30, '{"questions": [{"question": "What keyword is used to declare a variable in JavaScript?", "options": ["var", "int", "string", "variable"], "correct": 0}]}'),
    ('Functions and Scope', 'Learn how to create reusable code with functions and understand variable scope in JavaScript.', 2, 40, '{"questions": [{"question": "What is a function in JavaScript?", "options": ["A variable", "A reusable block of code", "A data type", "An operator"], "correct": 1}]}'),
    ('Arrays and Objects', 'Discover how to work with arrays and objects, two fundamental data structures in JavaScript.', 3, 45, '{"questions": [{"question": "How do you create an array in JavaScript?", "options": ["array()", "[]", "{}", "new Array"], "correct": 1}]}'),
    ('Loops and Conditionals', 'Control program flow with if statements, loops, and logical operators.', 4, 35, '{"questions": [{"question": "Which loop is used to iterate over arrays?", "options": ["if", "for", "function", "var"], "correct": 1}]}'),
    ('DOM Manipulation', 'Learn to interact with HTML elements using JavaScript and the Document Object Model.', 5, 50, '{"questions": [{"question": "What does DOM stand for?", "options": ["Data Object Model", "Document Object Model", "Digital Object Model", "Document Order Method"], "correct": 1}]}'),
    ('Events and Callbacks', 'Handle user interactions with event listeners and callback functions.', 6, 40, '{"questions": [{"question": "What is an event listener?", "options": ["A type of variable", "A function that responds to events", "A loop", "A data structure"], "correct": 1}]}'),
    ('Async JavaScript', 'Master asynchronous programming with promises and async/await.', 7, 55, '{"questions": [{"question": "What is a Promise in JavaScript?", "options": ["A loop", "An async operation result", "A variable type", "A function"], "correct": 1}]}'),
    ('Final Project', 'Build a complete interactive web application using everything you''ve learned.', 8, 90, '{"questions": [{"question": "Which concept is NOT covered in this course?", "options": ["Functions", "Arrays", "Machine Learning", "DOM"], "correct": 2}]}')
) AS lesson(title, content, lesson_order, duration_minutes, quiz_data)
WHERE c.title = 'JavaScript Fundamentals';

-- Insert lessons for HTML & CSS Basics
INSERT INTO public.lessons (course_id, title, content, lesson_order, duration_minutes, quiz_data)
SELECT 
  c.id,
  lesson.title,
  lesson.content,
  lesson.lesson_order,
  lesson.duration_minutes,
  lesson.quiz_data::jsonb
FROM public.courses c
CROSS JOIN (
  VALUES
    ('HTML Structure', 'Learn the basic structure of HTML documents and essential tags.', 1, 30, '{"questions": [{"question": "What does HTML stand for?", "options": ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlinks and Text"], "correct": 0}]}'),
    ('CSS Styling Basics', 'Introduction to CSS selectors, properties, and values.', 2, 40, '{"questions": [{"question": "What does CSS stand for?", "options": ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"], "correct": 1}]}'),
    ('Flexbox Layout', 'Master modern layouts with CSS Flexbox.', 3, 45, '{"questions": [{"question": "Which property enables Flexbox?", "options": ["display: flex", "flex: box", "layout: flex", "flexbox: on"], "correct": 0}]}'),
    ('Responsive Design', 'Build websites that work on all devices with media queries.', 4, 50, '{"questions": [{"question": "What are media queries used for?", "options": ["Styling forms", "Responsive design", "Animations", "Colors"], "correct": 1}]}'),
    ('CSS Grid', 'Create complex layouts with CSS Grid system.', 5, 45, '{"questions": [{"question": "CSS Grid is best for?", "options": ["Text styling", "2D layouts", "Animations", "Forms"], "correct": 1}]}'),
    ('Build a Portfolio', 'Create your own portfolio website from scratch.', 6, 90, '{"questions": [{"question": "Which is NOT a benefit of a portfolio?", "options": ["Showcase work", "Demonstrate skills", "Replace all resumes", "Attract clients"], "correct": 2}]}')
) AS lesson(title, content, lesson_order, duration_minutes, quiz_data)
WHERE c.title = 'HTML & CSS Basics';

-- Create function to award course completion rewards
CREATE OR REPLACE FUNCTION public.handle_course_completion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  course_title TEXT;
  reward_points INTEGER := 200;
BEGIN
  -- Get course title
  SELECT title INTO course_title
  FROM courses
  WHERE id = NEW.course_id;

  -- Award points
  UPDATE profiles
  SET points_balance = points_balance + reward_points,
      total_badges = total_badges + 1
  WHERE id = NEW.user_id;

  -- Create transaction record
  INSERT INTO transactions (user_id, title, points_change, transaction_type, status)
  VALUES (
    NEW.user_id,
    'Completed: ' || course_title,
    reward_points,
    'earn',
    'completed'
  );

  -- Award Course Completer badge if not already earned
  INSERT INTO user_badges (user_id, badge_id)
  SELECT NEW.user_id, b.id
  FROM badges b
  WHERE b.name = 'Course Completer'
  ON CONFLICT (user_id, badge_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Create trigger for course completion
CREATE TRIGGER on_course_completed
  AFTER UPDATE OF completed_at ON user_course_enrollments
  FOR EACH ROW
  WHEN (NEW.completed_at IS NOT NULL AND OLD.completed_at IS NULL)
  EXECUTE FUNCTION public.handle_course_completion();

-- Enable realtime for course progress
ALTER PUBLICATION supabase_realtime ADD TABLE user_course_enrollments;
ALTER PUBLICATION supabase_realtime ADD TABLE user_lesson_completions;