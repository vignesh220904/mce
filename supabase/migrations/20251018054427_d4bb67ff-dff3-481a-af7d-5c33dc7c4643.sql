-- Add Python course lessons
INSERT INTO lessons (course_id, title, content, lesson_order, duration_minutes, quiz_data)
SELECT 
  'd3db527a-2668-47e6-a387-80f224abdeaf',
  title,
  content,
  lesson_order,
  duration_minutes,
  quiz_data::jsonb
FROM (VALUES
  ('Introduction to Python', 'Python is a versatile, high-level programming language known for its simplicity and readability. In this lesson, you''ll learn about Python''s history, its applications in web development, data science, automation, and more. We''ll cover how to install Python, set up your development environment, and write your first "Hello, World!" program.', 1, 15, '{"questions":[{"question":"What is Python primarily known for?","options":["Complexity","Readability","Speed","Size"],"correctAnswer":1},{"question":"Which of these is NOT a common Python application?","options":["Web Development","Data Science","Operating Systems","Automation"],"correctAnswer":2}]}'),
  ('Variables and Data Types', 'Learn about Python''s fundamental data types including strings, integers, floats, and booleans. Understand how to declare variables, perform type conversion, and use the type() function. We''ll explore Python''s dynamic typing system and best practices for naming variables.', 2, 20, '{"questions":[{"question":"Which is NOT a basic Python data type?","options":["string","integer","character","boolean"],"correctAnswer":2},{"question":"How do you check a variable''s type?","options":["typeof()","type()","getType()","varType()"],"correctAnswer":1}]}'),
  ('Control Flow: If Statements', 'Master conditional logic using if, elif, and else statements. Learn about comparison operators, logical operators (and, or, not), and how to write clean, readable conditions. Practice with real-world examples like user authentication and age verification.', 3, 25, '{"questions":[{"question":"Which operator checks for equality?","options":["=","==","===","eq"],"correctAnswer":1},{"question":"What does ''elif'' stand for?","options":["else if","elevated if","element if","elif"],"correctAnswer":0}]}'),
  ('Loops: For and While', 'Discover how to repeat code execution using for and while loops. Learn about the range() function, iterating over lists, loop control statements (break, continue, pass), and avoiding infinite loops. Practice with examples like counting, summing numbers, and processing collections.', 4, 30, '{"questions":[{"question":"Which loop is best for a known number of iterations?","options":["while","for","do-while","repeat"],"correctAnswer":1},{"question":"What does ''break'' do in a loop?","options":["Pause it","Exit it","Skip iteration","Reset it"],"correctAnswer":1}]}'),
  ('Functions and Modules', 'Learn to write reusable code with functions. Understand function definition, parameters, return values, and scope. Explore Python''s built-in functions and how to import and use modules. Create your own modules and understand the importance of code organization.', 5, 35, '{"questions":[{"question":"How do you define a function in Python?","options":["function name():","def name():","func name():","define name()"],"correctAnswer":1},{"question":"What keyword returns a value from a function?","options":["give","send","return","output"],"correctAnswer":2}]}')
) AS lessons(title, content, lesson_order, duration_minutes, quiz_data)
WHERE NOT EXISTS (
  SELECT 1 FROM lessons WHERE course_id = 'd3db527a-2668-47e6-a387-80f224abdeaf'
);

-- Add Full Stack Development premium course
INSERT INTO courses (id, title, description, category, difficulty_level, is_free, price_points, duration_hours, total_lessons, thumbnail_url)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Full Stack Development',
  'Master the complete web development stack from frontend to backend. Learn React, Node.js, databases, and deployment.',
  'Web Development',
  'advanced',
  false,
  5000,
  40,
  8,
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085'
)
ON CONFLICT (id) DO NOTHING;

-- Add Full Stack Development course lessons
INSERT INTO lessons (course_id, title, content, lesson_order, duration_minutes, quiz_data)
SELECT 
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  title,
  content,
  lesson_order,
  duration_minutes,
  quiz_data::jsonb
FROM (VALUES
  ('Full Stack Architecture Overview', 'Understand the complete architecture of modern web applications. Learn about client-server model, REST APIs, databases, and how frontend and backend communicate. Explore microservices vs monolithic architecture and when to use each approach.', 1, 45, '{"questions":[{"question":"What does REST stand for?","options":["Real Estate Transfer","Representational State Transfer","Remote System Test","Reactive State Transaction"],"correctAnswer":1},{"question":"Which is NOT part of full stack?","options":["Frontend","Backend","Database","Hardware"],"correctAnswer":3}]}'),
  ('Advanced React & State Management', 'Deep dive into React hooks, context API, and state management with Redux. Learn performance optimization techniques, code splitting, and lazy loading. Master React Router for navigation and build scalable component architectures.', 2, 60, '{"questions":[{"question":"Which hook manages side effects?","options":["useState","useEffect","useContext","useMemo"],"correctAnswer":1},{"question":"What is Redux used for?","options":["Routing","State Management","Styling","Testing"],"correctAnswer":1}]}'),
  ('Node.js & Express Backend', 'Build robust backend APIs with Node.js and Express. Learn about middleware, routing, error handling, and authentication. Understand asynchronous programming with async/await and promises. Implement RESTful API best practices.', 3, 50, '{"questions":[{"question":"What is Express?","options":["Database","Framework","Language","Tool"],"correctAnswer":1},{"question":"Which method creates a route?","options":["app.route()","app.get()","app.create()","app.path()"],"correctAnswer":1}]}'),
  ('Database Design & SQL', 'Master relational database design with PostgreSQL. Learn about normalization, relationships, indexes, and query optimization. Understand transactions, ACID properties, and when to use SQL vs NoSQL databases.', 4, 55, '{"questions":[{"question":"What does SQL stand for?","options":["Simple Query Language","Structured Query Language","System Query Logic","Standard Question List"],"correctAnswer":1},{"question":"What is a primary key?","options":["First column","Unique identifier","Foreign reference","Index type"],"correctAnswer":1}]}'),
  ('Authentication & Security', 'Implement secure user authentication with JWT tokens. Learn about password hashing, OAuth, session management, and protecting against common vulnerabilities like SQL injection, XSS, and CSRF attacks.', 5, 45, '{"questions":[{"question":"What is JWT?","options":["Java Web Token","JSON Web Token","Just Web Tech","Join Web Table"],"correctAnswer":1},{"question":"Which hashing algorithm is recommended?","options":["MD5","SHA1","bcrypt","Base64"],"correctAnswer":2}]}'),
  ('Docker & Deployment', 'Learn containerization with Docker. Create Dockerfiles, manage containers, and use Docker Compose for multi-container applications. Deploy applications to cloud platforms like AWS, Heroku, or Vercel.', 6, 50, '{"questions":[{"question":"What is a Docker container?","options":["Storage box","Isolated environment","Cloud service","Database"],"correctAnswer":1},{"question":"What defines a Docker image?","options":["Dockerfile","package.json","index.js","docker.config"],"correctAnswer":0}]}'),
  ('Testing & CI/CD', 'Master testing strategies including unit tests, integration tests, and E2E tests. Set up continuous integration and deployment pipelines with GitHub Actions. Learn test-driven development (TDD) principles.', 7, 40, '{"questions":[{"question":"What is CI/CD?","options":["Code Integration/Deployment","Continuous Integration/Deployment","Container Integration/Dev","Cloud Install/Deploy"],"correctAnswer":1},{"question":"Which tests components individually?","options":["Integration","E2E","Unit","System"],"correctAnswer":2}]}'),
  ('Performance Optimization', 'Optimize full stack applications for speed and scalability. Learn about caching strategies, database indexing, CDN usage, code minification, and monitoring tools. Implement lazy loading and pagination.', 8, 45, '{"questions":[{"question":"What is caching?","options":["Storing data temporarily","Deleting old files","Compressing code","Encrypting data"],"correctAnswer":0},{"question":"Which improves database performance?","options":["More queries","Indexes","Larger tables","Complex joins"],"correctAnswer":1}]}')
) AS lessons(title, content, lesson_order, duration_minutes, quiz_data)
WHERE NOT EXISTS (
  SELECT 1 FROM lessons WHERE course_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
);

-- Update course completion trigger to give 800 points for Python course
CREATE OR REPLACE FUNCTION public.handle_course_completion()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  course_title TEXT;
  course_free BOOLEAN;
  reward_points INTEGER := 200;
BEGIN
  -- Get course details
  SELECT title, is_free INTO course_title, course_free
  FROM courses
  WHERE id = NEW.course_id;

  -- Python course gets 800 points
  IF course_title = 'Python for Beginners' THEN
    reward_points := 800;
  END IF;

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

  -- If Python course completed, unlock Full Stack Development by giving enough points
  IF course_title = 'Python for Beginners' THEN
    -- Give additional points if needed to reach 5000 total
    UPDATE profiles
    SET points_balance = GREATEST(points_balance, 5000)
    WHERE id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$function$;